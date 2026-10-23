// Esempi di costo per la guida /quanto-costa-ristrutturare-casa-roma (23/10/2026), con i prezzi di js/ristrutturazione.js.
// Uso: node progetto/strumenti/esempi_costi_casa.js x   (x = mostra le voci). Ipotesi: 2° piano, fuori centro, ristrutturazione completa.
const fs=require('fs');let cfg;const window={MDSimulatore:c=>cfg=c};
new Function('window','atob',fs.readFileSync('js/ristrutturazione.js','utf8'))(window,s=>Buffer.from(s,'base64').toString('binary'));
const num=v=>parseFloat(String(v||'').replace(',','.'))||0;
function sim(mq,q){const c={mq,q,num,dom:{},area:{},sel:{}};let tot=0,lav=0,righe=[];
 cfg.sezioni.forEach(s=>s.v.forEach(it=>{let v=0;
  if(it.tipo==='si'){if(q[it.id]==='si')v=it.f?it.f(c):it.p}
  else if(q[it.id]){const n=num(q[it.id]);v=it.f?it.f(n,c,0):n*it.p}
  if(v){righe.push([s.t,it.d,q[it.id],Math.round(v*100)/100]);tot+=v}}));return {tot,righe}}
function scen(X,nb,nt,np,nr){const pav=X-5*nb;return {
 pavMas:X,demTra:nt,demPor:np,demRad:nr,demZoc:X,disEl:'si',disId:'si',
 bagno:nb,tramez:nt,massNu:pav,punti:X,quadro:'si',centr:1,radiat:nr,pAcqua:1,gasCuc:1,
 posPav:pav,posRiv:4,posZoc:X,porBat:np,raschi:Math.round(3.5*pav),rasat:Math.round(3.5*pav),levig:Math.round(3.5*pav),pitChi:Math.round(3.5*pav),
 sicur:'si',tiro:'si',pulizia:X,proget:'si'}}
for(const [X,nb,nt,np,nr] of [[50,1,10,4,4],[70,1,15,6,6],[100,2,20,8,8]]){const r=sim(X,scen(X,nb,nt,np,nr));
 const prog=r.righe.filter(x=>x[1].startsWith('Progetto')).reduce((a,x)=>a+x[3],0);
 console.log('\n== '+X+' m²: totale',r.tot.toFixed(2),'| €/m²',(r.tot/X).toFixed(0),'| senza progetto',(r.tot-prog).toFixed(0),(((r.tot-prog)/X)).toFixed(0));
 if(process.argv[2])r.righe.forEach(x=>console.log('  ',x[1],'|',x[2],'|',x[3]));}
