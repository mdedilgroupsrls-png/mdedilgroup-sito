# Da fare sul sito

Aggiornato al 14/10/2026, giorno in cui il sito Nero & Oro è andato online.

## Da completare
- [ ] **Chiave Instagram da sistemare (15/10/2026):** il segreto GitHub `IG_TOKEN` contiene per errore l'ID dell'account (17841408230956715), non la chiave. "Genera token" nell'app Meta dà "HTTP ERROR 500" sulla pagina di autorizzazione di Instagram (provato con Edge, Chrome e telefono). Riprovare; se continua, passare all'API Instagram con login di Facebook (Pagina Facebook collegata, permette anche le visualizzazioni) e adattare `progetto/strumenti/aggiorna_reels.py`. Finché la chiave è sbagliata l'aggiornamento automatico fallisce senza toccare la Home
- [ ] Zone di Roma delle foto delle facciate (es. "Garbatella · Roma"): servono le foto originali dal telefono (con posizione GPS) o l'elenco delle zone. Per ora la riga della zona è nascosta sul sito
- [ ] Visualizzazioni dei reel: serve il permesso `instagram_business_manage_insights` nell'app Meta "Sito Md Edil Group" e una nuova chiave in `IG_TOKEN`; senza, il sito mostra solo mi piace e commenti
- [ ] Rinnovo della chiave Instagram (dura 60 giorni): aggiungere il segreto `GH_PAT` per il rinnovo automatico, oppure rigenerarla a mano entro metà dicembre 2026
- [ ] Decidere come mostrare i numeri dei reel nuovi con 0 mi piace (tutti i numeri / solo visualizzazioni / prima i più visti)
- [ ] Reel esclusi dal sito: muratori e intelligenza artificiale, opera invisibile da 15.000 euro, "casa in legno chiavi in mano da 1.300 €/m²" (in contrasto con il prezzo della sola struttura)
- [ ] Pagina **Infissi e serramenti** con simulatore costi (prezzi e catalogo da Eugenio)
- [ ] Pagina **Case in legno** collegata al configuratore esistente
- [ ] Pagina **Chi siamo**
- [ ] Link reali dei profili **Facebook e TikTok** nel footer (ora puntano alle pagine generiche)
- [ ] Prezzo del **tiro in alto / in basso** dei materiali, poi aggiornare il simulatore
- [ ] Riallineare `privacy.html` e aggiungere la cookie policy nello stile Nero & Oro
- [ ] Decidere quale sede indicare come ufficio

## Fatto
- [x] 15/10/2026 – Interior design, "Le tavole che ricevi": da 14 a 11 tavole come deciso da Eugenio: rilievo; pianta di progetto e arredo; demolizioni; nuove costruzioni (queste tre sempre separate); controsoffitti; elettrico + illuminotecnica; idrico + termico + clima; pavimenti e rivestimenti; bagni e cucina; porte + arredi + finiture; render 3D
- [x] 15/10/2026 – Pagina Ristrutturazioni esterni: "Per gli amministratori di condominio" diventa "Per i condomini" e l'invito finale "Condominio o casa privata?"; la galleria "Esterni e facciate" della Home ora ha tutte le 14 foto dei lavori realizzati, come la pagina esterni
- [x] 15/10/2026 – Tolta dalla galleria "Esterni e facciate" della Home la foto della posa del pavimento esterno a spina di pesce con la squadra (file cancellato): la galleria ora parte dalle facciate
- [x] 15/10/2026 – Tolte dalla galleria "Realizziamo lavori chiavi in mano" le 5 foto di cantiere precedenti (bagno marmo, LED, villa, impianti, infissi): ora restano solo le 16 foto dei lavori finiti. Cancellati i file di LED, villa e impianti; bagno marmo e infissi restano come anteprime nella lista dei servizi
- [x] 15/10/2026 – Aggiunte 16 foto di lavori finiti (bagni, camere, soggiorno, cucina, corridoio; `img/lavoro-01…16.webp`, senza dati GPS) nella galleria "Realizziamo lavori chiavi in mano" della Home, prima delle 5 foto di cantiere. Zone indicate da Eugenio il 15/10/2026 e scritte sotto ogni foto (Olgiata, Corso Francia, San Giovanni, Piazza Fiume, Manzoni, Prati)
- [x] 15/10/2026 – **Reel Instagram automatici**: app Meta "Sito Md Edil Group" (API Instagram con login di Instagram, md_edil_group tester), chiave salvata nel segreto GitHub `IG_TOKEN`; ogni mattina GitHub aggiorna copertine, testi e numeri dei reel nella Home
- [x] 14/10/2026 – Netlify: spenta la barra di Netlify (Netlify Drawer) anche per le Deploy Previews; Branch deploys e Heads-up display erano già spenti. Sul sito pubblico mdedilgroup.it la barra non è mai comparsa ai clienti (la vede solo chi ha fatto l'accesso a Netlify)
- [x] 14/10/2026 – Collegata la scheda Google Business di Via Po 22: icona nel footer di tutte le pagine e riquadro "MD Edil Group su Google Maps" nei contatti della Home (mappa caricata solo su richiesta)
- [x] 14/10/2026 – **Pubblicata la nuova Home "Cinema"** al posto della precedente (menu verso le pagine vere, modulo `preventivo` invariato, zone delle facciate nascoste)
- [x] 14/10/2026 – Preparate 3 proposte animate della Home (Cinema, Prima e dopo, Progetto); Eugenio ha scelto **Cinema** e l'ha rifinita (vedi `design.md`)
- [x] 14/10/2026 – Pagina Ristrutturazioni esterni: galleria "Lavori realizzati" spostata sopra la sezione del metodo; titolo "Il nostro studio tecnico segue tutto" rimpicciolito
- [x] 14/10/2026 – Aggiunte 14 foto di facciate condominiali (cantieri e lavori finiti, `img/facciata-01…14.webp`) nella galleria "Esterni e facciate" della Home, al posto del segnaposto, e nella galleria "Lavori realizzati" della pagina Ristrutturazioni esterni, al posto dei 3 `[FOTO CANTIERE]`
- [x] 14/10/2026 – Aggiunti 12 render nella pagina Interior design (galleria scorrevole) e 4 nella galleria della Home, al posto del segnaposto
- [x] 14/10/2026 – Tolti dalla galleria della Home i 2 render precedenti (soggiorno con camino, camera con anello luminoso); nella sezione metodo della Home la camera è sostituita da `id-camera-noce`
- [x] 14/10/2026 – Didascalia dei render cambiata in "RENDER DI PROGETTO BY ARCHITETTO ADRIANA SCLIFOS" su tutte le foto (Home e Interior design)

## Gestione continua
- Aggiornamenti settimanali del sito con nuove informazioni e foto dei lavori
- Articoli per il blog e lavoro SEO, obiettivo: primi risultati su Google per ristrutturazioni di pregio a Roma e Milano
- Riutilizzare il video del tour villa (`video/tour-villa.mp4`) nel nuovo design
