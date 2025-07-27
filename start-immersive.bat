@echo off
echo Starting Quanty Immersive AI Interface...

REM Create assets directory if it doesn't exist
if not exist "assets\images" mkdir "assets\images"

REM Copy the Copilot logo to the assets directory
copy "Copilot_20250723_202049.png" "assets\images\moon-symbol.svg" /Y

REM Open the immersive-ai.html file directly in the default browser
start "" "immersive-ai.html"

echo Immersive AI interface opened in your default browser!