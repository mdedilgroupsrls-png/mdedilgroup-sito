# Crea il PDF di esempio "preventivo-infissi-pvc-rehau-synego" (reportlab). Uso: python3 progetto/strumenti/preventivo_infissi_esempio.py preventivi/esempio-preventivo-infissi-rehau-synego.pdf
# Calcolo con le regole di js/infissi.js (battente bianco: 200 € fino a 1 m², poi 280 €/m²; demolizione 30 e posa 140 a pezzo, doppie oltre 3,22 m²).
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
OUT=sys.argv[1]
LOGO="/home/user/mdedilgroup-sito/img/cc07e2f1120eb45d8438fc5d59d4b3e8.png"
def C(r,g,b): return Color(r/255,g/255,b/255)
ORO,NERO,TESTO,GRIGIO,RIGA,PANNA=C(201,162,74),C(14,13,11),C(40,38,34),C(120,114,104),C(222,216,204),C(248,245,239)
W,H=A4; M=16*mm
def eur(v): return "€ "+f"{v:,.2f}".replace(",","X").replace(".",",").replace("X",".")
def num(v,d=2): return f"{v:.{d}f}".replace(".",",")
# --- calcolo con le regole del simulatore js/infissi.js (battente bianco) ---
P=dict(piccola=200,bat=280,dem=30,pos=140)
items=[("Finestra a due ante",106.5,132),("Finestra a due ante",106.5,131),("Finestra a due ante",102.5,132),("Porta-finestra a due ante",146,221.5),("Porta-finestra a due ante",146,222)]
rows=[]
for t,w,h in items:
    a=w*h/10000
    pr=P['piccola'] if a<=1 else a*P['bat']
    k=1 if a<=3.22 else 2
    rows.append(dict(t=t,w=w,h=h,a=a,pr=pr,dem=P['dem']*k,pos=P['pos']*k))
TI=sum(r['pr'] for r in rows); TD=sum(r['dem'] for r in rows); TP=sum(r['pos'] for r in rows); TOT=TI+TD+TP
print(round(TI,2),TD,TP,round(TOT,2))
c=canvas.Canvas(OUT,pagesize=A4); c.setTitle("Preventivo indicativo infissi Rehau Synego – MD Edil Group"); c.setAuthor("MD Edil Group S.R.L.S.")
def testata():
    c.setFillColor(NERO); c.rect(0,H-34*mm,W,34*mm,fill=1,stroke=0)
    c.drawImage(LOGO,M,H-28*mm,29*mm,22*mm,mask='auto',preserveAspectRatio=True)
    c.setFillColor(C(243,239,231)); c.setFont("Helvetica-Bold",17); c.drawString(M+34*mm,H-16*mm,"MD EDIL GROUP")
    c.setFillColor(ORO); c.setFont("Helvetica",8.5); c.drawString(M+34*mm,H-22*mm,"I dettagli fanno la differenza")
    c.setFillColor(C(216,210,198)); c.setFont("Helvetica",7.5)
    for i,r in enumerate(["Sede legale: Via Po 22, 00198 Roma","Sede operativa: Via Monti Lepini 9, 00015 Monterotondo (RM)","P.IVA 17112431006","Tel. e WhatsApp +39 328 214 5266","mdedilgroup.it"]):
        c.drawRightString(W-M,H-(10+i*4.4)*mm,r)
    c.setStrokeColor(ORO); c.setLineWidth(0.8*mm/ (mm/1)) ; c.setLineWidth(2.2); c.line(0,H-34*mm,W,H-34*mm)
def piede(p,n):
    c.setStrokeColor(RIGA); c.setLineWidth(0.5); c.line(M,14*mm,W-M,14*mm)
    c.setFillColor(GRIGIO); c.setFont("Helvetica",7.5)
    c.drawString(M,9*mm,"Preventivo indicativo di esempio · prezzi IVA esclusa · il prezzo definitivo si conferma dopo il sopralluogo gratuito")
    c.drawRightString(W-M,9*mm,f"Pagina {p} di {n}")
def titolo_sez(y,t):
    c.setFillColor(ORO); c.setFont("Helvetica-Bold",9); c.drawString(M,y,t.upper()); c.setStrokeColor(ORO); c.setLineWidth(0.8); c.line(M,y-2*mm,W-M,y-2*mm); return y-8*mm
# ---------- PAGINA 1 ----------
testata()
y=H-46*mm
c.setFillColor(TESTO); c.setFont("Helvetica-Bold",15); c.drawString(M,y,"Preventivo indicativo · Fornitura e posa di infissi")
y-=6*mm; c.setFont("Helvetica",9); c.setFillColor(GRIGIO)
c.drawString(M,y,"Preventivo n. ESEMPIO  ·  Data 21/10/2026  ·  5 infissi in PVC Rehau Synego bianco  ·  misure prese in cantiere")
y-=10*mm
y=titolo_sez(y,"Il prodotto: Rehau Synego bianco, doppio vetro")
spec=[("Profilo","Rehau Synego in PVC, apertura a battente, colore bianco"),("Profondità profilo","80 mm"),("Tecnica","telaio a 7 camere, anta a 6 camere"),("Trasmittanza termica","valore Uf fino a 0,94 W/m²K"),("Isolamento acustico","Rw,P fino a 47 dB"),("Sicurezza","fino alla classe di resistenza 3 contro le effrazioni"),("Superficie","HDF, liscia: resta pulita più a lungo"),("Guarnizioni","contro correnti d'aria e umidità"),("Vetro","doppio vetro isolante")]
c.setFont("Helvetica",8.8)
for i,(k,v) in enumerate(spec):
    yy=y-i*5.2*mm
    if i%2==0: c.setFillColor(PANNA); c.rect(M,yy-1.6*mm,W-2*M,5.2*mm,fill=1,stroke=0)
    c.setFillColor(GRIGIO); c.setFont("Helvetica",8.5); c.drawString(M+3*mm,yy,k)
    c.setFillColor(TESTO); c.setFont("Helvetica-Bold",8.8); c.drawString(M+48*mm,yy,v)
y-=len(spec)*5.2*mm+6*mm
y=titolo_sez(y,"Gli infissi, uno per uno")
# drawings grid: 3 per row
cw=(W-2*M-2*6*mm)/3; ch=56*mm
def disegno(x,y0,r,i):
    # cell frame
    c.setStrokeColor(RIGA); c.setLineWidth(0.6); c.rect(x,y0-ch,cw,ch,fill=0,stroke=1)
    c.setFillColor(ORO); c.setFont("Helvetica-Bold",8); c.drawString(x+3*mm,y0-5*mm,f"{i}  ·  {r['t'].upper()}")
    # scale drawing into box
    bw,bh=cw-22*mm,ch-26*mm; s=min(bw/r['w'],bh/r['h'])
    dw,dh=r['w']*s,r['h']*s; dx=x+(cw-dw)/2+3*mm; dy=y0-9*mm-bh+(bh-dh)/2
    c.setStrokeColor(NERO); c.setLineWidth(1.6); c.setFillColor(C(236,242,246)); c.rect(dx,dy,dw,dh,fill=1,stroke=1)
    c.setLineWidth(0.9); c.line(dx+dw/2,dy,dx+dw/2,dy+dh)
    inset=1.6*mm; c.setLineWidth(0.5); c.rect(dx+inset,dy+inset,dw/2-2*inset,dh-2*inset); c.rect(dx+dw/2+inset,dy+inset,dw/2-2*inset,dh-2*inset)
    c.setFillColor(NERO); c.rect(dx+dw/2-2.6*mm,dy+dh/2-0.4*mm,2*mm,0.9*mm,fill=1,stroke=0)
    # dimension lines
    c.setStrokeColor(ORO); c.setLineWidth(0.6); c.setFillColor(TESTO); c.setFont("Helvetica",7.5)
    yb=dy-3*mm; c.line(dx,yb,dx+dw,yb); c.line(dx,yb-1*mm,dx,yb+1*mm); c.line(dx+dw,yb-1*mm,dx+dw,yb+1*mm)
    c.drawCentredString(dx+dw/2,yb-3.6*mm,f"L {num(r['w'],1).replace(',0','')} cm")
    xl=dx-3*mm; c.line(xl,dy,xl,dy+dh); c.line(xl-1*mm,dy,xl+1*mm,dy); c.line(xl-1*mm,dy+dh,xl+1*mm,dy+dh)
    c.saveState(); c.translate(xl-2.4*mm,dy+dh/2); c.rotate(90); c.drawCentredString(0,0,f"H {num(r['h'],1).replace(',0','')} cm"); c.restoreState()
    c.setFillColor(GRIGIO); c.setFont("Helvetica",7.8); c.drawString(x+3*mm,y0-ch+4*mm,f"{num(r['a'])} m²")
    c.setFillColor(TESTO); c.setFont("Helvetica-Bold",10); c.drawRightString(x+cw-3*mm,y0-ch+4*mm,eur(r['pr']))
for i,r in enumerate(rows[:3]):
    disegno(M+i*(cw+6*mm),y,r,i+1)
y-=ch+5*mm
for i,r in enumerate(rows[3:]):
    disegno(M+i*(cw+6*mm),y,r,i+4)
x3=M+2*(cw+6*mm); c.setFillColor(PANNA); c.rect(x3,y-ch,cw,ch,fill=1,stroke=0)
c.setFillColor(TESTO); c.setFont("Helvetica-Bold",9); c.drawString(x3+4*mm,y-8*mm,"Totale infissi")
c.setFont("Helvetica-Bold",15); c.setFillColor(ORO); c.drawString(x3+4*mm,y-17*mm,eur(TI))
c.setFont("Helvetica",8); c.setFillColor(GRIGIO)
for j,l in enumerate(["5 infissi Rehau Synego bianco","con doppio vetro.","Demolizione e posa a parte:","vedi pagina 2.","Prezzi IVA esclusa."]):
    c.drawString(x3+4*mm,y-25*mm-j*4.4*mm,l)
piede(1,2); c.showPage()
# ---------- PAGINA 2 ----------
testata(); y=H-46*mm
y=titolo_sez(y,"Demolizione e posa: costi separati dagli infissi")
c.setFont("Helvetica",8.5); c.setFillColor(GRIGIO)
c.drawString(M,y,"Per ogni infisso: smontaggio e smaltimento del vecchio infisso, e posa del nuovo. Oltre 3,22 m² a pezzo i costi raddoppiano.")
y-=7*mm
# table
cols=[M,M+70*mm,M+100*mm,M+138*mm]
c.setFillColor(NERO); c.rect(M,y-2*mm,W-2*M,7*mm,fill=1,stroke=0)
c.setFillColor(C(243,239,231)); c.setFont("Helvetica-Bold",8.5)
c.drawString(cols[0]+3*mm,y,"Infisso"); c.drawString(cols[1],y,"Misure"); c.drawRightString(cols[3]-4*mm,y,"Demolizione"); c.drawRightString(W-M-3*mm,y,"Posa")
y-=7*mm; c.setFont("Helvetica",8.8)
for i,r in enumerate(rows):
    if i%2==0: c.setFillColor(PANNA); c.rect(M,y-2*mm,W-2*M,6.4*mm,fill=1,stroke=0)
    c.setFillColor(TESTO); c.drawString(cols[0]+3*mm,y,f"{i+1}. {r['t']}")
    c.drawString(cols[1],y,f"{num(r['w'],1).replace(',0','')} × {num(r['h'],1).replace(',0','')} cm")
    c.drawRightString(cols[3]-4*mm,y,eur(r['dem'])); c.drawRightString(W-M-3*mm,y,eur(r['pos'])); y-=6.4*mm
c.setStrokeColor(ORO); c.setLineWidth(0.8); c.line(M,y+3*mm,W-M,y+3*mm)
c.setFont("Helvetica-Bold",9); c.drawString(cols[0]+3*mm,y-1*mm,"Totali"); c.drawRightString(cols[3]-4*mm,y-1*mm,eur(TD)); c.drawRightString(W-M-3*mm,y-1*mm,eur(TP))
y-=14*mm
y=titolo_sez(y,"Riepilogo")
for k,v,b in [("Infissi (5 pezzi)",TI,False),("Demolizione dei vecchi infissi (5 pezzi)",TD,False),("Posa dei nuovi infissi (5 pezzi)",TP,False)]:
    c.setFillColor(TESTO); c.setFont("Helvetica",10); c.drawString(M+3*mm,y,k); c.drawRightString(W-M-3*mm,y,eur(v)); y-=7*mm
y-=4*mm
c.setFillColor(NERO); c.rect(M,y-4*mm,W-2*M,11*mm,fill=1,stroke=0)
c.setFillColor(C(243,239,231)); c.setFont("Helvetica-Bold",11); c.drawString(M+4*mm,y,"TOTALE INDICATIVO")
c.setFillColor(ORO); c.setFont("Helvetica-Bold",14); c.drawRightString(W-M-4*mm,y-0.5*mm,eur(TOT)+" + IVA")
y-=16*mm
y=titolo_sez(y,"Note")
c.setFont("Helvetica",8.3); c.setFillColor(TESTO)
for n in ["Preventivo indicativo calcolato con il listino MD Edil Group in base alle misure indicate. Prezzi IVA esclusa: l'IVA si applica con l'aliquota di legge.",
          "Tapparelle e zanzariere non sono comprese: si possono aggiungere con il simulatore o al sopralluogo.",
          "Il prezzo definitivo viene confermato dopo il sopralluogo gratuito, con le misure prese dai nostri tecnici, e con la firma del contratto.",
          "Per le detrazioni fiscali (bonus ristrutturazione o ecobonus) verifica il tuo caso con il commercialista: forniamo le schede tecniche degli infissi."]:
    from reportlab.lib.utils import simpleSplit
    for l in simpleSplit("•  "+n,"Helvetica",8.3,W-2*M-4*mm):
        c.drawString(M+2*mm,y,l); y-=4.4*mm
    y-=1.5*mm
piede(2,2); c.save()
