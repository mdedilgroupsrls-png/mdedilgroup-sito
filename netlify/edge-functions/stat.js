// Contatore anonimo delle visite e dei tocchi (nessun cookie, nessun dato personale).
// Il browser chiama /s?e=evento; qui si aggiunge la città approssimativa (dalla rete, non dal GPS)
// e si rimanda a /s.txt: così ogni evento compare con città e regione nei registri di Netlify.
export default async (req, ctx) => {
  const u = new URL(req.url);
  const e = (u.searchParams.get('e') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60) || 'x';
  const g = ctx.geo || {};
  const pulisci = s => encodeURIComponent(String(s || '?').slice(0, 40));
  const dest = new URL('/s.txt', u);
  dest.search = 'e=' + e + '&c=' + pulisci(g.city) + '&r=' + pulisci(g.subdivision && g.subdivision.name) + '&n=' + pulisci(g.country && g.country.code);
  return new Response(null, { status: 302, headers: { Location: dest.pathname + dest.search, 'Cache-Control': 'no-store' } });
};
export const config = { path: '/s' };
