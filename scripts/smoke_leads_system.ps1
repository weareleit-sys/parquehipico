param(
  [string]$BaseUrl = "http://localhost:3000",
  [string]$EnvPath = ".env.local"
)

$ErrorActionPreference = "Stop"

function Read-EnvFile($Path) {
  $vars = @{}
  if (-not (Test-Path $Path)) { return $vars }
  Get-Content $Path | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
      $vars[$matches[1].Trim()] = $matches[2].Trim().Trim('"')
    }
  }
  return $vars
}

function Check($Name, [scriptblock]$Block) {
  try {
    $result = & $Block
    [pscustomobject]@{ Check = $Name; Status = "PASS"; Detail = $result }
  } catch {
    [pscustomobject]@{ Check = $Name; Status = "FAIL"; Detail = $_.Exception.Message }
  }
}

$envVars = Read-EnvFile $EnvPath
$checks = @()

$checks += Check "Dashboard HTTP" {
  $res = Invoke-WebRequest -Uri "$BaseUrl/dashboard" -UseBasicParsing -TimeoutSec 60
  "HTTP $($res.StatusCode)"
}

$checks += Check "Lead list API" {
  $res = Invoke-RestMethod -Uri "$BaseUrl/api/leads/list?page=1&limit=1&estado=todos" -TimeoutSec 30
  "$($res.total) leads"
}

$checks += Check "Stats API" {
  $list = Invoke-RestMethod -Uri "$BaseUrl/api/leads/list?page=1&limit=1&estado=todos" -TimeoutSec 30
  $stats = Invoke-RestMethod -Uri "$BaseUrl/api/leads/stats" -TimeoutSec 30
  if ([int]$list.total -ne [int]$stats.total) {
    throw "list total $($list.total) != stats total $($stats.total)"
  }
  $categoryTotal = 0
  $stats.byCategory.PSObject.Properties | ForEach-Object { $categoryTotal += [int]$_.Value }
  if ($categoryTotal -ne [int]$stats.total) {
    throw "category total $categoryTotal != stats total $($stats.total)"
  }
  "total=$($stats.total), categories=$categoryTotal"
}

$checks += Check "Category counts" {
  $categories = @("educacion", "turismo", "comunidad", "cumpleanos", "municipal")
  $parts = foreach ($category in $categories) {
    $res = Invoke-RestMethod -Uri "$BaseUrl/api/leads/list?page=1&limit=1&estado=todos&categoria=$category" -TimeoutSec 30
    "$category=$($res.total)"
  }
  $parts -join ", "
}

$checks += Check "Empty save validation" {
  try {
    Invoke-WebRequest -Uri "$BaseUrl/api/leads/save" -Method POST -Body "{}" -ContentType "application/json" -UseBasicParsing -TimeoutSec 15 | Out-Null
    "unexpected 200"
  } catch {
    $status = [int]$_.Exception.Response.StatusCode
    if ($status -ne 400) { throw "Expected 400, got $status" }
    "HTTP 400"
  }
}

$checks += Check "Supabase anon REST" {
  $url = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
  $anon = $envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
  if (-not $url -or -not $anon) { throw "Missing Supabase URL or anon key in $EnvPath" }

  $res = Invoke-WebRequest -Uri "$url/rest/v1/leads?select=id,empresa&limit=1" `
    -Headers @{ apikey = $anon; Authorization = "Bearer $anon" } `
    -UseBasicParsing -TimeoutSec 20

  if ($res.Content -and $res.Content -ne "[]") {
    throw "Anon key can read lead data"
  }
  "no public lead data"
}

$checks | Format-Table -AutoSize

if ($checks.Status -contains "FAIL") {
  exit 1
}
