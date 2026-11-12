# Pagine delle voci (Eugenio, 23–25/10/2026): una pagina per ogni lavoro, con prezzi presi dal suo simulatore,
# esempi calcolati, zone di Roma e domande frequenti. Testa, header e footer come l'articolo del bagno; tutto il resto
# sono titoli che si aprono, ognuno con il suo link (#id). Uso:
#   python3 progetto/strumenti/pagine_voci.py
# I testi delle pagine sono in VOCI qui sotto; i calcoli usano i prezzi di js/esterni.js (+ IVA).
import html, json, os, re
from PIL import Image

RADICE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITO = 'https://mdedilgroup.it'
e = lambda t: html.escape(t, quote=False)


def eur(v, dec=None):
    s = f"{v:,.2f}" if (dec or (dec is None and round(v, 2) % 1)) else f"{round(v):,}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.') + ' €'


# prezzi del simulatore esterni (js/esterni.js), + IVA
def prezzi_esterni():
    src = open(os.path.join(RADICE, 'js/esterni.js'), encoding='utf-8').read()
    P = {m.group(1): float(m.group(2)) for m in re.finditer(r"id: '(\w+)'[^{}]*?\bp: ([\d.]+)", src)}
    P.update({m.group(1): float(m.group(2)) for m in re.finditer(r"v: '(\w+)'[^{}]*?\bp: ([\d.]+)", src)})
    for k, v in (('guaina1', r'return 23 \*'), ('guaina2', r'return 16 \*'), ('mapelastic', r'return 30 \*')):
        assert re.search(v, src), k  # prezzi scritti dentro le funzioni di calcolo
    P.update(guaina1=23, guaina2=16, mapelastic=30, sicurezza=0.08)
    return P


X = prezzi_esterni()


# prezzi del simulatore interni (js/ristrutturazione.js), IVA inclusa
def prezzi_interni():
    src = open(os.path.join(RADICE, 'js/ristrutturazione.js'), encoding='utf-8').read()
    return {m.group(1): float(m.group(2)) for m in re.finditer(r"id: '(\w+)'[^{}]*?\bp: ([\d.]+)", src)}


I = prezzi_interni()
quadro_el = lambda mq: 750 if mq <= 70 else 1000 if mq <= 100 else 1000 + -(-(mq - 100) // 20) * 250
smont_el = lambda mq: I['disEl'] + (0 if mq <= 70 else -(-(mq - 70) // 30) * 250)
EL = {mq: (mq * I['punti'], quadro_el(mq), smont_el(mq)) for mq in (50, 70, 100)}
TAB = lambda righe: ('<div style="overflow-x: auto; margin: 0 0 18px"><table style="width: 100%; border-collapse: collapse; font-size: 15px">' +
                     ''.join('<tr><td style="padding: 10px 8px; border-bottom: 1px solid #2A2722">' + a + '</td><td style="padding: 10px 8px; border-bottom: 1px solid #2A2722; text-align: right; white-space: nowrap">' + b + '</td></tr>' for a, b in righe) +
                     '</table></div>')
P = lambda t: '<p>' + t + '</p>'


def FIG(src, alt, cap):
    w, h = Image.open(os.path.join(RADICE, src.lstrip('/'))).size
    return ('<figure style="margin: 18px 0 8px"><img loading="lazy" decoding="async" width="%d" height="%d" src="%s" alt="%s" style="display: block; width: 100%%; height: auto">'
            '<figcaption style="margin-top: 8px; font-size: 13px; color: #8A8478">%s</figcaption></figure>' % (w, h, src, html.escape(alt, quote=True), html.escape(cap, quote=False)))

# --- facciata ---
parz = X['spicc'] + X['armata'] + X['silossanica']
into = parz + X['intonaco']
cap12 = X['cap12'] + X['intonachino']
cap14 = X['cap14'] + X['intonachino']
pon = X['pon1']


def esempio(mq, al_mq):
    lav = mq * al_mq + mq * pon
    return lav * (1 + X['sicurezza'])


F_COND = (esempio(700, parz), esempio(700, cap12))
F_VILLA = (esempio(250, parz), esempio(250, cap12))

# --- terrazzo ---
senza_mq = X['ten1'] + X['ten3']
completo_mq = X['terDem'] + X['guainaRim'] + X['guaina1'] + X['massetto'] + X['mapelastic'] + X['gres']
T_MQ, T_PER = 30, 22
T_SENZA = (T_MQ * senza_mq + T_PER * X['ten2']) * (1 + X['sicurezza'])
T_COMPL = (T_MQ * completo_mq + T_PER * X['battisc'] + X['bocch']) * (1 + X['sicurezza'])

ZONE = ('Lavoriamo in tutte le zone di Roma e in provincia: a Roma Nord (Parioli, Salario, Trieste, Nomentana, Monte Sacro, Talenti, Vigna Clara, Cassia, Balduina), '
        'nel Centro e a Prati, a Roma Est (Tiburtino, Prenestino, Tuscolano, Appio Latino), a Roma Sud e Ovest (EUR, Ostiense, Monteverde, Aurelio) e sul litorale (Ostia, Infernetto, Casal Palocco). '
        'Il sopralluogo è gratuito, la sede operativa è a Monterotondo.')

VOCI = [
    dict(
        file='controsoffitti-cartongesso-roma', madre='ristrutturazioni-interni', nome_madre='Ristrutturazioni interni', briciola='CARTONGESSO',
        title='Controsoffitti e pareti in cartongesso a Roma: prezzi | MD Edil Group',
        desc='Controsoffitto in cartongesso a Roma a %s al m², pareti divisorie a %s al m² e velette per luci LED a %s al metro, IVA inclusa. Esempi e domande.' % (eur(I['ctrSof']), eur(I['divCar']), eur(I['velette'])),
        ey='RISTRUTTURAZIONI INTERNI · CARTONGESSO',
        h1='Controsoffitti e pareti in cartongesso a Roma: prezzi, usi ed esempi',
        breve=('Con i prezzi del nostro simulatore, a Roma il <b style="color: #E2C373">controsoffitto in cartongesso costa %s al m²</b>, la parete divisoria %s al m² e le velette per le luci LED %s al metro lineare, <b>IVA inclusa</b>. Rasatura e pittura a parte.') % (eur(I['ctrSof']), eur(I['divCar']), eur(I['velette'])),
        intro='Il cartongesso è il modo più rapido per cambiare un ambiente senza opere pesanti: abbassa un soffitto per nascondere impianti e tubazioni, crea luce indiretta con strisce LED, divide una stanza in due in pochi giorni. Lo usiamo in quasi tutte le nostre ristrutturazioni di appartamenti e ville a Roma.',
        foto=('/img/dettaglio-led.webp', 'Corridoio con controsoffitto in cartongesso e profili LED a scomparsa in un appartamento a Roma', 'Controsoffitto in cartongesso con profili LED a scomparsa, in un nostro cantiere.'),
        sezioni=[
            ('prezzi-cartongesso', 'I prezzi del cartongesso',
             TAB([('Controsoffitto: struttura metallica, lastre da 13 mm, giunti stuccati in due mani', eur(I['ctrSof']) + ' al m²'),
                  ('Parete divisoria spessa 10 cm, lastre sui due lati', eur(I['divCar']) + ' al m²'),
                  ('Velette e mensole sagomate per strisce LED', eur(I['velette']) + ' al metro')]) +
             P('Prezzi IVA inclusa dal listino del nostro simulatore per gli interni. Rasatura e pittura si aggiungono a parte, come per le altre pareti.')),
            ('controsoffitto-cartongesso-a-cosa-serve', 'Controsoffitto: a cosa serve',
             P('Il controsoffitto abbassa il soffitto di qualche centimetro e crea uno spazio dove passano impianti elettrici, tubazioni del clima e ventilazione. Permette di inserire faretti incassati e profili LED senza tracce nel solaio, e migliora l’acustica degli ambienti.') +
             P('Si usa spesso in corridoi, bagni e cucine, dove nasconde le tubazioni, e nei soggiorni per disegnare la luce.')),
            ('parete-divisoria-cartongesso', 'Pareti divisorie: una stanza in più in pochi giorni',
             P('Una parete in cartongesso spessa 10 cm si monta in poco tempo, senza macerie e senza caricare il solaio come una parete in muratura. Dentro passano prese, interruttori e tubazioni, e si possono ricavare nicchie e librerie.')),
            ('esempi-costo-cartongesso', 'Esempi di costo',
             TAB([('Soggiorno di 30 m²: controsoffitto e 12 m di velette LED', eur(30 * I['ctrSof'] + 12 * I['velette'])),
                  ('Parete divisoria lunga 3 m e alta 2,70 m (8,1 m²)', eur(8.1 * I['divCar'])),
                  ('Corridoio di 8 m²: controsoffitto', eur(8 * I['ctrSof']))]) +
             P('Esempi calcolati con i prezzi del simulatore, IVA inclusa. Non comprendono rasatura, pittura, faretti e strisce LED.')),
            ('zone-roma-cartongesso', 'Dove lavoriamo a Roma', P(ZONE)),
        ],
        faq=[('Quanto costa un controsoffitto in cartongesso al m²?', 'Con i prezzi del nostro simulatore, %s al m² IVA inclusa: struttura metallica, lastre da 13 mm e giunti stuccati in due mani. Rasatura e pittura a parte.' % eur(I['ctrSof'])),
             ('Quanto costa una parete in cartongesso?', '%s al m² IVA inclusa: una parete lunga 3 m e alta 2,70 m costa circa %s.' % (eur(I['divCar']), eur(8.1 * I['divCar']))),
             ('Il controsoffitto abbassa molto il soffitto?', 'Di solito di pochi centimetri, quanto basta per far passare impianti e faretti: l’altezza si decide insieme durante il sopralluogo.'),
             ('Si possono mettere le luci LED nel cartongesso?', 'Sì: con velette e mensole sagomate le strisce LED restano nascoste e danno luce indiretta su soffitti e pareti, a %s al metro lineare.' % eur(I['velette']))],
        sim=('/simulatore-online-costi-ristrutturazioni-interni', 'CALCOLA IL COSTO DELLA TUA CASA'),
        nota='Prezzi del listino MD Edil Group per gli interni, IVA inclusa, aggiornati al 12/11/2026: stime indicative, il prezzo definitivo si conferma dopo il sopralluogo gratuito. Tutti i lavori interni nella pagina <a href="/ristrutturazioni-interni">ristrutturazione di appartamenti a Roma</a>.',
    ),
    dict(
        file='rifacimento-impianto-elettrico-roma', madre='ristrutturazioni-interni', nome_madre='Ristrutturazioni interni', briciola='IMPIANTO ELETTRICO',
        title='Rifacimento impianto elettrico a Roma: costi e segnali | MD Edil Group',
        desc='Rifacimento dell’impianto elettrico di casa a Roma: %s a punto luce, quadro da %s, esempi per 50, 70 e 100 m² IVA inclusa e i segnali che l’impianto va rifatto.' % (eur(I['punti']), eur(750)),
        ey='RISTRUTTURAZIONI INTERNI · IMPIANTO ELETTRICO',
        h1='Rifacimento dell’impianto elettrico a Roma: quando serve e quanto costa',
        breve=('Con i prezzi del nostro simulatore, rifare l’impianto elettrico di un appartamento a Roma costa <b style="color: #E2C373">%s per ogni punto luce o presa</b>, più il nuovo quadro (da %s) e lo smontaggio del vecchio impianto (da %s), <b>IVA inclusa</b>. '
               'Per una casa di 70 m² si arriva a circa <b>%s</b>.') % (eur(I['punti']), eur(750), eur(I['disEl']), eur(sum(EL[70]))),
        intro='Un impianto elettrico vecchio non si vede, ma si sente: il salvavita che scatta, le prese che non bastano mai, le ciabatte ovunque. Quando si ristruttura casa è il momento giusto per rifarlo, perché le tracce nei muri si chiudono insieme alle altre opere. Lo realizziamo con tecnici abilitati e lo consegniamo con la dichiarazione di conformità.',
        foto=('/img/soggiorno-cantiere.webp', 'Cantiere di ristrutturazione di un appartamento a Roma con impianto elettrico in corso', 'Un nostro cantiere: impianti in corso prima dei controsoffitti.'),
        sezioni=[
            ('segnali-impianto-elettrico-da-rifare', 'Cinque segnali che l’impianto elettrico va rifatto',
             '<ul style="margin: 0 0 16px; padding-left: 22px">'
             '<li><b>Il salvavita scatta spesso</b> o, peggio, non c’è un interruttore differenziale nel quadro.</li>'
             '<li><b>Prese senza messa a terra</b>, con due soli fori, o prese bruciacchiate e calde al tatto.</li>'
             '<li><b>Fili in stoffa o tubi esterni</b> sui muri: sono segni di un impianto di molti decenni fa.</li>'
             '<li><b>Prese e punti luce che non bastano</b>: ciabatte e prolunghe fisse in ogni stanza.</li>'
             '<li><b>Nessuna dichiarazione di conformità</b>: senza, l’impianto non è documentato e può servire per vendere, affittare o allacciare nuove utenze.</li></ul>' +
             P('Se riconosci uno di questi segnali, conviene farlo controllare: durante il sopralluogo gratuito verifichiamo quadro, prese e linee e ti diciamo se basta adeguarlo o se va rifatto.')),
            ('prezzi-rifacimento-impianto-elettrico', 'Quanto costa rifare l’impianto elettrico: i prezzi',
             TAB([('Punto luce o presa (linee, scatole, frutti tipo BTicino e opere murarie)', eur(I['punti']) + ' a punto'),
                  ('Nuovo quadro elettrico fino a 70 m² di casa', eur(750)),
                  ('Nuovo quadro elettrico fino a 100 m², poi 250 € ogni 20 m² in più', eur(1000)),
                  ('Smontaggio del vecchio impianto fino a 70 m², poi 250 € ogni 30 m² in più', eur(I['disEl']))]) +
             P('Prezzi IVA inclusa dal listino del nostro simulatore per gli interni. Per orientarti, in una casa serve circa un punto luce o presa per ogni metro quadro.')),
            ('esempi-costo-impianto-elettrico', 'Esempi: casa da 50, 70 e 100 m²',
             TAB([('%d m² · %d punti, quadro e smontaggio' % (mq, mq), eur(sum(EL[mq]))) for mq in (50, 70, 100)]) +
             P('Calcolo con un punto per ogni m² di casa, il quadro e lo smontaggio del vecchio impianto. Non comprende rasature e pitture dopo le tracce, che trovi a parte nel simulatore, né lampadari e corpi illuminanti.')),
            ('dichiarazione-di-conformita-impianto-elettrico', 'Norme e dichiarazione di conformità',
             P('L’impianto viene realizzato da tecnici abilitati e consegnato con la <b>dichiarazione di conformità</b> prevista dal D.M. 37/2008: è il documento che attesta che l’impianto è fatto a regola d’arte, e serve anche per le pratiche e per i bonus.') +
             P('Il rifacimento dell’impianto elettrico, dentro una ristrutturazione, rientra nelle spese del bonus ristrutturazioni: trovi le regole nella nostra <a href="/detrazioni-ristrutturazione-infissi-2026">guida alle detrazioni 2026</a>.')),
            ('impianto-elettrico-e-ristrutturazione', 'Rifarlo durante la ristrutturazione',
             P('Il momento migliore per rifare l’impianto è durante una ristrutturazione: le tracce nei muri si aprono e si chiudono insieme alle altre opere, e con i controsoffitti in cartongesso si possono aggiungere faretti e strisce LED senza rompere i soffitti.') +
             P('Nel <a href="/simulatore-online-costi-ristrutturazioni-interni">simulatore della ristrutturazione</a> trovi l’impianto elettrico insieme a tutte le altre voci, con il totale della tua casa.')),
            ('video-impianto-elettrico', 'Il video: impianto elettrico da rifare in 30 secondi',
             '<video controls playsinline preload="none" poster="/img/social-impianto-elettrico-copertina.jpg" width="1080" height="1920" aria-label="Video: impianto elettrico da rifare, segnali e costi a Roma" style="display: block; width: 100%; max-width: 420px; height: auto; margin: 0 0 18px; background: #000"><source src="/video/rifacimento-impianto-elettrico-roma-reel.mp4" type="video/mp4">Il tuo browser non riproduce il video.</video>'),
            ('zone-roma-impianto-elettrico', 'Dove lavoriamo a Roma', P(ZONE)),
        ],
        faq=[('Quanto costa rifare l’impianto elettrico di una casa di 70 m²?', 'Con i prezzi del nostro simulatore, circa %s IVA inclusa: 70 punti luce e prese a %s l’uno, il nuovo quadro e lo smontaggio del vecchio impianto. Rasature e pitture a parte.' % (eur(sum(EL[70])), eur(I['punti']))),
             ('Come capisco se l’impianto elettrico va rifatto?', 'I segnali più comuni sono il salvavita che scatta spesso o assente, prese senza messa a terra, fili in stoffa o tubi esterni, poche prese e nessuna dichiarazione di conformità. Con il sopralluogo gratuito lo verifichiamo noi.'),
             ('Il nuovo impianto ha la dichiarazione di conformità?', 'Sì: lo realizzano tecnici abilitati e lo consegniamo con la dichiarazione di conformità prevista dal D.M. 37/2008.'),
             ('Si può rifare l’impianto senza rifare tutta la casa?', 'Sì, ma le tracce nei muri vanno poi chiuse, rasate e pitturate: per questo conviene farlo insieme agli altri lavori di ristrutturazione.')],
        sim=('/simulatore-online-costi-ristrutturazioni-interni', 'CALCOLA IL COSTO DELLA TUA CASA'),
        nota='Prezzi del listino MD Edil Group per gli interni, IVA inclusa, aggiornati al 12/11/2026: stime indicative, il prezzo definitivo si conferma dopo il sopralluogo gratuito. Tutti i lavori interni nella pagina <a href="/ristrutturazioni-interni">ristrutturazione di appartamenti a Roma</a>.',
    ),
    dict(
        file='rifacimento-facciata-roma', madre='ristrutturazioni-esterni', nome_madre='Ristrutturazioni esterni', briciola='FACCIATE',
        title='Rifacimento facciata a Roma: prezzi al m² e condomini | MD Edil Group',
        desc='Rifacimento della facciata a Roma da %s a %s al m² + IVA: ripristino, intonaco o cappotto termico. Esempi per condominio e villa calcolati con il nostro simulatore.' % (eur(parz), eur(cap14)),
        ey='RISTRUTTURAZIONI ESTERNI · FACCIATE',
        h1='Rifacimento della facciata a Roma: prezzi, lavori ed esempi per condomini e ville',
        breve=('Con i prezzi del nostro simulatore, rifare una facciata a Roma costa <b style="color: #E2C373">da %s a %s al m² + IVA</b>: dalla ristrutturazione parziale (ripristino e pittura) al cappotto termico da 14 cm con intonachino. '
               'Ponteggio da %s al m² e oneri della sicurezza (8%%) a parte. Per un condominio con 700 m² di facciate si parte da circa <b>%s + IVA</b>.') % (eur(parz), eur(cap14), eur(pon), eur(round(F_COND[0], -2))),
        intro='Una facciata che si sfoglia, con crepe o frontalini rovinati, non è solo un problema estetico: fa entrare l’acqua e rovina l’intonaco e il calcestruzzo. Per condomini, palazzine e ville a Roma ci occupiamo di tutto il lavoro, dal rilievo al ponteggio, dal risanamento alla pittura, con il nostro studio tecnico che prepara computo e pratiche.',
        foto=('/img/facciata-03.webp', 'Facciata condominiale rifatta da MD Edil Group, a lavoro finito', 'Una nostra facciata condominiale a lavoro finito.'),
        sezioni=[
            ('prezzi-rifacimento-facciata', 'Quanto costa rifare la facciata: i prezzi al m²',
             TAB([('Ristrutturazione parziale: spicconatura, rasatura armata con rete e collante in due mani, pittura silossanica', eur(parz)),
                  ('Intonaco e pittura: in più il nuovo intonaco su tutta la facciata', eur(into)),
                  ('Cappotto termico 12 cm con intonachino colorato', eur(cap12)),
                  ('Cappotto termico 14 cm con intonachino colorato', eur(cap14)),
                  ('Ponteggio: montaggio, smontaggio e primo mese', eur(pon)),
                  ('Ponteggio: ogni mese in più', eur(X['pon2'])),
                  ('Oneri della sicurezza', '8% dei lavori')]) +
             P('Prezzi al m² di facciata, IVA esclusa, dal listino del nostro simulatore per gli esterni.')),
            ('lavoro-realizzato-facciata-mosaico-aventino', 'Un nostro lavoro: facciata in mosaico all’Aventino, 1.600 m²',
             P('Rifacimento della facciata di un condominio all’Aventino, a Roma: ponteggio, demolizione di 1.600 m² di vecchio mosaico e posa del mosaico nuovo su tutta la superficie, con il mosaico a rilievo sulle fasce verticali. La posa del mosaico in facciata parte da 50 € al m² + IVA.') +
             FIG('/img/facciata-mosaico-aventino-prima.webp', 'Facciata condominiale in mosaico all’Aventino, Roma, prima del rifacimento', 'Prima: la facciata con il vecchio mosaico.') +
             FIG('/img/facciata-mosaico-aventino-dopo.webp', 'Facciata condominiale all’Aventino, Roma, dopo la posa del mosaico nuovo', 'Dopo: la stessa facciata con il mosaico nuovo.') +
             P('<a href="/rifacimento-facciata-mosaico-roma-aventino">Il lavoro passo per passo, con prima e dopo e il video →</a>')),
            ('risanamento-pareti-facciata', 'Risanamento delle pareti: intonaco, crepe e infiltrazioni',
             P('Prima di ogni finitura si rimuove ciò che è rovinato e si ricostruisce una superficie sana, così crepe e infiltrazioni non tornano.') +
             TAB([('Spicconatura dell’intonaco che si stacca', eur(X['spicc']) + ' al m²'),
                  ('Rimozione delle vecchie pitture', eur(X['pitture']) + ' al m²'),
                  ('Demolizione delle parti di facciata rovinate', eur(X['demLoc']) + ' al m²'),
                  ('Nuovo intonaco premiscelato', eur(X['intonaco']) + ' al m²'),
                  ('Riparazione delle crepe con rete', eur(X['crepe']) + ' al metro')])),
            ('restauro-balconi-frontalini', 'Restauro di balconi, frontalini e sottobalconi',
             P('Sotto i balconi e sui frontalini il calcestruzzo si gonfia per la ruggine dei ferri e può cadere: si demolisce la parte rovinata, si trattano i ferri e si ricostruisce con malta strutturale.') +
             TAB([('Spicconatura sotto balconi e tettoie', eur(X['balSpicc']) + ' al m²'),
                  ('Demolizione di frontalini e sottobalconi rovinati', eur(X['balDem']) + ' al m²'),
                  ('Trattamento anticorrosivo dei ferri d’armatura', eur(X['ferri']) + ' al m²'),
                  ('Ripristino del calcestruzzo e del copriferro (malta R4)', eur(X['copriferro']) + ' al m²')])),
            ('cappotto-termico-facciata-roma', 'Cappotto termico: efficienza energetica della facciata',
             P('Il cappotto isola l’edificio dall’esterno: d’inverno disperde meno calore, d’estate resta più fresco. La rasatura armata è già compresa, la finitura si sceglie a parte.') +
             TAB([('Cappotto in EPS grafitato 12 cm', eur(X['cap12']) + ' al m²'),
                  ('Cappotto in EPS grafitato 14 cm', eur(X['cap14']) + ' al m²'),
                  ('Rasante termoisolante (circa 1 cm), dove il cappotto non si può fare', eur(X['eco']) + ' al m²')])),
            ('finiture-facciata', 'Finiture: pittura, intonachino e calce',
             TAB([('Pittura silossanica con fissativo e due mani', eur(X['silossanica']) + ' al m²'),
                  ('Finitura minerale a calce, per edifici storici', eur(X['calce']) + ' al m²'),
                  ('Intonachino colorato con fondo, senza pittura', eur(X['intonachino']) + ' al m²'),
                  ('Grondaie in alluminio preverniciato', eur(X['gronde']) + ' al metro'),
                  ('Verniciatura delle ringhiere in ferro', eur(X['ringhiere']) + ' al metro')])),
            ('esempio-facciata-condominio-700-mq', 'Esempio: condominio con 700 m² di facciate',
             P('Calcolato con il nostro simulatore, con il ponteggio del primo mese e gli oneri della sicurezza:') +
             TAB([('Ristrutturazione parziale', eur(round(F_COND[0])) + ' + IVA'), ('Cappotto termico 12 cm con intonachino', eur(round(F_COND[1])) + ' + IVA')])),
            ('esempio-facciata-villa-250-mq', 'Esempio: villa con 250 m² di facciate',
             P('Stesso calcolo per una villa o una casa singola:') +
             TAB([('Ristrutturazione parziale', eur(round(F_VILLA[0])) + ' + IVA'), ('Cappotto termico 12 cm con intonachino', eur(round(F_VILLA[1])) + ' + IVA')])),
            ('detrazioni-facciata-2026', 'Detrazioni fiscali nel 2026',
             P('Il bonus facciate al 90% non c’è più. Per le spese pagate nel 2026 c’è la detrazione per le ristrutturazioni: 50% sull’abitazione principale e 36% negli altri casi, fino a 96.000 € per unità, in 10 anni. '
               'Nei condomini ogni proprietario detrae la sua quota: verifica il tuo caso con l’amministratore o il commercialista. Dettagli e fonti ufficiali nell’articolo sul <a href="/bonus-casa-50-pagare-entro-31-dicembre-2026">bonus casa al 50% entro il 31 dicembre 2026</a>.')),
            ('zone-roma-facciate', 'In quali zone di Roma lavoriamo', P(ZONE)),
        ],
        faq=[('Quanto costa rifare la facciata di un condominio a Roma?', 'Con i nostri prezzi da %s a %s al m² + IVA, più ponteggio e oneri della sicurezza. Per 700 m² di facciate: circa %s + IVA con la ristrutturazione parziale e circa %s + IVA con il cappotto da 12 cm.' % (eur(parz), eur(cap14), eur(round(F_COND[0], -2)), eur(round(F_COND[1], -2)))),
             ('Il ponteggio è compreso nel prezzo al m²?', 'No: il ponteggio si calcola a parte, %s al m² per montaggio, smontaggio e primo mese, poi %s al m² per ogni mese in più.' % (eur(pon), eur(X['pon2']))),
             ('Rifate le facciate anche di ville e case singole?', 'Sì: lavoriamo per condomini, palazzine, ville e case indipendenti. Per una villa con 250 m² di facciate la ristrutturazione parziale costa circa %s + IVA.' % eur(round(F_VILLA[0], -2))),
             ('Serve una pratica edilizia per rifare la facciata?', 'Dipende dal lavoro e dalla zona: cambiare colore, aggiungere il cappotto o intervenire in centro storico può richiedere permessi. Il nostro studio tecnico verifica il tuo caso e prepara le pratiche.')],
        sim=('/simulatore-online-costi-ristrutturazioni-esterni', 'CALCOLA IL COSTO DELLA TUA FACCIATA'),
    ),
    dict(
        file='impermeabilizzazione-terrazzo-roma', madre='ristrutturazioni-esterni', nome_madre='Ristrutturazioni esterni', briciola='TERRAZZI E BALCONI',
        title='Ristrutturazione e impermeabilizzazione terrazzo a Roma: prezzi | MD Edil Group',
        desc='Ristrutturazione e impermeabilizzazione di terrazzi e balconi a Roma: fasi del lavoro con prova di allagamento. Senza demolire da %s al m², rifacimento completo da circa %s al m² + IVA. Esempio di 30 m² calcolato dal simulatore.' % (eur(senza_mq), eur(round(completo_mq))),
        ey='RISTRUTTURAZIONI ESTERNI · TERRAZZI',
        h1='Ristrutturazione e impermeabilizzazione di terrazzi e balconi a Roma: fasi, prezzi ed esempi',
        breve=('Per fermare le infiltrazioni di un terrazzo ci sono due strade: <b style="color: #E2C373">impermeabilizzare sopra il pavimento esistente, da %s al m²</b>, oppure il <b style="color: #E2C373">rifacimento completo, da circa %s al m²</b>, + IVA. '
               'Per un terrazzo di 30 m²: circa %s oppure circa %s + IVA, oneri della sicurezza compresi.') % (eur(senza_mq), eur(round(completo_mq)), eur(round(T_SENZA, -1)), eur(round(T_COMPL, -1))),
        intro='Macchie sul soffitto sotto il terrazzo, intonaco che si gonfia, piastrelle che si staccano: sono i segnali di un’impermeabilizzazione da rifare. A Roma rifacciamo terrazzi e balconi di appartamenti, attici e condomini, scegliendo con te il metodo giusto dopo il sopralluogo.',
        foto=('/img/terrazzo-roma-san-pietro-pavimento-finito.webp', 'Terrazzo rifatto a Roma con nuovo pavimento in gres effetto cotto e vista sulla cupola di San Pietro', 'Un nostro terrazzo a Roma, rifatto da zero, con vista su San Pietro.'),
        sezioni=[
            ('lavoro-realizzato-terrazzo-san-pietro', 'Un nostro lavoro: 700 m² di terrazzo a San Pietro, via Gregorio VII',
             P('Ristrutturazione completa di 700 m² di terrazzo in via Gregorio VII, zona San Pietro: demolizione del massetto con le vecchie piastrelle, due strati di guaina, prova di allagamento (nessuna perdita), nuovo massetto di circa 6 cm con le pendenze, nuove piastrelle con giunti di dilatazione. Prezzo di questo lavoro: 180 € al m² + IVA.') +
             FIG('/img/terrazzo-roma-san-pietro-demolizione-pavimento.webp', 'Demolizione del vecchio pavimento del terrazzo prima dell’impermeabilizzazione, Roma', 'Prima: il vecchio pavimento demolito fino al sottofondo.') +
             FIG('/img/terrazzo-roma-san-pietro-guaina-bituminosa.webp', 'Rotoli di guaina bituminosa pronti per l’impermeabilizzazione del terrazzo a Roma', 'Durante: i rotoli di guaina bituminosa pronti per la posa.') +
             P('<a href="/rifacimento-terrazzo-roma-vista-san-pietro">Il lavoro passo per passo, con tutte le foto →</a>')),
            ('due-metodi-impermeabilizzazione', 'Due metodi: senza demolire o rifacimento completo',
             P('<b>Senza demolire</b>: si applica un telo armato impermeabile sopra le piastrelle esistenti. È più veloce e costa meno, va bene se il pavimento è stabile e ben inclinato verso gli scarichi.') +
             P('<b>Rifacimento completo</b>: si toglie il pavimento con il sottofondo, si stende la guaina, il nuovo massetto, l’impermeabilizzazione cementizia elastica e il nuovo pavimento in gres. È la soluzione definitiva quando il pavimento è rovinato o l’acqua ristagna.')),
            ('fasi-ristrutturazione-terrazzo', 'Le fasi della ristrutturazione di un terrazzo',
             P('Come lavoriamo quando un terrazzo si rifà da zero, come in via Gregorio VII a San Pietro:') +
             '<ol style="margin: 0 0 16px; padding-left: 22px">'
             '<li style="margin-bottom: 8px"><b>Demolizione</b> del vecchio massetto insieme alle piastrelle, fino al solaio.</li>'
             '<li style="margin-bottom: 8px"><b>Impermeabilizzazione</b> con due strati di guaina bituminosa, risvoltata sui muretti.</li>'
             '<li style="margin-bottom: 8px"><b>Prova di allagamento</b>: prima del massetto si allaga il terrazzo e si controlla che non ci siano perdite. Si va avanti solo se la guaina tiene.</li>'
             '<li style="margin-bottom: 8px"><b>Nuovo massetto</b> di circa 6 cm con le pendenze verso gli scarichi, così l’acqua non ristagna.</li>'
             '<li style="margin-bottom: 8px"><b>Nuove piastrelle</b> per esterni con i <b>giunti di dilatazione</b>, che lasciano muovere il pavimento con il caldo e il freddo.</li></ol>'),
            ('impermeabilizzazione-senza-demolire', 'Impermeabilizzazione senza demolire: i prezzi',
             TAB([('Impermeabilizzazione armata sopra il pavimento esistente', eur(X['ten1']) + ' al m²'),
                  ('Pulizia e ripristino delle fughe', eur(X['ten3']) + ' al m²'),
                  ('Raccordi, angoli e risvolti impermeabili', eur(X['ten2']) + ' al metro')])),
            ('rifacimento-completo-terrazzo', 'Rifacimento completo del terrazzo: i prezzi',
             TAB([('Demolizione di pavimento e sottofondo fino a 5 cm', eur(X['terDem']) + ' al m²'),
                  ('Ogni cm di sottofondo in più', eur(X['terDemX']) + ' al m² per cm'),
                  ('Rimozione della vecchia guaina bituminosa', eur(X['guainaRim']) + ' al m²'),
                  ('Guaina bituminosa con primer, primo strato', eur(X['guaina1']) + ' al m²'),
                  ('Secondo strato di guaina, se serve', eur(X['guaina2']) + ' al m²'),
                  ('Nuovo massetto', eur(X['massetto']) + ' al m²'),
                  ('Impermeabilizzazione cementizia elastica sopra il massetto', eur(X['mapelastic']) + ' al m²'),
                  ('Posa del pavimento in gres da esterno (piastrelle escluse)', eur(X['gres']) + ' al m²'),
                  ('Posa del battiscopa esterno', eur(X['battisc']) + ' al metro'),
                  ('Bocchettone di scarico dell’acqua', eur(X['bocch']) + ' cadauno'),
                  ('Smaltimento della vecchia guaina', eur(X['guainaSmalt']) + ' al kg')])),
            ('esempio-terrazzo-30-mq', 'Esempio: terrazzo di 30 m²',
             P('Calcolato con il nostro simulatore per un terrazzo di 30 m² con 22 metri di bordo e un bocchettone, oneri della sicurezza (8%) compresi; smaltimento della guaina e piastrelle esclusi:') +
             TAB([('Impermeabilizzazione senza demolire', eur(round(T_SENZA)) + ' + IVA'), ('Rifacimento completo', eur(round(T_COMPL)) + ' + IVA')])),
            ('detrazioni-terrazzo-2026', 'Detrazioni fiscali nel 2026',
             P('Il rifacimento di terrazzi e balconi rientra nella detrazione per le ristrutturazioni: per le spese pagate nel 2026, 50% sull’abitazione principale e 36% negli altri casi. Verifica il tuo caso con il commercialista; dettagli nell’articolo sul <a href="/bonus-casa-50-pagare-entro-31-dicembre-2026">bonus casa al 50%</a>.')),
            ('zone-roma-terrazzi', 'In quali zone di Roma lavoriamo', P(ZONE)),
        ],
        faq=[('Quanto costa impermeabilizzare un terrazzo a Roma?', 'Con i nostri prezzi: senza demolire da %s al m², rifacimento completo da circa %s al m², + IVA. Per 30 m²: circa %s oppure circa %s + IVA.' % (eur(senza_mq), eur(round(completo_mq)), eur(round(T_SENZA, -1)), eur(round(T_COMPL, -1)))),
             ('Si può impermeabilizzare senza togliere le piastrelle?', 'Sì, con un telo armato impermeabile applicato sopra il pavimento esistente, se le piastrelle sono stabili e l’acqua scorre verso gli scarichi. Lo verifichiamo al sopralluogo.'),
             ('Quando conviene rifare tutto il terrazzo?', 'Quando il pavimento è rovinato, l’acqua ristagna o le infiltrazioni continuano: con il rifacimento completo si rifanno sottofondo, guaina, massetto e pavimento.'),
             ('Cos’è la prova di allagamento e perché si fa?', 'Dopo la guaina e prima del nuovo massetto si allaga il terrazzo per controllare che l’acqua non passi. Se c’è un punto debole si ripara subito, invece di scoprirlo dopo, con il pavimento già posato.'),
             ('Lavorate anche su balconi e terrazzi condominiali?', 'Sì: rifacciamo terrazzi di appartamenti, attici e condomini, e i balconi insieme alla facciata con il restauro di frontalini e sottobalconi.')],
        sim=('/simulatore-online-costi-ristrutturazioni-esterni', 'CALCOLA IL COSTO DEL TUO TERRAZZO'),
    ),
]

H2 = 'style="margin: 0; font-family: Urbanist, sans-serif; font-weight: 400; font-size: clamp(22px, 2.3vw, 30px); line-height: 1.2; color: #F3EFE7"'
CSS = ('<style>.voce{border-top:1px solid #2A2722}.voce:last-of-type{border-bottom:1px solid #2A2722}.voce summary{list-style:none;cursor:pointer;position:relative;padding:22px 46px 22px 0}'
       '.voce summary::-webkit-details-marker{display:none}.voce summary::after{content:"+";position:absolute;right:0;top:20px;width:30px;height:30px;display:grid;place-items:center;border:1px solid #C9A24A;border-radius:50%;color:#C9A24A;font-size:18px;line-height:1;transition:transform .3s}'
       '.voce[open] summary::after{transform:rotate(45deg)}.voce summary:focus-visible{outline:2px solid #C9A24A;outline-offset:4px}.voce p{margin:0 0 16px}.voce[open]{padding-bottom:10px}</style>\n')


def costruisci(v):
    t = open(os.path.join(RADICE, 'quanto-costa-ristrutturare-bagno-roma.html'), encoding='utf-8').read()
    url = SITO + '/' + v['file']
    def sub(rx, new):
        nonlocal t
        t, k = re.subn(rx, lambda m: new, t, count=1)
        assert k == 1, rx
    attr = lambda s: html.escape(s, quote=True)
    sub(r'<title>.*?</title>', '<title>' + e(v['title']) + '</title>')
    sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="' + attr(v['desc']) + '">')
    sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="' + url + '">')
    sub(r'<meta property="og:type" content="[^"]*">', '<meta property="og:type" content="website">')
    sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="' + attr(v['title']) + '">')
    sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="' + attr(v['desc']) + '">')
    sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="' + url + '">')
    sub(r'<meta property="og:image" content="[^"]*">', '<meta property="og:image" content="' + SITO + (v['foto'][0] if v['foto'] else '/favicon.png') + '">')
    t = re.sub(r'<script type="application/ld\+json">.*?</script>\n', '', t)
    ld = [{'@context': 'https://schema.org', '@type': 'Service', 'name': v['h1'], 'description': v['desc'], 'url': url,
           'provider': {'@id': SITO + '/#impresa'}, 'areaServed': ['Roma', 'Lazio']},
          {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
              {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITO + '/'},
              {'@type': 'ListItem', 'position': 2, 'name': v['nome_madre'], 'item': SITO + '/' + v['madre']},
              {'@type': 'ListItem', 'position': 3, 'name': v['h1'], 'item': url}]},
          {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in v['faq']]}]
    t = t.replace('<style>.faq details', ''.join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + '</script>\n' for x in ld) + CSS + '<style>.faq details', 1)
    foto = ''
    if v['foto']:
        foto = FIG(*v['foto']) + '\n'
    sezioni = ''.join('<details id="%s" class="voce"><summary><h2 %s>%s</h2></summary>\n%s\n</details>\n' % (i, H2, e(ti), body) for i, ti, body in v['sezioni'])
    faq = ''.join('<details><summary><h3>%s</h3></summary><p>%s</p></details>' % (e(q), e(a)) for q, a in v['faq'])
    art = ('<section style="padding: 230px clamp(20px, 5vw, 72px) 0; max-width: 1320px; margin: 0 auto">\n'
           '<p style="margin: 0; font-size: 12px; letter-spacing: 0.2em; color: #8A8478"><a href="/" style="color: #8A8478">HOME</a> / <a href="/%s" style="color: #8A8478">%s</a> / %s</p>\n</section>\n\n'
           '<article style="padding: 56px clamp(20px, 5vw, 72px) 90px">\n<div style="max-width: 760px; margin: 0 auto; color: #D8D2C6; font-size: 17px; line-height: 1.7">\n'
           '<p style="margin: 0 0 14px; font-size: 12px; letter-spacing: 0.38em; color: #C9A24A; font-weight: 600">%s</p>\n'
           '<h1 style="margin: 0 0 24px; font-family: \'Urbanist\', sans-serif; font-weight: 400; font-size: clamp(32px, 3.6vw, 50px); line-height: 1.1; color: #F3EFE7">%s</h1>\n'
           '<p style="margin: 0 0 18px; padding: 16px 20px; border-left: 2px solid #C9A24A; background: #171512">%s</p>\n'
           '<p style="margin: 0 0 18px">%s</p>\n%s\n'
           '<div style="margin: 32px 0 0">\n%s</div>\n'
           '<div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 36px 0 18px">\n'
           '<a href="%s" style="background: #C9A24A; color: #0E0D0B; padding: 17px 26px; font-weight: 600; font-size: 13px; letter-spacing: 0.14em">%s</a>\n'
           '<a href="/#contatti" style="border: 1px solid #C9A24A; color: #C9A24A; padding: 16px 26px; font-weight: 600; font-size: 13px; letter-spacing: 0.14em">RICHIEDI IL SOPRALLUOGO</a>\n</div>\n'
           '<h2 style="margin: 48px 0 16px; font-family: \'Urbanist\', sans-serif; font-weight: 400; font-size: clamp(26px, 2.6vw, 36px); line-height: 1.15">Domande frequenti</h2>\n'
           '<div class="faq">%s</div>\n'
           '<p style="margin: 24px 0 0; font-size: 14px; color: #8A8478">%s</p>\n'
           '</div>\n</article>') % (v['madre'], e(v['nome_madre'].upper()), e(v['briciola']), e(v['ey']), e(v['h1']), v['breve'], e(v['intro']), foto,
                                    sezioni, v['sim'][0], e(v['sim'][1]), faq, v.get('nota', 'Prezzi del listino MD Edil Group per gli esterni, IVA esclusa, aggiornati al 25/10/2026: stime indicative, il prezzo definitivo si conferma dopo il sopralluogo gratuito. Tutti i lavori esterni nella pagina <a href="/%s">ristrutturazione di facciate e terrazzi a Roma</a>.' % v['madre']))
    i = t.index('<section style="padding: 230px')
    j = t.index('</article>') + len('</article>')
    t = t[:i] + art + t[j:]
    t = t.replace('<a href="/%s" style="color: #F3EFE7">' % v['madre'], '<a href="/%s" style="color: #C9A24A">' % v['madre'], 1)
    open(os.path.join(RADICE, v['file'] + '.html'), 'w', encoding='utf-8').write(t)
    print('Pagina:', v['file'] + '.html')


if __name__ == '__main__':
    for v in VOCI:
        costruisci(v)
    print('facciata: parziale %.2f intonaco %.2f cappotto %.2f–%.2f; condominio 700 %.0f / %.0f; villa 250 %.0f / %.0f' % (parz, into, cap12, cap14, *F_COND, *F_VILLA))
    print('terrazzo: senza %.2f/m², completo %.2f/m²; 30 m² %.0f / %.0f' % (senza_mq, completo_mq, T_SENZA, T_COMPL))
    # ogni titolo con il suo link
    import subprocess; subprocess.run(['python3', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'link_titoli.py')], check=True, stdout=subprocess.DEVNULL)
