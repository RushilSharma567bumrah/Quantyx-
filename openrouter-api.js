// QUANTY API WITH MEMORY SYSTEM
const API_KEY = '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';

// CONVERSATION MEMORY SYSTEM
const conversationMemory = {
  messages: [],
  maxMessages: 10,
  
  addMessage(role, content) {
    this.messages.push({ role, content, timestamp: Date.now() });
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  },
  
  getContext() {
    return this.messages.slice(-6); // Last 6 messages for context
  },
  
  clear() {
    this.messages = [];
  }
};

// MAIN API FUNCTION WITH MEMORY AND ENHANCED NLP
async function callOpenRouterAPI(message) {
  console.log('🚀 STARTING API CALL WITH ENHANCED NLP');
  
  // Check for creator/developer questions first
  const creatorResponse = checkCreatorQuestions(message);
  if (creatorResponse) {
    conversationMemory.addMessage('user', message);
    conversationMemory.addMessage('assistant', creatorResponse);
    return creatorResponse;
  }
  
  // Add user message to memory
  conversationMemory.addMessage('user', message);
  
  // Enhance query with NLP analysis (but don't let it break normal conversation)
  let queryToProcess = message;
  if (window.enhanceQuery && !isSimpleGreeting(message)) {
    try {
      const enhancedQuery = window.enhanceQuery(message);
      queryToProcess = enhancedQuery.enhanced || message;
      console.log('🧠 Enhanced Query:', queryToProcess);
    } catch (error) {
      console.log('⚠️ NLP Enhancement failed, using original message');
      queryToProcess = message;
    }
  }
  
  // Code prefix handling
  if (message.toLowerCase().startsWith('code:')) {
    const codeMessage = message.substring(5).trim();
    console.log('💻 CODE QUERY DETECTED');
    const response = await makeAPICall('anthropic/claude-4.0', codeMessage, true);
    conversationMemory.addMessage('assistant', response);
    return response;
  }
  
  // Try models one by one until one works
  const models = [
    'deepseek/deepseek-r1-distill-qwen-7b',
    'microsoft/phi-3-medium-128k-instruct',
    'openai/chatgpt-4o-latest',
    'google/gemini-2.5-pro',
    'moonshot/moonshot-v1-8k',
    'deepseek/deepseek-r1'
  ];
  
  for (const model of models) {
    try {
      console.log(`🎯 TRYING ${model}`);
      const result = await makeAPICall(model, queryToProcess, false);
      if (result && result.length > 5) {
        console.log(`✅ SUCCESS WITH ${model}`);
        conversationMemory.addMessage('assistant', result);
        return result;
      }
    } catch (error) {
      console.log(`❌ ${model} FAILED: ${error.message}`);
      continue;
    }
  }
  
  // If all models fail, try DuckDuckGo
  console.log('🦆 ALL MODELS FAILED - TRYING DUCKDUCKGO');
  const fallbackResponse = await simpleDuckDuckGo(message);
  conversationMemory.addMessage('assistant', fallbackResponse);
  return fallbackResponse;
}

// Helper function to detect simple greetings
function isSimpleGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'what\'s up', 'whats up', 'how are you', 'good morning', 'good evening'];
  const lowerMessage = message.toLowerCase().trim();
  return greetings.some(greeting => lowerMessage.includes(greeting)) && message.length < 50;
}

// CREATOR INFORMATION SYSTEM
function checkCreatorQuestions(message) {
  const lowerMessage = message.toLowerCase();
  
  // Creator/Developer questions
  const creatorKeywords = ['who made you', 'who created you', 'who developed you', 'who is your creator', 'who built you', 'your creator', 'your developer', 'your maker'];
  const isCreatorQuestion = creatorKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isCreatorQuestion) {
    return `🧑‍💻 **My Creator:**\n\nI was created by **Rushil Sharma** from Chandigarh, India! 🇮🇳\n\nRushil is a talented young developer who built me with passion and dedication. He's from the beautiful city of Chandigarh and has put a lot of effort into making me the advanced AI assistant I am today!`;
  }
  
  // Age when created questions
  const ageCreatedKeywords = ['how old was', 'what age', 'age when created', 'age when made', 'age when developed', 'age when built'];
  const isAgeCreatedQuestion = ageCreatedKeywords.some(keyword => lowerMessage.includes(keyword)) && (lowerMessage.includes('creator') || lowerMessage.includes('developer') || lowerMessage.includes('rushil'));
  
  if (isAgeCreatedQuestion) {
    return `👶 **Creator's Age When I Was Made:**\n\nRushil Sharma was **12 and a half years old** when he created me! 🎂\n\nPretty impressive for someone so young, right? He started working on me when he was just 12½ years old, showing incredible talent and dedication at such a young age!`;
  }
  
  // Current age calculation
  const currentAgeKeywords = ['current age', 'how old now', 'age now', 'present age', 'today age'];
  const isCurrentAgeQuestion = currentAgeKeywords.some(keyword => lowerMessage.includes(keyword)) && (lowerMessage.includes('creator') || lowerMessage.includes('developer') || lowerMessage.includes('rushil'));
  
  if (isCurrentAgeQuestion) {
    const currentAge = calculateCurrentAge();
    return `📅 **Creator's Current Age:**\n\nRushil Sharma is currently **${currentAge.years} years and ${currentAge.months} months old**! 🎈\n\n*Calculated automatically based on the current date*\n\nHe's grown quite a bit since creating me when he was 12½ years old!`;
  }
  
  return null;
}

// Calculate current age automatically
function calculateCurrentAge() {
  // Rushil was 12.5 years old when he created Quanty
  // Let's assume he created it in January 2024 (when he was 12.5)
  // So his birth would be around July 2011
  
  const creationDate = new Date('2024-01-01'); // When Quanty was created
  const creatorAgeAtCreation = 12.5; // Age when created
  
  // Calculate birth date (approximately)
  const birthYear = 2024 - 12.5; // 2011.5, so around July 2011
  const birthDate = new Date('2011-07-01'); // Approximate birth date
  
  const currentDate = new Date();
  
  // Calculate current age
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Adjust for day of month
  if (currentDate.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  return { years, months };
}

// MAKE SINGLE API CALL WITH MEMORY CONTEXT
async function makeAPICall(model, message, isCodeQuery = false) {
  // Build messages with conversation context
  const messages = [
    {
      role: 'system',
      content: isCodeQuery ? 
        'You are Quanty, an expert coding assistant. Provide detailed, accurate code solutions with explanations.' :
        'You are Quanty, an advanced AI assistant with perfect memory. Remember our conversation context and provide helpful, detailed responses. If asked to summarize or give brief answers, refer to our previous discussion.'
    }
  ];
  
  // Add conversation context (memory)
  const context = conversationMemory.getContext();
  messages.push(...context);
  
  // Add current message if not already in context
  if (!context.some(msg => msg.content === message)) {
    messages.push({
      role: 'user',
      content: message
    });
  }
  
  console.log(`🧠 USING ${context.length} MESSAGES FROM MEMORY`);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': 'https://github.com/quanty-assistant',
      'X-Title': 'Quanty'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  
  throw new Error('No content in response');
}

// SIMPLE DUCKDUCKGO SEARCH
async function simpleDuckDuckGo(query) {
  try {
    console.log('🦆 SEARCHING DUCKDUCKGO');
    
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
    const data = await response.json();
    
    if (data.AbstractText) {
      return `🔍 **Search Result:**\n\n${data.AbstractText}`;
    }
    
    if (data.Answer) {
      return `🔍 **Answer:**\n\n${data.Answer}`;
    }
    
    if (data.Definition) {
      return `📚 **Definition:**\n\n${data.Definition}`;
    }
    
    return `I searched for "${query}" but couldn't find specific information. Please try rephrasing your question.`;
    
  } catch (error) {
    console.error('🦆 DUCKDUCKGO ERROR:', error);
    return `I'm having trouble processing your request about "${query}". Please try again.`;
  }
}

// MAKE DUCKDUCKGO GLOBALLY AVAILABLE
window.duckDuckGoSearch = simpleDuckDuckGo;

// MODEL SELECTION (SIMPLIFIED)
function selectModelForQuery() {
  return 'default';
}

// MEMORY MANAGEMENT FUNCTIONS
window.clearMemory = function() {
  conversationMemory.clear();
  console.log('🧠 MEMORY CLEARED');
};

window.showMemory = function() {
  console.log('🧠 CURRENT MEMORY:', conversationMemory.messages);
  return conversationMemory.messages;
};

console.log('🔥 QUANTY API READY WITH MEMORY SYSTEM');
console.log('📋 MODELS: DeepSeek R1 Distill → Phi-3 → ChatGPT 4o → Gemini 2.5 → Kimi → DeepSeek R1');
console.log('💻 CODE: Use "code:" prefix for Claude 4.0');
console.log('🦆 FALLBACK: DuckDuckGo search');
console.log('🧠 MEMORY: Remembers last 10 messages, uses last 6 for context');
console.log('🔧 COMMANDS: clearMemory() and showMemory() available in console');
console.log('👨‍💻 CREATOR: Rushil Sharma from Chandigarh, India (Age detection active)');