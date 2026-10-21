// Taccuino della Home: ogni articolo compare dal giorno scritto in data-dal (AAAA-MM-GG, ora di Roma).
// Per ogni gruppo si mostrano i 3 articoli più recenti già usciti (il primo con foto, gli altri solo titolo); un gruppo vuoto si nasconde.
(function () {
  var oggi;
  try { oggi = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date()); }
  catch (e) { oggi = new Date().toISOString().slice(0, 10); }
  document.querySelectorAll('#taccuino .news').forEach(function (g) {
    var n = 0;
    g.querySelectorAll('a.art').forEach(function (a) {
      var ok = !a.dataset.dal || a.dataset.dal <= oggi;
      if (ok && n < 3) { if (n) a.classList.add('mini'); n++; } else a.style.display = 'none';
    });
    if (!n) g.parentNode.style.display = 'none';
  });
})();
