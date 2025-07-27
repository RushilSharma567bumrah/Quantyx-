// Control splash screen visibility

document.addEventListener('DOMContentLoaded', () => {
  // Get the splash screen element
  const splashScreen = document.getElementById('splashScreen');
  
  // Check if splash has been shown in this session
  if (sessionStorage.getItem('splashShown')) {
    // Hide splash screen immediately
    if (splashScreen) {
      splashScreen.style.display = 'none';
    }
  } else {
    // Show splash screen
    if (splashScreen) {
      splashScreen.style.display = 'flex';
      
      // Mark as shown for this session
      sessionStorage.setItem('splashShown', 'true');
      
      // Hide splash screen after a short delay
      setTimeout(() => {
        splashScreen.classList.add('hidden');
      }, 3000);
    }
  }
  
  // Force hide splash screen after 5 seconds as a fallback
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.style.display = 'none';
      splashScreen.classList.add('hidden');
    }
  }, 5000);
});