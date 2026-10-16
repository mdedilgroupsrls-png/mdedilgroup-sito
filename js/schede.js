/* Scheda grande di una casa in legno (foto + planimetria) che si apre davanti alla pagina.
   Si usa nella Home (catalogo) e nella pagina /case-in-legno (scelta del modello).
   window.MDScheda.open(slug, {simula: url | funzione}) */
(function () {
  var NOMI = {
    'mini-barn-boutique': 'Mini Barn Boutique', 'barn-mini': 'Barn Mini', 'barn-light': 'Barn Light', 'barn-house': 'Barn House',
    'freya-smart': 'Freya Smart', 'a-frame': 'A-frame', 'barn-max-height': 'Barn Max Height', 'flat-house': 'Flat House',
    'a-frame-l': 'A-Frame L', 'barn-double': 'Barn Double', 'flat-house-1-5': 'Flat House 1.5', 'nord-house': 'Nord House',
    'olivia': 'Olivia', 'fjord': 'Fjord', 'flat-double': 'Flat Double', 'sherwood': 'Sherwood', 'norway': 'Norway',
    'siver': 'Siver', 'montblanc': 'Montblanc'
  };
  var css = '.sk{position:fixed;inset:0;z-index:500;display:flex;justify-content:center;align-items:center;overflow:hidden;background:rgba(8,7,6,.86);backdrop-filter:blur(6px);padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));opacity:0;transition:opacity .3s}' +
    '.sk.on{opacity:1}.sk[hidden]{display:none}' +
    '.sk-box{position:relative;width:auto;max-width:min(100%,560px);max-height:calc(100dvh - 32px);display:flex;flex-direction:column;background:#171512;border:1px solid #C9A24A;transform:translateY(18px) scale(.97);transition:transform .35s cubic-bezier(.2,.8,.2,1)}' +
    '.sk.on .sk-box{transform:none}' +
    '.sk-top{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;background:rgba(23,21,18,.96);border-bottom:1px solid #2A2722}' +
    '.sk-top h2{margin:0;font:600 clamp(18px,2.4vw,24px) Urbanist,sans-serif;color:#F3EFE7}' +
    '.sk-x{flex:0 0 auto;width:42px;height:42px;border:1px solid #C9A24A;border-radius:50%;background:none;color:#E2C373;font-size:22px;line-height:1;cursor:pointer}' +
    '.sk-x:focus-visible,.sk-go:focus-visible{outline:2px solid #E2C373;outline-offset:3px}' +
    '.sk-body{flex:0 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;align-items:center}.sk-img{display:block;width:auto;max-width:100%;height:auto;max-height:calc(100dvh - 210px);background:#fff}' +
    '.sk-hint{margin:0;padding:8px 14px 0;font:400 12px Manrope,sans-serif;color:#8A8478;text-align:center}' +
    '.sk-bot{flex:0 0 auto;display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px 12px;border-top:1px solid #2A2722}' +
    '.sk-go{flex:1 1 160px;text-align:center;background:#C9A24A;color:#0E0D0B;padding:12px 14px;font:600 12px Manrope,sans-serif;letter-spacing:.14em;text-decoration:none;border:0;cursor:pointer}' +
    '.sk-go.alt{background:none;border:1px solid #C9A24A;color:#C9A24A}' +
    '@media (min-width:900px){.sk-box{max-width:min(100%,700px)}.sk-img{max-height:calc(100dvh - 230px)}}@media (prefers-reduced-motion:reduce){.sk,.sk-box{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el, img, title, go, last;
  function build() {
    el = document.createElement('div'); el.className = 'sk'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'skT');
    el.innerHTML = '<div class="sk-box"><div class="sk-top"><h2 id="skT"></h2><button type="button" class="sk-x" aria-label="Chiudi la scheda">×</button></div>' +
      '<div class="sk-body"><img class="sk-img" alt=""><p class="sk-hint">Foto e planimetria. Allarga con due dita per leggere le misure.</p></div>' +
      '<div class="sk-bot"><a class="sk-go" href="#">SIMULA IL PREZZO →</a><button type="button" class="sk-go alt">TORNA AL CATALOGO</button></div></div>';
    document.body.appendChild(el);
    img = el.querySelector('.sk-img'); title = el.querySelector('#skT'); go = el.querySelector('a.sk-go');
    el.addEventListener('click', function (e) { if (e.target === el || e.target.closest('.sk-x') || e.target.closest('button.alt')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.hidden) close(); });
  }
  function open(slug, opt) {
    if (!NOMI[slug]) return false;
    if (!el) build();
    opt = opt || {};
    last = document.activeElement;
    title.textContent = NOMI[slug];
    if (window.MDStat) MDStat('scheda-casa-' + slug, true);
    img.src = '/img/scheda-' + slug + '.webp';
    img.alt = 'Scheda del modello ' + NOMI[slug] + ': foto della casa e planimetria';
    go.onclick = null;
    if (typeof opt.simula === 'function') { go.href = '#'; go.onclick = function (e) { e.preventDefault(); close(); opt.simula(); }; }
    else go.href = opt.simula || '/case-in-legno?modello=' + slug + '#simulatore';
    el.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { el.classList.add('on'); el.querySelector('.sk-x').focus(); });
    return true;
  }
  function close() {
    el.classList.remove('on'); document.documentElement.style.overflow = '';
    setTimeout(function () { el.hidden = true; if (last && last.focus) last.focus(); }, 250);
  }
  window.MDScheda = { open: open, close: close };
})();
