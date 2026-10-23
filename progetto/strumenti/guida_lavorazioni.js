// Scrive nella pagina la "Guida alle lavorazioni" (testo leggibile da Google) con titoli e descrizioni
// delle voci dei simulatori, presi dagli stessi file del simulatore. Da rilanciare dopo ogni modifica alle voci:
//   node progetto/strumenti/guida_lavorazioni.js
// Riscrive il blocco tra <!-- GUIDA:INIZIO --> e <!-- GUIDA:FINE --> delle pagine indicate qui sotto.
// prezzi: true = sotto ogni voce il prezzo del listino dello stesso simulatore (solo interni, IVA inclusa: Eugenio, 23/10/2026).
const fs = require('fs');
const path = require('path');
const radice = path.resolve(__dirname, '..', '..');

const PAGINE = [
  { js: 'js/ristrutturazione.js', html: 'ristrutturazioni-interni.html', titolo: 'Guida alle lavorazioni di ristrutturazione',
    intro: 'Tutte le lavorazioni del nostro simulatore, spiegate una per una: cosa comprendono, quando servono, come si misurano e quanto costano. Le eseguiamo a Roma e in tutto il Lazio, con tecnici abilitati e impianti certificati.',
    prezzi: true, iva: 'IVA inclusa',
    notaPrezzi: 'Prezzi del nostro listino, IVA inclusa, per la sola manodopera dove la fornitura dei materiali è esclusa (lo trovi scritto in ogni paragrafo). Per i lavori in centro storico o in ZTL si aggiunge il 5%. Il prezzo definitivo si conferma dopo il sopralluogo gratuito.' },
  { js: 'js/esterni.js', html: 'ristrutturazioni-esterni.html', titolo: 'Guida alle lavorazioni su facciate, cappotti e terrazzi',
    intro: 'Le lavorazioni del simulatore per facciate, cappotto termico, terrazzi e balconi, spiegate una per una: cosa comprendono, quando servono e come si misurano. Lavoriamo a Roma e nel Lazio per condomini e case private.' }
];

const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function leggiConfigurazione(file) {
  let cfg = null;
  const window = { MDSimulatore: c => { cfg = c; } };
  new Function('window', 'atob', fs.readFileSync(path.join(radice, file), 'utf8'))(window, s => Buffer.from(s, 'base64').toString('binary'));
  return cfg;
}

// formato italiano scritto a mano (Node senza dati di lingua completi): 1.100 €, 17,50 €
const euro = v => { const [i, d] = v.toFixed(v % 1 ? 2 : 0).split('.'); return i.replace(/\B(?=(\d{3})+$)/g, '.') + (d ? ',' + d : '') + ' €'; };
const UNITA = { 'm²': 'al m²', 'm': 'al metro lineare', 'n°': 'cadauno', 'n° punti': 'a punto', 'n° impianti': 'a impianto', 'n° bagni': 'a bagno', 'a corpo': 'a corpo' };

// testo del prezzo di una voce, con le stesse regole di calcolo del simulatore
function prezzo(it) {
  if (it.quadro) return '750 € fino a 70 m² di casa, 1.000 € fino a 100 m², poi 250 € in più ogni 20 m²';
  if (it.perMq) return euro(it.p) + ' per ogni m² di casa';
  if (it.bagno) return euro(it.p) + ' a bagno fino a 5 m², poi ' + euro(it.extraMq) + ' per ogni m² in più';
  if (it.p30) return euro(it.p) + ' a corpo fino a 70 m² di casa, poi ' + euro(it.p30) + ' in più ogni 30 m²';
  if (typeof it.p !== 'number') return '';
  if (!UNITA[it.um]) throw new Error('Unità senza testo per il prezzo: ' + it.um + ' (' + it.id + ')');
  return euro(it.p) + ' ' + UNITA[it.um];
}

function guida(cfg, p) {
  let h = '<section class="guida" id="guida-lavorazioni" aria-labelledby="guida-t">\n<div class="guida-in">\n' +
    '<p class="guida-ey">GUIDA ALLE LAVORAZIONI</p>\n<h2 id="guida-t">' + esc(p.titolo) + '</h2>\n<p class="guida-intro">' + esc(p.intro) + '</p>\n' +
    (p.notaPrezzi ? '<p class="guida-nota">' + esc(p.notaPrezzi) + '</p>\n' : '');
  cfg.sezioni.forEach(s => {
    h += '<details>\n<summary><h3>' + esc(s.t) + '</h3></summary>\n' + (s.s ? '<p>' + esc(s.s) + '</p>\n' : '') + '<dl>\n';
    s.v.forEach(it => {
      if (it.tipo === 'nota' || !it.x) return;
      h += '<dt>' + esc(it.d) + '</dt>\n<dd>' + esc(it.x);
      if (it.tipo === 'scelta') h += '\n<ul>' + it.opz.map(o => '<li><b>' + esc(o.d) + '</b>' + (o.x ? ': ' + esc(o.x.charAt(0).toLowerCase() + o.x.slice(1)) : '') + '</li>').join('') + '</ul>';
      const pr = p.prezzi && prezzo(it);
      if (pr) h += '\n<span class="guida-prezzo">Prezzo: ' + esc(pr) + ', ' + esc(p.iva) + '</span>';
      h += '</dd>\n';
    });
    h += '</dl>\n</details>\n';
  });
  return h + '<p class="guida-fine">Vuoi sapere quanto costa il tuo intervento? <a href="#simulatore">Usa il simulatore</a> oppure <a href="/#contatti">richiedi il sopralluogo</a>: sopralluogo e preventivo sono gratuiti.</p>\n</div>\n</section>';
}

PAGINE.forEach(p => {
  const file = path.join(radice, p.html);
  let html = fs.readFileSync(file, 'utf8');
  const blocco = '<!-- GUIDA:INIZIO -->\n' + guida(leggiConfigurazione(p.js), p) + '\n<!-- GUIDA:FINE -->';
  if (html.includes('<!-- GUIDA:INIZIO -->')) html = html.replace(/<!-- GUIDA:INIZIO -->[\s\S]*?<!-- GUIDA:FINE -->/, blocco);
  else {
    // la prima volta: subito dopo il simulatore
    const i = html.indexOf('</section>', html.indexOf('</aside>')) + '</section>'.length;
    html = html.slice(0, i) + '\n\n' + blocco + html.slice(i);
  }
  fs.writeFileSync(file, html);
  console.log('Guida aggiornata:', p.html);
});
