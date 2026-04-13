// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const allNavLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  navOverlay.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', closeMenu);
allNavLinks.forEach(link => link.addEventListener('click', closeMenu));


// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);
  lastScroll = scrollY;
}, { passive: true });


// ===== ACTIVE NAV LINK HIGHLIGHTING =====
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sibling, i) => {
        if (sibling === entry.target) {
          delay = i * 80;
        }
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(delay, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ===== ANIMATED COUNTERS =====
const statsSection = document.getElementById('heroStats');
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  const counters = statsSection.querySelectorAll('.num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      counter.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

if (statsSection) {
  statsObserver.observe(statsSection);
}


// ===== FORM VALIDATION =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const validators = {
  name: {
    test: v => v.trim().length >= 2,
    message: 'Please enter your name (at least 2 characters).'
  },
  phone: {
    test: v => /^[\d\s+\-()]{7,}$/.test(v.trim()),
    message: 'Please enter a valid phone number.'
  },
  email: {
    test: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Please enter a valid email address.'
  },
  service: {
    test: v => v !== '',
    message: 'Please select a service.'
  },
  message: {
    test: v => v.trim().length >= 10,
    message: 'Please tell us more (at least 10 characters).'
  }
};

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const group = field.closest('.form-group');
  const errorSpan = group.querySelector('.form-error');
  const validator = validators[fieldId];

  if (!validator) return true;

  const isValid = validator.test(field.value);
  group.classList.toggle('error', !isValid);
  if (errorSpan) {
    errorSpan.textContent = isValid ? '' : validator.message;
  }
  return isValid;
}

// Real-time validation on blur
Object.keys(validators).forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('blur', () => validateField(id));
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group.classList.contains('error')) {
        validateField(id);
      }
    });
  }
});

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(validators).forEach(id => {
      if (!validateField(id)) allValid = false;
    });

    if (allValid) {
      formSuccess.classList.add('show');
      form.reset();

      // Remove error states
      form.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
      form.querySelectorAll('.form-error').forEach(e => e.textContent = '');

      // Hide success after 6 seconds
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 6000);
    }
  });
}


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});
