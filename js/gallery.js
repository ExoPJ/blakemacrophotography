/* Edit this list to add photos: put image files in assets/gallery/ and add an entry. */
const PHOTOS = [
  { src: 'assets/gallery/m33.svg', title: 'Triangulum Galaxy', subtitle: 'Spiral galaxy', category: 'M33 · NGC 598',
    desc: 'My first astrophotography image: M33, a spiral galaxy about 2.7 million light-years away. Stacked in Siril and finished in Lightroom.' },
  { src: 'assets/gallery/photo2.svg', title: 'Photo Title', subtitle: 'Subtitle', category: 'Category',
    desc: 'Add a description for this photo: where it was taken, the gear used and what you were going for.' },
  { src: 'assets/gallery/photo3.svg', title: 'Photo Title', subtitle: 'Subtitle', category: 'Category',
    desc: 'Add a description for this photo.' },
  { src: 'assets/gallery/photo4.svg', title: 'Photo Title', subtitle: 'Subtitle', category: 'Category',
    desc: 'Add a description for this photo.' },
];

(function () {
  const grid = document.getElementById('grid'), lb = document.getElementById('lb');
  const $ = id => document.getElementById(id);
  let cur = 0;
  PHOTOS.forEach((p, i) => {
    const f = document.createElement('figure'); f.tabIndex = 0;
    f.innerHTML = `<img src="${p.src}" alt="${p.title}" loading="lazy"><figcaption>${p.title}</figcaption>`;
    f.addEventListener('click', () => open(i));
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    grid.appendChild(f);
  });
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
