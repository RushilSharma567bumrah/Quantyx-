@echo off
echo Quanty AI Assistant Setup
echo.
echo The following packages will be installed:
echo - requests (API calls)
echo - python-dotenv (environment variables)
echo - SpeechRecognition (voice input)
echo - pyttsx3 (text-to-speech)
echo - pyaudio (audio processing)
echo - pocketsphinx (offline speech recognition)
echo - psutil (system control)
echo - ujson (JSON handling)
echo.
set /p choice="Do you want to install these dependencies? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo Installing dependencies...
    pip install --upgrade pip
    pip install -r requirements.txt
    echo.
    echo Installation complete! Run 'python quanty.py' to start Quanty.
) else (
    echo Installation cancelled.
)
pause