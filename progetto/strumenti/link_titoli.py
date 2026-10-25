# Ogni titolo del sito ha il suo link (Eugenio, 25/10/2026): aggiunge un id a ogni <h2>, <h3> e <details>
# che non ce l'ha, ricavato dal testo del titolo (es. #chi-ha-diritto-al-50). I titoli che si aprono
# (<details>) prendono l'id sul <details>, così js/sicurezza.js li apre da soli dal link.
# Gli id già presenti non si toccano. Si saltano script, stili, le schede dei nastri (.tac-tr) e i titoli dentro
# le schede-link <a>, che i nastri copiano (taccuino, catalogo).
# Ogni voce con un prezzo ha anche un link visibile (🔗 Link a questa voce) e le sezioni con 3-14 voci un indice
# "Vai a" con i link alle voci (Eugenio, 26/10/2026): Google li legge e può mostrarli come collegamenti alla sezione.
# Lanciare dopo ogni modifica alle pagine (lo lanciano già guida_lavorazioni.js, pagine_simulatori.py e pagine_voci.py):
#   python3 progetto/strumenti/link_titoli.py
import glob, html, os, re, unicodedata

os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))


def slug(testo):
    t = unicodedata.normalize('NFKD', html.unescape(re.sub(r'<[^>]+>', ' ', testo)))
    t = ''.join(c for c in t if not unicodedata.combining(c)).lower().replace('’', ' ').replace("'", ' ')
    parole = re.sub(r'[^a-z0-9]+', ' ', t).split()
    s = ''
    for p in parole:
        if len(s) + len(p) + 1 > 60: break
        s = (s + '-' + p) if s else p
    return s or 'titolo'


def zone_saltate(t):
    # script, stili e nastri .tac-tr: lì non si aggiungono id
    z = [(m.start(), m.end()) for m in re.finditer(r'<(script|style)\b.*?</\1>', t, re.S)]
    for m in re.finditer(r'<div class="tac-tr">', t):
        i, livello = m.end(), 1
        for d in re.finditer(r'<(/?)div\b', t[i:]):
            livello += -1 if d.group(1) else 1
            if livello == 0:
                z.append((m.start(), i + d.end())); break
    return z


def sistema(t):
    usati = set(re.findall(r'\bid="([^"]+)"', t))
    salta = zone_saltate(t)
    dentro = lambda p: any(a <= p < b for a, b in salta)
    out, pos = [], 0
    for m in re.finditer(r'<(h2|h3|details)\b([^>]*)>', t):
        if dentro(m.start()) or re.search(r'\bid=', m.group(2)): continue
        tag = m.group(1)
        if tag == 'details':
            s = t.find('<summary', m.end()); e = t.find('</summary>', s)
            if s == -1 or e == -1: continue
            testo = t[s:e]
        else:
            # titolo dentro il <summary> di un <details>: il link va sul <details>
            prima = t[:m.start()]
            if prima.rfind('<summary') > prima.rfind('</summary>'): continue
            # titolo dentro una scheda-link (<a>): le schede dei nastri vengono copiate, niente id
            if prima.rfind('<a ') > prima.rfind('</a>'): continue
            testo = t[m.end():t.find('</' + tag, m.end())]
        base = slug(testo); nuovo = base; n = 2
        while nuovo in usati:
            nuovo = '%s-%d' % (base, n); n += 1
        usati.add(nuovo)
        out.append(t[pos:m.start()] + '<%s id="%s"%s>' % (tag, nuovo, m.group(2)))
        pos = m.end()
    out.append(t[pos:])
    return ''.join(out)


def testo(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()


def voci_con_prezzo(t):
    """Titoli che si aprono (<details id>) con un prezzo e senza altri <details> dentro: (inizio, fine, id, titolo, classe)."""
    salta = zone_saltate(t)
    pila, voci = [], []
    for m in re.finditer(r'<details\b([^>]*)>|</details>', t):
        if any(a <= m.start() < b for a, b in salta): continue
        if m.group(0).startswith('<details'):
            if pila: pila[-1][3] = True
            pila.append([m.start(), m.group(1), m.end(), False])
        elif pila:
            ini, attr, dopo, ha_figli = pila.pop()
            corpo = t[dopo:m.start()]
            i = re.search(r'\bid="([^"]+)"', attr)
            if ha_figli or not i or '€' not in corpo or 'faq' in attr: continue
            s = re.search(r'<summary[^>]*>(.*?)</summary>', corpo, re.S)
            h = s and re.search(r'<h3[^>]*>(.*?)</h3>', s.group(1), re.S)
            voci.append((ini, m.start(), i.group(1), testo((h or s).group(1)) if s else i.group(1)))
    return voci


def link_voci(t):
    """Link visibile in ogni voce con prezzo e indice "Vai a" in cima alle sezioni con 3-14 voci (Eugenio, 26/10/2026)."""
    c = re.search(r'<link rel="canonical" href="https://mdedilgroup\.it([^"]*)"', t)
    if not c: return t
    pagina = c.group(1) or '/'
    voci = voci_con_prezzo(t)
    for ini, fine, vid, tit in sorted(voci, reverse=True):
        if 'class="voce-link"' in t[ini:fine]: continue
        t = t[:fine] + ('<p class="voce-link" style="margin: 14px 0 0; font-size: 13px"><a href="%s#%s" style="color: #8A8478">🔗 Link a questa voce: %s</a></p>\n'
                        % (pagina, vid, html.escape(tit, quote=False))) + t[fine:]
    voci = voci_con_prezzo(t)
    for sm in reversed(list(re.finditer(r'<section\b[^>]*>.*?</section>', t, re.S))):
        dentro = [v for v in voci if sm.start() <= v[0] < sm.end()]
        blocco = sm.group(0)
        if not 3 <= len(dentro) <= 14 or 'class="indice-voci"' in blocco or '</h2>' not in blocco: continue
        nav = ('<nav class="indice-voci" aria-label="Voci di questa sezione" style="margin: 0 0 28px; font-size: 14px; line-height: 1.9; color: #8A8478">Vai a: '
               + ' · '.join('<a href="#%s" style="color: #C9A24A">%s</a>' % (v[2], html.escape(v[3], quote=False)) for v in dentro) + '</nav>\n')
        p = sm.start() + blocco.index('</h2>') + len('</h2>')
        t = t[:p] + '\n' + nav + t[p:]
    return t


if __name__ == '__main__':
    tot = 0
    for f in sorted(glob.glob('*.html')):
        t = open(f, encoding='utf-8').read()
        n = link_voci(sistema(t))
        if n != t:
            k = n.count(' id="') - t.count(' id="')
            tot += k
            open(f, 'w', encoding='utf-8').write(n)
            print('%-55s +%d link' % (f, k))
    print('titoli con link nuovo:', tot)
