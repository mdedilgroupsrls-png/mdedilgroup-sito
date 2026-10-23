// Scrive nella pagina la "Guida alle lavorazioni" (testo leggibile da Google) con titoli e descrizioni
// delle voci dei simulatori, presi dagli stessi file del simulatore. Da rilanciare dopo ogni modifica alle voci:
//   node progetto/strumenti/guida_lavorazioni.js
// Riscrive il blocco tra <!-- GUIDA:INIZIO --> e <!-- GUIDA:FINE --> delle pagine indicate qui sotto.
// prezzi: true = sotto ogni voce il prezzo del listino dello stesso simulatore (Eugenio, 23/10/2026): interni IVA inclusa,
// esterni + IVA. Per infissi e serramenti il listino si scrive da js/infissi.js con listinoInfissi().
const fs = require('fs');
const path = require('path');
const radice = path.resolve(__dirname, '..', '..');

const PAGINE = [
  { js: 'js/ristrutturazione.js', html: 'ristrutturazioni-interni.html', titolo: 'Guida alle lavorazioni di ristrutturazione',
    intro: 'Tutte le lavorazioni del nostro simulatore, spiegate una per una: cosa comprendono, quando servono, come si misurano e quanto costano. Le eseguiamo a Roma e in tutto il Lazio, con tecnici abilitati e impianti certificati.',
    prezzi: true, iva: ', IVA inclusa',
    notaPrezzi: 'Prezzi del nostro listino, IVA inclusa, per la sola manodopera dove la fornitura dei materiali è esclusa (lo trovi scritto in ogni paragrafo). Per i lavori in centro storico o in ZTL si aggiunge il 5%. Il prezzo definitivo si conferma dopo il sopralluogo gratuito.' },
  { js: 'js/esterni.js', html: 'ristrutturazioni-esterni.html', titolo: 'Guida alle lavorazioni su facciate, cappotti e terrazzi',
    intro: 'Le lavorazioni del simulatore per facciate, cappotto termico, terrazzi e balconi, spiegate una per una: cosa comprendono, quando servono, come si misurano e quanto costano. Lavoriamo a Roma e nel Lazio per condomini e case private.',
    prezzi: true, iva: ' + IVA',
    notaPrezzi: 'Prezzi del nostro listino per facciate e terrazzi, IVA esclusa. A questi importi si aggiungono gli oneri della sicurezza, calcolati all’8% dei lavori. Il prezzo definitivo si conferma dopo il sopralluogo gratuito e la verifica tecnica.' }
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
const UNITA = { 'm²': 'al m²', 'm': 'al metro lineare', 'n°': 'cadauno', 'n° punti': 'a punto', 'n° impianti': 'a impianto', 'n° bagni': 'a bagno', 'a corpo': 'a corpo',
  'm³': 'al m³', 'kg': 'al kg', 't': 'alla tonnellata' };

// testo del prezzo di una voce, con le stesse regole di calcolo del simulatore
function prezzo(it) {
  if (it.pg) return it.pg;
  if (it.tipo === 'scelta') return '';
  if (it.tipo === 'si' && !it.um && typeof it.p === 'number' && !it.f) return euro(it.p) + ' a corpo';
  if (it.quadro) return '750 € fino a 70 m² di casa, 1.000 € fino a 100 m², poi 250 € in più ogni 20 m²';
  if (it.perMq) return euro(it.p) + ' per ogni m² di casa';
  if (it.bagno) return euro(it.p) + ' a bagno fino a 5 m², poi ' + euro(it.extraMq) + ' per ogni m² in più';
  if (it.p30) return euro(it.p) + ' a corpo fino a 70 m² di casa, poi ' + euro(it.p30) + ' in più ogni 30 m²';
  if (typeof it.p !== 'number') return '';
  if (!UNITA[it.um]) throw new Error('Unità senza testo per il prezzo: ' + it.um + ' (' + it.id + ')');
  return euro(it.p) + ' ' + UNITA[it.um];
}

function prezzoOpz(o, it) {
  if (o.pg) return o.pg;
  if (o.fisso || typeof o.p !== 'number') return '';
  const um = o.um || it.um;
  if (!UNITA[um]) throw new Error('Unità senza testo per il prezzo: ' + um + ' (' + it.id + ')');
  return euro(o.p) + ' ' + UNITA[um];
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
      if (it.tipo === 'scelta') h += '\n<ul>' + it.opz.map(o => '<li><b>' + esc(o.d) + '</b>' + (o.x ? ': ' + esc(o.x.charAt(0).toLowerCase() + o.x.slice(1)) : '') +
        (p.prezzi && prezzoOpz(o, it) ? '<span class="guida-prezzo">Prezzo: ' + esc(prezzoOpz(o, it)) + esc(p.iva) + '</span>' : '') + '</li>').join('') + '</ul>';
      const pr = p.prezzi && prezzo(it);
      if (pr) h += '\n<span class="guida-prezzo">Prezzo: ' + esc(pr) + esc(p.iva) + '</span>';
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

// Listino della pagina infissi e serramenti, con i prezzi di js/infissi.js (+ IVA, imballaggio e trasporto inclusi)
function listinoInfissi() {
  const src = fs.readFileSync(path.join(radice, 'js/infissi.js'), 'utf8');
  const P = new Function('return ' + src.match(/var P = (\{[\s\S]*?\n  \});/)[1])();
  const MULT = new Function('return ' + src.match(/var MULT = (\{[^}]*\})/)[1])();
  const iva = ' + IVA';
  const v = (dt, dd, prezzi) => '<dt>' + esc(dt) + '</dt>\n<dd>' + esc(dd) + prezzi.map(x => '\n<span class="guida-prezzo">' + esc(x) + iva + '</span>').join('') + '</dd>\n';
  const blocco = (titolo, sotto, voci) => '<details>\n<summary><h3>' + esc(titolo) + '</h3></summary>\n<p>' + esc(sotto) + '</p>\n<dl>\n' + voci.join('') + '</dl>\n</details>\n';
  const bat = k => ['Fino a 1 m²: ' + euro(P.piccola * MULT[k]) + ' a pezzo', 'Oltre 1 m²: ' + euro(P.bat * MULT[k]) + ' al m²'];
  const doppio = x => euro(x) + ' a pezzo fino a 3,22 m², ' + euro(2 * x) + ' fino a 6,44 m²';
  let h = '<section class="guida" id="listino-infissi" aria-labelledby="listino-t">\n<div class="guida-in">\n' +
    '<p class="guida-ey">LISTINO PREZZI</p>\n<h2 id="listino-t">Prezzi di infissi in PVC, tapparelle e zanzariere a Roma</h2>\n' +
    '<p class="guida-intro">I prezzi del nostro simulatore, voce per voce: infissi Rehau Synego e Synego Slide con doppio vetro, demolizione dei vecchi infissi, posa, tapparelle e zanzariere. Montiamo a Roma e in tutto il Lazio.</p>\n' +
    '<p class="guida-nota">Tutti i prezzi sono IVA esclusa e comprendono imballaggio e trasporto. Il prezzo di ogni infisso si calcola dalle misure: larghezza × altezza. Dal ' + P.pianoDa + '° piano demolizioni e pose costano il ' + Math.round(P.piano * 100) + '% in più. Il prezzo definitivo si conferma dopo il sopralluogo gratuito.</p>\n';
  h += blocco('Infissi in PVC Rehau Synego, doppio vetro', 'Finestre e porte-finestre a battente e scorrevoli. Il simulatore calcola i battenti fino a ' + P.maxInf + ' m² e gli scorrevoli fino a ' + P.maxSlide + ' m² a pezzo; per pezzi più grandi il prezzo si definisce al sopralluogo.', [
    v('Battente bianco', 'Finestra o porta-finestra a battente in PVC Rehau Synego bianco: i m² oltre il primo costano tutti allo stesso prezzo.', bat('std')),
    v('Battente nei colori Rehau', 'Mooreiche 2, Rovere dorato, Noce, Grigio antracite e Braun: ' + Math.round((MULT.base - 1) * 100) + '% in più rispetto al bianco.', bat('base')),
    v('Battente in colore speciale', 'Un colore a scelta dalla gamma Rehau: ' + Math.round((MULT.part - 1) * 100) + '% in più rispetto al bianco.', bat('part')),
    v('Scorrevole Synego Slide', 'Porta-finestra scorrevole con soglia ribassata, per aperture grandi.', ['Bianco: ' + euro(P.slideBianco) + ' al m²', 'Colori: ' + euro(P.slideColore) + ' al m²'])
  ]);
  h += blocco('Demolizione e posa', 'Il prezzo è a pezzo e raddoppia per gli infissi più grandi di 3,22 m²; oltre 6,44 m² si valuta al sopralluogo.', [
    v('Demolizione dei vecchi infissi', 'Smontaggio dei vecchi infissi, con smaltimento.', [doppio(P.demInf)]),
    v('Posa dei nuovi infissi', 'Posa in opera a regola d’arte dei nuovi infissi.', [doppio(P.posInf)])
  ]);
  h += blocco('Tapparelle in alluminio coibentato', 'Il prezzo è uguale per tutti i colori.', [
    v('Tapparella in alluminio coibentato', 'Si misura larghezza × altezza della tapparella.', [euro(P.tap) + ' al m²']),
    v('Smontaggio delle vecchie tapparelle', 'Da aggiungere solo se ci sono tapparelle da togliere.', [doppio(P.demTap)]),
    v('Posa delle nuove tapparelle', 'Montaggio della tapparella nuova.', [doppio(P.posTap)])
  ]);
  h += blocco('Zanzariere in alluminio', 'Avvolgenti per le finestre e plissettate per le porte-finestre, stesso prezzo per tutti i modelli e i colori; oltre 6,44 m² si valuta al sopralluogo.', [
    v('Zanzariera in alluminio', 'Si misura larghezza × altezza della zanzariera.', [euro(P.zan) + ' al m²']),
    v('Posa delle zanzariere', 'Montaggio della zanzariera sulla finestra o sulla porta-finestra.', [doppio(P.posZan)])
  ]);
  return h + '<p class="guida-fine">Vuoi il prezzo dei tuoi infissi? <a href="#simulatore">Usa il simulatore</a> con le tue misure oppure <a href="/#contatti">richiedi il sopralluogo</a>: sopralluogo e preventivo sono gratuiti.</p>\n</div>\n</section>';
}

{
  const file = path.join(radice, 'infissi-serramenti.html');
  let html = fs.readFileSync(file, 'utf8');
  const blocco = '<!-- LISTINO:INIZIO -->\n' + listinoInfissi() + '\n<!-- LISTINO:FINE -->';
  if (html.includes('<!-- LISTINO:INIZIO -->')) html = html.replace(/<!-- LISTINO:INIZIO -->[\s\S]*?<!-- LISTINO:FINE -->/, blocco);
  else {
    // la prima volta: subito dopo il simulatore
    const i = html.indexOf('</section>', html.indexOf('<section id="simulatore"')) + '</section>'.length;
    html = html.slice(0, i) + '\n\n' + blocco + html.slice(i);
  }
  fs.writeFileSync(file, html);
  console.log('Listino aggiornato: infissi-serramenti.html');
}
