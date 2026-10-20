/* Frecce ‹ › e trascinamento col mouse per le file di foto e schede che si scorrono di lato, così si usano anche dal
   computer. Sul telefono le frecce non compaiono e si scorre col dito come sempre.
   - File che scorrono (overflow-x:auto): attributo data-frecce sull'elemento (data-frecce="solo-frecce" se il
     trascinamento col mouse c'è già).
   - Nastri che scorrono da soli (js/nastro.js e Home): MDFrecce.bottoni(contenitore, indietro, avanti). */
(function () {
  var CSS = '.fr-wrap{position:relative}' +
    '.fr-btn{position:absolute;top:50%;z-index:4;width:44px;height:44px;margin-top:-22px;border-radius:50%;border:1px solid #C9A24A;background:rgba(14,13,11,.88);color:#E2C373;font:400 24px/1 sans-serif;cursor:pointer;display:none;align-items:center;justify-content:center;padding:0 0 3px;transition:background .2s,color .2s,opacity .2s}' +
    '.fr-btn[hidden]{display:none!important}.fr-btn:hover{background:#C9A24A;color:#0E0D0B}.fr-btn:disabled{opacity:.25;cursor:default}' +
    '.fr-btn:focus-visible{outline:2px solid #E2C373;outline-offset:2px}' +
    '.fr-btn.sx{left:8px}.fr-btn.dx{right:8px}' +
    '@media (hover:hover) and (pointer:fine){.fr-btn{display:flex}[data-frecce]:not([data-frecce=solo-frecce]){cursor:grab}[data-frecce].fr-drag{cursor:grabbing;scroll-snap-type:none!important}}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function bottoni(box, indietro, avanti, etichetta) {
    var b = [['sx', '‹', 'Indietro', indietro], ['dx', '›', 'Avanti', avanti]].map(function (x) {
      var el = document.createElement('button'); el.type = 'button'; el.className = 'fr-btn ' + x[0]; el.textContent = x[1];
      el.setAttribute('aria-label', x[2] + (etichetta ? ': ' + etichetta : ''));
      // il clic sulla freccia non deve far partire il trascinamento del nastro
      el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); x[3](); });
      box.appendChild(el); return el;
    });
    return { sx: b[0], dx: b[1] };
  }

  function fila(el) {
    var wrap = document.createElement('div'); wrap.className = 'fr-wrap';
    el.parentNode.insertBefore(wrap, el); wrap.appendChild(el);
    var passo = function () { return Math.max(160, el.clientWidth * 0.8); };
    var b = bottoni(wrap, function () { el.scrollBy({ left: -passo(), behavior: 'smooth' }); },
      function () { el.scrollBy({ left: passo(), behavior: 'smooth' }); }, el.getAttribute('aria-label'));
    function agg() {
      var tutto = el.scrollWidth <= el.clientWidth + 4; // se si vede già tutto, le frecce non servono
      b.sx.hidden = b.dx.hidden = tutto;
      b.sx.disabled = el.scrollLeft <= 4; b.dx.disabled = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    }
    el.addEventListener('scroll', agg, { passive: true }); addEventListener('resize', agg); addEventListener('load', agg); agg();
    new MutationObserver(agg).observe(el, { childList: true });
    if (el.dataset.frecce === 'solo-frecce') return;
    // trascinando col mouse la fila scorre; un trascinamento non vale come clic
    var giu = false, x0 = 0, s0 = 0, mosso = 0;
    el.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; giu = true; mosso = 0; x0 = e.clientX; s0 = el.scrollLeft; });
    addEventListener('pointermove', function (e) { if (!giu) return; var dx = e.clientX - x0; mosso = Math.max(mosso, Math.abs(dx)); if (mosso > 5) { el.classList.add('fr-drag'); el.scrollLeft = s0 - dx; } });
    addEventListener('pointerup', function () { if (giu) { giu = false; el.classList.remove('fr-drag'); } });
    el.addEventListener('click', function (e) { if (mosso > 5) { e.preventDefault(); e.stopPropagation(); mosso = 0; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  window.MDFrecce = { bottoni: bottoni, fila: fila };
  document.querySelectorAll('[data-frecce]').forEach(fila);
})();
