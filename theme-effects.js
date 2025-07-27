/**
 * Advanced Theme Effects for Quanty
 * Implements theme switching, 3D effects, and interactive features
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initCursorEffects();
  initScrollEffects();
  init3DBackground();
  initMicroInteractions();
  initVoiceReactive();
  initUserPresence();
});

// Theme configuration
const themes = {
  batman: {
    name: 'Batman',
    colors: {
      primary: '#0066ff',
      accent: '#ffca28',
      background: '#0a0a0a'
    },
    symbol: '/assets/images/bat-symbol.svg'
  },
  moonlight: {
    name: 'Moonlight',
    colors: {
      primary: '#4f83cc',
      accent: '#e2e8f0',
      background: '#1a202c'
    },
    symbol: '/assets/images/moon-symbol.svg'
  },
  atom: {
    name: 'Atom',
    colors: {
      primary: '#00bcd4',
      accent: '#64ffda',
      background: '#263238'
    },
    symbol: '/assets/images/atom-symbol.svg'
  }
};

// Initialize theme switcher
function initThemeSwitcher() {
  // Create theme switcher if it doesn't exist
  if (!document.querySelector('.theme-switcher')) {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    
    // Add theme options
    Object.keys(themes).forEach(key => {
      const option = document.createElement('div');
      option.className = `theme-option ${document.documentElement.classList.contains(`theme-${key}`) ? 'active' : ''}`;
      option.dataset.theme = key;
      
      const colorCircle = document.createElement('div');
      colorCircle.className = `theme-color theme-${key}-color`;
      
      const name = document.createElement('div');
      name.className = 'theme-name';
      name.textContent = themes[key].name;
      
      option.appendChild(colorCircle);
      option.appendChild(name);
      
      // Add click event
      option.addEventListener('click', () => switchTheme(key));
      
      switcher.appendChild(option);
    });
    
    document.body.appendChild(switcher);
  }
  
  // Load saved theme
  const savedTheme = localStorage.getItem('quanty-theme');
  if (savedTheme && themes[savedTheme]) {
    switchTheme(savedTheme, true);
  }
}

// Switch theme with animation
function switchTheme(theme, skipAnimation = false) {
  if (!themes[theme]) return;
  
  // Save preference
  localStorage.setItem('quanty-theme', theme);
  
  if (skipAnimation) {
    // Just apply the theme
    applyTheme(theme);
    return;
  }
  
  // Create transition overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = themes[theme].colors.background;
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.5s ease';
  overlay.style.pointerEvents = 'none';
  
  document.body.appendChild(overlay);
  
  // Fade in
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    
    // Switch theme
    setTimeout(() => {
      applyTheme(theme);
      
      // Fade out
      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        
        // Remove overlay
        setTimeout(() => {
          overlay.remove();
        }, 500);
      }, 300);
    }, 300);
  }, 10);
}

// Apply theme without animation
function applyTheme(theme) {
  // Remove all theme classes
  Object.keys(themes).forEach(key => {
    document.documentElement.classList.remove(`theme-${key}`);
  });
  
  // Add new theme class
  document.documentElement.classList.add(`theme-${theme}`);
  
  // Update active state in switcher
  const options = document.querySelectorAll('.theme-option');
  options.forEach(option => {
    if (option.dataset.theme === theme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
  
  // Update 3D background
  update3DBackground(theme);
}

// Initialize custom cursor effects
function initCursorEffects() {
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.style.position = 'fixed';
  cursor.style.width = '30px';
  cursor.style.height = '30px';
  cursor.style.borderRadius = '50%';
  cursor.style.border = '2px solid var(--primary)';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '9999';
  cursor.style.mixBlendMode = 'difference';
  cursor.style.transition = 'width 0.3s, height 0.3s, border-color 0.3s';
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorDot.style.position = 'fixed';
  cursorDot.style.width = '5px';
  cursorDot.style.height = '5px';
  cursorDot.style.backgroundColor = 'var(--accent)';
  cursorDot.style.borderRadius = '50%';
  cursorDot.style.transform = 'translate(-50%, -50%)';
  cursorDot.style.pointerEvents = 'none';
  cursorDot.style.zIndex = '9999';
  cursorDot.style.transition = 'transform 0.1s';
  
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);
  
  // Track mouse movement
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Add slight delay to dot for trailing effect
    setTimeout(() => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    }, 50);
    
    // Create trail particles
    createTrailParticle(e.clientX, e.clientY);
  });
  
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

// Create cursor trail particle
function createTrailParticle(x, y) {
  // Limit particle creation rate
  if (Math.random() > 0.3) return;
  
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.width = '5px';
  particle.style.height = '5px';
  particle.style.backgroundColor = 'var(--primary)';
  particle.style.borderRadius = '50%';
  particle.style.opacity = '0.5';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.transform = 'translate(-50%, -50%)';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '9998';
  particle.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  
  document.body.appendChild(particle);
  
  // Animate and remove
  setTimeout(() => {
    particle.style.opacity = '0';
    particle.style.transform = 'translate(-50%, -50%) scale(2)';
    
    setTimeout(() => {
      particle.remove();
    }, 500);
  }, 100);
}

// Initialize scroll effects
function initScrollEffects() {
  // Create scroll progress indicator
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.style.position = 'fixed';
  progress.style.top = '0';
  progress.style.left = '0';
  progress.style.width = '0';
  progress.style.height = '3px';
  progress.style.background = 'var(--gradient-primary, linear-gradient(90deg, var(--primary), var(--accent)))';
  progress.style.zIndex = '1001';
  progress.style.transition = 'width 0.1s ease';
  
  document.body.appendChild(progress);
  
  // Update progress on scroll
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = `${scrolled}%`;
  });
  
  // Add GSAP ScrollTrigger if available
  if (window.gsap && window.ScrollTrigger) {
    initGSAPScrollEffects();
  } else {
    // Fallback to Intersection Observer
    initBasicScrollEffects();
  }
}

// Initialize basic scroll effects with Intersection Observer
function initBasicScrollEffects() {
  // Add reveal classes to elements
  document.querySelectorAll('.reveal, .fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
    // Add initial styles
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    if (el.classList.contains('slide-up')) {
      el.style.transform = 'translateY(50px)';
    } else if (el.classList.contains('slide-left')) {
      el.style.transform = 'translateX(-50px)';
    } else if (el.classList.contains('slide-right')) {
      el.style.transform = 'translateX(50px)';
    }
    
    // Create observer
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate(0, 0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(el);
  });
}

// Initialize GSAP ScrollTrigger effects
function initGSAPScrollEffects() {
  // Reveal animations
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Slide animations
  gsap.utils.toArray('.slide-left').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      x: -50,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  gsap.utils.toArray('.slide-right').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      x: 50,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Parallax effects
  gsap.utils.toArray('.parallax').forEach(el => {
    gsap.to(el, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// Initialize 3D background with Three.js
function init3DBackground() {
  // Check if Three.js is available
  if (!window.THREE) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
      createThreeJSBackground();
    });
  } else {
    createThreeJSBackground();
  }
}

// Create Three.js background
function createThreeJSBackground() {
  // Create container
  const container = document.createElement('div');
  container.className = 'webgl-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '-1';
  container.style.opacity = '0.8';
  
  document.body.appendChild(container);
  
  // Get current theme
  const currentTheme = getCurrentTheme();
  
  // Initialize Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Add fog
  scene.fog = new THREE.FogExp2(themes[currentTheme].colors.background, 0.015);
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(
    new THREE.Color(themes[currentTheme].colors.primary),
    0.8
  );
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create particles
  const particleCount = 2000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(themes[currentTheme].colors.primary),
    size: 0.1,
    transparent: true,
    opacity: 0.7
  });
  
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  
  // Position camera
  camera.position.z = 5;
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;
    
    // Render scene
    renderer.render(scene, camera);
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Start animation
  animate();
  
  // Store scene references for updates
  window.threeJSScene = {
    scene,
    camera,
    renderer,
    particleSystem,
    directionalLight
  };
}

// Update 3D background for theme
function update3DBackground(theme) {
  if (!window.threeJSScene) return;
  
  const { particleSystem, directionalLight, scene } = window.threeJSScene;
  
  // Update particle color
  if (particleSystem && particleSystem.material) {
    particleSystem.material.color.set(themes[theme].colors.primary);
  }
  
  // Update light color
  if (directionalLight) {
    directionalLight.color.set(themes[theme].colors.primary);
  }
  
  // Update fog color
  if (scene && scene.fog) {
    scene.fog.color.set(themes[theme].colors.background);
  }
}

// Initialize micro-interactions
function initMicroInteractions() {
  // Add ripple effect to buttons
  document.querySelectorAll('button, .btn, [role="button"]').forEach(button => {
    button.classList.add('ripple');
    
    button.addEventListener('click', e => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.position = 'absolute';
      ripple.style.top = `${y}px`;
      ripple.style.left = `${x}px`;
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.transition = 'width 0.6s, height 0.6s, opacity 0.6s';
      
      button.appendChild(ripple);
      
      // Animate ripple
      setTimeout(() => {
        const size = Math.max(button.offsetWidth, button.offsetHeight) * 2;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.opacity = '0';
        
        // Remove ripple
        setTimeout(() => {
          ripple.remove();
        }, 600);
      }, 10);
    });
  });
  
  // Add hover glow effect
  document.querySelectorAll('.hover-glow').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 0 15px var(--primary)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = 'none';
    });
  });
}

// Initialize voice reactive elements
function initVoiceReactive() {
  // Create voice animation container
  const voiceContainer = document.createElement('div');
  voiceContainer.className = 'voice-animation';
  voiceContainer.style.display = 'none';
  voiceContainer.style.alignItems = 'center';
  voiceContainer.style.gap = '3px';
  voiceContainer.style.height = '30px';
  
  // Create voice bars
  for (let i = 0; i < 5; i++) {
    const bar = document.createElement('div');
    bar.className = 'voice-bar';
    bar.style.width = '3px';
    bar.style.height = '100%';
    bar.style.backgroundColor = 'var(--primary)';
    bar.style.borderRadius = '3px';
    bar.style.animation = `voiceWave 0.5s infinite alternate`;
    bar.style.animationDelay = `${i * 0.1}s`;
    
    voiceContainer.appendChild(bar);
  }
  
  document.body.appendChild(voiceContainer);
  
  // Expose voice animation control
  window.voiceAnimation = {
    show: () => {
      voiceContainer.style.display = 'flex';
      voiceContainer.style.position = 'fixed';
      voiceContainer.style.bottom = '20px';
      voiceContainer.style.right = '20px';
      voiceContainer.style.zIndex = '100';
    },
    hide: () => {
      voiceContainer.style.display = 'none';
    },
    setAmplitude: (value) => {
      // Scale between 0.1 and 1
      const amplitude = Math.max(0.1, Math.min(1, value));
      
      // Update bar heights
      const bars = voiceContainer.querySelectorAll('.voice-bar');
      bars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
        bar.style.height = `${amplitude * 100}%`;
      });
    }
  };
}

// Initialize user presence indicators
function initUserPresence() {
  // Create WebSocket connection if available
  if (window.WebSocket) {
    // This is a mock implementation - in a real app, connect to your WebSocket server
    console.log('WebSocket support available for user presence');
    
    // Mock user presence with random indicators
    setInterval(() => {
      // Simulate other users with random positions
      if (Math.random() > 0.7) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        showUserPresence(x, y);
      }
    }, 3000);
  }
}

// Show user presence indicator
function showUserPresence(x, y) {
  const indicator = document.createElement('div');
  indicator.className = 'user-presence';
  indicator.style.position = 'fixed';
  indicator.style.width = '10px';
  indicator.style.height = '10px';
  indicator.style.backgroundColor = 'var(--primary)';
  indicator.style.borderRadius = '50%';
  indicator.style.opacity = '0.7';
  indicator.style.left = `${x}px`;
  indicator.style.top = `${y}px`;
  indicator.style.transform = 'translate(-50%, -50%)';
  indicator.style.boxShadow = '0 0 10px var(--primary)';
  indicator.style.zIndex = '100';
  indicator.style.pointerEvents = 'none';
  
  document.body.appendChild(indicator);
  
  // Animate and remove
  gsapFallback(indicator, {
    opacity: 0,
    scale: 2,
    duration: 2,
    onComplete: () => indicator.remove()
  });
}

// Helper function to get current theme
function getCurrentTheme() {
  const html = document.documentElement;
  
  for (const theme in themes) {
    if (html.classList.contains(`theme-${theme}`)) {
      return theme;
    }
  }
  
  return 'batman'; // Default
}

// Helper function to load script
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// GSAP fallback animation
function gsapFallback(element, options) {
  if (window.gsap) {
    gsap.to(element, options);
  } else {
    // Basic fallback
    element.style.transition = `opacity ${options.duration}s ease, transform ${options.duration}s ease`;
    element.style.opacity = options.opacity;
    element.style.transform = `scale(${options.scale})`;
    
    if (options.onComplete) {
      setTimeout(options.onComplete, options.duration * 1000);
    }
  }
}

// Export theme functions
window.quantyTheme = {
  switchTheme,
  getCurrentTheme,
  themes
};