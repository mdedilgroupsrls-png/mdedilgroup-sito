// Un solo indirizzo per pagina: /chi-siamo.html → /chi-siamo con redirect permanente (301),
// come i canonical. /index.html → /. Restano raggiungibili con .html solo il file di verifica di Google e la 404.
export default async (req) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return;
  const u = new URL(req.url);
  const p = u.pathname;
  if (/^\/google[0-9a-f]+\.html$/.test(p) || p === '/404.html') return;
  const dest = p === '/index.html' ? '/' : p.replace(/\.html$/, '');
  return new Response(null, { status: 301, headers: { Location: dest + u.search + u.hash, 'Cache-Control': 'public, max-age=3600' } });
};
export const config = { pattern: '^/[^/]+\\.html$' };
