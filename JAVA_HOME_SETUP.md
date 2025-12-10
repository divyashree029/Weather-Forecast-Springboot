# Setting JAVA_HOME on Windows

This guide will help you set the `JAVA_HOME` environment variable correctly so you can run Maven commands.

## Quick Setup (Recommended)

Run the provided PowerShell script:

```powershell
.\setup-java-home.ps1
```

This script will:
- Automatically find Java installations on your system
- Let you select which Java version to use
- Set JAVA_HOME for the current session
- Optionally set it permanently

## Manual Setup

### Step 1: Find Your Java Installation

Java is typically installed in one of these locations:
- `C:\Program Files\Java\jdk-17` (or similar version)
- `C:\Program Files\Eclipse Adoptium\jdk-17` (or similar version)
- `C:\Program Files\Microsoft\jdk-17` (or similar version)

To find it manually:
1. Open File Explorer
2. Navigate to `C:\Program Files\Java` or `C:\Program Files`
3. Look for folders starting with `jdk` or `java`

### Step 2: Set JAVA_HOME Temporarily (Current Session Only)

In PowerShell, run:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

Replace `C:\Program Files\Java\jdk-17` with your actual Java installation path.

### Step 3: Set JAVA_HOME Permanently

#### Option A: Using PowerShell (Recommended)

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", [System.EnvironmentVariableTarget]::User)
```

Replace `C:\Program Files\Java\jdk-17` with your actual Java installation path.

#### Option B: Using Windows GUI

1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", click "New"
5. Variable name: `JAVA_HOME`
6. Variable value: Your Java installation path (e.g., `C:\Program Files\Java\jdk-17`)
7. Click "OK" on all dialogs
8. **Restart your terminal/PowerShell** for changes to take effect

### Step 4: Verify JAVA_HOME is Set

```powershell
echo $env:JAVA_HOME
```

This should display your Java installation path.

### Step 5: Verify Java Works

```powershell
java -version
```

You should see Java version information. Your project requires **Java 17 or higher**.

## If Java is Not Installed

1. Download Java JDK 17 or higher from:
   - **Eclipse Adoptium** (recommended): https://adoptium.net/
   - **Oracle**: https://www.oracle.com/java/technologies/downloads/

2. Install Java following the installer instructions

3. Run the setup script or follow the manual setup steps above

## Troubleshooting

### "JAVA_HOME is not defined correctly"
- Make sure JAVA_HOME points to the JDK root directory (not the `bin` folder)
- Example: `C:\Program Files\Java\jdk-17` ✅
- Wrong: `C:\Program Files\Java\jdk-17\bin` ❌

### "Java is not recognized"
- Make sure Java is installed
- Add Java's `bin` folder to your PATH:
  ```powershell
  $env:PATH += ";$env:JAVA_HOME\bin"
  ```

### Changes Not Taking Effect
- Close and reopen your terminal/PowerShell
- If using permanent settings, you may need to log out and log back in

## After Setting JAVA_HOME

Once JAVA_HOME is set correctly, you can run:

```powershell
mvn clean install
```

This will build your Spring Boot project successfully.

