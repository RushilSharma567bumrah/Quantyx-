// Fixed cursor with copy feature
document.addEventListener('DOMContentLoaded', function() {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.id = 'fixed-cursor';
  cursor.style.position = 'fixed';
  cursor.style.width = '20px';
  cursor.style.height = '20px';
  cursor.style.borderRadius = '50%';
  cursor.style.backgroundColor = 'rgba(79, 131, 204, 0.8)';
  cursor.style.border = '3px solid #4f83cc';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '999999';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.boxShadow = '0 0 15px rgba(79, 131, 204, 0.9), 0 0 5px white';
  document.body.appendChild(cursor);
  
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
  });
  
  // Change cursor on hover over clickable elements
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.backgroundColor = 'rgba(128, 90, 213, 0.8)';
      cursor.style.borderColor = '#805ad5';
      cursor.style.width = '30px';
      cursor.style.height = '30px';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.backgroundColor = 'rgba(79, 131, 204, 0.8)';
      cursor.style.borderColor = '#4f83cc';
      cursor.style.width = '20px';
      cursor.style.height = '20px';
    });
  });
  
  // Add copy button to AI messages
  document.querySelectorAll('.message-ai').forEach(addCopyButton);
  
  // Monitor for new AI messages and add copy buttons
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains('message-ai')) {
            addCopyButton(node);
          }
        });
      }
    });
  });
  
  // Start observing chat messages
  observer.observe(document.getElementById('chatMessages'), {
    childList: true
  });
  
  // Function to add copy button to AI messages
  function addCopyButton(message) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button';
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
      const content = message.querySelector('.message-content').innerText;
      navigator.clipboard.writeText(content)
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
    
    message.style.position = 'relative';
    message.appendChild(copyBtn);
  }
});