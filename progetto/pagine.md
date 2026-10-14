# Mappa del sito

| Indirizzo | File | Contenuto |
|---|---|---|
| `/` | `index.html` | Home: hero "I dettagli fanno la differenza", servizi, gallerie Interior design / Cantieri / Esterni, metodo, modulo contatti `preventivo`, dati strutturati azienda (JSON-LD) |
| `/studio-tecnico` | `studio-tecnico.html` | Studio tecnico: rilievi, progetti, pratiche, direzione lavori |
| `/interior-design` | `interior-design.html` | Interior design: le 14 tavole del progetto esecutivo, metodo in 4 fasi |
| `/ristrutturazioni-interni` | `ristrutturazioni-interni.html` | Ristrutturazioni interni + **simulatore costi** (prezzi in `progetto/listino-prezzi.md`) |
| `/ristrutturazioni-esterni` | `ristrutturazioni-esterni.html` | Esterni: per amministratori di condominio e per privati, lavori, metodo |
| `/privacy.html` | `privacy.html` | Informativa privacy (versione precedente del sito, da riallineare allo stile Nero & Oro) |
| `/grazie` | `grazie.html` | Pagina dopo l'invio del modulo |
| — | `404.html` | Pagina non trovata |

## Note tecniche
- Pagine statiche HTML con stili inline (derivano dal canvas Claude Design).
- Il simulatore della pagina interni gira con `js/dc-lite.js`: il contenuto della pagina sta in un `<template id="tpl">` e la logica nella classe `Component` in fondo alla pagina. I prezzi sono nell'oggetto `P` dentro `renderVals()`.
- Immagini in `img/` (quelle con nome lungo sono le foto del nuovo design; quelle con nome descrittivo vengono dal sito precedente).
- Video del tour villa in `video/` (dal sito precedente, non ancora usato nel nuovo design).
