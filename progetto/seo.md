# SEO – piano per portare mdedilgroup.it nelle prime posizioni

Obiettivo (Eugenio, 16/10/2026): prime posizioni su Google per ristrutturazioni, facciate, infissi/serramenti/finestre e case in legno, a **Roma e Lazio** (case in legno: **tutta Italia**). Testi sempre originali, mai copiati da altri siti.

## Parole chiave per pagina
Ogni pagina punta a un gruppo di ricerche, così le pagine non si fanno concorrenza tra loro.

| Pagina | Ricerche principali | Ricerche secondarie |
|---|---|---|
| `/` Home | impresa edile Roma, ristrutturazioni Roma | ristrutturazione chiavi in mano Roma, impresa ristrutturazioni Lazio |
| `/ristrutturazioni-interni` | ristrutturazione appartamento Roma | costo ristrutturazione casa Roma, ristrutturazione bagno/cucina Roma, ristrutturazione villa Roma |
| `/ristrutturazioni-esterni` | rifacimento facciata Roma, ristrutturazione facciate condominio | cappotto termico Roma, impresa facciate Lazio |
| `/infissi-serramenti` | infissi PVC Roma, sostituzione infissi Roma | finestre PVC prezzi, Rehau Synego prezzo, tapparelle alluminio coibentato, zanzariere Roma |
| `/case-in-legno` | case in legno prefabbricate prezzi | casa in legno chiavi in mano, casa in legno Lazio/Italia, A-frame, Barn House |
| `/interior-design` | interior designer Roma | progetto interior design, render 3D casa |
| `/chi-siamo` | impresa edile Roma (rafforza la Home) | impresa ristrutturazioni affidabile Roma |
| `/studio-tecnico` | pratiche edilizie Roma, CILA Roma, SCIA Roma | studio tecnico ristrutturazioni Roma |

## Fatto
- 16/10/2026: Search Console verificata (file `googlebe237534b9cfb8ff.html`), sitemap inviata e letta.
- 16/10/2026: titoli, descrizioni per Google e titoli principali (H1) riscritti con le parole chiave di ogni pagina; Home: sezione servizi "Ristrutturazioni chiavi in mano a Roma, dal progetto alla consegna".
- 16/10/2026: dati strutturati "Service" su ogni pagina di servizio (zona servita: Roma/Lazio, case in legno Italia); "FAQPage" sulla pagina infissi.
- 16/10/2026: pagina infissi con 7 domande frequenti sui prezzi (solo prezzi confermati da Eugenio).
- Già presenti: canonical, sitemap, robots, testo alternativo su tutte le foto, dati aziendali (GeneralContractor) con social e scheda Google.

- 16/10/2026: pubblicate le pagine /infissi-serramenti e /chi-siamo; Eugenio ha chiesto a Google l'indicizzazione (Controllo URL → Richiedi indicizzazione). Search Console: dati di Rendimento ancora in elaborazione.

- 17/10/2026: pagina facciate con simulatore di costo; descrizione per Google aggiornata ("Calcola subito il costo con il simulatore").

- 17/10/2026: "Guida alle lavorazioni" sotto i simulatori di interni (12 paragrafi, 43 voci) ed esterni (6 paragrafi, 39 voci): testo leggibile da Google con titoli H3 e descrizioni originali (cosa comprende, quando serve, come si misura), parole come rifacimento facciate, cappotto termico, impermeabilizzazione terrazzo, ripristino copriferro, ponteggio. Titoli e descrizioni delle voci delle facciate riscritti in modo più completo.

- 18/10/2026: **visibilità negli assistenti AI** (richiesta di Eugenio: farsi trovare anche da ChatGPT, Claude, Perplexity, Gemini). `robots.txt` ora lascia leggere il sito a motori di ricerca e assistenti AI (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot…); restano bloccati solo i copiatori aggressivi (Bytespider, Diffbot, omgili, ImagesiftBot). Nuovo `llms.txt` nella radice (descrizione dell'azienda, servizi, zone, prezzi case in legno, contatti, pagine) con intestazione UTF-8 in `netlify.toml`. Dati strutturati della Home: `@id`, catalogo dei 6 servizi (`hasOfferCatalog`) e socio AICOLE (`memberOf`); `/chi-siamo` con `AboutPage`. Tolta dalla Home la sezione news vuota ("[Titolo articolo]"). Leggere il sito non dà nessun permesso di modificarlo: sito statico senza pannello admin, aggiornabile solo da GitHub.
- Controllo da fare a metà novembre 2026: chiedere a ChatGPT/Claude/Perplexity "impresa edile Roma", "case in legno prefabbricate prezzi", "rifacimento facciata Roma" e annotare se e come compare MD Edil Group.

- 20/10/2026: **audit tecnico e SEO** (piano di 6 mesi di Eugenio, fase 1), risultato più sotto. Fatti subito, con l'ok di Eugenio ("se qualcosa puoi migliorare, fallo pure"):
  - **titolo principale (H1) della Home**: ora è la riga "Ristrutturazioni Roma · Milano · Case in legno in tutta Italia" (prima era lo slogan, senza parole di ricerca). Lo slogan "I dettagli fanno la differenza" resta identico a vista, come scritta grande che si digita;
  - **velocità**: larghezza e altezza su 137 foto (niente "salti" durante il caricamento, Core Web Vitals) e caricamento ritardato su 68 foto lontane dall'inizio della pagina (Home, interni, esterni). Controllato con le misure prima/dopo di tutte le foto, da telefono e da computer: nessuna differenza;
  - **misura delle richieste**: vedi `da-fare.md` (simulazioni completate, provenienza nel modulo).

## Audit del 20/10/2026 (fase 1)
Verificato nei file del sito; ciò che sta negli account Google (Search Console, Business, Servizi Locali) va controllato con le schermate di Eugenio.
- **Già a posto:** title, description e canonical propri su tutte le pagine; un H1 per pagina; testo alternativo su tutte le foto; dati strutturati GeneralContractor + Service (+ FAQPage infissi); sitemap e robots corretti; HTTPS e protezioni del browser; pagine statiche (Google legge tutto il testo senza script); nessun link interno rotto; Search Console verificata con sitemap letta (16/10).
- **Mancano:** Google Analytics 4 (non installato); pagine dedicate a bagno, locali commerciali, terrazzi e impermeabilizzazioni; sezione cantieri realizzati; orari di apertura e coordinate nei dati strutturati (servono gli orari veri da Eugenio); recensioni nei dati strutturati (solo quando ci sono recensioni vere).
- **Minori:** 3 titoli oltre 60 caratteri (interni, interior design, case in legno: Google taglia "| MD Edil Group", le parole importanti restano); "Milano" tra le zone servite da confermare; immagine di condivisione (og:image) è il logo.

## Da fare (in ordine di importanza)
0. **Prossimi interventi proposti dopo l'audit del 20/10/2026** (in attesa dell'ok di Eugenio): pagina **/ristrutturazione-bagno-roma**; Google Analytics 4 che parte solo dopo "ACCETTO" nell'avviso cookie (serve il codice G-… da Eugenio, poi CSP e privacy); report mensile da Search Console (schermate di Rendimento e Pagine).
1. **Recensioni Google**: chiederle a ogni cliente con il link `https://g.page/r/CSlUfVvDiZqIEBM/review`. È il fattore più forte per "ristrutturazioni Roma" su Maps.
2. **Scheda Google Business** (la fa Eugenio): categoria principale "Impresa edile", categorie secondarie (ristrutturazioni, installazione finestre, facciate…), elenco servizi con descrizione, foto dei cantieri ogni settimana, un post al mese, sito `https://mdedilgroup.it`.
3. **Domande frequenti** con prezzi reali anche su ristrutturazioni interni, esterni e case in legno (+ dati strutturati FAQPage).
4. **Guide / news** (la Home ha già la sezione "Dal nostro taccuino", oggi vuota): un articolo al mese, scritto con dati veri. Idee: "Quanto costa ristrutturare un appartamento a Roma", "Infissi in PVC: come scegliere", "Rifacimento della facciata in condominio: passaggi e tempi", "Case in legno: quanto costano davvero chiavi in mano".
5. **Link da altri siti**: pagina soci di AICOLE con link al sito, elenchi seri (PagineGialle, Houzz, Instapro/ProntoPro, Habitissimo), fornitori (Rehau, Pracal, Primed) se hanno un elenco installatori.
6. **Lavori realizzati con la zona** (es. "Ristrutturazione appartamento a Prati"): una scheda per ogni cantiere importante, con foto prima/dopo e testo vero. Niente pagine "fotocopia" città per città.
7. **Velocità del sito**: misure delle immagini fatte il 20/10/2026; controllare "Core Web Vitals" in Search Console.
8. **Controllo mensile**: Eugenio manda le foto di Search Console (Rendimento, Pagine, Core Web Vitals); si correggono gli errori e si rafforzano le ricerche che stanno salendo.

## Regole
- Niente testi copiati da altri siti né parole chiave ripetute a forza: una frase deve suonare naturale a chi la legge.
- Niente prezzi, numeri o recensioni inventati.
- Una pagina = un argomento principale. Le pagine nuove vanno anche in `sitemap.xml`.

- [x] 17/10/2026 – Icona del sito su fondo nero (`favicon-512.png`, `favicon.ico`) e logo dei dati strutturati aggiornato: Google la sostituisce nei risultati da solo, di solito in qualche giorno o settimana dopo la pubblicazione.
