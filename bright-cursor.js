// Bright, highly visible cursor
document.addEventListener('DOMContentLoaded', function() {
  // Create cursor element with inline styles for maximum visibility
  const cursor = document.createElement('div');
  cursor.id = 'bright-cursor';
  
  // Apply styles directly to ensure visibility
  cursor.style.position = 'fixed';
  cursor.style.width = '20px';
  cursor.style.height = '20px';
  cursor.style.borderRadius = '50%';
  cursor.style.backgroundColor = 'rgba(79, 131, 204, 0.7)'; // Blue, more opaque
  cursor.style.border = '3px solid #4f83cc'; // Solid border
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '99999'; // Very high z-index
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.transition = 'background-color 0.2s, border-color 0.2s, width 0.2s, height 0.2s';
  cursor.style.boxShadow = '0 0 15px rgba(79, 131, 204, 0.9), 0 0 5px white'; // Stronger glow + white halo
  
  // Add cursor to body
  document.body.appendChild(cursor);
  
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  // Change color on hover over clickable elements
  const clickables = document.querySelectorAll('a, button, input, select, textarea');
  clickables.forEach(item => {
    item.addEventListener('mouseenter', function() {
      cursor.style.backgroundColor = 'rgba(128, 90, 213, 0.7)'; // Purple
      cursor.style.borderColor = '#805ad5';
      cursor.style.width = '30px';
      cursor.style.height = '30px';
      cursor.style.boxShadow = '0 0 20px rgba(128, 90, 213, 0.9), 0 0 8px white';
    });
    
    item.addEventListener('mouseleave', function() {
      cursor.style.backgroundColor = 'rgba(79, 131, 204, 0.7)'; // Blue
      cursor.style.borderColor = '#4f83cc';
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.boxShadow = '0 0 15px rgba(79, 131, 204, 0.9), 0 0 5px white';
    });
  });
  
  // Change on click
  document.addEventListener('mousedown', function() {
    cursor.style.width = '15px';
    cursor.style.height = '15px';
    cursor.style.backgroundColor = 'rgba(214, 158, 46, 0.7)'; // Gold
    cursor.style.borderColor = '#d69e2e';
    cursor.style.boxShadow = '0 0 15px rgba(214, 158, 46, 0.9), 0 0 5px white';
  });
  
  document.addEventListener('mouseup', function() {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.backgroundColor = 'rgba(79, 131, 204, 0.7)'; // Blue
    cursor.style.borderColor = '#4f83cc';
    cursor.style.boxShadow = '0 0 15px rgba(79, 131, 204, 0.9), 0 0 5px white';
  });
});