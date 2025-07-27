# 🤖 Quanty - Advanced Voice AI Assistant

Your personal JARVIS-inspired AI assistant that runs entirely in VS Code on Windows!

## 🚀 Quick Setup Guide (Complete Beginner)

### Step 1: Install Python
1. Go to [python.org](https://python.org/downloads/)
2. Download Python 3.11 or newer
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Verify installation: Open Command Prompt and type `python --version`

### Step 2: Setup VS Code
1. Download [Visual Studio Code](https://code.visualstudio.com/)
2. Install the Python extension by Microsoft
3. Open VS Code and press `Ctrl+Shift+P`, type "Python: Select Interpreter"

### Step 3: Get Your Free API Key
1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key and copy it

### Step 4: Setup Quanty
1. Open VS Code
2. Open the `quanty` folder (File → Open Folder)
3. Open the `.env` file
4. Replace `your_openrouter_api_key_here` with your actual API key
5. Save the file

### Step 5: Install Dependencies
1. In VS Code, press `Ctrl+Shift+`` (backtick) to open terminal
2. Run the installation script:
```bash
install-dependencies.bat
```
This will install both Python and Node.js dependencies.

### Step 6: Run Quanty
1. In the VS Code terminal, type:
```bash
launch-quanty.bat
```
2. Choose your preferred interface:
   - **Voice Assistant**: For hands-free operation
   - **Chat Interface**: For text-based interaction with chat history
3. For voice assistant, say **"Hi Quanty"** to wake up your assistant!

## 🎯 How to Use Quanty

### Wake Up Commands:
- "Hi Quanty"
- "Hey Quanty" 
- "Hello Quanty"

### Sleep Commands:
- "Stop Quanty"
- "Sleep Quanty"
- "Goodbye Quanty"

### Example Commands:
- "Search for the latest news about AI"
- "What's the weather like today?"
- "Open Notepad"
- "Calculate 15 times 23"
- "Translate hello to Spanish"
- "Write a Python function to sort a list"

### System Control:
- "Open Calculator"
- "Open Notepad"
- "Volume up" / "Volume down"
- "Shutdown" (with 10-second warning)

## 🌍 Supported Languages
- English
- Hindi (हिंदी)
- Spanish (Español)
- Chinese (中文)
- Japanese (日本語)
- Russian (Русский)

## 🔧 Troubleshooting

### "No module named 'pyaudio'" Error:
```bash
pip install pipwin
pipwin install pyaudio
```

### Microphone Not Working:
1. Check Windows microphone permissions
2. Ensure microphone is not muted
3. Try running VS Code as administrator

### API Errors:
1. Verify your OpenRouter API key in `.env`
2. Check your internet connection
3. Ensure you have API credits (free tier available)

### Speech Recognition Issues:
1. Speak clearly and at normal pace
2. Reduce background noise
3. Check microphone volume in Windows settings

## 🎛️ Advanced Configuration

### Change Voice Speed:
Edit line 65 in `quanty.py`:
```python
self.tts_engine.setProperty('rate', 180)  # Change 180 to desired speed
```

### Add Custom Commands:
Add to the `execute_system_command` method in `quanty.py`

### Change Models:
Modify the `models` dictionary in `quanty.py` to use different AI models from OpenRouter

## 📝 Files Explained

- `quanty.py` - Main assistant code (all functionality)
- `.env` - Your API keys (keep this private!)
- `requirements.txt` - Python packages needed
- `README.md` - This setup guide

## 🆘 Need Help?

1. Make sure Python is installed and in PATH
2. Verify all packages installed: `pip list`
3. Check your API key is correct in `.env`
4. Ensure microphone permissions are enabled
5. Try running as administrator if issues persist

## 🎉 You're Ready!

Say "Hi Quanty" and start chatting with your AI assistant! 

Quanty can help with:
- ✅ Web searches and current information
- ✅ Coding and programming help
- ✅ Language translation
- ✅ System control
- ✅ Complex reasoning and calculations
- ✅ Multilingual conversations

## 💬 New Chat Interface

Try our new ChatGPT-like interface with chat history:

1. Run `launch-quanty.bat` to open the launcher
2. Choose between Voice Assistant or Chat Interface
3. Create new chats with the "New Chat" button
4. Access your chat history from the sidebar
5. Delete chats you no longer need
6. Type "code" in your message to activate Claude 4.0 for coding tasks
7. For single words or short phrases, get dictionary definitions automatically

### Quick Access

- Use `open-chat.bat` to directly open the chat interface
- The chat interface works offline for basic interactions

## 🔊 Voice vs Chat

- **Voice Assistant**: Perfect for hands-free operation and quick questions
- **Chat Interface**: Better for coding tasks, longer conversations, and keeping a history of your interactions

Enjoy your personal AI assistant! 🚀