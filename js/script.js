document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initNavbar();
  initEmergencyRibbon();
  initCounters();
});

// Theme Toggle
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  });
}

// Scroll Reveal
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.style.opacity = '1');
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after revealing to only trigger once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    // Add staggered delay based on siblings if they have a data-delay attribute
    const delay = el.getAttribute('data-delay');
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
    observer.observe(el);
  });
}

// Navbar Sticky & Mobile Menu
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  // For mobile menu expansion - assuming there's a mobile nav container
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// Emergency Ribbon Dismiss
function initEmergencyRibbon() {
  const ribbon = document.querySelector('.emergency-ribbon');
  const dismissBtn = document.querySelector('.emergency-ribbon .btn-close');
  
  if (ribbon && dismissBtn) {
    const isDismissed = sessionStorage.getItem('emergencyRibbonDismissed');
    if (isDismissed) {
      ribbon.style.display = 'none';
    } else {
      dismissBtn.addEventListener('click', () => {
        ribbon.style.display = 'none';
        sessionStorage.setItem('emergencyRibbonDismissed', 'true');
      });
    }
  }
}

// Stats Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || counters.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000; // ms
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // easeOutQuad
    const easeProgress = progress * (2 - progress);
    const current = Math.floor(easeProgress * target);
    
    el.innerText = current.toLocaleString();
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.innerText = target.toLocaleString(); // Ensure it finishes exactly at target
    }
  };
  
  window.requestAnimationFrame(step);
}
