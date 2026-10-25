# Ogni titolo del sito ha il suo link (Eugenio, 25/10/2026): aggiunge un id a ogni <h2>, <h3> e <details>
# che non ce l'ha, ricavato dal testo del titolo (es. #chi-ha-diritto-al-50). I titoli che si aprono
# (<details>) prendono l'id sul <details>, così js/sicurezza.js li apre da soli dal link.
# Gli id già presenti non si toccano. Si saltano script, stili, le schede dei nastri (.tac-tr) e i titoli dentro
# le schede-link <a>, che i nastri copiano (taccuino, catalogo).
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


if __name__ == '__main__':
    tot = 0
    for f in sorted(glob.glob('*.html')):
        t = open(f, encoding='utf-8').read()
        n = sistema(t)
        if n != t:
            k = n.count(' id="') - t.count(' id="')
            tot += k
            open(f, 'w', encoding='utf-8').write(n)
            print('%-55s +%d link' % (f, k))
    print('titoli con link nuovo:', tot)
