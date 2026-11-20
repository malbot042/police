
const HELP=[['WASD','MOVERSE'],['SHIFT','CAMINAR CON SIGILO (MAS PRECISO)'],['RATON + CLIC','APUNTAR Y DISPARAR'],['ESPACIO','GRITAR ¡POLICIA! (PIDE LA RENDICION)'],['E (MANTENER)','ESPOSAR, ASEGURAR CIVIL, PRUEBAS'],['E / F','ABRIR O CERRAR PUERTA / PATADA'],['G / CLIC DER','GRANADA ATURDIDORA'],['T / Y','EQUIPO TACTICO (ARIETE, CARGA, CAMARA)'],['L','LINTERNA (APAGADA TE VEN MENOS A OSCURAS)'],['1-2 / Q / RUEDA / R','CAMBIAR ARMA / RECARGAR'],['TAB','ELEGIR GRUPO: TODOS, ALFA, BRAVO'],['C','GRUPO: SEGUIR / ESPERAR'],['V','GRUPO: IR AL CURSOR'],['X','GRUPO: APILARSE EN LA PUERTA (OTRA VEZ: METODO)'],['B','¡ADELANTE! TODOS LOS GRUPOS APILADOS ENTRAN'],['P / M / N / Z','PAUSA / SONIDO / MAPA / ZOOM']];
function drawHelp(){ctx.fillStyle='rgba(0,0,0,0.9)';fullRect();text('CONTROLES',192,8,'#ffd23a',2,'center');
 HELP.forEach((l,i)=>{text(l[0],120,24+i*8.6,'#7fe6ff',1,'right');text(l[1],128,24+i*8.6,'#c8d0c0',1,'left');});
 text('MANDO: STICKS MOVER/APUNTAR, RT DISPARAR, A USAR, B GRITAR, X RECARGAR, Y ARMA',192,166,'#9a9ab0',1,'center');text('LT ATURDIDORA, RB PATADA, LB GRUPO, CRUCETA: PILA/YA/IR/SEGUIR',192,174,'#9a9ab0',1,'center');
 text('NO DISPARES A QUIEN SE RINDE NI A CIVILES: PENALIZA',192,190,'#ff9a2a',1,'center');text('CLIC / ESC PARA VOLVER',192,206,'#fff',1,'center');}
function wrap(s,n){const out=[];let line='';for(const w of norm(s).split(' ')){if((line+' '+w).trim().length>n){if(line)out.push(line);line=w;}else line=(line+' '+w).trim();}if(line)out.push(line);return out;}
const GRADEC={S:'#ffd23a',A:'#7dff3a',B:'#7fe6ff',C:'#c8d0c0',D:'#ff5a3a'};
function gridBG(){ctx.fillStyle='#050912';fullRect();ctx.fillStyle='#0b1326';for(let x=-UIX;x<384+UIX;x+=16)ctx.fillRect(x,-UIY,1,216+UIY*2);for(let y=-UIY;y<216+UIY;y+=16)ctx.fillRect(-UIX,y,384+UIX*2,1);}
const chText=M=>['SIN BAJAS PROPIAS NI CIVILES','TODOS LOS SOSPECHOSOS DETENIDOS','TERMINAR EN MENOS DE '+fmtT(M.par)];
function nextUnlock(){const st=totalStars(),l=[[SHIELD_STAR,'ESCUDO BALISTICO']];for(const k in TAC)if(TAC[k].star)l.push([TAC[k].star,TAC[k].n]);l.sort((a,b)=>a[0]-b[0]);return l.find(x=>x[0]>st);}
function drawMenu(){gridBG();
 text('OPERACION MAREA NEGRA',10,6,'#ffd23a',2);text('DIFICULTAD: '+DF.n,374,6,DF.c,1,'right');text('<- -> CAMBIAR',374,14,'#5a6a8a',1,'right');
 const ts=totalStars();star(300,20,true);text(ts+'/24',308,20,'#ffd23a');
 for(let i=0;i<=MISSIONS.length;i++){const y=26+i*18,sel=i===G.sel,m=MISSIONS[i],lock=m&&!unlocked(i);
  ctx.fillStyle=sel?'#1a2a50':'rgba(16,24,44,0.8)';ctx.fillRect(8,y,184,16);if(sel){ctx.fillStyle=i===MISSIONS.length?'#ff9a2a':'#5aa0ff';ctx.fillRect(8,y,2,16);}
  if(!m){text('OPERACION ALEATORIA',22,y+3,sel?'#fff':'#ffb07a');text('INFINITA - RECORDS',22,y+10,'#7a6a5a');text('*',14,y+3,'#ff9a2a');continue;}
  text((i+1)+'',14,y+3,lock?'#3a4a6a':sel?'#ffd23a':'#5a6a8a');text(lock?'BLOQUEADA':m.n,22,y+3,lock?'#3a4a6a':sel?'#fff':'#a8b8d8');
  if(lock)continue;for(let k=0;k<m.squad;k++){ctx.fillStyle=k===0?'#ffd23a':'#4a8ae8';ctx.fillRect(22+k*4,y+10,3,3);}
  m.wpn.forEach((w,j)=>text(WPN[w].s,60+j*6,y+9,WPN[w].c,1,'left',null));if((m.floors||1)>1)text('2P',92,y+9,'#9a9ab0',1,'left',null);
  const sb=starsOf(i);for(let k=0;k<3;k++)star(146+k*7,y+6,sb>>k&1);const b=getBest(i);if(b)text(b.g,189,y+5,GRADEC[b.g],1,'right');}
 const px=198;ctx.fillStyle='rgba(10,16,32,0.92)';ctx.fillRect(px,26,178,162);ctx.fillStyle='#2a3a6a';ctx.fillRect(px,26,178,1);
 if(G.sel<MISSIONS.length){const M=MISSIONS[G.sel],T0=THEMES[M.map],b=getBest(G.sel);
  if(!unlocked(G.sel)){text('MISION BLOQUEADA',px+6,32,'#ff9a6a');wrap('Completa la mision anterior para continuar la investigacion.',42).forEach((l,i)=>text(l,px+6,44+i*7,'#a8b8d8'));}
  else{text(M.n,px+6,31,'#ffd23a');text(T0.n+' - '+(M.squad===1?'EN SOLITARIO':M.squad===2?'CON TU COMPAÑERO':'EQUIPO DE '+M.squad)+((M.floors||1)>1?' - 2 PLANTAS':''),px+6,39,'#7fe6ff');
   let y=49;for(const l of wrap(M.brief,43).slice(0,6)){text(l,px+6,y,'#c8d0c0');y+=7;}
   y+=3;text('SOSPECHOSOS '+M.sus.length+'  CIVILES '+M.civ+(M.ev?'  PRUEBAS '+M.ev:''),px+6,y,'#ff9a8a');y+=9;
   text('DESAFIOS',px+6,y,'#9a9ab0');y+=8;const sb=starsOf(G.sel);chText(M).forEach((c,i)=>{star(px+6,y,sb>>i&1);text(c,px+14,y,sb>>i&1?'#ffd23a':'#8a9ab8');y+=8;});
   y+=2;text(b?'MEJOR: '+b.s+' PUNTOS - RANGO '+b.g:'SIN COMPLETAR',px+6,y,b?GRADEC[b.g]:'#5a6a8a');}}
 else{text('OPERACION ALEATORIA',px+6,31,'#ff9a2a');let y=41;for(const l of wrap('Escenario, equipo y amenazas al azar. Cada operacion superada suma puntos y la siguiente es mas dura. Si caes, se acaba.',43)){text(l,px+6,y,'#c8d0c0');y+=7;}
  y+=4;text('RECORDS - '+DF.n,px+6,y,DF.c);y+=9;const runs=LS.get('runs_'+DFi,[]);if(!runs.length)text('SIN RECORDS TODAVIA',px+6,y,'#5a6a8a');
  runs.slice(0,8).forEach((r,i)=>{text((i+1)+'.',px+10,y+i*8,i?'#a8b8d8':'#ffd23a');text('OP '+r.l,px+30,y+i*8,'#a8b8d8');text(''+r.s,px+170,y+i*8,i?'#c8d0c0':'#ffd23a',1,'right');});}
 const nu=nextUnlock();text(nu?'SIGUIENTE DESBLOQUEO: '+nu[1]+' ('+nu[0]+' ESTRELLAS)':'TODO EL EQUIPO DESBLOQUEADO',192,192,'#7a8aaa',1,'center');
 if((G.t*2|0)%2)text(TOUCH?'TOCA LA MISION ELEGIDA PARA ABRIR EL INFORME':'ENTER / CLIC: INFORME    ESC: VOLVER',192,203,'#fff',1,'center');}
function briefRows(){const M=G.M,lo=G.lo,rows=[];
 rows.push({id:'prim',l:'ARMA PRINCIPAL',v:lo.prim===0?'PISTOLA':WPN[lo.prim].n,opts:primOpts(),key:'prim',d:lo.prim===4?'BLOQUEA DISPAROS DE FRENTE. SOLO PISTOLA Y MAS LENTO':'MAS LA PISTOLA COMO ARMA CORTA'});
 rows.push({id:'voz',l:'AGENTE (TU VOZ)',v:lo.voz==='f'?'MUJER':'HOMBRE',opts:['m','f'],key:'voz',d:'VOZ AL GRITAR Y ASPECTO DE TU AGENTE. EL EQUIPO MEZCLA AGENTES Y AGENTAS'});
 rows.push({id:'t1',l:'TACTICO 1 (T)',v:TAC[lo.t1].n,opts:tacOpts(),key:'t1',d:TAC[lo.t1].d});
 rows.push({id:'t2',l:'TACTICO 2 (Y)',v:TAC[lo.t2].n,opts:tacOpts(),key:'t2',d:TAC[lo.t2].d});
 {const hb=M.squad>=4;rows.push({id:'plan',l:'PLANO Y ENTRADAS (TAB)',v:'ALFA: '+ENTRYN[lo.alfa].split(' (')[0]+(hb?' / BRAVO: '+ENTRYN[lo.bravo].split(' (')[0]:''),d:'ABRE EL PLANO DEL EDIFICIO Y ELIGE POR QUE PUERTA ENTRA CADA GRUPO'});}
 rows.push({id:'go',l:'>> DESPLEGAR',v:'',d:''});return rows;}
function briefChange(r,d){if(!r.opts)return;const lo=G.lo;let i=r.opts.indexOf(lo[r.key]);for(let k=0;k<r.opts.length;k++){i=(i+d+r.opts.length)%r.opts.length;const v=r.opts[i];if((r.key==='t1'&&v!=='none'&&v===lo.t2)||(r.key==='t2'&&v!=='none'&&v===lo.t1))continue;lo[r.key]=v;break;}SFX.sw();}
function updateBrief(){if(pressed['tab']){G.bview=G.bview==='plan'?'info':'plan';SFX.sw();return;}if(G.bview==='plan'){updatePlan();return;}
 const rows=briefRows(),n=rows.length;G.bsel=clamp(G.bsel,0,n-1);if(rows[G.bsel].id==='plan'&&(pressed['enter']||pressed['e']||pressed['d']||pressed['arrowright'])){G.bview='plan';SFX.sw();return;}
 if(pressed['w']||pressed['arrowup']||pressed['padu']){G.bsel=(G.bsel+n-1)%n;SFX.sw();}
 if(pressed['s']||pressed['arrowdown']||pressed['padd']){G.bsel=(G.bsel+1)%n;SFX.sw();}
 if(pressed['a']||pressed['arrowleft']||pressed['padl'])briefChange(rows[G.bsel],-1);
 if(pressed['d']||pressed['arrowright']||pressed['padr'])briefChange(rows[G.bsel],1);
 const mx=vmx(),my=vmy(),ri=Math.floor((my-44)/16);
 if(mx>212&&mx<376&&ri>=0&&ri<n&&my>=44){if(G.mm&&!TOUCH)G.bsel=ri;if(pressed['lmb']){G.bsel=ri;if(rows[ri].id==='go'){deploy();return;}if(rows[ri].id==='plan'){G.bview='plan';SFX.sw();return;}briefChange(rows[ri],1);}}
 else if(pressed['lmb']&&my>196){deploy();return;}
 if(pressed['enter']||pressed[' ']||(pressed['e']&&rows[G.bsel].id==='go')){deploy();return;}
 if(pressed['escape']){G.state='menu';G.run=null;}}
function drawBrief(){gridBG();const M=G.M;
 text(M.idx>=0?'MISION '+(M.idx+1)+': '+M.n:M.n,10,6,'#ffd23a',2);text(DF.n,374,8,DF.c,1,'right');if(G.run)text('PUNTOS '+G.run.score,374,16,'#ffb07a',1,'right');
 ctx.fillStyle='rgba(10,16,32,0.92)';ctx.fillRect(8,26,198,162);ctx.fillStyle='#2a3a6a';ctx.fillRect(8,26,198,1);
 text('INFORME DE LA CENTRAL',14,31,'#7fe6ff');let y=41;for(const l of wrap(M.brief,47)){text(l,14,y,'#c8d0c0');y+=7;}
 y+=4;text(THEMES[M.map].n+((M.floors||1)>1?' - DOS PLANTAS':'')+(M.lot?' - APARCAMIENTO':'')+(M.patio?' - PATIO':''),14,y,'#9ab8e8');y+=8;
 text('SOSPECHOSOS '+M.sus.length+(M.out?' + VIGIAS':'')+'  CIVILES '+M.civ+(M.ev?'  PRUEBAS '+M.ev:''),14,y,'#ff9a8a');y+=8;
 const nA=M.squad>=3?Math.ceil((M.squad-1)/2):M.squad-1;text('EQUIPO: TU'+(nA?' + ALFA ('+nA+')':'')+(M.squad-1-nA>0?' + BRAVO ('+(M.squad-1-nA)+')':''),14,y,'#5aa0ff');y+=10;
 if(M.idx>=0){text('DESAFIOS',14,y,'#9a9ab0');y+=8;const sb=starsOf(M.idx);chText(M).forEach((c,i)=>{star(14,y,sb>>i&1);text(c,22,y,sb>>i&1?'#ffd23a':'#8a9ab8');y+=8;});}
 const rows=briefRows(),px=212;ctx.fillStyle='rgba(10,16,32,0.92)';ctx.fillRect(px-4,26,172,162);ctx.fillStyle='#2a3a6a';ctx.fillRect(px-4,26,172,1);
 text('EQUIPAMIENTO',px,31,'#7fe6ff');
 rows.forEach((r,i)=>{const yy=44+i*16,sel=i===G.bsel;ctx.fillStyle=sel?'#1a2a50':'rgba(16,24,44,0.8)';ctx.fillRect(px,yy,164,14);if(sel){ctx.fillStyle='#5aa0ff';ctx.fillRect(px,yy,2,14);}
  if(r.id==='go'){text(r.l,px+82,yy+4,(G.t*3|0)%2&&sel?'#fff':'#7dff3a',1,'center');return;}
  text(r.l,px+5,yy+1,'#8a9ab8');text((r.opts&&r.opts.length>1?'< ':'')+r.v+(r.opts&&r.opts.length>1?' >':''),px+5,yy+8,sel?'#fff':'#c8d0c0');});
 const r=rows[G.bsel];y=50+rows.length*16;for(const l of wrap(r.d||'',40)){text(l,px,y,'#ffd890');y+=7;}
 const ts=totalStars(),nu=nextUnlock();star(px,174,true);text(ts+'/24 ESTRELLAS',px+8,174,'#ffd23a');if(nu)text('PROXIMO: '+nu[1]+' ('+nu[0]+')',px,182,'#7a8aaa');
 if((G.t*2|0)%2)text(TOUCH?'TOCA DESPLEGAR':'W/S ELEGIR  A/D CAMBIAR  TAB: PLANO  ENTER: DESPLEGAR  ESC: VOLVER',192,200,'#fff',1,'center');}
// ---------- plano del edificio ----------
const BPC=new WeakMap();
function blueprint(L){let c=BPC.get(L);if(c)return c;c=mk(L.w*4,L.h*4);const x=c.getContext('2d');x.fillStyle='#061024';x.fillRect(0,0,c.width,c.height);
 for(let ty=0;ty<L.h;ty++)for(let tx=0;tx<L.w;tx++){const k=ty*L.w+tx,t=L.t[k];let col=null;
  if(t===T.WALL)col='#8ab8f0';else if(t===T.WIN)col='#3ad0ff';else if(t===T.DOOR||t===T.OPEN||t===T.BROKEN)col=L.door.get(k)&&L.door.get(k).armor?'#ff9a2a':'#f4f8ff';else if(t===T.STAIR)col='#ffd23a';else if(t===T.FLOOR||t===T.FURN)col='#0d2348';else if(t===T.OUT)col='#07170f';
  if(col){x.fillStyle=col;x.fillRect(tx*4,ty*4,4,4);}}
 x.fillStyle='rgba(138,184,240,0.08)';for(let i=0;i<c.width;i+=16)x.fillRect(i,0,1,c.height);for(let j=0;j<c.height;j+=16)x.fillRect(0,j,c.width,1);BPC.set(L,c);return c;}
const planGroups=()=>G.M.squad>=4?['A','B']:['A'];
function updatePlan(){const gs=planGroups();if(!gs.includes(G.pg))G.pg='A';const ids=G.entries.map(e=>e.id),key=()=>G.pg==='A'?'alfa':'bravo';
 if(pressed['w']||pressed['arrowup']||pressed['s']||pressed['arrowdown']||pressed['padu']||pressed['padd']){G.pg=gs[(gs.indexOf(G.pg)+1)%gs.length];SFX.sw();}
 const l=pressed['a']||pressed['arrowleft']||pressed['padl'],r=pressed['d']||pressed['arrowright']||pressed['padr'];
 if(l||r){const k=key();G.lo[k]=ids[(ids.indexOf(G.lo[k])+(l?-1:1)+ids.length)%ids.length];G.pf=entryById(G.lo[k]).f;SFX.sw();}
 if(pressed['f']&&LV.length>1){G.pf=1-G.pf;SFX.sw();}
 if(pressed['lmb']){const mx=vmx(),my=vmy();for(const b of G.planBtns||[])if(mx>=b.x&&mx<b.x+b.w&&my>=b.y&&my<b.y+b.h){b.fn();SFX.sw();return;}
  for(const m of G.planMarks||[])if(Math.hypot(mx-m.x,my-m.y)<10){G.lo[key()]=m.id;SFX.ok();return;}if(my>196){deploy();return;}}
 if(pressed['enter']||pressed[' ']){deploy();return;}
 if(pressed['escape'])G.bview='info';}
function drawPlan(){gridBG();const M=G.M,L=LV[G.pf],bw=278,bh=158,x0=8,y0=30,hb=M.squad>=4;
 text('PLANO DEL EDIFICIO',10,7,'#7fe6ff',2);text(LV.length>1?(G.pf?'PRIMERA PLANTA':'PLANTA BAJA'):THEMES[M.map].n,286,10,'#ffd23a',1,'right');
 ctx.fillStyle='#061024';ctx.fillRect(x0-2,y0-2,bw+4,bh+4);ctx.strokeStyle='#2a3a6a';ctx.lineWidth=1;ctx.strokeRect(x0-2.5,y0-2.5,bw+5,bh+5);
 const sc=Math.min(bw/(L.w*TS),bh/(L.h*TS)),w=L.w*TS*sc,h=L.h*TS*sc,ox=x0+(bw-w)/2,oy=y0+(bh-h)/2;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(blueprint(L),ox,oy,w,h);ctx.imageSmoothingEnabled=true;
 for(const r of L.rooms){const fn=RFN[r.fn];if(!fn||fn===RFN.pasillo)continue;const rw=(r.x1-r.x0+1)*TS*sc,nm=fn.n.split(' ')[0];if(rw<nm.length*3.6+4||(r.y1-r.y0+1)*TS*sc<10)continue;
  ctx.globalAlpha=0.55;text(nm,ox+((r.x0+r.x1+1)/2)*TS*sc,oy+((r.y0+r.y1+1)/2)*TS*sc-2,'#8ab8f0',1,'center',null);ctx.globalAlpha=1;}
 G.planMarks=[];
 for(const E of G.entries){if(E.f!==G.pf)continue;const k=E.k,dx=ox+((k%L.w)+0.5)*TS*sc,dy=oy+((k/L.w|0)+0.5)*TS*sc,a=G.lo.alfa===E.id,b=hb&&G.lo.bravo===E.id,cur=(G.pg==='A'?a:b);
  const col=a&&b?'#9a8aff':a?'#4a8ae8':b?'#2ac0c8':'#3a4a6a',pul=cur?1+Math.sin(G.t*6)*0.15:1;
  ctx.fillStyle='rgba(0,0,0,0.6)';ctx.beginPath();ctx.arc(dx,dy,7.5*pul,0,6.2832);ctx.fill();ctx.fillStyle=col;ctx.beginPath();ctx.arc(dx,dy,6*pul,0,6.2832);ctx.fill();
  if(cur){ctx.strokeStyle='#fff';ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(dx,dy,8*pul,0,6.2832);ctx.stroke();}
  text(a&&b?'AB':a?'A':b?'B':'+',dx,dy-2.4,'#fff',1,'center',null);text(ENTRYN[E.id].split(' (')[0],dx,dy+9,(a||b)?'#fff':'#8a9ab8',1,'center');G.planMarks.push({x:dx,y:dy,id:E.id});}
 const px=294;G.planBtns=[];
 ctx.fillStyle='rgba(10,16,32,0.92)';ctx.fillRect(px-2,28,84,162);ctx.fillStyle='#2a3a6a';ctx.fillRect(px-2,28,84,1);
 text('ENTRADAS',px+2,33,'#7fe6ff');let y=44;
 const n=M.squad-1,nA=n>=3?Math.ceil(n/2):n;
 for(const g of planGroups()){const sel=G.pg===g,id=g==='A'?G.lo.alfa:G.lo.bravo;ctx.fillStyle=sel?'#1a2a50':'rgba(16,24,44,0.8)';ctx.fillRect(px,y,80,24);if(sel){ctx.fillStyle=g==='A'?'#4a8ae8':'#2ac0c8';ctx.fillRect(px,y,2,24);}
  text(g==='A'?(n?'ALFA: TU + '+nA:'TU'):'BRAVO: '+(n-nA),px+5,y+3,g==='A'?'#9ab8e8':'#7ae8ee');text('< '+ENTRYN[id].split(' (')[0]+' >',px+5,y+13,sel?'#fff':'#c8d0c0');
  const yy=y;G.planBtns.push({x:px,y:yy,w:80,h:24,fn:()=>{if(G.pg===g){const ids=G.entries.map(e=>e.id),k=g==='A'?'alfa':'bravo';G.lo[k]=ids[(ids.indexOf(G.lo[k])+1)%ids.length];G.pf=entryById(G.lo[k]).f;}else G.pg=g;}});y+=28;}
 if(LV.length>1){for(let f=0;f<2;f++){const bx=px+f*41,sel=G.pf===f;ctx.fillStyle=sel?'#3a3010':'rgba(16,24,44,0.8)';ctx.fillRect(bx,y,39,12);text(f?'PLANTA 1':'BAJA',bx+19.5,y+3.5,sel?'#ffd23a':'#8a9ab8',1,'center');G.planBtns.push({x:bx,y,w:39,h:12,fn:()=>{G.pf=f;}});}y+=17;}
 const note=hb&&G.lo.bravo!==G.lo.alfa?'Bravo empieza apilado en su puerta: en la mision pulsa B para que los dos grupos entren a la vez.':hb?'Los dos grupos entran juntos. Asigna otra puerta a Bravo para atacar por dos lados.':'Elige por donde entrais.';
 for(const l of wrap(note,19)){text(l,px+2,y,'#ffd890');y+=7;}y+=3;
 for(const[c,t]of[['#f4f8ff','PUERTA'],['#ff9a2a','BLINDADA'],['#3ad0ff','VENTANA'],['#ffd23a','ESCALERA']]){if(y>182)break;ctx.fillStyle=c;ctx.fillRect(px+2,y+0.5,4,4);text(t,px+9,y,'#8a9ab8');y+=7;}
 if((G.t*2|0)%2)text(TOUCH?'TOCA UNA PUERTA PARA ASIGNARLA - TOCA AQUI PARA DESPLEGAR':'CLIC EN UNA PUERTA: ASIGNAR   W/S GRUPO   A/D PUERTA   TAB: INFORME   ENTER: DESPLEGAR',192,200,'#fff',1,'center');}
const EVC={arr:'#7dff3a',kill:'#ff3a3a',unj:'#ff9a2a',civ:'#7fe6ff',civk:'#ffffff',down:'#5aa0ff',ev:'#ffd23a'};
function drawReplay(x0,y0,bw,bh){const L=LV[G.rmapF||0];if(!L)return;const s=Math.min(bw/(L.w*TS),bh/(L.h*TS)),w=L.w*TS*s,h=L.h*TS*s,ox=x0+(bw-w)/2,oy=y0+(bh-h)/2;
 ctx.imageSmoothingEnabled=true;ctx.drawImage(L.base,ox,oy,w,h);ctx.drawImage(L.decal,ox,oy,w,h);ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(ox,oy,w,h);
 ctx.strokeStyle='#2a3a6a';ctx.strokeRect(Math.round(ox)-0.5,Math.round(oy)-0.5,Math.round(w)+1,Math.round(h)+1);
 const shown=Math.floor(G.debT*12);G.events.filter(e=>e.f===(G.rmapF||0)).slice(0,shown).forEach(e=>{const x=Math.round(ox+e.x*s),y=Math.round(oy+e.y*s),c=EVC[e.t];ctx.fillStyle=c;
  if(e.t==='arr'||e.t==='ev'||e.t==='civ'){ctx.fillRect(x-1,y-1,3,3);}else{ctx.fillRect(x-2,y-2,1,1);ctx.fillRect(x-1,y-1,1,1);ctx.fillRect(x,y,1,1);ctx.fillRect(x+1,y+1,1,1);ctx.fillRect(x+2,y+2,1,1);ctx.fillRect(x+2,y-2,1,1);ctx.fillRect(x+1,y-1,1,1);ctx.fillRect(x-1,y+1,1,1);ctx.fillRect(x-2,y+2,1,1);}
  if((e.t==='arr'||e.t==='kill'||e.t==='unj')&&e.by&&e.by!=='?')text(e.by,x+3,y-2,c,1,'left','#000');});
 if(LV.length>1)text((G.rmapF?'PLANTA 1':'PLANTA BAJA')+'  (<- -> CAMBIAR)',x0+bw/2,y0-8,'#ffd23a',1,'center');}
function drawDebrief(){const R=G.res,a=Math.min(1,G.debT*2);ctx.fillStyle=`rgba(2,6,14,${0.9*a})`;fullRect();
 text('INFORME DE LA OPERACION',192,6,'#7dff3a',2,'center');text(G.M.n+' - '+DF.n,192,22,'#c8d0c0',1,'center');
 const shown=Math.floor(G.debT*6);R.lines.slice(0,shown).forEach((l,i)=>{const y=34+i*8;text(l[0],8,y,l[1]<0?'#ff7a6a':'#c8d0c0');text((l[1]>0?'+':'')+l[1],196,y,l[1]<0?'#ff5a3a':'#7dff3a',1,'right');});
 let y=38+R.lines.length*8;
 if(shown>R.lines.length){ctx.fillStyle='#2a3a6a';ctx.fillRect(8,y-3,188,1);text('TOTAL'+(DF.score!==1?' (X'+DF.score+')':''),8,y,'#fff');text(''+R.total,196,y,'#ffd23a',1,'right');
  text(R.grade,170,y+10,GRADEC[R.grade],3,'center');text('RANGO',140,y+14,'#9a9ab0',1,'right');if(R.rec&&(G.t*3|0)%2)text('¡RECORD!',8,y+12,'#ffd23a');
  y+=28;if(G.M.idx>=0){R.ch.forEach((c,i)=>{star(8,y,c);text(chText(G.M)[i],16,y,c?'#ffd23a':'#6a7a9a');y+=8;});}
  else text('OPERACIONES: '+G.run.lvl+'   PUNTOS TOTALES: '+G.run.score,8,y,'#ffb07a');
  if(R.unl.length&&(G.t*2|0)%2)text('¡DESBLOQUEADO: '+R.unl.join(', ')+'!',8,y+2,'#7dff3a');}
 drawReplay(204,40,172,130);
 text('DETENIDO',206,176,EVC.arr);text('ABATIDO',246,176,EVC.kill);text('INJUSTIF.',282,176,EVC.unj);text('CIVIL',326,176,EVC.civ);text('BAJA',352,176,EVC.down);
 if(G.M.epi&&G.debT>1.5){const l=wrap('CENTRAL: '+G.M.epi,94);l.forEach((s,i)=>text(s,192,186+i*7,'#7fe6ff',1,'center'));}
 if(G.debT>1&&(G.t*2|0)%2)text(TOUCH?'TOCA: CONTINUAR':(G.M.idx>=0?'ENTER: SIGUIENTE   R: REPETIR   ESC: MENU':'ENTER: SIGUIENTE OPERACION   ESC: MENU'),192,206,'#fff',1,'center');}
function drawFail(){const a=Math.min(1,G.debT*2);ctx.fillStyle=`rgba(20,0,0,${0.75*a})`;fullRect();
 text('MISION FRACASADA',192,60,'#ff3a3a',3,'center');text('HAS CAIDO EN ACTO DE SERVICIO',192,88,'#e8d0d0',1,'center');
 text('DETENIDOS '+G.stats.arr+'   NEUTRALIZADOS '+G.stats.neu+'   CIVILES '+G.stats.civ,192,102,'#c8a0a0',1,'center');
 if(G.runEnd){text('OPERACION ALEATORIA TERMINADA',192,120,'#ffb07a',1,'center');text('OPERACIONES SUPERADAS: '+(G.runEnd.l-1)+'   PUNTOS: '+G.runEnd.s,192,130,'#ffd23a',1,'center');if(G.runEnd.top&&(G.t*3|0)%2)text('¡NUEVO RECORD!',192,140,'#7dff3a',1,'center');}
 if(G.debT>1&&(G.t*2|0)%2)text(TOUCH?'TOCA PARA CONTINUAR':G.runEnd?'ENTER: NUEVA OPERACION   ESC: MENU':'ENTER / R: REINTENTAR   ESC: MENU',192,160,'#fff',1,'center');}
function drawPause(){ctx.fillStyle='rgba(0,0,0,0.7)';fullRect();text('PAUSA',192,20,'#7fe6ff',4,'center');
 text(TOUCH?'TOCA PARA CONTINUAR':'P / ESC: CONTINUAR   ENTER: ABANDONAR',192,50,'#fff',1,'center');
 text('M SONIDO: '+(AU.on?'SI':'NO')+'   Z ZOOM: '+ZOOMS[ZI][2]+'   N MAPA   K FILTRO CRT: '+(CRT?'SI':'NO'),192,60,'#c8d0c0',1,'center');
 HELP.forEach((l,i)=>{text(l[0],140,74+i*8,'#7fe6ff',1,'right');text(l[1],148,74+i*8,'#a8b8d8');});}
function rotateHint(){if(TOUCH&&innerHeight>innerWidth*1.05){ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,W,H);text('GIRA EL MOVIL',W/2,H/2-10,'#ffd23a',3,'center');text('SE JUEGA EN HORIZONTAL',W/2,H/2+14,'#c8d0c0',1,'center');}}
function render(){
 ctx.setTransform(RS,0,0,RS,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 if(G.state==='title'){drawCover();if(!COVER)ui(drawTitleUI);if(G.help)ui(drawHelp);rotateHint();return;}
 if(G.state==='menu'){ui(drawMenu);rotateHint();return;}
 if(G.state==='brief'){ui(G.bview==='plan'?drawPlan:drawBrief);rotateHint();return;}
 drawWorld();drawHUD();
 if(G.state==='pause')ui(drawPause);if(G.state==='debrief')ui(drawDebrief);if(G.state==='fail')ui(drawFail);rotateHint();}
