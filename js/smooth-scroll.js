/**
 * JEWORC - Smooth Scroll JavaScript - Optimized
 * Provides smooth scrolling functionality for anchor links
 */

class SmoothScroll {
  constructor() {
    this.config = {
      selector: 'a[href^="#"]',
      offset: 90,
      speed: 800,
      easing: 'easeInOutCubic',
      updateURL: true
    };

    this.easingFunctions = {
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      easeOutCubic: t => 1 - Math.pow(1 - t, 3),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeOutQuad: t => t * (2 - t)
    };

    if (!this.prefersReducedMotion()) {
      this.addEventListeners();
    }
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  addEventListeners() {
    document.querySelectorAll(this.config.selector).forEach(link => {
      link.addEventListener('click', e => this.handleClick(e));
    });
  }

  handleClick(e) {
    e.preventDefault();
    const targetId = this.getTargetId(e.currentTarget);
    if (!targetId) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      this.scrollToElement(targetElement);
      if (this.config.updateURL) this.updateURL(targetId);
    }
  }

  getTargetId(link) {
    const href = link.getAttribute('href');
    return href === '#' ? null : href;
  }

  scrollToElement(targetElement) {
    const startPosition = window.pageYOffset;
    const targetPosition = this.getTargetPosition(targetElement);
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const animation = currentTime => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / this.config.speed, 1);
      const easeProgress = this.easingFunctions[this.config.easing](progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (progress < 1) {
        window.requestAnimationFrame(animation);
      }
    };

    window.requestAnimationFrame(animation);
  }

  getTargetPosition(targetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top;
    return elementPosition + window.pageYOffset - this.config.offset;
  }

  updateURL(targetId) {
    if (history.pushState) {
      history.pushState(null, null, targetId);
    } else {
      location.hash = targetId;
    }
  }
}

// Initialize SmoothScroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SmoothScroll();
});

// Fallback for browsers that don't support requestAnimationFrame
(function() {
  if (window.requestAnimationFrame) return;

  const vendors = ['webkit', 'moz'];
  for (let i = 0; i < vendors.length; ++i) {
    window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || 
                                 window[vendors[i] + 'CancelRequestAnimationFrame'];
    if (window.requestAnimationFrame) break;
  }

  if (!window.requestAnimationFrame) {
    let lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

// Programmatic scroll function
window.smoothScrollTo = function(target, options = {}) {
  const config = {
    offset: options.offset || 90,
    speed: options.speed || 800,
    easing: options.easing || 'easeInOutCubic'
  };

  const easingFunctions = {
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutQuad: t => t * (2 - t)
  };

  let targetElement;
  if (typeof target === 'string') {
    targetElement = document.querySelector(target);
  } else if (target instanceof HTMLElement) {
    targetElement = target;
  } else if (typeof target === 'number') {
    const startPosition = window.pageYOffset;
    const distance = target - startPosition;
    const startTime = performance.now();

    const animation = currentTime => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / config.speed, 1);
      const easeProgress = easingFunctions[config.easing](progress);
      window.scrollTo(0, startPosition + distance * easeProgress);
      if (progress < 1) window.requestAnimationFrame(animation);
    };

    window.requestAnimationFrame(animation);
    return;
  }

  if (!targetElement) return;

  const startPosition = window.pageYOffset;
  const elementPosition = targetElement.getBoundingClientRect().top;
  const targetPosition = elementPosition + window.pageYOffset - config.offset;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  const animation = currentTime => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / config.speed, 1);
    const easeProgress = easingFunctions[config.easing](progress);
    window.scrollTo(0, startPosition + distance * easeProgress);
    if (progress < 1) window.requestAnimationFrame(animation);
  };

  window.requestAnimationFrame(animation);
};