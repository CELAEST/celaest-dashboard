$ErrorActionPreference = "Stop"

# Read Token
$tokenPath = "..\celaest-back\token.txt"
if (-not (Test-Path $tokenPath)) {
    Write-Error "Token file not found at $tokenPath"
    exit 1
}

$token = Get-Content $tokenPath -Raw
$token = $token.Trim()
if ($token.StartsWith("TOKEN:")) {
    $token = $token.Substring(6)
}

# Org ID
$orgId = "d2199802-13c8-4393-92ff-14e22d0a66ac"

Write-Host "Running tests with extracted token..."
.\test_licensing.ps1 -Token $token -OrgId $orgId
