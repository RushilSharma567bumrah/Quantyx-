/**
 * Quanty Theme Switcher
 * Handles switching between Batman, Moonlight, and Atom themes
 */

// Available themes
const themes = {
  batman: {
    name: 'Batman',
    class: 'theme-batman',
    colors: {
      primary: '#0066ff',
      background: '#0a0a0a',
      accent: '#ffca28'
    },
    symbol: '/assets/images/bat-symbol.svg'
  },
  moonlight: {
    name: 'Moonlight',
    class: 'theme-moonlight',
    colors: {
      primary: '#4f83cc',
      background: '#1a202c',
      accent: '#e2e8f0'
    },
    symbol: '/assets/images/moon-symbol.svg'
  },
  atom: {
    name: 'Atom',
    class: 'theme-atom',
    colors: {
      primary: '#00bcd4',
      background: '#263238',
      accent: '#64ffda'
    },
    symbol: '/assets/images/atom-symbol.svg'
  }
};

// Current theme
let currentTheme = localStorage.getItem('quanty-theme') || 'batman';

// Initialize theme system
function initThemeSystem() {
  // Create theme switcher UI
  createThemeSwitcher();
  
  // Apply saved theme
  setTheme(currentTheme);
  
  // Setup cursor effects
  setupCursorEffects();
  
  // Setup scroll animations
  setupScrollAnimations();
  
  console.log(`Theme system initialized with ${themes[currentTheme].name} theme`);
}

// Create theme switcher UI
function createThemeSwitcher() {
  // Create container
  const switcher = document.createElement('div');
  switcher.className = 'theme-switcher';
  
  // Add theme options
  Object.keys(themes).forEach(key => {
    const theme = themes[key];
    
    const option = document.createElement('div');
    option.className = `theme-option ${key === currentTheme ? 'active' : ''}`;
    option.dataset.theme = key;
    
    const colorCircle = document.createElement('div');
    colorCircle.className = `theme-color theme-${key}-color`;
    
    const name = document.createElement('div');
    name.className = 'theme-name';
    name.textContent = theme.name;
    
    option.appendChild(colorCircle);
    option.appendChild(name);
    
    option.addEventListener('click', () => setTheme(key));
    
    switcher.appendChild(option);
  });
  
  // Add to body
  document.body.appendChild(switcher);
}

// Set active theme
function setTheme(themeKey) {
  // Validate theme
  if (!themes[themeKey]) {
    console.error(`Theme "${themeKey}" not found`);
    return;
  }
  
  // Create transition overlay
  const overlay = document.createElement('div');
  overlay.className = 'theme-transition-overlay';
  document.body.appendChild(overlay);
  
  // Trigger transition
  setTimeout(() => {
    overlay.classList.add('active');
    
    setTimeout(() => {
      // Remove previous theme class
      document.documentElement.classList.remove(`theme-${currentTheme}`);
      
      // Add new theme class
      document.documentElement.classList.add(`theme-${themeKey}`);
      
      // Update current theme
      currentTheme = themeKey;
      
      // Save preference
      localStorage.setItem('quanty-theme', themeKey);
      
      // Update theme options
      const options = document.querySelectorAll('.theme-option');
      options.forEach(option => {
        if (option.dataset.theme === themeKey) {
          option.classList.add('active');
        } else {
          option.classList.remove('active');
        }
      });
      
      // Update theme symbol
      updateThemeSymbol(themes[themeKey].symbol);
      
      // Hide transition overlay
      setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
          overlay.remove();
        }, 500);
      }, 500);
    }, 300);
  }, 50);
}

// Update theme symbol
function updateThemeSymbol(symbolUrl) {
  // Find existing symbol or create new one
  let symbol = document.querySelector('.theme-symbol');
  
  if (!symbol) {
    symbol = document.createElement('div');
    symbol.className = 'theme-symbol';
    document.body.appendChild(symbol);
  }
  
  // Update background image
  symbol.style.backgroundImage = `url(${symbolUrl})`;
}

// Setup custom cursor effects
function setupCursorEffects() {
  // Create cursor elements if they don't exist
  if (!document.querySelector('.cursor-container')) {
    const container = document.createElement('div');
    container.className = 'cursor-container';
    
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    container.appendChild(cursor);
    container.appendChild(cursorDot);
    document.body.appendChild(container);
    
    // Track mouse movement
    document.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });
    
    // Add trail effect
    document.addEventListener('mousemove', createTrail);
    
    // Change cursor on interactive elements
    document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '30px';
        cursor.style.height = '30px';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }
}

// Create cursor trail effect
function createTrail(e) {
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.left = `${e.clientX}px`;
  trail.style.top = `${e.clientY}px`;
  
  document.body.appendChild(trail);
  
  setTimeout(() => {
    trail.style.opacity = '0';
    setTimeout(() => {
      trail.remove();
    }, 200);
  }, 100);
}

// Setup scroll-triggered animations
function setupScrollAnimations() {
  // Add reveal class to elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(el);
  });
  
  // Setup scroll progress indicator
  const scrollProgress = document.querySelector('.scroll-progress') || createScrollProgress();
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  });
}

// Create scroll progress indicator
function createScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  return progress;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initThemeSystem);

// Export theme functions
window.quantyTheme = {
  setTheme,
  getCurrentTheme: () => currentTheme,
  getThemes: () => themes
};