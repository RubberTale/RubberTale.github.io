$dir = $PSScriptRoot
$line = "`n如果有人想获得本书的全集，可以在评论区留下888，我将全书完成以后一并发出。`n"

$files = @(
    "10.5 天然橡胶的加工与分类.md",
    "11.1 什么是期货？从农产品远期合约到现代期货交易.md",
    "11.2 橡胶为什么需要期货：价格剧烈波动与产业避险需求.md",
    "11.3 早期橡胶贸易的定价方式：从现货议价到集中交易.md",
    "11.4 纽约商品交易所与早期橡胶期货尝试.md",
    "11.5 伦敦：全球天然橡胶定价中心的形成.md",
    "11.6 新加坡商品交易所（SICOM）：东南亚产区的定价话语权.md",
    "12.1 东京工业品交易所（TOCOM）橡胶期货：亚洲最早的橡胶期货市场.md",
    "12.2 日本橡胶期货的黄金年代与经典行情回顾.md",
    "12.3 上海期货交易所（SHFE）天然橡胶期货的诞生（1993年）.md",
    "12.4 海南中商所、上海商品交易所的早期探索与整合.md",
    "12.5 SHFE天然橡胶期货的制度演化与市场成长.md",
    "12.6 沪胶合约设计的演变：从标准胶到全乳胶、混合胶.md"
)

foreach ($f in $files) {
    $path = Join-Path $dir $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        $content = $content.TrimEnd()
        $content += $line
        [System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
        Write-Host "OK: $f"
    } else {
        Write-Host "NOT FOUND: $f"
    }
}
