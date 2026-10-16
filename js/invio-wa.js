/* Invio della simulazione su WhatsApp con i dati del cliente (simulatori infissi e case in legno).
   Il cliente scrive nome e cognome, telefono e indirizzo: finiscono solo nel messaggio WhatsApp
   che manda lui, il sito non li salva. Uso: MDInvio({ btn: 'id del pulsante WhatsApp', ... }). */
(function () {
  var CSS = '.mdi{display:flex;flex-direction:column;gap:12px;margin:18px 0 14px;padding-top:18px;border-top:1px solid #2A2722;text-align:left}' +
    '.mdi .t{margin:0;font-family:Urbanist,sans-serif;font-size:19px;font-weight:600;color:#F3EFE7}.mdi .s{margin:0;font-size:13px;line-height:1.5;color:#8A8478}' +
    '.mdi label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#D8D2C6}' +
    '.mdi input{width:100%;box-sizing:border-box;background:#0E0D0B;border:1px solid #3A362F;color:#F3EFE7;padding:12px 14px;font:inherit;font-size:16px}' +
    '.mdi input:focus{outline:2px solid #C9A24A;outline-offset:1px}.mdi input.no{border-color:#E07A5F}' +
    '.mdi .err{margin:0;font-size:13px;color:#F0A58F}' +
    '.mdi-ok{margin:12px 0 0;padding:12px 14px;border:1px solid #3d6b4a;background:#13221a;font-size:13px;line-height:1.5;color:#D8EAD9;text-align:left}' +
    '.mdi-alt{margin:14px 0 0;font-size:13px;line-height:1.5;color:#D8D2C6;text-align:left}.mdi-alt a{color:#E2C373;text-decoration:underline}' +
    '.mdi-pr{margin:10px 0 0;font-size:12px;line-height:1.5;color:#8A8478;text-align:left}.mdi-pr a{color:#8A8478;text-decoration:underline}';

  window.MDInvio = function (o) {
    var btn = document.getElementById(o.btn);
    if (!btn) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement('div'); box.className = 'mdi';
    box.innerHTML = '<p class="t">' + o.titolo + '</p><p class="s">' + o.sotto + '</p>' +
      '<label>Nome e cognome<input data-c="nome" type="text" autocomplete="name" maxlength="80"></label>' +
      '<label>Telefono<input data-c="tel" type="tel" autocomplete="tel" inputmode="tel" maxlength="30"></label>' +
      '<label>' + o.indirizzo + '<input data-c="ind" type="text" autocomplete="street-address" maxlength="160" placeholder="' + (o.esempio || 'Via, numero civico, città') + '"></label>' +
      '<p class="err" role="alert" hidden></p>';
    btn.parentNode.insertBefore(box, btn);
    btn.textContent = o.pulsante;
    var ok = document.createElement('div'); ok.className = 'mdi-ok'; ok.setAttribute('role', 'status'); ok.hidden = true;
    ok.innerHTML = '<b>Ci siamo quasi!</b> Si è aperto WhatsApp con il messaggio pronto: premi <b>Invia</b>. ' + o.dopo;
    var alt = document.createElement('p'); alt.className = 'mdi-alt';
    alt.innerHTML = 'Non usi WhatsApp? Chiamaci al <a href="tel:+393282145266">328 214 5266</a> oppure scrivici dal <a href="/#contatti">modulo contatti</a>.';
    var pr = document.createElement('p'); pr.className = 'mdi-pr';
    pr.innerHTML = 'I tuoi dati arrivano solo a noi, nel messaggio WhatsApp che invii tu, e servono per ricontattarti (<a href="/privacy.html">informativa privacy</a>).';
    // il pulsante secondario (vecchio "richiedi") viene sostituito dalle alternative
    var vecchio = o.togli ? document.querySelector(o.togli) : null;
    var dopo = vecchio || btn;
    dopo.parentNode.insertBefore(pr, dopo.nextSibling);
    dopo.parentNode.insertBefore(alt, dopo.nextSibling);
    btn.parentNode.insertBefore(ok, btn.nextSibling);
    if (vecchio) vecchio.remove();

    btn.addEventListener('click', function (e) {
      var v = {}, manca = [];
      [['nome', 'nome e cognome'], ['tel', 'telefono'], ['ind', o.indirizzo.toLowerCase()]].forEach(function (c) {
        var el = box.querySelector('[data-c="' + c[0] + '"]'); v[c[0]] = el.value.trim();
        var buono = c[0] === 'tel' ? /\d{6,}/.test(v.tel.replace(/\D/g, '')) : v[c[0]].length > 1;
        el.classList.toggle('no', !buono); if (!buono) manca.push(c[1]);
      });
      var prima = o.pronta ? o.pronta() : '';
      if (prima) manca.unshift(prima);
      var err = box.querySelector('.err');
      if (manca.length) {
        e.preventDefault(); e.stopImmediatePropagation();
        err.textContent = 'Per inviare la simulazione indica: ' + manca.join(', ') + '.'; err.hidden = false;
        var f = box.querySelector('input.no'); if (f) f.focus();
        return;
      }
      err.hidden = true;
      var testo = ''; try { testo = new URL(btn.href).searchParams.get('text') || ''; } catch (x) {}
      testo = testo.split('\n\nNome e cognome:')[0];
      btn.href = 'https://wa.me/393282145266?text=' + encodeURIComponent(testo + '\n\nNome e cognome: ' + v.nome + '\nTelefono: ' + v.tel + '\n' + o.indirizzo + ': ' + v.ind + '\n\n' + o.richiesta);
      ok.hidden = false;
    }, true);
  };
})();
