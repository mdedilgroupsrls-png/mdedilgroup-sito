/* Nastro di foto che scorre da solo da destra a sinistra (render di interior design, lavori di interni e facciate).
   Dito o mouse appoggiato e fermo = si ferma; trascinando segue il dito; lasciando con uno slancio accelera e poi rallenta.
   Uso: <div class="belt" data-nastro aria-label="..."><div class="tr"> ...figure... </div></div> */
(function () {
  var CSS = '.belt{position:relative;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;-webkit-user-select:none}' +
    '.belt:active{cursor:grabbing}.belt:focus-visible{outline:2px solid #C9A24A;outline-offset:-2px}' +
    '.belt .tr{display:flex;gap:16px;width:max-content;will-change:transform}.belt img{pointer-events:none}' +
    '.belt::before,.belt::after{content:"";position:absolute;top:0;bottom:0;width:clamp(20px,6vw,90px);z-index:2;pointer-events:none}' +
    '.belt::before{left:0;background:linear-gradient(90deg,var(--nastro-bg,#0E0D0B),transparent)}' +
    '.belt::after{right:0;background:linear-gradient(-90deg,var(--nastro-bg,#0E0D0B),transparent)}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function nastro(belt) {
    var tr = belt.querySelector('.tr'); if (!tr) return;
    belt.tabIndex = 0;
    tr.innerHTML += tr.innerHTML; // seconda copia per il giro continuo
    Array.prototype.forEach.call(tr.children, function (f, k) { if (k >= tr.children.length / 2) f.setAttribute('aria-hidden', 'true'); });
    var half = 0, x = 0, boost = 0, hold = false, lx = 0, lt = 0, vel = 0, last = performance.now();
    var BASE = RM ? 0 : -(+belt.dataset.velocita || 42); // pixel al secondo, verso sinistra
    function misura() { half = tr.scrollWidth / 2; }
    addEventListener('load', misura); addEventListener('resize', misura); misura();
    function tick(t) {
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!hold) { x += (BASE + boost) * dt; boost *= Math.pow(0.08, dt); }
      if (half) { while (x > 0) x -= half; while (x < -half) x += half; }
      tr.style.transform = 'translate3d(' + x + 'px,0,0)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    belt.addEventListener('pointerdown', function (e) { hold = true; boost = 0; vel = 0; lx = e.clientX; lt = e.timeStamp; belt.setPointerCapture(e.pointerId); });
    belt.addEventListener('pointermove', function (e) {
      if (!hold) return;
      var dx = e.clientX - lx, dtm = Math.max(1, e.timeStamp - lt);
      x += dx; vel = vel * 0.6 + (dx / dtm * 1000) * 0.4; lx = e.clientX; lt = e.timeStamp;
    });
    function lascia(e) {
      if (!hold) return; hold = false;
      var fermo = e && e.timeStamp - lt > 120; // dito fermo prima di staccarsi: nessuno slancio
      boost = fermo ? 0 : Math.max(-4000, Math.min(4000, vel - BASE));
    }
    belt.addEventListener('pointerup', lascia); belt.addEventListener('pointercancel', lascia);
    belt.addEventListener('dragstart', function (e) { e.preventDefault(); });
    belt.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { x -= e.deltaX; e.preventDefault(); } }, { passive: false });
    if (window.MDFrecce) MDFrecce.bottoni(belt, function () { boost += 1400; }, function () { boost -= 1400; }, belt.getAttribute('aria-label'));
    belt.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { boost -= 1400; e.preventDefault(); }
      if (e.key === 'ArrowLeft') { boost += 1400; e.preventDefault(); }
    });
  }
  document.querySelectorAll('[data-nastro]').forEach(nastro);
})();
