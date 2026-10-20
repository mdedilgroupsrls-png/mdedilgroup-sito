# SEO – piano per portare mdedilgroup.it nelle prime posizioni

Obiettivo (Eugenio, 16/10/2026): prime posizioni su Google per ristrutturazioni, facciate, infissi/serramenti/finestre e case in legno, a **Roma e Lazio** (case in legno: **tutta Italia**). Testi sempre originali, mai copiati da altri siti.

## Parole chiave per pagina
Ogni pagina punta a un gruppo di ricerche, così le pagine non si fanno concorrenza tra loro.

| Pagina | Ricerche principali | Ricerche secondarie |
|---|---|---|
| `/` Home | impresa edile Roma, ristrutturazioni Roma | ristrutturazione chiavi in mano Roma, impresa ristrutturazioni Lazio |
| `/ristrutturazioni-interni` | ristrutturazione appartamento Roma | costo ristrutturazione casa Roma, ristrutturazione bagno/cucina Roma, ristrutturazione villa Roma |
| `/ristrutturazione-bagno-roma` | ristrutturazione bagno Roma, rifacimento bagno Roma | quanto costa rifare un bagno, bagno chiavi in mano Roma, impermeabilizzazione doccia, ristrutturazione bagno prezzi |
| `/finiture-di-pregio-roma` | finiture di pregio ristrutturazione Roma | collettore idrico sportello d'ispezione a filo, angoli a 45 gradi piastrelle (jolly), posa grandi lastre gres 120x280, tagli di luce LED soffitto |
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

- 20/10/2026: **nuova pagina /ristrutturazione-bagno-roma** (title "Ristrutturazione bagno a Roma chiavi in mano", 59 caratteri; H1, 6 fasi H3, 6 FAQ con FAQPage, BreadcrumbList, foto vere con zona, link al simulatore e al modulo). Pagina di approfondimento dentro /ristrutturazioni-interni (non nel menu), in sitemap e in `llms.txt`. Dopo la pubblicazione: Search Console → Controllo URL → Richiedi indicizzazione.

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

## Piano di 6 mesi (Eugenio, 20/10/2026) – promemoria per ogni sessione
Metodo: un passo alla volta. Claude spiega cosa fare e perché, mostra la situazione, propone, aspetta l'ok di Eugenio, esegue, verifica, aggiorna questo file e indica il passo successivo. **Claude chiede a Eugenio foto, prezzi, zone e dati mancanti un po' alla volta; se un punto resta fermo per una settimana lo riprende e lo richiede** (promemoria settimanale automatico in chat, il martedì mattina). Mai posizioni o clienti garantiti, mai dati stimati presentati come misurati.
- **Mese 1 (ott–nov 2026) – fondamenta:** [x] audit · [x] contatori delle conversioni · [x] H1 Home · [x] foto più veloci · [ ] Search Console: primo report (schermate da Eugenio) · [x] Google Analytics 4 con consenso (G-QQ9YF9PYJ2, 20/10/2026; eventi chiave da segnare dopo la pubblicazione) · [ ] scheda Google Business controllata (schermate) · [ ] Servizi Locali: verifica organizzazione e assicurazione
- **Mese 2 – commerciale:** [x] pagina bagno (20/10, da completare con le risposte di Eugenio) · [ ] pagina strutture ricettive e alberghiere (materiale di Eugenio) · [ ] pagina ristrutturazione casa chiavi in mano · [ ] FAQ con prezzi reali su interni · [ ] primi contatti da Servizi Locali
- **Mese 3 – reputazione e contenuti:** [ ] procedura recensioni · [ ] schede cantieri (zona, immobile, lavori, materiali, foto prima/dopo, tempi veri) · [ ] foto settimanali su Google Business
- **Mese 4 – espansione:** [ ] terrazzi e impermeabilizzazioni · [ ] facciate condominio · [ ] locali commerciali (solo con foto vere, dentro interni) · [ ] contenuti di zona solo con cantieri reali
- **Mese 5 – ottimizzazione:** parole chiave che salgono, pagine deboli, conversioni
- **Mese 6 – consolidamento:** audit di confronto, contatti e contratti, piano successivo
- **Report:** controllo settimanale breve (statistiche anonime) e report mensile (Search Console + statistiche + contatti/contratti che Eugenio comunica)

## Pagine di approfondimento: ordine proposto (20/10/2026)
Eugenio: finita una pagina si passa alla successiva; 2-3 pagine per ogni pagina principale, sulle ricerche più fatte su Google. Una alla volta, con foto e dati di Eugenio.
- **Interni:** [x] Ristrutturazione bagno · [x] I dettagli dei nostri lavori / finiture di pregio (20/10/2026, si arricchisce con nuove foto) · [ ] Ristrutturazione cucina (2 foto vere + 3 render) · [ ] Strutture ricettive e hotel (materiale di Eugenio)
- **Esterni:** [ ] Rifacimento facciata condominio (14 foto facciate) · [ ] Cappotto termico: costi e vantaggi · [ ] Impermeabilizzazione terrazzi e balconi (servono foto)
- **Infissi:** [ ] Sostituzione finestre in PVC: costi e domande · [ ] Tapparelle e zanzariere (foto Pracal e Primed già sul sito)
- **Case in legno:** [ ] Permessi e fondazioni per una casa in legno · [ ] Case A-frame: modelli e prezzi

## Domande aperte per Eugenio (aggiornare quando risponde; **richiedere quelle senza risposta**, ma **al massimo 3-4 domande per messaggio**, messaggi brevi)
- Google Business: sembra verificato, da controllare insieme (schermate di categorie, servizi, zona) – Servizi Locali ancora in verifica
- Bagno: [x] lavoro raccontato con foto durante/dopo (villa all'Olgiata, 20/10/2026). Superficie (circa 4–5 m²) e durata (più di una settimana) inserite. Ancora utile: altri bagni con foto e zona quando ci sono. **Non usare per ora `img/bagno-lastre.webp` (bagno in cantiere) né `img/dettaglio-impianti.webp`**: Eugenio manderà più avanti le foto del bagno finito (20/10/2026)
- Pagina dettagli: altri dettagli con foto (cos'è + dove) quando Eugenio li manda
- **Più avanti, li chiede Eugenio / da richiedere con calma (non a ogni messaggio):** foto prima/durante/dopo dei bagni con zona; materiale delle strutture ricettive e alberghi (foto, tipo di struttura, zona, lavori)
- **Search Console:** schermate Rendimento (28 giorni) e Pagine → **richiederle il 3/11/2026** (Eugenio: tra 2 settimane; promemoria programmato)
- Risposte avute (20/10/2026): simulatore del bagno invariato a 6.500 € fino a 5 m² (la pagina dice "da 5.500 €"); collettore della pagina dettagli a Piazza Fiume, marca Teco; bagno Piazza Fiume con costo indicativo circa 7.000 € IVA inclusa (in linea con il simulatore per 6–7 m²); piastrelle del pavimento del bagno escluse come i rivestimenti; orario ufficio lunedì–sabato 8–18 continuato (inserito nei dati per Google); bagno "a partire da 5.500 €" (prima 6.500, cambiato da Eugenio; non prezzo fisso); Milano solo per ristrutturazioni complete; niente modalità di pagamento nel PDF delle case in legno (variano); infissi: limiti di demolizione e posa confermati; contatore dei preventivi azzerato, non bagni o piccoli lavori; finitura silossanica ammessa con il cappotto (il simulatore la permette già con il cappotto EPS); finito di norma in una settimana; compreso tutto il materiale che resta murato, esclusi rivestimenti, sanitari, rubinetteria, piatto e box doccia, accessori e tutto il resto

## Regole
- **Foto di Eugenio:** le manda un po' alla volta dicendo cosa sono; Claude scrive per ognuna testo alternativo, didascalia e nome del file pensati per Google (lavoro + materiale + zona di Roma, frasi naturali, niente parole ripetute a forza), le converte in webp leggere e le mette nella pagina giusta.
- **Struttura del sito (Eugenio, 20/10/2026):** menu e Home restano con le pagine principali. Ogni nuova pagina SEO è un approfondimento **dentro** la pagina madre del suo tipo di lavoro: interni (bagno, strutture ricettive, alberghi, locali…) dentro /ristrutturazioni-interni; esterni (terrazzi, facciate, coperture…) dentro /ristrutturazioni-esterni, con foto anche in fase di lavorazione; case in legno dentro /case-in-legno; infissi dentro /infissi-serramenti. Le pagine **non sono nascoste**: si aprono dall'elenco "Approfondimenti" ben visibile nella pagina madre (subito sotto l'elenco delle lavorazioni); **mai dal menu né dalla Home** (Eugenio, 20/10/2026, ultima indicazione). Per Google: sitemap, link interno, `llms.txt`, richiesta di indicizzazione in Search Console.
- **Prezzi:** niente prezzi "a partire da" o fissi nelle pagine di approfondimento senza l'ok di Eugenio: ogni lavoro ha un costo diverso.
- Niente testi copiati da altri siti né parole chiave ripetute a forza: una frase deve suonare naturale a chi la legge.
- Niente prezzi, numeri o recensioni inventati.
- Una pagina = un argomento principale. Le pagine nuove vanno anche in `sitemap.xml`.

- [x] 17/10/2026 – Icona del sito su fondo nero (`favicon-512.png`, `favicon.ico`) e logo dei dati strutturati aggiornato: Google la sostituisce nei risultati da solo, di solito in qualche giorno o settimana dopo la pubblicazione.
