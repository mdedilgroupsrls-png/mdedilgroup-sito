/* Preventivo indicativo in PDF, intestato MD Edil Group, creato nel browser del cliente dai simulatori
   (ristrutturazioni interni, infissi). Usa jsPDF (js/vendor, licenza MIT), caricato solo quando serve.
   Il PDF non viene inviato al sito: il cliente lo scarica o lo condivide lui su WhatsApp.
   Sul PDF non compaiono i prezzi unitari, solo quantità e importi delle voci. */
(function () {
  var AZ = {
    nome: 'MD EDIL GROUP S.R.L.S.',
    righe: ['Sede operativa: Via Monti Lepini 9, 00015 Monterotondo (RM)', 'P.IVA 17112431006 · Codice univoco M5UXCR1',
      'Tel. e WhatsApp +39 328 214 5266', 'mdedilgroupsrls@gmail.com · mdedilgroup.it']
  };
  var ORO = [201, 162, 74], NERO = [14, 13, 11], TESTO = [40, 38, 34], GRIGIO = [120, 114, 104], RIGA = [222, 216, 204];

  function carica(src) {
    return new Promise(function (ok, ko) {
      if (window.jspdf) return ok();
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    });
  }
  function immagine(url) {
    return fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
      return new Promise(function (ok) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.readAsDataURL(b); });
    }).catch(function () { return null; });
  }
  var eur = function (v) { return '€ ' + v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var due = function (n) { return String(n).padStart(2, '0'); };

  /* d = { tipo: 'Ristrutturazione di interni', cliente: {nome, tel, ind, indLabel}, info: [[etichetta, valore]],
          sezioni: [{ t: 'titolo', righe: [[descrizione, quantità, importo o testo]] }],
          totale: numero, note: ['…'], file: 'nome-file' } */
  // numero progressivo del preventivo (100, 101, 102…) dal contatore del sito; se non risponde, numero con data e ora
  function prossimoNumero() {
    var ctl = window.AbortController ? new AbortController() : null;
    if (ctl) setTimeout(function () { ctl.abort(); }, 5000);
    return fetch('/n', { method: 'POST', cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return j && j.n ? String(j.n) : null; })
      .catch(function () { return null; });
  }

  function crea(d) {
    var numeroSito = null, logo = null;
    return carica('/js/vendor/jspdf-2.5.1.min.js')
      .then(function () { return Promise.all([immagine('/img/cc07e2f1120eb45d8438fc5d59d4b3e8.png'), prossimoNumero()]); })
      .then(function (r) { logo = r[0]; numeroSito = r[1]; })
      .then(function () {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
      var W = 210, M = 16, y = 0, ora = new Date();
      var numero = numeroSito || (ora.getFullYear() + due(ora.getMonth() + 1) + due(ora.getDate()) + '-' + due(ora.getHours()) + due(ora.getMinutes()));
      var data = due(ora.getDate()) + '/' + due(ora.getMonth() + 1) + '/' + ora.getFullYear();
      var col = function (c) { doc.setTextColor(c[0], c[1], c[2]); };
      var font = function (st, sz) { doc.setFont('helvetica', st); doc.setFontSize(sz); };

      function testata() {
        doc.setFillColor(NERO[0], NERO[1], NERO[2]); doc.rect(0, 0, W, 34, 'F');
        if (logo) doc.addImage(logo, 'PNG', M, 6, 29, 22);
        font('bold', 17); col([243, 239, 231]); doc.text('MD EDIL GROUP', M + 34, 16, { charSpace: 1.2 });
        font('normal', 8.5); col(ORO); doc.text('I dettagli fanno la differenza', M + 34, 22);
        font('normal', 7.5); col([216, 210, 198]);
        AZ.righe.forEach(function (r, i) { doc.text(r, W - M, 10 + i * 4.4, { align: 'right' }); });
        doc.setDrawColor(ORO[0], ORO[1], ORO[2]); doc.setLineWidth(0.8); doc.line(0, 34, W, 34);
        y = 44;
      }
      function piede() {
        var n = doc.getNumberOfPages();
        for (var i = 1; i <= n; i++) {
          doc.setPage(i); font('normal', 7.5); col(GRIGIO);
          doc.text(AZ.nome + ' · P.IVA 17112431006 · Preventivo n. ' + numero, M, 289);
          doc.text('Pagina ' + i + ' di ' + n, W - M, 289, { align: 'right' });
        }
      }
      function spazio(h) { if (y + h > 278) { doc.addPage(); testata(); } }

      testata();
      // titolo e numero
      font('bold', 15); col(NERO); doc.text('PREVENTIVO INDICATIVO', M, y);
      font('normal', 9); col(GRIGIO); doc.text(d.tipo, M, y + 6);
      font('normal', 9); col(TESTO);
      doc.text('N. ' + numero, W - M, y - 1, { align: 'right' }); doc.text('Data: ' + data, W - M, y + 4.5, { align: 'right' });
      y += 14;
      // avviso: preventivo non definitivo
      if (d.avviso) {
        font('normal', 8.5); var la = doc.splitTextToSize(d.avviso, W - 2 * M - 10);
        doc.setFillColor(246, 242, 232); doc.rect(M, y - 4, W - 2 * M, la.length * 4 + 5, 'F');
        doc.setFillColor(ORO[0], ORO[1], ORO[2]); doc.rect(M, y - 4, 1.2, la.length * 4 + 5, 'F');
        col(TESTO); doc.text(la, M + 5, y + 0.5); y += la.length * 4 + 8;
      }

      // cliente e immobile
      var bx = M, bw = (W - 2 * M - 6) / 2, top = y;
      function riquadro(x, titolo, righe) {
        font('bold', 8); col(ORO); doc.text(titolo, x + 4, top + 6, { charSpace: 0.6 });
        var yy = top + 12;
        righe.forEach(function (r) {
          font('normal', 7.5); col(GRIGIO); doc.text(r[0], x + 4, yy);
          font('normal', 9.5); col(TESTO);
          var l = doc.splitTextToSize(String(r[1]), bw - 8); doc.text(l, x + 4, yy + 4.2); yy += 4.2 + l.length * 4.2 + 1.5;
        });
        return yy;
      }
      var h1 = riquadro(bx, 'CLIENTE', [['Nome e cognome', d.cliente.nome], ['Telefono', d.cliente.tel], [d.cliente.indLabel || 'Indirizzo dell’immobile', d.cliente.ind]]);
      var h2 = riquadro(bx + bw + 6, 'DATI DEL LAVORO', d.info);
      var hh = Math.max(h1, h2) - top + 1;
      doc.setDrawColor(RIGA[0], RIGA[1], RIGA[2]); doc.setLineWidth(0.3);
      doc.rect(bx, top, bw, hh); doc.rect(bx + bw + 6, top, bw, hh);
      y = top + hh + 10;

      // tabella delle voci
      var cQ = W - M - 62, cI = W - M;
      function intestazione() {
        doc.setFillColor(246, 242, 232); doc.rect(M, y - 5, W - 2 * M, 8, 'F');
        font('bold', 7.5); col(GRIGIO);
        doc.text('DESCRIZIONE DEI LAVORI', M + 3, y); doc.text('QUANTITÀ', cQ, y, { align: 'right' }); doc.text('IMPORTO', cI - 3, y, { align: 'right' });
        y += 8;
      }
      intestazione();
      d.sezioni.forEach(function (s) {
        spazio(16);
        font('bold', 9.5); col(NERO); doc.text(s.t, M + 3, y); y += 2;
        doc.setDrawColor(ORO[0], ORO[1], ORO[2]); doc.setLineWidth(0.3); doc.line(M + 3, y, M + 40, y); y += 5;
        s.righe.forEach(function (r) {
          font('normal', 9); var l = doc.splitTextToSize(r[0], cQ - M - 30);
          spazio(l.length * 4.3 + 3);
          col(TESTO); doc.text(l, M + 3, y);
          doc.text(String(r[1] || ''), cQ, y, { align: 'right' });
          font('bold', 9); doc.text(typeof r[2] === 'number' ? eur(r[2]) : String(r[2]), cI - 3, y, { align: 'right' });
          y += l.length * 4.3 + 1.5;
          doc.setDrawColor(RIGA[0], RIGA[1], RIGA[2]); doc.setLineWidth(0.15); doc.line(M + 3, y - 2.5, W - M - 3, y - 2.5);
          y += 1.5;
        });
        y += 3;
      });

      // totale
      spazio(22);
      doc.setFillColor(NERO[0], NERO[1], NERO[2]); doc.rect(W - M - 92, y, 92, 16, 'F');
      font('normal', 8); col([216, 210, 198]); doc.text('TOTALE STIMATO', W - M - 88, y + 6.5);
      font('normal', 7.5); doc.text(d.iva || 'IVA di legge esclusa', W - M - 88, y + 11.5);
      font('bold', 15); col(ORO); doc.text(eur(d.totale), W - M - 4, y + 10.5, { align: 'right' });
      y += 26;

      // modalità di pagamento (solo se indicate dal simulatore)
      if (d.pagamento) {
        var pg = d.pagamento;
        spazio(30 + pg.rate.length * 6);
        font('bold', 8.5); col(NERO); doc.text('MODALITÀ DI PAGAMENTO', M, y); y += 2;
        doc.setDrawColor(ORO[0], ORO[1], ORO[2]); doc.setLineWidth(0.3); doc.line(M, y, M + 40, y); y += 5;
        pg.rate.forEach(function (r) {
          font('normal', 9); col(TESTO); doc.text(r[0], M + 3, y);
          doc.text(r[1] + '%', cQ, y, { align: 'right' });
          font('bold', 9); doc.text(eur(d.totale * r[1] / 100), cI - 3, y, { align: 'right' });
          doc.setDrawColor(RIGA[0], RIGA[1], RIGA[2]); doc.setLineWidth(0.15); doc.line(M + 3, y + 2, W - M - 3, y + 2);
          y += 6;
        });
        y += 3;
        doc.setFillColor(246, 242, 232); doc.rect(M, y, W - 2 * M, 19, 'F');
        font('bold', 8); col(GRIGIO); doc.text('BONIFICO BANCARIO', M + 4, y + 5.5);
        font('normal', 9); col(TESTO);
        doc.text('Banca: ' + pg.banca, M + 4, y + 10.5); doc.text('Intestatario: ' + pg.intestatario, M + 95, y + 10.5);
        font('bold', 10); col(NERO); doc.text('IBAN: ' + pg.iban, M + 4, y + 15.8);
        y += 27;
      }

      // note
      spazio(20);
      font('bold', 8.5); col(NERO); doc.text('NOTE', M, y); y += 5;
      font('normal', 8.5); col(TESTO);
      d.note.forEach(function (n) {
        var l = doc.splitTextToSize('• ' + n, W - 2 * M); spazio(l.length * 4 + 2); doc.text(l, M, y); y += l.length * 4 + 1.5;
      });
      piede();
      var nome = 'Preventivo-MD-Edil-Group-' + (d.file || 'simulazione').replace(/[^\w-]+/g, '-').replace(/-+/g, '-') + '-' + numero + '.pdf';
      return { blob: doc.output('blob'), nome: nome, numero: numero };
    });
  }

  // Sul telefono apre la condivisione (WhatsApp compare tra le app); al computer scarica il file
  function consegna(p) {
    var file = null;
    try { file = new File([p.blob], p.nome, { type: 'application/pdf' }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      return navigator.share({ files: [file], title: 'Preventivo MD Edil Group' }).catch(function (e) { if (!e || e.name !== 'AbortError') scarica(p); });
    }
    scarica(p); return Promise.resolve();
  }
  function scarica(p) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(p.blob); a.download = p.nome;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  function condivide() {
    try { return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && !!navigator.canShare && navigator.canShare({ files: [new File(['x'], 'p.pdf', { type: 'application/pdf' })] }); } catch (e) { return false; }
  }
  window.MDPdf = { crea: crea, consegna: consegna, scarica: scarica, condivide: condivide };
})();
