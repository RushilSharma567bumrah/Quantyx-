@echo off
echo 🚀 QUANTY AI - SECURE SERVER STARTUP
echo ====================================

echo.
echo 📦 Installing Node.js dependencies...
npm install

echo.
echo 🔐 Starting secure backend server...
echo 🌐 Server will run on: http://localhost:3000
echo 🛡️ API keys are now hidden from frontend!

node server.js

pause