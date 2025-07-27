// This script fixes chat storage issues
function fixChatStorage() {
  // Create a default chat if none exists
  const defaultChat = {
    id: Date.now().toString(),
    title: 'Untitled Chat',
    messages: [
      {
        role: 'assistant',
        content: "Hello! I'm Quanty, your advanced AI assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ],
    model: 'anthropic/claude-4.0',
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  try {
    localStorage.setItem('quanty-chats', JSON.stringify([defaultChat]));
    console.log('Default chat created and saved to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    
    // Try sessionStorage as fallback
    try {
      sessionStorage.setItem('quanty-chats', JSON.stringify([defaultChat]));
      console.log('Default chat saved to sessionStorage as fallback');
      return true;
    } catch (sessionError) {
      console.error('Error saving to sessionStorage:', sessionError);
      return false;
    }
  }
}

// Run the fix
fixChatStorage();