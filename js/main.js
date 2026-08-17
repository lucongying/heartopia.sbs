/* ============================================================
   Heartopia Guide · Shared JS
   Navigation active state, scroll reveal, FAQ accordion, theme
   ============================================================ */

(function () {
  'use strict';

  // ---- Active nav link ----
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Highlight database dropdown toggle when on any database subpage
  if (currentPage.startsWith('database-') || currentPage === 'database.html') {
    const dbToggle = document.querySelector('.nav-dropdown-toggle');
    if (dbToggle && currentPage !== 'database.html') {
      dbToggle.classList.add('active');
    }
    // Highlight the matching dropdown item
    document.querySelectorAll('.nav-dropdown-menu a').forEach(item => {
      if (item.getAttribute('href') === currentPage) {
        item.style.background = 'var(--coral-light)';
        item.style.color = 'var(--coral)';
        item.style.fontWeight = '700';
      }
    });
  }

  // ---- Scroll reveal ----
  // Progressively enhanced: content is visible by default (CSS only hides it under
  // `html.js`). If IntersectionObserver is unavailable, reveal everything at once so
  // no content is ever left invisible.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.parentElement.classList.toggle('open'); }
    });
  });

  // ---- Tab bar ----
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const bar = this.parentElement;
      bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tabId = this.dataset.tab;
      if (tabId && typeof switchTab === 'function') switchTab(tabId);
    });
  });

  // ---- Filter chips ----
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      // Toggle within same group (same data-group)
      const group = this.dataset.group;
      if (group) {
        document.querySelectorAll(`.filter-chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
      }
      this.classList.toggle('active');
      if (typeof applyFilters === 'function') applyFilters();
    });
  });

  // ---- Global search input ----
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    // Pre-fill from ?q= (site-wide search from homepage hero)
    const qParam = new URLSearchParams(location.search).get('q');
    if (qParam) {
      searchInput.value = qParam;
    }
    searchInput.addEventListener('input', function () {
      if (typeof applyFilters === 'function') applyFilters();
    });
    // Clear search
    const clearBtn = document.getElementById('clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        if (typeof applyFilters === 'function') applyFilters();
      });
    }
  }

  // ---- Navigation dropdown ----
  // Desktop (hover): hovering opens the menu; clicking the link navigates to 数据库首页.
  // Touch (no hover): tapping toggles the menu instead of navigating.
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  dropdowns.forEach(dd => {
    const toggle = dd.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    if (canHover) {
      let closeTimer;
      dd.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        dropdowns.forEach(other => other.classList.remove('open'));
        dd.classList.add('open');
      });
      dd.addEventListener('mouseleave', function () {
        // Small delay so the pointer can cross the gap between link and menu
        closeTimer = setTimeout(function () { dd.classList.remove('open'); }, 150);
      });
    } else {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const wasOpen = dd.classList.contains('open');
        dropdowns.forEach(other => other.classList.remove('open'));
        if (!wasOpen) dd.classList.add('open');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(dd => dd.classList.remove('open'));
    }
  });

  // Close dropdowns on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(dd => dd.classList.remove('open'));
    }
  });

  // ---- Back to top ----
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(backToTop);

  let backToTopTicking = false;
  const showBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', () => {
    if (!backToTopTicking) {
      backToTopTicking = true;
      requestAnimationFrame(() => { showBackToTop(); backToTopTicking = false; });
    }
  }, { passive: true });
  showBackToTop();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
