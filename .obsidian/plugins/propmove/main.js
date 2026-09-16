const {
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  TFolder,
  normalizePath,
  Notice,
  Command,
  Modal
} = require("obsidian");

const DEFAULT_SETTINGS = {
  properties: [],
  autoAppendSuffix: true,
  ignoreFolders: [],
  moveOnCreate: true,
  moveOnMetadataChange: true,
  moveOnStartup: true,
  automaticTriggers: true,
  debugLogging: false,
  processExistingFiles: false,
  processingDelay: 150,
  maxFilesPerBatch: 0,
  caseInsensitiveMatching: false,
  autoCreateFolders: true,
  showRibbonIcon: true,
  undoCheckpoints: [],
  undoMaxCheckpoints: 10,
  undoAutoCooldownMs: 2000,
  notificationMode: "onMove"
};

/**
 * FileProcessor handles the logic of moving files based on property rules
 */
class FileProcessor {
  constructor(app, settings, logger) {
    this.app = app;
    this.settings = settings;
    this.logger = logger;
  }

  /**
   * Determines the target folder for a file based on property mappings
   * @returns {{targetFolder: string, ruleName: string, ruleValue: string}|null}
   */
  findTargetFolder(frontmatter) {
    const groups = Array.isArray(this.settings.properties) ? this.settings.properties : [];

    for (const group of groups) {
      const propName = String(group.name || "").trim();
      if (!propName) continue;

      const rawValue = frontmatter[propName];
      if (rawValue === null || rawValue === undefined) continue;

      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      const normalizedValues = values
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0);

      if (normalizedValues.length === 0) continue;

      const mappings = Array.isArray(group.mappings) ? group.mappings : [];
      const mapping = this.findMatchingMapping(mappings, normalizedValues, rawValue, propName);

      if (mapping) {
        const targetFolder = String(mapping.folder || "").trim();
        if (targetFolder) {
          return {
            targetFolder,
            ruleName: propName,
            ruleValue: normalizedValues[0]
          };
        }
      }
    }

    return null;
  }

  /**
   * Find matching mapping considering case sensitivity setting
   * Supports: wildcard '*', operator field (equals, contains, is-empty, is-not-empty)
   */
  findMatchingMapping(mappings, normalizedValues, rawFrontmatterValue, propName) {
    for (const item of mappings) {
      const operator = (item.operator || "equals").trim();
      const mappingValue = String(item.value || "").trim();

      // --- Presence operators (ignore value field) ---
      if (operator === "is-empty") {
        if (normalizedValues.length === 0) {
          this.logger.debug(`[MATCH] is-empty matched for "${propName}"`);
          return item;
        }
        continue;
      }

      if (operator === "is-not-empty") {
        if (normalizedValues.length > 0) {
          this.logger.debug(`[MATCH] is-not-empty matched for "${propName}"`);
          return item;
        }
        continue;
      }

      // --- Value operators ---
      if (mappingValue.length === 0) continue;

      // Wildcard match - '*' matches any non-empty value
      if (mappingValue === "*") {
        if (normalizedValues.length > 0) {
          this.logger.debug(`[MATCH] Wildcard matched with value: ${normalizedValues[0]}`);
          return item;
        }
        continue;
      }

      let isMatch;
      if (operator === "contains") {
        const check = this.settings.caseInsensitiveMatching
          ? mappingValue.toLowerCase()
          : mappingValue;
        isMatch = normalizedValues.some(v => {
          const val = this.settings.caseInsensitiveMatching ? v.toLowerCase() : v;
          return val.includes(check);
        });
      } else {
        // Default: equals
        isMatch = this.settings.caseInsensitiveMatching
          ? normalizedValues.some(v => v.toLowerCase() === mappingValue.toLowerCase())
          : normalizedValues.includes(mappingValue);
      }

      if (isMatch) return item;
    }
    return null;
  }

  /**
   * Interpolate variables in folder path template
   * Replaces {propertyName} and {file.*} variables with values from frontmatter or file metadata.
   * Supports {file.ctime:yyyy} etc. for date formatting.
   * @param {string} path - Path template with {variable} placeholders
   * @param {Object} frontmatter - Frontmatter object with properties
   * @param {Object} [file] - TFile instance for {file.*} variables
   * @returns {string} Interpolated path
   */
  interpolateVariables(path, frontmatter, file) {
    if (!path || typeof path !== 'string') return path;

    const FILE_VARIABLES = {
      basename:  function(f) { return f.basename; },
      name:      function(f) { return f.name; },
      extension: function(f) { return f.extension; },
      folder:    function(f) { return f.parent ? f.parent.path : ''; },
      path:      function(f) { return f.path; },
      ctime:     function(f) { return new Date(f.stat.ctime); },
      mtime:     function(f) { return new Date(f.stat.mtime); }
    };

    const DATE_FORMATS = {
      yyyy: function(d) { return String(d.getFullYear()); },
      yy:   function(d) { return String(d.getFullYear()).slice(-2); },
      MM:   function(d) { return String(d.getMonth() + 1).padStart(2, '0'); },
      M:    function(d) { return String(d.getMonth() + 1); },
      dd:   function(d) { return String(d.getDate()).padStart(2, '0'); },
      d:    function(d) { return String(d.getDate()); },
      HH:   function(d) { return String(d.getHours()).padStart(2, '0'); },
      mm:   function(d) { return String(d.getMinutes()).padStart(2, '0'); },
      ss:   function(d) { return String(d.getSeconds()).padStart(2, '0'); }
    };

    var that = this;
    return path.replace(/{([\w.:]+)}/g, function(match, token) {
      var parts = token.split(':');
      var key = parts[0];
      var format = parts[1] || null;

      // Handle {file.*} variables
      if (key.indexOf('file.') === 0) {
        var fileKey = key.slice(5); // remove 'file.' prefix
        if (!file || !FILE_VARIABLES[fileKey]) {
          that.logger.debug('[INTERPOLATE] Unknown file variable \'' + fileKey + '\', keeping literal: ' + match);
          return match;
        }
        var resolved = FILE_VARIABLES[fileKey](file);
        if (resolved instanceof Date) {
          if (format && DATE_FORMATS[format]) {
            return DATE_FORMATS[format](resolved);
          }
          // No format given — default to ISO date string (YYYY-MM-DD)
          return DATE_FORMATS['yyyy'](resolved) + '-' + DATE_FORMATS['MM'](resolved) + '-' + DATE_FORMATS['dd'](resolved);
        }
        return String(resolved);
      }

      // Frontmatter lookup (existing behavior)
      var value = frontmatter ? frontmatter[key] : undefined;
      if (value === null || value === undefined) {
        that.logger.debug('[INTERPOLATE] Property \'' + key + '\' not found in frontmatter, keeping literal: ' + match);
        return match;
      }

      var normalized = String(value).trim();
      if (normalized.length === 0) {
        that.logger.debug('[INTERPOLATE] Property \'' + key + '\' is empty, keeping literal: ' + match);
        return match;
      }

      normalized = stripWikiLink(normalized);
      that.logger.debug('[INTERPOLATE] Replaced {' + key + '} with \'' + normalized + '\'');
      return normalized;
    });
  }

  /**
   * Preview what would happen if a file is processed
   * @returns {Object|null} Move preview or null if no move needed
   */
  previewMove(file, frontmatter) {
    if (!frontmatter) {
      this.logger.debug(`[PREVIEW] No frontmatter for ${file.path}`);
      return null;
    }

    const targetResult = this.findTargetFolder(frontmatter);
    if (!targetResult) {
      this.logger.debug(`[PREVIEW] No matching rule for ${file.path}`);
      return null;
    }

    // Interpolate variables in the target folder
    const interpolatedFolder = this.interpolateVariables(targetResult.targetFolder, frontmatter, file);
    const normalizedFolder = normalizePath(interpolatedFolder);
    const targetPath = normalizePath(`${normalizedFolder}/${file.name}`);

    if (file.path === targetPath) {
      this.logger.debug(`[PREVIEW] File already in correct location: ${file.path}`);
      return { action: "skip", reason: "already_in_target" };
    }

    // Check if folder exists
    const folderExists = this.app.vault.getAbstractFileByPath(normalizedFolder) instanceof TFolder;
    if (!folderExists && !this.settings.autoCreateFolders) {
      return {
        action: "skip",
        reason: "folder_not_exist_no_create",
        targetFolder: normalizedFolder,
        template: targetResult.targetFolder,
        interpolated: interpolatedFolder
      };
    }

    const existingTarget = this.app.vault.getAbstractFileByPath(targetPath);
    if (existingTarget) {
      if (this.settings.autoAppendSuffix) {
        return {
          action: "move_with_suffix",
          currentPath: file.path,
          targetPath: targetPath,
          targetFolder: normalizedFolder,
          fileName: file.name,
          template: targetResult.targetFolder,
          interpolated: interpolatedFolder,
          ruleName: targetResult.ruleName,
          ruleValue: targetResult.ruleValue
        };
      } else {
        return {
          action: "skip",
          reason: "target_exists",
          targetPath: targetPath,
          template: targetResult.targetFolder,
          interpolated: interpolatedFolder
        };
      }
    }

    return {
      action: "move",
      currentPath: file.path,
      targetPath: targetPath,
      targetFolder: normalizedFolder,
      template: targetResult.targetFolder,
      interpolated: interpolatedFolder,
      ruleName: targetResult.ruleName,
      ruleValue: targetResult.ruleValue
    };
  }

  /**
   * Execute a file move operation with comprehensive error handling
   */
  async moveFile(file, targetFolder) {
    // Interpolate variables from file's frontmatter
    const cache = this.app.metadataCache.getFileCache(file);
    const frontmatter = cache ? cache.frontmatter : null;
    const interpolatedFolder = frontmatter 
      ? this.interpolateVariables(targetFolder, frontmatter, file)
      : targetFolder;

    const normalizedFolder = normalizePath(interpolatedFolder);
    const targetPath = normalizePath(`${normalizedFolder}/${file.name}`);

    if (file.path === targetPath) {
      this.logger.debug(`File already at target: ${file.path}`);
      return { success: true, action: "none", message: "File already in target location" };
    }

    try {
      // Try to ensure folder exists
      const folderCreated = await this.ensureFolder(normalizedFolder, this.settings.autoCreateFolders);
      
      if (!folderCreated) {
        const msg = `Target folder does not exist and autoCreateFolders is disabled: ${normalizedFolder}`;
        this.logger.debug(msg);
        return { success: false, action: "skip", message: msg };
      }

      const existingTarget = this.app.vault.getAbstractFileByPath(targetPath);
      if (existingTarget) {
        if (this.settings.autoAppendSuffix) {
          const finalPath = await this.generateUniqueFileName(normalizedFolder, file.name);
          await this.app.vault.rename(file, finalPath);
          this.logger.debug(`Moved ${file.path} to ${finalPath} (suffix added)`);
          return { success: true, action: "move_with_suffix", path: finalPath };
        } else {
          const msg = `Target file exists at ${targetPath}`;
          this.logger.debug(msg);
          return { success: false, action: "skip", message: msg };
        }
      } else {
        await this.app.vault.rename(file, targetPath);
        this.logger.debug(`Moved ${file.path} to ${targetPath}`);
        return { success: true, action: "move", path: targetPath };
      }
    } catch (error) {
      this.logger.error(`Failed to move ${file.name}: ${error.message}`);
      return { success: false, action: "error", message: error.message };
    }
  }

  /**
   * Check if a file is in an ignored folder
   */
  isFileInIgnoredFolder(filePath) {
    const ignoreFolders = Array.isArray(this.settings.ignoreFolders)
      ? this.settings.ignoreFolders
      : [];

    const normalizedFilePath = normalizePath(filePath);

    for (const ignoreFolder of ignoreFolders) {
      const normalizedIgnoreFolder = normalizePath(String(ignoreFolder || "").trim());
      if (!normalizedIgnoreFolder) continue;

      if (
        normalizedFilePath.startsWith(normalizedIgnoreFolder + "/") ||
        normalizedFilePath === normalizedIgnoreFolder
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate a unique filename by appending numeric suffixes
   */
  async generateUniqueFileName(folderPath, fileName) {
    const extension = fileName.split(".").pop();
    const baseName = fileName.slice(0, -(extension.length + 1));
    let counter = 1;
    const maxAttempts = 10000;

    while (counter <= maxAttempts) {
      const newFileName = `${baseName} ${counter}.${extension}`;
      const fullPath = normalizePath(`${folderPath}/${newFileName}`);
      const existing = this.app.vault.getAbstractFileByPath(fullPath);

      if (!existing) {
        this.logger.debug(`Generated unique filename: ${fullPath}`);
        return fullPath;
      }

      counter++;
    }

    throw new Error(`Could not generate unique filename after ${maxAttempts} attempts for ${fileName}`);
  }

  /**
   * Ensure a folder exists, creating it if necessary
   * @param {string} folderPath - Path to the folder
   * @param {boolean} autoCreate - Whether to create folder if it doesn't exist
   * @returns {Promise<boolean>} True if folder exists or was created, false otherwise
   */
  async ensureFolder(folderPath, autoCreate = true) {
    const existing = this.app.vault.getAbstractFileByPath(folderPath);
    if (existing instanceof TFolder) {
      return true;
    }

    if (!autoCreate) {
      this.logger.debug(`Folder does not exist and autoCreateFolders is disabled: ${folderPath}`);
      return false;
    }

    try {
      await this.app.vault.createFolder(folderPath);
      this.logger.debug(`Created folder: ${folderPath}`);
      return true;
    } catch (error) {
      // Folder might already exist due to race condition
      if (this.app.vault.getAbstractFileByPath(folderPath)) {
        return true;
      }
      throw error;
    }
  }

  /**
   * Validate that a file is eligible for processing
   */
  isEligibleForProcessing(file) {
    if (!(file instanceof TFile) || file.extension !== "md") {
      return false;
    }

    if (this.app.metadataCache.isUserIgnored(file.path)) {
      return false;
    }

    if (this.isFileInIgnoredFolder(file.path)) {
      return false;
    }

    return true;
  }
}

/**
 * Logger utility for consistent logging with optional debug mode
 */
class Logger {
  constructor(debugEnabled = false) {
    this.debugEnabled = debugEnabled;
  }

  debug(msg) {
    if (this.debugEnabled) {
      console.log(`[PropMove] ${msg}`);
    }
  }

  info(msg) {
    console.log(`[PropMove] ${msg}`);
  }

  error(msg) {
    console.error(`[PropMove] ${msg}`);
  }

  setDebugEnabled(enabled) {
    this.debugEnabled = enabled;
  }
}

/**
 * Strip [[wiki-link]] wrapper from a string value.
 * Handles: [[Name]], [[Name|Alias]], [[Name#heading]]
 * Leaves plain text and partial links unchanged.
 */
function stripWikiLink(value) {
  const match = value.match(/^\[\[([^\]\|]+)(?:\|.*)?\]\]$/);
  return match ? match[1] : value;
}

module.exports = class PropMove extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.migrateSettings();
    this.pending = new Map();
    this.movingPaths = new Set();
    this.autoBatchQueue = new Map();
    this.autoBatchTimer = null;
    this.isStartup = true;

    // Initialize logger and file processor
    this.logger = new Logger(this.settings.debugLogging);
    this.fileProcessor = new FileProcessor(this.app, this.settings, this.logger);

    this.addSettingTab(new PropMoveSettingTab(this.app, this));

    // Ribbon icon (configurable)
    this.setupRibbonIcon();

    // Register manual trigger command
    this.addCommand({
      id: "trigger-manual-process",
      name: "Process files according to property rules",
      callback: () => this.processAllFiles()
    });

    // Register preview command
    this.addCommand({
      id: "preview-moves",
      name: "Preview property-based moves (shows what would be moved)",
      callback: () => this.previewMoves()
    });

    // Register process folder command
    this.addCommand({
      id: "process-folder",
      name: "Process files in specific folder",
      callback: () => this.promptFolderAndProcess()
    });

    // Register preview folder command
    this.addCommand({
      id: "preview-folder",
      name: "Preview moves in specific folder",
      callback: () => this.promptFolderAndPreview()
    });

    // Register event handlers conditionally based on settings
    if (this.settings.moveOnCreate && this.settings.automaticTriggers) {
      this.registerEvent(
        this.app.vault.on("create", (file) => {
          this.logger.debug(`File created, queuing process: ${file.path}`);
          this.queueProcess(file);
        })
      );
    }

    if (this.settings.moveOnMetadataChange && this.settings.automaticTriggers) {
      this.registerEvent(
        this.app.metadataCache.on("changed", (file) => {
          this.logger.debug(`Metadata changed, queuing process: ${file.path}`);

          // Skip processing during startup if moveOnStartup is disabled
          if (this.isStartup && !this.settings.moveOnStartup) {
            this.logger.debug(`Skipping startup processing for: ${file.path}`);
            return;
          }

          this.queueProcess(file);
        })
      );
    }

    // Track folder renames and auto-update mapping paths
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof TFolder) {
          this.handleFolderRename(file.path, oldPath);
        }
      })
    );

    // Handle startup processing if enabled
    if (this.settings.moveOnStartup && this.settings.automaticTriggers) {
      setTimeout(() => {
        this.isStartup = false;
        this.logger.debug("Startup complete");
      }, 2000); // Consider startup complete after 2 seconds
    } else {
      this.isStartup = false;
    }
  }

  /**
   * Handle folder rename by updating all mapping paths that reference the old path.
   * Covers exact folder match and nested subfolder references.
   */
  handleFolderRename(newPath, oldPath) {
    const oldNormalized = normalizePath(oldPath);
    const newNormalized = normalizePath(newPath);

    let updated = 0;

    this.settings.properties.forEach(group => {
      // Skip properties with auto-update disabled
      if (group.autoUpdatePaths === false) {
        return;
      }

      (group.mappings || []).forEach(mapping => {
        const oldFolder = normalizePath(mapping.folder);

        // Exact match or parent folder
        if (
          oldFolder === oldNormalized ||
          oldFolder.startsWith(oldNormalized + "/")
        ) {
          // Replace the old folder path with the new one
          mapping.folder = newNormalized + oldFolder.slice(oldNormalized.length);
          updated++;
          this.logger.debug(
            `[RENAME] Updated mapping path: "${oldFolder}" -> "${mapping.folder}"`
          );
        }
      });
    });

    // Also check ignoreFolders
    for (let i = 0; i < this.settings.ignoreFolders.length; i++) {
      const oldIgnore = normalizePath(this.settings.ignoreFolders[i]);
      if (
        oldIgnore === oldNormalized ||
        oldIgnore.startsWith(oldNormalized + "/")
      ) {
        this.settings.ignoreFolders[i] =
          newNormalized + oldIgnore.slice(oldNormalized.length);
        updated++;
        this.logger.debug(
          `[RENAME] Updated ignore folder: "${oldIgnore}" -> "${this.settings.ignoreFolders[i]}"`
        );
      }
    }

    if (updated > 0) {
      this.saveSettings();
      this.logger.info(
        `[RENAME] Updated ${updated} path(s) after "${oldNormalized}" -> "${newNormalized}"`
      );
    }
  }

  onunload() {
    if (this.autoBatchTimer) {
      clearTimeout(this.autoBatchTimer);
      this.autoBatchTimer = null;
    }
    this.autoBatchQueue.clear();
    this.movingPaths.clear();
  }

  /**
   * Queue a file for processing with debouncing and auto-batching.
   * Auto-moves are batched into a single checkpoint within the cooldown window.
   */
  queueProcess(file) {
    if (!this.fileProcessor.isEligibleForProcessing(file)) {
      return;
    }

    if (this.movingPaths.has(file.path)) {
      return;
    }

    // Add to auto-batch queue (deduplicate by path)
    if (!this.autoBatchQueue.has(file.path)) {
      this.autoBatchQueue.set(file.path, file);
    }

    // Reset cooldown timer
    if (this.autoBatchTimer) {
      clearTimeout(this.autoBatchTimer);
    }

    this.autoBatchTimer = setTimeout(async () => {
      const batchFiles = Array.from(this.autoBatchQueue.values());
      this.autoBatchQueue.clear();
      this.autoBatchTimer = null;

      if (batchFiles.length > 0) {
        await this.processFiles(batchFiles, "auto");
      }
    }, this.settings.undoAutoCooldownMs);
  }

  /**
   * Process all files according to property rules
   */
  async processAllFiles() {
    await this.processFiles(this.app.vault.getMarkdownFiles());
  }

  /**
   * Process files in a specific folder (including subfolders).
   * @param {string} folderPath - Folder path to process
   */
  async processFolder(folderPath) {
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!(folder instanceof TFolder)) {
      new Notice(`PropMove: Folder not found: ${folderPath}`);
      return;
    }

    const normalizedFolder = normalizePath(folderPath);
    const files = this.app.vault.getMarkdownFiles().filter(f =>
      f.path.startsWith(normalizedFolder + '/')
    );

    if (files.length === 0) {
      new Notice(`PropMove: No markdown files in "${folderPath}"`);
      return;
    }

    await this.processFiles(files);
  }

  /**
   * Core file processing loop with chunking for performance.
   * @param {TFile[]} files - Files to process
   */
  async processFiles(files, source) {
    this.logger.debug("Starting manual processing of all files");

    let processedCount = 0;
    let movedCount = 0;
    let skippedCount = 0;
    const successfulMoves = [];
    const maxFiles = this.settings.maxFilesPerBatch > 0 ? this.settings.maxFilesPerBatch : files.length;

    for (const file of files) {
      // Yield to UI thread every 50 files to keep the UI responsive
      if (processedCount % 50 === 0 && processedCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      if (processedCount >= maxFiles) {
        this.logger.debug(`Reached maximum files per batch: ${maxFiles}`);
        break;
      }

      // Skip files in ignored folders
      if (this.fileProcessor.isFileInIgnoredFolder(file.path)) {
        this.logger.debug(`Skipping ignored file: ${file.path}`);
        continue;
      }

      try {
        this.logger.debug(`Processing file: ${file.path}`);
        const result = await this.processFile(file.path, source);
        if (result && result.success) {
          movedCount++;
          if (result.from && result.to) {
            successfulMoves.push({
              file: result.file,
              from: result.from,
              to: result.to,
              rule: result.rule
            });
          }
        } else {
          skippedCount++;
        }
        processedCount++;
      } catch (error) {
        this.logger.error(`Error processing file ${file.path}: ${error.message}`);
        skippedCount++;
      }
    }

    // Create checkpoint if there were successful moves
    if (successfulMoves.length > 0) {
      this.logger.info(`[UNDO] Creating checkpoint with ${successfulMoves.length} moves (source: ${source || "manual"})`);
      await this.addCheckpoint(successfulMoves, source || "manual");
    } else if (movedCount > 0) {
      this.logger.warn(`[UNDO] movedCount=${movedCount} but successfulMoves is empty - checkpoint NOT created`);
    }

    this.logger.info(`PropMove: Processed ${processedCount} files, moved ${movedCount}, skipped ${skippedCount}`);
    if (this.settings.notificationMode === "all" || (this.settings.notificationMode === "onMove" && movedCount > 0)) {
      new Notice(`PropMove: Processed ${processedCount} files, moved ${movedCount}, skipped ${skippedCount}`);
    }
  }

  /**
   * Preview what moves would be made without actually moving files
   */
  async previewMoves() {
    await this.previewFiles(this.app.vault.getMarkdownFiles());
  }

  /**
   * Preview moves in a specific folder (including subfolders).
   * @param {string} folderPath - Folder path to preview
   */
  async previewFolder(folderPath) {
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!(folder instanceof TFolder)) {
      new Notice(`PropMove: Folder not found: ${folderPath}`);
      return;
    }

    const normalizedFolder = normalizePath(folderPath);
    const files = this.app.vault.getMarkdownFiles().filter(f =>
      f.path.startsWith(normalizedFolder + '/')
    );

    if (files.length === 0) {
      new Notice(`PropMove: No markdown files in "${folderPath}"`);
      return;
    }

    await this.previewFiles(files);
  }

  /**
   * Core preview loop.
   * @param {TFile[]} files - Files to preview
   */
  async previewFiles(files) {
    this.logger.debug("Starting preview of moves");

    const previews = [];
    let moveCount = 0;
    let skipCount = 0;

    for (const file of files) {
      if (!this.fileProcessor.isEligibleForProcessing(file)) {
        continue;
      }

      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter = cache ? cache.frontmatter : null;

      const preview = this.fileProcessor.previewMove(file, frontmatter);
      if (preview) {
        previews.push({
          file: file.path,
          ...preview
        });

        if (preview.action === "move" || preview.action === "move_with_suffix") {
          moveCount++;
        } else {
          skipCount++;
        }
      }
    }

    if (moveCount === 0 && skipCount === 0) {
      this.logger.info("PropMove: No files would be moved");
      if (this.settings.notificationMode === "all") {
        new Notice("PropMove: No files would be moved based on current rules");
      }
      return;
    }

    // Log preview results
    previews.forEach(p => {
      if (p.action === "move") {
        const pathInfo = p.template && p.template !== p.interpolated 
          ? `${p.file} → ${p.targetPath} (template: ${p.template} → ${p.interpolated})`
          : `${p.file} → ${p.targetPath}`;
        this.logger.info(`[PREVIEW] MOVE: ${pathInfo}`);
      } else if (p.action === "move_with_suffix") {
        const pathInfo = p.template && p.template !== p.interpolated
          ? `${p.file} → ${p.targetFolder}/ (template: ${p.template} → ${p.interpolated})`
          : `${p.file} → ${p.targetFolder}/`;
        this.logger.info(`[PREVIEW] MOVE (with suffix): ${pathInfo}`);
      } else if (p.action === "skip") {
        if (p.reason === "folder_not_exist_no_create") {
          this.logger.info(`[PREVIEW] SKIP: ${p.file} (folder does not exist: ${p.targetFolder})`);
        } else {
          this.logger.info(`[PREVIEW] SKIP: ${p.file} (${p.reason})`);
        }
      }
    });

    this.logger.info(`PropMove Preview: ${moveCount} would move, ${skipCount} would skip. Check console for details.`);
    if (this.settings.notificationMode === "all") {
      new Notice(`PropMove Preview: ${moveCount} would move, ${skipCount} would skip. Check console for details.`);
    }
  }

  /**
   * Prompt user to select a folder and process it.
   */
  promptFolderAndProcess() {
    const folders = this.collectAllFolders();
    const modal = new FolderPickerModal(this.app, folders, (folder) => {
      if (folder) {
        this.processFolder(folder);
      }
    });
    modal.open();
  }

  /**
   * Prompt user to select a folder and preview moves.
   */
  promptFolderAndPreview() {
    const folders = this.collectAllFolders();
    const modal = new FolderPickerModal(this.app, folders, (folder) => {
      if (folder) {
        this.previewFolder(folder);
      }
    });
    modal.open();
  }

  /**
   * Collect all folder paths recursively for suggestions.
   * @returns {string[]} All folder paths in the vault
   */
  collectAllFolders() {
    const folders = [];
    const root = this.app.vault.getRoot();

    const traverse = (folder) => {
      if (folder instanceof TFolder) {
        folders.push(folder.path);
        folder.children.forEach(traverse);
      }
    };

    if (root) {
      root.children.forEach(traverse);
    }

    return folders;
  }

  /**
   * Render manual trigger buttons into a container using Obsidian's Setting API.
   * Shared between the settings tab and the ribbon icon modal.
   */
  renderManualTriggers(containerEl) {
    // Row 1: Process all files - Dry Run + Execute
    new Setting(containerEl)
      .setName("Process all files")
      .setDesc("Move all files based on current property rules")
      .addButton((button) =>
        button
          .setButtonText("Dry Run")
          .onClick(async () => {
            await this.previewMoves();
          })
      )
      .addButton((button) =>
        button
          .setButtonText("Execute")
          .setCta()
          .onClick(async () => {
            await this.processAllFiles();
          })
      );

    // Row 2: Process folder - Dry Run + Execute
    new Setting(containerEl)
      .setName("Process folder")
      .setDesc("Select a specific folder to process files in")
      .addButton((button) =>
        button
          .setButtonText("Dry Run")
          .onClick(() => {
            this.promptFolderAndPreview();
          })
      )
      .addButton((button) =>
        button
          .setButtonText("Execute")
          .setCta()
          .onClick(() => {
            this.promptFolderAndProcess();
          })
      );
  }

  /**
   * Set up or remove the ribbon icon based on settings.
   */
  setupRibbonIcon() {
    // Remove existing icon if present
    if (this.ribbonIconEl) {
      this.ribbonIconEl.remove();
      this.ribbonIconEl = null;
    }

    if (!this.settings.showRibbonIcon) return;

    // Option F: Minimal + Arrow SVG
    const svgPath = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="12" height="12" rx="2"/><path d="M15 15l6 6"/><path d="M21 15v6h-6"/></svg>`;

    this.ribbonIconEl = this.addRibbonIcon("move", "PropMove: Quick actions", () => {
      new ManualTriggerModal(this.app, this).open();
    });

    // Replace the default icon with our custom SVG
    const iconEl = this.ribbonIconEl.querySelector("svg");
    if (iconEl) {
      iconEl.outerHTML = svgPath;
    }
  }

  /**
   * Process a single file and move it if applicable
   */
  async processFile(filePath, source) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!this.fileProcessor.isEligibleForProcessing(file)) {
      return null;
    }

    const cache = this.app.metadataCache.getFileCache(file);
    const frontmatter = cache ? cache.frontmatter : null;

    if (!frontmatter) {
      return null;
    }

    const targetResult = this.fileProcessor.findTargetFolder(frontmatter);
    if (!targetResult) {
      return null;
    }

    const originalPath = file.path;

    try {
      this.movingPaths.add(file.path);
      const result = await this.fileProcessor.moveFile(file, targetResult.targetFolder);

      // Notify user of specific failures (only when notifications are enabled)
      if (!result.success && result.message) {
        this.logger.info(`[MOVE FAILED] ${result.message}`);
        if (this.settings.notificationMode === "all") {
          if (result.message.includes("folder does not exist")) {
            new Notice(`PropMove: ${result.message}`);
          } else if (result.action === "error") {
            new Notice(`PropMove: Failed to move ${file.name}`);
          }
        }
      }

      // Track successful moves for undo
      if (result && result.success && (result.action === "move" || result.action === "move_with_suffix")) {
        return {
          success: true,
          file: file.name,
          from: originalPath,
          to: result.path,
          rule: `${targetResult.ruleName}=${targetResult.ruleValue}`,
          source: source || "auto"
        };
      }

      return { success: false };
    } catch (error) {
      this.logger.error(`Failed to move ${file.name}: ${error.message}`);
      if (this.settings.notificationMode !== "none") {
        new Notice(`PropMove: Failed to move ${file.name}`);
      }
      return { success: false, error: error.message };
    } finally {
      this.movingPaths.delete(file.path);
    }
  }

  /**
   * Add a checkpoint to the undo history.
   * Uses a ring buffer with max size from settings.
   */
  async addCheckpoint(moves, source) {
    if (!Array.isArray(moves) || moves.length === 0) {
      return;
    }

    const checkpoints = this.settings.undoCheckpoints || [];
    const maxCheckpoints = this.settings.undoMaxCheckpoints;

    const checkpoint = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      source: source || "auto",
      moveCount: moves.length,
      moves: moves
    };

    checkpoints.push(checkpoint);

    // Enforce ring buffer limit (0 or negative = unlimited)
    if (maxCheckpoints && maxCheckpoints > 0) {
      while (checkpoints.length > maxCheckpoints) {
        checkpoints.shift();
      }
    }

    this.settings.undoCheckpoints = checkpoints;
    await this.saveSettings();
    this.logger.info(`[CHECKPOINT] ${moves.length} moves saved (${source})`);

    // Refresh settings tab if currently open
    if (this.app.setting && this.app.setting.activeTab instanceof PropMoveSettingTab) {
      this.app.setting.activeTab.display();
    }
  }

  /**
   * Preview what would happen if we revert to a specific checkpoint.
   * Returns an array of revert actions with status.
   */
  previewRevert(checkpointIndex) {
    const checkpoints = this.settings.undoCheckpoints || [];
    if (checkpointIndex < 0 || checkpointIndex >= checkpoints.length) {
      return [];
    }

    // Collect all moves from checkpoints AFTER the target checkpoint
    // Revert moves from the target checkpoint onwards (inclusive)
    const movesToRevert = [];
    for (let j = checkpointIndex; j < checkpoints.length; j++) {
      const cp = checkpoints[j];
      if (cp && cp.moves) {
        movesToRevert.push(...cp.moves);
      }
    }

    // Reverse the moves list (undo in reverse order)
    movesToRevert.reverse();

    const preview = [];
    for (const move of movesToRevert) {
      const currentFile = this.app.vault.getAbstractFileByPath(move.to);
      const targetFolderExists = this.app.vault.getAbstractFileByPath(
        move.from.substring(0, move.from.lastIndexOf('/'))
      ) instanceof TFolder;

      if (!currentFile) {
        preview.push({
          ...move,
          status: "file_missing",
          message: "File not found at current location"
        });
      } else if (!targetFolderExists) {
        preview.push({
          ...move,
          status: "folder_missing",
          message: "Original folder would be recreated"
        });
      } else {
        preview.push({
          ...move,
          status: "ready",
          message: "Ready to revert"
        });
      }
    }

    return preview;
  }

  /**
   * Execute revert to a specific checkpoint.
   * Reverts all moves made after that checkpoint.
   */
  async executeRevert(checkpointIndex) {
    const preview = this.previewRevert(checkpointIndex);

    if (preview.length === 0) {
      new Notice("PropMove: No moves to revert");
      return;
    }

    let reverted = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of preview) {
      try {
        // Ensure target folder exists
        const targetFolder = item.from.substring(0, item.from.lastIndexOf('/'));
        await this.fileProcessor.ensureFolder(targetFolder, true);

        const currentFile = this.app.vault.getAbstractFileByPath(item.to);
        if (!currentFile) {
          this.logger.debug(`[REVERT] Skipping - file missing: ${item.to}`);
          skipped++;
          continue;
        }

        await this.app.vault.rename(currentFile, item.from);
        this.logger.debug(`[REVERT] ${item.to} -> ${item.from}`);
        reverted++;
      } catch (error) {
        this.logger.error(`[REVERT] Failed: ${error.message}`);
        errors++;
      }
    }

    // Remove all checkpoints from the reverted range (inclusive)
    const checkpoints = this.settings.undoCheckpoints || [];
    this.settings.undoCheckpoints = checkpoints.slice(0, checkpointIndex);
    await this.saveSettings();

    new Notice(`PropMove Revert: ${reverted} reverted, ${skipped} skipped, ${errors} errors`);

    // Refresh settings tab if currently open
    if (this.app.setting && this.app.setting.activeTab instanceof PropMoveSettingTab) {
      this.app.setting.activeTab.display();
    }
  }

  /**
   * Clear all undo checkpoints.
   */
  clearCheckpoints() {
    this.settings.undoCheckpoints = [];
    this.saveSettings();
    this.logger.info("[CHECKPOINT] All checkpoints cleared");
    // Refresh settings tab if currently open
    if (this.app.setting && this.app.setting.activeTab instanceof PropMoveSettingTab) {
      this.app.setting.activeTab.display();
    }
  }

  /**
   * Prune checkpoints to match the configured maximum.
   * Called when the user reduces the max checkpoint limit.
   * Keeps the most recent checkpoints (end of array), removes oldest (start).
   */
  async pruneCheckpoints() {
    const checkpoints = this.settings.undoCheckpoints || [];
    const maxCheckpoints = this.settings.undoMaxCheckpoints || 10;

    if (maxCheckpoints <= 0) {
      // Unlimited - nothing to prune
      this.logger.debug("[CHECKPOINT] Max checkpoints set to unlimited, skipping prune");
      return;
    }

    if (checkpoints.length <= maxCheckpoints) {
      // Already within limit
      return;
    }

    const removed = checkpoints.length - maxCheckpoints;
    this.settings.undoCheckpoints = checkpoints.slice(-maxCheckpoints);
    await this.saveSettings();
    this.logger.info(`[CHECKPOINT] Pruned ${removed} old checkpoint(s) to match new limit of ${maxCheckpoints}`);

    // Refresh settings tab if currently open
    if (this.app.setting && this.app.setting.activeTab instanceof PropMoveSettingTab) {
      this.app.setting.activeTab.display();
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Update logger debug setting
    if (this.logger) {
      this.logger.setDebugEnabled(this.settings.debugLogging);
    }
  }

  migrateSettings() {
    const properties = Array.isArray(this.settings.properties)
      ? this.settings.properties
      : [];

    const legacyPropertyName = String(this.settings.propertyName || "").trim();
    const legacyMappings = Array.isArray(this.settings.mappings)
      ? this.settings.mappings
      : [];

    if (properties.length === 0 && legacyPropertyName) {
      properties.push({ name: legacyPropertyName, mappings: legacyMappings });
    }

    this.settings.properties = properties.map((group) => ({
      name: String(group.name || "").trim(),
      mappings: (Array.isArray(group.mappings) ? group.mappings : []).map((m) => ({
        value: String(m.value || "").trim(),
        folder: String(m.folder || ""),
        operator: m.operator || "equals" // default equals
      })),
      autoUpdatePaths: group.autoUpdatePaths !== false // default true
    }));

    // Ensure ignoreFolders is properly initialized
    if (!Array.isArray(this.settings.ignoreFolders)) {
      this.settings.ignoreFolders = [];
    }

    // Migrate new settings with defaults if they don't exist
    const newSettings = [
      "moveOnCreate",
      "moveOnMetadataChange",
      "moveOnStartup",
      "automaticTriggers",
      "debugLogging",
      "processingDelay",
      "maxFilesPerBatch",
      "caseInsensitiveMatching",
      "autoCreateFolders",
      "showRibbonIcon",
      "undoCheckpoints",
      "undoMaxCheckpoints",
      "undoAutoCooldownMs",
      "notificationMode"
    ];

    newSettings.forEach(setting => {
      if (this.settings[setting] === undefined) {
        this.settings[setting] = DEFAULT_SETTINGS[setting];
      }
    });
  }
};

// Export for testing
module.exports.stripWikiLink = stripWikiLink;

/**
 * Collect all unique frontmatter property keys from the vault
 */
function collectVaultPropertyKeys(app) {
  let propKeys = [];
  if (typeof app.metadataCache.getAllMetadataProperties === 'function') {
    const vaultProps = app.metadataCache.getAllMetadataProperties();
    propKeys = Object.keys(vaultProps).sort();
  } else {
    const seen = new Set();
    for (const file of app.vault.getMarkdownFiles()) {
      const cache = app.metadataCache.getFileCache(file);
      if (cache && cache.frontmatter) {
        for (const key of Object.keys(cache.frontmatter)) {
          seen.add(key);
        }
      }
    }
    propKeys = Array.from(seen).sort();
  }
  return propKeys;
}

/**
 * Collect all unique values for a given property key from the vault
 */
function collectVaultPropertyValues(app, propName) {
  const values = new Set();
  if (!propName) return [];
  for (const file of app.vault.getMarkdownFiles()) {
    const cache = app.metadataCache.getFileCache(file);
    if (cache && cache.frontmatter && cache.frontmatter[propName] !== undefined) {
      const raw = cache.frontmatter[propName];
      const vals = Array.isArray(raw) ? raw : [raw];
      for (const v of vals) {
        let trimmed = String(v).trim();
        // Strip surrounding quotes (YAML empty strings: "")
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          trimmed = trimmed.slice(1, -1);
        }
        if (trimmed.length > 0) {
          values.add(trimmed);
        }
      }
    }
    // Fallback: read file directly if cache is empty
    if (values.size === 0) {
      try {
        const content = app.vault.readCachedFile(file) || app.vault.readAsync(file);
        if (content) {
          const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (fmMatch) {
            const frontmatter = fmMatch[1];
            const lineMatch = frontmatter.match(new RegExp('^' + propName + ':\\s*(.+)$', 'm'));
            if (lineMatch) {
              const val = lineMatch[1].trim();
              if (val) values.add(val);
            }
          }
        }
      } catch (e) {}
    }
  }
  return Array.from(values).sort();
}

/**
 * Collect all folder paths from the vault (excluding vault root)
 */
function collectVaultFolders(app) {
  const folders = [];
  const rootPath = app.vault.getRoot()?.path || '';
  for (const item of app.vault.getAllLoadedFiles()) {
    if (item instanceof TFolder && item.path !== rootPath && item.path !== '') {
      folders.push(item.path);
    }
  }
  return folders.sort();
}

/**
 * PropMoveSuggestInput - Custom autocomplete input with scrollable dropdown.
 * Replaces HTML <datalist> which cannot be constrained with max-height.
 *
 * Features:
 * - Scrollable suggestion list with configurable max-height
 * - Filters suggestions as user types
 * - Arrow key navigation (up/down) + Enter to select
 * - Escape to close
 * - Click outside to close
 * - Allows arbitrary typed values (not restricted to suggestions)
 */
/**
 * PropMoveSuggestInput - Custom autocomplete input with scrollable dropdown.
 * Replaces HTML <datalist> which cannot be constrained with max-height.
 *
 * Features:
 * - Scrollable suggestion list attached to document.body (avoids parent overflow clipping)
 * - Filters suggestions as user types
 * - Arrow key navigation (up/down) + Enter to select
 * - Escape to close
 * - Click outside to close
 * - Allows arbitrary typed values (not restricted to suggestions)
 */
/**
 * Create a suggest input: text field + scrollable dropdown suggestions.
 * - Text input allows arbitrary typed values (not restricted to suggestions).
 * - Dropdown is attached to document.body to avoid parent overflow clipping.
 * - Filters suggestions as user types.
 * - Arrow key navigation (up/down) + Enter to select.
 * - Escape to close. Click outside to close.
 */
function createSuggestInput(container, options) {
  const wrapper = container.createDiv('suggest-input-wrapper');
  wrapper.style.position = 'relative';
  wrapper.style.width = options.wrapperWidth || '100%';
  if (options.wrapperFlex !== null && options.wrapperFlex !== undefined) {
    wrapper.style.flex = options.wrapperFlex;
  }
  if (options.wrapperMinWidth) {
    wrapper.style.minWidth = options.wrapperMinWidth;
  }

  // Text input - user can type anything
  const input = wrapper.createEl('input', { type: 'text' });
  input.style.width = '100%';
  input.style.boxSizing = 'border-box';
  input.style.padding = '4px 8px';
  input.style.fontSize = '13px';
  input.style.background = 'var(--background-primary)';
  input.style.border = '1px solid var(--background-modifier-border)';
  input.style.borderRadius = '4px';
  input.style.outline = 'none';

  // Mutable suggestions ref so updateSuggestions can change what showDropdown sees
  const suggestionsRef = { current: options.suggestions || [] };
  const initialValue = options.initialValue || '';
  input.value = initialValue;

  // Dropdown list - attached to body to escape overflow:hidden parents
  let dropdown = null;
  let highlightedIndex = -1;

  function showDropdown() {
    if (dropdown) {
      dropdown.remove();
    }
    highlightedIndex = -1;

    // Filter suggestions based on current input
    const filter = input.value.toLowerCase();
    const filtered = suggestionsRef.current.filter(s => s.toLowerCase().includes(filter));
    if (filtered.length === 0) return;

    dropdown = document.body.createDiv('propmove-suggest-dropdown');
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '10000';
    dropdown.style.maxHeight = '200px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.border = '1px solid var(--background-modifier-border)';
    dropdown.style.borderRadius = '4px';
    dropdown.style.background = 'var(--background-secondary)';
    dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    dropdown.style.minWidth = '150px';

    const rect = input.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 2) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';

    for (const s of filtered) {
      const item = dropdown.createDiv('propmove-suggest-item');
      item.textContent = s;
      item.style.padding = '6px 10px';
      item.style.cursor = 'pointer';
      item.style.fontSize = '13px';
      item.onmouseover = () => {
        highlightedIndex = [...dropdown.children].indexOf(item);
        updateHighlight();
      };
      item.onclick = () => {
        input.value = s;
        dropdown.remove();
        dropdown = null;
        if (options.onInput) options.onInput(s);
        if (options.onSelect) options.onSelect(s);
      };
    }

    positionDropdown();
  }

  function positionDropdown() {
    if (!dropdown) return;
    const rect = input.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 2) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';
  }

  function hideDropdown() {
    if (dropdown) {
      dropdown.remove();
      dropdown = null;
    }
    highlightedIndex = -1;
  }

  function updateHighlight() {
    if (!dropdown) return;
    const items = dropdown.children;
    for (let i = 0; i < items.length; i++) {
      if (i === highlightedIndex) {
        items[i].style.background = 'var(--background-modifier-hover)';
      } else {
        items[i].style.background = '';
      }
    }
  }

  // Show dropdown on focus
  input.onfocus = () => showDropdown();

  // Filter on input
  input.oninput = () => {
    if (options.onInput) options.onInput(input.value);
    showDropdown();
  };

  // Keyboard navigation
  input.onkeydown = (e) => {
    if (!dropdown) return;
    const items = dropdown.children;
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % items.length;
      updateHighlight();
      items[highlightedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = highlightedIndex <= 0 ? items.length - 1 : highlightedIndex - 1;
      updateHighlight();
      items[highlightedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && items[highlightedIndex]) {
        e.preventDefault();
        const val = items[highlightedIndex].textContent;
        input.value = val;
        hideDropdown();
        if (options.onSelect) options.onSelect(val);
      }
    } else if (e.key === 'Escape') {
      hideDropdown();
    }
  };

  // Click outside to close
  const clickOutside = (e) => {
    if (!wrapper.contains(e.target)) {
      hideDropdown();
    }
  };
  document.addEventListener('click', clickOutside);

  // Reposition on scroll/resize
  window.addEventListener('scroll', positionDropdown, true);
  window.addEventListener('resize', positionDropdown);

  return {
    input,
    wrapper,
    updateSuggestions: function(newSuggestions) {
      suggestionsRef.current = newSuggestions || [];
      // Re-show dropdown if open
      if (dropdown) showDropdown();
    },
    destroy: function() {
      document.removeEventListener('click', clickOutside);
      window.removeEventListener('scroll', positionDropdown, true);
      window.removeEventListener('resize', positionDropdown);
      hideDropdown();
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    },
    getValue: function() {
      return input.value;
    }
  };
}

/**
 * Compact overlay modal with manual trigger buttons.
 * Opens from the ribbon icon in the sidebar.
 */
class ManualTriggerModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.title = "PropMove";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Render the same buttons as in the settings tab
    this.plugin.renderManualTriggers(contentEl);

    // Quick link to open full settings
    const settingsRow = contentEl.createDiv();
    settingsRow.style.marginTop = "16px";
    settingsRow.style.textAlign = "center";
    const settingsLink = settingsRow.createEl("button", {
      text: "PropMove Settings",
      cls: "clickable-icon"
    });
    settingsLink.style.background = "none";
    settingsLink.style.border = "none";
    settingsLink.style.cursor = "pointer";
    settingsLink.style.color = "var(--text-accent)";
    settingsLink.style.fontSize = "13px";
    settingsLink.style.padding = "8px 16px";
    settingsLink.style.display = "inline-block";
    settingsLink.onclick = () => {
      this.close();
      this.app.setting.open();
      const propTab = this.app.setting.pluginTabs.find(t => t.id === "propmove");
      if (propTab) this.app.setting.openTab(propTab);
    };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


class PropMoveSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.suggestInputs = [];
    this.filterState = { text: "", fromDate: "", toDate: "", source: "all" };
    this.expandedCheckpoints = new Set();
    this.expandedCards = new Set();
  }

  display() {
    const sc = this.containerEl.closest(".vertical-tab-content") || this.containerEl.parentElement;
    const sp = sc ? sc.scrollTop : 0;
    // Clean up old suggest inputs to prevent memory leaks
    for (const input of this.suggestInputs) {
      input.destroy();
    }
    this.suggestInputs = [];
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "PropMove Settings" });

    this.createSectionHeader(containerEl, "UI");

    // Show ribbon icon toggle (dedicated section)
    new Setting(containerEl)
      .setName("Show ribbon icon")
      .setDesc("Display a ribbon icon in the sidebar that opens this settings page")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showRibbonIcon)
          .onChange(async (value) => {
            this.plugin.settings.showRibbonIcon = value;
            await this.plugin.saveSettings();
            this.plugin.setupRibbonIcon();
          })
      );

    // Show notifications dropdown
    new Setting(containerEl)
      .setName("Show notifications")
      .setDesc("Controls when PropMove shows pop-up notifications.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("all", "All")
          .addOption("onMove", "On Move")
          .addOption("none", "None")
          .setValue(this.plugin.settings.notificationMode)
          .onChange(async (value) => {
            this.plugin.settings.notificationMode = value;
            await this.plugin.saveSettings();
          })
      });

    this.createSectionHeader(containerEl, "Manual Triggers");

    // Render shared manual trigger buttons
    this.plugin.renderManualTriggers(containerEl);

    // Automatic Triggers heading with toggle
    containerEl.createEl("hr");
    const autoHeadingRow = containerEl.createDiv();
    autoHeadingRow.style.display = "flex";
    autoHeadingRow.style.alignItems = "center";
    autoHeadingRow.style.justifyContent = "space-between";
    autoHeadingRow.style.marginTop = "24px";
    autoHeadingRow.style.marginBottom = "12px";

    const autoH3 = autoHeadingRow.createEl("h3", { text: "Automatic Triggers" });
    autoH3.style.fontSize = "16px";
    autoH3.style.fontWeight = "700";
    autoH3.style.margin = "0";
    autoH3.style.color = "var(--text-normal)";
    autoH3.style.letterSpacing = "-0.01em";

    // Native Obsidian toggle aligned to the right
    const autoToggleWrap = autoHeadingRow.createDiv({ cls: "checkbox-container" });
    const autoToggleInput = autoToggleWrap.createEl("input", { type: "checkbox", tabindex: "0" });
    autoToggleInput.checked = this.plugin.settings.automaticTriggers;
    autoToggleWrap.createEl("span", { cls: "checkbox-glyph" });
    autoToggleWrap.setAttribute("aria-checked", String(this.plugin.settings.automaticTriggers));
    autoToggleWrap.classList.toggle("is-enabled", this.plugin.settings.automaticTriggers);
    autoToggleWrap.onclick = async () => {
      const newVal = !this.plugin.settings.automaticTriggers;
      this.plugin.settings.automaticTriggers = newVal;
      autoToggleInput.checked = newVal;
      autoToggleWrap.setAttribute("aria-checked", String(newVal));
      autoToggleWrap.classList.toggle("is-enabled", newVal);
      await this.plugin.saveSettings();
      this.display();
    };

    containerEl.createEl("p", {
      text: "Configure when files should be automatically moved based on property changes.",
      cls: "setting-item-description"
    });

    if (this.plugin.settings.automaticTriggers) {
      const triggerSettings = [
        {
          name: "Move on file creation",
          desc: "Move files when they are first created",
          setting: "moveOnCreate"
        },
        {
          name: "Move on property change",
          desc: "Move files when their frontmatter properties are modified",
          setting: "moveOnMetadataChange"
        },
        {
          name: "Move on startup",
          desc: "Move files when Obsidian starts up (based on current property rules)",
          setting: "moveOnStartup"
        }
      ];

      triggerSettings.forEach((trigger) => {
        new Setting(containerEl)
          .setName(trigger.name)
          .setDesc(trigger.desc)
          .addToggle((toggle) =>
            toggle
              .setValue(this.plugin.settings[trigger.setting])
              .onChange(async (value) => {
                this.plugin.settings[trigger.setting] = value;
                await this.plugin.saveSettings();
              })
          );
      });
    }
    this.createSectionHeader(containerEl, "Move Behavior");

    // Auto-append suffix setting
    new Setting(containerEl)
      .setName("Automatically append a unique suffix if filename exists")
      .setDesc(
        "When enabled, files are moved with a numeric suffix (e.g. 'note 1.md') if the target filename already exists. When disabled, the move is skipped and a notice is shown."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoAppendSuffix)
          .onChange(async (value) => {
            this.plugin.settings.autoAppendSuffix = value;
            await this.plugin.saveSettings();
          })
      );

    // Auto-create folders setting
    new Setting(containerEl)
      .setName("Automatically create target folders")
      .setDesc(
        "When enabled, missing target folders are created automatically. When disabled, files are not moved if the target folder doesn't exist and you'll be notified."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoCreateFolders)
          .onChange(async (value) => {
            this.plugin.settings.autoCreateFolders = value;
            await this.plugin.saveSettings();
          })
      );

    // Case-insensitive matching
    new Setting(containerEl)
      .setName("Case-insensitive property matching")
      .setDesc(
        "When enabled, property values are matched case-insensitively (e.g., 'Task', 'task', 'TASK' all match)"
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.caseInsensitiveMatching)
          .onChange(async (value) => {
            this.plugin.settings.caseInsensitiveMatching = value;
            await this.plugin.saveSettings();
          })
      );

    this.createSectionHeader(containerEl, "Performance Settings");

    new Setting(containerEl)
      .setName("Processing delay (ms)")
      .setDesc("Delay before processing file changes to allow for batch updates (default: 150ms)")
      .addText((text) =>
        text
          .setPlaceholder("150")
          .setValue(String(this.plugin.settings.processingDelay || 150))
          .onChange(async (value) => {
            const numValue = parseInt(value) || 150;
            this.plugin.settings.processingDelay = numValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max files per manual batch")
      .setDesc("Maximum number of files to process in one manual trigger (0 = no limit)")
      .addText((text) =>
        text
          .setPlaceholder("0")
          .setValue(String(this.plugin.settings.maxFilesPerBatch || 0))
          .onChange(async (value) => {
            const numValue = parseInt(value) || 0;
            this.plugin.settings.maxFilesPerBatch = numValue;
            await this.plugin.saveSettings();
          })
      );

    // Debug setting
    new Setting(containerEl)
      .setName("Enable debug logging")
      .setDesc("Log detailed information to console for troubleshooting")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.debugLogging)
          .onChange(async (value) => {
            this.plugin.settings.debugLogging = value;
            await this.plugin.saveSettings();
          })
      );

    this.createSectionHeader(containerEl, "Ignore Folders");

    containerEl.createEl("p", {
      text: "Add folders to exclude files from being moved. Files in these folders will be ignored even if they match a property mapping (e.g., template folders)."
    });

    const ignoreFolders = Array.isArray(this.plugin.settings.ignoreFolders)
      ? this.plugin.settings.ignoreFolders
      : [];

    if (ignoreFolders.length === 0) {
      containerEl.createEl("p", {
        text: "No folders are currently ignored.",
        cls: "setting-item-description"
      });
    }

    ignoreFolders.forEach((folderPath, index) => {
      const setting = new Setting(containerEl).setName(`Ignored Folder ${index + 1}`);

      setting.addText((text) =>
        text
          .setPlaceholder("templates")
          .setValue(folderPath || "")
          .onChange(async (value) => {
            ignoreFolders[index] = value;
            this.plugin.settings.ignoreFolders = ignoreFolders;
            await this.plugin.saveSettings();
          })
      );

      setting.addExtraButton((button) => {
        button
          .setIcon("trash")
          .setTooltip("Remove ignored folder")
          .onClick(async () => {
            ignoreFolders.splice(index, 1);
            this.plugin.settings.ignoreFolders = ignoreFolders;
            await this.plugin.saveSettings();
            this.display();
          });
      });
    });

    new Setting(containerEl).addButton((button) => {
      button
        .setButtonText("Add ignored folder")
        .setCta()
        .onClick(async () => {
          ignoreFolders.push("");
          this.plugin.settings.ignoreFolders = ignoreFolders;
          await this.plugin.saveSettings();
          this.display();
        });
    });

    this.createSectionHeader(containerEl, "Mappings");

    containerEl.createEl("p", {
      text: "Use {propertyName} to create dynamic paths based on frontmatter values."
    });

    containerEl.createEl("p", {
      text: "First-matching rule wins — drag cards to set priority.",
      cls: "setting-item-description"
    });

    // Template variable help section (collapsible)
    const helpSection = containerEl.createDiv();
    helpSection.style.backgroundColor = "var(--background-secondary)";
    helpSection.style.borderRadius = "6px";
    helpSection.style.marginBottom = "16px";
    helpSection.style.padding = "0";

    const hh = helpSection.createDiv();
    hh.style.display = "flex";
    hh.style.alignItems = "center";
    hh.style.gap = "6px";
    hh.style.cursor = "pointer";
    hh.style.padding = "12px";
    hh.style.userSelect = "none";
    hh.style.borderRadius = "6px";
    hh.onmouseover = () => { hh.style.backgroundColor = "var(--background-modifier-hover)"; };
    hh.onmouseout = () => { hh.style.backgroundColor = "transparent"; };

    const ht = hh.createEl("span");
    ht.textContent = "\u25B6";
    ht.style.fontSize = "10px";
    ht.style.color = "var(--text-muted)";

    hh.createEl("strong", { text: "Variable Reference" });

    const hb = helpSection.createDiv();
    hb.style.display = "none";
    hb.style.padding = "0 12px 12px 12px";
    hb.style.borderTop = "1px solid var(--background-modifier-border)";

    hh.onclick = () => {
      const h = hb.style.display === "none";
      hb.style.display = h ? "block" : "none";
      ht.textContent = h ? "\u25BC" : "\u25B6";
    };

    // --- Variables Table ---
    const tableHeader = hb.createEl("h4", { text: "Available Variables" });
    tableHeader.style.margin = "12px 0 8px 0";
    tableHeader.style.fontSize = "13px";
    tableHeader.style.fontWeight = "600";

    const varTable = hb.createEl("table");
    varTable.style.width = "100%";
    varTable.style.borderCollapse = "collapse";
    varTable.style.fontSize = "12px";

    function addVarRow(variable, description, example) {
      const row = varTable.createEl("tr");
      row.style.borderBottom = "1px solid var(--background-modifier-border)";

      const varCell = row.createEl("td");
      varCell.style.padding = "6px 8px";
      varCell.style.verticalAlign = "middle";
      varCell.style.whiteSpace = "nowrap";

      const code = varCell.createEl("code", { text: variable });
      code.style.fontSize = "12px";
      code.style.background = "var(--background-primary)";
      code.style.padding = "2px 6px";
      code.style.borderRadius = "3px";
      code.style.cursor = "pointer";
      code.title = "Click to copy";
      code.onclick = function() {
        navigator.clipboard.writeText(variable).then(function() {
          new Notice("Copied: " + variable);
        });
      };

      const descCell = row.createEl("td");
      descCell.style.padding = "6px 8px";
      descCell.style.color = "var(--text-muted)";
      descCell.textContent = description;

      const exCell = row.createEl("td");
      exCell.style.padding = "6px 8px";
      exCell.style.color = "var(--text-muted)";
      exCell.style.fontStyle = "italic";
      exCell.textContent = example;
    }

    addVarRow("{propertyName}", "Value of any frontmatter property", "active");
    addVarRow("{file.basename}", "Filename without extension", "My Note");
    addVarRow("{file.folder}", "Parent folder path", "Inbox/Projects");
    addVarRow("{file.ctime}", "File creation date (YYYY-MM-DD)", "2026-06-10");
    addVarRow("{file.ctime:yyyy}", "Creation year (4-digit)", "2026");
    addVarRow("{file.ctime:MM}", "Creation month (zero-padded)", "06");
    addVarRow("{file.ctime:dd}", "Creation day (zero-padded)", "10");
    addVarRow("{file.ctime:HH:mm}", "Creation time (HH:mm format — stack two tokens, see example below)", "14:30");
    addVarRow("{file.mtime}", "File modified date (YYYY-MM-DD)", "2026-06-10");
    addVarRow("{file.mtime:yyyy}", "Modified year (2-digit)", "26");
    addVarRow("{file.mtime:MM}", "Modified month (zero-padded)", "06");
    addVarRow("{file.mtime:dd}", "Modified day (zero-padded)", "10");
    addVarRow("* (wildcard)", "Value matches ANY non-empty frontmatter value", "matches all");

    // --- Examples Section ---
    const exHeader = hb.createEl("h4", { text: "Examples" });
    exHeader.style.margin = "16px 0 8px 0";
    exHeader.style.fontSize = "13px";
    exHeader.style.fontWeight = "600";

    const exList = hb.createEl("div");

    function addExample(exText) {
      const item = exList.createEl("div", { text: "\u2022 " + exText });
      item.style.fontSize = "12px";
      item.style.marginBottom = "4px";
      item.style.color = "var(--text-muted)";
    }

    addExample("{status}/tasks \u2192 active/tasks (if status=active)");
    addExample("{project}/{priority} \u2192 MyProject/high");
    addExample("Archive/{file.ctime:yyyy}/{file.ctime:MM} \u2192 Archive/2026/06");
    addExample("By-Date/{file.ctime:yyyy}/{file.ctime:MM}/{file.ctime:dd} \u2192 By-Date/2026/06/10");
    addExample("Logs/{file.mtime:yyyy}/{file.mtime:MM} \u2192 Logs/2026/06");
    addExample("{file.basename} \u2192 My Note (moves file to a folder named after itself)");
    addExample("Combined: Zone/{project}/{file.mtime:yyyy}/{status} \u2192 Zone/MyApp/2026/active");

    if (this.plugin.settings.properties.length === 0) {
      containerEl.createEl("p", {
        text: "Add one or more properties with value-to-folder mappings.",
        cls: "setting-item-description"
      });
    }

        this.plugin.settings.properties.forEach((group, groupIndex) => {
      const valueSuggestInputs = [];
      const isCardExpanded = this.expandedCards.has(groupIndex);
      const card = containerEl.createDiv();
      card.style.background = "var(--background-secondary)";
      card.style.borderRadius = "8px";
      card.style.padding = "0";
      card.style.marginBottom = "12px";


      card.addEventListener("dragover", (e) => { e.preventDefault(); card.style.border = "2px dashed var(--interactive-accent)"; });
      card.addEventListener("dragleave", () => { card.style.border = "none"; });
      card.addEventListener("drop", (e) => {
        e.preventDefault();
        card.style.border = "none";
        const fi = parseInt(e.dataTransfer.getData("text/plain"));
        const ti = groupIndex;
        if (fi === ti) return;
        const p = this.plugin.settings.properties;
        const [m] = p.splice(fi, 1);
        p.splice(ti, 0, m);
        this.plugin.saveSettings();
        this.display();
      });

      const hd = card.createDiv();
      hd.style.display = "flex";
      hd.style.alignItems = "center";
      hd.style.gap = "8px";
      hd.style.padding = "12px 12px 4px 12px";
      hd.style.borderRadius = "8px 8px 0 0";
      hd.style.borderBottom = "1px solid var(--background-modifier-border)";
      const dh = hd.createEl("span");
      dh.textContent = "\u2630";
      dh.style.fontSize = "14px";
      dh.style.color = "var(--text-muted)";
      dh.style.cursor = "grab";
      dh.style.padding = "4px";
      dh.style.display = "inline-block";
      dh.setAttribute("draggable", "true");
      dh.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(groupIndex));
        card.style.opacity = "0.4";
      });
      dh.addEventListener("dragend", () => { card.style.opacity = "1"; });

      const ps = createSuggestInput(hd, {
        suggestions: collectVaultPropertyKeys(this.app),
        placeholder: "property name",
        initialValue: group.name || "",
        wrapperFlex: "1",
        wrapperMinWidth: "80px",
        onInput: async (val) => {
          group.name = val.trim();
          await this.plugin.saveSettings();
          const v = collectVaultPropertyValues(this.app, val.trim());
          v.unshift("*");
          for (const x of valueSuggestInputs) if (x && x.updateSuggestions) x.updateSuggestions(v);
        },
        onSelect: async (val) => {
          group.name = val.trim();
          await this.plugin.saveSettings();
          const v = collectVaultPropertyValues(this.app, val.trim());
          v.unshift("*");
          for (const x of valueSuggestInputs) if (x && x.updateSuggestions) x.updateSuggestions(v);
        }
      });
      this.suggestInputs.push(ps);

      const n = (group.mappings || []).length;
      const bg = hd.createEl("span");
      bg.textContent = n + " rule" + (n !== 1 ? "s" : "");
      bg.style.fontSize = "11px";
      bg.style.color = "var(--text-muted)";
      bg.style.flexShrink = "0";

      const tr = hd.createEl("button");
      tr.innerHTML = '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'3 6 5 6 21 6\'></polyline><path d=\'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\'></path></svg>';
      tr.style.background = "none";
      tr.style.border = "none";
      tr.style.cursor = "pointer";
      tr.style.color = "var(--text-muted)";
      tr.style.padding = "2px";
      tr.style.display = "flex";
      tr.style.alignItems = "center";
      tr.style.flexShrink = "0";
      tr.title = "Remove mapping";
      tr.onclick = async (e) => {
        e.stopPropagation();
        const name = group.name || 'this mapping';
        if (!confirm("Remove " + name + "?")) return;
        this.plugin.settings.properties.splice(groupIndex, 1);
        await this.plugin.saveSettings();
        this.display();
      };

      const sr = card.createDiv();
      sr.style.display = "flex";
      sr.style.alignItems = "center";
      sr.style.gap = "6px";
      sr.style.cursor = "pointer";
      sr.style.padding = "8px 12px";
      sr.style.userSelect = "none";

      const srt = sr.createEl("span");
      srt.textContent = isCardExpanded ? "\u25BC" : "\u25B6";
      srt.style.fontSize = "10px";
      srt.style.color = "var(--text-muted)";
      srt.style.display = "inline-block";

      const src = sr.createEl("span");
      const cnt = (group.mappings || []).length;
      src.textContent = cnt + " mapping" + (cnt !== 1 ? "s" : "");
      src.style.fontSize = "12px";
      src.style.color = "var(--text-muted)";

      const bd = card.createDiv();
      bd.style.display = isCardExpanded ? "block" : "none";
      bd.style.padding = "16px";
      

      sr.onclick = () => {
        const h = bd.style.display === "none";
        bd.style.display = h ? "block" : "none";
        srt.textContent = h ? "\u25BC" : "\u25B6";
        if (h) this.expandedCards.add(groupIndex); else this.expandedCards.delete(groupIndex);
      };
const mappings = Array.isArray(group.mappings) ? group.mappings : [];
      const initialVals = collectVaultPropertyValues(this.app, group.name || "");
      initialVals.unshift("*");
      const folderSuggestions = collectVaultFolders(this.app);
      const mappingsContainer = bd.createDiv();
      mappingsContainer.style.marginTop = "12px";
      mappingsContainer.style.maxHeight = "350px";
      mappingsContainer.style.overflowY = mappings.length > 8 ? "auto" : "visible";

      // Mappings header
      const mappingsHeader = mappingsContainer.createDiv();
      mappingsHeader.style.display = "flex";
      mappingsHeader.style.justifyContent = "space-between";
      mappingsHeader.style.marginBottom = "4px";

      const mappingsTitle = mappingsHeader.createEl("span", {
        text: mappings.length === 0
          ? "Add value-to-folder mappings below"
          : `${mappings.length} mapping${mappings.length > 1 ? "s" : ""}`
      });
      mappingsTitle.style.fontSize = "11px";
      mappingsTitle.style.color = "var(--text-muted)";

      if (mappings.length > 0) {
        // Column headers
        const colHeaders = mappingsContainer.createDiv();
        colHeaders.style.display = "flex";
        colHeaders.style.gap = "8px";
        colHeaders.style.marginBottom = "4px";
        colHeaders.style.paddingLeft = "2px";

        const valHeader = colHeaders.createEl("span", { text: "Value" });
        valHeader.style.fontSize = "11px";
        valHeader.style.fontWeight = "600";
        valHeader.style.color = "var(--text-muted)";
        valHeader.style.width = "30%";

        const opHeader = colHeaders.createEl("span", { text: "Match" });
        opHeader.style.fontSize = "11px";
        opHeader.style.fontWeight = "600";
        opHeader.style.color = "var(--text-muted)";
        opHeader.style.width = "90px";
        opHeader.style.minWidth = "90px";

        const folderHeader = colHeaders.createEl("span", { text: "Target folder" });
        folderHeader.style.fontSize = "11px";
        folderHeader.style.fontWeight = "600";
        folderHeader.style.color = "var(--text-muted)";
        folderHeader.style.flex = "1";
      }

      // Mapping rows
      // valueSuggestInputs already declared above for name input callbacks
      mappings.forEach((mapping, index) => {
        const row = mappingsContainer.createDiv();
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "4px";

        // Value input with autocomplete dropdown
        const valueSuggest = createSuggestInput(row, {
          suggestions: initialVals,
          placeholder: "task or *",
          initialValue: mapping.value || "",
          wrapperWidth: "30%",
          wrapperMinWidth: "80px",
          onInput: async (val) => {
            mapping.value = val;
            await this.plugin.saveSettings();
          },
          onSelect: async (val) => {
            mapping.value = val;
            await this.plugin.saveSettings();
          }
        });
        valueSuggestInputs.push(valueSuggest);
        this.suggestInputs.push(valueSuggest);

        // Operator select
        const operatorSelect = row.createEl("select");
        operatorSelect.style.width = "90px";
        operatorSelect.style.minWidth = "90px";
        operatorSelect.style.padding = "4px";
        operatorSelect.style.fontSize = "12px";
        operatorSelect.style.background = "var(--background-primary)";
        operatorSelect.style.border = "1px solid var(--background-modifier-border)";
        operatorSelect.style.borderRadius = "4px";
        const currentOp = mapping.operator || "equals";
        for (const op of ["equals", "contains", "is empty", "is not empty"]) {
          const opt = operatorSelect.createEl("option", {
            text: op.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()),
            value: op.replace(/ /g, "-")
          });
          if (op.replace(/ /g, "-") === currentOp) opt.selected = true;
        }
        operatorSelect.onchange = async () => {
          mapping.operator = operatorSelect.value;
          await this.plugin.saveSettings();
        };

        // Folder input with autocomplete dropdown
        const folderSuggest = createSuggestInput(row, {
          suggestions: folderSuggestions,
          placeholder: "Projects/Tasks",
          initialValue: mapping.folder || "",
          wrapperFlex: "1",
          onInput: async (val) => {
            mapping.folder = val;
            await this.plugin.saveSettings();
          },
          onSelect: async (val) => {
            mapping.folder = val;
            await this.plugin.saveSettings();
          }
        });
        this.suggestInputs.push(folderSuggest);

        const mapTrash = row.createEl("button");
        mapTrash.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>";
        mapTrash.style.background = "none";
        mapTrash.style.border = "none";
        mapTrash.style.cursor = "pointer";
        mapTrash.style.color = "var(--text-muted)";
        mapTrash.style.padding = "4px";
        mapTrash.style.display = "flex";
        mapTrash.style.alignItems = "center";
        mapTrash.title = "Remove mapping";
        mapTrash.onclick = async () => {
          if (!confirm("Remove this mapping rule?")) return;
          mappings.splice(index, 1);
          group.mappings = mappings;
          await this.plugin.saveSettings();
          this.display();
        };
      });



      // Footer row: add mapping + auto-update toggle
      const ur = bd.createDiv();
      ur.style.display = "flex";
      ur.style.alignItems = "center";
      ur.style.justifyContent = "space-between";
      ur.style.marginTop = "12px";
      ur.style.paddingTop = "8px";
      ur.style.borderTop = "1px solid var(--background-modifier-border)";

      const addBtn = ur.createEl("button");
      addBtn.textContent = "+ Add mapping";
      addBtn.style.background = "none";
      addBtn.style.border = "none";
      addBtn.style.cursor = "pointer";
      addBtn.style.color = "var(--text-accent)";
      addBtn.style.fontSize = "12px";
      addBtn.style.padding = "0";
      addBtn.onclick = async () => {
        mappings.push({ value: "", folder: "" });
        group.mappings = mappings;
        await this.plugin.saveSettings();
        this.display();
      };

      const rightGroup = ur.createDiv();
      rightGroup.style.display = "flex";
      rightGroup.style.alignItems = "center";
      rightGroup.style.gap = "6px";

      const uc = rightGroup.createEl("input", { type: "checkbox" });
      uc.checked = group.autoUpdatePaths !== false;
      uc.onchange = async () => {
        group.autoUpdatePaths = uc.checked;
        await this.plugin.saveSettings();
      };

      const ul = rightGroup.createEl("span", {
        text: "Update paths on folder rename"
      });
      ul.style.fontSize = "11px";
      ul.style.color = "var(--text-muted)";
      ul.title = "When a folder is renamed, automatically update target paths for this property";
    });

    new Setting(containerEl).addButton((button) => {
      button
        .setButtonText("Add property")
        .setCta()
        .onClick(async () => {
          this.plugin.settings.properties.push({ name: "", mappings: [] });
          await this.plugin.saveSettings();
          this.display();
        });
    });

    containerEl.createEl("hr");
    this.renderHistorySection(containerEl);
    setTimeout(() => { if (sc) sc.scrollTop = sp; }, 0);
  }

  /**
   * Create a styled section header with consistent visual weight.
   */
  createSectionHeader(containerEl, text) {
    const hr = containerEl.createEl("hr");
    const h3 = containerEl.createEl("h3", { text });
    h3.style.fontSize = "16px";
    h3.style.fontWeight = "700";
    h3.style.marginTop = "24px";
    h3.style.marginBottom = "12px";
    h3.style.color = "var(--text-normal)";
    h3.style.letterSpacing = "-0.01em";
  }

  /**
   * Format an ISO timestamp into a human-readable relative string.
   */
  formatTimestamp(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  /**
   * Render the history section in settings.
   * Each checkpoint is a card matching the mapping card design.
   * Includes a meta-tag filter input that re-renders cards without losing focus.
   */
  renderHistorySection(containerEl) {
    const checkpoints = this.plugin.settings.undoCheckpoints || [];

    // Section header
    const h3 = containerEl.createEl("h3", { text: "Move History" });
    h3.style.fontSize = "16px";
    h3.style.fontWeight = "700";
    h3.style.marginTop = "24px";
    h3.style.marginBottom = "12px";
    h3.style.color = "var(--text-normal)";
    h3.style.letterSpacing = "-0.01em";

    // Filter controls inside a bordered box
    const filterBody = containerEl.createDiv();
    filterBody.style.border = "1px solid var(--background-modifier-border)";
    filterBody.style.borderRadius = "6px";
    filterBody.style.padding = "10px";
    filterBody.style.marginBottom = "12px";

    // Row 1: text search
    const textInput = filterBody.createEl("input", {
      type: "text",
      placeholder: "Filter by name or path\u2026"
    });
    textInput.style.width = "100%";
    textInput.style.fontSize = "13px";
    textInput.style.padding = "6px 10px";
    textInput.style.borderRadius = "6px";
    textInput.style.border = "1px solid var(--background-modifier-border)";
    textInput.style.outline = "none";
    textInput.style.background = "var(--background-secondary)";
    textInput.style.color = "var(--text-normal)";
    textInput.style.boxSizing = "border-box";
    textInput.style.marginBottom = "8px";
    textInput.value = this.filterState.text;

    // Row 2: date range + source dropdown
    const filterRow2 = filterBody.createDiv();
    filterRow2.style.display = "flex";
    filterRow2.style.alignItems = "center";
    filterRow2.style.gap = "8px";
    filterRow2.style.flexWrap = "wrap";

    const fromLabel = filterRow2.createEl("label");
    fromLabel.textContent = "From:";
    fromLabel.style.fontSize = "12px";
    fromLabel.style.color = "var(--text-muted)";
    fromLabel.style.fontWeight = "500";
    fromLabel.style.flexShrink = "0";

    const fromInput = filterRow2.createEl("input", { type: "date" });
    fromInput.style.fontSize = "12px";
    fromInput.style.padding = "4px 28px 4px 30px";
    fromInput.style.borderRadius = "4px";
    fromInput.style.border = "1px solid var(--background-modifier-border)";
    fromInput.style.background = "var(--background-secondary)";
    fromInput.style.color = "var(--text-normal)";
    fromInput.style.width = "170px";
    fromInput.value = this.filterState.fromDate;

    const toLabel = filterRow2.createEl("label");
    toLabel.textContent = "To:";
    toLabel.style.fontSize = "12px";
    toLabel.style.color = "var(--text-muted)";
    toLabel.style.fontWeight = "500";
    toLabel.style.flexShrink = "0";

    const toInput = filterRow2.createEl("input", { type: "date" });
    toInput.style.fontSize = "12px";
    toInput.style.padding = "4px 28px 4px 30px";
    toInput.style.borderRadius = "4px";
    toInput.style.border = "1px solid var(--background-modifier-border)";
    toInput.style.background = "var(--background-secondary)";
    toInput.style.color = "var(--text-normal)";
    toInput.style.width = "170px";
    toInput.value = this.filterState.toDate;

    const sourceSelect = filterRow2.createEl("select");
    sourceSelect.style.fontSize = "12px";
    sourceSelect.style.padding = "4px 6px";
    sourceSelect.style.borderRadius = "4px";
    sourceSelect.style.border = "1px solid var(--background-modifier-border)";
    sourceSelect.style.background = "var(--background-secondary)";
    sourceSelect.style.color = "var(--text-normal)";
    sourceSelect.style.cursor = "pointer";
    ["all", "auto", "manual"].forEach((val) => {
      const opt = sourceSelect.createEl("option");
      opt.value = val;
      opt.textContent = val === "all" ? "All moves" : val === "auto" ? "Auto only" : "Manual only";
      if (val === this.filterState.source) opt.selected = true;
    });

    // Body wrapper — cleared on each filter change (not the full display)
    const bodyWrapper = containerEl.createDiv();

    const renderBody = () => {
      bodyWrapper.empty();

      if (checkpoints.length === 0) {
        // Max checkpoints setting even when empty
        const emptyRow = bodyWrapper.createDiv();
        emptyRow.style.marginBottom = "12px";
        emptyRow.style.display = "flex";
        emptyRow.style.justifyContent = "flex-start";
        emptyRow.style.alignItems = "center";
        const emptyMaxContainer = emptyRow.createDiv();
        emptyMaxContainer.style.display = "flex";
        emptyMaxContainer.style.alignItems = "center";
        emptyMaxContainer.style.gap = "8px";
        const emptyMaxLabel = emptyMaxContainer.createEl("label");
        emptyMaxLabel.textContent = "Max checkpoints:";
        emptyMaxLabel.style.fontSize = "12px";
        emptyMaxLabel.style.color = "var(--text-muted)";
        emptyMaxLabel.style.fontWeight = "500";
        const emptyMaxInput = emptyMaxContainer.createEl("input", { type: "number" });
        emptyMaxInput.value = this.plugin.settings.undoMaxCheckpoints || 10;
        emptyMaxInput.min = "0";
        emptyMaxInput.max = "1000";
        emptyMaxInput.style.width = "60px";
        emptyMaxInput.style.fontSize = "12px";
        emptyMaxInput.style.padding = "2px 4px";
        emptyMaxInput.title = "Maximum number of checkpoints to store. Set to 0 for unlimited.";
        emptyMaxInput.onchange = async () => {
          const val = parseInt(emptyMaxInput.value, 10);
          if (isNaN(val) || val < 0) {
            emptyMaxInput.value = this.plugin.settings.undoMaxCheckpoints || 10;
            new Notice("PropMove: Invalid value. Using current limit.");
            return;
          }
          this.plugin.settings.undoMaxCheckpoints = val;
          await this.plugin.saveSettings();
          new Notice(`PropMove: Max checkpoints set to ${val === 0 ? 'unlimited' : val}`);
        };

        bodyWrapper.createEl("p", {
          text: "No move history yet. Files moved by PropMove will appear here.",
          cls: "setting-item-description"
        });
        return;
      }

      // History controls: max checkpoints + clear history
      const controlsBox = bodyWrapper.createDiv();
      controlsBox.style.border = "1px solid var(--background-modifier-border)";
      controlsBox.style.borderRadius = "6px";
      controlsBox.style.padding = "8px 10px";
      controlsBox.style.marginBottom = "12px";

      const controlsRow = controlsBox.createDiv();
      controlsRow.style.display = "flex";
      controlsRow.style.justifyContent = "space-between";
      controlsRow.style.alignItems = "center";

      // Max checkpoints setting (left side)
      const maxSettingContainer = controlsRow.createDiv();
      maxSettingContainer.style.display = "flex";
      maxSettingContainer.style.alignItems = "center";
      maxSettingContainer.style.gap = "8px";
      const maxLabel = maxSettingContainer.createEl("label");
      maxLabel.textContent = "Max checkpoints:";
      maxLabel.style.fontSize = "12px";
      maxLabel.style.color = "var(--text-muted)";
      maxLabel.style.fontWeight = "500";
      const maxInput = maxSettingContainer.createEl("input", { type: "number" });
      maxInput.value = this.plugin.settings.undoMaxCheckpoints || 10;
      maxInput.min = "0";
      maxInput.max = "1000";
      maxInput.style.width = "60px";
      maxInput.style.fontSize = "12px";
      maxInput.style.padding = "2px 4px";
      maxInput.title = "Maximum number of checkpoints to store. Set to 0 for unlimited.";
      maxInput.onchange = async () => {
        const val = parseInt(maxInput.value, 10);
        if (isNaN(val) || val < 0) {
          maxInput.value = this.plugin.settings.undoMaxCheckpoints || 10;
          new Notice("PropMove: Invalid value. Using current limit.");
          return;
        }
        this.plugin.settings.undoMaxCheckpoints = val;
        await this.plugin.saveSettings();
        await this.plugin.pruneCheckpoints();
        new Notice(`PropMove: Max checkpoints set to ${val === 0 ? 'unlimited' : val}`);
        this.display();
      };

      // Clear history button (right side)
      const clearBtn = controlsRow.createEl("button");
      clearBtn.textContent = "Clear history";
      clearBtn.style.background = "none";
      clearBtn.style.border = "none";
      clearBtn.style.cursor = "pointer";
      clearBtn.style.color = "var(--text-muted)";
      clearBtn.style.fontSize = "12px";
      clearBtn.style.padding = "4px 8px";
      clearBtn.style.borderRadius = "4px";
      clearBtn.onmouseover = () => { clearBtn.style.color = "var(--text-normal)"; };
      clearBtn.onmouseout = () => { clearBtn.style.color = "var(--text-muted)"; };
      clearBtn.onclick = async () => {
        this.plugin.clearCheckpoints();
        this.display();
      };

      const fs = this.filterState;

      // Count visible checkpoints
      let visibleCount = 0;
      for (let i = checkpoints.length - 1; i >= 0; i--) {
        if (this.checkpointMatchesFilter(checkpoints[i], fs)) visibleCount++;
      }

      if (visibleCount === 0) {
        bodyWrapper.createEl("p", {
          text: "No matching history entries.",
          cls: "setting-item-description"
        });
        return;
      }

      // Collapsible wrapper around the entry list
      const details = bodyWrapper.createEl("details");
      details.style.marginTop = "8px";

      // Auto-expand when any filter is active — user wants to see results
      const hasActiveFilter = fs.text || fs.fromDate || fs.toDate || fs.source !== "all";
      if (hasActiveFilter) details.open = true;

      const summary = details.createEl("summary");
      summary.textContent = `Move History (${visibleCount} entry${visibleCount !== 1 ? 's' : ''})`;
      summary.style.cursor = "pointer";
      summary.style.fontSize = "12px";
      summary.style.fontWeight = "600";
      summary.style.color = "var(--text-muted)";
      summary.style.padding = "4px 0";
      summary.style.userSelect = "none";

      // Render each checkpoint as a card (newest first), skip non-matching
      for (let i = checkpoints.length - 1; i >= 0; i--) {
        const cp = checkpoints[i];
        if (!this.checkpointMatchesFilter(cp, fs)) continue;

        // Card container - matches mapping card style
        const card = details.createDiv();
        card.style.background = "var(--background-secondary)";
        card.style.borderRadius = "8px";
        card.style.padding = "16px";
        card.style.marginBottom = "12px";

        // Card header: timestamp + source badge + restore button
        const header = card.createDiv();
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "12px";
        header.style.borderBottom = "1px solid var(--background-modifier-border)";
        header.style.paddingBottom = "8px";

        // Left side: timestamp and source
        const headerLeft = header.createDiv();
        headerLeft.style.display = "flex";
        headerLeft.style.alignItems = "center";
        headerLeft.style.gap = "8px";

        const timeEl = headerLeft.createEl("span", {
          text: this.formatTimestamp(cp.timestamp)
        });
        timeEl.style.fontSize = "13px";
        timeEl.style.fontWeight = "600";
        timeEl.title = cp.timestamp;

        // Source badge
        const sourceBadge = headerLeft.createDiv();
        sourceBadge.style.fontSize = "10px";
        sourceBadge.style.fontWeight = "600";
        sourceBadge.style.textTransform = "uppercase";
        sourceBadge.style.letterSpacing = "0.5px";
        sourceBadge.style.padding = "2px 6px";
        sourceBadge.style.borderRadius = "4px";
        sourceBadge.textContent = cp.source || "auto";
        if ((cp.source || "auto") === "manual") {
          sourceBadge.style.background = "var(--interactive-accent)";
          sourceBadge.style.color = "var(--text-on-accent)";
        } else {
          sourceBadge.style.background = "var(--background-modifier-border)";
          sourceBadge.style.color = "var(--text-muted)";
        }

        // Move count badge
        const countBadge = headerLeft.createDiv();
        countBadge.style.fontSize = "11px";
        countBadge.style.color = "var(--text-muted)";
        countBadge.textContent = `${cp.moveCount} move${cp.moveCount > 1 ? 's' : ''}`;

        // Right side: revert button
        const restoreBtn = header.createEl("button");
        restoreBtn.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='margin-right:4px;vertical-align:middle;'><polyline points='1 4 1 10 7 10'></polyline><path d='M3.51 15a9 9 0 1 0 2.13-9.36L1 10'></path></svg>Undo this & younger moves`;
        restoreBtn.style.background = "none";
        restoreBtn.style.border = "1px solid var(--background-modifier-border)";
        restoreBtn.style.cursor = "pointer";
        restoreBtn.style.color = "var(--text-normal)";
        restoreBtn.style.fontSize = "11px";
        restoreBtn.style.padding = "3px 8px";
        restoreBtn.style.borderRadius = "4px";
        restoreBtn.style.display = "flex";
        restoreBtn.style.alignItems = "center";
        restoreBtn.style.gap = "2px";
        restoreBtn.onmouseover = () => {
          restoreBtn.style.borderColor = "var(--interactive-accent)";
          restoreBtn.style.color = "var(--text-accent)";
        };
        restoreBtn.onmouseout = () => {
          restoreBtn.style.borderColor = "var(--background-modifier-border)";
          restoreBtn.style.color = "var(--text-normal)";
        };
        restoreBtn.onclick = async () => {
          const cnt = cp.moves ? cp.moves.length : 0;
          if (!confirm(`Undo ${cnt} move${cnt !== 1 ? "s" : ""}? This will move files back to their original locations.`)) return;
          await this.plugin.executeRevert(i);
          this.display();
        };

        // Card body: individual moves (collapsible)
        const moveCnt = cp.moves ? cp.moves.length : 0;
        const isExp = this.expandedCheckpoints.has(i);
        const movesContainer = card.createDiv();
        movesContainer.style.marginTop = "4px";

        const sr = movesContainer.createDiv();
        sr.style.display = "flex";
        sr.style.alignItems = "center";
        sr.style.gap = "6px";
        sr.style.cursor = "pointer";
        sr.style.padding = "4px 2px";
        sr.style.borderRadius = "4px";
        sr.style.userSelect = "none";
        sr.onmouseover = () => { sr.style.backgroundColor = "var(--background-modifier-hover)"; };
        sr.onmouseout = () => { sr.style.backgroundColor = "transparent"; };

        const tgl = sr.createEl("span");
        tgl.textContent = isExp ? "\u25BC" : "\u25B6";
        tgl.style.fontSize = "10px";
        tgl.style.color = "var(--text-muted)";
        tgl.style.display = "inline-block";

        const st = sr.createEl("span");
        st.textContent = `${moveCnt} file${moveCnt !== 1 ? "s" : ""} moved`;
        st.style.fontSize = "12px";
        st.style.color = "var(--text-muted)";
        st.style.flex = "1";

        const dc = card.createDiv();
        dc.style.display = isExp ? "block" : "none";
        dc.style.marginTop = "8px";

        sr.onclick = () => {
          const h = dc.style.display === "none";
          dc.style.display = h ? "block" : "none";
          tgl.textContent = h ? "\u25BC" : "\u25B6";
          if (h) this.expandedCheckpoints.add(i);
          else this.expandedCheckpoints.delete(i);
        };

        cp.moves.forEach((m, mIndex) => {
          const moveRow = dc.createDiv();
          moveRow.style.display = "flex";
          moveRow.style.alignItems = "flex-start";
          moveRow.style.gap = "8px";
          if (mIndex > 0) {
            moveRow.style.marginTop = "8px";
            moveRow.style.paddingTop = "8px";
            moveRow.style.borderTop = "1px solid var(--background-modifier-border)";
          }

          // Arrow icon
          const arrowIcon = moveRow.createDiv();
          arrowIcon.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='var(--text-muted)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='margin-top:2px;flex-shrink:0;'><line x1='5' y1='12' x2='19' y2='12'></line><polyline points='12 5 19 12 12 19'></polyline></svg>`;

          // Move details
          const moveDetails = moveRow.createDiv();
          moveDetails.style.flex = "1";
          moveDetails.style.minWidth = "0";

          // Filename
          const fileEl = moveDetails.createEl("div");
          fileEl.style.fontSize = "12px";
          fileEl.style.fontWeight = "500";
          fileEl.style.fontFamily = "var(--font-monospace)";
          fileEl.style.marginBottom = "4px";
          fileEl.textContent = m.file;

          // From/To paths
          const pathsEl = moveDetails.createDiv();
          pathsEl.style.display = "flex";
          pathsEl.style.alignItems = "center";
          pathsEl.style.gap = "6px";
          pathsEl.style.fontSize = "11px";
          pathsEl.style.fontFamily = "var(--font-monospace)";

          const fromEl = pathsEl.createEl("span");
          fromEl.style.color = "var(--text-muted)";
          fromEl.style.whiteSpace = "nowrap";
          fromEl.style.overflow = "hidden";
          fromEl.style.textOverflow = "ellipsis";
          fromEl.textContent = m.from;
          fromEl.title = m.from;

          const arrow = pathsEl.createEl("span");
          arrow.style.color = "var(--text-muted)";
          arrow.style.flexShrink = "0";
          arrow.textContent = "\u2192";

          const toEl = pathsEl.createEl("span");
          toEl.style.color = "var(--text-normal)";
          toEl.style.whiteSpace = "nowrap";
          toEl.style.overflow = "hidden";
          toEl.style.textOverflow = "ellipsis";
          toEl.textContent = m.to;
          toEl.title = m.to;

          // Rule tag (if present)
          if (m.rule) {
            const ruleEl = moveDetails.createEl("div");
            ruleEl.style.marginTop = "4px";
            const ruleBadge = ruleEl.createDiv();
            ruleBadge.style.display = "inline-block";
            ruleBadge.style.fontSize = "10px";
            ruleBadge.style.fontFamily = "var(--font-monospace)";
            ruleBadge.style.padding = "1px 6px";
            ruleBadge.style.borderRadius = "3px";
            ruleBadge.style.background = "var(--background-modifier-border)";
            ruleBadge.style.color = "var(--text-muted)";
            ruleBadge.textContent = m.rule;
          }
        });
      }
    };

    renderBody();

    // Event handlers — each updates its field, then re-renders only bodyWrapper
    textInput.oninput = () => {
      this.filterState.text = textInput.value;
      renderBody();
    };
    fromInput.onchange = () => {
      this.filterState.fromDate = fromInput.value;
      renderBody();
    };
    toInput.onchange = () => {
      this.filterState.toDate = toInput.value;
      renderBody();
    };
    sourceSelect.onchange = () => {
      this.filterState.source = sourceSelect.value;
      renderBody();
    };
  }

  /**
   * Check if a checkpoint matches the current filter state.
   * Applied as AND logic — all active fields must pass.
   */
  checkpointMatchesFilter(cp, state) {
    // Text search — match on file, from, or to
    if (state.text) {
      const q = state.text.toLowerCase();
      if (!(cp.moves && cp.moves.some(m =>
        (m.file && m.file.toLowerCase().includes(q)) ||
        (m.from && m.from.toLowerCase().includes(q)) ||
        (m.to && m.to.toLowerCase().includes(q))
      ))) return false;
    }
    // Source filter
    if (state.source && state.source !== "all") {
      if ((cp.source || "auto") !== state.source) return false;
    }
    // Date from
    if (state.fromDate) {
      const fromTime = new Date(state.fromDate).getTime();
      const cpTime = new Date(cp.timestamp).getTime();
      if (isNaN(fromTime) || cpTime < fromTime) return false;
    }
    // Date to (end of day)
    if (state.toDate) {
      const toDate = new Date(state.toDate);
      toDate.setHours(23, 59, 59, 999);
      const toTime = toDate.getTime();
      const cpTime = new Date(cp.timestamp).getTime();
      if (isNaN(toTime) || cpTime > toTime) return false;
    }
    return true;
  }
}

/**
 * Simple folder picker modal with autocomplete.
 */
class FolderPickerModal extends Modal {
  constructor(app, folders, onSubmit) {
    super(app);
    this.folders = folders;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: "Select Folder" });

    const input = contentEl.createEl("input", {
      type: "text",
      placeholder: "Type to search folders..."
    });
    input.setAttribute("autofocus", "");

    // Dropdown for suggestions
    const dropdown = contentEl.createDiv("folder-picker-dropdown");
    dropdown.style.maxHeight = "200px";
    dropdown.style.overflowY = "auto";
    dropdown.style.border = "1px solid var(--background-modifier-border)";
    dropdown.style.borderRadius = "4px";
    dropdown.style.padding = "4px 0";
    dropdown.style.display = "none";

    const showSuggestions = (filter = "") => {
      dropdown.empty();
      const filtered = this.folders.filter(f =>
        f.toLowerCase().includes(filter.toLowerCase())
      ).slice(0, 20); // Limit to 20 suggestions

      if (filtered.length === 0) {
        dropdown.style.display = "none";
        return;
      }

      dropdown.style.display = "block";

      filtered.forEach(folder => {
        const item = dropdown.createDiv("folder-picker-item");
        item.textContent = folder || "/ (root)";
        item.style.padding = "4px 8px";
        item.style.cursor = "pointer";

        item.onclick = () => {
          this.close();
          this.onSubmit(folder);
        };

        item.onmouseover = () => {
          item.style.backgroundColor = "var(--background-modifier-hover)";
        };

        item.onmouseout = () => {
          item.style.backgroundColor = "";
        };
      });
    };

    input.addEventListener("input", () => {
      showSuggestions(input.value);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = input.value.trim();
        // Check if value matches a folder
        const match = this.folders.find(f => f === value);
        if (match !== undefined) {
          this.close();
          this.onSubmit(match);
        }
      } else if (e.key === "Escape") {
        this.close();
      }
    });

    // Submit button
    const btnContainer = contentEl.createDiv({
      style: "margin-top: 16px; text-align: right;"
    });

    const btn = btnContainer.createEl("button", {
      text: "Process Folder",
      cls: "mod-cta"
    });

    btn.onclick = () => {
      const value = input.value.trim();
      const match = this.folders.find(f => f === value);
      if (match !== undefined) {
        this.close();
        this.onSubmit(match);
      } else {
        new Notice("Folder not found");
      }
    };

    // Show all suggestions initially
    showSuggestions();

    // Focus input
    setTimeout(() => input.focus(), 50);
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

/* nosourcemap */