(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      close();
    }
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') close();
  });
}());
