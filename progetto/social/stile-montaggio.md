# Stile di montaggio dei reel: riferimenti, cartelle, video parlati

Metodo preso da un video tutorial sul montaggio con Claude Code (4/11/2026), adattato a MD Edil Group.
Si aggiunge alla skill **md-edil-reels** (voce, logo, sottotitoli, musica, chiusura): non la sostituisce.

## 1. Cartelle di lavoro (tre passaggi)

| Passaggio | Dove sta | Cosa c'è |
|---|---|---|
| Sorgenti | Google Drive `Md edil group → Materiale per articoli e reel` (segnati in `progetto/materiale.md`) | foto e video originali di Eugenio, mai nel repository (è pubblico) |
| Riferimenti | elenco qui sotto, sezione 2 | 3–5 reel che piacciono a Eugenio, solo link |
| Pronti | `video/` del sito + `progetto/social/magazzino-reel.md` | MP4 finiti, contati nella scorta di 26 |

Nel container di lavoro si usa una cartella temporanea con le stesse tre sottocartelle (`sorgenti/`, `riferimenti/`, `pronti/`), che non va mai nel commit.

## 2. Il gusto di Eugenio (reel di riferimento)

Eugenio sceglie **3–5 reel** (suoi o di altri) di cui gli piace il montaggio. Per ognuno Claude studia fotogrammi e audio:
ritmo e durata delle inquadrature, stile dei sottotitoli, transizioni, tipo di musica e volume rispetto alla voce.
Il risultato si scrive nella tabella "Regole ricavate".

**Regola principale: ispirarsi, mai copiare.** Non si riprendono inquadrature, testi, musiche, loghi o grafiche degli altri:
si ricava solo il ritmo e il modo di montare, e lo si rifà nello stile Nero & Oro di MD Edil Group.
I video di altri si analizzano e si cancellano, non si pubblicano e non vanno nel repository.

| # | Reel di riferimento | Cosa piace a Eugenio |
|---|---|---|
| 1 | [LINK REEL DI RIFERIMENTO 1] | [DA CHIEDERE A EUGENIO] |
| 2 | [LINK REEL DI RIFERIMENTO 2] | [DA CHIEDERE A EUGENIO] |
| 3 | [LINK REEL DI RIFERIMENTO 3] | [DA CHIEDERE A EUGENIO] |

### Regole ricavate
Ancora vuoto: si compila dopo aver studiato i reel di riferimento. Fino ad allora valgono solo le regole di md-edil-reels.

## 3. Video parlati di Eugenio ("giri e mandi")

Per i reel in cui Eugenio parla davanti al telefono (spiega un cantiere, un costo, una detrazione):
1. Eugenio gira come al solito e carica il file su Drive.
2. Claude toglie le pause: `python3 progetto/strumenti/taglia_pause.py registrazione.mov senza-pause.mp4`
   (prima `--solo-analisi` per vedere cosa taglia; con rumore di cantiere `--soglia -30`). Esce 1080x1920, 30 fps, -14 LUFS.
3. Poi come da md-edil-reels: sottotitoli dal parlato (Speko `audio_transcribe` con `word_timestamps`), logo, musica sotto la voce con sidechain, chiusura con contatti.
4. Le correzioni Eugenio le dà a parole ("hook più grande", "musica più bassa", "togli la seconda frase") e Claude rimonta.

## 4. Strumenti: cosa abbiamo e cosa no (verificato il 4/11/2026)

| Strumento del tutorial | A cosa serve | Da noi |
|---|---|---|
| FFmpeg | tagli, montaggio, esportazione | **sì**, installato (6.1); fa anche il lavoro di Remotion nella skill |
| Whisper | sottotitoli dal parlato | non serve: si usa **Speko `audio_transcribe`** (già nella skill); il modello Whisper nel container non si scarica (rete bloccata) |
| yt-dlp | scaricare i reel di riferimento | non installato; per i riferimenti basta che Eugenio mandi i file o i link |
| Remotion | montaggio con codice React | non installato e non necessario per ora |
| HyperFrames | grafiche animate | collegato come servizio HeyGen, ma la creazione da Claude Code è disattivata: grafiche fatte con FFmpeg |
| Piratex MCP | trovare i video che funzionano nella nicchia | non collegato; [DA VERIFICARE che cos'è, costi e affidabilità prima di usarlo] |
