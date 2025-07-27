// Prevent automatic reloads and clear any problematic intervals

document.addEventListener('DOMContentLoaded', () => {
  // Store the original setInterval function
  const originalSetInterval = window.setInterval;
  const intervals = [];
  
  // Override setInterval to keep track of all intervals
  window.setInterval = function(callback, delay) {
    const id = originalSetInterval(callback, delay);
    intervals.push(id);
    return id;
  };
  
  // Function to clear all intervals except essential ones
  window.clearAllIntervals = function() {
    intervals.forEach(id => {
      clearInterval(id);
    });
    console.log('Cleared all intervals');
  };
  
  // Clear intervals when page is about to unload
  window.addEventListener('beforeunload', () => {
    window.clearAllIntervals();
  });
  
  // Prevent automatic refreshes
  window.onbeforeunload = function() {
    return;
  };
  
  // Make sure splash screen is hidden after page load
  setTimeout(() => {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
      splashScreen.style.display = 'none';
      splashScreen.classList.add('hidden');
    }
  }, 5000);
});