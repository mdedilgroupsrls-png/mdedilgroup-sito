/* Simulatore della ristrutturazione di interni (pagina /ristrutturazioni-interni).
   Prezzi dal listino MD Edil Group del 16/10/2026, IVA esclusa (vedi progetto/listino-prezzi.md).
   Il cliente indica la quantità di ogni voce che gli serve: le voci lasciate vuote non si calcolano.
   Sul sito non si mostrano i prezzi unitari, solo l'importo di ogni voce. */
(function () {
  // tipo: 'q' = quantità (m², m, n°); 'si' = a corpo (sì / no); mq: true = pulsante "usa la superficie"
  // a70: prezzo a corpo per immobili fino a 70 m²; ogni 70 m² in più si aggiunge un altro importo (71–140 m² = doppio, 141–210 m² = triplo…)
  // d = titolo della voce, x = descrizione che si apre passando sopra il titolo o toccandolo (testi originali MD Edil Group)
  var SEZ = [
    { t: 'Demolizioni e rimozioni', s: 'Smontiamo e portiamo via ciò che va rifatto. Dove indicato, carico, trasporto e smaltimento in discarica autorizzata sono compresi.', v: [
      { id: 'pavCer', d: 'Rimozione di pavimenti in ceramica', um: 'm²', p: 17.5, mq: true,
        x: 'Togliamo le piastrelle esistenti e lasciamo il massetto sottostante. Comprende carico, trasporto e smaltimento in discarica autorizzata.' },
      { id: 'pavMas', d: 'Rimozione di pavimenti in ceramica con il massetto (fino a 5 cm)', um: 'm²', p: 33.5, mq: true,
        x: 'Togliamo piastrelle e sottofondo fino a 5 cm di spessore: serve quando si rifà il pavimento da zero o passano nuovi impianti sotto il pavimento. Smaltimento in discarica compreso.' },
      { id: 'demCtr', d: 'Demolizione di controsoffitti in cartongesso', um: 'm²', p: 25.5,
        x: 'Smontaggio di lastre e struttura metallica del controsoffitto esistente, con trasporto e smaltimento del materiale.' },
      { id: 'demTra', d: 'Demolizione di tramezzi interni', um: 'm²', p: 25.15,
        x: 'Abbattimento di pareti divisorie non portanti, spesse da 4,5 a 10 cm. Si misura la superficie della parete: lunghezza × altezza (es. 4 m × 2,7 m ≈ 11 m²). Per i muri portanti serve prima la verifica del nostro tecnico.' },
      { id: 'demPor', d: 'Smontaggio di porte interne', um: 'n°', p: 93,
        x: 'Rimozione di anta, telaio e coprifili delle porte esistenti, con smaltimento in discarica autorizzata.' },
      { id: 'demRad', d: 'Rimozione di termosifoni', um: 'n°', p: 55.7,
        x: 'Scollegamento e smontaggio dei termosifoni esistenti, per sostituirli o spostarli.' },
      { id: 'demZoc', d: 'Rimozione di battiscopa', um: 'm', p: 5.5,
        x: 'Rimozione dei battiscopa in legno o ceramica. Si misura in metri lineari: il perimetro delle stanze, senza le porte.' },
      { id: 'demPar', d: 'Rimozione di parquet', um: 'm²', p: 26.7, mq: true,
        x: 'Rimozione del parquet esistente, con trasporto e smaltimento in discarica autorizzata.' },
      { id: 'protez', d: 'Protezione dei pavimenti da conservare', um: 'm²', p: 5.25, mq: true,
        x: 'Copriamo con cartone ondulato i pavimenti che restano, per proteggerli da urti, polvere e sporco per tutta la durata dei lavori.' },
      { id: 'disEl', d: 'Smontaggio dell’impianto elettrico esistente', um: 'a corpo', p: 750, tipo: 'si', a70: true,
        x: 'Rimozione di cavi, scatole, frutti e quadro del vecchio impianto in tutta la casa, per fare spazio al nuovo impianto a norma.' },
      { id: 'disId', d: 'Smontaggio dell’impianto idrico esistente', um: 'a corpo', p: 750, tipo: 'si', a70: true,
        x: 'Rimozione delle vecchie tubazioni di carico e scarico in tutta la casa, prima di realizzare l’impianto nuovo.' }
    ] },
    { t: 'Bagno chiavi in mano', s: 'Un solo importo per tutte le lavorazioni del bagno. Non indicare di nuovo queste lavorazioni nelle altre voci.', v: [
      { id: 'bagno', d: 'Rifacimento completo del bagno', um: 'n° bagni', p: 6500, extraMq: 350, bagno: true,
        x: 'Dal vecchio bagno al nuovo, senza pensieri: smontaggio dei sanitari, demolizione di pavimenti, rivestimenti e sottofondi con smaltimento, nuovo massetto, nuovi impianti idrico ed elettrico con le opere murarie, impermeabilizzazione della doccia, posa di pavimento e rivestimenti in gres, rasatura e pittura, montaggio di sanitari, rubinetteria, piatto e box doccia e accessori, collaudo con dichiarazioni di conformità e pulizia finale. Il prezzo vale per un bagno fino a 5 m²: per un bagno più grande indica la sua superficie. Restano esclusi gres, sanitari, rubinetteria, doccia e accessori, che sceglierai con noi.' }
    ] },
    { t: 'Opere murarie', s: 'Nuove pareti, sottofondi e intonaci per ridisegnare gli spazi.', v: [
      { id: 'tramez', d: 'Costruzione di nuovi tramezzi', um: 'm²', p: 87.7,
        x: 'Nuove pareti divisorie in muratura per cambiare la distribuzione degli ambienti. Si misura la superficie della parete: lunghezza × altezza.' },
      { id: 'contel', d: 'Controtelaio per porta scorrevole a scomparsa', um: 'n°', p: 370,
        x: 'Fornitura e montaggio del controtelaio metallico che si inserisce nella parete e accoglie l’anta scorrevole. La posa della porta si indica a parte, nella sezione delle porte.' },
      { id: 'intona', d: 'Intonaco grezzo', um: 'm²', p: 26.5,
        x: 'Primo strato di intonaco su pareti nuove o da ripristinare: è la base per rasatura e pittura.' },
      { id: 'massNu', d: 'Nuovo massetto in sabbia e cemento', um: 'm²', p: 34.5, mq: true,
        x: 'Sottofondo tradizionale steso e livellato, pronto per la posa del nuovo pavimento.' }
    ] },
    { t: 'Climatizzazione', s: 'Impianti per rinfrescare e riscaldare con i condizionatori.', v: [
      { id: 'clima', d: 'Impianto di climatizzazione con un motore esterno e due split', um: 'n° impianti', p: 1170,
        x: 'Posa delle tubazioni tra il motore esterno e i due split interni, scarico della condensa, opere murarie e installazione. I condizionatori li scegliamo insieme: la fornitura è esclusa.' }
    ] },
    { t: 'Impianto elettrico', s: 'Impianto nuovo, eseguito da tecnici abilitati e consegnato con dichiarazione di conformità.', v: [
      { id: 'punti', d: 'Punti luce e prese', um: 'n° punti', p: 95,
        x: 'Ogni punto è un’uscita per una luce o una presa, a parete, a pavimento o a soffitto: comprende linee, scatole, frutti tipo BTicino e opere murarie. Per orientarti: circa un punto per ogni metro quadro di casa.' },
      { id: 'quadro', d: 'Nuovo quadro elettrico', um: 'a corpo', p: 750, tipo: 'si', quadro: true,
        x: 'Nuovo quadro con le protezioni dell’impianto, dimensionato sulla superficie della casa.' }
    ] },
    { t: 'Impianto idrico e riscaldamento', s: 'Acqua, scarichi e termosifoni, con dichiarazione di conformità.', v: [
      { id: 'centr', d: 'Collettore di distribuzione collegato alla caldaia', um: 'n°', p: 679,
        x: 'Predisposizione e montaggio della centralina da cui partono le tubazioni verso i termosifoni, con il collegamento alla caldaia.' },
      { id: 'radiat', d: 'Allaccio e posa di termosifoni e scaldasalviette', um: 'n°', p: 475,
        x: 'Tubazioni in multistrato fino a ogni termosifone, scaldasalviette o termoarredo, opere murarie e montaggio del nuovo elemento. Fornitura dei termosifoni esclusa.' },
      { id: 'caldaia', d: 'Installazione della caldaia a gas', um: 'n°', p: 770,
        x: 'Montaggio e collegamento della nuova caldaia. La caldaia la scegli tu o la scegliamo insieme: fornitura esclusa.' },
      { id: 'pAcqua', d: 'Nuovo punto acqua con scarico', um: 'n°', p: 435,
        x: 'Un attacco completo di acqua e scarico per lavello, lavatrice, lavastoviglie, lavabo o altri apparecchi, con le opere murarie.' }
    ] },
    { t: 'Impianto gas', s: 'Linee del gas realizzate secondo le norme di sicurezza.', v: [
      { id: 'gasCuc', d: 'Linea del gas dal contatore alla cucina', um: 'n°', p: 750,
        x: 'Nuova tubazione dal contatore al piano cottura, con la valvola di chiusura prevista dalla normativa.' },
      { id: 'gasCal', d: 'Linea del gas per la caldaia', um: 'a corpo', p: 550, tipo: 'si',
        x: 'Tubazione che porta il gas fino alla caldaia, con il collegamento.' }
    ] },
    { t: 'Pavimenti, rivestimenti e porte', s: 'Posa dei materiali che scegli con noi: la fornitura è esclusa.', v: [
      { id: 'posPav', d: 'Posa di pavimenti in ceramica o gres (fino a 60 × 60 cm)', um: 'm²', p: 44.5, mq: true,
        x: 'Posa a colla su sottofondo pronto, con tagli, stuccatura delle fughe e pulizia. Per le grandi lastre valutiamo insieme al sopralluogo.' },
      { id: 'posRiv', d: 'Posa di rivestimenti a parete (fino a 60 × 60 cm)', um: 'm²', p: 47.5,
        x: 'Posa di piastrelle su pareti di cucina e altri ambienti, con tagli e stuccatura delle fughe. I rivestimenti del bagno chiavi in mano sono già compresi nella sua voce.' },
      { id: 'posZoc', d: 'Posa di battiscopa', um: 'm', p: 8,
        x: 'Posa dei battiscopa in legno o ceramica lungo il perimetro delle stanze. Si misura in metri lineari.' },
      { id: 'posPar', d: 'Posa di parquet', um: 'm²', p: 55, mq: true,
        x: 'Posa del parquet su sottofondo pronto, con tagli e rifiniture lungo le pareti.' },
      { id: 'porBat', d: 'Posa di porte a battente', um: 'n°', p: 130,
        x: 'Montaggio della porta interna con telaio e coprifili, e regolazione di cerniere e serratura.' },
      { id: 'porSco', d: 'Posa di porte scorrevoli', um: 'n°', p: 230,
        x: 'Montaggio della porta scorrevole, esterna al muro o a scomparsa. Per la porta a scomparsa il controtelaio si indica nelle opere murarie.' }
    ] },
    { t: 'Opere in cartongesso', s: 'Controsoffitti, pareti leggere e dettagli per l’illuminazione.', v: [
      { id: 'ctrSof', d: 'Controsoffitto in cartongesso', um: 'm²', p: 55,
        x: 'Struttura metallica e lastre da 13 mm con giunti stuccati in due mani, pronto per rasatura e pittura. Serve per abbassare i soffitti, nascondere gli impianti e inserire i faretti.' },
      { id: 'divCar', d: 'Parete divisoria in cartongesso', um: 'm²', p: 75,
        x: 'Parete leggera spessa 10 cm, con struttura metallica e lastre sui due lati: si monta in poco tempo e si può attrezzare con impianti e nicchie.' },
      { id: 'velette', d: 'Velette e mensole per luci LED', um: 'm', p: 85,
        x: 'Elementi in cartongesso sagomati che nascondono le strisce LED e creano luce indiretta su soffitti e pareti. Si misurano in metri lineari.' }
    ] },
    { t: 'Rasature e tinteggiature', s: 'Si contano i m² di pareti e soffitti: in una stanza sono circa 3 volte la superficie del pavimento.', v: [
      { id: 'raschi', d: 'Raschiatura delle vecchie pitture', um: 'm²', p: 3,
        x: 'Rimozione delle pitture che si staccano o sono rovinate, per partire da una base sana.' },
      { id: 'rasat', d: 'Rasatura di pareti e soffitti', um: 'm²', p: 27,
        x: 'Stesura di rasante e stucco in pasta per rendere le superfici lisce e uniformi, pronte per la pittura.' },
      { id: 'levig', d: 'Carteggiatura e fondo isolante', um: 'm²', p: 5,
        x: 'Levigatura con carta abrasiva e fondo acrilico isolante, che uniforma la superficie e fa aderire meglio la pittura.' },
      { id: 'pitChi', d: 'Pittura lavabile in colori chiari', um: 'm²', p: 13.5,
        x: 'Pittura lavabile, facile da pulire, in bianco o in tinte chiare.' },
      { id: 'pitInt', d: 'Pittura lavabile in colori intensi', um: 'm²', p: 17.5,
        x: 'Pittura lavabile in tinte forti o scure, che richiedono più colore e una stesura più accurata.' }
    ] },
    { t: 'Oneri di cantiere e pulizia', s: 'Voci da scegliere in base al tuo cantiere.', v: [
      { id: 'sicur', d: 'Sicurezza e allestimento del cantiere', um: 'a corpo', p: 1100, tipo: 'si', a70: true,
        x: 'Montaggio e smontaggio del cantiere e misure di sicurezza previste dalla legge, per chi lavora e per chi abita.' },
      { id: 'tiro', d: 'Carico e scarico dei materiali (tiro in alto e calo in basso)', um: 'a corpo', p: 1400, tipo: 'si', a70: true,
        x: 'Movimentazione di tutti i materiali del cantiere, a qualsiasi piano, anche al piano terra: salita e consegna dei materiali nuovi, discesa e carico delle macerie.' },
      { id: 'pulizia', d: 'Pulizia finale del cantiere', um: 'm²', p: 6, mq: true,
        x: 'Pulizia completa della casa a fine lavori, pronta da abitare. Si calcola sui m² della casa.' }
    ] },
    { t: 'Progetto e pratiche', s: 'Il progetto e i permessi, seguiti dal nostro studio tecnico.', v: [
      { id: 'proget', d: 'Progetto e pratiche edilizie (CILA / SCIA)', um: 'a corpo', p: 40, tipo: 'si', perMq: true,
        x: 'Rilievo della casa, progetto con le tavole esecutive e degli impianti e presentazione della pratica al Comune. L’importo si calcola sulla superficie.' }
    ] }
  ];
  var CENTRO = 0.05; // centro storico / ZTL: +5% sui lavori

  var form = document.getElementById('simForm');
  if (!form) return;
  var root = form.parentNode;
  var stato = { mq: '', piano: 'basso', centro: 'no' };
  var q = {};

  var num = function (v) { var x = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isNaN(x) || x < 0 ? 0 : x; };
  var eur = function (v) { return '€ ' + Math.round(v).toLocaleString('it-IT'); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // voci a corpo "fino a 70 m²": oltre i 70 m² il prezzo cresce in proporzione alla superficie
  var x70 = function (mq) { return Math.max(1, Math.ceil(mq / 70)); };
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
    if (it.bagno) return num(val) * (it.p + Math.max(0, (num(q.bagnoMq) || 5) - 5) * it.extraMq);
    return num(val) * it.p;
  }

  function pills(nome, scelte, attuale) {
    return '<div class="pills" role="group">' + scelte.map(function (s) {
      return '<button type="button" class="pill" data-k="' + nome + '" data-v="' + s[0] + '" aria-pressed="' + (attuale === s[0]) + '">' + s[1] + '</button>';
    }).join('') + '</div>';
  }

  // titolo della voce: passando sopra (o toccando) si apre la descrizione
  function titolo(it) {
    return '<div class="vd"><button type="button" class="vt" aria-expanded="false" aria-controls="x-' + it.id + '">' + esc(it.d) +
      ' <span class="vi-i" aria-hidden="true">i</span></button><div class="vx" id="x-' + it.id + '" role="tooltip">' + esc(it.x) + '</div></div>';
  }

  function disegna() {
    var h = '<fieldset class="grp"><legend class="lg"><span class="nr">01</span>L’immobile</legend>' +
      '<label class="fld">Superficie interna (m²)<input class="inp" id="rMq" type="number" inputmode="decimal" min="1" placeholder="es. 70" value="' + esc(stato.mq) + '"></label>' +
      '<div class="fld">A che piano si trova?' + pills('piano', [['basso', 'Villa, casa indipendente o fino al 1° piano'], ['alto', '2° piano o superiore']], stato.piano) + '</div>' +
      '<div class="fld">È in centro storico o in ZTL?' + pills('centro', [['si', 'Sì'], ['no', 'No']], stato.centro) + '</div>' +
      '</fieldset>';
    SEZ.forEach(function (s, i) {
      h += '<fieldset class="grp"><legend class="lg"><span class="nr">' + String(i + 2).padStart(2, '0') + '</span>' + esc(s.t) + '</legend>';
      if (s.s) h += '<p class="hint" style="margin:0">' + esc(s.s) + '</p>';
      s.v.forEach(function (it) {
        h += '<div class="voce" data-id="' + it.id + '">' + titolo(it) + '<div class="vq">';
        if (it.tipo === 'si') {
          h += pills(it.id, [['si', 'Sì'], ['', 'No']], q[it.id] || '');
        } else {
          h += '<label class="qt"><input class="inp" type="number" inputmode="decimal" min="0" placeholder="0" data-q="' + it.id + '" value="' + esc(q[it.id] || '') + '" aria-label="' + esc(it.d) + ' (' + it.um + ')"><span>' + it.um + '</span></label>';
          if (it.mq) h += '<button type="button" class="usaMq" data-usa="' + it.id + '">= superficie</button>';
          if (it.bagno) h += '<label class="qt"><input class="inp" type="number" inputmode="decimal" min="1" placeholder="5" data-q="bagnoMq" value="' + esc(q.bagnoMq || '') + '" aria-label="Superficie di ogni bagno (m²)"><span>m² per bagno</span></label>';
        }
        h += '</div><b class="vi" data-imp="' + it.id + '"></b></div>';
      });
      h += '</fieldset>';
    });
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
          msg.push('- ' + it.d + (it.bagno && num(q.bagnoMq) > 5 ? ' (' + String(q.bagnoMq).replace('.', ',') + ' m²)' : '') + (it.tipo === 'si' ? '' : /^n°/.test(it.um) ? ' × ' + qq : ': ' + qq + ' ' + it.um) + ' = ' + eur(v));
        }
      });
      if (sub > 0 && s.t !== 'Progetto e pratiche') righe.push([s.t, sub]);
      if (s.t !== 'Progetto e pratiche') lavori += sub;
    });
    var prog = importo(SEZ[SEZ.length - 1].v[0], mq);
    var centro = stato.centro === 'si' ? lavori * CENTRO : 0;
    if (centro > 0) righe.push(['Centro storico / ZTL', centro]);
    if (prog > 0) righe.push(['Progetto e pratiche', prog]);
    var tot = lavori + centro + prog;
    document.getElementById('rRiep').innerHTML = righe.length ? righe.map(function (r) {
      return '<li><span>' + esc(r[0]) + '</span><span class="e">' + eur(r[1]) + '</span></li>';
    }).join('') : '<li><span>Indica la superficie e le lavorazioni che ti servono</span></li>';
    document.getElementById('rTot').textContent = eur(tot);
    document.getElementById('rBarTot').textContent = eur(tot);
    document.getElementById('rMqTot').textContent = mq > 0 && tot > 0 ? 'circa ' + eur(tot / mq) + ' al m²' : '';
    var testo = 'Buongiorno, ho fatto la simulazione della ristrutturazione sul vostro sito.\n' +
      'Superficie: ' + (mq ? String(mq).replace('.', ',') + ' m²' : '-') + ' · ' + (stato.piano === 'alto' ? '2° piano o superiore' : 'villa, casa indipendente o fino al 1° piano') + (stato.centro === 'si' ? ' · centro storico / ZTL' : '') + '\n' +
      msg.join('\n') + (centro ? '\n- Centro storico / ZTL = ' + eur(centro) : '') +
      '\nTotale stimato: ' + eur(tot) + ' + IVA';
    ultimoTesto = testo;
  }

  var ultimoTesto = '';
  var segnato = false;
  // invio su WhatsApp: servono nome, telefono e indirizzo; il messaggio lo manda il cliente dal suo telefono
  document.getElementById('rWa').addEventListener('click', function (e) {
    var campi = [['rNome', 'nome e cognome'], ['rTel', 'telefono'], ['rInd', 'indirizzo dell’immobile']];
    var mancano = [], val = {};
    campi.forEach(function (c) {
      var el = document.getElementById(c[0]); val[c[0]] = el.value.trim();
      var ok = c[0] === 'rTel' ? /\d{6,}/.test(val[c[0]].replace(/\D/g, '')) : val[c[0]].length > 1;
      el.classList.toggle('no', !ok); if (!ok) mancano.push(c[1]);
    });
    var err = document.getElementById('rErr');
    if (num(stato.mq) <= 0 || !/€ [1-9]/.test(document.getElementById('rTot').textContent)) mancano.unshift('la superficie e almeno una lavorazione');
    if (mancano.length) {
      e.preventDefault(); e.stopImmediatePropagation();
      err.textContent = 'Per inviare la simulazione indica: ' + mancano.join(', ') + '.'; err.hidden = false;
      var primo = document.querySelector('.dati .inp.no'); if (primo) primo.focus();
      return;
    }
    err.hidden = true;
    this.href = 'https://wa.me/393282145266?text=' + encodeURIComponent(ultimoTesto +
      '\n\nNome e cognome: ' + val.rNome + '\nTelefono: ' + val.rTel + '\nIndirizzo dell’immobile: ' + val.rInd + '\n\nVorrei richiedere un sopralluogo: potete ricontattarmi?');
    document.getElementById('rOk').hidden = false;
  }, true);

  function usato() { if (!segnato && window.MDStat) { segnato = true; window.MDStat('simulazione-ristrutturazioni-interni'); } }

  root.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'rMq') stato.mq = t.value;
    else if (t.dataset.q) q[t.dataset.q] = t.value;
    else return;
    usato(); calcola();
  });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    var aperti = root.querySelectorAll('.vt[aria-expanded="true"]');
    for (var k2 = 0; k2 < aperti.length; k2++) if (aperti[k2] !== b) aperti[k2].setAttribute('aria-expanded', 'false');
    if (!b) return;
    if (b.classList.contains('vt')) { b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')); return; }
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
