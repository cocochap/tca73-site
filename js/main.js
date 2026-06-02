/* ============================================================
   TCA73 — Trial Club Albertvillois 73
   main.js — Fonctionnalités globales
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navigation ---- */
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  // Scroll → header opaque
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menu hamburger
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link courant
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Back to top ---- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Scroll animations (Intersection Observer) ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ---- Compteur animé (chiffres clés) ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObserver.observe(el));
  }

  function animateCount(el) {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800;
    const start   = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer    = btn.nextElementSibling;
      const isOpen    = btn.classList.contains('open');
      const container = btn.closest('.faq-list') || document;

      // Fermer toutes les autres
      container.querySelectorAll('.faq-question.open').forEach(q => {
        if (q !== btn) {
          q.classList.remove('open');
          q.nextElementSibling.classList.remove('open');
        }
      });

      btn.classList.toggle('open', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });

  /* ---- Filtres événements / galerie ---- */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group  = btn.closest('[data-filter-group]');
      const filter = btn.dataset.filter;
      const items  = group ? group.querySelectorAll('[data-category]') : document.querySelectorAll('[data-category]');

      (group || document).querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---- Lightbox galerie ---- */
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lb-img');
  const lbCaption   = document.getElementById('lb-caption');
  const lbClose     = document.getElementById('lb-close');
  const lbPrev      = document.getElementById('lb-prev');
  const lbNext      = document.getElementById('lb-next');
  let lbItems       = [];
  let lbCurrent     = 0;

  function openLightbox(index) {
    lbCurrent = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = lbItems[lbCurrent];
    if (!item) return;
    lbImg.src     = item.dataset.src || item.querySelector('img')?.src || '';
    lbImg.alt     = item.dataset.caption || '';
    if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
  }

  if (lightbox) {
    lbItems = Array.from(document.querySelectorAll('.gallery-item'));

    lbItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lbClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    lbPrev?.addEventListener('click', () => { lbCurrent = (lbCurrent - 1 + lbItems.length) % lbItems.length; updateLightbox(); });
    lbNext?.addEventListener('click', () => { lbCurrent = (lbCurrent + 1) % lbItems.length; updateLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   { lbCurrent = (lbCurrent - 1 + lbItems.length) % lbItems.length; updateLightbox(); }
      if (e.key === 'ArrowRight')  { lbCurrent = (lbCurrent + 1) % lbItems.length; updateLightbox(); }
    });
  }

  /* ---- Formulaires de contact / partenaires ---- */
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn     = form.querySelector('[type=submit]');
      const success = form.nextElementSibling;

      if (!validateForm(form)) return;

      btn.disabled  = true;
      btn.textContent = 'Envoi en cours…';

      // Simulation d'envoi (à remplacer par un vrai endpoint)
      await new Promise(r => setTimeout(r, 1200));

      form.reset();
      btn.disabled    = false;
      btn.textContent = btn.dataset.label || 'Envoyer';
      if (success) success.classList.add('show');
    });
  });

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        field.style.borderColor = 'var(--color-red)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    const emailField = form.querySelector('[type=email]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = 'var(--color-red)';
      valid = false;
    }
    return valid;
  }

  /* ---- Smooth scroll pour les ancres internes ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

});
