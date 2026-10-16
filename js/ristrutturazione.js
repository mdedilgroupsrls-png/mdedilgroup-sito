/* Simulatore della ristrutturazione di interni (pagina /ristrutturazioni-interni).
   Prezzi dal listino MD Edil Group del 16/10/2026, IVA esclusa (vedi progetto/listino-prezzi.md).
   Il cliente indica la quantità di ogni voce che gli serve: le voci lasciate vuote non si calcolano.
   Sul sito non si mostrano i prezzi unitari, solo l'importo di ogni voce. */
(function () {
  // tipo: 'q' = quantità (m², m, n°); 'si' = a corpo (sì / no); mq: true = pulsante "usa la superficie"
  // a70: prezzo a corpo per immobili fino a 70 m² (oltre si aumenta in proporzione ai m²)
  var SEZ = [
    { t: 'Demolizioni e rimozioni', v: [
      { id: 'pavCer', d: 'Pavimento in ceramica: rimozione e discarica (massetto escluso)', um: 'm²', p: 17.5, mq: true },
      { id: 'pavMas', d: 'Pavimento in ceramica: rimozione con massetto fino a 5 cm e discarica', um: 'm²', p: 33.5, mq: true },
      { id: 'demCtr', d: 'Controsoffitto in cartongesso: demolizione e discarica', um: 'm²', p: 25.5 },
      { id: 'demTra', d: 'Tramezzi da 4,5 a 10 cm di spessore: demolizione', um: 'm²', p: 25.15, h: 'Lunghezza × altezza della parete: 4 m × 2,7 m ≈ 11 m²' },
      { id: 'demPor', d: 'Porte interne: smontaggio e smaltimento in discarica', um: 'n°', p: 93 },
      { id: 'demRad', d: 'Termosifoni: rimozione', um: 'n°', p: 55.7 },
      { id: 'demZoc', d: 'Battiscopa in legno o ceramica: rimozione', um: 'm', p: 5.5 },
      { id: 'demPar', d: 'Parquet: demolizione e discarica', um: 'm²', p: 26.7, mq: true },
      { id: 'protez', d: 'Protezione dei pavimenti con cartone ondulato', um: 'm²', p: 5.25, mq: true },
      { id: 'disEl', d: 'Impianto elettrico esistente: smontaggio e demolizione', um: 'a corpo', p: 750, tipo: 'si', a70: true },
      { id: 'disId', d: 'Impianto idrico esistente: smontaggio e demolizione', um: 'a corpo', p: 750, tipo: 'si', a70: true }
    ] },
    { t: 'Bagni completi', v: [
      { id: 'bagno', d: 'Bagno completo fino a 5 m²', um: 'n° bagni', p: 6500,
        h: 'Comprende: smontaggio dei sanitari, demolizione di pavimenti, rivestimenti e sottofondi con smaltimento, nuovo massetto, nuovi impianti idrico ed elettrico, impermeabilizzazione della doccia, posa di pavimento e rivestimento in gres, rasatura e pittura, montaggio di sanitari, rubinetteria, piatto e box doccia, prove, certificazioni e pulizia. Esclusa la fornitura di gres, sanitari, rubinetteria, piatto e box doccia, accessori. Le lavorazioni del bagno non vanno indicate di nuovo nelle altre voci.' }
    ] },
    { t: 'Opere di muratura', v: [
      { id: 'tramez', d: 'Nuovi tramezzi divisori', um: 'm²', p: 87.7 },
      { id: 'contel', d: 'Controtelaio per porta scorrevole a scomparsa: fornitura e posa', um: 'n°', p: 370 },
      { id: 'intona', d: 'Intonaco grezzo', um: 'm²', p: 26.5 },
      { id: 'massNu', d: 'Nuovo massetto tradizionale sabbia e cemento', um: 'm²', p: 34.5, mq: true }
    ] },
    { t: 'Impianto di aria condizionata', v: [
      { id: 'clima', d: 'Predisposizione e installazione per un motore esterno e due split', um: 'n° impianti', p: 1170,
        h: 'Tubazioni e scarico della condensa, assistenza muraria inclusa. Fornitura dei condizionatori esclusa.' }
    ] },
    { t: 'Impianto elettrico', v: [
      { id: 'punti', d: 'Punti elettrici (punto luce o presa a parete, pavimento o soffitto)', um: 'n° punti', p: 95,
        h: 'Frutti tipo BTicino e assistenza muraria inclusi. Per un appartamento si contano circa 1 punto per m².' },
      { id: 'quadro', d: 'Nuovo quadro elettrico', um: 'a corpo', p: 750, tipo: 'si', quadro: true }
    ] },
    { t: 'Impianto idrico e riscaldamento', v: [
      { id: 'centr', d: 'Centralina di distribuzione: predisposizione, installazione e collegamento alla caldaia', um: 'n°', p: 679 },
      { id: 'radiat', d: 'Tubazioni multistrato per termosifone, scaldasalviette o termoarredo, con posa del nuovo termosifone', um: 'n°', p: 475, h: 'Assistenza muraria inclusa. Fornitura del termosifone esclusa.' },
      { id: 'caldaia', d: 'Caldaia a gas: installazione', um: 'n°', p: 770 },
      { id: 'pAcqua', d: 'Punto acqua completo di carico e scarico', um: 'n°', p: 435, h: 'Lavatrice, lavello, lavabo… Assistenza muraria inclusa.' }
    ] },
    { t: 'Impianto gas', v: [
      { id: 'gasCuc', d: 'Tubazione del gas dal contatore alla cucina, con valvola di intercettazione a norma', um: 'n°', p: 750 },
      { id: 'gasCal', d: 'Tubazione del gas per la caldaia', um: 'a corpo', p: 550, tipo: 'si' }
    ] },
    { t: 'Pavimenti, rivestimenti e porte', v: [
      { id: 'posPav', d: 'Posa di pavimento in ceramica, formato fino a 60 × 60 cm', um: 'm²', p: 44.5, mq: true },
      { id: 'posRiv', d: 'Posa di rivestimento in ceramica a parete, formato fino a 60 × 60 cm', um: 'm²', p: 47.5 },
      { id: 'posZoc', d: 'Battiscopa in legno o ceramica: posa', um: 'm', p: 8 },
      { id: 'posPar', d: 'Posa di pavimento in parquet', um: 'm²', p: 55, mq: true },
      { id: 'porBat', d: 'Porta a battente: posa', um: 'n°', p: 130 },
      { id: 'porSco', d: 'Porta scorrevole: posa', um: 'n°', p: 230 }
    ] },
    { t: 'Opere in cartongesso', v: [
      { id: 'ctrSof', d: 'Controsoffitto in cartongesso (struttura metallica, lastre da 13 mm, giunti stuccati)', um: 'm²', p: 55 },
      { id: 'divCar', d: 'Parete divisoria in cartongesso, spessore 10 cm', um: 'm²', p: 75 },
      { id: 'velette', d: 'Velette e mensole per illuminazione a LED', um: 'm', p: 85 }
    ] },
    { t: 'Tinteggiature', v: [
      { id: 'raschi', d: 'Raschiatura delle vecchie pitture', um: 'm²', p: 3 },
      { id: 'rasat', d: 'Rasatura di pareti e soffitti con stucco in pasta', um: 'm²', p: 27 },
      { id: 'levig', d: 'Levigatura e fondo isolante acrilico', um: 'm²', p: 5 },
      { id: 'pitChi', d: 'Pittura lavabile in tinte chiare', um: 'm²', p: 13.5 },
      { id: 'pitInt', d: 'Pittura lavabile in tinte intense', um: 'm²', p: 17.5 }
    ], h: 'Si contano i m² di pareti e soffitti: in una stanza sono circa 3 volte la superficie del pavimento.' },
    { t: 'Progetto e pratiche', v: [
      { id: 'proget', d: 'Progetto, tavole esecutive e pratiche edilizie (CILA / SCIA)', um: 'a corpo', p: 40, tipo: 'si', perMq: true }
    ] }
  ];
  var ONERI = { tiro: 1400, sicurezza: 1100, pulizia: 6, centro: 0.05 };

  var form = document.getElementById('simForm');
  if (!form) return;
  var root = form.parentNode;
  var stato = { mq: '', piano: 'basso', centro: 'no' };
  var q = {};

  var num = function (v) { var x = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isNaN(x) || x < 0 ? 0 : x; };
  var eur = function (v) { return '€ ' + Math.round(v).toLocaleString('it-IT'); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // voci a corpo "fino a 70 m²": oltre i 70 m² il prezzo cresce in proporzione alla superficie
  var x70 = function (mq) { return mq > 70 ? mq / 70 : 1; };
  // quadro elettrico: 750 € fino a 70 m², 1.000 € fino a 100 m², poi +250 € ogni 20 m²
  var quadro = function (mq) { return mq <= 70 ? 750 : mq <= 100 ? 1000 : 1000 + Math.ceil((mq - 100) / 20) * 250; };

  function importo(it, mq) {
    var val = q[it.id];
    if (it.tipo === 'si') {
      if (val !== 'si') return 0;
      if (it.quadro) return quadro(mq);
      if (it.perMq) return it.p * mq;
      return it.a70 ? it.p * x70(mq) : it.p;
    }
    return num(val) * it.p;
  }

  function pills(nome, scelte, attuale) {
    return '<div class="pills" role="group">' + scelte.map(function (s) {
      return '<button type="button" class="pill" data-k="' + nome + '" data-v="' + s[0] + '" aria-pressed="' + (attuale === s[0]) + '">' + s[1] + '</button>';
    }).join('') + '</div>';
  }

  function disegna() {
    var h = '<fieldset class="grp"><legend class="lg"><span class="nr">01</span>L’immobile</legend>' +
      '<label class="fld">Superficie interna (m²)<input class="inp" id="rMq" type="number" inputmode="decimal" min="1" placeholder="es. 70" value="' + esc(stato.mq) + '"></label>' +
      '<div class="fld">A che piano si trova?' + pills('piano', [['basso', 'Villa, casa indipendente o fino al 1° piano'], ['alto', '2° piano o superiore']], stato.piano) + '</div>' +
      '<div class="fld">È in centro storico o in ZTL?' + pills('centro', [['si', 'Sì'], ['no', 'No']], stato.centro) + '</div>' +
      '</fieldset>';
    SEZ.forEach(function (s, i) {
      h += '<fieldset class="grp"><legend class="lg"><span class="nr">' + String(i + 2).padStart(2, '0') + '</span>' + esc(s.t) + '</legend>';
      if (s.h) h += '<p class="hint" style="margin:0">' + esc(s.h) + '</p>';
      s.v.forEach(function (it) {
        h += '<div class="voce" data-id="' + it.id + '"><div class="vd"><span>' + esc(it.d) + '</span>' + (it.h ? '<span class="hint">' + esc(it.h) + '</span>' : '') + '</div><div class="vq">';
        if (it.tipo === 'si') {
          h += pills(it.id, [['si', 'Sì'], ['', 'No']], q[it.id] || '');
        } else {
          h += '<label class="qt"><input class="inp" type="number" inputmode="decimal" min="0" placeholder="0" data-q="' + it.id + '" value="' + esc(q[it.id] || '') + '" aria-label="' + esc(it.d) + ' (' + it.um + ')"><span>' + it.um + '</span></label>';
          if (it.mq) h += '<button type="button" class="usaMq" data-usa="' + it.id + '">= superficie</button>';
        }
        h += '</div><b class="vi" data-imp="' + it.id + '"></b></div>';
      });
      h += '</fieldset>';
    });
    h += '<fieldset class="grp"><legend class="lg"><span class="nr">' + String(SEZ.length + 2).padStart(2, '0') + '</span>Oneri di cantiere e pulizia</legend>' +
      '<p class="hint" style="margin:0">Calcolati in automatico dalla superficie e dal piano: oneri per la sicurezza con allestimento e smontaggio del cantiere, pulizia finale e, dal 2° piano in su, tiro in alto e calo in basso dei materiali.</p>' +
      '<div class="voce"><div class="vd"><span>Oneri per la sicurezza, allestimento e smontaggio del cantiere</span></div><div class="vq"></div><b class="vi" data-imp="_sic"></b></div>' +
      '<div class="voce"><div class="vd"><span>Tiro in alto e calo in basso dei materiali</span></div><div class="vq"></div><b class="vi" data-imp="_tiro"></b></div>' +
      '<div class="voce"><div class="vd"><span>Pulizia finale del cantiere</span></div><div class="vq"></div><b class="vi" data-imp="_pul"></b></div>' +
      '</fieldset>';
    h += '<a class="rBar" href="#rRiepTop">La tua stima <b id="rBarTot">€ 0</b> + IVA <span aria-hidden="true">↓</span></a>';
    document.getElementById('simForm').innerHTML = h;
    calcola();
  }

  function calcola() {
    var mq = num(stato.mq), righe = [], lavori = 0, msg = [];
    var setImp = function (id, v) { var el = root.querySelector('[data-imp="' + id + '"]'); if (el) el.textContent = v > 0 ? eur(v) : ''; };
    SEZ.forEach(function (s) {
      var sub = 0;
      s.v.forEach(function (it) {
        var v = importo(it, mq); setImp(it.id, v);
        if (v > 0) {
          sub += v;
          var qq = String(q[it.id]).replace('.', ',');
          msg.push('- ' + it.d + (it.tipo === 'si' ? '' : /^n°/.test(it.um) ? ' × ' + qq : ': ' + qq + ' ' + it.um) + ' = ' + eur(v));
        }
      });
      if (sub > 0 && s.t !== 'Progetto e pratiche') righe.push([s.t, sub]);
      if (s.t !== 'Progetto e pratiche') lavori += sub;
    });
    var prog = importo(SEZ[SEZ.length - 1].v[0], mq);
    var avvio = mq > 0 && lavori > 0;
    var sic = avvio ? ONERI.sicurezza * x70(mq) : 0;
    var tiro = avvio && stato.piano === 'alto' ? ONERI.tiro * x70(mq) : 0;
    var pul = avvio ? ONERI.pulizia * mq : 0;
    setImp('_sic', sic); setImp('_tiro', tiro); setImp('_pul', pul);
    var oneri = sic + tiro + pul;
    var centro = stato.centro === 'si' ? (lavori + oneri) * ONERI.centro : 0;
    if (oneri > 0) righe.push(['Oneri di cantiere e pulizia', oneri]);
    if (centro > 0) righe.push(['Centro storico / ZTL', centro]);
    if (prog > 0) righe.push(['Progetto e pratiche', prog]);
    var tot = lavori + oneri + centro + prog;
    document.getElementById('rRiep').innerHTML = righe.length ? righe.map(function (r) {
      return '<li><span>' + esc(r[0]) + '</span><span>' + eur(r[1]) + '</span></li>';
    }).join('') : '<li><span>Indica la superficie e le lavorazioni che ti servono</span></li>';
    document.getElementById('rTot').textContent = eur(tot);
    document.getElementById('rBarTot').textContent = eur(tot);
    document.getElementById('rMqTot').textContent = mq > 0 && tot > 0 ? 'circa ' + eur(tot / mq) + ' al m²' : '';
    var testo = 'Buongiorno, ho fatto la simulazione della ristrutturazione sul vostro sito.\n' +
      'Superficie: ' + (mq ? String(mq).replace('.', ',') + ' m²' : '-') + ' · ' + (stato.piano === 'alto' ? '2° piano o superiore' : 'villa, casa indipendente o fino al 1° piano') + (stato.centro === 'si' ? ' · centro storico / ZTL' : '') + '\n' +
      msg.join('\n') + (oneri ? '\n- Oneri di cantiere e pulizia = ' + eur(oneri) : '') + (centro ? '\n- Centro storico / ZTL = ' + eur(centro) : '') +
      '\nTotale stimato: ' + eur(tot) + ' + IVA\nVorrei fissare un sopralluogo.';
    document.getElementById('rWa').href = 'https://wa.me/393282145266?text=' + encodeURIComponent(testo);
  }

  var segnato = false;
  function usato() { if (!segnato && window.MDStat) { segnato = true; window.MDStat('simulazione-ristrutturazioni-interni'); } }

  root.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'rMq') stato.mq = t.value;
    else if (t.dataset.q) q[t.dataset.q] = t.value;
    else return;
    usato(); calcola();
  });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) {
      var k = b.dataset.k, v = b.dataset.v;
      if (k === 'piano' || k === 'centro') stato[k] = v; else q[k] = v;
      b.parentNode.querySelectorAll('.pill').forEach(function (p) { p.setAttribute('aria-pressed', String(p === b)); });
      usato(); calcola();
    } else if (b.dataset.usa) {
      var inp = root.querySelector('[data-q="' + b.dataset.usa + '"]');
      if (num(stato.mq) > 0 && inp) { inp.value = stato.mq; q[b.dataset.usa] = stato.mq; usato(); calcola(); }
      else { var m = document.getElementById('rMq'); if (m) m.focus(); }
    }
  });
  disegna();
})();
