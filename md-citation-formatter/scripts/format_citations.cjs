#!/usr/bin/env node

/**
 * md-citation-formatter: 格式化 Markdown 文件中的数字引用
 * 
 * 将类似 "研究发现13。" 的格式转换为 "研究发现[13]。"
 * 同时避开 "15只螃蟹"、"13,000"、"2026年" 等情况。
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node format_citations.cjs <file_path1> <file_path2> ...');
  process.exit(1);
}

// 排除的量词列表（数字后面紧跟这些词时不认为是引用）
const excludedUnits = [
    '只', '个', '元', '美元', '湿吨', '克', '吨', '米', '部', '台', '岁', '年', 
    '月', '日', '万', '亿', '倍', '次', '层', '颗', '位', '项', '条', '幅', '张', 
    '件', '双', '对', '支', '把', '面', '口', '头', '匹', '条', '道', '节', '篇'
];

// 核心正则逻辑：
// 1. 前缀 ([^\d\[])：不能是数字或左中括号。
// 2. 中间 (\d{1,2})：1到2位数字。
// 3. 后缀：必须是中文或英文标点，或者换行/空白。
//    但需要排除掉“数字+量词”和“数字+小数点/逗号+数字”的情况。

const citationRegex = /([^\d\[\s])(\d{1,2})(?=[。，！？；：,.;:\s]|$)/g;

function processFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`错误: 文件不存在 - ${filePath}`);
      return;
    }

    let content = fs.readFileSync(absolutePath, 'utf8');
    let changed = false;

    // 执行替换
    const newContent = content.replace(citationRegex, (match, prefix, num, offset) => {
        // 检查数字后的下一个非空白字符
        const remaining = content.substring(offset + prefix.length + num.length);
        const nextChar = remaining.trim()[0];

        // 如果紧跟的是排除的单位，则跳过
        if (nextChar && excludedUnits.includes(nextChar)) {
            return match;
        }

        // 如果是千分位或小数点（例如 13,000 或 13.5），跳过
        if (remaining.startsWith(',') && /^\d/.test(remaining.substring(1))) return match;
        if (remaining.startsWith('.') && /^\d/.test(remaining.substring(1))) return match;

        changed = true;
        return `${prefix}[${num}]`;
    });

    if (changed) {
      fs.writeFileSync(absolutePath, newContent, 'utf8');
      console.log(`成功: 已规范化 ${filePath}`);
    } else {
      console.log(`跳过: ${filePath} 未发现需要规范的引用`);
    }
  } catch (err) {
    console.error(`处理 ${filePath} 时出错: ${err.message}`);
  }
}

args.forEach(processFile);
