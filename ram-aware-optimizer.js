// QUANTY RAM-AWARE OPTIMIZER & CODE GENERATION SYSTEM
console.log('🧠 LOADING RAM-AWARE OPTIMIZER...');

// RAM-aware system optimization
class RAMOptimizer {
  constructor() {
    this.ramTier = this.detectRAMTier();
    this.optimizeForRAM();
    this.initCodeGenerators();
  }
  
  detectRAMTier() {
    const memory = navigator.deviceMemory || 4;
    
    if (memory >= 8) return 'high';
    if (memory >= 4) return 'medium';
    return 'low';
  }
  
  optimizeForRAM() {
    const tier = this.ramTier;
    
    if (tier === 'low') {
      // Use smaller OpenAPI specs
      this.apiSpecSize = 'minimal';
      this.enableOfflineCache = true;
      this.streamingEnabled = false;
      this.maxConcurrentRequests = 1;
    } else if (tier === 'medium') {
      this.apiSpecSize = 'standard';
      this.enableOfflineCache = true;
      this.streamingEnabled = true;
      this.maxConcurrentRequests = 2;
    } else {
      this.apiSpecSize = 'full';
      this.enableOfflineCache = false;
      this.streamingEnabled = true;
      this.maxConcurrentRequests = 4;
    }
    
    console.log(`🧠 RAM Tier: ${tier.toUpperCase()}`);
    console.log(`📊 API Spec: ${this.apiSpecSize}`);
    console.log(`💾 Offline Cache: ${this.enableOfflineCache}`);
  }
  
  initCodeGenerators() {
    this.codeGenerators = {
      // Primary: Anthropic Claude 4.0 Sonnet
      primary: 'anthropic/claude-4.0',
      
      // Companion APIs for specialized code generation
      companions: {
        'apidog': {
          name: 'Apidog Code Generator',
          endpoint: '/api/generate-code/apidog',
          specialties: ['API documentation', 'REST endpoints', 'OpenAPI specs']
        },
        'swagger': {
          name: 'Swagger Codegen',
          endpoint: '/api/generate-code/swagger',
          specialties: ['API clients', 'Server stubs', 'Documentation']
        },
        'openapi': {
          name: 'OpenAPI Generator',
          endpoint: '/api/generate-code/openapi',
          specialties: ['Client SDKs', 'Server frameworks', 'API validation']
        },
        'smart-device': {
          name: 'Smart Device API Generator',
          endpoint: '/api/generate-code/smart-device',
          specialties: ['IoT APIs', 'Device integration', 'Sensor data']
        },
        'eden-ai': {
          name: 'Eden AI (Codey, Codex, NLP Cloud)',
          endpoint: '/api/generate-code/eden-ai',
          specialties: ['NLP integration', 'AI model APIs', 'Multi-model systems']
        },
        'apigen': {
          name: 'APIgen',
          endpoint: '/api/generate-code/apigen',
          specialties: ['Automated API generation', 'Database APIs', 'CRUD operations']
        },
        'codegeex': {
          name: 'CodeGeeX',
          endpoint: '/api/generate-code/codegeex',
          specialties: ['Multi-language code', 'Code completion', 'Refactoring']
        },
        'duckargs': {
          name: 'Duckargs',
          endpoint: '/api/generate-code/duckargs',
          specialties: ['CLI tools', 'Argument parsing', 'Command interfaces']
        },
        'free-gpt-engineer': {
          name: 'Free-GPT-Engineer',
          endpoint: '/api/generate-code/free-gpt-engineer',
          specialties: ['Full applications', 'Architecture design', 'System engineering']
        },
        'django-generator': {
          name: 'Django Code Generator',
          endpoint: '/api/generate-code/django',
          specialties: ['Django apps', 'Models', 'Views', 'Templates']
        },
        'codebert': {
          name: 'CodeBERT',
          endpoint: '/api/generate-code/codebert',
          specialties: ['Code understanding', 'Bug detection', 'Code search']
        }
      }
    };
  }
  
  selectOptimalGenerator(request) {
    const { type, language, complexity, ramTier } = request;
    
    // Always start with Claude 4.0 Sonnet as primary
    const primary = this.codeGenerators.primary;
    
    // Select best companion based on request
    let companion = null;
    
    if (type.includes('api') || type.includes('rest')) {
      companion = ramTier === 'low' ? 'apidog' : 'swagger';
    } else if (type.includes('django') || language === 'python') {
      companion = 'django-generator';
    } else if (type.includes('cli') || type.includes('command')) {
      companion = 'duckargs';
    } else if (type.includes('iot') || type.includes('device')) {
      companion = 'smart-device';
    } else if (complexity === 'high') {
      companion = ramTier === 'low' ? 'codegeex' : 'free-gpt-engineer';
    } else {
      companion = 'codegeex';
    }
    
    return { primary, companion };
  }
}

// Code generation request handler
class CodeGenerator {
  constructor() {
    this.ramOptimizer = new RAMOptimizer();
    this.offlineTemplates = this.initOfflineTemplates();
  }
  
  initOfflineTemplates() {
    return {
      'api-basic': `
// Basic API Template
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});`,
      
      'react-component': `
import React, { useState } from 'react';

const Component = ({ title }) => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Component;`,
      
      'python-function': `
def process_data(data):
    """
    Process input data and return result
    """
    try:
        result = []
        for item in data:
            processed = item.strip().lower()
            result.append(processed)
        return result
    except Exception as e:
        print(f"Error processing data: {e}")
        return []`
    };
  }
  
  async generateCode(request) {
    const { primary, companion } = this.ramOptimizer.selectOptimalGenerator(request);
    
    try {
      // Try online generation first
      if (navigator.onLine) {
        return await this.generateOnline(primary, companion, request);
      } else {
        return this.generateOffline(request);
      }
    } catch (error) {
      console.error('Code generation error:', error);
      return this.generateOffline(request);
    }
  }
  
  async generateOnline(primary, companion, request) {
    const response = await fetch('/api/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primary,
        companion,
        request,
        ramTier: this.ramOptimizer.ramTier
      })
    });
    
    return await response.json();
  }
  
  generateOffline(request) {
    const { type, language } = request;
    
    // Use cached templates for offline generation
    let template = this.offlineTemplates['api-basic'];
    
    if (language === 'javascript' && type.includes('react')) {
      template = this.offlineTemplates['react-component'];
    } else if (language === 'python') {
      template = this.offlineTemplates['python-function'];
    }
    
    return {
      code: template,
      generator: 'Offline Template',
      ramOptimized: true,
      cached: true
    };
  }
}

// Check if request is for code generation
function isCodeGenerationRequest(message) {
  const codeKeywords = [
    'generate code',
    'create code',
    'write code',
    'build api',
    'create function',
    'write function',
    'generate api',
    'create app',
    'build app',
    'code for',
    'write a',
    'create a',
    'build a'
  ];
  
  const lowerMessage = message.toLowerCase();
  return codeKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Main code generation function
async function generateCode(prompt) {
  console.log('💻 STARTING CODE GENERATION');
  
  try {
    const codeGen = new CodeGenerator();
    
    // Parse request
    const request = parseCodeRequest(prompt);
    
    // Generate code
    const result = await codeGen.generateCode(request);
    
    // Format response
    return formatCodeResponse(result, request);
    
  } catch (error) {
    console.error('❌ CODE GENERATION ERROR:', error);
    return `❌ **Code Generation Failed**\n\n**Error:** ${error.message}\n\n**Try:** Simplify your request or check connection`;
  }
}

// Parse code generation request
function parseCodeRequest(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  let type = 'general';
  let language = 'javascript';
  let complexity = 'medium';
  
  // Detect type
  if (lowerPrompt.includes('api')) type = 'api';
  else if (lowerPrompt.includes('react')) type = 'react-component';
  else if (lowerPrompt.includes('django')) type = 'django-app';
  else if (lowerPrompt.includes('cli')) type = 'cli-tool';
  
  // Detect language
  if (lowerPrompt.includes('python')) language = 'python';
  else if (lowerPrompt.includes('java')) language = 'java';
  else if (lowerPrompt.includes('c++')) language = 'cpp';
  else if (lowerPrompt.includes('go')) language = 'go';
  
  // Detect complexity
  if (lowerPrompt.includes('simple') || lowerPrompt.includes('basic')) complexity = 'low';
  else if (lowerPrompt.includes('complex') || lowerPrompt.includes('advanced')) complexity = 'high';
  
  return {
    prompt,
    type,
    language,
    complexity,
    ramTier: new RAMOptimizer().ramTier
  };
}

// Format code generation response
function formatCodeResponse(result, request) {
  return `💻 **Code Generated Successfully!**

**Request:** ${request.prompt}

**Language:** ${request.language}
**Type:** ${request.type}
**Generator:** ${result.generator || 'Claude 4.0 Sonnet + Companion APIs'}

\`\`\`${request.language}
${result.code}
\`\`\`

**RAM Optimized:** ${result.ramOptimized ? 'Yes' : 'No'}
**Cached:** ${result.cached ? 'Yes (Offline)' : 'No (Online)'}

---

*Generated by Quanty AI with RAM-aware optimization*`;
}

// Initialize system
const ramOptimizer = new RAMOptimizer();

// Make functions globally available
window.isCodeGenerationRequest = isCodeGenerationRequest;
window.generateCode = generateCode;
window.ramOptimizer = ramOptimizer;

console.log('💻 CODE GENERATION SYSTEM READY');
console.log(`🧠 RAM Tier: ${ramOptimizer.ramTier.toUpperCase()}`);
console.log('🤖 Primary: Claude 4.0 Sonnet + 11 Companion APIs');