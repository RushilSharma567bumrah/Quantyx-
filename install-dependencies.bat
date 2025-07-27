@echo off
echo Installing Node.js dependencies...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

REM Install dependencies
npm install

echo.
echo Node.js dependencies installed successfully!
echo.
echo Installing Python dependencies...

REM Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo All dependencies installed successfully!
echo You can now run launch-quanty.bat to start Quanty.
pause