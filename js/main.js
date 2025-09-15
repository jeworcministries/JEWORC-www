/**
 * JEWORC - Jesus' Worship Centre Ministries
 * Main JavaScript File - Optimized
 * 
 * Contains all interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.style.display = 'none', 500);
    });
  }

  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdowns = document.querySelectorAll('.dropdown');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (hamburger.classList.contains('active')) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
          dropdowns.forEach(other => {
            if (other !== dropdown) other.classList.remove('active');
          });
        }
      });
    });
  }

  // Sticky Header
  const header = document.querySelector('.header');
  if (header) {
    const headerHeight = header.offsetHeight;
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > headerHeight);
    });
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector('#backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      backToTopBtn.classList.toggle('active', window.scrollY > 300);
    });

    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Reveal Animations
  function animateOnScroll() {
    const elements = document.querySelectorAll(
      '.hero-content, .section-header, .value-card, .ministry-card, ' +
      '.event-card, .blog-card, .welcome-text, .welcome-image, ' +
      '.sermon-video, .sermon-details, [data-aos]'
    );
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      if (elementPosition < window.innerHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  }

  // Initialize elements with hidden state
  document.querySelectorAll('[data-aos], .hero-content, .section-header, .value-card, .ministry-card, .event-card, .blog-card')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

  document.querySelectorAll('.welcome-text, .welcome-image, .sermon-video, .sermon-details')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);

  // Active Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight && navLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  });

  // Video Background Fallback
  const video = document.getElementById('hero-video');
  if (video) {
    video.addEventListener('error', function() {
      const fallbackImage = this.querySelector('img');
      if (fallbackImage) {
        this.parentNode.innerHTML = `
          <div class="image-background" style="background-image: url('${fallbackImage.src}')">
            <div class="video-overlay"></div>
          </div>
        `;
      }
    });
    
    video.play().catch(error => console.log('Video autoplay failed:', error));
  }

  // Form Submission Handling
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      fetch(this.getAttribute('action'), {
        method: this.getAttribute('method'),
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
      .then(data => showFormMessage(this, 'success'))
      .catch(error => {
        console.error('Error:', error);
        showFormMessage(this, 'error');
      });
    });
  });

  function showFormMessage(form, type) {
    const message = document.createElement('div');
    message.className = `form-${type}`;
    message.innerHTML = type === 'success' ? `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <p>Thank you! Your message has been sent successfully.</p>
      </div>
    ` : 'There was a problem submitting your form. Please try again.';
    
    form.parentNode.insertBefore(message, form.nextSibling);
    if (type === 'success') form.reset();
    
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 300);
    }, 5000);
  }

  // Dynamic Year in Footer
  const yearElement = document.querySelector('.footer-bottom p');
  if (yearElement) {
    yearElement.innerHTML = yearElement.innerHTML.replace('2023', new Date().getFullYear());
  }

  // Lazy Loading for Images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Copy Button Functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const number = this.getAttribute('data-number');
      navigator.clipboard.writeText(number).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => this.textContent = originalText, 2000);
      });
    });
  });
});

// Initialize plugins on window load
window.addEventListener('load', function() {
  // Initialize lightbox if available
  if (typeof lightbox !== 'undefined') {
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'albumLabel': 'Image %1 of %2'
    });
  }

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 100;
    
    if (count < target) {
      const updateCount = () => {
        const currentCount = +counter.innerText;
        if (currentCount < target) {
          counter.innerText = Math.ceil(currentCount + increment);
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    }
  });
});