/* Animated backgrounds: window.Background.set('vines' | 'leaves' | 'none') */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, mode = 'none', vines = [], leaves = [], raf;

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; if (mode === 'vines') initVines(); }
  addEventListener('resize', resize);

  /* ---- vines ---- */
  function makeVine(x0, y0, dir, depth) {
    const pts = [{ x: x0, y: y0 }];
    let a = dir, x = x0, y = y0;
    const len = 70 + Math.random() * 60 - depth * 12;
    for (let i = 0; i < len; i++) {
      a += (Math.random() - 0.5) * 0.35 + Math.sin(i / 9 + x0) * 0.04;
      x += Math.cos(a) * 7; y += Math.sin(a) * 7;
      pts.push({ x, y });
    }
    const leafAt = [];
    for (let i = 6; i < pts.length; i += 5 + (Math.random() * 4 | 0)) leafAt.push({ i, side: Math.random() < .5 ? 1 : -1, size: 8 + Math.random() * 9, hue: 110 + Math.random() * 40 });
    return { pts, leafAt, grown: -Math.random() * 60, speed: 0.6 + Math.random() * 0.5, depth, children: [], spawned: false };
  }
  function initVines() {
    vines = [];
    const n = Math.max(5, Math.round(W / 220));
    for (let i = 0; i < n; i++) vines.push(makeVine(Math.random() * W, H + 10, -Math.PI / 2 + (Math.random() - .5) * .6, 0));
    // vines creeping down from the top corners
    vines.push(makeVine(0, -10, Math.PI / 2.4, 0), makeVine(W, -10, Math.PI - Math.PI / 2.4, 0));
  }
  function drawLeaf(x, y, ang, s, hue, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = `hsla(${hue},55%,${32 + s}%,${alpha})`;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.bezierCurveTo(s * .6, -s * .7, s * 1.5, -s * .4, s * 1.8, 0);
    ctx.bezierCurveTo(s * 1.5, s * .4, s * .6, s * .7, 0, 0);
    ctx.fill(); ctx.restore();
  }
  function drawVine(v) {
    const n = Math.min(v.pts.length - 1, Math.floor(v.grown));
    if (n < 1) return;
    ctx.strokeStyle = 'rgba(70,140,80,.55)'; ctx.lineWidth = Math.max(1, 3 - v.depth); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(v.pts[0].x, v.pts[0].y);
    for (let i = 1; i <= n; i++) ctx.lineTo(v.pts[i].x, v.pts[i].y);
    ctx.stroke();
    for (const l of v.leafAt) {
      if (l.i > n) break;
      const p = v.pts[l.i], q = v.pts[l.i - 1];
      const ang = Math.atan2(p.y - q.y, p.x - q.x) + l.side * 1.1;
      const grow = Math.min(1, (n - l.i) / 8);
      drawLeaf(p.x, p.y, ang, l.size * grow, l.hue, .75);
    }
  }
  function stepVines() {
    ctx.clearRect(0, 0, W, H);
    const all = [];
    (function collect(list) { for (const v of list) { all.push(v); collect(v.children); } })(vines);
    for (const v of all) {
      if (v.grown < v.pts.length - 1) v.grown += v.speed;
      else if (!v.spawned && v.depth < 2) {
        v.spawned = true;
        for (let k = 0; k < 2; k++) {
          const i = Math.floor(v.pts.length * (.35 + k * .3)), p = v.pts[i], q = v.pts[i - 1];
          const a = Math.atan2(p.y - q.y, p.x - q.x) + (k ? 1 : -1) * (.7 + Math.random() * .4);
          v.children.push(makeVine(p.x, p.y, a, v.depth + 1));
        }
      }
      drawVine(v);
    }
  }

  /* ---- falling leaves ---- */
  const FALL = ['#c0392b', '#d35400', '#e67e22', '#f39c12', '#f1c40f', '#a93226', '#e74c3c'];
  function makeLeaf(top) {
    return { x: Math.random() * W, y: top ? -20 : Math.random() * H, s: 7 + Math.random() * 11, vy: .5 + Math.random() * 1.1,
      sway: Math.random() * 6, ph: Math.random() * 6.28, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .04,
      c: FALL[Math.random() * FALL.length | 0] };
  }
  function initLeaves() { leaves = Array.from({ length: Math.round(Math.min(70, W / 18)) }, () => makeLeaf(false)); }
  function stepLeaves() {
    ctx.clearRect(0, 0, W, H);
    for (const l of leaves) {
      l.y += l.vy; l.ph += .02; l.x += Math.sin(l.ph) * .8; l.rot += l.vr;
      if (l.y > H + 20) Object.assign(l, makeLeaf(true));
      ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.fillStyle = l.c; ctx.globalAlpha = .85;
      ctx.beginPath(); ctx.moveTo(0, -l.s);
      ctx.bezierCurveTo(l.s, -l.s * .5, l.s * .8, l.s * .6, 0, l.s);
      ctx.bezierCurveTo(-l.s * .8, l.s * .6, -l.s, -l.s * .5, 0, -l.s); ctx.fill();
      ctx.strokeStyle = 'rgba(60,20,0,.4)'; ctx.beginPath(); ctx.moveTo(0, -l.s); ctx.lineTo(0, l.s); ctx.stroke();
      ctx.restore();
    }
  }

  function loop() {
    if (mode === 'vines') stepVines(); else if (mode === 'leaves') stepLeaves();
    raf = requestAnimationFrame(loop);
  }
  window.Background = {
    set(m) {
      if (m === mode) return;
      mode = m; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H);
      if (m === 'vines') initVines(); else if (m === 'leaves') initLeaves();
      if (m !== 'none') {
        if (reduce) { for (let i = 0; i < 400; i++) { if (m === 'vines') { vines.forEach(v => v.grown = 1e9); } } }
        loop();
      }
    }
  };
  resize();
})();
