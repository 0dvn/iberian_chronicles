(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setInlineStyle(element, styles) {
    Object.keys(styles).forEach(key => {
      element.style[key] = styles[key];
    });
  }

  function pulse(element) {
    if (!element || prefersReducedMotion) return;
    element.style.transition = 'transform 180ms ease, box-shadow 180ms ease';
    element.style.transform = 'scale(0.98)';
    element.style.boxShadow = '0 0 0 0 rgba(192, 57, 43, 0.25)';
    window.setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = '';
    }, 80);
  }

  function close() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function open() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    if (navLinks.length > 0) {
      navLinks[0].focus();
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      pulse(toggle);
      if (nav.classList.contains('is-open')) {
        close();
        toggle.focus();
        return;
      }

      open();
    });

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });
  }

  const progressBar = document.createElement('div');
  progressBar.setAttribute('aria-hidden', 'true');
  setInlineStyle(progressBar, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '3px',
    zIndex: '1000',
    pointerEvents: 'none',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
    background: 'linear-gradient(90deg, #c0392b, #d9922f)',
    transition: prefersReducedMotion ? 'none' : 'transform 120ms linear'
  });
  document.body.appendChild(progressBar);

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    progressBar.style.transform = 'scaleX(' + ratio + ')';
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const revealSelectors = [
    '#home-sidebar li',
    '#recent-articles .article-card',
    '#about-intro',
    '.about-section',
    '.faq-item',
    '.auth-card',
    '.profile-header',
    '.profile-articles',
    '.admin-header',
    '.article-card',
    '.city-intro',
    '.city-topic',
    '.comments-section',
    '.comment-item',
    '.editor-form .form-group',
    '#contact-form-section > *'
  ];

  const revealTargets = Array.from(new Set(revealSelectors.flatMap(selector => Array.from(document.querySelectorAll(selector)))));

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealTargets.length > 0) {
    revealTargets.forEach((element, index) => {
      setInlineStyle(element, {
        opacity: '0',
        transform: 'translateY(14px)',
        transition: 'opacity 360ms ease, transform 360ms ease',
        transitionDelay: (index % 6) * 45 + 'ms'
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        observer.unobserve(element);
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }
}());
