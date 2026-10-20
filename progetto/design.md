# Design "Nero & Oro"

Design scelto e approvato da Eugenio (proposta A, 13/10/2026). Il resto si completa man mano.

## Colori
| Uso | Colore |
|---|---|
| Sfondo principale | `#0E0D0B` |
| Sfondo sezioni alternate / card | `#171512` |
| Bordi e linee sottili | `#2A2722` (tratteggi segnaposto `#3A362F`) |
| Oro (accenti, pulsanti, numeri) | `#C9A24A` |
| Oro chiaro (hover, cifre del simulatore) | `#E2C373` |
| Testo principale | `#F3EFE7` |
| Testo secondario | `#D8D2C6` |
| Testo attenuato | `#8A8478` |
| Pulsante WhatsApp | `#25D366` |

## Caratteri (Google Fonts)
- **Titoli:** Urbanist (moderno, non calligrafico). Peso 400 per i titoli grandi, 600-700 per piccoli titoli e nome azienda.
- **Testo:** Manrope 400/500/600.
- Etichette sopra i titoli: maiuscolo, 12px, spaziatura lettere 0.38em, colore oro.

## Header (uguale in tutte le pagine)
- **Icona del sito** (quella che Google mostra nei risultati di ricerca accanto a mdedilgroup.it, e nelle schede del browser): logo d'oro su **fondo nero** come il logo originale, in `favicon-512.png`, `favicon-192.png` e `favicon.ico` (17/10/2026, richiesta di Eugenio: prima Google mostrava il logo su fondo bianco). `favicon.png` (trasparente) resta per le pagine 404/grazie e per l'anteprima dei link.
- Logo a sinistra; la scritta **MD EDIL GROUP** sta sulla linea dorata che parte dal logo e prosegue verso destra.
- **Nessun pulsante preventivo in alto a destra.**
- Sotto, menu centrato: Studio tecnico · Interior design · Ristrutturazioni interni · Ristrutturazioni esterni · Infissi e serramenti · Case in legno · Chi siamo. La voce della pagina corrente è in oro. **Regola di Eugenio (20/10/2026): il menu contiene solo queste pagine principali.** Le pagine di approfondimento (bagno, strutture ricettive, terrazzi…) non vanno nel menu: stanno dentro la pagina madre (riquadro "Approfondimenti" con foto e "Scopri →"), con percorso HOME / PAGINA MADRE / … e la voce della pagina madre in oro nel menu. Sul telefono (sotto 480 px, e ancora di più sotto 340 px) le voci sono un po' più vicine, così il menu non finisce sopra il percorso "HOME / …" (20/10/2026).

## Home
- **Titolo principale per Google (20/10/2026):** l'H1 della Home è la riga dorata piccola "Ristrutturazioni Roma · Milano · Case in legno in tutta Italia" (`h1.eyebrow.zones`); lo slogan "I dettagli fanno la differenza" è un `p.slogan#ttl` con lo stesso aspetto e la stessa scrittura lettera per lettera. A vista non cambia niente.
- Frase approvata da Eugenio, centrata su due righe: "Ristrutturazioni di pregio / curate in ogni dettaglio". Nella versione online del 14/10 il titolo grande della hero è lo slogan "I dettagli fanno la differenza": chiedere a Eugenio quale tenere prima di cambiarlo.
- Gallerie foto **da scorrere con il dito**:
  - Interior design = render di progetto
  - Cantieri = "Realizziamo lavori chiavi in mano"
  - Esterni e facciate

## Footer (uguale in tutte le pagine)
- Logo, icone tonde dorate Facebook / Instagram / TikTok / Google Business.
- Ragione sociale e P.IVA, le due sedi legali, link Privacy · Cookie.
- Pulsante WhatsApp fisso in basso a destra.

## Regole
- Layout fluido, contenitore max 1320px, margini laterali `clamp(20px, 5vw, 72px)`.
- Deve funzionare a larghezza telefono (390px) senza scorrimento orizzontale.
- Niente emoji, niente gradienti decorativi.


## Didascalie render
- Ogni render di interior design ha l'etichetta in oro "RENDER DI PROGETTO BY ARCHITETTO ADRIANA SCLIFOS" (deciso da Eugenio il 14/10/2026).


## Nuova Home "Cinema" (approvata come direzione il 14/10/2026, da pubblicare)
Sorgente: `progetto/sorgenti-design/home-cinema.html`. Stesso stile Nero & Oro, stessi caratteri.
- Header uguale al sito attuale: logo, MD EDIL GROUP sulla linea d'oro, menu centrato sotto (visibile anche da telefono, su più righe).
- Apertura: il logo si **disegna da zero** a linee d'oro (più grande), poi diventa il logo vero, compare MD EDIL GROUP e la schermata svanisce. Nessuna linea che "taglia" il logo. **Solo alla prima apertura del sito** (per visita): tornando alla Home nella stessa visita il logo non si ridisegna e la frase si scrive subito (15/10/2026).
- Hero: la frase "I dettagli fanno la differenza" si **scrive lettera per lettera** appena appare la pagina (parte quando la schermata del logo inizia a svanire, non con un timer); **mentre la frase si scrive** compaiono la linea d'oro, "Ristrutturazioni Roma · Milano · Case in legno in tutta Italia" e i pulsanti (dopo circa 0,5–0,9 s, richiesta di Eugenio del 17/10/2026).
- Filo d'oro lungo il margine sinistro che si disegna scorrendo, con rombi alle sezioni; linea d'oro sotto ogni titolo che si traccia.
- Render interior design: nastro continuo di foto **grandi** che scorre **da destra a sinistra**; dito fermo = si ferma, trascinare = accelera, nessun pulsante. Sta subito dopo i Servizi, sopra i simulatori.
- Simulatori: fascia compatta (titolo piccolo + 3 pulsanti).
- Catalogo case in legno: tutti i 19 modelli (Olivia aggiunta il 15/10/2026), **2 alla volta**, stesso nastro continuo dei render.
- Cantieri ed esterni: gallerie con effetto 3D (coverflow). Esterni con descrizione sopra le foto e la zona di Roma sotto ogni foto. Dal 17/10/2026 **avanzano da sole** (una foto ogni 3,5 s, finite le foto tornano alla prima; si fermano 5 s quando la persona le tocca o ci passa col mouse); scritta "Scorrono da sole · tocca per fermare".
- **Scorrimento dal computer** (20/10/2026, Eugenio): ogni fila o nastro che scorre di lato ha le **frecce ‹ ›** dorate ai lati (solo da computer, `js/frecce.js`: attributo `data-frecce` sulle file, `MDFrecce.bottoni` sui nastri automatici) e si può **trascinare col mouse**; sul telefono le frecce non compaiono e si scorre col dito. Se una fila si vede già tutta, le frecce si nascondono. Vale per: render, catalogo case, lavori, esterni e reel della Home; modelli delle case in legno; colori degli infissi; nastri di interni, facciate e interior design.
- **Nastri di foto nelle pagine interne** (`js/nastro.js`, attributo `data-nastro`): scorrono da soli da destra a sinistra come i render della Home (dito fermo = si ferma, trascinando accelera), scritta "Tieni fermo il dito per fermare · trascina per accelerare". Usati per i render (Interior design) e, **sotto i simulatori**, per i lavori realizzati (interni, facciate; infissi quando Eugenio manda le foto).
- Reel Instagram: tra "Come lavoriamo" e "News e guide"; 2 alla volta, si scorrono col dito; visualizzazioni, mi piace e commenti sopra il video in basso, con numeri che contano da 1 al valore vero.
- Ordine sezioni: Servizi, Render, Simulatori, Cantieri, Case in legno, Esterni, Chi siamo + garanzie, Come lavoriamo, Reel, News, Contatti.

- **Scheda grande delle case in legno** (`js/schede.js`, Home e /case-in-legno): si apre a misura dell'immagine, con foto della casa e planimetria **intere e visibili subito, senza scorrere**, anche sul telefono (16/10/2026).
- **Avviso cookie** (`js/sicurezza.js`, tutte le pagine): fascia in basso nero e oro, testo "solo cookie tecnici", pulsanti RIFIUTO e ACCETTO; la scelta resta salvata nel browser (16/10/2026).
- **Email nel piè di pagina** di tutte le pagine: "Email: …", ricomposta da `js/sicurezza.js` per non farla leggere ai programmi automatici.

## Frase approvata per i simulatori (17/10/2026)
"**Stima indicativa, non vincolante.** Il preventivo definitivo si ottiene solo dopo il sopralluogo. Le lavorazioni non presenti nel simulatore saranno quotate a parte." – Nei simulatori interni, esterni e infissi e serramenti (per gli infissi con in più "con le misure prese dai nostri tecnici"): riquadro `.avviso` sotto il totale e riquadro in evidenza sotto il titolo del preventivo PDF.
