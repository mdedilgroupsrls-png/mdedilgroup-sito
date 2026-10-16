/* Email protetta dai programmi che raccolgono indirizzi, avviso cookie e contatori anonimi, su tutte le pagine.
   L'email non è scritta nel codice della pagina: la ricompone qui il browser, solo per chi visita il sito. */
(function () {
  // indirizzo scritto al contrario e codificato: i programmi automatici che leggono il testo della pagina non lo trovano
  var E = 'bW9jLmxpYW1nQHNscnNwdW9yZ2xpZGVkbQ==';
  function mail() { return atob(E).split('').reverse().join(''); }
  function scrivi() {
    var m = mail();
    [].forEach.call(document.querySelectorAll('.js-mail'), function (el) {
      var a = document.createElement('a');
      a.href = 'mailto:' + m; a.textContent = m; a.style.color = 'inherit';
      el.textContent = ''; el.appendChild(a);
    });
  }

  // avviso cookie: il sito usa solo cookie tecnici; la scelta resta salvata in questo browser
  var KEY = 'mdCookie';
  function salvata() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function salva(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function banner() {
    if (salvata()) return;
    var css = '.ck{position:fixed;left:0;right:0;bottom:0;z-index:400;background:#171512;border-top:1px solid #C9A24A;color:#D8D2C6;font:400 14px/1.5 Manrope,system-ui,sans-serif;' +
      'padding:16px max(16px,env(safe-area-inset-right,0px)) calc(16px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));box-shadow:0 -8px 30px rgba(0,0,0,.5)}' +
      '.ck-in{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px}.ck p{margin:0;flex:1 1 420px}.ck a{color:#E2C373;text-decoration:underline}' +
      '.ck-b{display:flex;gap:10px;flex:0 0 auto}.ck button{font:600 12px Manrope,system-ui,sans-serif;letter-spacing:.12em;padding:12px 18px;cursor:pointer;border:1px solid #C9A24A}' +
      '.ck .si{background:#C9A24A;color:#0E0D0B}.ck .no{background:none;color:#C9A24A}.ck button:focus-visible{outline:2px solid #E2C373;outline-offset:2px}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.className = 'ck'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Avviso cookie');
    d.innerHTML = '<div class="ck-in"><p>Questo sito usa solo cookie tecnici, necessari al suo funzionamento. Non usiamo cookie di profilazione né pubblicità. La mappa di Google si carica solo se la apri. <a href="/privacy.html">Informativa privacy e cookie</a></p>' +
      '<div class="ck-b"><button type="button" class="no">RIFIUTO</button><button type="button" class="si">ACCETTO</button></div></div>';
    document.body.appendChild(d);
    d.querySelector('.si').onclick = function () { salva('si'); d.remove(); };
    d.querySelector('.no').onclick = function () { salva('no'); d.remove(); };
  }


  // contatori anonimi: si conta solo cosa succede (pagina vista, simulazione, tocco su WhatsApp…), mai chi lo fa
  var fatti = {};
  function stat(e, sempre) {
    if (!sempre && fatti[e]) return; fatti[e] = 1;
    try { fetch('/s?e=' + encodeURIComponent(e), { cache: 'no-store', credentials: 'omit', keepalive: true }).catch(function () {}); } catch (x) {}
  }
  window.MDStat = stat;
  function pagina() { var p = location.pathname.replace(/^\/|\.html$|\/$/g, ''); return p || 'home'; }
  function provenienza() {
    var r = ''; try { r = new URL(document.referrer).hostname; } catch (x) {}
    if (!r) return 'diretto';
    if (r === location.hostname || /mdedilgroup\.it$/.test(r)) return '';
    var noti = ['google', 'bing', 'instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'threads', 'whatsapp', 'aicole'];
    for (var i = 0; i < noti.length; i++) if (r.indexOf(noti[i]) >= 0) return noti[i];
    return 'altro';
  }
  function contatori() {
    stat('vista-' + pagina(), true);
    var giaQui = false; try { giaQui = sessionStorage.getItem('mdVisita'); sessionStorage.setItem('mdVisita', '1'); } catch (x) {}
    var p = provenienza(); if (!giaQui && p) stat('arrivo-' + p);
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a'); if (!a) return;
      var h = a.getAttribute('href') || '';
      if (a.id === 'waSim') stat('whatsapp-stima-infissi', true);
      else if (/wa\.me/.test(h)) stat('whatsapp-' + pagina(), true);
      else if (/^tel:/.test(h)) stat('chiama-' + pagina(), true);
      else if (/^mailto:/.test(h)) stat('email', true);
      else if (/g\.page\/r\//.test(h)) stat('recensione-google', true);
      else if (a.getAttribute('aria-label') && a.closest('footer')) stat('social-' + a.getAttribute('aria-label').toLowerCase().split(' ')[0], true);
    }, true);
    var sim = function (ev) { if (ev.target.closest && ev.target.closest('#simulatore, .sim, .models')) stat('simulazione-' + pagina()); };
    document.addEventListener('input', sim, true); document.addEventListener('change', sim, true);
    var f = document.querySelector('form[name="preventivo"]'); if (f) f.addEventListener('submit', function () { stat('modulo-preventivo-inviato', true); });
  }

  function avvia() { scrivi(); banner(); contatori(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
