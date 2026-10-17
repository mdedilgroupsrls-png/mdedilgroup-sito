/* Simulatore delle ristrutturazioni esterne e facciate (pagina /ristrutturazioni-esterni), motore in js/simulatore.js.
   Prezzi dal listino "MD Edil Group Esterni 2026" del 17/10/2026, IVA esclusa (vedi progetto/listino-prezzi.md).
   Ogni paragrafo si apre con Sì. Le lavorazioni che si escludono (tipo di cappotto, rasatura, finitura,
   metodo per i terrazzi, impermeabilizzazione) sono scelte alternative: se ne può scegliere una sola.
   Regole del listino: il cappotto EPS comprende già rasatura armata e finitura standard; il rasante termoisolante
   va completato con finitura a calce o intonachino; l'intonachino è già colorato e non va pitturato.
   Oneri della sicurezza: 8% dei lavori scelti, calcolati da soli. Testi delle voci originali MD Edil Group. */
(function () {
  var sistema = function (c) { return c.sel.sistema || ''; };
  var metodo = function (c) { return c.sel.metodo || ''; };
  var SICUREZZA = 0.08;

  var SEZ = [
    { id: 'cantiere', t: 'Cantiere, ponteggi e sollevamento dei materiali', s: 'Tutto quello che serve per lavorare in sicurezza sulle facciate: ponteggio a norma, servizi per gli operai e mezzi per portare i materiali ai piani.', v: [
      { id: 'canAll', tipo: 'si', p: 1800, d: 'Allestimento e smontaggio del cantiere',
        x: 'Preparazione dell’area di lavoro prima di iniziare: bagno chimico e spogliatoio per gli operai, recinzioni e cartelli di cantiere. A fine lavori smontiamo tutto e lasciamo l’area pulita.' },
      { id: 'pon1', um: 'm²', p: 18, mq: true, d: 'Ponteggio per facciate: montaggio, smontaggio e primo mese',
        x: 'Ponteggio a norma di sicurezza montato lungo le facciate da ristrutturare. Il prezzo comprende montaggio, smontaggio finale e i primi 30 giorni di noleggio. Si misura in metri quadrati di facciata coperta dal ponteggio.' },
      { id: 'pon2', um: 'mesi in più', p: 2, d: 'Noleggio del ponteggio oltre il primo mese',
        f: function (n, c) { return n * 2 * c.num(c.q.pon1); },
        x: 'Per ogni periodo di 30 giorni oltre il primo, calcolato sui m² di ponteggio indicati nella voce precedente.' },
      { id: 'ponPrg', tipo: 'si', p: 550, d: 'Progetto del ponteggio',
        x: 'Progetto e calcolo del ponteggio firmati da un tecnico abilitato, necessari quando la normativa sulla sicurezza lo richiede.' },
      { id: 'acqua', tipo: 'si', p: 650, d: 'Acqua e corrente di cantiere ai piani',
        x: 'Impianto provvisorio che porta acqua e corrente elettrica lungo il ponteggio, così le squadre lavorano a ogni piano senza usare gli impianti di casa o del condominio.' },
      { id: 'solleva', tipo: 'scelta', um: 'mesi', nessuno: 'Nessun mezzo di sollevamento', d: 'Sollevamento dei materiali ai piani',
        x: 'Mezzo meccanico per portare in quota sacchi, pannelli e attrezzature. Scegli il mezzo adatto al cantiere e indica per quanti mesi serve: il prezzo comprende montaggio, smontaggio e noleggio.',
        opz: [
          { v: 'argano', d: 'Argano per materiali fino a 200 kg', x: 'Montaggio e smontaggio, più il noleggio mensile', um: 'mesi', f: function (n) { return 350 + 615 * n; } },
          { v: 'montacarichi', d: 'Montacarichi per materiali fino a 500 kg', x: 'Montaggio e smontaggio, più il noleggio mensile', um: 'mesi', f: function (n) { return 900 + 1300 * n; } }
        ] },
      { id: 'tiroSu', um: 'm³', p: 32.02, d: 'Tiro in alto dei materiali con elevatore',
        x: 'Salita dei materiali ai piani con elevatore meccanico, misurata in metri cubi. Se non conosci il volume lascia vuoto: lo calcoliamo noi al sopralluogo.' },
      { id: 'tiroGiu', um: 'm³', p: 32.02, d: 'Calo in basso di macerie e materiali',
        x: 'Discesa a terra di macerie e materiali con elevatore meccanico, misurata in metri cubi. Se non conosci il volume lascia vuoto: lo calcoliamo noi al sopralluogo.' }
    ] },
    { id: 'ripristini', t: 'Risanamento e ripristino delle facciate', s: 'Prima delle finiture si risanano le parti danneggiate: intonaco staccato, crepe, ferri d’armatura scoperti, frontalini e sottobalconi.', v: [
      { id: 'spicc', um: 'm²', p: 3.5, d: 'Spicconatura dell’intonaco ammalorato', x: 'Rimozione a mano dell’intonaco staccato, rigonfio o instabile, solo nei punti da ripristinare. È il primo passo per una facciata sana.' },
      { id: 'pitture', um: 'm²', p: 7.2, mq: true, d: 'Rimozione delle vecchie pitture', x: 'Asportazione delle pitture che si sfogliano o si polverizzano, per dare alle nuove finiture un fondo pulito e aderente.' },
      { id: 'demLoc', um: 'm²', p: 18.5, d: 'Demolizione delle parti di facciata ammalorate', x: 'Demolizione mirata delle zone di facciata rovinate da umidità, gelo o infiltrazioni, prima della ricostruzione con materiali nuovi.' },
      { id: 'intonaco', um: 'm²', p: 23.5, d: 'Ripristino dell’intonaco di facciata', x: 'Nuovo intonaco premiscelato steso dove quello vecchio è stato rimosso, fino a 2 cm per ogni strato, per ricostruire una superficie uniforme.' },
      { id: 'crepe', um: 'm', p: 24, d: 'Riparazione delle crepe in facciata', x: 'Le crepe vengono aperte, armate con rete localizzata e richiuse, così non si riaprono sotto le nuove finiture. Si misura in metri lineari di crepa.' },
      { id: 'ferri', um: 'm²', p: 18, d: 'Trattamento anticorrosivo dei ferri d’armatura', x: 'Pulizia dei ferri del cemento armato rimasti scoperti e protezione con prodotto anticorrosivo, per fermare la ruggine che gonfia e spacca il calcestruzzo.' },
      { id: 'copriferro', um: 'm²', p: 68, d: 'Ripristino del calcestruzzo e del copriferro', x: 'Ricostruzione del calcestruzzo intorno ai ferri con malta strutturale tissotropica di classe R4, spessore di circa 3 cm. Si usa su pilastri, travi, frontalini e cornicioni.' },
      { id: 'balSpicc', um: 'm²', p: 8, d: 'Spicconatura sotto balconi e tettoie', x: 'Rimozione dell’intonaco staccato nella parte inferiore di balconi e tettoie, il punto dove più spesso cadono frammenti.' },
      { id: 'balDem', um: 'm²', p: 30, d: 'Demolizione di frontalini e sottobalconi ammalorati', x: 'Demolizione delle parti rovinate del bordo frontale e della parte inferiore dei balconi, prima del ripristino del calcestruzzo.' }
    ] },
    { id: 'finiture', t: 'Cappotto termico, rasatura e finitura', s: 'Scegli una sola soluzione per ogni passaggio: il simulatore ti mostra solo le combinazioni corrette, senza lavorazioni doppie.',
      area: { label: 'Superficie delle facciate da trattare (m²)', default: 'mq', hint: 'Se la lasci vuota vale la superficie delle facciate indicata in alto.' }, v: [
      { id: 'sistema', tipo: 'scelta', q: 'area', um: 'm²', nessuno: 'Nessun isolamento termico', d: 'Isolamento termico della facciata (cappotto)',
        x: 'Il cappotto termico isola le pareti dall’esterno: meno dispersioni di calore, case più calde d’inverno e più fresche d’estate, bollette più leggere. Scegli una sola soluzione: il cappotto in EPS comprende già rasatura e finitura.',
        opz: [
          { v: 'cap12', d: 'Cappotto in EPS grafitato da 12 cm', x: 'Rasatura armata e finitura standard già comprese', p: 75 },
          { v: 'cap14', d: 'Cappotto in EPS grafitato da 14 cm', x: 'Rasatura armata e finitura standard già comprese', p: 85 },
          { v: 'eco', d: 'Rasante termoisolante Econanosil Eco 2 (circa 1 cm)', x: 'Con rete in fibra di vetro; la finitura si sceglie qui sotto', p: 95 }
        ] },
      { id: 'notaCap', tipo: 'nota', se: function (c) { return /^cap/.test(sistema(c)); },
        d: 'Il cappotto comprende già la rasatura armata e la finitura standard: non serve aggiungere altro.' },
      { id: 'rasatura', tipo: 'scelta', q: 'area', um: 'm²', nessuno: 'Nessuna rasatura', d: 'Rasatura delle facciate',
        se: function (c) { return !sistema(c); },
        x: 'Strato sottile che rende la facciata liscia e uniforme prima della finitura. Con la rete in fibra di vetro è più resistente alle microfessure.',
        opz: [
          { v: 'fine', d: 'Rasatura fine, pronta per la pittura', x: 'Per facciate sane con piccole imperfezioni', p: 26 },
          { v: 'armata', d: 'Rasatura armata in due mani con rete in fibra di vetro', x: 'Più resistente: consigliata con microfessure diffuse', p: 32 }
        ] },
      { id: 'finitura', tipo: 'scelta', q: 'area', um: 'm²', nessuno: 'Nessuna finitura', d: 'Finitura e colore della facciata',
        se: function (c) { return !/^cap/.test(sistema(c)); },
        x: 'L’ultimo strato, quello che si vede: protegge la facciata e le dà il colore.',
        opz: [
          { v: 'calce', d: 'Finitura minerale a calce', x: 'Molto traspirante, indicata per edifici storici e muri che devono respirare', p: 19 },
          { v: 'intonachino', d: 'Intonachino colorato, con fondo', x: 'Già colorato: non serve la pittura', p: 25 },
          { v: 'silossanica', d: 'Pittura silossanica, con fissativo e due mani', x: 'Respinge l’acqua e lascia traspirare il muro', p: 13, se: function (c) { return sistema(c) !== 'eco'; } }
        ] }
    ] },
    { id: 'lattonerie', t: 'Soglie, lattonerie e ringhiere', s: 'Gli elementi che proteggono la facciata dall’acqua piovana e le ringhiere da rinnovare.', v: [
      { id: 'soglie', tipo: 'scelta', um: 'm', nessuno: 'Nessun intervento', d: 'Soglie, davanzali e copertine in travertino',
        x: 'Puoi rinnovare le soglie esistenti con pulizia e carteggiatura (si misura in m²) oppure sostituirle con elementi nuovi in travertino (si misura in metri lineari).',
        opz: [
          { v: 'pulizia', d: 'Pulizia e carteggiatura', x: 'Si misura in metri quadrati', um: 'm²', p: 18 },
          { v: 'sostituzione', d: 'Rimozione e sostituzione con travertino nuovo', x: 'Si misura in metri lineari', um: 'm', p: 115 }
        ] },
      { id: 'scoss', um: 'm', p: 33, d: 'Scossaline in lamiera preverniciata', x: 'Fornitura e posa delle lamiere sagomate che proteggono dall’acqua piovana la sommità di muretti, cornicioni e parapetti. Si misurano in metri lineari.' },
      { id: 'gronde', um: 'm', p: 45, d: 'Grondaie in alluminio preverniciato', x: 'Fornitura e posa di nuove grondaie per raccogliere l’acqua del tetto ed evitare che coli sulla facciata appena rifatta. Si misurano in metri lineari.' },
      { id: 'pluviali', um: 'm', p: 32, d: 'Pluviali in alluminio preverniciato', x: 'Fornitura e posa dei tubi verticali che portano a terra l’acqua delle grondaie. Si misurano in metri lineari.' },
      { id: 'ringhiere', um: 'm', p: 65, d: 'Verniciatura delle ringhiere in ferro', x: 'Ringhiere alte circa 1,10 m: sverniciatura e preparazione del ferro, una mano di antiruggine e due mani di smalto. Si misurano in metri lineari.' }
    ] },
    { id: 'terrazzi', t: 'Terrazzi e balconi: impermeabilizzazione e pavimenti', s: 'Prima scegli come intervenire: rifacimento completo oppure impermeabilizzazione sopra il pavimento esistente.',
      area: { label: 'Superficie di terrazzi e balconi (m²)', breve: 'superficie terrazzi' }, v: [
      { id: 'metodo', tipo: 'scelta', q: 'nulla', nessuno: 'Non ancora scelto', d: 'Come vuoi rifare terrazzi e balconi?',
        x: 'Il rifacimento completo rinnova tutto, dal sottofondo al pavimento, ed è indicato quando ci sono infiltrazioni importanti. L’impermeabilizzazione senza demolizione è più rapida e lascia il pavimento esistente.',
        opz: [
          { v: 'trad', d: 'Rifacimento completo', x: 'Demolizione, nuovo massetto, impermeabilizzazione e nuovo pavimento', p: 0, fisso: true },
          { v: 'senza', d: 'Impermeabilizzazione senza demolire il pavimento', x: 'Telo armato applicato sopra le piastrelle esistenti', p: 0, fisso: true }
        ] },
      { id: 'terDem', um: 'm²', p: 33.5, mq: true, se: function (c) { return metodo(c) === 'trad'; }, d: 'Demolizione di pavimento e sottofondo del terrazzo',
        x: 'Demolizione del vecchio pavimento in gres e del sottofondo fino a 5 cm di spessore, con trasporto e smaltimento delle macerie in impianto autorizzato.' },
      { id: 'terDemX', um: 'cm in più', p: 7, se: function (c) { return metodo(c) === 'trad'; }, d: 'Sottofondo più spesso di 5 cm',
        f: function (n, c) { return n * 7 * c.num(c.q.terDem); },
        x: 'Per ogni centimetro di sottofondo da demolire oltre i 5 cm, calcolato sui m² della voce precedente.' },
      { id: 'guainaRim', um: 'm²', p: 6, mq: true, se: function (c) { return metodo(c) === 'trad'; }, d: 'Rimozione della vecchia guaina bituminosa',
        x: 'Rimozione della guaina impermeabile esistente a doppio strato. Trasporto e smaltimento si indicano nella voce seguente.' },
      { id: 'guainaSmalt', um: 'kg', p: 1.49, se: function (c) { return metodo(c) === 'trad'; }, d: 'Trasporto e smaltimento della vecchia guaina',
        x: 'Conferimento della guaina rimossa a un impianto autorizzato, misurato in chilogrammi. Se non conosci il peso lascia vuoto: lo calcoliamo al sopralluogo.' },
      { id: 'massetto', um: 'm²', p: 29.19, mq: true, se: function (c) { return metodo(c) === 'trad'; }, d: 'Nuovo massetto per terrazzi e balconi',
        x: 'Sottofondo in sabbia e cemento fino a 6 cm, con le giuste pendenze per lo scolo dell’acqua, pronto per l’impermeabilizzazione.' },
      { id: 'imperm', tipo: 'scelta', q: 'area', um: 'm²', nessuno: 'Nessuna impermeabilizzazione', se: function (c) { return metodo(c) === 'trad'; }, d: 'Impermeabilizzazione del terrazzo',
        x: 'Lo strato che impedisce all’acqua piovana di infiltrarsi sotto il pavimento e nelle case sottostanti. Scegline una sola: si calcola sulla superficie dei terrazzi indicata sopra.',
        opz: [
          { v: 'guaina1', d: 'Una guaina bituminosa da 4 mm, con primer', x: 'Per balconi e superfici piccole', p: 23 },
          { v: 'guaina2', d: 'Doppia guaina bituminosa da 4 mm, con primer', x: 'La protezione più robusta per i terrazzi', p: 39 },
          { v: 'cementizia', d: 'Impermeabilizzazione cementizia elastica (tipo Mapelastic)', x: 'Sottile e flessibile, segue i movimenti del supporto', p: 30 }
        ] },
      { id: 'gres', um: 'm²', p: 32, mq: true, se: function (c) { return metodo(c) === 'trad'; }, d: 'Posa del nuovo pavimento in gres da esterno',
        x: 'Posa con collante del gres porcellanato da esterno, resistente al gelo. Le piastrelle sono escluse: le scegli con noi.' },
      { id: 'battisc', um: 'm', p: 11, se: function (c) { return metodo(c) === 'trad'; }, d: 'Posa del battiscopa esterno', x: 'Posa del battiscopa lungo i muri del terrazzo, per proteggere l’attacco tra pavimento e parete. Piastrelle escluse; si misura in metri lineari.' },
      { id: 'bocch', um: 'n°', p: 175, se: function (c) { return metodo(c) === 'trad'; }, d: 'Bocchettoni di scarico dell’acqua',
        x: 'Ripristino o sostituzione dei bocchettoni da cui l’acqua esce dal terrazzo, con il raccordo impermeabile alla nuova impermeabilizzazione.' },
      { id: 'ten1', um: 'm²', p: 59, mq: true, se: function (c) { return metodo(c) === 'senza'; }, d: 'Impermeabilizzazione armata senza demolire il pavimento',
        x: 'Ciclo completo con telo in fibra applicato sopra le piastrelle esistenti: niente demolizioni, niente macerie, tempi ridotti. Garanzia assicurativa decennale Unipol, secondo le condizioni della polizza.' },
      { id: 'ten2', um: 'm', p: 16, se: function (c) { return metodo(c) === 'senza'; }, d: 'Raccordi, angoli e risvolti impermeabili',
        x: 'Rinforzi impermeabili lungo angoli, pareti e soglie, i punti dove l’acqua passa più facilmente, quando non sono già compresi nel ciclo principale.' },
      { id: 'ten3', um: 'm²', p: 12, mq: true, se: function (c) { return metodo(c) === 'senza'; }, d: 'Pulizia e ripristino delle fughe',
        x: 'Pulizia profonda del pavimento esistente e ripristino delle fughe rovinate, per un terrazzo pulito e protetto.' }
    ] },
    { id: 'rifiuti', t: 'Smaltimento dei rifiuti edili', s: 'Per le macerie non già comprese nelle demolizioni.', v: [
      { id: 'rif', um: 't', p: 60, d: 'Smaltimento di macerie e rifiuti edili',
        x: 'Carico, trasporto e conferimento in impianto autorizzato dei rifiuti edili non pericolosi non già compresi nelle demolizioni. Si misura in tonnellate: se non lo sai lascia vuoto, lo calcoliamo al sopralluogo.' }
    ] }
  ];

  window.MDSimulatore({
    id: 'ristrutturazioni-esterni',
    testa: 'L’edificio',
    oggetto: 'per la facciata',
    iva: '+ IVA',
    perMq: 'al m² di facciata',
    superficie: { label: 'Superficie delle facciate (m²)', es: 'es. 300', pdf: 'Superficie delle facciate', hint: 'Lunghezza × altezza di ogni facciata da rifare. Si usa per ponteggio, ripristini e finiture.' },
    vuoto: 'Scegli le lavorazioni che ti servono',
    domande: [
      { k: 'edificio', t: 'Che tipo di edificio è?', pdf: 'Edificio', def: 'casa', opz: [['casa', 'Villa o casa indipendente'], ['condominio', 'Condominio']] }
    ],
    sezioni: SEZ,
    extra: function (c) {
      return [{ label: 'Oneri della sicurezza (8%)', v: c.lavori * SICUREZZA, pdfT: 'Oneri della sicurezza', pdfD: 'Oneri della sicurezza: 8% dei lavori (stima, da verificare sul piano di sicurezza)' }];
    },
    pdf: {
      tipo: 'Ristrutturazione esterna e facciate',
      iva: 'IVA di legge esclusa',
      note: ['Preventivo indicativo calcolato con il listino MD Edil Group in base alle quantità indicate dal cliente. Prezzi IVA esclusa: l’IVA si applica con l’aliquota di legge.',
        'Il prezzo definitivo viene confermato dopo il sopralluogo e la verifica tecnica, con le misure prese dai nostri tecnici, e con la firma del contratto. Sopralluogo e preventivo sono gratuiti.',
        'Gli oneri della sicurezza sono stimati all’8% dei lavori: l’importo effettivo si definisce con il piano di sicurezza del cantiere.',
        'Esclusa la fornitura delle piastrelle. Le voci lasciate vuote, come smaltimenti e trasporti dei materiali, si valutano al sopralluogo.']
    }
  });
})();
