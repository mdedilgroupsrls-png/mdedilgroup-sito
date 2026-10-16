/* Simulatore della pagina Infissi e serramenti. Prezzi da progetto/listino-prezzi.md */
(function () {
  var P = {
    piccola: 200, // battente fino a 1 m²: prezzo fisso a pezzo (bianco)
    bat: [[3.22, 280], [Infinity, 300]], // battente bianco oltre 1 m², €/m² per fascia di misura del pezzo
    slideBianco: 320, slideColore: 400,
    demInf: 30, posInf: 140, tap: 49.5, demTap: 25, posTap: 60, zan: 52, posZan: 50,
    piano: 0.10, pianoDa: 4 // +10% su demolizioni e pose dal 4° piano
  };
  var COL_INF = [
    { n: 'Bianco', img: 'colore-bianco', k: 'std' },
    { n: 'Mooreiche 2', img: 'colore-mooreiche-2', k: 'base' },
    { n: 'Rovere dorato', img: 'colore-rovere-dorato', k: 'base' },
    { n: 'Noce', img: 'colore-noce', k: 'base' },
    { n: 'Grigio antracite', img: 'colore-grigio-antracite', k: 'base' },
    { n: 'Braun', img: 'colore-braun', k: 'base' },
    { n: 'Colore particolare della gamma', img: 'synego-gamma-colori', k: 'part' }
  ];
  var MULT = { std: 1, base: 1.25, part: 1.30 };
  var W = 'w'; // tinte legno: striatura
  var COL_TAP = [
    ['A01 Bianco', '#F2F2F0'], ['A16 Avorio 1013', '#EFEBDD'], ['A02 Avorio', '#F1E9C8'], ['A11 Beige', '#C7B9A0'], ['A36 Grigio 35', '#E6E6E6'],
    ['A03 Grigio chiaro', '#B9B9B9'], ['A27 Verde pisello', '#9DB894'], ['A17 Verde 56', '#2F7D45'], ['A10 Verde oliva', '#627E5E'], ['A04 Verde scuro', '#1D4A22'],
    ['A09 Rosso mattone', '#4E1712'], ['A26 Marrone 8017', '#3B140C'], ['A06 Testa di moro', '#4A140A'],
    ['A05 Legno chiaro', '#B08B4F', W], ['A30 Legno chiaro fiammato', '#D3A256', W], ['A35 Legno olmo', '#8E6438', W], ['A25 Legno douglas', '#C27A45', W],
    ['A34 Legno pino', '#C17E4E', W], ['A24 Legno rovere', '#7A5236', W], ['A28 Legno ciliegio', '#6E4720', W], ['A37 Legno castagno', '#7A5A33', W],
    ['A39 Legno castagno scuro', '#3E2E26', W], ['A07 Legno scuro', '#4A2A1C', W], ['A31 Legno scuro fiammato', '#3A2416', W], ['A40 Legno cherry', '#8B4E35', W],
    ['A41 Legno rovere sbiancato', '#E7E1D6', W], ['A42 Legno ciliegio fiammato', '#9A5A3A', W], ['A43 Legno sbiancato grigio', '#E4E4E2', W],
    ['A08 Rosso vivo', '#8C2320'], ['A22 Giallo ocra', '#B07B2A'], ['A23 Marrone 25', '#6E3D1C'], ['A14 Bleu', '#3176AC'], ['A13 Giallo', '#F2CF45'],
    ['A00 Nero', '#1C1C1C'], ['A15 Argento', '#D2D4D6'], ['A12 Bronzo', '#7A7470'], ['A38 Bronzo scuro', '#74634F'], ['A50 RAL 7016', '#2B323A'],
    ['A18 Verde Raffaello', '#1D3A26'], ['A19 Grigio Raffaello', '#555556'], ['A20 Rosso Raffaello', '#3E1A1C'], ['A21 Testa di moro Raffaello', '#2A1416']
  ];
  var COL_ZAN = [
    ['901 Bianco', '#F2F2EF'], ['101 Avorio', '#EDE6D2'], ['801 Marrone', '#3D1F14'], ['NOP Nero', '#141414'], ['0AX Argento', '#C8CACB'],
    ['0BX Bronzo', '#8C7C62'], ['BVE', '#8F7A55'], ['MMU', '#3A2228'], ['9FG', '#E6E6E4'], ['GRA Marmo', '#3F4044'], ['MRA Marmo', '#4A2420'],
    ['VRA Marmo', '#1F4430'], ['GMA Martellinato', '#4A4B4D'], ['MMA Martellinato', '#3B2E2C'], ['TMD', '#5C4033'], ['600', '#1E4D2B'],
    ['VMU', '#1D4A3B'], ['RBU', '#5A2B22'], ['96P', '#9A9A9A'], ['GRF', '#4F5254'], ['GFS', '#3F454B'], ['PCN', '#7E4A2A', W], ['PNS', '#6B3A22', W],
    ['PNM', '#9C7B4C', W], ['D3R', '#5A3A28', W], ['C21', '#9A6A40', W], ['C15', '#6E4428', W], ['M37', '#5A3420', W], ['C24', '#C08A50', W],
    ['DR1', '#A06E48', W], ['DRS', '#6A4630', W], ['N17', '#4E3020', W], ['N10', '#5C3A22', W]
  ];

  var eur = function (v) { return v.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }); };
  var mq = function (v) { return v.toLocaleString('it-IT', { maximumFractionDigits: 2 }) + ' m²'; };
  var $ = function (id) { return document.getElementById(id); };
  var area = function (r) { var w = parseFloat(r.w), h = parseFloat(r.h); return w > 0 && h > 0 ? w * h / 10000 : 0; };
  // demolizioni e pose: prezzo a pezzo fino a 3,22 m², doppio fino a 6,44 m², oltre si valuta al sopralluogo
  var perPezzo = function (a, p) { return a <= 3.22 ? p : a <= 6.44 ? 2 * p : null; };

  var st = { colInf: 0, colTap: 0, colZan: 0 };
  var lists = {};

  function strip(id, items, key, nameId, render) {
    var box = $(id);
    items.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.title = c.n || c[0];
      b.setAttribute('aria-label', c.n || c[0]);
      b.innerHTML = '<i></i><span>' + (c.n || c[0]) + '</span>';
      var sw = b.querySelector('i');
      if (c.img) sw.style.backgroundImage = 'url(/img/' + c.img + '.webp)';
      else { sw.style.background = c[1]; if (c[2]) sw.className = 'wood'; }
      if (c.k === 'part') sw.className = 'gamma';
      b.onclick = function () { st[key] = i; sel(); calc(); };
      box.appendChild(b);
    });
    function sel() {
      [].forEach.call(box.children, function (b, i) { b.setAttribute('aria-checked', i === st[key]); });
      var c = items[st[key]]; $(nameId).textContent = '· ' + (c.n || c[0]) + (render ? render(c) : '');
    }
    sel();
  }

  function List(id, label, types, start) {
    var box = $(id), rows = [];
    function add(r) {
      r = r || { w: '', h: '', t: 0 };
      rows.push(r);
      var n = rows.length, el = document.createElement('div');
      el.className = 'row';
      el.innerHTML = '<span class="n">' + label + ' ' + n + '</span>' +
        '<label><span>Larghezza</span><input type="number" inputmode="numeric" min="0" placeholder="cm" value="' + r.w + '"></label>' +
        '<label><span>Altezza</span><input type="number" inputmode="numeric" min="0" placeholder="cm" value="' + r.h + '"></label>' +
        (types ? '<label class="tp"><span>Tipo</span><select>' + types.map(function (t, i) { return '<option value="' + i + '"' + (i === r.t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>' : '') +
        '<output class="o"></output>';
      var ins = el.querySelectorAll('input');
      ins[0].oninput = function () { r.w = this.value; calc(); };
      ins[1].oninput = function () { r.h = this.value; calc(); };
      if (types) el.querySelector('select').onchange = function () { r.t = +this.value; calc(); };
      r.out = el.querySelector('output');
      box.appendChild(el);
    }
    function set(src) {
      box.innerHTML = ''; rows.length = 0;
      var full = src.filter(function (r) { return area(r) > 0; });
      (full.length ? full : [{}]).forEach(function (r) { add({ w: r.w || '', h: r.h || '', t: r.t || 0 }); });
      calc();
    }
    for (var i = 0; i < start; i++) add();
    return { rows: rows, add: function () { if (rows.length < 30) add(); }, set: set };
  }

  lists.inf = List('rowsInf', 'Infisso', ['Battente', 'Scorrevole'], 5);
  lists.dem = List('rowsDem', 'Pezzo', null, 1);
  lists.pos = List('rowsPos', 'Pezzo', null, 1);
  lists.tap = List('rowsTap', 'Tapparella', null, 1);
  lists.zan = List('rowsZan', 'Zanzariera', ['Finestra', 'Porta-finestra'], 1);

  strip('colInf', COL_INF, 'colInf', 'colInfName', function (c) { return c.k === 'base' ? ' (+25%)' : c.k === 'part' ? ' (+30%)' : ' (standard)'; });
  strip('colTap', COL_TAP, 'colTap', 'colTapName');
  strip('colZan', COL_ZAN, 'colZan', 'colZanName');

  [].forEach.call(document.querySelectorAll('[data-add]'), function (b) { b.onclick = function () { lists[b.dataset.add].add(); calc(); }; });
  [].forEach.call(document.querySelectorAll('[data-copy]'), function (b) { b.onclick = function () { lists[b.dataset.copy].set(lists.inf.rows); }; });
  ['tapDem', 'tapPos', 'zanPos', 'piano'].forEach(function (id) { $(id).onchange = calc; });

  function prezzoInfisso(r, a) {
    var k = COL_INF[st.colInf].k;
    if (r.t === 1) return a > 6.44 ? null : a * (k === 'std' ? P.slideBianco : P.slideColore); // scorrevoli oltre 6,44 m²: al sopralluogo
    if (a <= 1) return P.piccola * MULT[k];
    for (var i = 0; i < P.bat.length; i++) if (a <= P.bat[i][0]) return a * P.bat[i][1] * MULT[k];
  }

  function calc() {
    var plus = +$('piano').value >= P.pianoDa ? 1 + P.piano : 1, fuori = 0, tot = {};
    function sum(key, f) {
      var s = 0;
      lists[key].rows.forEach(function (r) {
        var a = area(r); if (!a) { r.out.textContent = ''; return; }
        var v = f(r, a), fm = v === null || Array.isArray(v);
        if (Array.isArray(v)) v = v[0]; // prodotto calcolato, posa o smontaggio da valutare
        if (fm) fuori++;
        if (v === null) { r.out.innerHTML = mq(a) + ' · <em>fuori misura: al sopralluogo</em>'; return; }
        s += v; r.out.innerHTML = mq(a) + ' · ' + eur(v) + (fm ? ' <em>+ posa al sopralluogo</em>' : '');
      });
      return s;
    }
    tot.inf = sum('inf', prezzoInfisso);
    tot.dem = sum('dem', function (r, a) { var p = perPezzo(a, P.demInf); return p === null ? null : p * plus; });
    tot.pos = sum('pos', function (r, a) { var p = perPezzo(a, P.posInf); return p === null ? null : p * plus; });
    var td = $('tapDem').checked, tp = $('tapPos').checked;
    tot.tap = sum('tap', function (r, a) {
      var d = td ? perPezzo(a, P.demTap) : 0, p = tp ? perPezzo(a, P.posTap) : 0;
      var v = a * P.tap + ((d || 0) + (p || 0)) * plus;
      return d === null || p === null ? [v] : v;
    });
    var zp = $('zanPos').checked;
    tot.zan = sum('zan', function (r, a) { if (a > 6.44) return null; var p = zp ? perPezzo(a, P.posZan) : 0; return a * P.zan + p * plus; }); // oltre 6,44 m²: al sopralluogo

    $('subInf').textContent = eur(tot.inf); $('subDem').textContent = eur(tot.dem); $('subPos').textContent = eur(tot.pos);
    $('subTap').textContent = eur(tot.tap); $('subZan').textContent = eur(tot.zan);
    var voci = [['Infissi (' + COL_INF[st.colInf].n.toLowerCase() + ')', tot.inf], ['Demolizione vecchi infissi', tot.dem], ['Posa nuovi infissi', tot.pos], ['Tapparelle', tot.tap], ['Zanzariere', tot.zan]];
    var T = 0, html = '';
    voci.forEach(function (v) { if (v[1] > 0) { T += v[1]; html += '<p><span>' + v[0] + '</span><b>' + eur(v[1]) + '</b></p>'; } });
    if (plus > 1 && T > 0) html += '<p class="sm"><span>Demolizioni e pose con +10% (sopra il terzo piano)</span></p>';
    $('riep').innerHTML = html || '<p class="sm"><span>Scrivi le misure dei tuoi infissi per vedere la stima.</span></p>';
    $('totale').textContent = eur(T);
    $('fuori').hidden = !fuori;
    $('fuori').textContent = fuori ? 'Alcuni pezzi superano 6,44 m²: per quelli il prezzo si calcola al sopralluogo (scorrevoli, zanzariere, demolizione e posa).' : '';

    var msg = 'Buongiorno, ho fatto la stima sul sito per infissi e serramenti:\n';
    voci.forEach(function (v) { if (v[1] > 0) msg += '- ' + v[0] + ': ' + eur(v[1]) + '\n'; });
    msg += 'Totale stimato: ' + eur(T) + '\nPiano: ' + $('piano').selectedOptions[0].text + '\nVorrei un sopralluogo.';
    $('waSim').href = 'https://wa.me/393282145266?text=' + encodeURIComponent(msg);
  }
  calc();
})();
