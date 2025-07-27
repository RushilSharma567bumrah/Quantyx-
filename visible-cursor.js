// Highly visible cursor
document.addEventListener('DOMContentLoaded', function() {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.id = 'visible-cursor';
  document.body.appendChild(cursor);
  
  // Update cursor position
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
  });
  
  // Change color on hover over clickable elements
  const clickables = document.querySelectorAll('a, button, input, select, textarea');
  clickables.forEach(item => {
    item.addEventListener('mouseenter', function() {
      cursor.style.backgroundColor = '#805ad5'; // Purple
      cursor.style.transform = 'scale(1.5)';
    });
    
    item.addEventListener('mouseleave', function() {
      cursor.style.backgroundColor = '#4f83cc'; // Blue
      cursor.style.transform = 'scale(1)';
    });
  });
  
  // Change on click
  document.addEventListener('mousedown', function() {
    cursor.style.transform = 'scale(0.8)';
    cursor.style.backgroundColor = '#d69e2e'; // Gold
  });
  
  document.addEventListener('mouseup', function() {
    cursor.style.transform = 'scale(1)';
    cursor.style.backgroundColor = '#4f83cc'; // Blue
  });
});