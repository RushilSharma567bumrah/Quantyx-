// 3D Hero Effect for Quanty AI

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta');
  
  if (!hero || !heroContent) return;
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Update mouse position on move
  hero.addEventListener('mousemove', (e) => {
    // Get mouse position relative to hero section
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left - rect.width / 2;
    mouseY = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation based on mouse position
    const rotateX = mouseY * -0.01;
    const rotateY = mouseX * 0.01;
    
    // Apply rotation to hero content
    heroContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Apply parallax effect to title, subtitle, and CTA
    if (heroTitle) {
      heroTitle.style.transform = `translateZ(50px) translateX(${mouseX * 0.02}px) translateY(${mouseY * 0.02}px)`;
    }
    
    if (heroSubtitle) {
      heroSubtitle.style.transform = `translateZ(30px) translateX(${mouseX * 0.01}px) translateY(${mouseY * 0.01}px)`;
    }
    
    if (heroCta) {
      heroCta.style.transform = `translateZ(70px) translateX(${mouseX * 0.03}px) translateY(${mouseY * 0.03}px)`;
    }
  });
  
  // Reset transform on mouse leave
  hero.addEventListener('mouseleave', () => {
    heroContent.style.transform = 'rotateX(0deg) rotateY(0deg)';
    
    if (heroTitle) {
      heroTitle.style.transform = 'translateZ(50px)';
    }
    
    if (heroSubtitle) {
      heroSubtitle.style.transform = 'translateZ(30px)';
    }
    
    if (heroCta) {
      heroCta.style.transform = 'translateZ(70px)';
    }
  });
});