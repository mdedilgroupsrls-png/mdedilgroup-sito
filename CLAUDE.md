# Sito MD Edil Group – istruzioni per Claude

Questo repository è il sito **mdedilgroup.it** di MD Edil Group S.R.L.S.
Ogni push sul branch `main` viene pubblicato automaticamente da Netlify (progetto `mdedilgroup`).

Prima di lavorare leggi la cartella `progetto/`:

| File | Contenuto |
|---|---|
| `progetto/azienda.md` | Dati dell'azienda, contatti, sedi, servizi, posizionamento |
| `progetto/design.md` | Stile Nero & Oro: colori, caratteri, header, footer, regole |
| `progetto/pagine.md` | Mappa del sito: cosa c'è in ogni pagina |
| `progetto/listino-prezzi.md` | Prezzi usati dal simulatore costi e per le stime |
| `progetto/da-fare.md` | Lavori aperti e idee per i prossimi aggiornamenti |
| `progetto/sorgenti-design/` | File originali del design (canvas Claude Design) e script di conversione, solo come riferimento |

## Regole di lavoro

- Il sito è in **italiano**, per clienti di fascia alta (ristrutturazioni di pregio).
- Modifica direttamente i file HTML nella radice del repository. Sono pagine statiche, senza build.
- Mantieni sempre lo stile Nero & Oro descritto in `progetto/design.md`. Non cambiare logo, colori o caratteri senza che Eugenio lo chieda.
- Niente dati inventati: prezzi, numeri, recensioni e foto li fornisce Eugenio. Dove manca un'informazione usa un segnaposto tra parentesi quadre, es. `[FOTO CANTIERE]`.
- Ogni nuova pagina va aggiunta a `sitemap.xml`, al menu in tutte le pagine e a `progetto/pagine.md`.
- Ogni pagina deve avere `<title>`, `meta description` e `link rel="canonical"` propri, e funzionare bene da telefono.
- Il modulo contatti si chiama `preventivo` (Netlify Forms). Non rinominarlo, altrimenti le richieste finiscono in un modulo nuovo.
- La cartella `progetto/` e questo file non sono visibili sul sito (bloccati in `netlify.toml`). Il repository GitHub però è **pubblico**: non salvare qui password, dati di clienti o documenti riservati.
- Dopo ogni modifica aggiorna `progetto/da-fare.md` e scrivi un messaggio di commit chiaro in italiano.
