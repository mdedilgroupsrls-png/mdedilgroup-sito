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

  // avviso cookie: cookie tecnici sempre; Google Analytics solo dopo ACCETTO. La scelta resta salvata in questo browser
  // (chiave nuova dal 20/10/2026: l'avviso è cambiato, quindi si richiede la scelta a tutti)
  var KEY = 'mdCookie2';
  var GA = 'G-QQ9YF9PYJ2';
  var gaAttivo = false;
  function analytics() {
    if (gaAttivo) return; gaAttivo = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', GA, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(s);
  }
  // stessi eventi dei contatori anonimi, con nomi fissi per Analytics (pagina e simulatore come parametri, mai dati personali)
  function gaEvento(e) {
    if (!gaAttivo) return;
    var m, nome, p = {};
    if (/^(vista|arrivo|richiesta|modulo-da)-/.test(e)) return; // Analytics conta già pagine e provenienza; tipo e pagina vanno con generate_lead
    if (e === 'modulo-preventivo-inviato') { nome = 'generate_lead'; p = { modulo: 'preventivo', tipo_richiesta: leggi('mdRichiesta') || 'modulo diretto', pagina_provenienza: leggi('mdDaPagina') || pagina() }; }
    else if ((m = /^stima-(whatsapp|pdf)-(.+)$/.exec(e))) { nome = 'stima_' + m[1]; p = { simulatore: m[2] }; }
    else if ((m = /^simulazione-(.+)$/.exec(e))) { nome = 'simulazione_iniziata'; p = { simulatore: m[1] }; }
    else if ((m = /^(whatsapp|chiama|vai-al-modulo)-(.+)$/.exec(e))) { nome = { whatsapp: 'clic_whatsapp', chiama: 'clic_telefono', 'vai-al-modulo': 'vai_al_modulo' }[m[1]]; p = { pagina: m[2] }; }
    else nome = e.replace(/-/g, '_').slice(0, 40);
    gtag('event', nome, p);
  }
  // dalla pagina privacy: "Cambia la scelta sui cookie" cancella la scelta e i cookie di Analytics
  function cambiaScelta() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim(); if (!/^_ga/.test(n)) return;
      ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) { document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d; });
    });
    location.reload();
  }
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
    d.innerHTML = '<div class="ck-in"><p>Usiamo cookie tecnici, necessari al sito. Solo se premi ACCETTO usiamo anche Google Analytics, per statistiche sulle visite: niente pubblicità né profilazione. La mappa di Google si carica solo se la apri. <a href="/privacy.html">Informativa privacy e cookie</a></p>' +
      '<div class="ck-b"><button type="button" class="no">RIFIUTO</button><button type="button" class="si">ACCETTO</button></div></div>';
    document.body.appendChild(d);
    d.querySelector('.si').onclick = function () { salva('si'); d.remove(); analytics(); };
    d.querySelector('.no').onclick = function () { salva('no'); d.remove(); };
  }


  // contatori anonimi: si conta solo cosa succede (pagina vista, simulazione, tocco su WhatsApp…), mai chi lo fa
  var fatti = {};
  function stat(e, sempre) {
    if (!sempre && fatti[e]) return; fatti[e] = 1;
    try { fetch('/s?e=' + encodeURIComponent(e), { cache: 'no-store', credentials: 'omit', keepalive: true }).catch(function () {}); } catch (x) {}
    try { gaEvento(e); } catch (x) {}
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
  // canale di arrivo della visita: annunci Google (gclid o utm), poi sito di provenienza; resta valido per tutta la visita
  function canale() {
    var q = new URLSearchParams(location.search), u = (q.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) return 'google-annunci';
    if (u) return u === 'google' && /cpc|ads|ppc/i.test(q.get('utm_medium') || '') ? 'google-annunci' : u;
    return provenienza();
  }
  function leggi(k) { try { return sessionStorage.getItem(k) || ''; } catch (x) { return ''; } }
  function scriviS(k, v) { try { sessionStorage.setItem(k, v); } catch (x) {} }
  // modulo contatti: campi nascosti con pagina, tipo di richiesta e canale (mai dati personali)
  var SERVIZIO = { 'ristrutturazioni-interni': 'Ristrutturazione interni', 'ristrutturazione-bagno-roma': 'Ristrutturazione interni', 'ristrutturazioni-esterni': 'Ristrutturazione esterni', 'infissi-serramenti': 'Infissi e serramenti', 'case-in-legno': 'Case in legno', 'interior-design': 'Progettazione', 'studio-tecnico': 'Progettazione' };
  function tipoRichiesta(a) { var t = (a.textContent || '').toLowerCase(); return /sopralluogo/.test(t) ? 'sopralluogo' : /progett/.test(t) ? 'progetto' : 'preventivo'; }
  function modulo() {
    var f = document.querySelector('form[name="preventivo"]'); if (!f) return;
    function metti(n, v) { var i = f.querySelector('input[name="' + n + '"]'); if (i && v) i.value = v; }
    function aggiorna() {
      var da = leggi('mdDaPagina') || pagina();
      metti('pagina-provenienza', da); metti('tipo-richiesta', leggi('mdRichiesta') || 'modulo diretto'); metti('canale-arrivo', leggi('mdCanale') || 'diretto');
      var sel = f.querySelector('select[name="intervento"]'); if (sel && SERVIZIO[da] && !f.dataset.scelto) sel.value = SERVIZIO[da];
    }
    var sel = f.querySelector('select[name="intervento"]'); if (sel) sel.addEventListener('change', function () { f.dataset.scelto = '1'; });
    aggiorna(); f.addEventListener('focusin', aggiorna);
    f.addEventListener('submit', function () {
      aggiorna();
      stat('modulo-preventivo-inviato', true);
      stat('richiesta-' + (leggi('mdRichiesta') || 'modulo-diretto'), true);
      stat('modulo-da-' + (leggi('mdDaPagina') || pagina()), true);
    });
  }
  function contatori() {
    stat('vista-' + pagina(), true);
    var giaQui = false; try { giaQui = sessionStorage.getItem('mdVisita'); sessionStorage.setItem('mdVisita', '1'); } catch (x) {}
    var p = canale(); if (!giaQui && p) stat('arrivo-' + p);
    if (!leggi('mdCanale') && p) scriviS('mdCanale', p);
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a'); if (!a) return;
      var h = a.getAttribute('href') || '';
      if (/(^|\/)#contatti$/.test(h)) { scriviS('mdDaPagina', pagina()); scriviS('mdRichiesta', tipoRichiesta(a)); stat('vai-al-modulo-' + pagina(), true); }
      if (a.id === 'waSim') stat('whatsapp-stima-infissi', true);
      else if (/wa\.me/.test(h)) stat('whatsapp-' + pagina(), true);
      else if (/^tel:/.test(h)) stat('chiama-' + pagina(), true);
      else if (/^mailto:/.test(h)) stat('email', true);
      else if (/g\.page\/r\//.test(h)) stat('recensione-google', true);
      else if (a.getAttribute('aria-label') && a.closest('footer')) stat('social-' + a.getAttribute('aria-label').toLowerCase().split(' ')[0], true);
    }, true);
    var sim = function (ev) { if (ev.target.closest && ev.target.closest('#simulatore, .sim, .models')) stat('simulazione-' + pagina()); };
    document.addEventListener('input', sim, true); document.addEventListener('change', sim, true);
    modulo();
  }

  function avvia() {
    if (salvata() === 'si') analytics();
    scrivi(); banner(); contatori();
    var b = document.getElementById('ckCambia'); if (b) b.onclick = cambiaScelta;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
