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

/* PROJECT MODAL */
const PROJECTS = {
  products: {
    name: 'Nivaro Products',
    type: 'E-Commerce',
    status: 'LIVE',
    statusClass: 'badge-green',
    tagline: 'Tienda online de productos automotrices con cursos digitales',
    desc: 'Plataforma de e-commerce completa para la línea de productos automotrices de Nivaro. Catálogo con filtros, carrito de compras, sistema de cursos y contenido digital descargable, y panel de administración.',
    audience: 'Conductores, mecánicos y entusiastas del mundo automotriz que buscan accesorios y capacitación de calidad.',
    features: ['Catálogo de productos con filtros y búsqueda', 'Carrito y proceso de compra', 'Cursos y contenido digital descargable', 'Panel de administración', 'SEO optimizado y carga rápida'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://nivaroproducts.netlify.app',
    demo: false,
  },
  mayo: {
    name: 'MayoExpress',
    type: 'Sistema POS / Gestión',
    status: 'LIVE',
    statusClass: 'badge-green',
    tagline: 'Control total de tu distribuidora en una sola pantalla',
    desc: 'Sistema completo de punto de venta para distribuidoras mayoristas y comercios minoristas. Gestiona todo el ciclo operativo: clientes, stock, ventas, caja y reportes en tiempo real, desde cualquier dispositivo.',
    audience: 'Distribuidoras mayoristas, almacenes, fiambrerías, quioscos y comercios con alto volumen de ventas o cuentas corrientes.',
    features: ['Gestión de clientes y cuentas corrientes', 'Control de stock en tiempo real', 'Caja diaria con apertura y cierre', 'Ventas mayoristas y minoristas', 'Reportes de ventas y rentabilidad', 'Multi-usuario con roles y permisos', 'Dashboard con KPIs del negocio'],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'PostgreSQL'],
    link: null,
    demo: true,
    demoMsg: 'Hola%20Walter!%20Me%20interesa%20solicitar%20una%20demo%20de%20MayoExpress%2C%20el%20sistema%20POS%20para%20distribuidoras.%20%C2%BFPodemos%20hablar%3F',
  },
  crm: {
    name: 'Nivaro CRM',
    type: 'SaaS / CRM',
    status: 'LIVE',
    statusClass: 'badge-green',
    tagline: 'Cobranzas, clientes y pagos diarios, todo bajo control',
    desc: 'Plataforma SaaS multi-tenant para gestión de cobranzas y clientes. Pensada especialmente para PyMEs, vendedores de electrodomésticos y negocios con financiación propia que necesitan un seguimiento preciso de cuotas y cobros diarios.',
    audience: 'PyMEs, vendedores de electrodomésticos, casas de muebles, negocios con cobros en cuotas o financiación propia.',
    features: ['Dashboard de cobranzas y pagos pendientes', 'Gestión de clientes y contratos', 'Seguimiento de cuotas y cobros diarios', 'Multi-empresa (multi-tenant)', 'Roles y permisos por usuario', 'Alertas de vencimientos automáticas', 'Reportes de morosidad y rendimiento'],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    link: null,
    demo: true,
    demoMsg: 'Hola%20Walter!%20Quiero%20solicitar%20una%20demo%20de%20Nivaro%20CRM%20para%20gesti%C3%B3n%20de%20cobranzas%20y%20clientes.%20%C2%BFPodemos%20hablar%3F',
  },
  amia: {
    name: 'AMIA Servicio Empleo',
    type: 'Plataforma Web',
    status: 'Colaboración',
    statusClass: 'badge-primary',
    tagline: 'Conectando personas con discapacidad con oportunidades reales',
    desc: 'Plataforma de empleo inclusivo desarrollada en colaboración con ForIT para AMIA Argentina. Los candidatos gestionan su perfil y postulaciones; las empresas publican posiciones y revisan candidatos desde un panel dedicado.',
    audience: 'Personas con discapacidad en búsqueda laboral y empresas comprometidas con la inclusión.',
    features: ['Gestión de perfiles de candidatos', 'Sistema de postulaciones y seguimiento', 'Panel dedicado para empresas', 'Tests de cobertura con Jest', 'Integración con APIs externas', 'Stack enterprise con TypeScript'],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Jest', 'PostgreSQL'],
    link: null,
    demo: false,
    waMsg: 'Hola%20Walter!%20Vi%20el%20proyecto%20AMIA%20y%20me%20interesa%20una%20plataforma%20similar.%20%C2%BFPodemos%20hablar%3F',
  },
  terra: {
    name: 'Terra Fitness',
    type: 'Web Corporativa',
    status: 'Entregado',
    statusClass: 'badge-outline',
    tagline: 'Presencia digital profesional para un centro fitness',
    desc: 'Sitio web corporativo para centro de fitness. Diseño moderno y responsive con presentación de servicios, horarios de clases, galería fotográfica y formulario de contacto integrado con WhatsApp.',
    audience: 'Centro fitness que necesitaba captar nuevos socios y comunicar sus servicios de manera profesional online.',
    features: ['Diseño responsive y moderno', 'Presentación de servicios y precios', 'Horarios de clases', 'Galería fotográfica', 'Formulario de contacto + WhatsApp', 'SEO básico optimizado'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: null,
    demo: false,
    waMsg: 'Hola%20Walter!%20Vi%20el%20trabajo%20en%20Terra%20Fitness%20y%20me%20gustar%C3%ADa%20un%20sitio%20similar%20para%20mi%20negocio.%20%C2%BFPodemos%20hablar%3F',
  },
  bot: {
    name: 'Mayo Leads Bot',
    type: 'Automatización / IA',
    status: 'En producción',
    statusClass: 'badge-green',
    tagline: 'IA que llama a tus leads por vos, las 24hs',
    desc: 'Bot de llamadas con inteligencia artificial para contactar más de 1.200 leads de forma automática. La IA (Valentina) inicia llamadas, sostiene conversaciones naturales, califica leads y agenda seguimientos sin intervención humana.',
    audience: 'Empresas con alta base de leads que necesitan contactarlos rápidamente sin ampliar el equipo de ventas.',
    features: ['Llamadas automáticas a listas de contactos', 'IA conversacional con voz natural (Valentina)', 'Calificación automática de leads', 'Integración con Vapi y Groq', 'Dashboard de resultados y conversiones', 'Escalable a miles de llamadas por día'],
    stack: ['Python', 'Vapi', 'Groq', 'IA'],
    link: null,
    demo: true,
    demoMsg: 'Hola%20Walter!%20Me%20interesa%20un%20bot%20con%20IA%20similar%20al%20Mayo%20Leads%20Bot%20para%20mi%20negocio.%20%C2%BFPodemos%20hablar%3F',
  },
};

const projOverlay = document.getElementById('proj-overlay');
const projModalBody = document.getElementById('proj-modal-body');

function openProjectModal(key) {
  const p = PROJECTS[key];
  if (!p) return;
  const feats = p.features.map(f => `<div class="proj-feat">${f}</div>`).join('');
  const stack = p.stack.map(s => `<span class="badge badge-tech">${s}</span>`).join('');
  let actions = '';
  if (p.link) actions += `<a href="${p.link}" class="btn btn-primary" target="_blank" rel="noopener">Ver proyecto →</a>`;
  if (p.demo) actions += `<a href="https://wa.me/5491154867460?text=${p.demoMsg}" class="${p.link ? 'btn btn-outline' : 'btn btn-primary'}" target="_blank" rel="noopener">Solicitar demo →</a>`;
  if (p.waMsg && !p.demo && !p.link) actions += `<a href="https://wa.me/5491154867460?text=${p.waMsg}" class="btn btn-outline" target="_blank" rel="noopener">Consultar →</a>`;

  projModalBody.innerHTML = `
    <div class="proj-header">
      <div class="proj-meta"><span class="badge ${p.statusClass}">${p.status}</span><span class="proj-type">${p.type}</span></div>
      <div class="proj-title">${p.name}</div>
      <div class="proj-tagline">${p.tagline}</div>
    </div>
    <div class="proj-body">
      <div class="proj-lbl">Descripción</div>
      <div class="proj-desc">${p.desc}</div>
      <div class="proj-lbl">Funcionalidades</div>
      <div class="proj-feats">${feats}</div>
      <div class="proj-lbl">Destinado a</div>
      <div class="proj-audience">${p.audience}</div>
      <div class="proj-lbl">Stack tecnológico</div>
      <div class="proj-stack">${stack}</div>
      ${actions ? `<div class="proj-actions">${actions}</div>` : ''}
    </div>`;

  projOverlay.removeAttribute('hidden');
  requestAnimationFrame(() => projOverlay.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  projOverlay.classList.remove('open');
  projOverlay.addEventListener('transitionend', () => {
    projOverlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    projModalBody.innerHTML = '';
  }, { once: true });
}

document.getElementById('proj-modal-close').addEventListener('click', closeProjectModal);
projOverlay.addEventListener('click', e => { if (e.target === projOverlay) closeProjectModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && projOverlay.classList.contains('open')) closeProjectModal(); });
document.querySelectorAll('[data-project]').forEach(btn => {
  btn.addEventListener('click', () => openProjectModal(btn.dataset.project));
});

/* HERO OPTS INTERACTION */
document.querySelectorAll('.hero-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.hero-opt').forEach(o => o.classList.remove('sel'));
    opt.classList.add('sel');
  });
});
