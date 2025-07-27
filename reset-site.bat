@echo off
echo Resetting Quanty Immersive AI site data...

REM Clear browser cache instructions
echo.
echo Please follow these steps to clear your browser cache:
echo.
echo 1. Open your browser
echo 2. Press Ctrl+Shift+Delete
echo 3. Select "Cookies and site data"
echo 4. Select "Cached images and files"
echo 5. Click "Clear data"
echo.
echo After clearing your cache, try opening the site again.
echo.

REM Open the immersive-ai.html file
echo Opening Quanty Immersive AI...
timeout /t 3 > nul
start "" "immersive-ai.html"

echo Done!