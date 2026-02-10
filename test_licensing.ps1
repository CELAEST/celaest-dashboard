# Licensing Integration Test Script
# Tests the licensing API endpoints end-to-end

param(
    [string]$BaseUrl = "http://localhost:3100",
    [string]$Token = "",
    [string]$OrgId = ""
)

$ErrorActionPreference = "Stop"
$UseBypass = $false

# Colors for output
function Write-Success($msg) { Write-Host "  OK $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "  FAIL $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  -> $msg" -ForegroundColor Cyan }
function Write-Section($msg) { Write-Host "`n-- $msg --" -ForegroundColor Yellow }

# Auth Logic (File Fallback or Bypass)
if (-not $Token) {
    if (Test-Path "..\celaest-back\token.txt") {
        # Optional: Read token if you want, but we prefer bypass if token relies on external validation
        # Let's try to read it, but if it fails validation (401), we might want bypass.
        # Ideally, explicit flag is better. But here we adapt.
        # For now, let's PRIORITIZE Bypass if no token arg passed, because we know backend is dev.
        $UseBypass = $true
        Write-Host "Using Development Auth Bypass Headers (No Token)" -ForegroundColor Yellow
    }
    else {
        $UseBypass = $true
        Write-Host "No token file found. Using Development Auth Bypass." -ForegroundColor Yellow
    }
}

if (-not $OrgId) {
    Write-Host "Usage: .\test_licensing.ps1 -OrgId <UUID> [-Token <JWT>]" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Content-Type" = "application/json"
}

if ($UseBypass) {
    # Hardcoded Test User (Admin)
    $headers["X-Test-User-ID"] = "c8dcacdf-85bc-4777-80d7-a9a11151e289"
    $headers["X-Test-Email"] = "admin@gmail.com"
    $headers["X-Test-Role"] = "admin"
    $headers["X-Test-Org-ID"] = $OrgId
    # Note: TenantMiddleware also checks X-Test-Org-ID if configured, 
    # but usually it reads from X-Organization-ID header. 
    # Let's send BOTH to be sure.
    $headers["X-Organization-ID"] = $OrgId
}
else {
    $headers["Authorization"] = "Bearer $Token"
    $headers["X-Organization-ID"] = $OrgId
}

$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [string]$Body = $null,
        [int]$ExpectedStatus = 200
    )

    $uri = "$BaseUrl$Path"
    Write-Info "Testing: $Name ($Method $Path)"

    try {
        $params = @{
            Uri     = $uri
            Method  = $Method
            Headers = $headers
        }
        if ($Body) {
            $params.Body = $Body
        }

        $response = Invoke-WebRequest @params -ErrorAction Stop
        $statusCode = $response.StatusCode

        if ($statusCode -eq $ExpectedStatus) {
            Write-Success "$Name ($statusCode)"
            $script:passed++
            
            try {
                $data = $response.Content | ConvertFrom-Json
                return $data
            }
            catch {
                return $null
            }
        }
        else {
            Write-Fail "$Name - Expected $ExpectedStatus, got $statusCode"
            $script:failed++
            return $null
        }
    }
    catch {
        if ($_.Exception.Response) {
            $errorStatus = $_.Exception.Response.StatusCode.value__
            if ($errorStatus -eq $ExpectedStatus) {
                Write-Success "$Name ($errorStatus expected)"
                $script:passed++
                return $null
            }
            Write-Fail "$Name - Error: $errorStatus"
            # Print body if available
            try {
                $errBody = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errBody)
                $errContent = $reader.ReadToEnd()
                Write-Host "    $errContent" -ForegroundColor DarkRed
            }
            catch {}
        }
        else {
            Write-Fail "$Name - Error: $($_.Exception.Message)"
        }
        $script:failed++
        return $null
    }
}

# 1. Stats
Write-Section "1. Statistics"
$stats = Test-Endpoint -Name "GET /stats" -Method "GET" -Path "/api/v1/org/licenses/stats"
if ($stats) { Write-Info "Total: $($stats.data.total)" }

# 2. List
Write-Section "2. List"
Test-Endpoint -Name "GET /licenses" -Method "GET" -Path "/api/v1/org/licenses"

# 3. Create
Write-Section "3. Create License"
$createBody = @{
    plan_id       = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    billing_cycle = "monthly"
    notes         = "Integration Test License"
} | ConvertTo-Json
$created = Test-Endpoint -Name "POST /licenses" -Method "POST" -Path "/api/v1/org/licenses" -Body $createBody -ExpectedStatus 201

$licenseId = $null
if ($created -and $created.data) {
    $licenseId = $created.data.id
    Write-Info "Created ID: $licenseId"
}

if ($licenseId) {
    # 4. Get By ID
    Write-Section "4. Get By ID"
    Test-Endpoint -Name "GET /:id" -Method "GET" -Path "/api/v1/org/licenses/$licenseId"

    # 5. Update
    Write-Section "5. Update"
    $upBody = @{ notes = "Updated Notes" } | ConvertTo-Json
    Test-Endpoint -Name "PUT //:id" -Method "PUT" -Path "/api/v1/org/licenses/$licenseId" -Body $upBody

    # 6. Usage (Checking /stats vs /:id collision fix too)
    Write-Section "6. Usage"
    Test-Endpoint -Name "GET /:id/usage" -Method "GET" -Path "/api/v1/org/licenses/$licenseId/usage"

    # 7. Collisions (User Request)
    Write-Section "7. Collisions & Activations"
    $bind1 = @{ ip_address = "1.1.1.1"; hostname = "host1" } | ConvertTo-Json
    Test-Endpoint -Name "Activate IP 1" -Method "POST" -Path "/api/v1/org/licenses/$licenseId/bind" -Body $bind1

    $bind2 = @{ ip_address = "2.2.2.2"; hostname = "host2" } | ConvertTo-Json
    Test-Endpoint -Name "Activate IP 2" -Method "POST" -Path "/api/v1/org/licenses/$licenseId/bind" -Body $bind2

    Test-Endpoint -Name "Check Collisions" -Method "GET" -Path "/api/v1/org/licenses/$licenseId/collisions"

    # 8. Revoke (Enum Fix Check)
    Write-Section "8. Revoke"
    $revokeBody = @{ reason = "Test Revoke" } | ConvertTo-Json
    Test-Endpoint -Name "Revoke" -Method "POST" -Path "/api/v1/org/licenses/$licenseId/revoke" -Body $revokeBody
}

Write-Section "SUMMARY"
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
if ($failed -gt 0) { exit 1 }
