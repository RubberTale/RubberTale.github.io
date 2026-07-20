# Read last 3 lines of each target file
$files = Get-ChildItem -Path "." -Filter "*.md" | Where-Object {
    $_.Name -match "^13\.[5-8]|^14\.[1-3]"
} | Sort-Object Name

foreach ($f in $files) {
    $lines = Get-Content -Path $f.FullName -Encoding UTF8
    $total = $lines.Count
    Write-Host "===FILE: $($f.Name) TOTAL_LINES: $total"
    $start = [Math]::Max(0, $total - 3)
    for ($i = $start; $i -lt $total; $i++) {
        Write-Host "$($i+1): $($lines[$i])"
    }
    Write-Host ""
}
