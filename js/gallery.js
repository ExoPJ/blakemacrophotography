/* The gallery is built from gallery.json, which a GitHub Action regenerates
   whenever images are added to the gallery/ folder (see scripts/build-gallery.py). */
(function () {
  const grid = document.getElementById('grid'), lb = document.getElementById('lb');
  const $ = id => document.getElementById(id);
  let PHOTOS = [], cur = 0;

  fetch('gallery.json', { cache: 'no-cache' }).then(r => r.json()).then(list => {
    PHOTOS = list;
    if (!PHOTOS.length) $('empty').hidden = false;
    PHOTOS.forEach((p, i) => {
      const f = document.createElement('figure'); f.tabIndex = 0;
      const img = document.createElement('img'); img.src = p.src; img.alt = p.title; img.loading = 'lazy';
      const cap = document.createElement('figcaption'); cap.textContent = p.title;
      f.append(img, cap);
      f.addEventListener('click', () => open(i));
      f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
      grid.appendChild(f);
    });
  }).catch(() => { $('empty').textContent = 'Could not load the gallery. View this site through GitHub Pages or a local web server.'; $('empty').hidden = false; });

  function show(i) {
    cur = (i + PHOTOS.length) % PHOTOS.length; const p = PHOTOS[cur];
    $('lb-img').src = p.src; $('lb-img').alt = p.title;
    $('lb-eyebrow').textContent = p.category || ''; $('lb-title').textContent = p.title;
    $('lb-sub').textContent = p.subtitle || ''; $('lb-desc').textContent = p.desc || '';
  }
  function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('lb-close').focus(); }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  $('lb-close').onclick = close;
  lb.querySelector('.lb-prev').onclick = () => show(cur - 1);
  lb.querySelector('.lb-next').onclick = () => show(cur + 1);
  lb.querySelector('.lb-stage').addEventListener('click', e => { if (e.target.classList.contains('lb-stage')) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
  });
})();
