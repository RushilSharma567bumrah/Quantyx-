@echo off
echo Opening Quanty Chat Interface...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed or not in PATH. Opening chat interface directly...
    start "" "chat-interface.html"
) else (
    echo Starting launcher server...
    start /B node launcher-server.js
    
    REM Wait a moment for the server to start
    timeout /t 2 /nobreak >nul
    
    REM Open the browser directly to the chat interface
    start "" "http://localhost:3000/chat"
    
    echo Chat interface is open. Server is running in the background.
)

echo Enjoy using Quanty Chat!