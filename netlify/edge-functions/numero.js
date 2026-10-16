// Numero progressivo dei preventivi in PDF creati dai simulatori (il primo è 100, dal 16/10/2026).
// Il browser chiama POST /n quando crea il PDF; il numero è salvato in Netlify Blobs (archivio "preventivi").
// Nessun dato del cliente arriva qui: si conta solo quanti preventivi sono stati creati.
import { getStore } from '../vendor/netlify-blobs-8.1.0/main.js';

const PRIMO = 100;

export default async (req) => {
  if (req.method !== 'POST') return new Response('', { status: 405, headers: { Allow: 'POST' } });
  try {
    const archivio = getStore({ name: 'preventivi', consistency: 'strong' });
    const ultimo = parseInt((await archivio.get('ultimo')) || '', 10);
    const n = Number.isFinite(ultimo) && ultimo >= PRIMO ? ultimo + 1 : PRIMO;
    await archivio.set('ultimo', String(n));
    return Response.json({ n }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ n: null }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};

export const config = { path: '/n' };
