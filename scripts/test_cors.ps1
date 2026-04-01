param(
  [string]$ApiUrl = 'http://localhost:5000',
  [string]$Path = '/api/products'
)

$full = "$ApiUrl$Path"
Write-Host "Testing OPTIONS preflight to: $full"

try {
  $options = Invoke-WebRequest -Method Options -Uri $full -UseBasicParsing -Headers @{ 'Origin' = 'http://localhost:5173' }
  Write-Host "OPTIONS status: $($options.StatusCode)"
  $options.Headers.GetEnumerator() | ForEach-Object { Write-Host "$($_.Name): $($_.Value)" }
} catch {
  Write-Host "OPTIONS request failed: $_"
}

Write-Host "\nTesting GET to: $full"
try {
  $get = Invoke-WebRequest -Method Get -Uri $full -UseBasicParsing -Headers @{ 'Origin' = 'http://localhost:5173' }
  Write-Host "GET status: $($get.StatusCode)"
  $get.Headers.GetEnumerator() | ForEach-Object { Write-Host "$($_.Name): $($_.Value)" }
} catch {
  Write-Host "GET request failed: $_"
}
