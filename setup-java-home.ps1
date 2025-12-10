# Script to find Java installation and set JAVA_HOME
Write-Host "Searching for Java installations..." -ForegroundColor Cyan

# Common Java installation locations
$searchPaths = @(
    "C:\Program Files\Java",
    "C:\Program Files (x86)\Java",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium",
    "$env:LOCALAPPDATA\Programs\Microsoft",
    "$env:ProgramFiles\Eclipse Adoptium",
    "$env:ProgramFiles\Microsoft",
    "$env:USERPROFILE\.jdks"
)

$javaInstallations = @()

# Search in common locations
foreach ($path in $searchPaths) {
    if (Test-Path $path) {
        $jdkDirs = Get-ChildItem -Path $path -Directory -ErrorAction SilentlyContinue | Where-Object { 
            $_.Name -match "jdk|java" -and (Test-Path (Join-Path $_.FullName "bin\java.exe"))
        }
        foreach ($jdk in $jdkDirs) {
            $javaPath = Join-Path $jdk.FullName "bin\java.exe"
            if (Test-Path $javaPath) {
                $version = & $javaPath -version 2>&1 | Select-Object -First 1
                $javaInstallations += [PSCustomObject]@{
                    Path = $jdk.FullName
                    Version = $version
                }
            }
        }
    }
}

# Also check if java is in PATH
try {
    $javaInPath = Get-Command java -ErrorAction Stop
    if ($javaInPath) {
        $javaExe = $javaInPath.Source
        $javaDir = Split-Path (Split-Path $javaExe -Parent) -Parent
        if ($javaDir -and (Test-Path (Join-Path $javaDir "bin\java.exe"))) {
            $version = & $javaExe -version 2>&1 | Select-Object -First 1
            $javaInstallations += [PSCustomObject]@{
                Path = $javaDir
                Version = $version
            }
        }
    }
} catch {
    # Java not in PATH
}

if ($javaInstallations.Count -eq 0) {
    Write-Host "`nNo Java installation found!" -ForegroundColor Red
    Write-Host "`nPlease install Java 17 or higher:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://adoptium.net/ (recommended)" -ForegroundColor White
    Write-Host "   or https://www.oracle.com/java/technologies/downloads/" -ForegroundColor White
    Write-Host "2. Install Java JDK 17 or higher" -ForegroundColor White
    Write-Host "3. Run this script again to set JAVA_HOME" -ForegroundColor White
    exit 1
}

Write-Host "`nFound Java installation(s):" -ForegroundColor Green
for ($i = 0; $i -lt $javaInstallations.Count; $i++) {
    Write-Host "[$($i+1)] $($javaInstallations[$i].Path)" -ForegroundColor White
    Write-Host "     Version: $($javaInstallations[$i].Version)" -ForegroundColor Gray
}

if ($javaInstallations.Count -eq 1) {
    $selectedJava = $javaInstallations[0].Path
    Write-Host "`nUsing: $selectedJava" -ForegroundColor Green
} else {
    $choice = Read-Host "`nSelect Java installation (1-$($javaInstallations.Count))"
    $index = [int]$choice - 1
    if ($index -ge 0 -and $index -lt $javaInstallations.Count) {
        $selectedJava = $javaInstallations[$index].Path
    } else {
        Write-Host "Invalid selection!" -ForegroundColor Red
        exit 1
    }
}

# Set JAVA_HOME for current session
$env:JAVA_HOME = $selectedJava
Write-Host "`nJAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green

# Verify
Write-Host "`nVerifying Java installation..." -ForegroundColor Cyan
$javaExe = Join-Path $env:JAVA_HOME "bin\java.exe"
if (Test-Path $javaExe) {
    & $javaExe -version
    Write-Host "`nJava is working correctly!" -ForegroundColor Green
} else {
    Write-Host "Error: java.exe not found at $javaExe" -ForegroundColor Red
    exit 1
}

# Set permanently
Write-Host "`nDo you want to set JAVA_HOME permanently? (Y/N)" -ForegroundColor Yellow
$permanent = Read-Host
if ($permanent -eq "Y" -or $permanent -eq "y") {
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $selectedJava, [System.EnvironmentVariableTarget]::User)
    Write-Host "JAVA_HOME has been set permanently for your user account." -ForegroundColor Green
    Write-Host "You may need to restart your terminal for the change to take effect." -ForegroundColor Yellow
} else {
    Write-Host "`nJAVA_HOME is set for this session only." -ForegroundColor Yellow
    Write-Host "To set it permanently, run:" -ForegroundColor White
    Write-Host "[System.Environment]::SetEnvironmentVariable('JAVA_HOME', '$selectedJava', [System.EnvironmentVariableTarget]::User)" -ForegroundColor Cyan
}

Write-Host "`nYou can now run: mvn clean install" -ForegroundColor Green

