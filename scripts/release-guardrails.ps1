$ErrorActionPreference = "Stop"

$tsconfigPath = Join-Path $PSScriptRoot "..\\tsconfig.json"
$originalTsconfig = Get-Content -Path $tsconfigPath -Raw
$npm = (Get-Command npm.cmd).Source
$npx = (Get-Command npx.cmd).Source

try {
  & $npm run test
  if ($LASTEXITCODE -ne 0) {
    throw "npm run test failed."
  }

  & $npm run typecheck
  if ($LASTEXITCODE -ne 0) {
    throw "npm run typecheck failed."
  }

  $env:NEXT_DIST_DIR = ".next-build-check"
  & $npx next build --webpack
  if ($LASTEXITCODE -ne 0) {
    throw "npx next build --webpack failed."
  }
}
finally {
  Set-Content -Path $tsconfigPath -Value $originalTsconfig -NoNewline
  Remove-Item Env:NEXT_DIST_DIR -ErrorAction SilentlyContinue
}
