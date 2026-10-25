# Rifà sitemap.xml con tutte le pagine pubblicabili (26/10/2026): ogni pagina .html della radice tranne
# 404, grazie, il file di verifica di Google e le pagine con "noindex". L'indirizzo è quello canonico della pagina
# (senza .html) e lastmod è la data dell'ultima modifica vera del file (ultimo commit; oggi se è modificato e non
# ancora salvato). Lanciare dopo ogni pagina nuova o modificata: python3 progetto/strumenti/sitemap.py
import datetime, glob, os, re, subprocess
from zoneinfo import ZoneInfo

os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
oggi = datetime.datetime.now(ZoneInfo('Europe/Rome')).date().isoformat()


def ultima_modifica(f):
    if subprocess.run(['git', 'diff', '--quiet', 'HEAD', '--', f]).returncode != 0:
        return oggi
    out = subprocess.run(['git', 'log', '-1', '--format=%cI', '--', f], capture_output=True, text=True).stdout.strip()
    if not out: return oggi
    return datetime.datetime.fromisoformat(out).astimezone(ZoneInfo('Europe/Rome')).date().isoformat()


righe = []
for f in sorted(glob.glob('*.html')):
    if f in ('404.html', 'grazie.html') or f.startswith('google'): continue
    t = open(f, encoding='utf-8').read()
    if re.search(r'<meta name="robots" content="[^"]*noindex', t): continue
    c = re.search(r'<link rel="canonical" href="([^"]+)"', t)
    assert c, 'manca il canonical in ' + f
    righe.append((0 if f == 'index.html' else 1, c.group(1), ultima_modifica(f)))
righe.sort()
xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
xml += ''.join('<url><loc>%s</loc><lastmod>%s</lastmod></url>\n' % (u, d) for _, u, d in righe)
xml += '</urlset>\n'
open('sitemap.xml', 'w').write(xml)
print('sitemap.xml:', len(righe), 'pagine')
