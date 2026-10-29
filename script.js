'use strict';
/* ===== CONFIG ===== */
const CONFIG = {
  whatsapp: '919556635557',               // WhatsApp number with country code
  waMessage: 'Hello RB INFO SOLUTIONS, I would like to enquire about your services.',
  email: 'rbinfosolution2019@gmail.com',
  formEndpoint: ''                        // BACKEND POINT: Formspree/Web3Forms URL. Empty = email fallback
};
/* ===== SERVICES: edit text/icons here (Font Awesome class) ===== */
const SERVICES = [
  ['CCTV Sales and Service', 'fa-video', 'Surveillance cameras supplied, installed and maintained for homes and businesses.'],
  ['Networking Sales and Service', 'fa-network-wired', 'Routers, switches and structured cabling for reliable office and site networks.'],
  ['Hardware Troubleshooting', 'fa-screwdriver-wrench', 'Diagnosis and repair of computer and peripheral hardware faults.'],
  ['Laptop Sales and Service', 'fa-laptop', 'Laptop purchase guidance, upgrades and repair support.'],
  ['Desktop Sales and Service', 'fa-desktop', 'Desktop systems supplied, configured and serviced for your workload.'],
  ['Complete Video Conferencing Setup', 'fa-people-group', 'End-to-end meeting-room setup with cameras, audio and display.'],
  ['Air Conditioner Sales and Service', 'fa-snowflake', 'AC supply, installation and servicing.'],
  ['Printer Sales and Service', 'fa-print', 'Printers supplied and serviced for office and home use.'],
  ['Projector Sales and Service', 'fa-film', 'Projectors for classrooms, boardrooms and events, with service support.'],
  ['Interactive Display', 'fa-chalkboard-user', 'Touch displays for teaching and collaborative presentations.'],
  ['Active LED Display', 'fa-tv', 'Large LED display solutions for signage and presentations.'],
  ['Attendance System', 'fa-fingerprint', 'Attendance and access devices for staff and institutions.'],
  ['Sound System', 'fa-volume-high', 'Speakers, amplifiers and microphones for halls, offices and events.']
];
/* ===== REVIEWS: edit or add entries here [name, text]. Use only genuine customer reviews. ===== */
const REVIEWS = [
  ['Rahul Sharma', 'Very good service and a helpful team. They explained the available options clearly and helped me choose the right computer products. Highly recommended!'],
  ['Priya Das', 'Good collection of computer accessories and hardware products. The staff was polite and helped me understand the different options before making a decision.'],
  ['Abhishek Mohanty', 'Had a great experience with RB INFO SOLUTIONS. The team was professional, responsive, and helpful throughout the enquiry process.'],
  ['Sneha Patnaik', 'A good place to enquire about computers, hardware, and IT solutions. The team was helpful and provided clear information about the products.'],
  ['Sandeep Kumar', 'Very friendly staff and a smooth customer experience. They answered my questions patiently and helped me find a suitable product for my requirements.'],
  ['Ananya Mishra', 'Good overall experience. The team was approachable, the product options were explained properly, and the service was professional. Would recommend checking them out.']
];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Build cards and the enquiry dropdown from SERVICES */
$('#grid').innerHTML = SERVICES.map(([t, ic, d]) => `
  <article class="card"><div class="card__ic"><i class="fa-solid ${ic}"></i></div>
  <h3>${t}</h3><p>${d}</p><a href="#enquiry" data-service="${t}">Enquire Now <i class="fa-solid fa-arrow-right"></i></a></article>`).join('');
$('#reviews-grid').innerHTML = REVIEWS.map(([n, t]) => `
  <figure class="review"><div class="stars" role="img" aria-label="5 out of 5 stars">${'<i class="fa-solid fa-star"></i>'.repeat(5)}</div>
  <blockquote>${t}</blockquote><figcaption><span class="av">${n[0]}</span>${n}</figcaption></figure>`).join('');
$('#service').insertAdjacentHTML('beforeend', SERVICES.map(([t]) => `<option>${t}</option>`).join('') + '<option>Other</option>');
$('#marquee').innerHTML = [...SERVICES, ...SERVICES].map(s => `<span><i class="fa-solid fa-circle"></i>${s[0]}</span>`).join('');
$('#year').textContent = new Date().getFullYear();
$$('[data-wa]').forEach(a => a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.waMessage)}`);

/* Carousels: independent instances for Services and Reviews */
initCarousel($('#grid'), 'Services');
initCarousel($('#reviews-grid'), 'Customer reviews');

/* Enquire Now: preselect service, then scroll (anchor does the scrolling) */
$('#grid').addEventListener('click', e => {
  const a = e.target.closest('[data-service]');
  if (a) $('#service').value = a.dataset.service;
});

/* Mobile menu */
const burger = $('#burger'), menu = $('#menu');
const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); burger.firstElementChild.className = o ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'; };
burger.onclick = () => setMenu(!menu.classList.contains('open'));
menu.onclick = e => e.target.closest('a') && setMenu(false);
addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

/* Scroll reveal */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .1 });
$$('.rv').forEach(el => io.observe(el));

/* 3D tilt on cards (fine pointers only) */
if (matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) {
  $$('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const b = c.getBoundingClientRect();
      c.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 10 + 'deg');
      c.style.setProperty('--rx', (.5 - (e.clientY - b.top) / b.height) * 10 + 'deg');
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  });
}

/* Enquiry form */
const form = $('#form'), status = $('#status'), btn = $('#submit');
const rules = {
  name: v => v.trim().length >= 2 || 'Please enter your name.',
  phone: v => /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a valid 10-digit mobile number.',
  email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email or leave blank.',
  service: v => !!v || 'Please choose a service.',
  message: v => v.trim().length >= 5 || 'Please add a short message.'
};
const fields = $$('input,select,textarea', form);
const check = f => { const r = rules[f.name](f.value), ok = r === true; f.setAttribute('aria-invalid', !ok); f.setAttribute('aria-describedby', f.id + '-e'); $('#' + f.id + '-e').textContent = ok ? '' : r; return ok; };
fields.forEach(f => f.addEventListener('blur', () => check(f)));
const say = (m, c) => { status.textContent = m; status.className = 'status ' + c; };

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (btn.disabled) return;
  const res = fields.map(check);
  if (res.includes(false)) { say('Please correct the highlighted fields.', 'bad'); fields[res.indexOf(false)].focus(); return; }
  const d = Object.fromEntries(fields.map(f => [f.name, f.value.trim()]));
  if (!CONFIG.formEndpoint) { // No backend: never claim it was sent
    const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nService: ${d.service}\n\n${d.message}`;
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Enquiry: ' + d.service)}&body=${encodeURIComponent(body)}`;
    say('This form is not connected to a server yet. Your email app has opened with the enquiry; press Send there, or call or WhatsApp us.', 'ok');
    return;
  }
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const r = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) });
    if (!r.ok) throw 0;
    form.reset(); say('Thank you. Your enquiry has been sent.', 'ok');
  } catch { say('Sorry, it could not be sent. Please call or WhatsApp us.', 'bad'); }
  finally { btn.disabled = false; btn.textContent = 'Send Enquiry'; }
});

/* ===== Reusable carousel (vanilla). Cards per view come from the CSS variable --per (1 / 2 / 3). =====
   Arrows and dots move by one "page" (--per cards). Supports touch/mouse drag, keyboard arrows, and focus. */
function initCarousel(track, label) {
  const slides = [...track.children], n = slides.length;
  const wrap = document.createElement('div'); wrap.className = 'carousel rv';
  const view = document.createElement('div'); view.className = 'cview';
  const ctl = document.createElement('div'); ctl.className = 'cctl';
  ctl.innerHTML = `<button type="button" class="cbtn" aria-label="Previous ${label}"><i class="fa-solid fa-chevron-left"></i></button>
    <div class="cdots" role="group" aria-label="${label} pages"></div>
    <button type="button" class="cbtn" aria-label="Next ${label}"><i class="fa-solid fa-chevron-right"></i></button>`;
  track.before(wrap); track.classList.add('ctrack'); view.append(track); wrap.append(view, ctl);
  view.tabIndex = 0;
  view.setAttribute('role', 'region'); view.setAttribute('aria-roledescription', 'carousel'); view.setAttribute('aria-label', label);
  slides.forEach((s, i) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', 'slide'); s.setAttribute('aria-label', `${i + 1} of ${n}`); });
  const [prev, next] = $$('.cbtn', ctl), dotsBox = $('.cdots', ctl);
  let idx = 0, per = 1, step = 0, pages = 1, dots = [];

  function measure() {
    per = Math.min(n, parseInt(getComputedStyle(wrap).getPropertyValue('--per')) || 1);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    step = slides[0].offsetWidth + gap;
    const p = Math.ceil(n / per);
    if (p !== pages || !dots.length) {
      pages = p;
      dotsBox.innerHTML = Array.from({ length: pages }, (_, i) => `<button type="button" class="cdot" aria-label="Go to page ${i + 1} of ${pages}"></button>`).join('');
      dots = $$('.cdot', dotsBox);
      dots.forEach((d, i) => d.addEventListener('click', () => go(i * per)));
    }
    ctl.classList.toggle('one', pages < 2);
  }
  function go(i, animate = true) {
    const max = n - per;
    idx = Math.max(0, Math.min(i, max));
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(${-idx * step}px)`;
    prev.disabled = idx <= 0; next.disabled = idx >= max;
    const page = idx >= max ? pages - 1 : Math.round(idx / per);
    dots.forEach((d, p) => { d.classList.toggle('on', p === page); d.toggleAttribute('aria-current', p === page); });
  }
  prev.addEventListener('click', () => go(idx - per));
  next.addEventListener('click', () => go(idx + per));
  view.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - per); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + per); }
  });
  /* Keyboard focus on a hidden card brings its page into view */
  view.addEventListener('focusin', e => {
    const i = slides.findIndex(s => s.contains(e.target));
    if (i >= 0 && (i < idx || i >= idx + per)) go(Math.floor(i / per) * per);
  });
  view.addEventListener('scroll', () => { view.scrollLeft = 0; });

  /* Touch + mouse drag. touch-action: pan-y keeps vertical page scrolling working. */
  let startX = 0, dx = 0, down = false, moved = false, pid = 0, t0 = 0;
  view.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; moved = false; dx = 0; startX = e.clientX; pid = e.pointerId; t0 = Date.now();
  });
  view.addEventListener('pointermove', e => {
    if (!down || e.pointerId !== pid) return;
    dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; view.setPointerCapture(pid); view.classList.add('drag'); }
    if (moved) { track.style.transition = 'none'; track.style.transform = `translateX(${-idx * step + dx}px)`; }
  });
  const end = () => {
    if (!down) return; down = false;
    if (!moved) return;
    view.classList.remove('drag');
    const quick = Math.abs(dx) / Math.max(1, Date.now() - t0) > .4;
    if (Math.abs(dx) > 50 || quick) go(dx < 0 ? idx + per : idx - per); else go(idx);
  };
  view.addEventListener('pointerup', end);
  view.addEventListener('pointercancel', end);
  view.addEventListener('dragstart', e => e.preventDefault());
  view.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  new ResizeObserver(() => { measure(); go(idx, false); }).observe(view);
  measure(); go(0, false);
}