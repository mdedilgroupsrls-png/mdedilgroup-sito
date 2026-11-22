# Strumenti e stili di montaggio dei reel

Installati il 22/11/2026 su richiesta di Eugenio ("più unici, professionali, con tipi di montaggio diversi").
Sono **skill di Claude Code** salvate nel repository in `.claude/skills/` (si caricano da sole in ogni sessione).
La cartella `.claude/` è bloccata sul sito in `netlify.toml` (404). Sono tutte open source (licenze MIT o Apache 2.0, file `LICENSE` dentro ogni cartella).

Le regole di `md-edil-reels` restano valide (voce Speko, logo, chiusura con contatti, musica originale, mai foto ripetute, stile Nero & Oro: oro `#D6AC48`, nero, bianco). Questi strumenti cambiano **come** si monta, non i contenuti né il marchio.

## Gli strumenti

| Skill | Da dove | A cosa serve nei reel |
|---|---|---|
| `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `style-sampling`, `slideshow` | HeyGen (`heygen-com/hyperframes`) | Reel scritti come pagina HTML + animazioni GSAP e trasformati in MP4. Titoli animati, schede prezzi, mappe, grafici, transizioni dal catalogo. **Provato qui il 22/11/2026: funziona** (`npx hyperframes render`). |
| `remotion-*` (best-practices, create, render, captions, multimedia, maps, docs, license) | Remotion (`remotion-dev/skills`) | Reel fatti con componenti React: sottotitoli parola per parola, mappe con percorso (es. cantieri nei quartieri di Roma), modelli riutilizzabili. Licenza Remotion: gratis per aziende fino a 3 persone, oltre serve la licenza a pagamento (vedi skill `remotion-license`). Non ancora provato con un render. |
| `animate`, `animation-vocabulary`, `choreograph`, `improve-animations`, `review-animations`, `emil-design-eng`, `apple-design` | Emil Kowalski (`emilkowalski/skill`) | Movimenti morbidi e "di pregio": curve di velocità, tempi, entrate a cascata, controllo finale delle animazioni. |
| `taste-skill` | `Leonxlnx/taste-skill` | Evita la grafica "da AI" tutta uguale (gradienti viola ecc.). Tolte le foto di repertorio (`assets/photos`): usiamo solo le foto di Eugenio. |
| `impeccable` | `pbakaus/impeccable` | Controllo di qualità della grafica: spaziature, caratteri, gerarchia. |
| `frontend-design` | Anthropic (ufficiale) | Grafica con tipografia forte e palette precisa, usata per le scene HTML dei reel. |
| `ui-ux-pro-max` | `nextlevelbuilder/ui-ux-pro-max-skill` | Archivio di stili, palette e coppie di caratteri. Per noi solo come idee: i colori restano Nero & Oro. |

Note tecniche (cloud): il browser dei render non raggiunge i CDN, quindi GSAP e i caratteri vanno messi in `assets/` del progetto video (`npm i gsap` e copia di `gsap.min.js`). Voce e trascrizione restano su Speko; non servono Kokoro, Whisper o MusicGen.

## Tipi di montaggio a rotazione

Ogni reel nuovo usa un tipo diverso dal reel precedente (si segna in `magazzino-reel.md`, colonna o nota "montaggio").

1. **Classico cantiere** (ffmpeg, come finora): foto/video del cantiere, Ken Burns, sottotitoli a rotazione.
2. **Scheda prezzi animata** (HyperFrames): voce → prezzo "da" che si compone, barra oro, link alla pagina del simulatore. Prezzi solo dal listino del suo simulatore.
3. **Mappa di Roma** (Remotion maps o HyperFrames): il quartiere del cantiere che si accende, percorso oro, poi le foto.
4. **Prima / dopo con tenda** (HyperFrames): divisore oro che scorre, didascalie in alto.
5. **Checklist / 3 dettagli** (HyperFrames + animazioni Emil): voci che entrano a cascata con spunta oro.
6. **Titoli cinetici** (Remotion captions): parole grandi che riempiono lo schermo a tempo con la voce, sopra il video del cantiere scurito.
7. **Detrazioni in numeri** (HyperFrames): percentuali e scadenze che contano, senza foto inventate.

Tutti chiudono con la chiusura approvata di `md-edil-reels` (logo, sopralluogo e preventivo gratuito, numero, Roma e Lazio).
