/* TCA73 — main.js v2.0 */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header scroll ---- */
  const header    = document.getElementById('header');
  const backToTop = document.querySelector('.back-to-top');
  const onScroll  = () => {
    if (header)    header.classList.toggle('scrolled', window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    doParallax();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Menu hamburger ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* Active link */
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === cur || (cur === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---- Back to top ---- */
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Parallaxe montagnes ---- */
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  function doParallax() {
    const sy = window.scrollY;
    parallaxLayers.forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0.3);
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  }

  /* ---- Scroll fade-up ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }

  /* ---- Compteurs animés ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
    }), { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const dur    = 2000;
    const tick   = now => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(e * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- FAQ ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.classList.contains('open');
      const group   = btn.closest('.faq-list') || document;
      group.querySelectorAll('.faq-question.open').forEach(q => {
        if (q !== btn) { q.classList.remove('open'); q.nextElementSibling.classList.remove('open'); }
      });
      btn.classList.toggle('open', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });

  /* ---- Filtres (events + galerie) ---- */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    group.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        group.querySelectorAll('[data-category]').forEach(item => {
          if (f === 'all' || item.dataset.category === f) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.97)';
            setTimeout(() => {
              item.style.transition = 'opacity .35s, transform .35s';
              item.style.opacity = '1'; item.style.transform = 'scale(1)';
            }, 20);
          } else { item.style.display = 'none'; }
        });
      });
    });
  });

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbClose = document.getElementById('lb-close');
    const lbPrev  = document.getElementById('lb-prev');
    const lbNext  = document.getElementById('lb-next');
    const lbCap   = document.getElementById('lb-caption');
    let items = [], cur = 0;

    const open = i => {
      cur = i; items = Array.from(document.querySelectorAll('.gallery-item'));
      const item = items[cur];
      const ph   = document.getElementById('lb-placeholder');
      if (ph) { ph.innerHTML = item.querySelector('.gi-inner')?.textContent?.trim().slice(0,2) || '📷'; }
      if (lbCap) lbCap.textContent = item.dataset.caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };

    document.querySelectorAll('.gallery-item').forEach((el, i) => el.addEventListener('click', () => open(i)));
    lbClose?.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    lbPrev?.addEventListener('click', () => { items = Array.from(document.querySelectorAll('.gallery-item')); open((cur - 1 + items.length) % items.length); });
    lbNext?.addEventListener('click', () => { items = Array.from(document.querySelectorAll('.gallery-item')); open((cur + 1) % items.length); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft')  { items = Array.from(document.querySelectorAll('.gallery-item')); open((cur - 1 + items.length) % items.length); }
      if (e.key === 'ArrowRight') { items = Array.from(document.querySelectorAll('.gallery-item')); open((cur + 1) % items.length); }
    });
  }

  /* ---- Formulaires AJAX simulés ---- */
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn     = form.querySelector('[type=submit]');
      const success = form.nextElementSibling;
      if (!validateForm(form)) return;
      btn.disabled = true; btn.textContent = 'Envoi…';
      await new Promise(r => setTimeout(r, 1400));
      form.reset();
      btn.disabled = false; btn.textContent = btn.dataset.label || 'Envoyer';
      if (success) success.classList.add('show');
    });
  });
  function validateForm(form) {
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => {
      f.style.borderColor = '';
      if (!f.value.trim()) { f.style.borderColor = 'var(--tca-red)'; ok = false; }
    });
    const email = form.querySelector('[type=email]');
    if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.style.borderColor = 'var(--tca-red)'; ok = false; }
    return ok;
  }

  /* ---- Ancres smooth ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  /* ---- Calendrier ---- */
  initCalendar();
});

/* ---- Mini calendrier ---- */
function initCalendar() {
  const cal = document.getElementById('cal-grid');
  if (!cal) return;
  const monthLabel = document.getElementById('cal-month');
  const prevBtn    = document.getElementById('cal-prev');
  const nextBtn    = document.getElementById('cal-next');
  let   now = new Date();

  const events = {
    '2025-06-14': 'Championnat Savoie — Manche 4',
    '2025-06-28': 'Journée Portes Ouvertes',
    '2025-07-12': 'Journée Partenaires',
    '2025-07-20': 'Démonstration Fête Nationale',
    '2025-09-07': 'Inter-régional Rhône-Alpes',
    '2025-09-21': 'Stage rentrée École Trial',
    '2025-10-11': 'Journée Mécanique',
    '2025-10-19': 'Championnat Savoie — Finale',
    '2025-11-29': 'Journée Découverte Hiver',
  };

  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const days   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  function render() {
    const y = now.getFullYear(), m = now.getMonth();
    if (monthLabel) monthLabel.textContent = `${months[m]} ${y}`;
    cal.innerHTML = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');
    const first = new Date(y, m, 1);
    let dow = first.getDay(); if (dow === 0) dow = 7;
    for (let i = 1; i < dow; i++) {
      const prev = new Date(y, m, 1 - dow + i);
      cal.innerHTML += `<div class="cal-day other-month">${prev.getDate()}</div>`;
    }
    const days_in = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    for (let d = 1; d <= days_in; d++) {
      const date = new Date(y, m, d);
      const key  = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday = date.toDateString() === today.toDateString();
      const hasEvent = !!events[key];
      const title = hasEvent ? ` title="${events[key]}"` : '';
      cal.innerHTML += `<div class="cal-day${isToday?' today':''}${hasEvent?' has-event':''}"${title}>${d}</div>`;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { now = new Date(now.getFullYear(), now.getMonth() - 1, 1); render(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { now = new Date(now.getFullYear(), now.getMonth() + 1, 1); render(); });
  render();
}
