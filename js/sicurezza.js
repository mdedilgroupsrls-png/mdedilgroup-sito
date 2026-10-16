/* Email protetta dai programmi che raccolgono indirizzi e avviso cookie, su tutte le pagine.
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

  function avvia() { scrivi(); banner(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
