"""Taglia le pause da un video parlato (Eugenio che spiega un lavoro, girato col telefono).

Uso:
  python3 progetto/strumenti/taglia_pause.py registrazione.mov uscita.mp4
  python3 progetto/strumenti/taglia_pause.py registrazione.mov --solo-analisi

Come funziona: ffmpeg trova i silenzi (silencedetect), lo script tiene solo i pezzi parlati
con un piccolo margine prima e dopo, e salva un MP4 verticale 1080x1920, 30 fps, volume
normalizzato per i social (-14 LUFS). Sottotitoli, logo, musica e chiusura si aggiungono dopo,
come da skill md-edil-reels e da progetto/social/stile-montaggio.md.

Opzioni:
  --soglia -35     sotto questo volume (dB) è silenzio; con rumore di cantiere prova -30
  --pausa 0.45     durata minima (s) di una pausa da tagliare
  --margine 0.12   secondi lasciati prima e dopo ogni pezzo parlato (le parole non si tagliano)
Le registrazioni originali non vanno nel repository (è pubblico): stanno su Google Drive.
"""
import argparse
import re
import subprocess
import sys


def durata(file):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", file], capture_output=True, text=True)
    return float(out.stdout.strip())


def ha_audio(file):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
                          "stream=index", "-of", "csv=p=0", file], capture_output=True, text=True)
    return bool(out.stdout.strip())


def silenzi(file, soglia, pausa):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", file, "-af",
                          f"silencedetect=noise={soglia}dB:d={pausa}", "-vn", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    inizi = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    fini = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return [(max(0.0, a), b) for a, b in zip(inizi, fini)] + (
        [(max(0.0, inizi[-1]), None)] if len(inizi) > len(fini) else [])


def pezzi_parlati(sil, totale, margine):
    pezzi, t = [], 0.0
    for a, b in sil:
        b = totale if b is None else b
        if a - t > 0.05:
            pezzi.append((max(0.0, t - margine), min(totale, a + margine)))
        t = b
    if totale - t > 0.05:
        pezzi.append((max(0.0, t - margine), totale))
    unito = []  # i margini possono sovrapporsi: unisci
    for a, b in pezzi:
        if unito and a <= unito[-1][1]:
            unito[-1] = (unito[-1][0], max(unito[-1][1], b))
        else:
            unito.append((a, b))
    return unito


def main():
    p = argparse.ArgumentParser(description="Taglia le pause da un video parlato")
    p.add_argument("ingresso")
    p.add_argument("uscita", nargs="?")
    p.add_argument("--soglia", type=float, default=-35)
    p.add_argument("--pausa", type=float, default=0.45)
    p.add_argument("--margine", type=float, default=0.12)
    p.add_argument("--solo-analisi", action="store_true")
    a = p.parse_args()

    if not ha_audio(a.ingresso):
        sys.exit("Il video non ha audio: non si possono trovare le pause.")
    totale = durata(a.ingresso)
    pezzi = pezzi_parlati(silenzi(a.ingresso, a.soglia, a.pausa), totale, a.margine)
    if not pezzi:
        sys.exit("Nessun parlato trovato: prova una soglia più bassa, es. --soglia -45.")
    nuova = sum(b - x for x, b in pezzi)
    print(f"Durata: {totale:.1f} s -> {nuova:.1f} s ({len(pezzi)} pezzi, tolti {totale - nuova:.1f} s di pause)")
    for x, b in pezzi:
        print(f"  tieni {x:6.2f} - {b:6.2f}")
    if a.solo_analisi or not a.uscita:
        return

    scelta = "+".join(f"between(t,{x:.3f},{b:.3f})" for x, b in pezzi)
    filtro = (
        f"[0:v]select='{scelta}',setpts=N/FRAME_RATE/TB,"
        "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,"
        "fps=30,format=yuv420p[v];"
        f"[0:a]aselect='{scelta}',asetpts=N/SR/TB,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]"
    )
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a.ingresso,
                    "-filter_complex", filtro, "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", a.uscita], check=True)
    print(f"Salvato: {a.uscita} ({durata(a.uscita):.1f} s)")


if __name__ == "__main__":
    main()
