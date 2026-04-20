const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Error: Please provide a file path.');
  process.exit(1);
}

// 默认映射文件路径
const mappingPath = path.join(__dirname, '..', 'references', 'sensitive_words.json');

try {
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  let content = fs.readFileSync(filePath, 'utf8');

  // 构建正则表达式，确保不匹配单词的一部分（如果需要的话，目前以中文字符为主）
  // 针对中文，直接替换即可
  for (const [key, value] of Object.entries(mapping)) {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Success: Formatted ${filePath} using sensitive word mapping.`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
