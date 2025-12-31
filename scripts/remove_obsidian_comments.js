// Hexo 脚本：在渲染 HTML 前移除 Obsidian 的 %% 注释
hexo.extend.filter.register('before_post_render', function(data){
  // 正则表达式匹配 %% 之间的内容 (包括换行符)
  // [\s\S]*? 表示非贪婪匹配所有字符
  data.content = data.content.replace(/%%[\s\S]*?%%/g, '');
  return data;
});