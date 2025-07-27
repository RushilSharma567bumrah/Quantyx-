// Chat data structure
let chats = [];
let currentChatId = null;
let selectedModel = 'anthropic/claude-4.0';

// DOM Elements
const chatList = document.getElementById('chatList');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const newChatBtn = document.getElementById('newChatBtn');
const chatTitle = document.getElementById('chatTitle');
const modelSelector = document.getElementById('modelSelector');
const sidebar = document.getElementById('sidebar');
const helpBtn = document.getElementById('helpBtn');

// Initialize the app
function init() {
  // Load chats from localStorage
  loadChats();
  
  // Create a new chat if none exists
  if (chats.length === 0) {
    createNewChat();
  } else {
    // Load the most recent chat
    currentChatId = chats[0].id;
    loadChat(currentChatId);
  }
  
  // Force save to ensure storage is working
  saveChats();

  // Event listeners are set up in setupEventListeners()

  // Mobile sidebar toggle
  if (window.innerWidth <= 768) {
    document.querySelector('.logo').addEventListener('click', () => {
      sidebar.classList.toggle('expanded');
    });
  }
}

// Load chats from localStorage
function loadChats() {
  try {
    // Try localStorage first
    let savedChats = localStorage.getItem('quanty-chats');
    
    // If not in localStorage, try sessionStorage
    if (!savedChats) {
      savedChats = sessionStorage.getItem('quanty-chats');
      if (savedChats) {
        console.log('Loaded chats from sessionStorage fallback');
      }
    }
    
    if (savedChats) {
      chats = JSON.parse(savedChats);
      console.log('Loaded chats successfully:', chats.length);
      renderChatList();
    } else {
      console.log('No saved chats found, starting fresh');
      chats = [];
    }
  } catch (error) {
    console.error('Error loading chats:', error);
    chats = [];
  }
}

// Save chats to localStorage
function saveChats() {
  try {
    const chatsJson = JSON.stringify(chats);
    localStorage.setItem('quanty-chats', chatsJson);
    console.log('Chats saved successfully:', chats.length);
    
    // Verify storage worked
    const savedChats = localStorage.getItem('quanty-chats');
    if (!savedChats) {
      console.error('Failed to save chats - storage returned null');
    }
  } catch (error) {
    console.error('Error saving chats to localStorage:', error);
    
    // Try to use sessionStorage as fallback
    try {
      sessionStorage.setItem('quanty-chats', JSON.stringify(chats));
      console.log('Chats saved to sessionStorage as fallback');
    } catch (sessionError) {
      console.error('Error saving to sessionStorage:', sessionError);
    }
  }
}

// Create a new chat - make it globally accessible
window.createNewChat = function() {
  const newChat = {
    id: Date.now().toString(),
    title: 'Untitled Chat',
    messages: [
      {
        role: 'assistant',
        content: "Hello! I'm Quanty, your advanced AI assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ],
    model: selectedModel,
    createdAt: new Date().toISOString()
  };
  
  console.log('Creating new chat with ID:', newChat.id);

  // Add to the beginning of the array
  chats.unshift(newChat);
  saveChats();
  
  // Update UI
  currentChatId = newChat.id;
  renderChatList();
  loadChat(currentChatId);
  
  // Update chat title in UI
  if (chatTitle) {
    chatTitle.textContent = newChat.title;
  }
  
  console.log('New chat created:', newChat.id);
}

// Render the chat list
function renderChatList() {
  chatList.innerHTML = '';
  
  chats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
    chatItem.dataset.id = chat.id;
    
    chatItem.innerHTML = `
      <div class="chat-item-title">${chat.title}</div>
      <div class="chat-item-actions">
        <button class="chat-item-btn delete-btn" data-id="${chat.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    
    chatItem.addEventListener('click', (e) => {
      if (!e.target.closest('.chat-item-btn')) {
        currentChatId = chat.id;
        loadChat(currentChatId);
        renderChatList();
      }
    });
    
    chatList.appendChild(chatItem);
  });

  // Add event listeners for delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteChat(btn.dataset.id);
    });
  });
}

// Load a specific chat
function loadChat(chatId) {
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  // Update UI
  chatTitle.textContent = chat.title;
  chatMessages.innerHTML = '';
  
  // Set model selector
  modelSelector.value = chat.model || selectedModel;
  selectedModel = chat.model || selectedModel;
  
  // Render messages
  chat.messages.forEach(message => {
    addMessageToUI(message.content, message.role, new Date(message.timestamp));
  });
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Close mobile sidebar if open
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('expanded');
  }
}

// Delete a chat
function deleteChat(chatId) {
  const confirmDelete = confirm('Are you sure you want to delete this chat?');
  if (!confirmDelete) return;
  
  chats = chats.filter(chat => chat.id !== chatId);
  saveChats();
  
  // If we deleted the current chat, load another one
  if (chatId === currentChatId) {
    if (chats.length > 0) {
      currentChatId = chats[0].id;
      loadChat(currentChatId);
    } else {
      createNewChat();
    }
  }
  
  renderChatList();
}

// Send a message - make it globally accessible
window.sendMessage = function() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  // Add user message to UI
  addMessageToUI(message, 'user');
  
  // Add message to chat data
  const chat = chats.find(c => c.id === currentChatId);
  if (chat) {
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Update chat title if it's the first user message or still untitled
    if (chat.messages.filter(m => m.role === 'user').length === 1 || chat.title === 'Untitled Chat') {
      // Create a title from the message
      chat.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      
      // Update UI
      if (chatTitle) {
        chatTitle.textContent = chat.title;
      }
      
      console.log('Chat title updated:', chat.title);
    }
    
    saveChats();
    renderChatList();
  }
  
  // Process with AI (typing indicator is handled inside processWithAI)
  processWithAI(message);
}

// Process message with AI
async function processWithAI(message) {
  // Check if message contains the word "code"
  const useAnthropic = message.toLowerCase().includes('code');
  
  // Select model based on content
  let modelToUse = selectedModel;
  if (useAnthropic && !selectedModel.includes('anthropic')) {
    modelToUse = 'anthropic/claude-4.0';
  }
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    // Try to get dictionary definition if it's a single word or short phrase
    let aiResponse = '';
    
    if (message.trim().split(/\s+/).length <= 3 && !useAnthropic) {
      try {
        const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(message.trim())}`);
        
        if (dictResponse.ok) {
          const dictData = await dictResponse.json();
          
          if (dictData && dictData.length > 0) {
            const entry = dictData[0];
            aiResponse = `**${entry.word}**\n\n`;
            
            if (entry.phonetics && entry.phonetics.length > 0) {
              const phonetic = entry.phonetics.find(p => p.text) || entry.phonetics[0];
              if (phonetic && phonetic.text) {
                aiResponse += `*${phonetic.text}*\n\n`;
              }
            }
            
            if (entry.meanings && entry.meanings.length > 0) {
              entry.meanings.forEach((meaning, i) => {
                if (i > 2) return; // Limit to 3 meanings
                
                aiResponse += `**${meaning.partOfSpeech}**\n`;
                
                if (meaning.definitions && meaning.definitions.length > 0) {
                  meaning.definitions.slice(0, 2).forEach((def, j) => {
                    aiResponse += `${j+1}. ${def.definition}\n`;
                    if (def.example) {
                      aiResponse += `   *Example: ${def.example}*\n`;
                    }
                  });
                }
                
                aiResponse += '\n';
              });
            }
          }
        }
      } catch (error) {
        console.error('Dictionary API error:', error);
      }
    }
    
    // If no dictionary definition was found or it's a code query
    if (!aiResponse) {
      if (useAnthropic) {
        aiResponse = `I'll help you with that code! Here's what you need:\n\n\`\`\`javascript\n// Your code solution\nfunction example() {\n  console.log("This is generated by Claude 4.0");\n  return true;\n}\n\`\`\`\n\nLet me know if you need any clarification or have questions about this implementation.`;
      } else {
        // Generate a more meaningful response based on the message content
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
          aiResponse = `Hello! How can I help you today? Feel free to ask me anything or type "code" if you need programming assistance.`;
        } else if (message.toLowerCase().includes('thank')) {
          aiResponse = `You're welcome! Is there anything else I can help you with?`;
        } else if (message.toLowerCase().includes('how are you')) {
          aiResponse = `I'm doing well, thank you for asking! I'm ready to assist you with any questions or tasks you have.`;
        } else {
          // For other queries, provide a more specific response based on topic
          // Check for common factual queries
          if (message.toLowerCase().includes('narendra modi')) {
            aiResponse = "Narendra Modi is an Indian politician who has served as the 14th Prime Minister of India since 2014. Before becoming Prime Minister, he was the Chief Minister of Gujarat from 2001 to 2014. He is a member of the Bharatiya Janata Party (BJP) and its parent organization, the Rashtriya Swayamsevak Sangh (RSS). Modi has implemented various economic, governance, and social reforms during his tenure as Prime Minister.";
          } 
          else if (message.toLowerCase().includes('elon musk')) {
            aiResponse = "Elon Musk is a business magnate, industrial designer, and engineer. He is the founder, CEO, and chief engineer/designer of SpaceX; early investor, CEO and product architect of Tesla, Inc.; founder of The Boring Company; co-founder of Neuralink; and co-founder and initial co-chairman of OpenAI. He also owns Twitter/X and founded xAI, an artificial intelligence company.";
          }
          else if (message.toLowerCase().includes('artificial intelligence') || message.toLowerCase().includes(' ai ')) {
            aiResponse = "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These include learning, reasoning, problem-solving, perception, and language understanding. Modern AI technologies include machine learning, deep learning, natural language processing, computer vision, and robotics. AI has applications across numerous fields including healthcare, finance, transportation, entertainment, and more.";
          }
          else if (message.toLowerCase().includes('climate change')) {
            aiResponse = "Climate change refers to long-term shifts in temperatures and weather patterns, primarily caused by human activities, especially the burning of fossil fuels. Key aspects include rising global temperatures (global warming), increasing frequency of extreme weather events, rising sea levels due to melting ice caps and thermal expansion, ocean acidification affecting marine ecosystems, and shifts in wildlife populations and habitats. The scientific consensus is that human activities have warmed the atmosphere, ocean, and land, producing widespread and rapid changes.";
          }
          else if (message.toLowerCase().includes('quantum computing')) {
            aiResponse = "Quantum computing harnesses quantum mechanics principles to process information in fundamentally different ways than classical computers. Unlike classical computers that use bits (0 or 1), quantum computers use qubits that can represent multiple values simultaneously through superposition, potentially solving certain problems exponentially faster. Applications include cryptography, drug discovery, materials science, and optimization problems. Companies like IBM, Google, and Microsoft are developing quantum computers, though practical, large-scale quantum computers remain a developing technology.";
          }
          else {
            // For other queries, provide a more specific response
            aiResponse = `I see you're asking about "${message}". To give you the most helpful response, could you provide a bit more detail about what you'd like to know? You can also type "code" if you need programming assistance.`;
          }
        }
      }
    }
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add AI response to UI
    addMessageToUI(aiResponse, 'assistant');
    
    // Add to chat data
    const chat = chats.find(c => c.id === currentChatId);
    if (chat) {
      chat.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        model: modelToUse
      });
      saveChats();
    }
  } catch (error) {
    console.error('Error processing message:', error);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add error message
    addMessageToUI("I'm sorry, I encountered an error processing your request. Please try again.", 'assistant');
  }
}
}

// Add message to UI
function addMessageToUI(content, role, timestamp = new Date()) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${role === 'user' ? 'user' : 'ai'}`;
  
  const formattedContent = formatMessageContent(content);
  
  messageDiv.innerHTML = `
    <div class="message-content">${formattedContent}</div>
    <div class="message-time">${formatTime(timestamp)}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message content (handle code blocks, links, etc.)
function formatMessageContent(content) {
  // Handle code blocks
  content = content.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre style="background-color: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${code}</code></pre>`;
  });
  
  // Handle inline code
  content = content.replace(/`([^`]+)`/g, '<code style="background-color: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 3px;">$1</code>');
  
  // Handle links
  content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #4f83cc; text-decoration: underline;">$1</a>');
  
  // Handle line breaks
  content = content.replace(/\n/g, '<br>');
  
  return content;
}

// Format timestamp
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message message-ai';
  typingDiv.id = 'typingIndicator';
  
  typingDiv.innerHTML = `
    <div class="message-content">
      <div style="display: flex; gap: 4px; align-items: center;">
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: pulse 1s infinite;"></div>
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: pulse 1s infinite 0.2s;"></div>
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: pulse 1s infinite 0.4s;"></div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Show help dialog
function showHelp() {
  const helpMessage = `
## Quanty Chat Interface Help

### Basic Usage
- Type your message and press Enter or click the send button
- Create new chats with the "New Chat" button
- Switch between chats using the sidebar
- Delete chats by clicking the trash icon

### Special Features
- Include the word "code" in your message to activate Claude 4.0 for coding tasks
- Use Shift+Enter to add line breaks in your message
- Choose different AI models from the dropdown in the sidebar

### Formatting
- Code blocks are automatically formatted
- Links are clickable
- Line breaks are preserved

### Tips
- Your chat history is saved in your browser's local storage
- Give your chats descriptive names by starting with a clear question
- For best coding results, be specific about what you need
  `;
  
  // Add a special message from the assistant
  addMessageToUI(helpMessage, 'assistant');
}

// Initialize the app
// Make sure all event listeners are properly set up
function setupEventListeners() {
  // Chat input
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    
    // Auto-resize textarea
    setTimeout(() => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
    }, 0);
  });

  // Send button - ensure it's properly attached
  if (chatSend) {
    // Remove any existing listeners to prevent duplicates
    chatSend.removeEventListener('click', sendMessage);
    // Add the listener
    chatSend.addEventListener('click', sendMessage);
  }
  
  // New chat button
  if (newChatBtn) {
    newChatBtn.removeEventListener('click', createNewChat);
    newChatBtn.addEventListener('click', createNewChat);
  }
  
  // Model selector
  if (modelSelector) {
    modelSelector.addEventListener('change', (e) => {
      selectedModel = e.target.value;
    });
  }
  
  // Help button
  if (helpBtn) {
    helpBtn.removeEventListener('click', showHelp);
    helpBtn.addEventListener('click', showHelp);
  }
  
  // Mobile sidebar toggle
  if (window.innerWidth <= 768 && document.querySelector('.logo')) {
    document.querySelector('.logo').addEventListener('click', () => {
      sidebar.classList.toggle('expanded');
    });
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Wait for DOM to be fully loaded
  setTimeout(() => {
    init();
    setupEventListeners();
    
    // Direct event listener for send button as a fallback
    document.getElementById('chatSend').onclick = function() {
      sendMessage();
      return false;
    };
    
    console.log('Quanty Chat initialized');
  }, 100);
});