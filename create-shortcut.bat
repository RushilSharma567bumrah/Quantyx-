@echo off
echo Creating desktop shortcut for Quanty Immersive AI...

REM Get the current directory
set "CURRENT_DIR=%CD%"

REM Create a shortcut on the desktop
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Quanty Immersive AI.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%CURRENT_DIR%\immersive-ai.html" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%CURRENT_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "%CURRENT_DIR%\Copilot_20250723_202049.png, 0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Quanty Immersive AI Interface" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

REM Run the VBScript to create the shortcut
cscript /nologo "%TEMP%\CreateShortcut.vbs"

REM Delete the temporary VBScript file
del "%TEMP%\CreateShortcut.vbs"

echo Shortcut created on your desktop!