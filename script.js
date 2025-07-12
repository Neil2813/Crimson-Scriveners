/**
 * CRIMSON SCRIVENERS - MAIN SCRIPT
 * Enhanced with cinematic horror effects
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
  const navbar = document.querySelector('[data-navbar]');
  const header = document.querySelector('[data-header]');
  const backTopBtn = document.querySelector('[data-back-top-btn]');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  
  // Mobile Nav Toggle with sound effect
  navToggleBtn.addEventListener('click', function() {
    navbar.classList.toggle('active');
    this.classList.toggle('active');
    playSound('click');
  });

  // Close mobile menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        navToggleBtn.classList.remove('active');
        playSound('hover');
      }
    });
    
    // Add hover sound effect
    link.addEventListener('mouseenter', () => playSound('hover'));
  });

  // Header scroll behavior with improved effects
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Enhanced header background transition
    if (currentScroll >= 100) {
      header.classList.add('active');
      // Dynamic opacity and blur based on scroll
      const opacity = Math.min(0.95, currentScroll / 400);
      const blur = Math.min(10, currentScroll / 50);
      header.style.backgroundColor = `rgba(13, 17, 23, ${opacity})`;
      header.style.backdropFilter = `blur(${blur}px)`;
    } else {
      header.classList.remove('active');
      header.style.backgroundColor = 'transparent';
      header.style.backdropFilter = 'none';
    }

    // Back to top button with glow effect
    if (currentScroll >= 500) {
      backTopBtn.classList.add('active');
      backTopBtn.style.boxShadow = `0 0 15px rgba(220, 20, 60, ${Math.min(0.7, (currentScroll - 500) / 1000)})`;
    } else {
      backTopBtn.classList.remove('active');
      backTopBtn.style.boxShadow = 'none';
    }
    
    // Cinematic parallax effect for hero section
    if (document.querySelector('.hero')) {
      const hero = document.querySelector('.hero');
      const scrollValue = currentScroll * 0.5;
      hero.style.backgroundPositionY = `${scrollValue}px`;
      hero.style.filter = `brightness(${100 - Math.min(20, currentScroll / 20)}%)`;
    }
    
    // Blood drip effect on scroll
    if (currentScroll > lastScroll && currentScroll > 300) {
      createBloodDrip();
    }
    
    lastScroll = currentScroll;
  });

  // Enhanced smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        playSound('click');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Blood ripple effect on target element
        setTimeout(() => {
          createBloodRipple(targetElement);
        }, 800);
      }
    });
  });

  // Current year for footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Initialize all effects
  initCinematicEffects();
  
  // Add bats to the background
  spawnBats(5);
});

/**
 * Initialize all cinematic effects
 */
function initCinematicEffects() {
  // Portfolio card hover effects
  setupPortfolioHover();
  
  // Section entrance animations
  setupScrollAnimations();
  
  // Text reveal effects
  setupTextReveals();
  
  // Interactive blood effects
  setupBloodEffects();
  
  // Candle flicker effect for team section
  setupCandleFlicker();
}

/**
 * Portfolio card hover effects with enhanced visuals
 */
function setupPortfolioHover() {
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  portfolioCards.forEach(card => {
    const content = card.querySelector('.portfolio-content');
    const bloodTrail = card.querySelector('.blood-trail');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate percentage position
      const xPercent = x / rect.width * 100;
      const yPercent = y / rect.height * 100;
      
      // Apply 3D tilt effect
      card.style.transform = `
        perspective(1000px) 
        rotateX(${(yPercent - 50) / 8}deg) 
        rotateY(${(50 - xPercent) / 8}deg)
        scale(1.03)
      `;
      
      // Dynamic gradient effect
      content.style.background = `
        radial-gradient(
          circle at ${xPercent}% ${yPercent}%, 
          rgba(220, 20, 60, 0.2) 0%, 
          rgba(0, 0, 0, 0.9) 80%
        )
      `;
      
      // Blood trail follows mouse
      if (bloodTrail) {
        bloodTrail.style.width = `${xPercent}%`;
        bloodTrail.style.opacity = '1';
      }
      
      // Subtle blood drop effect
      if (Math.random() > 0.95) {
        createBloodDrop(card, xPercent, yPercent);
      }
    });
    
    card.addEventListener('mouseenter', () => {
      playSound('hover');
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      content.style.background = 'rgba(0, 0, 0, 0.85)';
      
      if (bloodTrail) {
        bloodTrail.style.opacity = '0';
      }
    });
    
    // Click effect
    card.addEventListener('click', () => {
      playSound('click');
      createBloodSplatter(card);
    });
  });
}

/**
 * Setup scroll animations for sections with horror theme
 */
function setupScrollAnimations() {
  const animateOnScroll = (elements) => {
    elements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('animate');
        
        // Add blood drip when section comes into view
        if (!element.hasAttribute('data-blood-dripped')) {
          element.setAttribute('data-blood-dripped', 'true');
          setTimeout(() => {
            createBloodDrip(element);
          }, 500);
        }
      }
    });
  };
  
  // Get all sections with data-animate attribute
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  // Initial check
  animateOnScroll(animatedElements);
  
  // Check on scroll with throttle
  let isScrolling;
  window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      animateOnScroll(animatedElements);
    }, 100);
  }, false);
}

/**
 * Enhanced text reveal effects with horror theme
 */
function setupTextReveals() {
  const revealElements = document.querySelectorAll('.hero-title, .section-title, .section-subtitle');
  
  revealElements.forEach(el => {
    const originalText = el.textContent;
    el.textContent = '';
    el.style.opacity = '1';
    
    // Create blood drip effect container
    const dripContainer = document.createElement('div');
    dripContainer.className = 'blood-drip-container';
    el.parentNode.insertBefore(dripContainer, el);
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < originalText.length) {
        // Random delay for creepy effect
        const delay = 30 + Math.random() * 70;
        
        setTimeout(() => {
          el.textContent += originalText.charAt(i);
          
          // Occasionally add blood drip during typing
          if (Math.random() > 0.9) {
            createBloodDrip(dripContainer);
          }
          
          i++;
        }, delay);
      } else {
        clearInterval(typingInterval);
        // Final blood drip after typing completes
        setTimeout(() => {
          createBloodDrip(dripContainer);
          playSound('drip');
        }, 300);
      }
    }, 50);
  });
}

/**
 * Setup interactive blood effects
 */
function setupBloodEffects() {
  // Add blood ripple effect to all buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      createBloodRipple(this);
      playSound('click');
    });
    
    btn.addEventListener('mouseenter', () => playSound('hover'));
  });
  
  // Blood effect on team member hover
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (Math.random() > 0.7) {
        createBloodDrop(card, Math.random() * 100, Math.random() * 100);
      }
    });
  });
}

/**
 * Create a blood drip effect
 */
function createBloodDrip(parentElement = document.body) {
  const drip = document.createElement('div');
  drip.className = 'blood-drip';
  
  // Random positioning
  const leftPos = Math.random() * 100;
  drip.style.left = `${leftPos}%`;
  
  // Random size
  const width = 1 + Math.random() * 3;
  const height = 20 + Math.random() * 50;
  drip.style.width = `${width}px`;
  drip.style.height = `${height}px`;
  
  // Random delay
  drip.style.animationDelay = `${Math.random() * 0.5}s`;
  
  parentElement.appendChild(drip);
  
  // Remove after animation completes
  setTimeout(() => {
    drip.remove();
  }, 1000);
}

/**
 * Create a blood drop effect
 */
function createBloodDrop(parentElement, xPercent, yPercent) {
  const drop = document.createElement('div');
  drop.className = 'blood-drop';
  
  drop.style.left = `${xPercent}%`;
  drop.style.top = `${yPercent}%`;
  
  // Random size
  const size = 5 + Math.random() * 15;
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;
  
  parentElement.appendChild(drop);
  
  // Remove after animation completes
  setTimeout(() => {
    drop.remove();
  }, 2000);
}

/**
 * Create a blood ripple effect
 */
function createBloodRipple(element) {
  const ripple = document.createElement('div');
  ripple.className = 'blood-ripple';
  
  // Position at center of element
  const rect = element.getBoundingClientRect();
  ripple.style.left = `${rect.left + rect.width / 2}px`;
  ripple.style.top = `${rect.top + rect.height / 2}px`;
  
  document.body.appendChild(ripple);
  
  // Remove after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 2000);
}

/**
 * Create a blood splatter effect
 */
function createBloodSplatter(element) {
  const splatter = document.createElement('div');
  splatter.className = 'blood-splatter';
  
  // Random splatter pattern
  const splatterCount = 5 + Math.floor(Math.random() * 10);
  splatter.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${Array(splatterCount).fill().map(() => 
    `<path fill="%23dc143c" d="M${30 + Math.random() * 40},${15 + Math.random() * 40} Q${40 + Math.random() * 20},${5 + Math.random() * 20} ${50 + Math.random() * 20},${15 + Math.random() * 20} T${70 + Math.random() * 20},${15 + Math.random() * 20} Q${80 + Math.random() * 20},${25 + Math.random() * 20} ${70 + Math.random() * 20},${35 + Math.random() * 20} T${50 + Math.random() * 20},${55 + Math.random() * 20} Q${40 + Math.random() * 20},${65 + Math.random() * 20} ${30 + Math.random() * 20},${55 + Math.random() * 20} T${10 + Math.random() * 20},${35 + Math.random() * 20} Q${0 + Math.random() * 20},${25 + Math.random() * 20} ${10 + Math.random() * 20},${15 + Math.random() * 20} T${30 + Math.random() * 20},${15 + Math.random() * 20}" opacity="0.6"/>`
  ).join('')}</svg>')`;
  
  element.appendChild(splatter);
  
  // Remove after animation completes
  setTimeout(() => {
    splatter.remove();
  }, 1000);
}

/**
 * Setup candle flicker effect for team section
 */
function setupCandleFlicker() {
  const teamCards = document.querySelectorAll('.team-card');
  
  teamCards.forEach((card, index) => {
    // Add flicker at different intervals for each card
    setInterval(() => {
      const intensity = 0.7 + Math.random() * 0.3;
      card.style.boxShadow = `0 0 ${10 * intensity}px ${2 * intensity}px rgba(220, 20, 60, ${0.2 * intensity}), 0 0 ${20 * intensity}px ${5 * intensity}px rgba(220, 20, 60, ${0.1 * intensity})`;
    }, 300 + Math.random() * 700);
  });
}

/**
 * Spawn bats in the background
 */
function spawnBats(count) {
  const batsContainer = document.createElement('div');
  batsContainer.className = 'bats-container';
  document.body.appendChild(batsContainer);
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const bat = document.createElement('div');
      bat.className = 'bat';
      bat.innerHTML = '🦇';
      
      // Random start position
      bat.style.setProperty('--start-x', `${Math.random() * 100}%`);
      bat.style.setProperty('--start-y', `${Math.random() * 100}%`);
      
      // Random animation duration
      const duration = 15 + Math.random() * 30;
      bat.style.setProperty('--duration', `${duration}s`);
      
      // Random delay
      bat.style.setProperty('--delay', `${Math.random() * 20}s`);
      
      batsContainer.appendChild(bat);
      
      // Remove bat after animation completes
      setTimeout(() => {
        bat.remove();
      }, duration * 1000);
    }, i * 2000); // Stagger bat appearances
  }
  
  // Continuously spawn more bats
  setTimeout(() => spawnBats(count), count * 2500);
}

/**
 * Play sound effects
 */
function playSound(type) {
  // In a real implementation, you would use the Web Audio API or play audio files
  // This is a placeholder that could be implemented with actual sound files
  console.log(`Playing ${type} sound`);
  
  // Example of how this might work with actual sounds:
  /*
  const sound = new Audio(`sounds/${type}.mp3`);
  sound.volume = 0.3;
  sound.play();
  */
}

/**
 * Helper function to check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}