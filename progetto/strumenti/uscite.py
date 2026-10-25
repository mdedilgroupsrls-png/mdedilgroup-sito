# Articoli programmati: escono solo dal loro giorno (Eugenio, 25/10/2026).
# Legge le date dalle schede del taccuino della Home (data-dal) e scrive:
#  - netlify/edge-functions/uscite.js: prima del giorno di uscita la pagina rimanda alla Home
#    e il suo indirizzo non compare in sitemap.xml e llms.txt;
#  - il blocco USCITE in js/sicurezza.js: prima del giorno di uscita i link all'articolo
#    nelle altre pagine non si vedono (schede tolte, link nel testo lasciati come testo);
#  - data-dal sulle schede dei nastri (.tac-tr) delle altre pagine, che js/taccuino.js nasconde.
# Lanciare dopo ogni articolo nuovo o data cambiata: python3 progetto/strumenti/uscite.py
import glob, json, os, re, datetime
from zoneinfo import ZoneInfo

os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
oggi = datetime.datetime.now(ZoneInfo('Europe/Rome')).date().isoformat()

home = open('index.html').read()
tac = home[home.index('id="taccuino"'):]
tac = tac[:tac.index('</section>')]
uscite = {}
for a in re.findall(r'<a [^>]*class="art"[^>]*>', tac):
    d, h = re.search(r'data-dal="([\d-]+)"', a), re.search(r'href="(/[^"#]*)"', a)
    if d and h and d.group(1) > oggi:
        uscite[h.group(1).removesuffix('.html')] = d.group(1)
uscite = dict(sorted(uscite.items(), key=lambda x: x[1]))
dati = json.dumps(uscite, ensure_ascii=False)

percorsi = ['/sitemap.xml', '/llms.txt'] + [p + s for p in uscite for s in ('', '.html')]
open('netlify/edge-functions/uscite.js', 'w').write('''// Articoli programmati: prima del giorno di uscita (ora di Roma) la pagina rimanda alla Home
// e non compare in sitemap.xml e llms.txt. Scritto da progetto/strumenti/uscite.py: non modificare a mano.
const USCITE = %s;
const oggi = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
export default async (req, ctx) => {
  const u = new URL(req.url), d = oggi();
  const attesa = Object.keys(USCITE).filter(p => USCITE[p] > d);
  if (attesa.includes(u.pathname.replace(/\\.html$/, ''))) {
    return new Response(null, { status: 302, headers: { Location: '/', 'Cache-Control': 'no-store' } });
  }
  if (u.pathname === '/sitemap.xml' || u.pathname === '/llms.txt') {
    const r = await ctx.next();
    const fuori = l => attesa.some(p => { const x = 'mdedilgroup.it' + p; return l.includes(x + '<') || l.includes(x + ' ') || l.trimEnd().endsWith(x); });
    const t = (await r.text()).split('\\n').filter(l => !fuori(l)).join('\\n');
    const h = new Headers(r.headers); h.delete('content-length'); h.delete('content-encoding'); h.delete('etag'); h.set('Cache-Control', 'public, max-age=0, must-revalidate');
    return new Response(t, { status: r.status, headers: h });
  }
  return ctx.next();
};
export const config = { path: %s };
''' % (dati, json.dumps(percorsi)))

js = open('js/sicurezza.js').read()
blocco = '  // USCITE: scritto da progetto/strumenti/uscite.py (articoli programmati e giorno di uscita)\n  var USCITE = %s;\n' % dati
js, n = re.subn(r'  // USCITE: scritto da .*?\n  var USCITE = .*?;\n', lambda m: blocco, js)
assert n == 1, 'blocco USCITE non trovato in js/sicurezza.js'
open('js/sicurezza.js', 'w').write(js)

for f in sorted(glob.glob('*.html')):
    if f == 'index.html': continue
    s = open(f).read()
    def segna(m):
        a = m.group(0); h = re.search(r'href="(/[^"#]*)', a)
        p = h and h.group(1).removesuffix('.html')
        if p in uscite and 'data-dal=' not in a:
            a = a.replace('<a ', '<a data-dal="%s" ' % uscite[p], 1)
        return a
    nuovo = re.sub(r'<div class="tac-tr">.*?\n</div>', lambda m: re.sub(r'<a [^>]*>', segna, m.group(0)), s, flags=re.S)
    if nuovo != s: open(f, 'w').write(nuovo); print('data-dal:', f)
print('articoli in attesa:', len(uscite))
for p, d in uscite.items(): print(' ', d, p)
