// Articoli programmati: prima del giorno di uscita (ora di Roma) la pagina rimanda alla Home
// e non compare in sitemap.xml e llms.txt. Scritto da progetto/strumenti/uscite.py: non modificare a mano.
const USCITE = {"/bonus-casa-50-pagare-entro-31-dicembre-2026": "2026-10-27", "/infissi-scorrevoli-vetrata-roma-nord": "2026-11-03", "/quanto-costa-ristrutturare-casa-roma": "2026-11-10", "/infissi-scorrevoli-angolo-roma-eur": "2026-11-24", "/rifacimento-terrazzo-roma-vista-san-pietro": "2026-12-01", "/infissi-pvc-finto-legno-corso-trieste": "2026-12-15", "/preventivo-infissi-pvc-rehau-synego": "2027-01-05", "/infissi-palazzina-superbonus-l-aquila": "2027-01-19", "/infissi-villa-bifamiliare-trigoria": "2027-02-02"};
const oggi = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
export default async (req, ctx) => {
  const u = new URL(req.url), d = oggi();
  const attesa = Object.keys(USCITE).filter(p => USCITE[p] > d);
  if (attesa.includes(u.pathname.replace(/\.html$/, ''))) {
    return new Response(null, { status: 302, headers: { Location: '/', 'Cache-Control': 'no-store' } });
  }
  if (u.pathname === '/sitemap.xml' || u.pathname === '/llms.txt') {
    const r = await ctx.next();
    const fuori = l => attesa.some(p => { const x = 'mdedilgroup.it' + p; return l.includes(x + '<') || l.includes(x + ' ') || l.trimEnd().endsWith(x); });
    const t = (await r.text()).split('\n').filter(l => !fuori(l)).join('\n');
    const h = new Headers(r.headers); h.delete('content-length'); h.delete('content-encoding'); h.delete('etag'); h.set('Cache-Control', 'public, max-age=0, must-revalidate');
    return new Response(t, { status: r.status, headers: h });
  }
  return ctx.next();
};
export const config = { path: ["/sitemap.xml", "/llms.txt", "/bonus-casa-50-pagare-entro-31-dicembre-2026", "/bonus-casa-50-pagare-entro-31-dicembre-2026.html", "/infissi-scorrevoli-vetrata-roma-nord", "/infissi-scorrevoli-vetrata-roma-nord.html", "/quanto-costa-ristrutturare-casa-roma", "/quanto-costa-ristrutturare-casa-roma.html", "/infissi-scorrevoli-angolo-roma-eur", "/infissi-scorrevoli-angolo-roma-eur.html", "/rifacimento-terrazzo-roma-vista-san-pietro", "/rifacimento-terrazzo-roma-vista-san-pietro.html", "/infissi-pvc-finto-legno-corso-trieste", "/infissi-pvc-finto-legno-corso-trieste.html", "/preventivo-infissi-pvc-rehau-synego", "/preventivo-infissi-pvc-rehau-synego.html", "/infissi-palazzina-superbonus-l-aquila", "/infissi-palazzina-superbonus-l-aquila.html", "/infissi-villa-bifamiliare-trigoria", "/infissi-villa-bifamiliare-trigoria.html"] };
