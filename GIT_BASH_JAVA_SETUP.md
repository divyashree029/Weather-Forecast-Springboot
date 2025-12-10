# Git Bash Java Setup

## ✅ Configuration Complete

I've created a `.bashrc` file in your Git Bash home directory (`C:\Users\Divya\AppData\Roaming\SPB_Data\.bashrc`) that configures Java for Git Bash.

**Note:** Your Git Bash home directory is `C:\Users\Divya\AppData\Roaming\SPB_Data`, not the standard Windows home directory.

## How to Use

1. **Close and reopen your Git Bash terminal** - The `.bashrc` file is automatically loaded when Git Bash starts.

2. **Or manually reload the configuration:**
   ```bash
   source ~/.bashrc
   ```

3. **Verify Java is working:**
   ```bash
   java -version
   ```

4. **Run your Spring Boot application:**
   ```bash
   java -jar target/weather-api-1.0.0.jar
   ```

## What Was Configured

- **JAVA_HOME**: Set to `/c/Users/Divya/.jdks/openjdk-24.0.1`
- **PATH**: Added Java's bin directory to your PATH

## Troubleshooting

If Java still doesn't work after reopening Git Bash:

1. Check if the path is correct:
   ```bash
   echo $JAVA_HOME
   ls $JAVA_HOME/bin/java.exe
   ```

2. Manually set it in your current session:
   ```bash
   export JAVA_HOME="/c/Users/Divya/.jdks/openjdk-24.0.1"
   export PATH="$JAVA_HOME/bin:$PATH"
   ```

3. Verify the Java installation exists:
   ```bash
   ls /c/Users/Divya/.jdks/openjdk-24.0.1/bin/java.exe
   ```

## Note

Git Bash uses Unix-style paths. The `/c/` prefix is automatically converted to `C:/` by Git Bash.

