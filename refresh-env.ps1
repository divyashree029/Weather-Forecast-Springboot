# Refresh Environment Variables Script
# Run this in PowerShell to reload JAVA_HOME and PATH from system settings

Write-Host "Refreshing environment variables..." -ForegroundColor Cyan

# Reload JAVA_HOME from user environment
$env:JAVA_HOME = [System.Environment]::GetEnvironmentVariable('JAVA_HOME', 'User')
if ($env:JAVA_HOME) {
    Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "JAVA_HOME not found in user environment variables" -ForegroundColor Yellow
}

# Reload PATH from both user and machine environment
$userPath = [System.Environment]::GetEnvironmentVariable('PATH', 'User')
$machinePath = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine')
$env:PATH = $userPath + ';' + $machinePath

# Verify Java is accessible
Write-Host "`nVerifying Java installation..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "Java is accessible: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "Java is NOT accessible. You may need to restart your terminal." -ForegroundColor Red
}

Write-Host "`nEnvironment variables refreshed!" -ForegroundColor Green

