/* Simulatore della ristrutturazione di interni (pagina /ristrutturazioni-interni), motore in js/simulatore.js.
   Prezzi dal listino MD Edil Group del 16/10/2026, IVA inclusa (decisione di Eugenio del 16/10/2026; vedi progetto/listino-prezzi.md).
   Ogni paragrafo si apre con Sì; il cliente indica la quantità di ogni voce che gli serve: le voci lasciate vuote non si calcolano.
   Sul sito non si mostrano i prezzi unitari, solo l'importo di ogni voce. */
(function () {
  // tipo: 'q' = quantità (m², m, n°); 'si' = a corpo (sì / no); mq: true = pulsante "usa la superficie"
  // p30: prezzo a corpo fino a 70 m², poi + p30 € ogni 30 m² (o frazione) in più (Eugenio, 16/10/2026)
  // d = titolo della voce, x = descrizione che si apre passando sopra il titolo o toccandolo (testi originali MD Edil Group)
  var SEZ = [
    { id: 'demol', t: 'Demolizioni e rimozioni', s: 'Smontiamo e portiamo via ciò che va rifatto. Dove indicato, carico, trasporto e smaltimento in discarica autorizzata sono compresi.', v: [
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
      { id: 'disEl', d: 'Smontaggio dell’impianto elettrico esistente', um: 'a corpo', p: 750, tipo: 'si', p30: 250,
        x: 'Rimozione di cavi, scatole, frutti e quadro del vecchio impianto in tutta la casa, per fare spazio al nuovo impianto a norma.' },
      { id: 'disId', d: 'Smontaggio dell’impianto idrico esistente', um: 'a corpo', p: 750, tipo: 'si', p30: 250,
        x: 'Rimozione delle vecchie tubazioni di carico e scarico in tutta la casa, prima di realizzare l’impianto nuovo.' }
    ] },
    { id: 'bagno', t: 'Bagno chiavi in mano', s: 'Un solo importo per tutte le lavorazioni del bagno. Non indicare di nuovo queste lavorazioni nelle altre voci.', v: [
      { id: 'bagno', d: 'Rifacimento completo del bagno', um: 'n° bagni', p: 6500, extraMq: 350, bagno: true,
        x: 'Dal vecchio bagno al nuovo, senza pensieri: smontaggio dei sanitari, demolizione di pavimenti, rivestimenti e sottofondi con smaltimento, nuovo massetto, nuovi impianti idrico ed elettrico con le opere murarie, impermeabilizzazione della doccia, posa di pavimento e rivestimenti, rasatura e pittura, montaggio di sanitari, rubinetteria, piatto e box doccia, scaldasalviette e accessori, collaudo con dichiarazioni di conformità e pulizia finale. Il prezzo vale per un bagno fino a 5 m²: per un bagno più grande indica la sua superficie. I materiali sono compresi; restano esclusi i rivestimenti e gli accessori del bagno, che sceglierai con noi.' }
    ] },
    { id: 'murarie', t: 'Opere murarie', s: 'Nuove pareti, sottofondi e intonaci per ridisegnare gli spazi.', v: [
      { id: 'tramez', d: 'Costruzione di nuovi tramezzi', um: 'm²', p: 87.7,
        x: 'Nuove pareti divisorie in muratura per cambiare la distribuzione degli ambienti. Si misura la superficie della parete: lunghezza × altezza.' },
      { id: 'contel', d: 'Controtelaio per porta scorrevole a scomparsa', um: 'n°', p: 370,
        x: 'Fornitura e montaggio del controtelaio metallico che si inserisce nella parete e accoglie l’anta scorrevole. La posa della porta si indica a parte, nella sezione delle porte.' },
      { id: 'intona', d: 'Intonaco grezzo', um: 'm²', p: 26.5,
        x: 'Primo strato di intonaco su pareti nuove o da ripristinare: è la base per rasatura e pittura.' },
      { id: 'massNu', d: 'Nuovo massetto in sabbia e cemento', um: 'm²', p: 34.5, mq: true,
        x: 'Sottofondo tradizionale steso e livellato, pronto per la posa del nuovo pavimento.' }
    ] },
    { id: 'clima', t: 'Climatizzazione', s: 'Impianti per rinfrescare e riscaldare con i condizionatori.', v: [
      { id: 'clima', d: 'Impianto di climatizzazione con un motore esterno e due split', um: 'n° impianti', p: 1170,
        x: 'Posa delle tubazioni tra il motore esterno e i due split interni, scarico della condensa, opere murarie e installazione. I condizionatori li scegliamo insieme: la fornitura è esclusa.' }
    ] },
    { id: 'elettrico', t: 'Impianto elettrico', s: 'Impianto nuovo, eseguito da tecnici abilitati e consegnato con dichiarazione di conformità.', v: [
      { id: 'punti', d: 'Punti luce e prese', um: 'n° punti', p: 95,
        x: 'Ogni punto è un’uscita per una luce o una presa, a parete, a pavimento o a soffitto: comprende linee, scatole, frutti tipo BTicino e opere murarie. Per orientarti: circa un punto per ogni metro quadro di casa.' },
      { id: 'quadro', d: 'Nuovo quadro elettrico', um: 'a corpo', p: 750, tipo: 'si', quadro: true,
        x: 'Nuovo quadro con le protezioni dell’impianto, dimensionato sulla superficie della casa.' }
    ] },
    { id: 'idrico', t: 'Impianto idrico e riscaldamento', s: 'Acqua, scarichi e termosifoni, con dichiarazione di conformità.', v: [
      { id: 'centr', d: 'Collettore di distribuzione collegato alla caldaia', um: 'n°', p: 679,
        x: 'Predisposizione e montaggio della centralina da cui partono le tubazioni verso i termosifoni, con il collegamento alla caldaia.' },
      { id: 'radiat', d: 'Allaccio e posa di termosifoni', um: 'n°', p: 475,
        x: 'Tubazioni in multistrato fino a ogni termosifone, opere murarie e montaggio del nuovo termosifone. Fornitura dei termosifoni esclusa. Lo scaldasalviette del bagno è già compreso nel bagno chiavi in mano.' },
      { id: 'caldaia', d: 'Installazione della caldaia a gas', um: 'n°', p: 770,
        x: 'Montaggio e collegamento della nuova caldaia. La caldaia la scegli tu o la scegliamo insieme: fornitura esclusa.' },
      { id: 'pAcqua', d: 'Nuovo punto acqua con scarico', um: 'n°', p: 435,
        x: 'Un attacco completo di acqua e scarico per lavello, lavatrice, lavastoviglie, lavabo o altri apparecchi, con le opere murarie.' }
    ] },
    { id: 'gas', t: 'Impianto gas', s: 'Linee del gas realizzate secondo le norme di sicurezza.', v: [
      { id: 'gasCuc', d: 'Linea del gas dal contatore alla cucina', um: 'n°', p: 750,
        x: 'Nuova tubazione dal contatore al piano cottura, con la valvola di chiusura prevista dalla normativa.' },
      { id: 'gasCal', d: 'Linea del gas per la caldaia', um: 'n°', p: 550,
        x: 'Tubazione che porta il gas fino alla caldaia, con il collegamento.' }
    ] },
    { id: 'pavimenti', t: 'Pavimenti, rivestimenti e porte', s: 'Posa dei materiali che scegli con noi: la fornitura è esclusa.', v: [
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
    { id: 'cartongesso', t: 'Opere in cartongesso', s: 'Controsoffitti, pareti leggere e dettagli per l’illuminazione.', v: [
      { id: 'ctrSof', d: 'Controsoffitto in cartongesso', um: 'm²', p: 55,
        x: 'Struttura metallica e lastre da 13 mm con giunti stuccati in due mani, pronto per rasatura e pittura. Serve per abbassare i soffitti, nascondere gli impianti e inserire i faretti.' },
      { id: 'divCar', d: 'Parete divisoria in cartongesso', um: 'm²', p: 75,
        x: 'Parete leggera spessa 10 cm, con struttura metallica e lastre sui due lati: si monta in poco tempo e si può attrezzare con impianti e nicchie.' },
      { id: 'velette', d: 'Velette e mensole per luci LED', um: 'm', p: 85,
        x: 'Elementi in cartongesso sagomati che nascondono le strisce LED e creano luce indiretta su soffitti e pareti. Si misurano in metri lineari.' }
    ] },
    { id: 'tinte', t: 'Rasature e tinteggiature', s: 'Si contano i m² di pareti e soffitti: in una stanza sono circa 4 volte la superficie del pavimento.', v: [
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
    { id: 'oneri', t: 'Oneri di cantiere e pulizia', s: 'Voci da scegliere in base al tuo cantiere.', v: [
      { id: 'sicur', d: 'Sicurezza e allestimento del cantiere', um: 'a corpo', p: 1100, tipo: 'si', p30: 250,
        x: 'Montaggio e smontaggio del cantiere e misure di sicurezza previste dalla legge, per chi lavora e per chi abita.' },
      { id: 'tiro', d: 'Carico e scarico dei materiali (tiro in alto e calo in basso)', um: 'a corpo', p: 1400, tipo: 'si', p30: 250,
        x: 'Movimentazione di tutti i materiali del cantiere, a qualsiasi piano, anche al piano terra: salita e consegna dei materiali nuovi, discesa e carico delle macerie.' },
      { id: 'pulizia', d: 'Pulizia finale del cantiere', um: 'm²', p: 6, mq: true,
        x: 'Pulizia completa della casa a fine lavori, pronta da abitare. Si calcola sui m² della casa.' }
    ] },
    { id: 'progetto', t: 'Progetto e pratiche', fuoriLavori: true, s: 'Il progetto e i permessi, seguiti dal nostro studio tecnico.', v: [
      { id: 'proget', d: 'Progetto e pratiche edilizie (CILA / SCIA)', um: 'a corpo', p: 40, tipo: 'si', perMq: true,
        x: 'Rilievo della casa, progetto con le tavole esecutive e degli impianti e presentazione della pratica al Comune. L’importo si calcola sulla superficie.' }
    ] }
  ];
  var CENTRO = 0.05; // centro storico / ZTL: +5% sui lavori
  // quadro elettrico: 750 € fino a 70 m², 1.000 € fino a 100 m², poi +250 € ogni 20 m²
  var quadro = function (mq) { return mq <= 70 ? 750 : mq <= 100 ? 1000 : 1000 + Math.ceil((mq - 100) / 20) * 250; };

  // regole di calcolo particolari
  SEZ.forEach(function (s) {
    s.v.forEach(function (it) {
      if (it.p30) it.f = function (c) { return it.p + (c.mq > 70 ? Math.ceil((c.mq - 70) / 30) * it.p30 : 0); };
      if (it.quadro) it.f = function (c) { return quadro(c.mq); };
      if (it.perMq) { it.f = function (c) { return it.p * c.mq; }; it.qPdf = function (c) { return String(c.mq).replace('.', ',') + ' m²'; }; }
      if (it.bagno) {
        it.extra = { id: 'bagnoMq', um: 'm² per bagno', ph: '5' };
        it.f = function (n, c) { return n * (it.p + Math.max(0, (c.num(c.q.bagnoMq) || 5) - 5) * it.extraMq); };
        it.dPdf = function (c) { return ' (' + String(c.num(c.q.bagnoMq) > 5 ? c.q.bagnoMq : 5).replace('.', ',') + ' m² per bagno)'; };
      }
    });
  });

  window.MDSimulatore({
    id: 'ristrutturazioni-interni',
    oggetto: 'della ristrutturazione',
    iva: 'IVA inclusa',
    perMq: 'al m²',
    superficie: { label: 'Superficie interna (m²)', es: 'es. 70', pdf: 'Superficie interna', obbligatoria: true },
    manca: 'la superficie e almeno una lavorazione',
    vuoto: 'Indica la superficie e le lavorazioni che ti servono',
    domande: [
      { k: 'piano', t: 'A che piano si trova?', pdf: 'Piano', def: 'basso', opz: [['basso', 'Villa, casa indipendente o fino al 1° piano'], ['alto', '2° piano o superiore']] },
      { k: 'centro', t: 'È in centro storico o in ZTL?', pdf: 'Centro storico o ZTL', def: 'no', opz: [['si', 'Sì'], ['no', 'No']] }
    ],
    sezioni: SEZ,
    extra: function (c) {
      return [{ label: 'Centro storico / ZTL', v: c.dom.centro === 'si' ? c.lavori * CENTRO : 0, pdfT: 'Maggiorazioni', pdfD: 'Lavori in centro storico o ZTL (+5% sui lavori)' }];
    },
    pdf: {
      tipo: 'Ristrutturazione di interni',
      iva: 'IVA inclusa',
      // modalità di pagamento: solo nel PDF, mai sulle pagine del sito; IBAN scritto al contrario e codificato, come l'email
      pagamento: function () {
        return { rate: [['Primo saldo', 30], ['Secondo saldo', 30], ['Terzo saldo', 35], ['Alla fine dei lavori', 5]], banca: 'Intesa Sanpaolo S.p.A.', intestatario: 'MD EDIL GROUP S.R.L.S.',
          iban: atob('Mzc2NjEwMDAwMDAxMDQyOTM5NjAzMEk0M1RJ').split('').reverse().join('') };
      },
      note: ['Preventivo indicativo calcolato con il listino MD Edil Group in base alle quantità indicate dal cliente. Prezzi IVA inclusa.',
        'Il prezzo definitivo viene confermato dopo il sopralluogo, con le misure prese dai nostri tecnici, e con la firma del contratto. Sopralluogo e preventivo sono gratuiti.',
        'Esclusa la fornitura di pavimenti, rivestimenti, sanitari, rubinetteria, porte, termosifoni, caldaie, condizionatori e accessori, che sceglierai con noi (nel bagno chiavi in mano i materiali sono compresi, esclusi rivestimenti e accessori). Infissi esclusi.',
        'Tutti i lavori sono eseguiti dai nostri tecnici abilitati e gli impianti sono consegnati con dichiarazione di conformità.']
    }
  });
})();
