/* Motore comune dei simulatori a voci (ristrutturazioni interni, ristrutturazioni esterni e facciate).
   Ogni pagina chiama MDSimulatore({...}) con le sue voci e i suoi prezzi (js/ristrutturazione.js, js/esterni.js).
   - Ogni paragrafo (es. "Demolizioni e rimozioni") ha Sì / No: le voci compaiono solo con Sì e solo allora si calcolano.
   - Voci "si": Sì / No a corpo. Voci a quantità: m², m, n°. Voci "scelta": alternative, se ne sceglie una sola
     (es. il tipo di cappotto), così non si possono sommare due lavorazioni che si escludono.
   - Sul sito non si mostrano i prezzi unitari: solo l'importo delle voci compilate e il totale.
   La pagina deve avere: #simForm, #rTot, #rMqTot, #rRiep, #rNome, #rTel, #rInd, #rErr, #rWa, #rOk, #rPdf, #rPdfH. */
(function () {
  var num = function (v) { var x = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isNaN(x) || x < 0 ? 0 : x; };
  var eur = function (v) { return '€ ' + Math.round(v).toLocaleString('it-IT'); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var virgola = function (v) { return String(v).replace('.', ','); };
  var $ = function (id) { return document.getElementById(id); };

  window.MDSimulatore = function (cfg) {
    var form = $('simForm');
    if (!form) return;
    var root = form.parentNode;
    var st = { mq: '', dom: {}, open: {}, q: {}, area: {}, sel: {} };
    (cfg.domande || []).forEach(function (d) { st.dom[d.k] = d.def; });
    var ultimo = null, segnato = false;

    function ctx() { return { mq: num(st.mq), dom: st.dom, q: st.q, area: st.area, sel: st.sel, num: num }; }
    function visibile(x, c) { return !x.se || x.se(c); }
    function opzioneScelta(it, c) {
      var v = st.sel[it.id]; if (!v) return null;
      for (var i = 0; i < it.opz.length; i++) if (it.opz[i].v === v && visibile(it.opz[i], c)) return it.opz[i];
      return null;
    }
    // superficie del paragrafo; se è vuota e il paragrafo lo prevede, vale la superficie indicata in alto
    function areaSez(s) { return num(st.area[s.id]) || (s.area && s.area.default === 'mq' ? num(st.mq) : 0); }
    function qtaScelta(it, s) { return it.q === 'area' ? areaSez(s) : num(st.q[it.id]); }

    // importo di una voce (0 se il paragrafo è chiuso, la voce non c'entra o non è compilata)
    function importo(it, s, c) {
      if (!st.open[s.id] || !visibile(it, c)) return 0;
      if (it.tipo === 'nota') return 0;
      if (it.tipo === 'si') return st.q[it.id] === 'si' ? (it.f ? it.f(c) : it.p) : 0;
      if (it.tipo === 'scelta') {
        var o = opzioneScelta(it, c); if (!o) return 0;
        var n = qtaScelta(it, s); if (!n && !o.fisso) return 0;
        return o.f ? o.f(n, c) : o.p * n;
      }
      var n2 = num(st.q[it.id]); if (!n2) return 0;
      return it.f ? it.f(n2, c, areaSez(s)) : n2 * it.p;
    }
    function rigaPdf(it, s, c, v) {
      if (it.tipo === 'si') return [it.d, it.qPdf ? it.qPdf(c) : 'a corpo', v];
      if (it.tipo === 'scelta') {
        var o = opzioneScelta(it, c), um = o.um || it.um, n = qtaScelta(it, s);
        return [it.d + ': ' + o.d, n ? virgola(n) + ' ' + um : '', v];
      }
      var qq = virgola(st.q[it.id]);
      return [it.d + (it.dPdf ? it.dPdf(c) : ''), it.um === 'n°' ? qq : qq + ' ' + it.um.replace(/^n° /, ''), v];
    }

    function pills(attr, scelte, attuale) {
      return '<div class="pills" role="group">' + scelte.map(function (x) {
        return '<button type="button" class="pill" ' + attr + ' data-v="' + x[0] + '" aria-pressed="' + (attuale === x[0]) + '">' + x[1] + '</button>';
      }).join('') + '</div>';
    }
    // titolo della voce: passando sopra (o toccando) si apre la descrizione
    function titolo(it) {
      return '<div class="vd"><button type="button" class="vt" aria-expanded="false" aria-controls="x-' + it.id + '">' + esc(it.d) +
        (it.x ? ' <span class="vi-i" aria-hidden="true">i</span>' : '') + '</button>' + (it.x ? '<div class="vx" id="x-' + it.id + '" role="tooltip">' + esc(it.x) + '</div>' : '') + '</div>';
    }
    function bottoneUsa(it, s) {
      if (!it.mq) return '';
      return '<button type="button" class="usaMq" data-usa="' + it.id + '" data-sez="' + s.id + '">' + (s.area ? '= ' + (s.area.breve || 'superficie') : '= superficie') + '</button>';
    }

    function disegna() {
      var c = ctx(), h = '<fieldset class="grp"><legend class="lg"><span class="nr">01</span>' + esc(cfg.testa || 'L’immobile') + '</legend>';
      if (cfg.superficie) h += '<label class="fld">' + esc(cfg.superficie.label) + '<input class="inp" id="rMq" type="number" inputmode="decimal" min="1" placeholder="' + esc(cfg.superficie.es || '') + '" value="' + esc(st.mq) + '">' + (cfg.superficie.hint ? '<span class="hint">' + esc(cfg.superficie.hint) + '</span>' : '') + '</label>';
      (cfg.domande || []).forEach(function (d) { h += '<div class="fld">' + esc(d.t) + pills('data-dom="' + d.k + '"', d.opz, st.dom[d.k]) + '</div>'; });
      h += '</fieldset>';
      cfg.sezioni.forEach(function (s, i) {
        var aperto = !!st.open[s.id];
        h += '<fieldset class="grp' + (aperto ? '' : ' chiuso') + '" data-sezione="' + s.id + '"><legend class="lg"><span class="nr">' + String(i + 2).padStart(2, '0') + '</span>' + esc(s.t) + '</legend>' +
          '<div class="sez-q"><span>' + esc(s.domanda || 'Ti serve questa lavorazione?') + '</span>' + pills('data-apri="' + s.id + '"', [['si', 'Sì'], ['no', 'No']], aperto ? 'si' : 'no') + '</div>' +
          '<div class="sez-c"' + (aperto ? '' : ' hidden') + '>';
        if (s.s) h += '<p class="hint" style="margin:0">' + esc(s.s) + '</p>';
        if (s.area) h += '<label class="area">' + esc(s.area.label) + '<input class="inp" type="number" inputmode="decimal" min="0" placeholder="' + esc(s.area.default === 'mq' && st.mq ? st.mq : '0') + '" data-area="' + s.id + '" value="' + esc(st.area[s.id] || '') + '"></label>' + (s.area.hint ? '<p class="hint" style="margin:-12px 0 0">' + esc(s.area.hint) + '</p>' : '');
        s.v.forEach(function (it) {
          if (!visibile(it, c)) return;
          if (it.tipo === 'nota') { h += '<p class="nota">' + esc(it.d) + '</p>'; return; }
          if (it.tipo === 'scelta') {
            var o = opzioneScelta(it, c);
            h += '<div class="scelta" data-id="' + it.id + '">' + titolo(it) + '<div class="opz" role="radiogroup" aria-label="' + esc(it.d) + '">';
            [{ v: '', d: it.nessuno || 'Nessuna' }].concat(it.opz).forEach(function (op) {
              if (!visibile(op, c)) return;
              var on = op.v ? !!(o && o.v === op.v) : !o;
              h += '<button type="button" class="op" role="radio" aria-checked="' + on + '" data-sc="' + it.id + '" data-v="' + op.v + '"><i></i><span>' + esc(op.d) + (op.x ? '<small>' + esc(op.x) + '</small>' : '') + '</span></button>';
            });
            h += '</div><div class="riga">';
            if (o && it.q !== 'area' && !o.fisso) h += '<span class="vq"><label class="qt"><input class="inp" type="number" inputmode="decimal" min="0" placeholder="0" data-q="' + it.id + '" value="' + esc(st.q[it.id] || '') + '" aria-label="' + esc(it.d) + '"><span>' + esc(o.um || it.um) + '</span></label>' + bottoneUsa(it, s) + '</span>';
            else if (o && it.q === 'area') h += '<span class="hint">' + esc(it.hintArea || 'Si calcola sui m² indicati sopra.') + '</span>';
            else h += '<span></span>';
            h += '<b class="vi" data-imp="' + it.id + '"></b></div></div>';
            return;
          }
          h += '<div class="voce" data-id="' + it.id + '">' + titolo(it) + '<div class="vq">';
          if (it.tipo === 'si') h += pills('data-k="' + it.id + '"', [['si', 'Sì'], ['', 'No']], st.q[it.id] || '');
          else {
            h += '<label class="qt"><input class="inp" type="number" inputmode="decimal" min="0" placeholder="0" data-q="' + it.id + '" value="' + esc(st.q[it.id] || '') + '" aria-label="' + esc(it.d) + ' (' + esc(it.um) + ')"><span>' + esc(it.um) + '</span></label>' + bottoneUsa(it, s);
            if (it.extra) h += '<label class="qt"><input class="inp" type="number" inputmode="decimal" min="0" placeholder="' + esc(it.extra.ph || '') + '" data-q="' + it.extra.id + '" value="' + esc(st.q[it.extra.id] || '') + '" aria-label="' + esc(it.extra.um) + '"><span>' + esc(it.extra.um) + '</span></label>';
          }
          h += '</div><b class="vi" data-imp="' + it.id + '"></b></div>';
        });
        h += '</div></fieldset>';
      });
      h += '<a class="rBar" href="#rRiepTop">La tua stima <b id="rBarTot">€ 0</b> ' + esc(cfg.iva) + ' <span aria-hidden="true">↓</span></a>';
      form.innerHTML = h;
      calcola();
    }

    function calcola() {
      var c = ctx(), riep = [], pdfLav = [], pdfFuori = [], lavori = 0, fuori = 0;
      cfg.sezioni.forEach(function (s) {
        var sub = 0, righe = [];
        s.v.forEach(function (it) {
          var v = importo(it, s, c), el = root.querySelector('[data-imp="' + it.id + '"]');
          if (el) el.textContent = v > 0 ? eur(v) : '';
          if (v > 0) { sub += v; righe.push(rigaPdf(it, s, c, v)); }
        });
        if (!sub) return;
        if (s.fuoriLavori) { fuori += sub; pdfFuori.push({ t: s.t, righe: righe }); }
        else { lavori += sub; riep.push([s.t, sub]); pdfLav.push({ t: s.t, righe: righe }); }
      });
      c.lavori = lavori;
      var extra = (cfg.extra ? cfg.extra(c) : []).filter(function (x) { return x.v > 0; });
      var tot = lavori + fuori;
      extra.forEach(function (x) { tot += x.v; riep.push([x.label, x.v]); });
      pdfFuori.forEach(function (x) { riep.push([x.t, x.righe.reduce(function (a, r) { return a + r[2]; }, 0)]); });
      $('rRiep').innerHTML = riep.length ? riep.map(function (r) { return '<li><span>' + esc(r[0]) + '</span><span class="e">' + eur(r[1]) + '</span></li>'; }).join('')
        : '<li><span>' + esc(cfg.vuoto || 'Scegli le lavorazioni che ti servono') + '</span></li>';
      $('rTot').textContent = eur(tot);
      if ($('rBarTot')) $('rBarTot').textContent = eur(tot);
      if ($('rMqTot')) $('rMqTot').textContent = c.mq > 0 && tot > 0 && cfg.perMq ? 'circa ' + eur(tot / c.mq) + ' ' + cfg.perMq : '';
      var sezPdf = pdfLav.concat(extra.map(function (x) { return { t: x.pdfT || x.label, righe: [[x.pdfD || x.label, '', x.v]] }; })).concat(pdfFuori);
      ultimo = { tot: tot, sez: sezPdf, c: c };
    }

    // dati del cliente: nome, telefono e indirizzo, più almeno una lavorazione (e la superficie, se richiesta)
    function controlla(azione) {
      var mancano = [], val = {};
      [['rNome', 'nome e cognome'], ['rTel', 'telefono'], ['rInd', (cfg.indirizzo || 'indirizzo dell’immobile').toLowerCase()]].forEach(function (x) {
        var el = $(x[0]); val[x[0]] = el.value.trim();
        var ok = x[0] === 'rTel' ? /\d{6,}/.test(val[x[0]].replace(/\D/g, '')) : val[x[0]].length > 1;
        el.classList.toggle('no', !ok); if (!ok) mancano.push(x[1]);
      });
      var err = $('rErr');
      if ((cfg.superficie && cfg.superficie.obbligatoria && num(st.mq) <= 0) || !ultimo || !(ultimo.tot > 0)) mancano.unshift(cfg.manca || 'almeno una lavorazione');
      if (mancano.length) {
        err.textContent = 'Per ' + azione + ' indica: ' + mancano.join(', ') + '.'; err.hidden = false;
        var primo = root.querySelector('.dati .inp.no'); if (primo) primo.focus();
        return null;
      }
      err.hidden = true;
      return val;
    }
    // 1 · invio su WhatsApp: messaggio corto, il dettaglio è nel PDF (pulsante 2)
    $('rWa').addEventListener('click', function (e) {
      var val = controlla('inviare la simulazione');
      if (!val) { e.preventDefault(); e.stopImmediatePropagation(); return; }
      var mq = num(st.mq);
      this.href = 'https://wa.me/393282145266?text=' + encodeURIComponent('Buongiorno, ho fatto la simulazione ' + cfg.oggetto + ' sul vostro sito.' +
        '\nTotale stimato: ' + eur(ultimo.tot) + ' ' + cfg.iva + (mq ? ' (' + virgola(mq) + ' m²)' : '') + '. Vi invio qui il preventivo in PDF.' +
        '\n\nNome e cognome: ' + val.rNome + '\nTelefono: ' + val.rTel + '\n' + (cfg.indirizzo || 'Indirizzo dell’immobile') + ': ' + val.rInd + '\n\nVorrei richiedere un sopralluogo: potete ricontattarmi?');
      $('rOk').hidden = false;
    }, true);
    // 2 · preventivo in PDF intestato MD Edil Group (js/preventivo-pdf.js)
    var bPdf = $('rPdf'), hPdf = $('rPdfH');
    if (hPdf) hPdf.textContent = window.MDPdf && window.MDPdf.condivide()
      ? 'Si apre la condivisione: scegli WhatsApp e la chat di MD Edil Group.'
      : 'Il PDF si scarica sul computer: trascinalo nella chat di WhatsApp con MD Edil Group.';
    if (bPdf) bPdf.addEventListener('click', function () {
      var val = controlla('creare il preventivo in PDF');
      if (!val || !window.MDPdf) return;
      var info = [];
      if (cfg.superficie && num(st.mq)) info.push([cfg.superficie.pdf || cfg.superficie.label, virgola(num(st.mq)) + ' m²']);
      (cfg.domande || []).forEach(function (d) { d.opz.forEach(function (o) { if (o[0] === st.dom[d.k]) info.push([d.pdf || d.t, o[1]]); }); });
      var t = bPdf.textContent; bPdf.disabled = true; bPdf.textContent = 'PREPARAZIONE DEL PDF…';
      var dati = { tipo: cfg.pdf.tipo, cliente: { nome: val.rNome, tel: val.rTel, ind: val.rInd, indLabel: cfg.indirizzo }, info: info.length ? info : [['Lavori', cfg.pdf.tipo]],
        sezioni: ultimo.sez, totale: ultimo.tot, iva: cfg.pdf.iva, note: cfg.pdf.note, file: val.rNome,
        avviso: 'Stima indicativa, non vincolante. Il preventivo definitivo si ottiene solo dopo il sopralluogo. Le lavorazioni non presenti nel simulatore saranno quotate a parte.' };
      if (cfg.pdf.pagamento) dati.pagamento = cfg.pdf.pagamento();
      window.MDPdf.crea(dati).then(function (p) { return window.MDPdf.consegna(p); })
        .catch(function () { $('rErr').textContent = 'Non è stato possibile creare il PDF: riprova o inviaci la simulazione su WhatsApp.'; $('rErr').hidden = false; })
        .then(function () { bPdf.disabled = false; bPdf.textContent = t; });
    });

    function usato() { if (!segnato && window.MDStat) { segnato = true; window.MDStat('simulazione-' + cfg.id); } }
    function trova(id) { for (var i = 0; i < cfg.sezioni.length; i++) for (var j = 0; j < cfg.sezioni[i].v.length; j++) if (cfg.sezioni[i].v[j].id === id) return cfg.sezioni[i].v[j]; return null; }

    root.addEventListener('input', function (e) {
      var t = e.target;
      if (t.id === 'rMq') { st.mq = t.value; root.querySelectorAll('[data-area]').forEach(function (a) { var s0 = cfg.sezioni.filter(function (x) { return x.id === a.dataset.area; })[0]; if (s0 && s0.area.default === 'mq') a.placeholder = t.value || '0'; }); }
      else if (t.dataset.q) st.q[t.dataset.q] = t.value;
      else if (t.dataset.area) st.area[t.dataset.area] = t.value;
      else return;
      usato(); calcola();
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      var aperti = root.querySelectorAll('.vt[aria-expanded="true"]');
      for (var k = 0; k < aperti.length; k++) if (aperti[k] !== b) aperti[k].setAttribute('aria-expanded', 'false');
      if (!b || !form.contains(b)) return;
      if (b.classList.contains('vt')) { b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')); return; }
      var d = b.dataset, ridisegna = false;
      if (d.apri) { st.open[d.apri] = d.v === 'si'; ridisegna = true; }
      else if (d.dom) { st.dom[d.dom] = d.v; ridisegna = true; }
      else if (d.sc) { st.sel[d.sc] = d.v; ridisegna = true; }
      else if (d.k) {
        st.q[d.k] = d.v; b.parentNode.querySelectorAll('.pill').forEach(function (p) { p.setAttribute('aria-pressed', String(p === b)); });
        var ik = trova(d.k); if (ik && ik.ridisegna) ridisegna = true; // la risposta mostra o nasconde altre voci
      }
      else if (d.usa) {
        var it = trova(d.usa), s = null;
        cfg.sezioni.forEach(function (x) { if (x.id === d.sez) s = x; });
        var val = s && s.area ? (st.area[s.id] || (s.area.default === 'mq' ? st.mq : '')) : st.mq;
        if (num(val) > 0) { st.q[d.usa] = val; var inp = root.querySelector('[data-q="' + d.usa + '"]'); if (inp) inp.value = val; }
        else { var m = s && s.area ? root.querySelector('[data-area="' + s.id + '"]') : $('rMq'); if (m) m.focus(); return; }
        if (!it) return;
      } else return;
      usato();
      if (ridisegna) {
        var y = b.getBoundingClientRect().top, sel = d.apri ? '[data-apri="' + d.apri + '"]' : d.sc ? '[data-sc="' + d.sc + '"][data-v="' + d.v + '"]' : d.dom ? '[data-dom="' + d.dom + '"][data-v="' + d.v + '"]' : d.k ? '[data-k="' + d.k + '"][data-v="' + d.v + '"]' : null;
        disegna();
        // il pulsante toccato resta nello stesso punto dello schermo
        var nb = sel && root.querySelector(sel);
        if (nb) { window.scrollBy(0, nb.getBoundingClientRect().top - y); try { nb.focus({ preventScroll: true }); } catch (x) {} }
      } else calcola();
    });
    disegna();
  };
})();
