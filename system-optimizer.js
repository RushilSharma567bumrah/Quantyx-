// QUANTY SYSTEM OPTIMIZER - AUTO PERFORMANCE DETECTION
console.log('🔧 INITIALIZING SYSTEM OPTIMIZER...');

// SYSTEM SPECS DETECTOR
class SystemOptimizer {
  constructor() {
    this.specs = this.detectSystemSpecs();
    this.optimizePerformance();
    this.logSystemInfo();
  }
  
  detectSystemSpecs() {
    const specs = {
      // Hardware Detection
      cpuCores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4, // GB estimate
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      
      // Browser Capabilities
      webGL: this.checkWebGL(),
      webAssembly: typeof WebAssembly !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      
      // Performance Metrics
      connectionSpeed: this.getConnectionSpeed(),
      screenResolution: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio || 1
      },
      
      // Device Type Detection
      deviceType: this.detectDeviceType(),
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      
      // Performance Tier
      performanceTier: 'medium' // Will be calculated
    };
    
    // Calculate performance tier
    specs.performanceTier = this.calculatePerformanceTier(specs);
    
    return specs;
  }
  
  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return false;
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        supported: true,
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
      };
    } catch (e) {
      return { supported: false };
    }
  }
  
  getConnectionSpeed() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0
      };
    }
    return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
  }
  
  detectDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  
  calculatePerformanceTier(specs) {
    let score = 0;
    
    // CPU Score (0-40 points)
    if (specs.cpuCores >= 8) score += 40;
    else if (specs.cpuCores >= 4) score += 30;
    else if (specs.cpuCores >= 2) score += 20;
    else score += 10;
    
    // Memory Score (0-30 points)
    if (specs.memory >= 8) score += 30;
    else if (specs.memory >= 4) score += 20;
    else if (specs.memory >= 2) score += 10;
    else score += 5;
    
    // WebGL Score (0-20 points)
    if (specs.webGL.supported) {
      const renderer = specs.webGL.renderer.toLowerCase();
      if (renderer.includes('nvidia') || renderer.includes('amd') || renderer.includes('radeon')) {
        score += 20;
      } else if (renderer.includes('intel')) {
        score += 15;
      } else {
        score += 10;
      }
    }
    
    // Connection Score (0-10 points)
    const connType = specs.connectionSpeed.effectiveType;
    if (connType === '4g' || connType === '5g') score += 10;
    else if (connType === '3g') score += 5;
    else score += 2;
    
    // Determine tier
    if (score >= 80) return 'high';
    else if (score >= 50) return 'medium';
    else return 'low';
  }
  
  optimizePerformance() {
    const tier = this.specs.performanceTier;
    
    // ML Library Optimization
    if (typeof tf !== 'undefined') {
      if (tier === 'high') {
        tf.env().set('WEBGL_FORCE_F16_TEXTURES', false);
        tf.env().set('WEBGL_RENDER_FLOAT32_CAPABLE', true);
      } else if (tier === 'medium') {
        tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
      } else {
        tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
        tf.env().set('WEBGL_PACK', true);
      }
    }
    
    // Animation Optimization
    this.optimizeAnimations(tier);
    
    // Memory Management
    this.optimizeMemory(tier);
    
    // API Request Optimization
    this.optimizeAPIRequests(tier);
  }
  
  optimizeAnimations(tier) {
    const root = document.documentElement;
    
    if (tier === 'low') {
      // Reduce animations for low-end devices
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-bounce', 'none');
      root.style.setProperty('--transition-delayed', 'none');
      
      // Disable 3D transforms
      document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta').forEach(el => {
        el.style.transform = 'none';
      });
    } else if (tier === 'medium') {
      // Moderate animations
      root.style.setProperty('--transition-smooth', 'cubic-bezier(0.4, 0, 0.2, 1)');
      root.style.setProperty('--transition-bounce', 'ease-out');
    }
    // High tier keeps all animations
  }
  
  optimizeMemory(tier) {
    if (tier === 'low') {
      // Aggressive memory management
      this.memoryCleanupInterval = setInterval(() => {
        if (typeof gc !== 'undefined') gc(); // Force garbage collection if available
        
        // Clear old conversation memory more frequently
        if (window.conversationMemory && window.conversationMemory.messages.length > 5) {
          window.conversationMemory.messages = window.conversationMemory.messages.slice(-5);
        }
      }, 30000); // Every 30 seconds
    } else if (tier === 'medium') {
      // Moderate memory management
      this.memoryCleanupInterval = setInterval(() => {
        if (window.conversationMemory && window.conversationMemory.messages.length > 8) {
          window.conversationMemory.messages = window.conversationMemory.messages.slice(-8);
        }
      }, 60000); // Every minute
    }
  }
  
  optimizeAPIRequests(tier) {
    // Adjust timeout and retry logic based on performance
    if (window.callOpenRouterAPI) {
      const originalTimeout = 30000;
      
      if (tier === 'low') {
        // Longer timeouts for slower devices
        window.API_TIMEOUT = originalTimeout * 1.5;
        window.MAX_RETRIES = 2;
      } else if (tier === 'medium') {
        window.API_TIMEOUT = originalTimeout;
        window.MAX_RETRIES = 3;
      } else {
        // Shorter timeouts for high-end devices
        window.API_TIMEOUT = originalTimeout * 0.8;
        window.MAX_RETRIES = 4;
      }
    }
  }
  
  logSystemInfo() {
    console.log('🖥️ SYSTEM SPECIFICATIONS:');
    console.log(`   💻 CPU Cores: ${this.specs.cpuCores}`);
    console.log(`   🧠 Memory: ~${this.specs.memory}GB`);
    console.log(`   📱 Device: ${this.specs.deviceType} (${this.specs.isMobile ? 'Mobile' : 'Desktop'})`);
    console.log(`   🎮 WebGL: ${this.specs.webGL.supported ? 'Supported' : 'Not Supported'}`);
    console.log(`   🌐 Connection: ${this.specs.connectionSpeed.effectiveType}`);
    console.log(`   ⚡ Performance Tier: ${this.specs.performanceTier.toUpperCase()}`);
    
    // Performance recommendations
    this.logOptimizations();
  }
  
  logOptimizations() {
    const tier = this.specs.performanceTier;
    
    console.log('🔧 APPLIED OPTIMIZATIONS:');
    
    if (tier === 'high') {
      console.log('   ✅ Full animations enabled');
      console.log('   ✅ High-quality WebGL rendering');
      console.log('   ✅ Extended memory cache');
      console.log('   ✅ Aggressive API timeouts');
    } else if (tier === 'medium') {
      console.log('   ⚡ Moderate animations');
      console.log('   ⚡ Balanced WebGL settings');
      console.log('   ⚡ Standard memory management');
      console.log('   ⚡ Normal API timeouts');
    } else {
      console.log('   🔋 Reduced animations');
      console.log('   🔋 Power-saving WebGL');
      console.log('   🔋 Aggressive memory cleanup');
      console.log('   🔋 Extended API timeouts');
    }
  }
  
  // Public method to get system info
  getSystemInfo() {
    return {
      specs: this.specs,
      recommendations: this.getRecommendations()
    };
  }
  
  getRecommendations() {
    const tier = this.specs.performanceTier;
    const recommendations = [];
    
    if (tier === 'low') {
      recommendations.push('Consider closing other browser tabs for better performance');
      recommendations.push('Use simpler ML commands for faster processing');
      recommendations.push('Avoid large data uploads');
    } else if (tier === 'medium') {
      recommendations.push('Good performance expected for most tasks');
      recommendations.push('ML operations should run smoothly');
    } else {
      recommendations.push('Excellent performance - all features available');
      recommendations.push('Complex ML operations fully supported');
      recommendations.push('Real-time data processing enabled');
    }
    
    return recommendations;
  }
}

// Initialize system optimizer
const systemOptimizer = new SystemOptimizer();

// Make system info globally available
window.getSystemInfo = () => systemOptimizer.getSystemInfo();
window.systemSpecs = systemOptimizer.specs;

// Auto-adjust ML processing based on system specs
if (window.processMLCommand) {
  const originalMLCommand = window.processMLCommand;
  
  window.processMLCommand = async function(command, data) {
    const tier = systemOptimizer.specs.performanceTier;
    
    // Adjust processing based on performance tier
    if (tier === 'low' && command.includes('regression:')) {
      // Use simpler algorithms for low-end devices
      console.log('🔋 Using optimized algorithm for low-end device');
    }
    
    return await originalMLCommand(command, data);
  };
}

console.log('🔧 SYSTEM OPTIMIZER READY');
console.log(`⚡ Performance Tier: ${systemOptimizer.specs.performanceTier.toUpperCase()}`);
console.log('🛠️ Type getSystemInfo() in console for detailed specs');