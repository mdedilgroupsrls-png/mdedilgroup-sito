"""Aggiorna la sezione "Gli ultimi reel" della Home con i reel di @md_edil_group.

Gira ogni giorno su GitHub (.github/workflows/reels-instagram.yml).
Legge la chiave di Instagram dalla variabile d'ambiente IG_TOKEN (segreto del repository),
scarica copertine, testi e numeri dei reel e riscrive in index.html il blocco tra
<!-- REELS:INIZIO --> e <!-- REELS:FINE -->. I reel da non mostrare stanno in progetto/reels.json.
"""
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

RADICE = Path(__file__).resolve().parents[2]
INDEX = RADICE / "index.html"
CARTELLA_IMG = RADICE / "img" / "reels"
CONFIG = json.loads((RADICE / "progetto" / "reels.json").read_text(encoding="utf-8"))
API = "https://graph.instagram.com/v22.0"
MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio",
        "agosto", "settembre", "ottobre", "novembre", "dicembre"]
EMOJI = re.compile("[\U0001F000-\U0001FFFF☀-➿️‍⬀-⯿]")
RIGHE_DA_TOGLIERE = re.compile(r"\d{3}\s?\d{3}\s?\d{4}|Scrivi|Finale:|preventivo|Richiedi", re.I)

ICONA_IG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>'
ICONA_PLAY = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
ICONA_VISTE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'
ICONA_LIKE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.3 1.1 4 2.3h3.2C14.3 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z"/></svg>'
ICONA_COMMENTI = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>'


def chiedi(percorso, **parametri):
    parametri["access_token"] = os.environ["IG_TOKEN"]
    url = f"{API}/{percorso}?{urllib.parse.urlencode(parametri)}"
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def visualizzazioni(media_id):
    # Le visualizzazioni richiedono il permesso degli insight: se manca, il numero non viene mostrato
    try:
        dati = chiedi(f"{media_id}/insights", metric="views")
        return int(dati["data"][0]["values"][0]["value"])
    except Exception:
        return None


def numero(n):
    return f"{n:,}".replace(",", ".")


def testi(didascalia):
    hashtag = " ".join(re.findall(r"#\w+", didascalia)[:6])
    corpo = re.sub(r"#\w+", "", didascalia)
    righe = [EMOJI.sub("", r).strip(" •") .strip() for r in corpo.split("\n")]
    righe = [r for r in righe if r and not RIGHE_DA_TOGLIERE.search(r)]
    titolo = righe[0] if righe else "Reel di MD Edil Group"
    if sum(c.isupper() for c in titolo) > len(titolo) * 0.6:
        titolo = titolo[0] + titolo[1:].lower()
    resto = " ".join(righe[1:4])
    if len(resto) > 200:
        resto = resto[:197].rsplit(" ", 1)[0] + "…"
    return titolo, resto, hashtag


def scarica_copertina(media):
    url = media.get("thumbnail_url") or media.get("media_url")
    if not url:
        return None
    file = CARTELLA_IMG / f"{media['id']}.jpg"
    if not file.exists():
        with urllib.request.urlopen(url, timeout=60) as r:
            file.write_bytes(r.read())
    return f"/img/reels/{file.name}"


def scheda(media):
    data = datetime.strptime(media["timestamp"][:10], "%Y-%m-%d")
    quando = f"{data.day} {MESI[data.month - 1]} {data.year}"
    titolo, resto, hashtag = testi(media.get("caption") or "")
    copertina = scarica_copertina(media)
    img = f'<img src="{copertina}" alt="Copertina del reel: {html.escape(titolo)}" loading="lazy">' if copertina else ""
    numeri = []
    viste = visualizzazioni(media["id"])
    if viste is not None:
        numeri.append(("Visualizzazioni", ICONA_VISTE, viste))
    numeri.append(("Mi piace", ICONA_LIKE, int(media.get("like_count") or 0)))
    numeri.append(("Commenti", ICONA_COMMENTI, int(media.get("comments_count") or 0)))
    stats = "".join(f'<span title="{t}">{i}<b class="cnt" data-n="{n}">{numero(n)}</b></span>' for t, i, n in numeri)
    return (f'      <a class="reel" href="{html.escape(media["permalink"])}">\n'
            f'        <div class="v">{img}<span class="ig">{ICONA_IG}Reel · {quando}</span>'
            f'<span class="play" aria-hidden="true">{ICONA_PLAY}</span><span class="stats">{stats}</span></div>\n'
            f'        <p class="cap"><b>{html.escape(titolo)}</b><em>{html.escape(resto)}</em></p>\n'
            f'        <span class="tags">{html.escape(hashtag)}</span>\n'
            f'      </a>')


def main():
    if not os.environ.get("IG_TOKEN"):
        sys.exit("Manca il segreto IG_TOKEN")
    CARTELLA_IMG.mkdir(parents=True, exist_ok=True)
    campi = "id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count"
    media = chiedi("me/media", fields=campi, limit=50).get("data", [])
    esclusi = set(CONFIG["esclusi"])
    reel = [m for m in media
            if (m.get("media_product_type") == "REELS" or m.get("media_type") == "VIDEO")
            and not any(codice in m.get("permalink", "") for codice in esclusi)]
    reel.sort(key=lambda m: m["timestamp"], reverse=True)
    reel = reel[:CONFIG["quanti_reel"]]
    if not reel:
        sys.exit("Instagram non ha restituito nessun reel: la Home non viene toccata")

    schede = "\n".join(scheda(m) for m in reel)
    pagina = INDEX.read_text(encoding="utf-8")
    pagina, n = re.subn(r"(<!-- REELS:INIZIO -->\n).*?(\n\s*<!-- REELS:FINE -->)",
                        lambda m: m.group(1) + schede + m.group(2), pagina, flags=re.S)
    if n != 1:
        sys.exit("Segnaposto REELS non trovati in index.html")
    oggi = datetime.now()
    pagina = re.sub(r"Numeri aggiornati al [^.]+\.", f"Numeri aggiornati al {oggi.day} {MESI[oggi.month - 1]} {oggi.year}.", pagina)
    INDEX.write_text(pagina, encoding="utf-8")

    # copertine di reel che non sono più in pagina
    in_uso = {f"{m['id']}.jpg" for m in reel}
    for f in CARTELLA_IMG.glob("*.jpg"):
        if f.name not in in_uso:
            f.unlink()
    print(f"Aggiornati {len(reel)} reel")


if __name__ == "__main__":
    main()
