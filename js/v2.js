(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- theme ---------- */
  const themeBtn = document.querySelector('.theme-btn');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  const applyTheme = dark => {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeBtn?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#16130f' : '#fff8ec');
  };
  applyTheme(saved === 'dark' || (saved !== 'light' && systemDark.matches));
  if (themeBtn) {
    themeBtn.hidden = false;
    themeBtn.addEventListener('click', () => {
      const dark = root.dataset.theme !== 'dark';
      saved = dark ? 'dark' : 'light';
      applyTheme(dark);
      try { localStorage.setItem('portfolio-theme', saved); } catch {}
    });
  }
  systemDark.addEventListener('change', e => { if (saved !== 'dark' && saved !== 'light') applyTheme(e.matches); });

  /* ---------- mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const links = document.querySelector('#nav-links');
  const setMenu = open => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  if (burger && links) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
    document.addEventListener('click', e => { if (!e.target.closest('.nav')) setMenu(false); });
  }

  /* ---------- active nav link ---------- */
  if ('IntersectionObserver' in window && links) {
    const navLinks = [...links.querySelectorAll('a[href^="#"]')];
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.getAttribute('href') === `#${entry.target.id}` ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
    }), { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => io.observe(s));
  }

  /* ---------- nav border on scroll ---------- */
  const navWrap = document.querySelector('.nav-wrap');
  const onScroll = () => navWrap?.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- hero word stagger ---------- */
  document.querySelectorAll('.hero-title .w').forEach((w, i) => w.style.setProperty('--d', i));

  /* ---------- reveal on scroll ---------- */
  const revealables = document.querySelectorAll('.reveal, .hero-title, .playground, .scribble');
  if ('IntersectionObserver' in window && !reduced) {
    const ro = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); ro.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(el => ro.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('in'));
  }

  /* ---------- counters ---------- */
  const counters = document.querySelectorAll('.count');
  const fmt = (n, dec) => dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-US');
  if (!reduced && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      const start = performance.now(), dur = 1400;
      const tick = now => {
        const t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 4);
        el.textContent = fmt(to * eased, dec);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      co.unobserve(el);
    }), { threshold: 0.6 });
    counters.forEach(el => { el.textContent = fmt(0, +(el.dataset.dec || 0)); co.observe(el); });
  }

  /* ---------- draggable stickers ---------- */
  document.querySelectorAll('.sticker').forEach(st => {
    let sx = 0, sy = 0, ox = 0, oy = 0, id = null;
    st.addEventListener('pointerdown', e => {
      id = e.pointerId; st.setPointerCapture(id); st.classList.add('dragging');
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(st.style.getPropertyValue('--dx')) || 0;
      oy = parseFloat(st.style.getPropertyValue('--dy')) || 0;
    });
    st.addEventListener('pointermove', e => {
      if (e.pointerId !== id) return;
      st.style.setProperty('--dx', `${ox + e.clientX - sx}px`);
      st.style.setProperty('--dy', `${oy + e.clientY - sy}px`);
    });
    const end = e => { if (e.pointerId !== id) return; id = null; st.classList.remove('dragging'); };
    st.addEventListener('pointerup', end);
    st.addEventListener('pointercancel', end);
  });

  /* ---------- tilt ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    /* magnetic buttons */
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 12}px ${((e.clientY - r.top) / r.height - 0.5) * 10}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });
  }

  /* ---------- timeline progress ---------- */
  const timeline = document.querySelector('.timeline');
  if (timeline && !reduced) {
    const update = () => {
      const r = timeline.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
      timeline.style.setProperty('--progress', p.toFixed(3));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- year & copy email ---------- */
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const copyBtn = document.querySelector('#copy-email');
  const status = document.querySelector('#copy-status');
  if (copyBtn && navigator.clipboard && window.isSecureContext) {
    copyBtn.hidden = false;
    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('jomypjosevyssery@gmail.com'); status.textContent = 'Copied! ✓'; }
      catch { status.textContent = 'Please select and copy the address.'; }
    });
  }

  /* ---------- screenshot lightbox ---------- */
  const shots = document.querySelectorAll('[data-shot]');
  if (shots.length && typeof HTMLDialogElement !== 'undefined') {
    const dlg = document.createElement('dialog');
    dlg.className = 'shot-dialog';
    dlg.setAttribute('aria-label', 'Screenshot preview');
    dlg.innerHTML = '<form method="dialog"><button autofocus>Close ×</button></form><img alt=""><p></p>';
    document.body.append(dlg);
    const img = dlg.querySelector('img'), cap = dlg.querySelector('p');
    shots.forEach(a => a.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      img.src = a.href; img.alt = a.querySelector('img').alt; cap.textContent = img.alt;
      dlg.showModal();
    }));
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }
})();
