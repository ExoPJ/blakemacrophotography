/* Accordions (with optional seasonal theming) + shared nav highlighting */
(function () {
  const page = document.body.dataset.page;
  document.querySelectorAll('nav a').forEach(a => { if (a.dataset.page === page) a.classList.add('active'); });

  const defaultTheme = document.body.dataset.theme || 'green';
  const heads = document.querySelectorAll('.acc-head');
  heads.forEach(h => {
    h.addEventListener('click', () => {
      const acc = h.parentElement, wasOpen = acc.classList.contains('open');
      document.querySelectorAll('.acc.open').forEach(a => { a.classList.remove('open'); a.querySelector('.acc-head').setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) { acc.classList.add('open'); h.setAttribute('aria-expanded', 'true'); }
      const season = !wasOpen && acc.dataset.season;
      if (document.body.dataset.seasonal !== undefined) {
        document.body.dataset.theme = season || defaultTheme;
        window.Background && Background.set(season === 'fall' ? 'leaves' : 'vines');
      }
    });
  });
  if (document.body.dataset.bg && window.Background) Background.set(document.body.dataset.bg);
})();
