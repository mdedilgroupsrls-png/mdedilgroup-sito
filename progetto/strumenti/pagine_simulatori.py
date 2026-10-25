# Crea le pagine dei simulatori, ognuna con il suo indirizzo (Eugenio, 23/10/2026), copiando il simulatore dalla pagina madre:
#   python3 progetto/strumenti/pagine_simulatori.py
# Da rilanciare dopo ogni modifica al simulatore, all'header o al footer delle pagine madri.
# Della pagina madre si tengono testa, header, simulatore, footer e script. Sopra: titolo e una riga; sotto il simulatore
# solo titoli che si aprono (come funziona, cosa calcola, prezzi, domande), ognuno con il suo link (Eugenio, 24/10/2026:
# dalla Home si arriva alla pagina del solo simulatore, senza altre informazioni a vista). Testi originali, scritti per la SEO.
import html, json, os, re

RADICE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITO = 'https://mdedilgroup.it'

PAGINE = [
    dict(
        madre='ristrutturazioni-interni', nome_madre='Ristrutturazioni interni', file='simulatore-online-costi-ristrutturazioni-interni',
        sezioni=2,  # il simulatore degli interni sta in due sezioni (titolo + modulo)
        title='Calcola il costo della ristrutturazione casa a Roma: simulatore gratuito | MD Edil Group',
        desc='Calcola il costo della ristrutturazione di casa a Roma con il simulatore online gratuito: scegli le lavorazioni, dalle demolizioni agli impianti, e vedi subito la stima IVA inclusa con il preventivo in PDF.',
        ey='SIMULATORE ONLINE · INTERNI', h1='Calcola il costo della ristrutturazione interni: simulatore online',
        intro=['Quanto costa ristrutturare un appartamento a Roma? Scrivi la superficie della casa e scegli solo le lavorazioni che ti servono: demolizioni, opere murarie, impianti elettrico, idrico e gas, pavimenti, cartongesso, rasature e pitture, oppure il bagno chiavi in mano. Il totale si aggiorna a ogni voce, con i prezzi del nostro listino IVA inclusa.',
               'Quando hai finito scarichi il preventivo in PDF e ce lo mandi su WhatsApp: il sopralluogo a Roma e nel Lazio è gratuito.'],
        passi=[('Superficie e piano', 'Indica i metri quadri della casa, il piano e se si trova in centro storico o in ZTL.'),
               ('Lavorazioni voce per voce', 'Apri i paragrafi che ti interessano e scrivi metri quadri, metri o numero di pezzi: le voci vuote non si calcolano.'),
               ('Preventivo e sopralluogo', 'Scarica il PDF con tutte le voci e mandacelo: ti richiamiamo per il sopralluogo e il preventivo definitivo.')],
        guida=('#guida-lavorazioni', 'Cosa comprende ogni lavorazione e quanto costa: la guida alle lavorazioni'),
        breve='Scrivi i metri quadri della casa e scegli le lavorazioni: il totale si aggiorna subito, IVA inclusa, e alla fine scarichi il preventivo in PDF.',
        faq=[('Da dove vengono i prezzi?', 'Sono i prezzi del listino MD Edil Group, gli stessi dei nostri preventivi, IVA inclusa. Per i lavori in centro storico o in ZTL il simulatore aggiunge il 5%.'),
             ('Cosa non è compreso?', 'La fornitura dei materiali che scegli tu: pavimenti, rivestimenti, sanitari, rubinetteria, porte, termosifoni, caldaia e condizionatori. Il bagno chiavi in mano comprende i materiali che restano murati.'),
             ('Il simulatore è gratuito?', 'Sì, è gratuito e non serve registrarsi. La stima resta sul tuo telefono o computer finché non decidi tu di mandarcela su WhatsApp.'),
             ('Il prezzo è definitivo?', 'No, è una stima indicativa. Il prezzo definitivo si conferma dopo il sopralluogo gratuito, con le misure prese dai nostri tecnici.')],
        servizio='Simulatore dei costi di ristrutturazione di interni a Roma e nel Lazio'),
    dict(
        madre='ristrutturazioni-esterni', nome_madre='Ristrutturazioni esterni', file='simulatore-online-costi-ristrutturazioni-esterni',
        sezioni=2,
        title='Calcola il costo della facciata a Roma: simulatore gratuito | MD Edil Group',
        desc='Calcola il costo del rifacimento della facciata, del cappotto termico e dei terrazzi a Roma con il simulatore online gratuito: ponteggio, ripristini, finiture e impermeabilizzazioni. Stima indicativa, prezzi + IVA.',
        ey='SIMULATORE ONLINE · ESTERNI', h1='Calcola il costo di facciate, cappotto e terrazzi: simulatore online',
        intro=['Quanto costa rifare la facciata di un condominio o di una villa a Roma? Indica i metri quadri di facciata e scegli le lavorazioni: ponteggio, risanamento di intonaco e calcestruzzo, cappotto termico, rasatura e finitura, grondaie e ringhiere, terrazzi e balconi da impermeabilizzare.',
               'I prezzi sono quelli del nostro listino per gli esterni, + IVA, e il simulatore aggiunge da solo gli oneri della sicurezza. Alla fine scarichi il preventivo in PDF e ce lo mandi per il sopralluogo gratuito.'],
        passi=[('Edificio e facciate', 'Scegli se è una villa o un condominio e scrivi la superficie delle facciate da rifare: lunghezza per altezza.'),
               ('Lavorazioni del cantiere', 'Il simulatore mostra solo le combinazioni corrette di cappotto, rasatura e finitura, senza lavorazioni doppie.'),
               ('Preventivo e verifica tecnica', 'Scarica il PDF e mandacelo: il prezzo definitivo si conferma dopo il sopralluogo e la verifica tecnica.')],
        guida=('#guida-lavorazioni', 'Cosa comprende ogni lavorazione su facciate e terrazzi e quanto costa: la guida'),
        breve='Scrivi i metri quadri di facciata e scegli le lavorazioni: il totale si aggiorna subito, + IVA, e alla fine scarichi il preventivo in PDF.',
        faq=[('Da dove vengono i prezzi?', 'Sono i prezzi del listino MD Edil Group per facciate, cappotti e terrazzi, IVA esclusa. Il simulatore aggiunge da solo gli oneri della sicurezza, calcolati all’8% dei lavori.'),
             ('Vale per condomini e case private?', 'Sì: all’inizio scegli se si tratta di una villa o di un condominio, poi indichi i metri quadri delle facciate da rifare.'),
             ('Il simulatore è gratuito?', 'Sì, è gratuito e non serve registrarsi. La stima resta sul tuo dispositivo finché non decidi tu di mandarcela.'),
             ('Il prezzo è definitivo?', 'No, è una stima indicativa. Il prezzo definitivo si conferma dopo il sopralluogo e la verifica tecnica della facciata.')],
        servizio='Simulatore dei costi di rifacimento facciate, cappotto termico e terrazzi a Roma e nel Lazio'),
    dict(
        madre='infissi-serramenti', nome_madre='Infissi e serramenti', file='simulatore-online-costi-infissi-tapparelle-zanzariere',
        sezioni=1,
        title='Configuratore infissi online: prezzi di finestre, tapparelle e zanzariere | MD Edil Group',
        desc='Configuratore online degli infissi in PVC Rehau, tapparelle e zanzariere a Roma: scrivi le misure in cm e vedi il costo di ogni pezzo; smontaggio e posa si aggiungono se li scegli. Stima + IVA.',
        ey='CONFIGURATORE ONLINE · INFISSI', h1='Configuratore online di infissi, tapparelle e zanzariere: il prezzo subito',
        intro=['Quanto costano nuovi infissi in PVC a Roma? Scrivi larghezza e altezza di ogni finestra o porta-finestra, scegli battente o scorrevole e il colore Rehau: il prezzo di ogni pezzo compare subito. Aggiungi la demolizione dei vecchi infissi, la posa, le tapparelle in alluminio coibentato e le zanzariere.',
               'Prezzi + IVA, imballaggio e trasporto inclusi. Alla fine scarichi il preventivo in PDF e ce lo mandi su WhatsApp per il sopralluogo gratuito.'],
        passi=[('Misure in centimetri', 'Per ogni infisso scrivi larghezza e altezza e scegli se è a battente o scorrevole.'),
               ('Demolizione, posa e accessori', 'Con un tocco riprendi le stesse misure per demolizione, posa, tapparelle e zanzariere.'),
               ('Preventivo e sopralluogo', 'Scarica il PDF e mandacelo: le misure definitive le prendono i nostri tecnici al sopralluogo.')],
        guida=('#listino-infissi', 'Prezzi di partenza di infissi, tapparelle e zanzariere: il listino'),
        breve='Configura le tue finestre: scrivi le misure, scegli apertura e colore, e il prezzo di ogni pezzo compare subito, + IVA, imballaggio e trasporto inclusi.',
        faq=[('Da dove vengono i prezzi?', 'Sono i prezzi del listino MD Edil Group per infissi in PVC Rehau Synego e Synego Slide con doppio vetro, IVA esclusa, imballaggio e trasporto inclusi.'),
             ('Ci sono misure che il simulatore non calcola?', 'Gli infissi a battente oltre 5 m² e gli scorrevoli oltre 6 m² a pezzo: per questi il prezzo si definisce al sopralluogo. Dal 4° piano demolizioni e pose costano il 10% in più.'),
             ('Il simulatore è gratuito?', 'Sì, è gratuito e non serve registrarsi. La stima resta sul tuo dispositivo finché non decidi tu di mandarcela.'),
             ('Il prezzo è definitivo?', 'No, è una stima indicativa. Le misure definitive le prendono i nostri tecnici al sopralluogo gratuito.')],
        servizio='Simulatore dei prezzi di infissi in PVC Rehau, tapparelle e zanzariere a Roma e nel Lazio'),
    dict(
        madre='case-in-legno', nome_madre='Case in legno', file='simulatore-online-costi-case-in-legno', legno=True,
        title='Configuratore case in legno prefabbricate: prezzo online | MD Edil Group',
        desc='Configuratore online della tua casa in legno prefabbricata: scegli il modello, aggiungi gli optional e vedi subito il totale IVA inclusa. Consegna in tutta Italia.',
        ey='CONFIGURATORE ONLINE · CASE IN LEGNO', h1='Configuratore online delle case in legno: componi la tua e vedi il prezzo',
        intro=['Quanto costa una casa in legno prefabbricata chiavi in mano? Scegli il modello dal nostro catalogo, guarda la planimetria, poi aggiungi o togli gli optional: il totale si aggiorna subito, IVA inclusa.',
               'Quando hai finito scarichi la stima in PDF o ce la mandi su WhatsApp: verifichiamo il terreno e prepariamo il preventivo definitivo. Realizziamo case in legno in tutta Italia.'],
        passi=[('Il modello', 'Scegli la casa dal catalogo: per ognuna vedi metri quadri, planimetria e prezzo di partenza.'),
               ('Gli optional', 'Aggiungi o togli le voci che ti servono e tocca il nome di ognuna per leggere cosa comprende.'),
               ('Preventivo e terreno', 'Mandaci la stima: il prezzo definitivo arriva dopo il sopralluogo, la verifica del terreno e il progetto.')],
        guida=('#la-casa', 'Come sono fatte le nostre case in legno: materiali, isolamento e modelli'),
        breve='Configura la tua casa: scegli il modello e gli optional, il totale si aggiorna subito, IVA inclusa.',
        faq=[('Da dove vengono i prezzi?', 'Sono i prezzi del listino delle nostre case in legno chiavi in mano, IVA inclusa, aggiornati per ogni modello e per ogni optional.'),
             ('Dove costruite le case in legno?', 'In tutta Italia: nel simulatore scegli anche la provincia del terreno.'),
             ('Il simulatore è gratuito?', 'Sì, è gratuito e non serve registrarsi. La stima resta sul tuo dispositivo finché non decidi tu di mandarcela.'),
             ('Il prezzo è definitivo?', 'No, è una stima indicativa. Il preventivo definitivo si ottiene dopo il sopralluogo, la verifica del terreno e il progetto.')],
        servizio='Simulatore dei prezzi di case in legno prefabbricate chiavi in mano in tutta Italia', zona=['Italia']),
]

e = lambda t: html.escape(t, quote=True)
P = 'style="margin: 0 0 14px; font-size: 12px; letter-spacing: 0.38em; color: #C9A24A; font-weight: 600"'


def sostituisci(t, regex, nuovo, n=1):
    # n=1: deve esserci esattamente una volta
    t2, k = re.subn(regex, lambda m: nuovo, t, count=n)
    assert k == n, regex
    return t2


def costruisci(p):
    src = open(os.path.join(RADICE, p['madre'] + '.html'), encoding='utf-8').read()
    url = SITO + '/' + p['file']
    # testa: titolo, descrizione, indirizzo; via i dati strutturati della madre
    t = src
    t = sostituisci(t, r'<title>.*?</title>', '<title>' + e(p['title']) + '</title>')
    t = sostituisci(t, r'<meta name="description" content="[^"]*">', '<meta name="description" content="' + e(p['desc']) + '">')
    t = sostituisci(t, r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="' + url + '">')
    t = sostituisci(t, r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="' + e(p['title']) + '">')
    t = sostituisci(t, r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="' + e(p['desc']) + '">')
    t = sostituisci(t, r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="' + url + '">')
    t = re.sub(r'<script type="application/ld\+json">.*?</script>\n', '', t)
    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'WebApplication', 'name': p['h1'], 'url': url, 'description': p['desc'], 'applicationCategory': 'BusinessApplication',
         'operatingSystem': 'Tutti (nel browser)', 'inLanguage': 'it', 'isAccessibleForFree': True,
         'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR'},
         'provider': {'@id': SITO + '/#impresa'}, 'about': p['servizio'], 'areaServed': p.get('zona', ['Roma', 'Lazio'])},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITO + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': p['nome_madre'], 'item': SITO + '/' + p['madre']},
            {'@type': 'ListItem', 'position': 3, 'name': 'Simulatore online', 'item': url}]}]}

    # domande sotto il simulatore: tutte titoli che si aprono, ognuno con il suo link
    slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower().replace('à', 'a').replace('è', 'e').replace('é', 'e').replace('ì', 'i').replace('ò', 'o').replace('ù', 'u').replace('’', ' ')).strip('-')
    passi = '<ol style="margin: 0 0 6px; padding-left: 20px">' + ''.join('<li style="margin: 0 0 6px"><b style="color: #F3EFE7">' + e(a1) + '</b>: ' + e(b1) + '</li>' for a1, b1 in p['passi']) + '</ol>'
    voci = [('come-funziona', 'Come funziona il simulatore', passi, ' '.join('%s: %s' % x for x in p['passi'])),
            ('cosa-calcola', 'Cosa calcola', '<p>' + e(p['intro'][0]) + '</p><p>' + e(p['intro'][1]) + '</p>', p['intro'][0] + ' ' + p['intro'][1])]
    voci += [(slug(q), q, '<p>' + e(a1) + '</p>', a1) for q, a1 in p['faq']]
    det = ''.join('<details id="' + i + '" class="voce"><summary><h2>' + e(q) + '</h2></summary>' + body + '</details>\n' for i, q, body, _ in voci)
    ld['@graph'].append({'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a1}} for _, q, _, a1 in voci]})
    css = ('<style>.voce{border-top:1px solid #2A2722}.voce:last-of-type{border-bottom:1px solid #2A2722}.voce summary{list-style:none;cursor:pointer;position:relative;padding:20px 46px 20px 0}'
           '.voce summary::-webkit-details-marker{display:none}.voce summary::after{content:"+";position:absolute;right:0;top:18px;width:30px;height:30px;display:grid;place-items:center;border:1px solid #C9A24A;border-radius:50%;color:#C9A24A;font-size:18px;line-height:1;transition:transform .3s}'
           '.voce[open] summary::after{transform:rotate(45deg)}.voce summary:focus-visible{outline:2px solid #C9A24A;outline-offset:4px}.voce h2{margin:0;font-family:Urbanist,sans-serif;font-weight:600;font-size:clamp(18px,1.8vw,22px);line-height:1.3;color:#F3EFE7}'
           '.voce p{margin:0 0 14px;color:#D8D2C6;max-width:860px}.voce[open]{padding-bottom:8px}</style>\n')
    t = t.replace('</head>', css + '</head>', 1)
    # i dati strutturati vanno riscritti con le domande
    t = t.replace('</head>', '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>\n</head>', 1)
    altro = ('<p style="margin: 28px 0 8px"><a href="/' + p['madre'] + p['guida'][0] + '">' + e(p['guida'][1]) + ' →</a></p>\n'
             '<p style="margin: 0"><a href="/' + p['madre'] + '">' + e(p['nome_madre']) + (' in tutta Italia' if p.get('legno') else ' a Roma') + ': lavori, metodo e lavori realizzati →</a></p>\n')

    if p.get('legno'):
        # case in legno: tutto sta dentro <main class="wrap">; si tiene il catalogo dei modelli e il simulatore
        a = t.index('<main class="wrap">') + len('<main class="wrap">')
        f = t.index('</main>')
        s = t.index('<h2 id="simulatore"', a)
        fine = t.index('</section>', t.index('<section class="sim">', s)) + len('</section>')
        sim = re.sub(r'<p class="sim-link".*?</p>\n?', '', t[s:fine])
        briciole = ('\n<p style="margin: 40px 0 0; font-size: 12px; letter-spacing: 0.2em; color: #8A8478"><a href="/" style="color: #8A8478">HOME</a> / '
                    '<a href="/' + p['madre'] + '" style="color: #8A8478">' + e(p['nome_madre'].upper()) + '</a> / SIMULATORE ONLINE</p>\n')
        testa = ('<section style="margin: 28px 0 36px">\n<p class="eyebrow">' + e(p['ey']) + '</p>\n<h1>' + e(p['h1']) + '</h1>\n'
                 '<p style="margin: 12px 0 0; color: var(--mute); max-width: 720px">' + e(p['breve']) + '</p>\n</section>\n\n')
        info = '\n\n<section style="margin: 64px 0 80px">\n' + det + altro + '</section>\n'
        t = t[:a] + briciole + testa + sim + info + t[f:]
    else:
        a = t.index('<section style="padding: 230px')
        f = t.index('<footer')
        corpo = t[a:f]
        s = corpo.index('<section id="simulatore"')
        fine = s
        for _ in range(p['sezioni']):
            fine = corpo.index('</section>', fine) + len('</section>')
        sim = re.sub(r'<p class="sim-link".*?</p>\n?', '', corpo[s:fine])  # il link "pagina del simulatore" non serve sulla pagina stessa
        briciole = ('<section style="padding: 230px clamp(20px, 5vw, 72px) 0; max-width: 1320px; margin: 0 auto">\n'
                    '<p style="margin: 0; font-size: 12px; letter-spacing: 0.2em; color: #8A8478"><a href="/" style="color: #8A8478">HOME</a> / '
                    '<a href="/' + p['madre'] + '" style="color: #8A8478">' + e(p['nome_madre'].upper()) + '</a> / SIMULATORE ONLINE</p>\n</section>\n\n')
        testa = ('<section style="padding: 40px clamp(20px, 5vw, 72px) 24px">\n<div style="max-width: 1320px; margin: 0 auto">\n'
                 '<p ' + P + '>' + e(p['ey']) + '</p>\n'
                 '<h1 style="margin: 0 0 14px; font-family: \'Urbanist\', sans-serif; font-weight: 400; font-size: clamp(32px, 3.4vw, 50px); line-height: 1.08">' + e(p['h1']) + '</h1>\n'
                 '<p style="margin: 0; max-width: 760px; color: #D8D2C6">' + e(p['breve']) + '</p>\n</div>\n</section>\n\n')
        info = ('\n\n<section style="padding: 72px clamp(20px, 5vw, 72px) 96px">\n<div style="max-width: 980px; margin: 0 auto">\n' + det + altro + '</div>\n</section>\n\n')
        t = t[:a] + briciole + testa + sim + info + t[f:]
    open(os.path.join(RADICE, p['file'] + '.html'), 'w', encoding='utf-8').write(t)
    print('Pagina simulatore:', p['file'] + '.html')


for p in PAGINE:
    costruisci(p)
# ogni titolo con il suo link
import subprocess; subprocess.run(['python3', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'link_titoli.py')], check=True, stdout=subprocess.DEVNULL)
