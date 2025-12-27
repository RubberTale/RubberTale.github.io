/**
 * Hexo Tag Plugin: MyChart
 * 使用方法: {% mychart folder_name [height] %}
 * 示例: {% mychart spforcast %} 或 {% mychart spforcast 800 %}
 */
hexo.extend.tag.register('mychart', function(args){
  var chartName = args[0];
  // 如果用户没填高度，默认给 600，填了就用填的
  var height = args[1] || 600; 

  // 注意：这里保留了 onload 自动调整高度的逻辑，
  // 但为了防止初始高度太小导致闪烁，给了一个 min-height
  return `
  <div style="width: 100%; margin: 20px 0;">
    <iframe 
      src="/charts/${chartName}/" 
      width="100%" 
      height="${height}"
      scrolling="no" 
      style="border:none; min-height: ${height}px;"
      onload="setTimeout(()=>{this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px'}, 500);">
    </iframe>
  </div>
  `;
});