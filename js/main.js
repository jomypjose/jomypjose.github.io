(() => {
  'use strict';
  const themeToggle = document.querySelector('.theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
  const applyTheme = dark => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    themeToggle?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#151b18' : '#f5f4ef');
  };
  applyTheme(savedTheme === 'dark' || (savedTheme !== 'light' && systemTheme.matches));
  if (themeToggle) {
    themeToggle.hidden = false;
    themeToggle.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme !== 'dark';
      savedTheme = dark ? 'dark' : 'light';
      applyTheme(dark);
      try { localStorage.setItem('portfolio-theme', savedTheme); } catch {}
    });
  }
  systemTheme.addEventListener('change', event => {
    if (savedTheme !== 'dark' && savedTheme !== 'light') applyTheme(event.matches);
  });

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  };
  if (menu && navigation) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      navigation.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menu.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
    const desktop = window.matchMedia('(min-width: 601px)');
    desktop.addEventListener('change', closeMenu);
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const copyButton = document.querySelector('#copy-email');
  const status = document.querySelector('#copy-status');
  if (copyButton && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('jomypjosevyssery@gmail.com');
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Please select and copy the email address above.';
      }
    });
  }

  if (navigation && 'IntersectionObserver' in window) {
    const sectionLinks = Array.from(navigation.querySelectorAll('a'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionLinks.forEach(link => {
            if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
  }
  // Links still open the original images when dialog support or JavaScript is absent.
  if (typeof HTMLDialogElement !== 'undefined') {
    const previews = document.querySelectorAll('[data-screenshot]');
    if (previews.length) {
      const dialog = document.createElement('dialog');
      dialog.className = 'screenshot-dialog';
      dialog.setAttribute('aria-label', 'Screenshot preview');
      dialog.innerHTML = '<form method="dialog"><button autofocus>Close preview ×</button></form><img alt=""><p></p>';
      document.body.append(dialog);
      const previewImage = dialog.querySelector('img');
      const caption = dialog.querySelector('p');
      previews.forEach(link => link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        previewImage.src = link.href;
        previewImage.alt = link.querySelector('img').alt;
        caption.textContent = previewImage.alt;
        dialog.showModal();
      }));
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
    }
  }
})();
