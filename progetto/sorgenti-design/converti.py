#!/usr/bin/env python3
"""Converte le pagine del canvas Design (Nero & Oro) in un sito statico per Netlify."""
import os, re, sys, shutil, html
from PIL import Image

SRC = sys.argv[1]          # cartella con project/*.dc.html e gli asset scaricati
OUT = sys.argv[2]          # cartella di output del sito
PROJ = os.path.join(SRC, 'project')
SITE = 'https://mdedilgroup.it'

PAGES = {
    'Main.dc.html': ('index.html', '/',
        'Ristrutturazioni di pregio a Roma e Milano | MD Edil Group',
        'MD Edil Group: ristrutturazioni chiavi in mano di pregio a Roma e Milano. Studio tecnico interno, interior design, ristrutturazioni di interni ed esterni.'),
    'StudioTecnico.dc.html': ('studio-tecnico.html', '/studio-tecnico',
        'Studio tecnico: rilievi, progetti e pratiche edilizie | MD Edil Group',
        'Lo studio tecnico di MD Edil Group: rilievi, progetti, pratiche CILA e SCIA, direzione lavori e sicurezza con tecnici abilitati.'),
    'InteriorDesign.dc.html': ('interior-design.html', '/interior-design',
        'Interior design e progetto esecutivo | MD Edil Group',
        'Interior design su misura con progetto esecutivo completo, tavole impianti e render 3D prima di aprire il cantiere.'),
    'RistrutturazioniInterni.dc.html': ('ristrutturazioni-interni.html', '/ristrutturazioni-interni',
        'Ristrutturazioni interni chiavi in mano e simulatore costi | MD Edil Group',
        'Ristrutturazione di appartamenti, ville e locali chiavi in mano a Roma e Milano. Stima subito il costo indicativo con il simulatore.'),
    'RistrutturazioniEsterni.dc.html': ('ristrutturazioni-esterni.html', '/ristrutturazioni-esterni',
        'Facciate, cappotto termico e lavori condominiali | MD Edil Group',
        'Ristrutturazioni esterne per condomini e privati: facciate, cappotto termico, coperture e balconi, dal rilievo al collaudo.'),
}
LINKS = {k: v[1] for k, v in PAGES.items()}

os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)

# --- immagini: copia, PNG grandi convertite in WebP ---
img_map = {}
for f in os.listdir(SRC):
    m = re.fullmatch(r'([0-9a-f]{32})\.(png|jpg|webp)', f)
    if not m:
        continue
    aid, ext = m.groups()
    src = os.path.join(SRC, f)
    if ext == 'png' and os.path.getsize(src) > 500_000:
        im = Image.open(src)
        im.save(os.path.join(OUT, 'img', aid + '.webp'), 'WEBP', quality=82)
        img_map[aid] = f'/img/{aid}.webp'
    else:
        shutil.copy(src, os.path.join(OUT, 'img', f))
        img_map[aid] = f'/img/{f}'
# logo anche come favicon
logo = 'cc07e2f1120eb45d8438fc5d59d4b3e8'
shutil.copy(os.path.join(SRC, logo + '.png'), os.path.join(OUT, 'favicon.png'))

def blobs(s):
    def rep(m):
        aid = m.group(1)
        if aid not in img_map:
            raise SystemExit(f'immagine mancante: {aid}')
        return img_map[aid]
    return re.sub(r'/_blob/([0-9a-f]{32})', rep, s)

def links(s):
    for k, v in LINKS.items():
        s = s.replace(f'href="{k}"', f'href="{v}"')
    return s

def expand_for(body, lists):
    def rep(m):
        name, var, inner = m.group(1), m.group(2), m.group(3)
        out = []
        for item in lists[name]:
            chunk = inner
            for key, val in item.items():
                chunk = chunk.replace('{{%s.%s}}' % (var, key), html.escape(val, quote=True))
            out.append(chunk)
        return ''.join(out)
    return re.sub(r'<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>(.*?)</sc-for>', rep, body, flags=re.S)

def js_lists(script):
    lists = {}
    for name, block in re.findall(r'(\w+): \[\s*(\{.*?\})\s*\]', script, flags=re.S):
        items = []
        for obj in re.findall(r'\{(.*?)\}', block, flags=re.S):
            items.append({k: v for k, v in re.findall(r"(\w+): '((?:[^'\\]|\\.)*)'", obj)})
        lists[name] = items
    return lists

def head(title, desc, canon, helmet):
    return f'''<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc, quote=True)}">
<link rel="canonical" href="{SITE}{canon}">
<link rel="icon" type="image/png" href="/favicon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="{html.escape(title, quote=True)}">
<meta property="og:description" content="{html.escape(desc, quote=True)}">
<meta property="og:url" content="{SITE}{canon}">
<meta property="og:image" content="{SITE}/favicon.png">
<meta name="theme-color" content="#0E0D0B">
{helmet.strip()}
<style>html{{scroll-behavior:smooth}}img{{max-width:100%}}</style>
'''

LD = '''<script type="application/ld+json">
{"@context":"https://schema.org","@type":"GeneralContractor","name":"MD Edil Group S.R.L.S.","url":"https://mdedilgroup.it","logo":"https://mdedilgroup.it/favicon.png","telephone":"+39 328 214 5266","email":"mdedilgroupsrls@gmail.com","vatID":"IT17112431006","slogan":"I dettagli fanno la differenza","areaServed":["Roma","Lazio","Milano","Italia"],"address":[{"@type":"PostalAddress","streetAddress":"Via Monti Lepini 9","postalCode":"00015","addressLocality":"Monterotondo","addressRegion":"RM","addressCountry":"IT"},{"@type":"PostalAddress","streetAddress":"Via Po 22","addressLocality":"Roma","addressRegion":"RM","addressCountry":"IT"}],"sameAs":["https://www.instagram.com/md_edil_group/"]}
</script>
'''

FIELD_NAMES = ['nome', 'telefono', 'comune']

def netlify_form(body):
    if '<form' not in body:
        return body
    body = body.replace('<form style=', '<form name="preventivo" method="POST" action="/grazie" data-netlify="true" netlify-honeypot="indirizzo-web" style=', 1)
    body = re.sub(r'(<form[^>]*>)', r'\1<input type="hidden" name="form-name" value="preventivo"><p hidden><label>Non compilare<input name="indirizzo-web"></label></p>', body, count=1)
    i = iter(FIELD_NAMES)
    def inp(m):
        tag = m.group(0)
        if 'type="hidden"' in tag or 'name=' in tag:
            return tag
        n = next(i)
        extra = ' required' if n in ('nome', 'telefono') else ''
        auto = {'nome': 'name', 'telefono': 'tel', 'comune': 'address-level2'}[n]
        return tag.replace('<input ', f'<input name="{n}" autocomplete="{auto}"{extra} ', 1)
    body = re.sub(r'<input type="(?:text|tel)"[^>]*>', inp, body)
    body = body.replace('<select ', '<select name="intervento" ', 1)
    body = body.replace('<textarea ', '<textarea name="descrizione" ', 1)
    body = re.sub(r'<button type="button"([^>]*)>INVIA LA RICHIESTA', r'<button type="submit"\1>INVIA LA RICHIESTA', body)
    return body

for src_name, (out_name, canon, title, desc) in PAGES.items():
    raw = open(os.path.join(PROJ, src_name), encoding='utf-8').read()
    helmet = re.search(r'<helmet>(.*?)</helmet>', raw, re.S).group(1)
    xdc = re.search(r'<x-dc>(.*?)</x-dc>', raw, re.S).group(1)
    body = re.sub(r'<helmet>.*?</helmet>', '', xdc, flags=re.S)
    script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', raw, re.S).group(1)
    body = body.replace('{{headFont}}', 'Urbanist').replace('{{nameJustify}}', 'flex-start')
    helmet = helmet.replace('{{headFont}}', 'Urbanist')
    body = links(blobs(body))
    body = body.replace('<span>Privacy · Cookie</span>', '<a href="/privacy.html" style="color: #8A8478">Privacy · Cookie</a>')
    if src_name == 'Main.dc.html':
        body = body.replace('href="#" aria-label="MD Edil Group, torna alla Home"', 'href="/" aria-label="MD Edil Group, torna alla Home"')
        body = expand_for(body, {k: [{kk: (img_map[vv[7:]] if vv.startswith('/_blob/') else vv) for kk, vv in it.items()} for it in v] for k, v in js_lists(script).items()})
        body = netlify_form(body)
    page = head(title, desc, canon, helmet)
    if src_name == 'Main.dc.html':
        page += LD
    if '{{' in body or '<sc-' in body:
        # pagina interattiva (simulatore): rendering con il piccolo runtime
        cls = script.strip()
        page += '</head>\n<body>\n<div id="app"></div>\n<template id="tpl">' + body + '</template>\n'
        page += '<script src="/js/dc-lite.js"></script>\n<script>\n' + cls + '\nDCLite.mount(Component, document.getElementById("tpl"), document.getElementById("app"));\n</script>\n</body>\n</html>\n'
    else:
        page += '</head>\n<body>\n' + body + '\n</body>\n</html>\n'
    left = re.findall(r'\{\{[^}]*\}\}|/_blob/|\.dc\.html', page if '{{' not in body else page.replace(body, ''))
    if left:
        raise SystemExit(f'{src_name}: residui {left[:5]}')
    open(os.path.join(OUT, out_name), 'w', encoding='utf-8').write(page)
    print('ok', out_name, len(page))
