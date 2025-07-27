@echo off
echo Starting Quanty Launcher...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed or not in PATH. Opening launcher directly...
    start "" "launcher.html"
) else (
    echo Starting launcher server...
    start /B node launcher-server.js
    
    REM Wait a moment for the server to start
    timeout /t 2 /nobreak >nul
    
    REM Open the browser directly
    start "" "http://localhost:3000"
    
    echo Launcher server is running. Press Ctrl+C in the terminal window to stop it.
)

echo Enjoy using Quanty!