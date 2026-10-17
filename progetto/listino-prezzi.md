# Listino prezzi MD Edil Group (ristrutturazioni interni)

> **Regola di Eugenio (17/10/2026): ogni simulatore usa SOLO il suo listino.** Le stesse lavorazioni (es. demolizione pavimento, massetto, posa gres, smaltimenti) hanno prezzi diversi tra interni ed esterni: non copiare mai un prezzo da un listino all'altro. Interni = `js/ristrutturazione.js` (IVA inclusa); esterni e facciate = `js/esterni.js` (**+ IVA**, IVA esclusa); infissi = `js/infissi.js` (+ IVA); case in legno (IVA inclusa).


**Listino del 16/10/2026** (PDF di Eugenio "Listino prezzi ristrutturazione MD Edil Group", formato computo metrico). Nel PDF c'è scritto IVA esclusa, ma **Eugenio ha deciso (16/10/2026, sera) che per la simulazione e il preventivo delle ristrutturazioni interne i prezzi sono IVA INCLUSA**: stessi importi, sul sito e nel PDF si scrive "IVA inclusa" (non vale per gli infissi, che restano "+ IVA"). È lo stesso del simulatore della pagina `/ristrutturazioni-interni` (`js/ristrutturazione.js`), che **sostituisce il listino precedente** (15,21 €/m² rimozione pavimenti, 90 € punto luce, Tariffa Regione Lazio ecc.: non più usato).

Il PDF nasce dalla revisione, fatta da Eugenio, di un prospetto di un'altra impresa: **sul sito non vanno mai i codici delle voci (01.03, 02.06…) né il nome di altre imprese**; le descrizioni sul sito sono riscritte in parole nostre.

Regole del documento: la posa della ceramica è in due sezioni (02.13 e 08.01) ma **si conta una volta sola** (nel simulatore solo in "Pavimenti"); le lavorazioni del **bagno completo** non si sommano di nuovo alle voci singole. Fornitura di materiali (gres, sanitari, porte, termosifoni, caldaia, condizionatori…) **sempre esclusa**.

| Sezione | Voce | U.M. | Prezzo € |
|---|---|---|---|
| Demolizioni | Pavimento ceramico: rimozione e discarica, massetto escluso | m² | 17,50 |
| Demolizioni | Pavimento ceramico: rimozione con massetto fino a 5 cm e discarica | m² | 33,50 |
| Demolizioni | Controsoffitto in cartongesso: demolizione e discarica | m² | 25,50 |
| Demolizioni | Tramezzi da 4,5 a 10 cm: demolizione | m² | 25,15 |
| Demolizioni | Porte interne: smontaggio, demolizione e discarica | cad. | 93,00 |
| Demolizioni | Radiatore: rimozione | cad. | 55,70 |
| Demolizioni | Zoccolino in legno o ceramica: rimozione | m | 5,50 |
| Demolizioni | Parquet: demolizione e discarica | m² | 26,70 |
| Demolizioni | Protezione pavimenti con cartone ondulato | m² | 5,25 |
| Demolizioni | Dismissione impianto elettrico, fino a 70 m² | a corpo | 750,00 |
| Demolizioni | Dismissione impianto idrico, fino a 70 m² | a corpo | 750,00 |
| Bagni | Bagno completo fino a 5 m² (tutto incluso tranne la fornitura) | a corpo | 6.500,00 |
| Bagni | Ogni m² oltre i 5 m² (Eugenio, 16/10/2026) | m² | 350,00 |
| Muratura | Nuovi divisori in tramezzi | m² | 87,70 |
| Muratura | Controtelaio porta scorrevole a scomparsa, fornitura e posa | cad. | 370,00 |
| Muratura | Intonacatura grezza | m² | 26,50 |
| Muratura | Massetto tradizionale sabbia-cemento | m² | 34,50 |
| Muratura | (Posa ceramica fino a 60×60: uguale a "Pavimenti", non si conta due volte) | m² | 44,50 |
| Aria condizionata | Predisposizione e installazione 1 motore + 2 split, fornitura esclusa | a corpo | 1.170,00 |
| Elettrico | Punto elettrico (luce o presa), frutti tipo BTicino e assistenza muraria | punto | 95,00 |
| Elettrico | Centralino elettrico fino a 70 m² | cad. | 750,00 |
| Idrico | Centralina distributiva con raccordo alla caldaia | cad. | 679,00 |
| Idrico | Tubazioni multistrato per radiatore/scaldasalviette + posa radiatore, fornitura esclusa | cad. | 475,00 |
| Idrico | Caldaia a gas: installazione | cad. | 770,00 |
| Idrico | Punto acqua completo di adduzione e scarico | cad. | 435,00 |
| Gas | Tubazione gas dal contatore alla cucina, con intercettazione a norma | cad. | 750,00 |
| Gas | Tubazione gas della caldaia | a corpo | 550,00 |
| Pavimenti | Posa pavimento ceramico fino a 60×60 | m² | 44,50 |
| Pavimenti | Posa rivestimento ceramico a parete fino a 60×60 | m² | 47,50 |
| Pavimenti | Zoccolino in legno o ceramica: posa | m | 8,00 |
| Pavimenti | Posa parquet | m² | 55,00 |
| Pavimenti | Porta battente: posa | cad. | 130,00 |
| Pavimenti | Porta scorrevole: posa | cad. | 230,00 |
| Cartongesso | Controsoffitto (orditura metallica, lastre 13 mm, giunti in due mani) | m² | 55,00 |
| Cartongesso | Divisorio piano, spessore 10 cm | m² | 75,00 |
| Cartongesso | Velette e ripiani per LED | m | 85,00 |
| Tinteggiature | Raschiatura pitture esistenti | m² | 3,00 |
| Tinteggiature | Rasatura pareti e soffitti con stucco in pasta (nel PDF "con ZTL": è un materiale rasante, spiegato da Eugenio il 16/10/2026; sul sito "rasante e stucco in pasta") | m² | 27,00 |
| Tinteggiature | Levigatura e isolante acrilico | m² | 5,00 |
| Tinteggiature | Pittura lavabile tinte chiare | m² | 13,50 |
| Tinteggiature | Pittura lavabile tinte intense | m² | 17,50 |
| Oneri | Tiro in alto e calo in basso, appartamento fino a 70 m² | a corpo | 1.400,00 |
| Oneri | Oneri di sicurezza con allestimento/disallestimento, fino a 70 m² | a corpo | 1.100,00 |
| Oneri | Pulizia finale di cantiere | m² | 6,00 |
| Progetto | Progetto e pratiche (deciso da Eugenio il 16/10/2026) | m² | 40,00 |

### Come lo usa il simulatore (deciso con Eugenio il 16/10/2026)
- Il cliente indica: superficie, piano (**"Villa, casa indipendente o fino al 1° piano"** oppure **"2° piano o superiore"**), centro storico/ZTL (+5% su lavori e oneri, regola di prima, mantenuta). Poi, **voce per voce nell'ordine del listino**, la quantità (m², m, n°) o Sì/No per le voci a corpo. **Voce vuota = non calcolata.**
- **Oneri di cantiere e pulizia: li sceglie il cliente** come le altre voci (correzione di Eugenio del 16/10/2026): sicurezza e allestimento (Sì/No), **tiro in alto e calo in basso (Sì/No) a qualsiasi piano**, anche piano terra e 1° piano, pulizia finale in m². La domanda sul piano resta, ma **non cambia più il prezzo** (serve per il sopralluogo e compare nel messaggio WhatsApp).
- Sul sito **non si mostrano i prezzi unitari**, solo l'importo di ogni voce e il totale "+ IVA" (come per gli infissi).
- Pulsanti: **"Invia la stima su WhatsApp"** (messaggio con tutte le voci) e **"Prenota il sopralluogo"**.
- **Regole confermate da Eugenio (16/10/2026):** **voci a corpo "fino a 70 m²" (smontaggio impianti elettrico e idrico, sicurezza e allestimento del cantiere, carico e scarico dei materiali): prezzo del listino fino a 70 m², poi +250 € ogni 30 m² in più o frazione** (es. smontaggio elettrico: 80 e 100 m² = 1.000 €, 101–130 m² = 1.250 €; sicurezza 80 m² = 1.350 €; tiro 80 m² = 1.650 €; regola di Eugenio del 16/10/2026 sera, sostituisce gli scaglioni da 70 m²); centralino elettrico oltre 70 m²: 1.000 € fino a 100 m², poi +250 € ogni 20 m²; centro storico/ZTL **+5%** sui lavori; bagno oltre 5 m²: **+350 € per ogni m² in più** (il cliente indica i m² di ogni bagno). "= superficie" è solo un aiuto per riempire le voci in m².

## Ristrutturazioni esterne e facciate (simulatore dal 17/10/2026)
Listino di Eugenio "MD Edil Group Esterni 2026 – Cappotto 75/85" del 17/10/2026, **IVA esclusa** (sul sito "+ IVA", nel PDF "IVA di legge esclusa"). Simulatore in `js/esterni.js`. I codici (CAN-01, FAC-05…) non vanno sul sito.

| Sezione del simulatore | Voce | U.M. | € |
|---|---|---|---|
| Cantiere | Allestimento e smobilizzo cantiere (bagno chimico, spogliatoio, segnaletica) | corpo | 1.800 |
| Cantiere | Ponteggio: montaggio, smontaggio e primo noleggio 30 gg | m² | 18 |
| Cantiere | Noleggio ponteggio per ogni 30 gg in più | m²/30gg | 2 |
| Cantiere | Progetto ponteggio, quando richiesto | cad. | 550 |
| Cantiere | Distribuzione provvisoria acqua e luce ai piani | corpo | 650 |
| Cantiere | Argano 200 kg: montaggio/smontaggio 350 + noleggio 615 al mese | cad./mese | 350 / 615 |
| Cantiere | Montacarichi 500 kg: montaggio/smontaggio 900 + noleggio 1.300 al mese | cad./mese | 900 / 1.300 |
| Cantiere | Tiro in alto / calo in basso con elevatore | m³ | 32,02 / 32,02 |
| Ripristini | Spicconatura localizzata | m² | 3,50 |
| Ripristini | Rimozione pitture deteriorate | m² | 7,20 |
| Ripristini | Demolizione localizzata parti ammalorate | m² | 18,50 |
| Ripristini | Ripristino intonaco premiscelato fino a 20 mm per strato | m² | 23,50 |
| Ripristini | Riparazione crepe con armatura localizzata | ml | 24 |
| Ripristini | Trattamento anticorrosivo armature | m² | 18 |
| Ripristini | Ripristino copriferro malta R4 circa 3 cm | m² | 68 |
| ~~Ripristini~~ | ~~Spicconatura intradossi balconi e tettoie~~ – tolta dal simulatore il 17/10/2026 (Eugenio: non serve) | m² | ~~8~~ |
| Ripristini | Demolizione frontalini e intradossi ammalorati | m² | 30 |
| Isolamento (scelta) | Cappotto EPS grafitato 12 cm, rasatura armata e finitura standard incluse | m² | 75 |
| Isolamento (scelta) | Cappotto EPS grafitato 14 cm, idem | m² | 85 |
| Isolamento (scelta) | Rasante termoisolante Econanosil Eco 2 circa 10 mm con rete, finitura esclusa (prezzo aziendale, da confermare col produttore) | m² | 95 |
| Rasatura (scelta, solo senza isolamento) | Rasatura fine pronta alla pittura / rasatura armata con rete | m² | 26 / 32 |
| Finitura (scelta, non con cappotto EPS) | Minerale a calce / intonachino colorato con fondo / pittura silossanica (non con Econanosil) | m² | 19 / 25 / 13 |
| Lattonerie | Soglie travertino: pulizia e carteggiatura (m²) oppure rimozione e sostituzione (ml) – scelta | m² / ml | 18 / 115 |
| Lattonerie | Scossalina 33, gronda 45, pluviale 32, ringhiera in ferro (antiruggine + 2 mani smalto) 65 | ml | |
| Terrazzi (metodo "rifacimento completo") | Demolizione pavimento e sottofondo fino a 5 cm (trasporto incluso) | m² | 33,50 |
| Terrazzi | Maggiorazione per ogni cm oltre 5 cm (sui m² demoliti) | m²/cm | 7 |
| Terrazzi | Rimozione guaina doppio strato (smaltimento escluso) | m² | 6 |
| Terrazzi | Trasporto e conferimento guaina | kg | 1,49 |
| Terrazzi | Massetto fino a 6 cm | m² | 29,19 |
| Terrazzi | Impermeabilizzazione (scelta): guaina con primer, primo strato (primer 4 + 1ª guaina 19) = **23**, oppure cementizia tipo Mapelastic **30**. Con la guaina si può aggiungere il **secondo strato +16** (voce Sì/No, sulla superficie dei terrazzi) – Eugenio 17/10/2026 | m² | |
| Terrazzi | Posa gres esterno (piastrelle escluse) 32 €/m²; battiscopa 11 €/ml; bocchettone 175 €/cad | | |
| Terrazzi (metodo "senza demolizione") | Impermeabilizzazione armata su pavimento esistente, garanzia Unipol 10 anni | m² | 59 |
| Terrazzi | Raccordi, angoli e risvolti 16 €/ml; pulizia e ripristino fughe 12 €/m² | | |
| Rifiuti | Carico, trasporto e conferimento inerti non pericolosi | t | 60 |
| Automatico | **Oneri della sicurezza: 8% dei lavori scelti** (stima commerciale, non percentuale di legge) | % | 8 |

Regole del simulatore (17/10/2026): ogni paragrafo si apre con Sì; le alternative sono scelte uniche (isolamento, rasatura, finitura, soglie, mezzo di sollevamento, metodo terrazzi, impermeabilizzazione). Con cappotto EPS spariscono rasatura e finitura; con Econanosil la finitura è solo calce o intonachino. Impermeabilizzazione: primo strato di guaina con primer (23) e, a scelta, secondo strato aggiuntivo (16), confermato da Eugenio il 17/10/2026. La superficie delle facciate non è obbligatoria: si può simulare anche solo il terrazzo (Eugenio, 17/10/2026). Modalità di pagamento nel PDF esterni come per gli interni (30/30/35/5%, calcolate sul totale IVA esclusa). Superficie delle facciate in alto, usata da "= superficie" e dal paragrafo isolamento/finitura se non si indica un'altra superficie.

## Case in legno
I prezzi delle case in legno sono **IVA inclusa**.

### Simulatore casa in legno (pagina `/case-in-legno`, dal 15/10/2026)
Fonte: PDF di Eugenio "Md Listino case legno chiavi in mano" (Prosto House Europe, 01.02.2026). Importi in euro, **IVA inclusa** come il catalogo. Ogni modello ha i suoi prezzi: non mescolarli.

Regole decise da Eugenio:
- **Kit di montaggio = prezzo della struttura del catalogo** (non si somma due volte).
- **Fondazione:** platea in cemento armato alta 30 cm, **230 €/m² × m² coperti** del catalogo (non si usa la fondazione del listino).
- **Piastrelle:** posa 39 €/m² (piastrelle del cliente) + **massetto 40 €/m²**, solo se si scelgono le piastrelle; m² proposti = m² utili del catalogo, modificabili. Laminato = prezzo del listino (fornitura e posa).
- Descrizioni modificate: posa piastrelle in bagno inclusa nelle pareti divisorie, altrove 39 €/m² (non 25), tinteggiatura 10 €/m²; elettrico con interruttori e prese tipo BTicino inclusi, corpi illuminanti esclusi; porte: installazione da 90 € (non 60); clima: "per riscaldamento e raffrescamento: motore con due split, solo predisposizione".
- **Esclusi dal sito:** finestra da tetto, finestre laterali (vasistas e fisse), pergola, porte d'ingresso in metallo e PVC, cucina, dotazione bagno. Esclusi anche i modelli del listino che non sono nel catalogo (Mobile 8x3, Double Barn Plus, Flat Small, Freya 68 m²).
- **Mini Barn Boutique:** nessuna simulazione, solo il prezzo chiavi in mano 29.900 € con la descrizione: inclusi impianto elettrico (prese, interruttori, corpi illuminanti), impianto idrico, tramezzi e rivestimenti interni; **terrazza esclusa** (decisione del 15/10/2026). Ha però il **trasporto** e si può scegliere il numero di case: per il Mini Barn Boutique **un trasporto per ogni casa**, 1,50 €/km × numero di case (2 case = 3 €/km, 3 case = 4,50 €/km…). Vale solo per questo modello.
- **A-Frame L** (non nel listino): kit 29.000 € del catalogo + optional dell'Aframe 49 m² aumentati in proporzione (×1,1514) in modo che kit e tutti gli optional, **esclusi** fondazione, aumento lunghezza e isolamento aggiuntivo, facciano **1.300 €/m² = 75.400 €** su 58 m². Aumento lunghezza e isolamento aggiuntivo sono aumentati con lo stesso coefficiente.
- **Olivia** (aggiunta il 15/10/2026, non nel listino): 90 m² coperti, 76,4 m² utili su due piani, terrazza 20,35 m², 3 camere, 2 bagni, struttura 54.000 €; nel simulatore usa gli optional della Nord House (95 m²), poi **tutti gli optional −10%** (decisione del 15/10/2026; fondazione e trasporto seguono le loro regole). Kit + optional: 135.092 € = 1.768 €/m² utile; trasporto come casa da 90 m².
- **Sconto impianti (15/10/2026):** se kit + optional (esclusi fondazione, aumento lunghezza, isolamento aggiuntivo e trasporto) superano **1.300 € per m² utile** del catalogo, **impianto elettrico e impianto idrico −20%**. Applicato una volta sola a: Barn Mini, Barn Light, Barn House, Freya Smart, A-frame, Barn Max Height, Flat House (2,2 e 2,7 m), Barn Double, Flat House 1.5, Nord House, Olivia, Fjord, Flat Double, Sherwood. Non applicato a A-Frame L (esattamente 1.300 €/m²), Norway, Siver, Montblanc (1.250 €/m²). Poi, lo stesso giorno, **ulteriore −20% su elettrico e idrico per tutti i modelli** (anche A-Frame L, Norway, Siver, Montblanc). Risultato: elettrico e idrico = listino × 0,64 per i 15 modelli del primo sconto, listino × 0,80 per gli altri 4. **La cifra tolta con l'ultimo −20%** (elettrico + idrico) è stata **aggiunta alle pareti divisorie e finiture interne** di ogni modello, che ora includono la **posa delle piastrelle in bagno** (piastrelle del cliente; posa negli altri ambienti 39 €/m²). Esempio Nord House: +4.970,88 € → 35.810,88 €. La tabella qui sotto riporta i prezzi del listino **prima** degli sconti; nel simulatore elettrico e idrico sono già scontati. Per i modelli con soppalco si sono usati i m² utili senza soppalco.
- **Trasporto:** il cliente sceglie la provincia del cantiere. **1,50 €/km** per le case fino a 80 m² del listino, **3 €/km** oltre 80 m² fino a 170 m² (prezzi aggiornati da Eugenio il 15/10/2026; prima 2 e 4 €/km). La tariffa si calcola sui **m² totali** da trasportare: si può scegliere il numero di case dello stesso modello (1–10); anche due case piccole fino a 80 m² in tutto = un viaggio a 1,50 €/km. Regola aggiornata: **1,50 €/km per ogni viaggio**; 1 viaggio fino a 80 m² totali, 2 fino a 170 m², poi +1 viaggio ogni 90 m² in più (260, 350…). La regola oltre 170 m² è una mia interpretazione da confermare con Eugenio. Con più case tutte le altre voci si moltiplicano per il numero di case. I km partono da Kiev, ma **sul sito non va scritto**: la pagina mostra solo il prezzo, senza km né partenza. Km stimati: circa 1.700 km di strada fino al confine di Tarvisio + distanza in linea d'aria dal confine al capoluogo × 1,35 (Sardegna: via Civitavecchia, traghetto escluso). Esempi: Udine 1.780, Milano 2.180, Roma 2.400, Napoli 2.550, Bari 2.580, Palermo 2.960 km. Da far verificare a Eugenio con i viaggi reali.
- **Aumento della lunghezza** a moduli da 130 cm: solo il prezzo del modulo; **la fondazione non si ricalcola** e nemmeno le altre voci (decisione di Eugenio del 15/10/2026, dopo aver provato l'aggiornamento automatico).

| Modello sul sito | Colonna del listino | Kit (struttura) | Lavori di montaggio | Laminazione finestre | Vetro Solar | Pareti divisorie e finiture | Impianto elettrico | Impianto idrico | Pavimenti laminato | Porte interne | Aumento lunghezza 130 cm | Isolamento +50 mm | Isolamento +100 mm | Predisp. clima |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Barn Mini | Barn Mini 24,5 m² | 19.950 | 5.988 | 900 | 408 | 6.390 | 6.900 | 3.528 | 1.056 | 300 | – | 1.440 | 2.880 | 2.000 |
| Barn Light | Barn Light 36 m² | 20.500 | 6.150 | 948 | 450 | 6.840 | 6.900 | 3.528 | 1.512 | 300 | – | 1.560 | 3.120 | 2.000 |
| Barn House | Barn House 42 m² | 21.600 | 7.116,14 | 1.041,06 | 494,18 | 8.104,50 | 7.577,37 | 3.874,34 | 1.937,17 | 658,90 | 3.960 | 1.680 | 3.360 | 2.196,34 |
| Freya Smart | Freya Smart 42 m² | 22.900 | 7.080 | 1.032 | 552 | 9.960 | 7.650 | 3.528 | 1.836 | 600 | 4.320 | 2.040 | 4.080 | 2.000 |
| A-frame | Aframe 49 m² | 23.400 | 10.497,20 | 1.239,25 | 612,34 | 9.622,42 | 8.383,18 | 4.286,36 | 2.500,37 | 728,97 | 5.280 | 1.920 | 3.840 | 2.429,91 |
| Barn Max Height | Barn House Max Height 42 m² | 27.300 | 8.190 | 984 | 492 | 9.120 | 7.650 | 3.528 | 1.764 | 600 | 4.680 | 2.040 | 4.080 | 2.000 |
| Flat House 2,2 m | Flat House 2,2 m 52 m² | 28.600 | 9.360 | 1.860 | 816 | 13.680 | 11.700 | 4.140 | 2.448 | 900 | 7.920 | 3.000 | 6.000 | 4.000 |
| Flat House 2,7 m | Flat House 2,7 m 52 m² | 32.600 | 10.080 | 1.860 | 816 | 14.760 | 11.700 | 4.140 | 2.448 | 900 | 8.220 | 3.540 | 7.080 | 4.000 |
| A-Frame L | Aframe 49 m² × 1,1514 (1.300 €/m²) | 29.000 | 12.086,11 | 1.426,83 | 705,03 | 11.078,92 | 9.652,10 | 4.935,16 | 2.878,84 | 839,31 | 6.079,21 | 2.210,62 | 4.421,24 | 2.797,71 |
| Barn Double | Double Barn 72 m² | 38.000 | 12.043,32 | 1.838,19 | 887,40 | 15.592,93 | 12.360,25 | 4.373,63 | 3.327,76 | 950,79 | 7.920 | 3.240 | 6.480 | 4.225,73 |
| Flat House 1.5 | Flat 1.5 75 m² | 45.950 | 16.542 | 2.880 | 1.008 | 22.860 | 15.600 | 7.560 | 3.792 | 1.200 | 12.330 | 5.280 | 10.560 | 4.000 |
| Nord House | Nord House 95 m² | 51.000 | 18.780 | 3.720 | 1.656 | 30.840 | 22.500 | 8.568 | 5.052 | 1.200 | 7.740 | 6.120 | 12.240 | 4.000 |
| Olivia (kit 54.000) | optional della Nord House 95 m² (struttura più simile) | 54.000 | 18.780 | 3.720 | 1.656 | 30.840 | 22.500 | 8.568 | 5.052 | 1.200 | 7.740 | 6.120 | 12.240 | 4.000 |
| Fjord | Fjord 130 m² | 61.000 | 23.400 | 4.080 | 1.860 | 32.400 | 23.400 | 13.140 | 5.844 | 2.400 | 15.360 | 6.720 | 13.440 | 6.000 |
| Flat Double | Double Flat 99 m² | 61.700 | 18.480 | 3.720 | 1.560 | 29.520 | 22.200 | 8.568 | 5.196 | 1.500 | 16.440 | 6.960 | 13.920 | 4.000 |
| Sherwood | Sherwood 118 m² | 64.800 | 21.240 | 4.320 | 1.896 | 33.840 | 23.550 | 13.440 | 5.916 | 2.700 | 15.360 | 6.720 | 13.440 | 6.000 |
| Norway | Norway 160 m² | 65.600 | 31.162,21 | 4.804,17 | 2.194,34 | 38.757,99 | 25.319,29 | 14.217,76 | 8.206,05 | 3.246,06 | 16.440 | 7.200 | 14.400 | 6.492,13 |
| Siver | Siver 160 m² | 71.400 | 31.042,65 | 4.539,83 | 2.073,60 | 36.625,42 | 23.926,15 | 13.435,45 | 7.754,53 | 3.067,46 | 16.440 | 7.200 | 14.400 | 6.134,91 |
| Montblanc | Mont Blanc 166 m² | 77.400 | 31.065,30 | 4.740,89 | 2.220,73 | 35.431,92 | 24.640,15 | 14.035,53 | 7.984,66 | 3.742,81 | 17.040 | 7.560 | 15.120 | 6.238,01 |

> **I prezzi unitari di questa sezione NON vanno scritti sul sito** (Eugenio, 16/10/2026): restano solo nel calcolo del simulatore (`js/infissi.js`).
> **Infissi, tapparelle e zanzariere: tutti i prezzi sono IVA esclusa** (Eugenio, 16/10/2026: prima ha detto inclusa, poi corretto in esclusa). Sul sito si scrive **"+ IVA"**, non "IVA esclusa"..

## Infissi in PVC Rehau Synego / Synego Slide (nel simulatore dal 16/10/2026)
- Colori: **Weiss bianco = standard** . **Mooreiche 2, Rovere dorato, Noce, Grigio antracite, Braun = +25%** sul prezzo standard (15/10/2026). Campioni in `img/colore-*.webp`.
- Gamma completa Synego: **oltre 50 colori** (tinte legno, tinte unite, SFTN Matt, Metbrush…), anche colore diverso tra lato interno ed esterno; colori inalterati nel tempo. Immagine della gamma in `img/synego-gamma-colori.webp`. **Colori speciali** (sul sito si chiamano "Colore speciale"; tutti quelli della gamma completa fuori dai 6 della cartella base) = **+30%** sul prezzo standard (15/10/2026).
- **I prezzi del simulatore sono per Synego con doppio vetro** (Eugenio, 16/10/2026).
- Prezzo al m² di ogni pezzo (larghezza × altezza), dettato da Eugenio il 15/10/2026:
  - **Battente Synego, bianco:** fino a 1 m² **200 € fissi a pezzo** (corretto il 16/10/2026, prima 250 €/m²); da 1 a 3,22 m² **280 €/m²**; oltre 3,22 m² **300 €/m²**. Colori: +25% (5 base) o +30% (particolari) su questi prezzi.
  - **Scorrevole Synego Slide** (foto in `img/synego-slide-1.webp`, `img/synego-slide-2.webp`, soglia ribassata `img/synego-slide-soglia.webp`; dettaglio ferramenta battente `img/synego-ferramenta.webp`; sezione battente effetto legno in `img/synego-sezione-legno.webp`): bianco **320 €/m²**, colore **400 €/m²** (da chiarire: fasce di misura e colori particolari).
- **Demolizione** vecchi infissi **30 € a pezzo** e **posa 140 € a pezzo** (insieme 170 €), per ogni pezzo fino a 3,22 m². Oltre 3,22 m²: da chiarire.
- Se l'appartamento è **sopra il terzo piano**: demolizione e posa **+10%** (da chiarire se dal 3° o dal 4° piano).
- Simulatore: righe larghezza/altezza (5 all'inizio, pulsante "+ Aggiungi altro infisso"); sotto, Demolizione e Posa con le loro righe e il pulsante "Riprendi le misure degli infissi indicati sopra".

## Tapparelle in alluminio coibentato Pracal (nel simulatore dal 16/10/2026)
- Marca **Pracal** (profili per tapparelle). Profili a catalogo: L08, L09, L12, stecche a media o alta densità. Foto in `img/pracal-l08.webp`, `img/pracal-l12.webp`, tabella colori in `img/pracal-colori.webp` (tinta unita, finto legno, particolari, Raffaello).
- **Prezzo 49,50 €/m²**, uguale per tutti i colori (15/10/2026). Calcolo a righe larghezza × altezza, con il pulsante per riprendere le misure degli infissi.
- **Demolizione** vecchie tapparelle **25 € a pezzo** fino a 3,22 m².
- **Posa 60 € a pezzo** fino a 3,22 m² (anche se il pezzo è più piccolo); da 3,22 a 6,44 m² il prezzo **raddoppia** (120 €).

## Zanzariere in alluminio Primed (nel simulatore dal 16/10/2026)
- Marca **Primed** (zanzariere dal 1983). Due tipi, **stesso prezzo**: **verticale avvolgente** (scorre dall'alto in basso, per le finestre, es. Giada) e **laterale plissettata** (apertura da sinistra a destra o viceversa, per le porte-finestre, es. Voilà, Smart). Foto in `img/primed-verticale.webp`, `img/primed-laterale.webp`, colori in `img/primed-colori.webp`.
- **Prezzo 52 €/m²** per ogni pezzo fino a 3,22 m² (prezzo definitivo del 15/10/2026). Calcolo a righe larghezza × altezza, con il pulsante "Riprendi le misure degli infissi indicati sopra"; il cliente indica il tipo per ogni zanzariera.
- **Posa 50 € a pezzo** fino a 3,22 m².
- Sempre in alluminio; **colore a scelta** dalla striscia colori Primed, **stesso prezzo** per tutti i colori (15/10/2026).

### Regole provvisorie del simulatore infissi (scelte da Claude il 16/10/2026, da confermare con Eugenio)
- Pezzi oltre 3,22 m²: demolizione e posa **raddoppiano** fino a 6,44 m² (infissi, tapparelle, zanzariere). Oltre 6,44 m²: demolizione/posa "al sopralluogo" (escluse dal totale), il prodotto si calcola lo stesso.
- +10% su demolizioni e pose **dal 4° piano** in su.
- Finestre fino a 1 m²: 200 € fissi a pezzo in bianco (deciso da Eugenio il 16/10/2026); con i colori si applica la stessa maggiorazione (+25% / +30%) — da confermare.
- Scorrevoli: sempre 320 €/m² in bianco e 400 €/m² per qualunque altro colore (anche particolari), senza fasce di misura. **Scorrevoli oltre 6,44 m²: prezzo al sopralluogo** (deciso da Eugenio il 16/10/2026).
- Smontaggio tapparelle oltre 3,22 m²: raddoppia (50 €). Zanzariere: 52 €/m² **fino a 6,44 m²; oltre, prezzo al sopralluogo** (deciso da Eugenio il 16/10/2026); nessuno smontaggio delle vecchie.
- I colori di tapparelle e zanzariere nelle strisce sono indicativi (ricostruiti dalle tabelle dei cataloghi).

- Case in legno, voce "pareti" (16/10/2026): si chiama **"Montaggio delle pareti divisorie e rivestimento interno"**; rivestimento in legno di abete o cartongesso compreso nel prezzo, altri rivestimenti su preventivo. Prezzi invariati.
- Case in legno, **predisposizione climatizzazione** (16/10/2026): **1.950 € per unità** (1 motore + 2 split), uguale per tutti i modelli; il cliente sceglie il numero di unità (2 unità = 3.900 €). Sostituisce i vecchi prezzi per modello (colonna "clima" in `case-in-legno.html`, non più usata).
- Case in legno, **trasporto** (16/10/2026): nella descrizione c'è scritto che il costo è indicativo e viene verificato e confermato nel preventivo, prima della firma del contratto.
