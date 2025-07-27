// Simple visible cursor that matches the theme

document.addEventListener('DOMContentLoaded', () => {
  // Create a simple cursor element
  const cursor = document.createElement('div');
  cursor.className = 'simple-cursor';
  document.body.appendChild(cursor);
  
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  // Handle cursor over clickable elements
  const clickables = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
  clickables.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
  
  // Handle click animation
  document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-click');
  });
  
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-click');
  });
});