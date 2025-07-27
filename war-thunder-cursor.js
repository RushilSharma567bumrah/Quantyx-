// War Thunder inspired cursor for Quanty AI

document.addEventListener('DOMContentLoaded', () => {
  // Create custom cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'war-thunder-cursor';
  document.body.appendChild(cursor);
  
  // Create crosshair elements
  const crosshairOuter = document.createElement('div');
  crosshairOuter.className = 'crosshair-outer';
  cursor.appendChild(crosshairOuter);
  
  const crosshairInner = document.createElement('div');
  crosshairInner.className = 'crosshair-inner';
  cursor.appendChild(crosshairInner);
  
  const crosshairDot = document.createElement('div');
  crosshairDot.className = 'crosshair-dot';
  cursor.appendChild(crosshairDot);
  
  // Create directional markers
  ['top', 'right', 'bottom', 'left'].forEach(direction => {
    const marker = document.createElement('div');
    marker.className = `crosshair-marker ${direction}`;
    cursor.appendChild(marker);
  });
  
  // Hide the default cursor
  document.body.style.cursor = 'none';
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Update cursor position on move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor position immediately for better responsiveness
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
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
  
  // Handle cursor visibility
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = 1;
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
  });
  
  // Handle click animation
  document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-click');
  });
  
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-click');
  });
});