# Mappa del sito

| Indirizzo | File | Contenuto |
|---|---|---|
| `/` | `index.html` | Home "Cinema" (dal 14/10/2026): apertura con logo che si disegna, frase "I dettagli fanno la differenza" scritta lettera per lettera, servizi, nastro continuo dei render di interior design, simulatori (fascia compatta), cantieri "Realizziamo lavori chiavi in mano" (galleria 3D: 25 foto di lavori `img/lavoro-01…25.webp`; zona di Roma sotto ogni foto), catalogo dei 18 modelli di case in legno (nastro continuo, 2 alla volta), esterni e facciate (descrizione + galleria 3D con le stesse 14 foto della pagina esterni), chi siamo e garanzie, come lavoriamo, ultimi reel Instagram (testi e numeri inseriti a mano da Metricool, aggiornati al 15/10/2026), news, modulo contatti `preventivo`, dati strutturati azienda (JSON-LD) |
| `/studio-tecnico` | `studio-tecnico.html` | Studio tecnico: rilievi, progetti, pratiche, direzione lavori |
| `/interior-design` | `interior-design.html` | Interior design: galleria scorrevole "Render di interior design" (12 render, immagini `img/id-*.webp`), le 11 tavole del progetto esecutivo (raggruppamento deciso da Eugenio il 15/10/2026, prima erano 14), metodo in 4 fasi |
| `/ristrutturazioni-interni` | `ristrutturazioni-interni.html` | Ristrutturazioni interni + **simulatore costi** (prezzi in `progetto/listino-prezzi.md`) |
| `/ristrutturazioni-esterni` | `ristrutturazioni-esterni.html` | Esterni: riquadri "Per i condomini" e "Per i privati" (gli amministratori non si citano), lavori, galleria "Lavori realizzati" con 14 foto di facciate, poi metodo ("Il nostro studio tecnico segue tutto", titolo ridotto) |
| `/privacy.html` | `privacy.html` | Informativa privacy (versione precedente del sito, da riallineare allo stile Nero & Oro) |
| `/grazie` | `grazie.html` | Pagina dopo l'invio del modulo |
| — | `404.html` | Pagina non trovata |

## Note tecniche
- Pagine statiche HTML con stili inline (derivano dal canvas Claude Design).
- Il simulatore della pagina interni gira con `js/dc-lite.js`: il contenuto della pagina sta in un `<template id="tpl">` e la logica nella classe `Component` in fondo alla pagina. I prezzi sono nell'oggetto `P` dentro `renderVals()`.
- I render dell'interior design (forniti da Eugenio il 14/10/2026) sono in `img/id-*.webp`; alcuni portano la firma "Adriana Sclifos Architetto" e uno il logo "Di Porto" sulla TV: Eugenio ha scelto di pubblicarli così.
- Immagini in `img/` (quelle con nome lungo sono le foto del nuovo design; quelle con nome descrittivo vengono dal sito precedente).
- Video del tour villa in `video/` (dal sito precedente, non ancora usato nel nuovo design).
- Render dei modelli di case in legno ritagliati dalle schede: `img/m-*.webp` (Home).
- Home: i reel stanno in `index.html` tra `<!-- REELS:INIZIO -->` e `<!-- REELS:FINE -->` e si aggiornano **da soli una volta a settimana, il lunedì mattina** (scelta di Eugenio, per non consumare troppe pubblicazioni Netlify) con `.github/workflows/reels-instagram.yml` + `progetto/strumenti/aggiorna_reels.py` (copertine in `img/reels/`). Non modificarli a mano: verrebbero sovrascritti. Reel da non mostrare: `progetto/reels.json`. Le zone di Roma sotto le foto delle facciate sono pronte nel sorgente `progetto/sorgenti-design/home-cinema.html` (`<span class="zona">`) ma tolte dal sito finché mancano i quartieri veri.
