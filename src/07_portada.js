// ===================== PORTADA =====================
const OP_ROWS=[
"...kkkk.....",
"..kKKKKk....",
"..kKKKKvv...",
"...sSss.....",
"...sss......",
"..bbbbb.....",
".bbbbbbsKKK.",
".bYYYbbKKKKW",
".bbbbbbb....",
".bbbbbb.....",
"..bbbbb.....",
"..nnnnn.....",
"..gg.gg.....",
"..gg.gg.....",
"..gg..gg....",
"..kk..kk...."];
const OP=sprite(OP_ROWS,{k:'#15171c',K:'#2a2e38',v:'#050505',s:'#c8946a',S:'#a0704e',b:'#1f2f5a',Y:'#ffd23a',n:'#0e0e10',g:'#18223c',W:'#9a9aa8'});
function drawCover(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#04050c');g.addColorStop(0.55,'#0c1430');g.addColorStop(1,'#1c1028');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ui(()=>{
  const L=-UIX,Rx=384+UIX;
  for(let i=0;i<70;i++){const x=L+hash(i,1)*(Rx-L),y=hash(i,2)*92,tw=hash(i,3)>0.8&&(G.t*2+i|0)%7===0;ctx.fillStyle=tw?'#fff':hash(i,4)>0.6?'#aab':'#556';ctx.fillRect(x|0,y|0,1,1);}
  ctx.fillStyle='#d8dcc8';ctx.beginPath();ctx.arc(330,30,11,0,6.283);ctx.fill();ctx.fillStyle='#b8bca8';ctx.fillRect(326,26,3,3);ctx.fillRect(333,33,2,2);ctx.fillRect(331,24,2,1);
  // ciudad lejana
  for(let i=0;i<30;i++){const bw=14+hash(i,11)*26|0,bh=40+hash(i,12)*70|0,x=(L+i*((Rx-L)/24)+hash(i,13)*8)|0,y=150-bh;ctx.fillStyle=i%2?'#0a0f22':'#0d1328';ctx.fillRect(x,y,bw,bh+40);
   for(let wy=0;wy<bh/7-1;wy++)for(let wx=0;wx<bw/5-1;wx++)if(hash(i*13+wx,wy*7)<0.18){ctx.fillStyle=hash(wx,i+wy)<.6?'#b89040':'#5a6a9a';ctx.fillRect(x+3+wx*5,y+4+wy*7,2,3);}}
  // fachada
  const fx=104,fw=176,fy=64,fb=182;
  ctx.fillStyle='#3a2622';ctx.fillRect(fx,fy,fw,fb-fy);
  ctx.fillStyle='#2c1c19';for(let y=fy+4;y<fb;y+=4){ctx.fillRect(fx,y,fw,1);for(let x=fx+((y/4)%2?0:4);x<fx+fw;x+=8)ctx.fillRect(x,y-3,1,3);}
  ctx.fillStyle='#4e3630';ctx.fillRect(fx-4,fy-6,fw+8,6);ctx.fillStyle='#5e463e';ctx.fillRect(fx-4,fy-6,fw+8,1);ctx.fillStyle='#1a100e';ctx.fillRect(fx-4,fy,fw+8,1);
  const win=(x,y,kind)=>{ctx.fillStyle='#1a100e';ctx.fillRect(x-2,y-2,26,24);ctx.fillStyle='#4e3630';ctx.fillRect(x-3,y+20,28,2);
   if(kind===0){ctx.fillStyle='#10182c';ctx.fillRect(x,y,22,20);ctx.fillStyle='#1a2440';ctx.fillRect(x+2,y+2,6,6);}
   else{ctx.fillStyle=kind===2?'#c86a3a':'#e0a848';ctx.fillRect(x,y,22,20);ctx.fillStyle=kind===2?'#e89050':'#f0c070';ctx.fillRect(x+1,y+1,20,4);
    if(kind===2){ctx.fillStyle='#120a08';ctx.beginPath();ctx.arc(x+10,y+9,3,0,6.283);ctx.fill();ctx.fillRect(x+6,y+12,9,8);ctx.fillRect(x+13,y+12,8,2);ctx.fillRect(x+18,y+11,4,1);}
    if(kind===3){ctx.fillStyle='#120a08';ctx.fillRect(x+3,y+14,6,6);ctx.fillRect(x+4,y+11,4,3);}}
   ctx.fillStyle='#1a100e';ctx.fillRect(x+10,y,2,20);ctx.fillRect(x,y+9,22,2);};
  win(120,76,1);win(156,76,0);win(206,76,2);win(242,76,1);win(120,116,0);win(242,116,3);
  // puerta reventada con luz
  const dx=180,dw=26,dy=132;ctx.fillStyle='#1a100e';ctx.fillRect(dx-3,dy-3,dw+6,fb-dy+3);
  const lg=ctx.createLinearGradient(0,dy,0,fb);lg.addColorStop(0,'#ffe2a0');lg.addColorStop(1,'#d89040');ctx.fillStyle=lg;ctx.fillRect(dx,dy,dw,fb-dy);
  ctx.fillStyle='#120a08';ctx.fillRect(dx+12,dy+10,8,26);ctx.beginPath();ctx.arc(dx+16,dy+7,4,0,6.283);ctx.fill();ctx.fillRect(dx+6,dy+16,8,2);
  ctx.save();ctx.translate(dx+dw+2,fb-2);ctx.rotate(-0.55);ctx.fillStyle='#0e0806';ctx.fillRect(-2,-46,8,46);ctx.fillStyle='#6a4428';ctx.fillRect(-1,-45,6,44);ctx.fillStyle='#8a5a30';ctx.fillRect(-1,-45,1,44);ctx.restore();
  ctx.globalAlpha=0.35;const sp=ctx.createLinearGradient(0,fb,0,fb+20);sp.addColorStop(0,'#ffd890');sp.addColorStop(1,'rgba(255,216,144,0)');ctx.fillStyle=sp;ctx.beginPath();ctx.moveTo(dx,fb);ctx.lineTo(dx+dw,fb);ctx.lineTo(dx+dw+22,fb+20);ctx.lineTo(dx-22,fb+20);ctx.fill();ctx.globalAlpha=1;
  for(let i=0;i<10;i++){ctx.fillStyle=hash(i,5)<.5?'#8a5a30':'#5a3a20';ctx.fillRect(dx+dw+4+hash(i,6)*30|0,fb-2-hash(i,7)*30|0,2,1);}
  // acera y calle
  ctx.fillStyle='#4a4a48';ctx.fillRect(L,fb,Rx-L,6);ctx.fillStyle='#5e5e5a';ctx.fillRect(L,fb,Rx-L,1);ctx.fillStyle='#16181c';ctx.fillRect(L,fb+6,Rx-L,60);
  ctx.fillStyle='#8a8670';for(let x=L;x<Rx;x+=24)ctx.fillRect(x|0,205,12,2);
  // coche patrulla
  const cxo=18,cy0=184,ph=(G.t*3|0)%2;
  ctx.fillStyle='#0a0b0e';ctx.fillRect(cxo-1,cy0+3,92,15);ctx.fillRect(cxo+21,cy0-8,48,12);
  ctx.fillStyle='#e8eaf0';ctx.fillRect(cxo,cy0+4,90,13);ctx.fillRect(cxo+22,cy0-7,46,11);
  ctx.fillStyle='#24324e';ctx.fillRect(cxo+25,cy0-5,18,8);ctx.fillRect(cxo+46,cy0-5,19,8);
  ctx.fillStyle='#2a4fb0';ctx.fillRect(cxo,cy0+8,90,6);text('POLICIA',cxo+45,cy0+9,'#ffffff',1,'center',null);
  ctx.fillStyle='#fff6c0';ctx.fillRect(cxo+86,cy0+5,4,3);ctx.fillStyle='#c02020';ctx.fillRect(cxo,cy0+5,3,3);
  ctx.fillStyle=ph?'#ff3030':'#6a1010';ctx.fillRect(cxo+34,cy0-11,10,4);ctx.fillStyle=ph?'#1a2a6a':'#3a6aff';ctx.fillRect(cxo+45,cy0-11,10,4);
  for(const wx of[cxo+16,cxo+72]){ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.arc(wx,cy0+17,7,0,6.283);ctx.fill();ctx.fillStyle='#5a5a60';ctx.beginPath();ctx.arc(wx,cy0+17,3,0,6.283);ctx.fill();}
  // equipo en fila junto a la puerta
  for(let i=0;i<4;i++){const ox=114+i*16;ctx.drawImage(OP,ox,fb-32,24,32);}
  ctx.fillStyle='#0e1014';ctx.fillRect(170,fb-30,6,28);ctx.fillStyle='#2a2e38';ctx.fillRect(171,fb-29,4,26);ctx.fillStyle='#7fb8d8';ctx.fillRect(172,fb-26,2,4);ctx.fillStyle='#e8e8e8';ctx.fillRect(172,fb-16,2,8);
  // cinta policial
  ctx.save();ctx.translate(345,186);ctx.rotate(-0.22);ctx.fillStyle='#0a0a0a';ctx.fillRect(-70,-6,200,11);ctx.fillStyle='#ffd23a';ctx.fillRect(-70,-5,200,9);for(let i=0;i<3;i++)text('POLICIA - NO PASAR',-62+i*76,-2,'#111',1,'left',null);ctx.restore();
  // luces
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=0.55;ctx.drawImage(GL[ph?'r':'b'],cxo+39-70,cy0-9-70,140,140);ctx.globalAlpha=0.3;ctx.drawImage(GL[ph?'b':'r'],cxo+50-90,cy0-9-60,180,120);
  ctx.globalAlpha=0.12;ctx.drawImage(GL[ph?'r':'b'],fx-40,fy,200,140);ctx.drawImage(GL.y,dx-30,dy-10,dw+60,80);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  // logotipo
  const sc=ph?'#a01818':'#1a3aa0';text('BRECHA',192,10,'#f2f4f8',7,'center',sc);
  ctx.fillStyle='#c02020';ctx.fillRect(126,47,66,2);ctx.fillStyle='#2a5aff';ctx.fillRect(192,47,66,2);
  text('UNIDAD DE INTERVENCION POLICIAL',192,52,'#ffd23a',1,'center');
  if(COVER)text('ACCION TACTICA CQB - SOLO O EN EQUIPOS DE 2, 4, 6 Y 8',192,206,'#e8e8f0',1,'center');
 });}
function drawTitleUI(){
 ctx.fillStyle='rgba(4,6,14,0.78)';ctx.fillRect(110,188,164,27);ctx.fillStyle='#2a3a6a';ctx.fillRect(110,188,164,1);
 G.diffRects=[];const dy=191;
 DIFFS.forEach((d,i)=>{const x=114+i*53,sel=i===DFi;ctx.fillStyle=sel?d.c:'#222';ctx.fillRect(x,dy,50,10);ctx.fillStyle=sel?'#000':'#111';ctx.fillRect(x+1,dy+1,48,8);text(d.n,x+25,dy+3,sel?d.c:'#777',1,'center');G.diffRects.push([x,dy,50,10]);});
 if((G.t*2|0)%2)text(TOUCH?'TOCA PARA EMPEZAR':'CLIC / ENTER PARA EMPEZAR',192,205,'#fff',1,'center');
 text(TOUCH?'':'H: CONTROLES   M: SONIDO',4,4,'#7a8aaa',1,'left');
}
