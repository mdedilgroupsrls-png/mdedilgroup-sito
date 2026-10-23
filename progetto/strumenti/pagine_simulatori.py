# Crea le pagine dei simulatori, ognuna con il suo indirizzo (Eugenio, 23/10/2026), copiando il simulatore dalla pagina madre:
#   python3 progetto/strumenti/pagine_simulatori.py
# Da rilanciare dopo ogni modifica al simulatore, all'header o al footer delle pagine madri.
# Della pagina madre si tengono testa, header, simulatore, footer e script; titolo, descrizione, presentazione e
# "Come funziona" sono propri di ogni pagina (testi originali, scritti per la SEO).
import html, json, os, re

RADICE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITO = 'https://mdedilgroup.it'

PAGINE = [
    dict(
        madre='ristrutturazioni-interni', nome_madre='Ristrutturazioni interni', file='simulatore-online-costi-ristrutturazioni-interni',
        sezioni=2,  # il simulatore degli interni sta in due sezioni (titolo + modulo)
        title='Simulatore online gratuito costi ristrutturazione casa Roma | MD Edil Group',
        desc='Calcola online quanto costa ristrutturare casa a Roma: scegli le lavorazioni, dalle demolizioni agli impianti, e vedi subito la stima IVA inclusa con il preventivo in PDF.',
        ey='SIMULATORE ONLINE · INTERNI', h1='Simulatore online dei costi di ristrutturazione interni',
        intro=['Quanto costa ristrutturare un appartamento a Roma? Scrivi la superficie della casa e scegli solo le lavorazioni che ti servono: demolizioni, opere murarie, impianti elettrico, idrico e gas, pavimenti, cartongesso, rasature e pitture, oppure il bagno chiavi in mano. Il totale si aggiorna a ogni voce, con i prezzi del nostro listino IVA inclusa.',
               'Quando hai finito scarichi il preventivo in PDF e ce lo mandi su WhatsApp: il sopralluogo a Roma e nel Lazio è gratuito.'],
        passi=[('Superficie e piano', 'Indica i metri quadri della casa, il piano e se si trova in centro storico o in ZTL.'),
               ('Lavorazioni voce per voce', 'Apri i paragrafi che ti interessano e scrivi metri quadri, metri o numero di pezzi: le voci vuote non si calcolano.'),
               ('Preventivo e sopralluogo', 'Scarica il PDF con tutte le voci e mandacelo: ti richiamiamo per il sopralluogo e il preventivo definitivo.')],
        guida=('#guida-lavorazioni', 'Cosa comprende ogni lavorazione e quanto costa: la guida alle lavorazioni'),
        servizio='Simulatore dei costi di ristrutturazione di interni a Roma e nel Lazio'),
    dict(
        madre='ristrutturazioni-esterni', nome_madre='Ristrutturazioni esterni', file='simulatore-online-costi-ristrutturazioni-esterni',
        sezioni=2,
        title='Simulatore online gratuito costi facciate ed esterni Roma | MD Edil Group',
        desc='Calcola online il costo del rifacimento della facciata, del cappotto termico e dei terrazzi a Roma: ponteggio, ripristini, finiture e impermeabilizzazioni, prezzi + IVA.',
        ey='SIMULATORE ONLINE · ESTERNI', h1='Simulatore online dei costi di ristrutturazioni esterne e facciate',
        intro=['Quanto costa rifare la facciata di un condominio o di una villa a Roma? Indica i metri quadri di facciata e scegli le lavorazioni: ponteggio, risanamento di intonaco e calcestruzzo, cappotto termico, rasatura e finitura, grondaie e ringhiere, terrazzi e balconi da impermeabilizzare.',
               'I prezzi sono quelli del nostro listino per gli esterni, + IVA; gli oneri della sicurezza si calcolano a parte. Alla fine scarichi il preventivo in PDF e ce lo mandi per il sopralluogo gratuito.'],
        passi=[('Edificio e facciate', 'Scegli se è una villa o un condominio e scrivi la superficie delle facciate da rifare: lunghezza per altezza.'),
               ('Lavorazioni del cantiere', 'Il simulatore mostra solo le combinazioni corrette di cappotto, rasatura e finitura, senza lavorazioni doppie.'),
               ('Preventivo e verifica tecnica', 'Scarica il PDF e mandacelo: il prezzo definitivo si conferma dopo il sopralluogo e la verifica tecnica.')],
        guida=('#guida-lavorazioni', 'Cosa comprende ogni lavorazione su facciate e terrazzi e quanto costa: la guida'),
        servizio='Simulatore dei costi di rifacimento facciate, cappotto termico e terrazzi a Roma e nel Lazio'),
    dict(
        madre='infissi-serramenti', nome_madre='Infissi e serramenti', file='simulatore-online-costi-infissi-tapparelle-zanzariere',
        sezioni=1,
        title='Simulatore online prezzi infissi, tapparelle e zanzariere Roma | MD Edil Group',
        desc='Calcola online il prezzo dei tuoi infissi in PVC Rehau, tapparelle e zanzariere a Roma: scrivi le misure in cm e vedi subito il costo di ogni pezzo, posa compresa.',
        ey='SIMULATORE ONLINE · INFISSI', h1='Simulatore online dei costi di infissi, tapparelle e zanzariere',
        intro=['Quanto costano nuovi infissi in PVC a Roma? Scrivi larghezza e altezza di ogni finestra o porta-finestra, scegli battente o scorrevole e il colore Rehau: il prezzo di ogni pezzo compare subito. Aggiungi la demolizione dei vecchi infissi, la posa, le tapparelle in alluminio coibentato e le zanzariere.',
               'Prezzi + IVA, imballaggio e trasporto inclusi. Alla fine scarichi il preventivo in PDF e ce lo mandi su WhatsApp per il sopralluogo gratuito.'],
        passi=[('Misure in centimetri', 'Per ogni infisso scrivi larghezza e altezza e scegli se è a battente o scorrevole.'),
               ('Demolizione, posa e accessori', 'Con un tocco riprendi le stesse misure per demolizione, posa, tapparelle e zanzariere.'),
               ('Preventivo e sopralluogo', 'Scarica il PDF e mandacelo: le misure definitive le prendono i nostri tecnici al sopralluogo.')],
        guida=('#listino-infissi', 'Prezzi di partenza di infissi, tapparelle e zanzariere: il listino'),
        servizio='Simulatore dei prezzi di infissi in PVC Rehau, tapparelle e zanzariere a Roma e nel Lazio'),
]

e = lambda t: html.escape(t, quote=True)
P = 'style="margin: 0 0 14px; font-size: 12px; letter-spacing: 0.38em; color: #C9A24A; font-weight: 600"'


def sostituisci(t, regex, nuovo, n=1):
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
         'provider': {'@id': SITO + '/#impresa'}, 'about': p['servizio'], 'areaServed': ['Roma', 'Lazio']},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITO + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': p['nome_madre'], 'item': SITO + '/' + p['madre']},
            {'@type': 'ListItem', 'position': 3, 'name': 'Simulatore online', 'item': url}]}]}
    t = t.replace('</head>', '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>\n</head>', 1)

    # corpo: dalla prima <section> al footer si tiene solo il simulatore
    a = t.index('<section style="padding: 230px')
    f = t.index('<footer')
    corpo = t[a:f]
    s = corpo.index('<section id="simulatore"')
    fine = s
    for _ in range(p['sezioni']):
        fine = corpo.index('</section>', fine) + len('</section>')
    sim = corpo[s:fine]
    sim = sim.replace('<!-- SIMULATORE:LINK -->', '', 1)
    sim = re.sub(r'<p class="sim-link".*?</p>\n?', '', sim)  # il link "pagina del simulatore" non serve sulla pagina stessa

    briciole = ('<section style="padding: 230px clamp(20px, 5vw, 72px) 0; max-width: 1320px; margin: 0 auto">\n'
                '<p style="margin: 0; font-size: 12px; letter-spacing: 0.2em; color: #8A8478"><a href="/" style="color: #8A8478">HOME</a> / '
                '<a href="/' + p['madre'] + '" style="color: #8A8478">' + e(p['nome_madre'].upper()) + '</a> / SIMULATORE ONLINE</p>\n</section>\n\n')
    testa = ('<section style="padding: 56px clamp(20px, 5vw, 72px) 64px">\n<div style="max-width: 1320px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 28px 64px">\n'
             '<div style="flex: 1 1 460px">\n<p ' + P + '>' + e(p['ey']) + '</p>\n'
             '<h1 style="margin: 0; font-family: \'Urbanist\', sans-serif; font-weight: 400; font-size: clamp(34px, 3.6vw, 54px); line-height: 1.08">' + e(p['h1']) + '</h1>\n</div>\n'
             '<div style="flex: 1 1 420px; max-width: 560px; color: #D8D2C6">\n' +
             ''.join('<p style="margin: 0 0 14px">' + e(x) + '</p>\n' for x in p['intro']) +
             '<p style="margin: 0"><a href="#simulatore" style="display: inline-block; border: 1px solid #C9A24A; padding: 13px 22px; font-size: 13px; letter-spacing: 0.14em; font-weight: 600">INIZIA LA STIMA ↓</a></p>\n'
             '</div>\n</div>\n</section>\n\n')
    passi = ''.join('<li style="padding: 28px 26px; border-right: 1px solid #2A2722; border-bottom: 1px solid #2A2722"><span style="font-size: 12px; letter-spacing: 0.2em; color: #C9A24A">0' + str(i + 1) +
                    '</span><h3 style="margin: 10px 0 8px; font-family: \'Urbanist\', sans-serif; font-weight: 600; font-size: 20px">' + e(a1) +
                    '</h3><p style="margin: 0; color: #8A8478; font-size: 14.5px">' + e(b1) + '</p></li>' for i, (a1, b1) in enumerate(p['passi']))
    come = ('\n\n<section style="padding: 96px clamp(20px, 5vw, 72px)">\n<div style="max-width: 1320px; margin: 0 auto">\n'
            '<p ' + P + '>COME FUNZIONA</p>\n'
            '<h2 style="margin: 0 0 32px; font-family: \'Urbanist\', sans-serif; font-weight: 400; font-size: clamp(28px, 3vw, 40px); line-height: 1.1">Tre passaggi per la tua stima</h2>\n'
            '<ol style="list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); border-top: 1px solid #2A2722; border-left: 1px solid #2A2722">' + passi + '</ol>\n'
            '<p style="margin: 0 0 10px"><a href="/' + p['madre'] + p['guida'][0] + '">' + e(p['guida'][1]) + ' →</a></p>\n'
            '<p style="margin: 0"><a href="/' + p['madre'] + '">' + e(p['nome_madre']) + ' a Roma: lavori, metodo e lavori realizzati →</a></p>\n'
            '</div>\n</section>\n\n')
    t = t[:a] + briciole + testa + sim + come + t[f:]
    open(os.path.join(RADICE, p['file'] + '.html'), 'w', encoding='utf-8').write(t)
    print('Pagina simulatore:', p['file'] + '.html')


for p in PAGINE:
    costruisci(p)
