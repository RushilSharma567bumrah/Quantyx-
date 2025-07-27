// QUANTY ADVANCED NLP ENGINE - UNIVERSAL SOFTWARE COMPATIBILITY
console.log('🧠 LOADING ADVANCED NLP ENGINE...');

// UNIVERSAL NLP PROCESSOR
class QuantyNLP {
  constructor() {
    this.initializeNLP();
    this.loadLanguageModels();
    this.setupIntentClassification();
  }
  
  initializeNLP() {
    // Intent patterns for better understanding
    this.intentPatterns = {
      question: /^(what|how|why|when|where|who|which|can|could|would|should|is|are|do|does|did)/i,
      request: /^(please|can you|could you|would you|help me|i need|i want)/i,
      command: /^(open|close|start|stop|run|execute|launch|install|download|create|delete|show|hide)/i,
      explanation: /^(explain|describe|tell me about|what is|define|meaning of)/i,
      comparison: /^(compare|difference|versus|vs|better|worse|which is)/i,
      tutorial: /^(how to|tutorial|guide|step by step|teach me|learn)/i,
      troubleshoot: /^(error|problem|issue|fix|solve|debug|not working|broken)/i,
      code: /^(code|program|script|function|class|method|algorithm)/i
    };
    
    // Entity extraction patterns
    this.entityPatterns = {
      software: /\b(windows|linux|macos|android|ios|chrome|firefox|safari|edge|vscode|photoshop|office|excel|word|powerpoint|outlook|teams|zoom|discord|slack|github|docker|kubernetes|aws|azure|gcp)\b/gi,
      programming: /\b(python|javascript|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|typescript|html|css|sql|react|vue|angular|node|django|flask|spring|laravel)\b/gi,
      file_types: /\b(\.txt|\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.jpg|\.png|\.gif|\.mp4|\.mp3|\.zip|\.rar|\.exe|\.dmg|\.deb|\.rpm)\b/gi,
      numbers: /\b\d+(?:\.\d+)?\b/g,
      urls: /https?:\/\/[^\s]+/g,
      emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    };
    
    // Context understanding
    this.contextKeywords = {
      installation: ['install', 'setup', 'download', 'configure', 'deploy'],
      troubleshooting: ['error', 'bug', 'issue', 'problem', 'fix', 'solve', 'debug'],
      tutorial: ['how to', 'guide', 'tutorial', 'step', 'learn', 'teach'],
      comparison: ['vs', 'versus', 'compare', 'difference', 'better', 'best'],
      performance: ['slow', 'fast', 'optimize', 'speed', 'performance', 'memory'],
      security: ['secure', 'password', 'encrypt', 'vulnerability', 'hack', 'safe']
    };
  }
  
  loadLanguageModels() {
    // Lightweight language detection
    this.languagePatterns = {
      english: /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi,
      spanish: /\b(el|la|los|las|y|o|pero|en|con|de|para|por)\b/gi,
      french: /\b(le|la|les|et|ou|mais|dans|avec|de|pour|par)\b/gi,
      german: /\b(der|die|das|und|oder|aber|in|mit|von|für|durch)\b/gi,
      italian: /\b(il|la|gli|le|e|o|ma|in|con|di|per|da)\b/gi,
      portuguese: /\b(o|a|os|as|e|ou|mas|em|com|de|para|por)\b/gi,
      russian: /\b(и|или|но|в|на|с|от|для|по|за)\b/gi,
      chinese: /[\u4e00-\u9fff]/g,
      japanese: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/g,
      arabic: /[\u0600-\u06ff]/g,
      hindi: /[\u0900-\u097f]/g
    };
  }
  
  setupIntentClassification() {
    // Software-specific intent classification
    this.softwareIntents = {
      windows: {
        patterns: ['windows', 'microsoft', 'cmd', 'powershell', 'registry', 'control panel'],
        responses: 'Windows-specific guidance available'
      },
      linux: {
        patterns: ['linux', 'ubuntu', 'debian', 'centos', 'bash', 'terminal', 'sudo'],
        responses: 'Linux/Unix guidance available'
      },
      macos: {
        patterns: ['mac', 'macos', 'osx', 'homebrew', 'xcode', 'finder'],
        responses: 'macOS guidance available'
      },
      mobile: {
        patterns: ['android', 'ios', 'mobile', 'app', 'smartphone', 'tablet'],
        responses: 'Mobile development guidance available'
      },
      web: {
        patterns: ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'web'],
        responses: 'Web development guidance available'
      },
      database: {
        patterns: ['sql', 'mysql', 'postgresql', 'mongodb', 'database', 'query'],
        responses: 'Database guidance available'
      },
      cloud: {
        patterns: ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes'],
        responses: 'Cloud computing guidance available'
      }
    };
  }
  
  // Main NLP processing function
  processText(text) {
    const analysis = {
      originalText: text,
      language: this.detectLanguage(text),
      intent: this.classifyIntent(text),
      entities: this.extractEntities(text),
      context: this.analyzeContext(text),
      softwareContext: this.detectSoftwareContext(text),
      sentiment: this.analyzeSentiment(text),
      complexity: this.assessComplexity(text),
      suggestions: this.generateSuggestions(text)
    };
    
    return analysis;
  }
  
  detectLanguage(text) {
    const scores = {};
    
    for (const [lang, pattern] of Object.entries(this.languagePatterns)) {
      const matches = text.match(pattern);
      scores[lang] = matches ? matches.length : 0;
    }
    
    const detectedLang = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return detectedLang === 'english' || scores[detectedLang] === 0 ? 'english' : detectedLang;
  }
  
  classifyIntent(text) {
    const intents = [];
    
    for (const [intent, pattern] of Object.entries(this.intentPatterns)) {
      if (pattern.test(text)) {
        intents.push(intent);
      }
    }
    
    return intents.length > 0 ? intents : ['general'];
  }
  
  extractEntities(text) {
    const entities = {};
    
    for (const [type, pattern] of Object.entries(this.entityPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        entities[type] = [...new Set(matches)]; // Remove duplicates
      }
    }
    
    return entities;
  }
  
  analyzeContext(text) {
    const contexts = [];
    const lowerText = text.toLowerCase();
    
    for (const [context, keywords] of Object.entries(this.contextKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        contexts.push(context);
      }
    }
    
    return contexts;
  }
  
  detectSoftwareContext(text) {
    const softwareContexts = [];
    const lowerText = text.toLowerCase();
    
    for (const [software, config] of Object.entries(this.softwareIntents)) {
      if (config.patterns.some(pattern => lowerText.includes(pattern))) {
        softwareContexts.push({
          software,
          confidence: this.calculateConfidence(lowerText, config.patterns),
          response: config.responses
        });
      }
    }
    
    return softwareContexts.sort((a, b) => b.confidence - a.confidence);
  }
  
  calculateConfidence(text, patterns) {
    const matches = patterns.filter(pattern => text.includes(pattern)).length;
    return matches / patterns.length;
  }
  
  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'like', 'best', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'problem', 'error', 'issue', 'broken', 'failed'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positive = words.filter(word => positiveWords.includes(word)).length;
    const negative = words.filter(word => negativeWords.includes(word)).length;
    
    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }
  
  assessComplexity(text) {
    const wordCount = text.split(/\s+/).length;
    const avgWordLength = text.replace(/\s+/g, '').length / wordCount;
    const technicalTerms = (text.match(/\b(algorithm|implementation|architecture|framework|optimization|configuration)\b/gi) || []).length;
    
    let score = 0;
    if (wordCount > 50) score += 2;
    if (avgWordLength > 6) score += 2;
    if (technicalTerms > 2) score += 3;
    
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }
  
  generateSuggestions(text) {
    const suggestions = [];
    const analysis = this.processText(text);
    
    // Software-specific suggestions
    if (analysis.softwareContext.length > 0) {
      suggestions.push(`I can provide ${analysis.softwareContext[0].software}-specific guidance`);
    }
    
    // Intent-based suggestions
    if (analysis.intent.includes('tutorial')) {
      suggestions.push('I can provide step-by-step instructions');
    }
    
    if (analysis.intent.includes('troubleshoot')) {
      suggestions.push('I can help debug and solve the issue');
    }
    
    if (analysis.intent.includes('code')) {
      suggestions.push('I can provide code examples and explanations');
    }
    
    // Context-based suggestions
    if (analysis.context.includes('installation')) {
      suggestions.push('I can guide you through the installation process');
    }
    
    if (analysis.context.includes('performance')) {
      suggestions.push('I can suggest optimization techniques');
    }
    
    return suggestions;
  }
  
  // Enhanced query preprocessing
  preprocessQuery(query) {
    const analysis = this.processText(query);
    
    // Enhance query based on analysis
    let enhancedQuery = query;
    
    // Add context for better AI understanding
    if (analysis.softwareContext.length > 0) {
      const primarySoftware = analysis.softwareContext[0].software;
      enhancedQuery = `[${primarySoftware.toUpperCase()} CONTEXT] ${query}`;
    }
    
    // Add intent context
    if (analysis.intent.includes('tutorial')) {
      enhancedQuery = `[TUTORIAL REQUEST] ${enhancedQuery}`;
    }
    
    if (analysis.intent.includes('troubleshoot')) {
      enhancedQuery = `[TROUBLESHOOTING] ${enhancedQuery}`;
    }
    
    // Add complexity indicator
    if (analysis.complexity === 'high') {
      enhancedQuery = `[ADVANCED] ${enhancedQuery}`;
    } else if (analysis.complexity === 'low') {
      enhancedQuery = `[BEGINNER] ${enhancedQuery}`;
    }
    
    return {
      original: query,
      enhanced: enhancedQuery,
      analysis: analysis
    };
  }
}

// UNIVERSAL SOFTWARE COMPATIBILITY LAYER
class SoftwareCompatibility {
  constructor() {
    this.platformDetection = this.detectPlatform();
    this.softwareDatabase = this.initializeSoftwareDatabase();
  }
  
  detectPlatform() {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    
    let os = 'unknown';
    if (platform.includes('win')) os = 'windows';
    else if (platform.includes('mac')) os = 'macos';
    else if (platform.includes('linux')) os = 'linux';
    else if (userAgent.includes('android')) os = 'android';
    else if (userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'ios';
    
    return {
      os: os,
      architecture: platform.includes('64') ? 'x64' : 'x86',
      browser: this.detectBrowser(),
      mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    };
  }
  
  detectBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'unknown';
  }
  
  initializeSoftwareDatabase() {
    return {
      windows: {
        packageManagers: ['chocolatey', 'winget', 'scoop'],
        terminals: ['cmd', 'powershell', 'wsl'],
        editors: ['notepad', 'vscode', 'sublime', 'atom'],
        browsers: ['chrome', 'firefox', 'edge', 'opera']
      },
      macos: {
        packageManagers: ['homebrew', 'macports'],
        terminals: ['terminal', 'iterm2', 'zsh', 'bash'],
        editors: ['textedit', 'vscode', 'sublime', 'xcode'],
        browsers: ['safari', 'chrome', 'firefox', 'opera']
      },
      linux: {
        packageManagers: ['apt', 'yum', 'dnf', 'pacman', 'zypper'],
        terminals: ['bash', 'zsh', 'fish', 'gnome-terminal'],
        editors: ['nano', 'vim', 'emacs', 'vscode', 'sublime'],
        browsers: ['firefox', 'chrome', 'chromium', 'opera']
      }
    };
  }
  
  getCompatibleSoftware(category) {
    const platform = this.platformDetection.os;
    return this.softwareDatabase[platform]?.[category] || [];
  }
  
  generatePlatformSpecificInstructions(software, action) {
    const platform = this.platformDetection.os;
    const instructions = {
      windows: {
        install: `To install ${software} on Windows:\n1. Use winget: winget install ${software}\n2. Or download from official website\n3. Run as administrator if needed`,
        uninstall: `To uninstall ${software} on Windows:\n1. Go to Settings > Apps\n2. Search for ${software}\n3. Click Uninstall`,
        update: `To update ${software} on Windows:\n1. Use winget: winget upgrade ${software}\n2. Or check for updates in the app`
      },
      macos: {
        install: `To install ${software} on macOS:\n1. Use Homebrew: brew install ${software}\n2. Or download from App Store/website\n3. Drag to Applications folder`,
        uninstall: `To uninstall ${software} on macOS:\n1. Drag app to Trash\n2. Or use: brew uninstall ${software}\n3. Clean up preferences if needed`,
        update: `To update ${software} on macOS:\n1. Use: brew upgrade ${software}\n2. Or check App Store updates\n3. Enable auto-updates if available`
      },
      linux: {
        install: `To install ${software} on Linux:\n1. Use package manager: sudo apt install ${software}\n2. Or download .deb/.rpm package\n3. Or compile from source`,
        uninstall: `To uninstall ${software} on Linux:\n1. Use: sudo apt remove ${software}\n2. Clean config: sudo apt purge ${software}\n3. Remove dependencies: sudo apt autoremove`,
        update: `To update ${software} on Linux:\n1. Update package list: sudo apt update\n2. Upgrade: sudo apt upgrade ${software}\n3. Or upgrade all: sudo apt upgrade`
      }
    };
    
    return instructions[platform]?.[action] || `${action} instructions for ${software} not available for ${platform}`;
  }
}

// Initialize NLP and compatibility systems
const quantyNLP = new QuantyNLP();
const softwareCompatibility = new SoftwareCompatibility();

// Enhanced query processing function
window.enhanceQuery = function(query) {
  const processed = quantyNLP.preprocessQuery(query);
  const platform = softwareCompatibility.platformDetection;
  
  // Add platform context
  processed.enhanced = `[${platform.os.toUpperCase()}] ${processed.enhanced}`;
  
  console.log('🧠 NLP Analysis:', processed.analysis);
  console.log('💻 Platform:', platform);
  
  return processed;
};

// Software-specific help function
window.getSoftwareHelp = function(software, action = 'install') {
  return softwareCompatibility.generatePlatformSpecificInstructions(software, action);
};

// Global NLP functions
window.analyzeText = (text) => quantyNLP.processText(text);
window.detectLanguage = (text) => quantyNLP.detectLanguage(text);
window.getPlatformInfo = () => softwareCompatibility.platformDetection;

console.log('🧠 ADVANCED NLP ENGINE READY');
console.log('💻 UNIVERSAL SOFTWARE COMPATIBILITY ACTIVE');
console.log(`🖥️ Detected Platform: ${softwareCompatibility.platformDetection.os.toUpperCase()}`);
console.log('🔧 Functions: enhanceQuery(), getSoftwareHelp(), analyzeText()');