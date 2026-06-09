'use strict';

/* NAV SCROLL */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* MOBILE MENU */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('nav-mobile');
burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* REVEAL OBSERVER */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* COUNTER ANIMATION */
function animateCount(el) {
  const text = el.innerHTML;
  const raw = el.textContent.replace(/[^0-9]/g, '');
  const num = parseInt(raw, 10);
  if (!num) return;
  const prefix = text.match(/^([^0-9<]*)/)[1];
  const suffix = text.match(/([^0-9>]*)$/)[1];
  const hasEm = text.includes('<em>');
  const dur = 1400;
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(ease * num);
    el.innerHTML = hasEm ? prefix + '<em>' + val + '</em>' + suffix : prefix + val + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

/* ACTIVE NAV LINK */
const sections = document.querySelectorAll('section[id], div.stats[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* HERO OPTS INTERACTION */
document.querySelectorAll('.hero-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.hero-opt').forEach(o => o.classList.remove('sel'));
    opt.classList.add('sel');
  });
});
