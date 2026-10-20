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
| `progetto/seo.md` | Parole chiave per pagina, lavori SEO fatti e da fare |
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
- **La cartella `progetto/` deve restare sempre aggiornata.** Ogni volta che si lavora sul sito, nello stesso commit aggiorna i file che riguardano la modifica:
  - nuove informazioni sull'azienda (contatti, sedi, servizi, link social) → `azienda.md`
  - cambi di stile, header, footer o frasi approvate → `design.md`
  - pagine nuove, rinominate o con contenuti cambiati → `pagine.md`
  - prezzi nuovi o modificati (anche nel simulatore) → `listino-prezzi.md`
  - lavori fatti, nuovi lavori da fare, decisioni prese → `da-fare.md` (spunta ciò che è completato, con la data)
  - titoli, descrizioni per Google, parole chiave, lavori SEO → `seo.md`
- **Sicurezza** (16/10/2026): l'email non va mai scritta in chiaro nelle pagine; si usa `<span class="js-mail">scrivici dal modulo contatti</span>` e la ricompone `js/sicurezza.js` (incluso in tutte le pagine, insieme all'avviso cookie). Se una pagina usa un nuovo servizio esterno (script, caratteri, mappe, video), va aggiunto alla `Content-Security-Policy` in `netlify.toml`, altrimenti il browser lo blocca.
- **Simulatori interni ed esterni**: ogni simulatore usa solo il proprio listino, mai prezzi presi dall'altro anche per lavorazioni simili; interni IVA inclusa, esterni e facciate + IVA. Voci in `js/ristrutturazione.js` e `js/esterni.js` (motore `js/simulatore.js`). Dopo ogni modifica a titoli o descrizioni delle voci lancia `node progetto/strumenti/guida_lavorazioni.js`, che aggiorna la guida per Google nelle pagine.
- **Numero dei preventivi PDF**: contatore in `netlify/edge-functions/numero.js` (Netlify Blobs). Non salvare lì dati dei clienti.
- **Statistiche**: i contatori anonimi sono in `js/sicurezza.js` (`MDStat('evento')`) e `netlify/edge-functions/stat.js`; i dati giornalieri stanno nel branch `statistiche`, non in main. Mai raccogliere nomi, IP o altri dati personali.
- **Domande senza risposta** (Eugenio, 20/10/2026): se Eugenio non risponde a tutte le domande, le richiedi nel messaggio successivo, finché non sono chiuse, ma **al massimo 3-4 domande per messaggio** e messaggi brevi: le altre nei messaggi successivi. L'elenco aggiornato è in `progetto/seo.md` → "Domande aperte per Eugenio".
- **Pagine nuove = approfondimenti della pagina madre** (Eugenio, 20/10/2026): il menu e la Home restano con le pagine principali e non linkano le pagine nuove. Le pagine nuove (bagno, strutture ricettive, terrazzi…) **non sono nascoste**: si aprono dall'elenco ben visibile "Approfondimenti" dentro la pagina madre del loro tipo di lavoro (interni, esterni, case in legno o infissi; subito sotto l'elenco delle lavorazioni), più sitemap e `llms.txt`.
- **Ogni testo serve anche alla SEO** (Eugenio, 20/10/2026): titoli, descrizioni per Google, titoli H1/H2, testi, didascalie, testi alternativi delle foto e nomi dei file devono essere **originali e unici nel sito** (mai copiati da altre pagine o da altri siti) e contenere in modo naturale le **parole chiave che le persone cercano davvero** per quella lavorazione, con la zona di Roma quando è vera (es. "ristrutturazione bagno Roma", "rifacimento facciata condominio Roma"). Prima di scrivere una pagina o una scheda controlla le parole chiave in `progetto/seo.md` e aggiornale lì. Obiettivo: far salire il sito su Google per chi cerca lavori di ristrutturazione; mai parole ripetute a forza e mai promettere a Eugenio la prima pagina.
- **Pubblicazione** (Eugenio, 20/10/2026): il sito si pubblica **ogni lunedì in automatico** (compito settimanale) oppure quando Eugenio scrive "aggiorna il sito". I reel su Metricool: uno al giorno da martedì a sabato, **in mattinata tra le 10:30 e le 12:00**, solo nei giorni liberi del calendario Metricool (se un giorno ha già un reel si passa al giorno libero successivo) e solo dopo che i loro video sono online.
- **Ogni contenuto diventa un reel** (Eugenio, 20/10/2026): ogni articolo, pagina di approfondimento, dettaglio, bagno, costo, detrazione o informazione nuova che mettiamo sul sito genera **almeno un reel** (skill md-edil-reels). I reel si montano **durante la settimana, prima dell'aggiornamento del lunedì**, così il lunedì vanno online con il sito e da martedì si programmano su Metricool. Un articolo nuovo ogni settimana (argomento libero, a rotazione tra le pagine principali e le detrazioni), preso da un articolo o da una pagina di approfondimento. Eugenio prepara anche reel suoi a parte: Claude riempie i giorni liberi.
- Scrivi un messaggio di commit chiaro in italiano.
