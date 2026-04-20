---
name: content-audit-formatter
description: 为 Markdown 文档执行敏感词脱敏替换。当用户需要发布政治、军事类内容（如涉及美国、中国、伊朗等）到公众号或其他严审平台时使用。
---

# Content Audit Formatter

## 概述

此技能专门用于将文档中的政治、军事相关敏感词汇替换为特定代称，以降低在严审平台（如微信公众号）上的违规风险。

## 核心功能

### 1. 批量词汇脱敏
使用内置脚本，将预设的敏感词列表自动替换为设定的安全词汇。

**转换示例：**
- `美国` -> `山姆大叔`
- `特朗普` -> `建国同志`
- `中国` -> `东大`
- `霍尔木兹海峡` -> `H海峡`

## 使用方法

### 批量处理文件
运行以下脚本对特定 Markdown 文件进行处理：

```bash
node content-audit-formatter/scripts/audit_replace.cjs <文件路径>
```

## 词汇管理

敏感词与代称的映射存储在：
`content-audit-formatter/references/sensitive_words.json`

你可以根据需要手动更新该映射表以包含更多词汇，如：
- `拜登` -> `睡王`
- `伊朗` -> `波斯`
- `中东` -> `火药桶区域`
- `以色列` -> `犹大`
