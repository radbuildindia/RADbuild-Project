const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

/* ------------------------------------------------------------------
   Scroll reveal.
   Classes are added by JS, never in the markup, so with JS disabled
   or on error every element stays visible — the animation is purely
   additive. Honours prefers-reduced-motion by not running at all.
   ------------------------------------------------------------------ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  // Groups that stagger together; the rest reveal on their own.
  const GROUPS = ['.cards', '.related', '.modality-grid', '.process-grid',
                  '.project-grid', '.docs', '.stats-grid', '.service-list'];
  const SINGLES = ['.section-head', '.two-col > *', '.prose > h2', '.callout',
                   '.contact-card', '.contact-form', '.cta-inner > *'];
  const MAX_STAGGER = 8;   // beyond this the last items read as laggy
  const STEP = 60;         // ms between siblings

  const targets = [];

  GROUPS.forEach(sel => {
    document.querySelectorAll(sel).forEach(group => {
      const kids = Array.from(group.children);
      kids.forEach((el, i) => {
        el.style.transitionDelay = Math.min(i, MAX_STAGGER) * STEP + 'ms';
        targets.push(el);
      });
    });
  });

  SINGLES.forEach(sel => document.querySelectorAll(sel).forEach(el => targets.push(el)));

  if (!targets.length) return;

  targets.forEach(el => el.classList.add('rise'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('rise-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(el => io.observe(el));

  // If the user turns reduced-motion on mid-session, drop everything.
  reduced.addEventListener('change', e => {
    if (!e.matches) return;
    io.disconnect();
    targets.forEach(el => {
      el.classList.add('rise-in');
      el.style.transitionDelay = '';
    });
  });
})();

/* Hero content lifts in on load — one focal animation per view. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero-grid > div');
  if (!hero) return;
  hero.classList.add('hero-enter');
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('hero-enter-in')));
})();
