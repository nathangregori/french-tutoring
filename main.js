document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize GSAP
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize carousel
  initCarousel();
  // Initialize mobile menu
  initMobileMenu();
  // Initialize FAQ toggles
  initFaqAccordion();
});

function initAnimations() {
  // Page load timeline
  const loadTimeline = gsap.timeline();

  // Hero animations
  loadTimeline.fromTo('.headline', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 0.2);

  loadTimeline.fromTo('.subheadline', 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 }, 0.5);

  loadTimeline.fromTo('.cta-group', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 }, 0.7);

  // Profile image and floating icons
  loadTimeline.fromTo('.profile-image', 
    { scale: 0.9, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, 0.3);
  
  // Staggered animation for floating icons
  loadTimeline.fromTo('.floating-icon', 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, stagger: 0.2, duration: 0.6, ease: "back.out(1.5)" }, 0.6);

  // Scroll animations
  initScrollTriggers();

  // Floating icons parallax
  document.addEventListener('mousemove', moveIcons);
  
  // Card hover effects
  initCardHoverEffects();
}

function initScrollTriggers() {
  // Animate sections on scroll
  const sections = document.querySelectorAll('section:not(.hero):not(.social-proof)');
  sections.forEach(section => {
    gsap.fromTo(section, 
      { y: 30, opacity: 0.6 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stats counter animation
  document.querySelectorAll('.stat-number').forEach(stat => {
    let targetValue = stat.textContent;
    let isSuffix = false;
    let suffix = '';

    if (targetValue.includes('+')) {
      isSuffix = true;
      suffix = '+';
      targetValue = parseInt(targetValue.replace(/\D/g, ''));
    } else if (targetValue.includes('%')) {
      isSuffix = true;
      suffix = '%';
      targetValue = parseInt(targetValue.replace(/\D/g, ''));
    } else {
      targetValue = parseInt(targetValue.replace(/\D/g, ''));
    }

    gsap.fromTo(stat, 
      { innerText: 0 },
      { 
        innerText: targetValue,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: stat.closest('.stat-card'),
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: function() {
          if (isSuffix) {
            stat.textContent = Math.floor(this.targets()[0].innerText) + suffix;
          }
        }
      }
    );
  });

  // Service cards stagger
  gsap.fromTo('.service-card',
    { y: 40, opacity: 0 },
    { 
      y: 0, 
      opacity: 1,
      stagger: 0.15,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    }
  );
  
  // Features list stagger
  gsap.fromTo('.features-list li',
    { x: -20, opacity: 0 },
    { 
      x: 0, 
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.features-list',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

function moveIcons(e) {
  const icons = document.querySelectorAll('.floating-icon');
  if (!icons.length) return;
  
  const moveX = (e.clientX / window.innerWidth - 0.5);
  const moveY = (e.clientY / window.innerHeight - 0.5);
  
  icons.forEach(icon => {
    const speedFactor = parseFloat(icon.getAttribute('data-speed') || 1);
    const xFactor = 20 * speedFactor;
    const yFactor = 20 * speedFactor;
    
    gsap.to(icon, {
      x: moveX * xFactor,
      y: moveY * yFactor,
      duration: 1,
      ease: "power2.out"
    });
  });
}

function initCardHoverEffects() {
  // Service cards hover effect
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.play-button'), {
        scale: 1.1,
        backgroundColor: 'var(--primary)',
        color: 'white',
        duration: 0.3
      });
      
      const thumbnail = card.querySelector('img') || card.querySelector('.placeholder-img');
      if (thumbnail) {
        gsap.to(thumbnail, {
          scale: 1.05,
          duration: 0.5
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.play-button'), {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: 'var(--primary)',
        duration: 0.3
      });
      
      const thumbnail = card.querySelector('img') || card.querySelector('.placeholder-img');
      if (thumbnail) {
        gsap.to(thumbnail, {
          scale: 1,
          duration: 0.5
        });
      }
    });
  });
}

function initCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentSlide = [...dots].findIndex(dot => dot.classList.contains('active'));
  if (currentSlide === -1) currentSlide = 0;
  let startX, endX;
  const carousel = document.querySelector('.testimonial-carousel');
  
  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    // Update active class on slides
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        gsap.to(slide, { scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)', duration: 0.4 });
      } else {
        slide.classList.remove('active');
        gsap.to(slide, { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.4 });
      }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });
  
  // Auto-advance slide every 5 seconds
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      showSlide(currentSlide + 1);
    }
  }, 6000);

  // Add touch swipe support for mobile
  if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, false);
    
    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      
      if (startX - endX > 50) {
        // Swipe left - next slide
        showSlide(currentSlide + 1);
      } else if (endX - startX > 50) {
        // Swipe right - previous slide
        showSlide(currentSlide - 1);
      }
    }, false);
  }
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
    
    // Close menu when window is resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          gsap.to(otherItem.querySelector('.faq-answer'), {
            height: 0,
            duration: 0.3,
            opacity: 0,
            onComplete: function() {
              otherItem.querySelector('.faq-answer').style.display = 'none';
            }
          });
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        gsap.to(answer, {
          height: 0,
          duration: 0.3,
          opacity: 0,
          onComplete: function() {
            answer.style.display = 'none';
          }
        });
      } else {
        item.classList.add('active');
        answer.style.display = 'block';
        answer.style.height = 'auto';
        const height = answer.offsetHeight;
        answer.style.height = '0px';
        gsap.to(answer, {
          height: height,
          duration: 0.5,
          opacity: 1
        });
      }
    });
  });
  
  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    
    firstItem.classList.add('active');
    firstAnswer.style.display = 'block';
  }
}

// Animate elements on page load
window.addEventListener('DOMContentLoaded', () => {
    // Hero animations
    if (typeof gsap !== 'undefined') {
        gsap.to('.headline', { opacity: 1, duration: 1, delay: 0.2 });
        gsap.to('.subheadline', { opacity: 1, duration: 1, delay: 0.4 });
        gsap.to('.cta-group', { opacity: 1, duration: 1, delay: 0.6 });
        gsap.to('.profile-image', { opacity: 1, y: 0, duration: 1, delay: 0.4 });
        
        // Floating icons animations
        gsap.to('.floating-icon.figma', { opacity: 1, y: 0, duration: 1, delay: 0.7 });
        gsap.to('.floating-icon.excel', { opacity: 1, y: 0, duration: 1, delay: 0.9 });
        
        // About section animations
        ScrollTrigger.batch('.fade-in', {
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }),
            start: 'top 85%',
        });
    }
    
    // Expandable content functionality
    const expandBtn = document.querySelector('.expand-btn');
    const expandableContent = document.querySelector('.expandable-content');
    
    if (expandBtn && expandableContent) {
        expandBtn.addEventListener('click', () => {
            expandableContent.classList.toggle('expanded');
            expandBtn.classList.toggle('expanded');
            
            if (expandBtn.classList.contains('expanded')) {
                expandBtn.innerHTML = 'Read less <i class="fa-solid fa-chevron-up"></i>';
            } else {
                expandBtn.innerHTML = 'Read more <i class="fa-solid fa-chevron-down"></i>';
            }
        });
    }
    
    // Setup image modal functionality
    setupImageModal();

    // Mobile-specific adjustments
    if (window.innerWidth <= 768) {
      // Optimize animations for mobile
      document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
      });
      
      // Add active states for touch
      document.querySelectorAll('.service-card, .stat-card, .faq-question').forEach(el => {
        el.addEventListener('touchstart', () => {
          el.classList.add('touch-active');
        });
        
        el.addEventListener('touchend', () => {
          setTimeout(() => {
            el.classList.remove('touch-active');
          }, 300);
        });
      });
    }
});

// Close mobile menu when clicking a link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Image Modal Functionality
function setupImageModal() {
    const testimonialImages = document.querySelectorAll('.testimonial-image');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    testimonialImages.forEach(imgContainer => {
        imgContainer.addEventListener('click', () => {
            const img = imgContainer.querySelector('img');
            if (img && modal && modalImage) {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
} 