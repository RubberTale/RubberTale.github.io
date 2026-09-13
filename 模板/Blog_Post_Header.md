<%*
// 1. 获取编辑器对象和当前全文内容
const editor = app.workspace.activeLeaf.view.editor;
const content = editor.getValue();
const lines = content.split("\n");

// 2. 寻找并提取第一行标题 (# 开头)
let title = tp.file.title; // 默认备选：文件名
let headerIndex = lines.findIndex(line => line.trim().startsWith("# "));

if (headerIndex !== -1) {
    const headerLine = lines[headerIndex];
    // 去掉 # 号和非法文件名字符
    const extractedTitle = headerLine.replace(/^#\s+/, "").replace(/[\\/:*?"<>|]/g, "").trim();
    
    // 如果提取到了有效标题，执行重命名
    if (extractedTitle && extractedTitle !== title) {
        await tp.file.rename(extractedTitle);
        title = extractedTitle;
    }
    
    // 【关键步骤】删除原来的标题行
    lines.splice(headerIndex, 1);
}

// 3. 清理开头可能残留的空行
while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
}

// 4. 重新组装全文结构
// 结构：Frontmatter -> 空行(光标位) -> more标签 -> 剩余正文
const body = lines.join("\n");
const date = tp.date.now("YYYY-MM-DD HH:mm:ss");

const newContent = `---
title: ${title}
date: ${date}
tags: []
categories: 
---

${body}`;

// 5. 一键替换全文
editor.setValue(newContent);

// 6. 调整光标位置
// 我们希望光标停在 --- 和 中间的那一行
// 也就是第 6 行 (Line index 6, 因为从0开始数: 0-5是Frontmatter, 6是空行)
editor.setCursor({line: 6, ch: 0});
%>