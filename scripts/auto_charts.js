const fs = require('fs');
const path = require('path');

/**
 * Hexo Tag: {% chart_list %}
 * 功能: 自动列出 charts 下的子文件夹
 * 智能点: 尝试读取 index.html 里的 <title> 作为显示名称
 */
hexo.extend.tag.register('chart_list', function(args) {
  const chartsDir = path.join(hexo.source_dir, 'charts');
  let html = '<ul class="chart-list-auto">';

  if (fs.existsSync(chartsDir)) {
    const files = fs.readdirSync(chartsDir);
    
    files.forEach(file => {
      // 忽略 index.md 和隐藏文件
      if (file === 'index.md' || file.startsWith('.')) return;

      const fullPath = path.join(chartsDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        let displayName = file; // 默认用文件夹名
        
        // --- 智能读取开始 ---
        try {
          // 尝试寻找该文件夹下的 index.html
          const indexPath = path.join(fullPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf-8');
            // 使用正则提取 <title> 内容
            const match = content.match(/<title>(.*?)<\/title>/i);
            if (match && match[1]) {
              displayName = match[1].trim(); // 提取成功！用 HTML 里的标题
            }
          }
        } catch (e) {
          // 如果读取出错，就还是用文件夹名，不做处理
        }
        // --- 智能读取结束 ---

        // 如果还是文件名，稍微美化一下（首字母大写）
        if (displayName === file) {
          displayName = file.charAt(0).toUpperCase() + file.slice(1);
        }

        html += `
          <li style="margin-bottom: 8px;">
            <a href="/charts/${file}/" target="_blank" style="text-decoration: none; font-size: 1.1em;">
              📊 <strong>${displayName}</strong>
            </a>
          </li>`;
      }
    });
  }

  html += '</ul>';
  return html;
});