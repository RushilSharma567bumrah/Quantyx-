// QUANTY VOICE INPUT SYSTEM - WHISPER API + VOICE INTEGRATIONS
console.log('🎤 LOADING VOICE INPUT SYSTEM...');

// Voice Input Manager
class VoiceInputManager {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.voiceProviders = this.initVoiceProviders();
    this.currentProvider = 'browser';
    this.initializeVoiceInput();
  }
  
  initVoiceProviders() {
    return {
      'browser': {
        name: 'Browser Speech Recognition',
        available: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        realtime: true,
        accuracy: 'medium'
      },
      'whisper': {
        name: 'OpenAI Whisper API',
        available: true,
        realtime: false,
        accuracy: 'high'
      },
      'voice-in': {
        name: 'Voice In Extension',
        available: this.detectVoiceInExtension(),
        realtime: true,
        accuracy: 'high'
      },
      'voice-notebook': {
        name: 'Voice Notebook',
        available: this.detectVoiceNotebook(),
        realtime: true,
        accuracy: 'high'
      },
      'typingmind': {
        name: 'TypingMind Voice Input',
        available: true,
        realtime: true,
        accuracy: 'high'
      }
    };
  }
  
  detectVoiceInExtension() {
    // Check if Voice In extension is available
    return typeof window.voiceIn !== 'undefined' || 
           document.querySelector('[data-voice-in]') !== null;
  }
  
  detectVoiceNotebook() {
    // Check if Voice Notebook is available
    return typeof window.voiceNotebook !== 'undefined' ||
           navigator.userAgent.includes('VoiceNotebook');
  }
  
  initializeVoiceInput() {
    // Initialize browser speech recognition
    if (this.voiceProviders.browser.available) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        this.handleSpeechResult(event);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.stopListening();
      };
    }
    
    // Initialize media recorder for Whisper API
    this.initializeMediaRecorder();
    
    console.log('🎤 Voice Input System Ready');
    this.logAvailableProviders();
  }
  
  async initializeMediaRecorder() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = () => {
        this.processWhisperAudio();
      };
      
    } catch (error) {
      console.warn('Microphone access denied:', error);
    }
  }
  
  logAvailableProviders() {
    console.log('🎤 Available Voice Providers:');
    Object.entries(this.voiceProviders).forEach(([key, provider]) => {
      const status = provider.available ? '✅' : '❌';
      console.log(`   ${status} ${provider.name} (${provider.accuracy} accuracy)`);
    });
  }
  
  // Start voice input with selected provider
  async startListening(provider = 'auto') {
    if (this.isListening) return;
    
    // Auto-select best available provider
    if (provider === 'auto') {
      provider = this.selectBestProvider();
    }
    
    this.currentProvider = provider;
    this.isListening = true;
    
    console.log(`🎤 Starting voice input with ${this.voiceProviders[provider].name}`);
    
    try {
      switch (provider) {
        case 'browser':
          await this.startBrowserRecognition();
          break;
        case 'whisper':
          await this.startWhisperRecording();
          break;
        case 'voice-in':
          await this.startVoiceInIntegration();
          break;
        case 'voice-notebook':
          await this.startVoiceNotebookIntegration();
          break;
        case 'typingmind':
          await this.startTypingMindIntegration();
          break;
        default:
          await this.startBrowserRecognition();
      }
      
      this.showVoiceIndicator();
      
    } catch (error) {
      console.error('Failed to start voice input:', error);
      this.isListening = false;
    }
  }
  
  stopListening() {
    if (!this.isListening) return;
    
    this.isListening = false;
    
    switch (this.currentProvider) {
      case 'browser':
        if (this.recognition) this.recognition.stop();
        break;
      case 'whisper':
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
        break;
      default:
        if (this.recognition) this.recognition.stop();
    }
    
    this.hideVoiceIndicator();
    console.log('🎤 Voice input stopped');
  }
  
  selectBestProvider() {
    // Priority order: Voice In > Whisper > Voice Notebook > TypingMind > Browser
    const priority = ['voice-in', 'whisper', 'voice-notebook', 'typingmind', 'browser'];
    
    for (const provider of priority) {
      if (this.voiceProviders[provider].available) {
        return provider;
      }
    }
    
    return 'browser';
  }
  
  async startBrowserRecognition() {
    if (this.recognition) {
      this.recognition.start();
    }
  }
  
  async startWhisperRecording() {
    if (this.mediaRecorder) {
      this.audioChunks = [];
      this.mediaRecorder.start();
    }
  }
  
  async startVoiceInIntegration() {
    // Integrate with Voice In extension
    if (window.voiceIn) {
      window.voiceIn.start({
        target: document.getElementById('chatInput'),
        onResult: (text) => this.handleVoiceResult(text)
      });
    } else {
      // Fallback to browser recognition
      await this.startBrowserRecognition();
    }
  }
  
  async startVoiceNotebookIntegration() {
    // Integrate with Voice Notebook
    if (window.voiceNotebook) {
      window.voiceNotebook.startDictation({
        onResult: (text) => this.handleVoiceResult(text)
      });
    } else {
      // Fallback to browser recognition
      await this.startBrowserRecognition();
    }
  }
  
  async startTypingMindIntegration() {
    // TypingMind Voice Input integration
    try {
      const response = await fetch('/api/voice/typingmind/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const { sessionId } = await response.json();
        this.typingMindSessionId = sessionId;
        this.pollTypingMindResults();
      }
    } catch (error) {
      console.error('TypingMind integration failed:', error);
      await this.startBrowserRecognition();
    }
  }
  
  async processWhisperAudio() {
    if (this.audioChunks.length === 0) return;
    
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    try {
      const response = await fetch('/api/voice/whisper', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.text) {
        this.handleVoiceResult(result.text);
      }
      
    } catch (error) {
      console.error('Whisper API error:', error);
    }
    
    this.audioChunks = [];
  }
  
  handleSpeechResult(event) {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    if (finalTranscript) {
      this.handleVoiceResult(finalTranscript);
    } else if (interimTranscript) {
      this.showInterimResult(interimTranscript);
    }
  }
  
  handleVoiceResult(text) {
    console.log('🎤 Voice Result:', text);
    
    // Insert text into chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.value = text;
      chatInput.focus();
      
      // Trigger input event for any listeners
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Auto-send if enabled
    if (this.autoSendEnabled) {
      this.sendMessage(text);
    }
    
    this.stopListening();
  }
  
  showInterimResult(text) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.placeholder = `Listening: "${text}"`;
    }
  }
  
  sendMessage(text) {
    // Trigger send button click
    const sendButton = document.getElementById('chatSend');
    if (sendButton) {
      sendButton.click();
    }
  }
  
  showVoiceIndicator() {
    // Create or show voice indicator
    let indicator = document.getElementById('voiceIndicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'voiceIndicator';
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #4f83cc, #805ad5);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(79, 131, 204, 0.3);
        ">
          <div class="voice-animation">
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
          </div>
          <span>🎤 Listening with ${this.voiceProviders[this.currentProvider].name}</span>
          <button onclick="voiceManager.stopListening()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
          ">Stop</button>
        </div>
      `;
      document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
  }
  
  hideVoiceIndicator() {
    const indicator = document.getElementById('voiceIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
    
    // Reset chat input placeholder
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.placeholder = 'Type your message here...';
    }
  }
  
  // Toggle voice input
  toggleVoiceInput() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }
  
  // Set provider preference
  setProvider(provider) {
    if (this.voiceProviders[provider] && this.voiceProviders[provider].available) {
      this.currentProvider = provider;
      console.log(`🎤 Voice provider set to: ${this.voiceProviders[provider].name}`);
    }
  }
}

// Initialize voice manager
const voiceManager = new VoiceInputManager();

// Add voice button to chat interface
function addVoiceButton() {
  const chatInputContainer = document.querySelector('.chat-input-container');
  if (chatInputContainer && !document.getElementById('voiceButton')) {
    const voiceButton = document.createElement('button');
    voiceButton.id = 'voiceButton';
    voiceButton.innerHTML = '🎤';
    voiceButton.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f83cc, #805ad5);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-left: 10px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(79, 131, 204, 0.3);
    `;
    
    voiceButton.addEventListener('click', () => {
      voiceManager.toggleVoiceInput();
    });
    
    voiceButton.addEventListener('mouseenter', () => {
      voiceButton.style.transform = 'scale(1.1)';
      voiceButton.style.boxShadow = '0 6px 20px rgba(79, 131, 204, 0.5)';
    });
    
    voiceButton.addEventListener('mouseleave', () => {
      voiceButton.style.transform = 'scale(1)';
      voiceButton.style.boxShadow = '0 4px 15px rgba(79, 131, 204, 0.3)';
    });
    
    chatInputContainer.appendChild(voiceButton);
  }
}

// Add keyboard shortcut (Ctrl+Shift+V)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault();
    voiceManager.toggleVoiceInput();
  }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(addVoiceButton, 1000);
});

// Make functions globally available
window.voiceManager = voiceManager;
window.startVoiceInput = () => voiceManager.startListening();
window.stopVoiceInput = () => voiceManager.stopListening();

console.log('🎤 VOICE INPUT SYSTEM READY');
console.log('🎯 Providers: Whisper API, Voice In, Voice Notebook, TypingMind');
console.log('⌨️ Shortcut: Ctrl+Shift+V to toggle voice input');