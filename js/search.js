/* ============================================================
   Heartopia Guide · Site-wide search (homepage hero)
   Live suggestions across all 8 databases; Enter / click jumps
   to the matching database page with the query in ?q=.
   ============================================================ */
(function () {
  'use strict';

  var input = document.getElementById('hero-search-input');
  var suggest = document.getElementById('hero-search-suggest');
  var goBtn = document.getElementById('hero-search-go');
  if (!input || !suggest) return;

  var I18N = window.I18N;
  function _t(key, params) { return I18N ? I18N.t(key, params) : key; }
  function _L(v) { return I18N ? I18N.L(v) : v; }
  function _name(r) { return I18N ? I18N.nameFor({ name: r.name, enName: r.enName }) : r.name; }
  function _sub(r) {
    if (!r.sub) return '';
    return String(r.sub).split(' · ').map(_L).join(' · ');
  }

  var DB_CONFIG = [
    { key: 'fish',         varName: 'FISH_DATA',          page: 'database-fish.html',          label: 'search.label.fish', accent: 'var(--teal)' },
    { key: 'insects',      varName: 'INSECTS_DATA',       page: 'database-insects.html',       label: 'search.label.insects', accent: 'var(--green)' },
    { key: 'birds',        varName: 'BIRDS_DATA',         page: 'database-birds.html',         label: 'search.label.birds', accent: 'var(--lavender)' },
    { key: 'recipes',      varName: 'RECIPES_DATA',       page: 'database-recipes.html',       label: 'search.label.recipes', accent: 'var(--coral)' },
    { key: 'crops',        varName: 'CROPS_DATA',         page: 'database-crops.html',         label: 'search.label.crops', accent: 'var(--green)' },
    { key: 'npcs',         varName: 'NPCS_DATA',          page: 'database-npcs.html',          label: 'search.label.npcs',  accent: 'var(--gold)' },
    { key: 'achievements', varName: 'ACHIEVEMENTS_DATA',  page: 'database-achievements.html',  label: 'search.label.achievements', accent: 'var(--coral)' },
    { key: 'scores',       varName: 'SCORES_DATA',        page: 'database-scores.html',        label: 'search.label.scores', accent: 'var(--lavender)' }
  ];

  function emojiFor(key, item) {
    try {
      switch (key) {
        case 'fish': return window.getFishEmoji ? getFishEmoji(item.enName, item.name).emoji : '🐟';
        case 'insects': return window.getInsectEmoji ? getInsectEmoji(item.enName, item.name).emoji : '🦋';
        case 'birds': return window.getBirdEmoji ? getBirdEmoji(item.enName, item.name).emoji : '🐦';
        case 'recipes': return window.getRecipeEmoji ? getRecipeEmoji(item.enName, item.name, item.category).emoji : '🍳';
        case 'crops': return window.getCropEmoji ? getCropEmoji(item.enName, item.name, item.category).emoji : '🌱';
        case 'npcs': return window.getNpcEmoji ? getNpcEmoji(item.enName, item.name, item.role).emoji : '👤';
        case 'achievements': return window.getAchievementEmoji ? getAchievementEmoji(item.category).emoji : '🏆';
        case 'scores': return window.getScoreEmoji ? getScoreEmoji(item.instrument).emoji : '🎵';
        default: return '·';
      }
    } catch (e) { return '·'; }
  }

  function subtitleFor(key, item) {
    switch (key) {
      case 'fish':
      case 'insects':
      case 'birds': return item.location || item.season || '';
      case 'recipes': return item.ingredients || '';
      case 'crops': return [item.category, item.season].filter(Boolean).join(' · ');
      case 'npcs': return item.role || '';
      case 'achievements': return item.category || '';
      case 'scores': return item.instrument || '';
      default: return '';
    }
  }

  // Build a flat, searchable index from the inline data globals
  var INDEX = [];
  DB_CONFIG.forEach(function (cfg) {
    var data = window[cfg.varName];
    if (!Array.isArray(data)) return;
    data.forEach(function (item) {
      if (!item || !item.name) return;
      var sub = subtitleFor(cfg.key, item);
      var hay = [item.name, item.enName, sub].filter(Boolean).join(' ').toLowerCase();
      INDEX.push({
        key: cfg.key, page: cfg.page, label: cfg.label, accent: cfg.accent,
        name: item.name, enName: item.enName || '',
        sub: sub, emoji: emojiFor(cfg.key, item), hay: hay
      });
    });
  });

  function search(q) {
    var query = q.toLowerCase().trim();
    if (!query) return [];
    var out = [];
    INDEX.forEach(function (it) {
      var name = it.name.toLowerCase();
      var enName = it.enName.toLowerCase();
      var s = 0;
      if (name === query) s = 100;
      else if (name.indexOf(query) === 0) s = 90;
      else if (enName.indexOf(query) === 0) s = 85;
      else if (name.indexOf(query) !== -1) s = 70;
      else if (enName.indexOf(query) !== -1) s = 60;
      else if (it.hay.indexOf(query) !== -1) s = 40;
      if (s > 0) out.push({ it: it, s: s });
    });
    out.sort(function (a, b) { return b.s - a.s; });
    return out.slice(0, 8).map(function (x) { return x.it; });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, query) {
    var t = esc(text);
    var q = query.trim();
    if (!q) return t;
    var i = t.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return t;
    return t.slice(0, i) + '<mark>' + t.slice(i, i + q.length) + '</mark>' + t.slice(i + q.length);
  }

  function render(results, query) {
    if (!results.length) {
      suggest.innerHTML = '<div class="hs-empty">' + _t('search.empty', { q: esc(query) }) + '</div>';
      suggest.hidden = false;
      return;
    }
    var html = results.map(function (r) {
      return '<button type="button" class="hs-item" data-page="' + r.page + '" data-q="' + esc(r.name) + '" style="--hs-accent:' + r.accent + '">' +
        '<span class="hs-item-emoji">' + r.emoji + '</span>' +
        '<span class="hs-item-main">' +
          '<span class="hs-item-name">' + highlight(_name(r), query) + '</span>' +
          (r.sub ? '<span class="hs-item-sub">' + esc(_sub(r)) + '</span>' : '') +
        '</span>' +
        '<span class="hs-item-badge">' + _t(r.label) + '</span>' +
      '</button>';
    }).join('');
    suggest.innerHTML = '<div class="hs-suggest-inner">' + html + '</div>';
    suggest.hidden = false;
  }

  function submit() {
    var q = input.value.trim();
    if (!q) return;
    var top = search(q)[0];
    if (top) {
      location.href = top.page + '?q=' + encodeURIComponent(q);
    } else {
      location.href = 'database.html';
    }
  }

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    var q = input.value.trim();
    if (!q) { suggest.hidden = true; return; }
    timer = setTimeout(function () { render(search(q), q); }, 120);
  });

  input.addEventListener('focus', function () {
    if (input.value.trim()) render(search(input.value), input.value.trim());
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      suggest.hidden = true;
      input.blur();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var items = suggest.querySelectorAll('.hs-item');
      if (!items.length) return;
      e.preventDefault();
      var cur = suggest.querySelector('.hs-item.active');
      var idx = cur ? Array.prototype.indexOf.call(items, cur) : -1;
      if (e.key === 'ArrowDown') idx = idx >= items.length - 1 ? 0 : idx + 1;
      else idx = idx <= 0 ? items.length - 1 : idx - 1;
      items.forEach(function (b) { b.classList.remove('active'); });
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  });

  if (goBtn) goBtn.addEventListener('click', submit);

  suggest.addEventListener('click', function (e) {
    var btn = e.target.closest('.hs-item');
    if (!btn) return;
    location.href = btn.dataset.page + '?q=' + encodeURIComponent(btn.dataset.q);
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.hero-search')) suggest.hidden = true;
  });

  // Re-render on language switch
  window.addEventListener('langchange', function () {
    var q = input.value.trim();
    if (q) render(search(q), q);
    else suggest.hidden = true;
  });

  // Pre-fill + auto-run site-wide search from ?q= (Sitelinks Searchbox / shared links)
  try {
    var urlQ = new URLSearchParams(location.search).get('q');
    if (urlQ && urlQ.trim()) {
      input.value = urlQ.trim();
      submit();
    }
  } catch (e) {}
})();
