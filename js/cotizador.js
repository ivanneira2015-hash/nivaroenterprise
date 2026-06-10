// ── AUTH ──────────────────────────────────────────────────────────────────────
if (sessionStorage.getItem('niv_auth') !== '1') location.href = 'cotizador-login.html'

document.getElementById('btnSalir').addEventListener('click', () => {
  sessionStorage.removeItem('niv_auth')
  location.href = 'cotizador-login.html'
})

// ── DATOS ─────────────────────────────────────────────────────────────────────

const SERVICES = {
  web: {
    items: [
      { id: 'landing',     name: 'Landing Page',           price: 180,  delivery: '1-2 semanas',   hours: '8-20hs',    desc: 'Una página de presentación para convertir visitas en clientes.' },
      { id: 'corporativo', name: 'Sitio Corporativo',       price: 380,  delivery: '2-3 semanas',   hours: '25-40hs',   desc: 'Múltiples secciones, blog, formulario y diseño profesional.' },
      { id: 'ecommerce',   name: 'E-Commerce',              price: 600,  delivery: '3-4 semanas',   hours: '40-60hs',   desc: 'Tienda online con carrito, pagos y gestión de productos.' },
      { id: 'portfolio',   name: 'Portfolio / CV Digital',  price: 120,  delivery: '1 semana',      hours: '8-15hs',    desc: 'Presentación profesional de tu trabajo y experiencia.' },
      { id: 'panel',       name: 'Web con Panel Admin',     price: 550,  delivery: '3-4 semanas',   hours: '35-55hs',   desc: 'Sitio web con sistema de administración propio.' },
      { id: 'saas',        name: 'SaaS / Sistema Complejo', price: 1500, delivery: '6-10 semanas',  hours: '80-160hs',  desc: 'Plataforma compleja con múltiples módulos y funcionalidades.' }
    ]
  },
  apps: {
    items: [
      { id: 'pos',        name: 'App Gestión / POS',    price: 1000, delivery: '4-6 semanas',  hours: '60-90hs',   desc: 'Sistema de punto de venta con inventario y reportes.' },
      { id: 'crm',        name: 'CRM',                  price: 900,  delivery: '3-5 semanas',  hours: '50-80hs',   desc: 'Gestión de clientes, seguimiento y cobranzas.' },
      { id: 'bot',        name: 'Bot IA WhatsApp',      price: 350,  delivery: '2-3 semanas',  hours: '20-35hs',   desc: 'Bot inteligente para atención automática por WhatsApp.' },
      { id: 'delivery',   name: 'App Delivery',         price: 1200, delivery: '5-7 semanas',  hours: '70-110hs',  desc: 'App de pedidos y delivery con panel de gestión.' },
      { id: 'automation', name: 'Automatización',       price: 200,  delivery: '1-3 semanas',  hours: '10-25hs',   desc: 'Automatización de procesos y flujos de trabajo.' }
    ]
  },
  soporte: {
    items: [
      { id: 'diagnostico', name: 'Diagnóstico y reparación PC/notebook',     price: 25, delivery: '2-4 horas',  hours: '2-4hs',  desc: 'Hardware, software, placa madre, pantalla.' },
      { id: 'limpieza',    name: 'Limpieza interna y optimización',          price: 20, delivery: '1-2 horas',  hours: '1-2hs',  desc: 'Componentes, pasta térmica, optimización de inicio.' },
      { id: 'recuperacion',name: 'Recuperación de datos',                    price: 40, delivery: '2-8 horas',  hours: '2-8hs',  desc: 'Archivos perdidos de discos, pendrives y dispositivos.' },
      { id: 'software',    name: 'Instalación y configuración de software',  price: 15, delivery: '1-2 horas',  hours: '1-2hs',  desc: 'SO, antivirus, Office, drivers y programas.' },
      { id: 'redes',       name: 'Configuración de redes y WiFi',            price: 25, delivery: '1-3 horas',  hours: '1-3hs',  desc: 'Redes domésticas y empresariales, router, seguridad.' },
      { id: 'remoto',      name: 'Soporte remoto online',                    price: 20, delivery: 'por hora',   hours: '1hs mín',desc: 'Atención inmediata por TeamViewer.' }
    ]
  }
}

const ADDONS = [
  { id: 'hosting',    name: 'Dominio + Hosting 1 año',          price: 50,  note: '',      for: ['web'] },
  { id: 'mant',       name: 'Mantenimiento mensual',            price: 60,  note: '/mes',  for: ['web', 'apps'] },
  { id: 'seo',        name: 'SEO básico on-page',               price: 80,  note: '',      for: ['web'] },
  { id: 'wa_int',     name: 'Integración WhatsApp Business',    price: 40,  note: '',      for: ['web', 'apps'] },
  { id: 'logo',       name: 'Diseño de logo',                   price: 120, note: '',      for: ['web', 'apps', 'soporte'] },
  { id: 'blog',       name: 'Blog / Noticias',                  price: 60,  note: '',      for: ['web'] },
  { id: 'multilang',  name: 'Multi-idioma (ES/EN)',             price: 100, note: '',      for: ['web', 'apps'] },
  { id: 'pagos',      name: 'Pasarela de pagos (MP/Stripe)',    price: 100, note: '',      for: ['web', 'apps'] },
  { id: 'analytics',  name: 'Analytics + Google SC',           price: 30,  note: '',      for: ['web'] },
  { id: 'formulario', name: 'Formulario avanzado de contacto', price: 30,  note: '',      for: ['web'] }
]

const RECS = [
  {
    check: (id, req) => id === 'landing' && /blog|noticias|artículo|post\b/i.test(req),
    msg: 'Mencionaste un blog o noticias. Una Landing Page no incluye esa sección.',
    suggestId: 'corporativo', suggestCat: 'web', suggestName: 'Sitio Corporativo (USD 380)'
  },
  {
    check: (id, req) => id === 'landing' && /producto|catálogo|tienda|vender|carrito|compra/i.test(req),
    msg: 'Necesitás vender productos. Una Landing no tiene carrito ni catálogo.',
    suggestId: 'ecommerce', suggestCat: 'web', suggestName: 'E-Commerce (USD 600)'
  },
  {
    check: (id, req) => id === 'landing' && /login|usuario|registro|admin|panel|cuenta|acceso/i.test(req),
    msg: 'Mencionaste login o panel de usuarios. Una Landing no maneja autenticación.',
    suggestId: 'panel', suggestCat: 'web', suggestName: 'Web con Panel Admin (USD 550)'
  },
  {
    check: (id, req) => id === 'landing' && /varias páginas|múltiples secciones|muchas secciones|completo|todo el sitio/i.test(req),
    msg: 'Para un sitio con múltiples páginas y secciones, una Landing no es suficiente.',
    suggestId: 'corporativo', suggestCat: 'web', suggestName: 'Sitio Corporativo (USD 380)'
  },
  {
    check: (id, req) => id === 'portfolio' && /vender|producto|tienda|precio|cobrar/i.test(req),
    msg: 'Un portfolio no tiene funcionalidad de venta.',
    suggestId: 'ecommerce', suggestCat: 'web', suggestName: 'E-Commerce (USD 600)'
  },
  {
    check: (id, req) => id === 'corporativo' && /vender|tienda|carrito|producto.*precio|cobrar online/i.test(req),
    msg: 'Para venta online activa con carrito y pagos, necesitás un E-Commerce.',
    suggestId: 'ecommerce', suggestCat: 'web', suggestName: 'E-Commerce (USD 600)'
  },
  {
    check: (id, req) => ['landing','corporativo','portfolio','panel'].includes(id) && /app móvil|aplicación móvil|android|ios/i.test(req),
    msg: 'Mencionaste una app móvil — eso es diferente a un sitio web y se cotiza aparte.',
    suggestId: null, info: 'Apps móviles desde USD 350. Podés generar un presupuesto adicional.'
  }
]

// ── ESTADO ────────────────────────────────────────────────────────────────────

let state = { category: 'web', serviceId: null, addons: new Set() }

// ── NÚMERO DE COTIZACIÓN ─────────────────────────────────────────────────────

function nextQuoteNum() {
  const year = new Date().getFullYear()
  const n = (parseInt(localStorage.getItem('niv_cot_n') || '0')) + 1
  localStorage.setItem('niv_cot_n', n)
  return `COT-${year}-${String(n).padStart(3, '0')}`
}

let quoteNum = nextQuoteNum()
document.getElementById('headerNum').textContent = quoteNum

// ── RENDER SERVICIOS ──────────────────────────────────────────────────────────

function renderServices() {
  const list = document.getElementById('svcList')
  list.innerHTML = SERVICES[state.category].items.map(s => `
    <div class="c-svc-item${state.serviceId === s.id ? ' selected' : ''}" data-id="${s.id}">
      <div>
        <div class="c-svc-name">${s.name}</div>
        <div class="c-svc-desc">${s.desc}</div>
      </div>
      <div class="c-svc-right">
        <div class="c-svc-price">USD ${s.price.toLocaleString()}</div>
        <div class="c-svc-delivery">${s.delivery}</div>
      </div>
    </div>
  `).join('')

  list.querySelectorAll('.c-svc-item').forEach(el => {
    el.addEventListener('click', () => {
      state.serviceId = el.dataset.id
      state.addons = new Set()
      renderServices()
      renderAddons()
      checkRecs()
      renderPreview()
      updateBtns()
    })
  })
}

// ── RENDER ADDONS ─────────────────────────────────────────────────────────────

function renderAddons() {
  const relevant = ADDONS.filter(a => a.for.includes(state.category))
  const box = document.getElementById('addonsList')
  if (!relevant.length) { box.innerHTML = '<p style="font-size:12px;color:var(--muted)">Sin extras para este tipo de servicio.</p>'; return }

  box.innerHTML = relevant.map(a => `
    <label class="c-addon" for="a_${a.id}">
      <input type="checkbox" id="a_${a.id}" data-id="${a.id}" ${state.addons.has(a.id) ? 'checked' : ''}>
      <div>
        <div class="c-addon-name">${a.name}</div>
        <div class="c-addon-price">+USD ${a.price}${a.note}</div>
      </div>
    </label>
  `).join('')

  box.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.checked ? state.addons.add(cb.dataset.id) : state.addons.delete(cb.dataset.id)
      renderPreview()
    })
  })
}

// ── RECOMENDACIONES ───────────────────────────────────────────────────────────

function checkRecs() {
  if (!state.serviceId) return
  const req = document.getElementById('requirements').value
  const box = document.getElementById('recsBox')
  const triggered = RECS.filter(r => r.check(state.serviceId, req))

  if (!triggered.length) { box.innerHTML = ''; return }

  box.innerHTML = triggered.map(r => `
    <div class="c-rec">
      <div class="c-rec-title">Sugerencia</div>
      <div class="c-rec-msg">${r.msg}${r.info ? ' ' + r.info : ''}</div>
      ${r.suggestId ? `
        <div class="c-rec-actions">
          <button class="c-btn c-btn-gold c-btn-sm" onclick="switchSvc('${r.suggestCat}','${r.suggestId}')">
            Cambiar a ${r.suggestName}
          </button>
        </div>
      ` : ''}
    </div>
  `).join('')
}

window.switchSvc = function(cat, id) {
  state.category = cat
  state.serviceId = id
  state.addons = new Set()
  document.querySelectorAll('.c-cat-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.cat === cat)
  })
  renderServices()
  renderAddons()
  checkRecs()
  renderPreview()
  updateBtns()
}

// ── RENDER PREVIEW ────────────────────────────────────────────────────────────

function renderPreview() {
  const name     = document.getElementById('cName').value.trim()
  const phone    = document.getElementById('cPhone').value.trim()
  const email    = document.getElementById('cEmail').value.trim()
  const business = document.getElementById('cBusiness').value.trim()
  const req      = document.getElementById('requirements').value.trim()
  const doc      = document.getElementById('previewDoc')

  if (!state.serviceId) {
    doc.innerHTML = `<div class="c-empty"><div class="c-empty-icon">📋</div><div class="c-empty-text">Seleccioná un servicio<br>para ver el presupuesto en vivo</div></div>`
    return
  }

  const svc           = SERVICES[state.category].items.find(s => s.id === state.serviceId)
  const selAddons     = ADDONS.filter(a => state.addons.has(a.id))
  const total         = svc.price + selAddons.reduce((s, a) => s + a.price, 0)
  const anticipo      = Math.ceil(total / 2)
  const today         = new Date()
  const validUntil    = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
  const fmt           = d => d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const clientDetail  = [email, phone, business].filter(Boolean).join(' · ')

  doc.innerHTML = `
    <div class="c-doc-header">
      <div class="c-doc-logo">
        <div class="c-logo-mark" style="width:26px;height:26px;font-size:13px;border-radius:6px">N</div>
        <div class="c-doc-company">
          NIVARO SOLUCIONES TECNOLÓGICAS
          <small>Walter Neira — Fundador & CEO</small>
        </div>
      </div>
      <div class="c-doc-meta">
        <span class="c-doc-num">${quoteNum}</span>
        ${fmt(today)} · válido ${fmt(validUntil)}
      </div>
    </div>

    <div class="c-doc-body">
      <div class="c-doc-section">
        <div class="c-doc-label">Para</div>
        <div class="c-client-box">
          <div class="c-client-name">${name || 'Sin nombre'}</div>
          ${clientDetail ? `<div class="c-client-detail">${clientDetail}</div>` : ''}
        </div>
      </div>

      <div class="c-doc-section">
        <div class="c-doc-label">Proyecto</div>
        <div class="c-proj-name">${svc.name}</div>
        ${req ? `<div class="c-proj-req">"${req.slice(0, 200)}${req.length > 200 ? '...' : ''}"</div>` : ''}
      </div>

      <div class="c-divider"></div>

      <div class="c-doc-section">
        <div class="c-doc-label">Detalle</div>
        <div class="c-item-row base">
          <span>${svc.name}</span>
          <span>USD ${svc.price.toLocaleString()}</span>
        </div>
        ${selAddons.map(a => `
          <div class="c-item-row addon">
            <span>${a.name}${a.note ? ' ' + a.note : ''}</span>
            <span>+USD ${a.price}</span>
          </div>
        `).join('')}
        <div class="c-total-row">
          <span class="c-total-label">TOTAL</span>
          <span class="c-total-amount">USD ${total.toLocaleString()}</span>
        </div>
      </div>

      <div class="c-pay-grid">
        <div class="c-pay-item">
          <div class="c-pay-lbl">Plazo de entrega</div>
          <div class="c-pay-val">${svc.delivery}</div>
        </div>
        <div class="c-pay-item">
          <div class="c-pay-lbl">Anticipo 50%</div>
          <div class="c-pay-val">USD ${anticipo.toLocaleString()}</div>
        </div>
        <div class="c-pay-item">
          <div class="c-pay-lbl">Saldo 50%</div>
          <div class="c-pay-val">USD ${(total - anticipo).toLocaleString()}</div>
        </div>
        <div class="c-pay-item">
          <div class="c-pay-lbl">Forma de pago</div>
          <div class="c-pay-val">Transferencia</div>
        </div>
      </div>
    </div>
  `

  const tn = document.getElementById('timeNote')
  tn.style.display = 'block'
  document.getElementById('timeText').textContent = `${svc.hours} estimadas · ${svc.delivery} de entrega`
}

// ── BOTONES ───────────────────────────────────────────────────────────────────

function updateBtns() {
  const ok = !!state.serviceId
  document.getElementById('btnPDF').disabled = !ok
  document.getElementById('btnWA').disabled = !ok
}

// ── GENERAR PDF ───────────────────────────────────────────────────────────────

function generatePDF() {
  const { jsPDF } = window.jspdf
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, M = 20, CW = W - M * 2
  let y = 0

  const svc        = SERVICES[state.category].items.find(s => s.id === state.serviceId)
  const selAddons  = ADDONS.filter(a => state.addons.has(a.id))
  const total      = svc.price + selAddons.reduce((s, a) => s + a.price, 0)
  const anticipo   = Math.ceil(total / 2)
  const name       = document.getElementById('cName').value.trim()
  const phone      = document.getElementById('cPhone').value.trim()
  const email      = document.getElementById('cEmail').value.trim()
  const business   = document.getElementById('cBusiness').value.trim()
  const req        = document.getElementById('requirements').value.trim()
  const today      = new Date()
  const validUntil = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
  const fmt        = d => d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  // ── Header azul
  pdf.setFillColor(53, 37, 205)
  pdf.rect(0, 0, W, 44, 'F')

  // Logo (círculo dorado + N)
  pdf.setFillColor(201, 168, 76)
  pdf.ellipse(M + 9, 22, 9, 9, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('N', M + 9, 26, { align: 'center' })

  // Empresa
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.text('NIVARO SOLUCIONES TECNOLÓGICAS', M + 23, 18)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(190, 200, 255)
  pdf.text('Walter Neira — Fundador & CEO', M + 23, 25)
  pdf.text('wa.me/5491154867460  ·  nivaroenterprise.vercel.app', M + 23, 31)

  y = 56

  // ── Título + meta
  pdf.setTextColor(53, 37, 205)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(20)
  pdf.text('PRESUPUESTO', M, y)

  pdf.setTextColor(107, 114, 128)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.text(quoteNum, W - M, y - 6, { align: 'right' })
  pdf.text(`Fecha: ${fmt(today)}`, W - M, y, { align: 'right' })
  pdf.text(`Válido hasta: ${fmt(validUntil)}`, W - M, y + 5, { align: 'right' })

  y += 14
  pdf.setDrawColor(224, 227, 255)
  pdf.line(M, y, W - M, y)
  y += 8

  // ── Cliente
  pdf.setFillColor(238, 240, 255)
  pdf.rect(M, y, CW, 26, 'F')
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(53, 37, 205)
  pdf.text('PARA', M + 5, y + 7)
  pdf.setFontSize(12)
  pdf.setTextColor(13, 17, 23)
  pdf.text(name || '—', M + 5, y + 14)
  const clientLine = [email, phone, business].filter(Boolean).join('  ·  ')
  if (clientLine) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.text(clientLine, M + 5, y + 20)
  }
  y += 33

  // ── Proyecto
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(53, 37, 205)
  pdf.text('PROYECTO', M, y)
  y += 6
  pdf.setFontSize(13)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(13, 17, 23)
  pdf.text(svc.name, M, y)
  y += 7
  if (req) {
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(9)
    pdf.setTextColor(107, 114, 128)
    const lines = pdf.splitTextToSize(`"${req}"`, CW).slice(0, 3)
    lines.forEach(l => { pdf.text(l, M, y); y += 5 })
  }
  y += 6

  // ── Tabla de ítems
  pdf.setDrawColor(224, 227, 255)
  pdf.line(M, y, W - M, y)
  y += 7
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(53, 37, 205)
  pdf.text('DESCRIPCIÓN', M, y)
  pdf.text('USD', W - M, y, { align: 'right' })
  y += 3
  pdf.setDrawColor(53, 37, 205)
  pdf.line(M, y, W - M, y)
  y += 6

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(13, 17, 23)
  pdf.text(svc.name, M, y)
  pdf.text(String(svc.price), W - M, y, { align: 'right' })
  y += 7

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  selAddons.forEach(a => {
    pdf.setTextColor(107, 114, 128)
    pdf.text(`  ${a.name}${a.note ? ' ' + a.note : ''}`, M, y)
    pdf.text(String(a.price), W - M, y, { align: 'right' })
    y += 6
  })
  y += 2

  pdf.setDrawColor(13, 17, 23)
  pdf.setLineWidth(0.4)
  pdf.line(M, y, W - M, y)
  pdf.setLineWidth(0.2)
  y += 7

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.setTextColor(53, 37, 205)
  pdf.text('TOTAL', M, y)
  pdf.text(`USD ${total.toLocaleString()}`, W - M, y, { align: 'right' })
  y += 12

  // ── Pago
  pdf.setFillColor(238, 240, 255)
  pdf.rect(M, y, CW, 22, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.setTextColor(53, 37, 205)
  pdf.text('CONDICIONES DE PAGO', M + 5, y + 7)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(13, 17, 23)
  pdf.text(`Anticipo 50%: USD ${anticipo.toLocaleString()} para iniciar`, M + 5, y + 14)
  pdf.text(`Saldo 50%: USD ${(total - anticipo).toLocaleString()} al entregar`, M + CW / 2 + 5, y + 14)
  y += 30

  // ── Plazo + Forma de pago
  pdf.setFillColor(245, 247, 255)
  pdf.rect(M, y, CW / 2 - 4, 16, 'F')
  pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(53, 37, 205)
  pdf.text('PLAZO DE ENTREGA', M + 4, y + 6)
  pdf.setFontSize(10); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(13, 17, 23)
  pdf.text(svc.delivery, M + 4, y + 13)

  pdf.setFillColor(245, 247, 255)
  pdf.rect(M + CW / 2 + 4, y, CW / 2 - 4, 16, 'F')
  pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(53, 37, 205)
  pdf.text('FORMA DE PAGO', M + CW / 2 + 8, y + 6)
  pdf.setFontSize(10); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(13, 17, 23)
  pdf.text('Transferencia bancaria', M + CW / 2 + 8, y + 13)
  y += 24

  // ── Condiciones
  pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(53, 37, 205)
  pdf.text('CONDICIONES GENERALES', M, y)
  y += 5
  const terms = [
    '• Presupuesto válido por 15 días corridos desde la fecha de emisión.',
    '• El plazo de entrega inicia al recibir el anticipo y los materiales del cliente.',
    '• Se incluyen hasta 3 rondas de revisiones dentro del scope acordado.',
    '• Funcionalidades adicionales no contempladas aquí se cotizan por separado.'
  ]
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(107, 114, 128)
  terms.forEach(t => { pdf.text(t, M, y); y += 5 })

  // ── Footer
  pdf.setFillColor(53, 37, 205)
  pdf.rect(0, 280, W, 17, 'F')
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(255, 255, 255)
  pdf.text('Walter Neira — Nivaro Soluciones Tecnológicas', M, 289)
  pdf.setTextColor(201, 168, 76)
  pdf.text('nivaroenterprise.vercel.app', W / 2, 289, { align: 'center' })
  pdf.setTextColor(255, 255, 255)
  pdf.text('wa.me/5491154867460', W - M, 289, { align: 'right' })

  pdf.save(`Presupuesto-${quoteNum}-${(name || 'cliente').replace(/\s+/g, '-')}.pdf`)
}

// ── COPIAR PARA WHATSAPP ──────────────────────────────────────────────────────

function copyWA() {
  const name     = document.getElementById('cName').value.trim()
  const svc      = SERVICES[state.category].items.find(s => s.id === state.serviceId)
  const selAddons= ADDONS.filter(a => state.addons.has(a.id))
  const total    = svc.price + selAddons.reduce((s, a) => s + a.price, 0)
  const anticipo = Math.ceil(total / 2)
  const req      = document.getElementById('requirements').value.trim()
  const today    = new Date()
  const validUntil = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
  const fmt      = d => d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const addonLines = selAddons.map(a => `• ${a.name}${a.note ? ' ' + a.note : ''}: USD ${a.price}`).join('\n')

  const text = `Hola${name ? ' ' + name : ''}! Te mando el presupuesto que estuvimos hablando 👋

*${quoteNum} — ${svc.name}*
📅 ${fmt(today)}  |  Válido hasta ${fmt(validUntil)}
${req ? `\n📋 _"${req.slice(0, 150)}${req.length > 150 ? '...' : ''}"_\n` : ''}
💰 *Detalle:*
• ${svc.name}: USD ${svc.price.toLocaleString()}
${addonLines ? addonLines + '\n' : ''}
━━━━━━━━━━━━━━━━
*TOTAL: USD ${total.toLocaleString()}*

⏱ Plazo de entrega: ${svc.delivery}
💳 Anticipo: 50% — USD ${anticipo.toLocaleString()} para arrancar
📤 Saldo: USD ${(total - anticipo).toLocaleString()} al entregar

Cualquier consulta me avisás! 🚀`

  navigator.clipboard.writeText(text)
    .then(() => {
      const btn = document.getElementById('btnWA')
      const orig = btn.textContent
      btn.textContent = '✓ Copiado!'
      setTimeout(() => { btn.textContent = orig }, 2200)
    })
    .catch(() => { prompt('Copiá este texto:', text) })
}

// ── NUEVO PRESUPUESTO ─────────────────────────────────────────────────────────

function resetQuote() {
  quoteNum = nextQuoteNum()
  document.getElementById('headerNum').textContent = quoteNum
  state = { category: 'web', serviceId: null, addons: new Set() }
  ;['cName', 'cPhone', 'cEmail', 'cBusiness', 'requirements', 'internalNote'].forEach(id => {
    document.getElementById(id).value = ''
  })
  document.querySelectorAll('.c-cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === 'web'))
  document.getElementById('recsBox').innerHTML = ''
  document.getElementById('timeNote').style.display = 'none'
  renderServices()
  renderAddons()
  renderPreview()
  updateBtns()
}

// ── EVENTOS ───────────────────────────────────────────────────────────────────

document.querySelectorAll('.c-cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.c-cat-tab').forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    state.category = tab.dataset.cat
    state.serviceId = null
    state.addons = new Set()
    renderServices()
    renderAddons()
    renderPreview()
    updateBtns()
  })
})

;['cName', 'cPhone', 'cEmail', 'cBusiness'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderPreview)
})

document.getElementById('requirements').addEventListener('input', () => {
  checkRecs()
  renderPreview()
})

document.getElementById('btnPDF').addEventListener('click', generatePDF)
document.getElementById('btnWA').addEventListener('click', copyWA)
document.getElementById('btnNuevo').addEventListener('click', resetQuote)

// ── INIT ──────────────────────────────────────────────────────────────────────

renderServices()
renderAddons()
updateBtns()
