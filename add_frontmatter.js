const fs = require('fs');
const path = require('path');

// ------------------  配置区域  ------------------
const postsDir = path.join(__dirname, 'source', '_posts'); // Markdown 文件所在的目录 (通常是 source/_posts)
// 默认 Frontmatter 模板 **移到 forEach 循环内部**  (removed from here)
// ------------------  配置区域结束  ------------------


function addFrontmatterToMarkdownFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            // 如果是目录，递归处理子目录 (如果您的 Markdown 文件分布在多层目录下)
            addFrontmatterToMarkdownFiles(filePath);
        } else if (path.extname(file).toLowerCase() === '.md') {
            // 如果是 Markdown 文件 (.md 后缀)
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // 默认 Frontmatter 模板 **定义在 forEach 循环内部, filePath 在这里是可用的**
            const defaultFrontmatter = `---
title: ${path.basename(filePath, '.md')}
date: ${new Date().toISOString()}
tags:
---
`; // 默认 Frontmatter 模板,  title 会自动使用文件名, date 会自动使用当前日期, tags 默认为空


            // 检查文件是否已经有 Frontmatter (简单的判断方法: 查找是否以 --- 开头)
            if (!fileContent.startsWith('---')) {
                // 如果没有 Frontmatter，则添加默认 Frontmatter
                const newContent = defaultFrontmatter + fileContent;
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`已为文件添加 Frontmatter: ${filePath}`);
            } else {
                console.log(`文件已存在 Frontmatter, 跳过: ${filePath}`);
            }
        }
    });
}

// 执行脚本，处理 Markdown 文件
addFrontmatterToMarkdownFiles(postsDir);

console.log('Frontmatter 添加处理完成！');