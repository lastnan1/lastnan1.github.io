# 将 Obsidian 每日论文同步到 GitHub Pages 知识库（复制 + 构建）
# 用法:
#   powershell -ExecutionPolicy Bypass -File sync-from-study.ps1
#   powershell -ExecutionPolicy Bypass -File sync-from-study.ps1 -Date 2026-06-07
#   powershell -ExecutionPolicy Bypass -File sync-from-study.ps1 -BuildOnly

param(
  [string]$Date = (Get-Date -Format "yyyy-MM-dd"),
  [switch]$BuildOnly
)

$ErrorActionPreference = "Stop"
$srcRoot = "D:\study\root\note\每日论文"
$webRoot = "D:\personal web"
$papersDir = Join-Path $webRoot "papers"
$srcDate = Join-Path $srcRoot $Date
$dstDate = Join-Path $papersDir $Date

if (-not $BuildOnly) {
  if (-not (Test-Path $srcDate)) {
    Write-Error "源目录不存在: $srcDate"
  }
  Remove-Item -Recurse -Force $dstDate -ErrorAction SilentlyContinue
  Copy-Item -Recurse $srcDate $papersDir
  Write-Host "[copy] $srcDate -> $dstDate"
}

Push-Location $webRoot
try {
  node build-papers.js
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "完成。本地预览: cd `"$webRoot`"; npx serve ."
Write-Host "发布: cd `"$webRoot`"; git add papers/ papers.json build-papers.js; git commit -m `"同步论文 $Date`"; git push"
