// Nastri di schede che scorrono da soli da destra a sinistra (.tac-belt > .tac-tr): taccuino della Home
// cantieri realizzati della pagina infissi e video dei villaggi in legno (data-min="2": scorre anche con 2 schede).
// Se dentro c'è un video che sta andando, il nastro resta fermo.
// Ogni scheda compare dal giorno scritto in data-dal (AAAA-MM-GG, ora di Roma); le schede sono in ordine dal più recente.
// Mouse sopra o dito appoggiato = si ferma; trascinando segue il dito; un clic senza trascinare apre l'articolo.
Array.prototype.forEach.call(document.querySelectorAll('.tac-belt'), function (belt) {
  var tr = belt.querySelector('.tac-tr');
  if (!tr) return;
  var oggi;
  try { oggi = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date()); }
  catch (e) { oggi = new Date().toISOString().slice(0, 10); }
  Array.prototype.slice.call(tr.children).forEach(function (a) { if (a.dataset.dal && a.dataset.dal > oggi) a.remove(); });
  var n = tr.children.length;
  if (n < (+belt.dataset.min || 3) || matchMedia('(prefers-reduced-motion: reduce)').matches) { belt.style.overflowX = 'auto'; return; }
  var orig = tr.innerHTML, half = 0, vids = tr.getElementsByTagName('video');
  function suona() { for (var i = 0; i < vids.length; i++) if (!vids[i].paused && !vids[i].ended) return true; return false; }
  function misura() {
    // larghezza di un giro (le schede originali + lo spazio dopo l'ultima) e copie finché il nastro copre lo schermo
    tr.innerHTML = orig;
    half = tr.scrollWidth + parseFloat(getComputedStyle(tr).columnGap || 18);
    var copie = Math.max(2, Math.ceil((belt.clientWidth + half) / half) + 1), h = '';
    for (var i = 0; i < copie; i++) h += orig;
    tr.innerHTML = h;
    Array.prototype.forEach.call(tr.children, function (a, k) { if (k >= n) { a.setAttribute('aria-hidden', 'true'); a.tabIndex = -1; } });
  }
  belt.tabIndex = 0;
  var x = 0, boost = 0, sopra = false, giu = false, trascina = false, sx = 0, lx = 0, lt = 0, vel = 0, last = performance.now(), BASE = -34;
  var lw = 0; addEventListener('resize', function () { if (belt.clientWidth !== lw && !suona()) { lw = belt.clientWidth; misura(); } }); addEventListener('load', misura); misura(); lw = belt.clientWidth;
  function tick(t) {
    var dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!giu) { x += ((sopra || suona() ? 0 : BASE) + boost) * dt; boost *= Math.pow(0.08, dt); }
    if (half) { while (x > 0) x -= half; while (x < -half) x += half; }
    tr.style.transform = 'translate3d(' + x + 'px,0,0)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  belt.addEventListener('mouseenter', function () { sopra = true; });
  belt.addEventListener('mouseleave', function () { sopra = false; });
  belt.addEventListener('pointerdown', function (e) { if (suona()) return; giu = true; trascina = false; boost = 0; vel = 0; sx = lx = e.clientX; lt = e.timeStamp; });
  belt.addEventListener('pointermove', function (e) {
    if (!giu) return;
    if (!trascina && Math.abs(e.clientX - sx) > 6) { trascina = true; try { belt.setPointerCapture(e.pointerId); } catch (er) {} }
    if (!trascina) return;
    var dx = e.clientX - lx, dtm = Math.max(1, e.timeStamp - lt);
    x += dx; vel = vel * 0.6 + (dx / dtm * 1000) * 0.4; lx = e.clientX; lt = e.timeStamp;
  });
  function lascia(e) {
    if (!giu) return; giu = false;
    if (trascina) boost = e && e.timeStamp - lt > 120 ? 0 : Math.max(-3000, Math.min(3000, vel - BASE));
  }
  belt.addEventListener('pointerup', lascia); belt.addEventListener('pointercancel', lascia);
  belt.addEventListener('click', function (e) { if (trascina) { e.preventDefault(); e.stopPropagation(); trascina = false; } }, true);
  belt.addEventListener('dragstart', function (e) { e.preventDefault(); });
  belt.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { x -= e.deltaX; e.preventDefault(); } }, { passive: false });
  belt.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { boost -= 1200; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { boost += 1200; e.preventDefault(); }
  });
});
