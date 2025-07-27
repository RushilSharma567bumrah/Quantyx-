// Integration script for topic responses in immersive-ai.html
document.addEventListener('DOMContentLoaded', () => {
  // Wait for the chat interface to be initialized
  setTimeout(() => {
    // Check if the original sendMessage function exists
    const originalSendMessage = window.sendMessage;
    
    if (typeof originalSendMessage === 'function') {
      // Override the sendMessage function to include topic responses
      window.sendMessage = function() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Clear input
        chatInput.value = '';
        
        // Add user message to UI
        const chatMessages = document.getElementById('chatMessages');
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message message-user';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';
        
        userMessageDiv.appendChild(messageContent);
        userMessageDiv.appendChild(messageTime);
        chatMessages.appendChild(userMessageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-ai typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        
        const voiceAnimation = document.createElement('div');
        voiceAnimation.className = 'voice-animation';
        
        for (let i = 0; i < 5; i++) {
          const bar = document.createElement('div');
          bar.className = 'voice-bar';
          voiceAnimation.appendChild(bar);
        }
        
        typingContent.appendChild(voiceAnimation);
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Process with topic responses if available
        setTimeout(() => {
          // Remove typing indicator
          const typingIndicator = document.getElementById('typingIndicator');
          if (typingIndicator) {
            typingIndicator.remove();
          }
          
          // Try to get a topic response
          let response = null;
          
          // Check if topic-responses.js is loaded
          if (typeof getTopicResponse === 'function') {
            response = getTopicResponse(message);
          }
          
          // If no topic response, use the original sendMessage logic
          if (!response) {
            // Call the original function to handle the message
            originalSendMessage();
          } else {
            // Add AI response with the topic response
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'message message-ai';
            aiMessageDiv.style.position = 'relative';
            
            const aiMessageContent = document.createElement('div');
            aiMessageContent.className = 'message-content';
            
            // Format the content with line breaks
            response = response.replace(/\n/g, '<br>');
            aiMessageContent.innerHTML = response;
            
            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '📋';
            copyBtn.style.position = 'absolute';
            copyBtn.style.top = '5px';
            copyBtn.style.right = '5px';
            copyBtn.style.background = 'rgba(79, 131, 204, 0.3)';
            copyBtn.style.border = 'none';
            copyBtn.style.borderRadius = '4px';
            copyBtn.style.padding = '3px 6px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.color = 'white';
            copyBtn.style.fontSize = '14px';
            copyBtn.style.opacity = '0.7';
            copyBtn.style.transition = 'opacity 0.2s';
            
            copyBtn.addEventListener('mouseenter', () => {
              copyBtn.style.opacity = '1';
            });
            
            copyBtn.addEventListener('mouseleave', () => {
              copyBtn.style.opacity = '0.7';
            });
            
            copyBtn.addEventListener('click', () => {
              const textToCopy = aiMessageContent.innerText;
              navigator.clipboard.writeText(textToCopy)
                .then(() => {
                  copyBtn.innerHTML = '✓';
                  setTimeout(() => {
                    copyBtn.innerHTML = '📋';
                  }, 1000);
                })
                .catch(err => {
                  console.error('Failed to copy: ', err);
                });
            });
            
            const aiMessageTime = document.createElement('div');
            aiMessageTime.className = 'message-time';
            aiMessageTime.textContent = 'Just now';
            
            aiMessageDiv.appendChild(aiMessageContent);
            aiMessageDiv.appendChild(aiMessageTime);
            aiMessageDiv.appendChild(copyBtn);
            
            chatMessages.appendChild(aiMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        }, 1000);
      };
      
      console.log('Topic response integration loaded successfully');
    } else {
      console.error('Original sendMessage function not found');
    }
  }, 1000);
});