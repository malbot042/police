// ===================== DATOS DE JUEGO =====================
const G={state:'title',t:0,frame:0,shake:0,camx:0,camy:0,kaim:0,mi:0,sel:0,radio:[],msgT:0,inten:0,blind:0,hurtFlash:0,noMap:false,time:0,selG:'T',bsel:0,dsel:0,events:[]};
const DIFFS=[
 {n:'FACIL',c:'#7dff3a',dmg:0.55,react:1.35,acc:1.35,surr:1.25,fake:0,flash:4,score:0.75,d:'REACCIONAN DESPACIO Y SE RINDEN ANTES'},
 {n:'MEDIO',c:'#ffd23a',dmg:1,react:1,acc:1,surr:1,fake:0.12,flash:3,score:1,d:'LA EXPERIENCIA EQUILIBRADA'},
 {n:'DIFICIL',c:'#ff3a3a',dmg:1.4,react:0.7,acc:0.75,surr:0.8,fake:0.3,flash:2,score:1.5,d:'REACCIONAN RAPIDO Y FINGEN RENDIRSE. PUNTOS X1.5'}];
let DFi=1;try{const v=parseInt(localStorage.getItem('brecha_diff'));if(v>=0&&v<3)DFi=v;}catch(e){}
let DF=DIFFS[DFi];
const LS={get(k,d){try{const v=localStorage.getItem('brecha_'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem('brecha_'+k,JSON.stringify(v));}catch(e){}}};
function setDiff(i){DFi=clamp(i,0,2);DF=DIFFS[DFi];LS.set('diff',DFi);}
const getBest=i=>{const v=LS.get('best_'+DFi+'_'+i,null);return v&&typeof v.s==='number'?v:null;};
const setBest=(i,v)=>LS.set('best_'+DFi+'_'+i,v);
const starsOf=i=>LS.get('st_'+i,0)|0;
function totalStars(){let n=0;for(let i=0;i<MISSIONS.length;i++){const m=starsOf(i);n+=(m&1)+(m>>1&1)+(m>>2&1);}return n;}
const doneOf=i=>!!LS.get('done_'+i,0);
const unlocked=i=>i<=0||doneOf(i-1);
const WPN=[
 {n:'PISTOLA',s:'P',c:'#e8e0c0',mag:15,res:4,dmg:34,rof:0.17,spr:0.035,sp:640,rel:1.1,snd:'pistol',kind:'pistol',kick:1.5,shake:1.2},
 {n:'SUBFUSIL',s:'S',c:'#7fe6ff',mag:30,res:4,dmg:22,rof:0.075,spr:0.06,sp:660,rel:1.5,snd:'smg',kind:'long',kick:1.2,shake:1.2},
 {n:'FUSIL',s:'F',c:'#7dff3a',mag:30,res:3,dmg:44,rof:0.11,spr:0.022,sp:800,rel:1.8,snd:'rifle',kind:'rifle',kick:2.2,pierce:1,shake:2},
 {n:'ESCOPETA',s:'E',c:'#ff9a2a',mag:7,res:21,dmg:14,pel:8,rof:0.6,spr:0.2,sp:560,rel:0.42,shell:true,snd:'shotgun',kind:'shotgun',kick:5,shake:4},
 {n:'ESCUDO + PISTOLA',s:'B',c:'#c8d0e0',mag:15,res:4,dmg:34,rof:0.22,spr:0.06,sp:640,rel:1.3,snd:'pistol',kind:'shield',kick:1.5,shake:1.2,shield:true}];
const TAC={
 none:{n:'NINGUNO',d:'SIN EQUIPO TACTICO',star:0},
 cam:{n:'CAMARA DE PUERTA',d:'MIRA BAJO UNA PUERTA CERRADA DURANTE 4 S',star:4},
 ram:{n:'ARIETE',d:'ABRE CUALQUIER PUERTA, TAMBIEN LAS BLINDADAS',star:6},
 c4:{n:'CARGA EXPLOSIVA X2',d:'REVIENTA LA PUERTA Y ATURDE A TODA LA SALA',star:9},
 flash:{n:'ATURDIDORAS +2',d:'DOS GRANADAS ATURDIDORAS MAS',star:12}};
const SHIELD_STAR=2;
const STYPE={
 desarmado:{arm:false,hp:80,surr:0.85,kind:'unarmed'},
 pistola:{arm:true,hp:100,surr:0.45,dmg:13,rof:0.5,burst:1,spr:0.1,sp:540,kind:'pistol'},
 subfusil:{arm:true,hp:100,surr:0.35,dmg:8,rof:0.085,burst:5,gap:0.85,spr:0.13,sp:560,kind:'long'},
 escopeta:{arm:true,hp:110,surr:0.3,dmg:7,pel:6,rof:1.2,burst:1,spr:0.28,sp:480,kind:'shotgun'},
 fusil:{arm:true,hp:120,surr:0.22,dmg:12,rof:0.12,burst:3,gap:0.65,spr:0.07,sp:700,kind:'rifle'}};
const MISSIONS=[
 {n:'ORDEN DE DETENCION',map:'piso',squad:1,wpn:[0],w:28,h:23,min:3,maxA:26,loops:1,lock:0.1,win:0.2,sus:['desarmado','pistola','pistola'],civ:1,ev:0,
  brief:'Hace dos semanas atracaron una joyeria del centro. Las huellas apuntan a Toni el Rubio, que se esconde en el piso de su hermano. Entra solo, identificate y detenlo vivo: queremos saber para quien trabaja.',
  epi:'El Rubio habla: las joyas se cambiaron por droga en un narcopiso del barrio norte.'},
 {n:'NARCOPISO',map:'piso',squad:2,wpn:[0,3],w:32,h:24,min:3,maxA:28,loops:2,lock:0.2,win:0.18,sus:['desarmado','desarmado','pistola','pistola','escopeta'],civ:2,ev:2,
  brief:'El piso que señalo el Rubio vende droga dia y noche. Entra con tu compañero, asegura la mercancia y la contabilidad. Puede haber clientes dentro.',
  epi:'La contabilidad apunta a un desguace que blanquea coches robados y vende armas a la banda.'},
 {n:'TALLER CLANDESTINO',map:'nave',squad:4,wpn:[0,1],w:40,h:34,min:4,maxA:48,loops:3,lock:0.2,win:0.12,lot:1,out:1,sus:['pistola','pistola','subfusil','escopeta','desarmado','desarmado','pistola'],civ:3,ev:2,
  brief:'El desguace abastece de armas a la banda. Equipo de cuatro: divide en Alfa y Bravo y entrad por dos puertas a la vez. Hay trabajadores que no saben nada y un vigia fuera.',
  epi:'Entre los papeles del taller aparece un plan: un atraco al Banco Central esta misma semana.'},
 {n:'ATRACO AL BANCO',map:'banco',squad:6,wpn:[0,2,3],w:40,h:30,min:4,maxA:60,loops:3,lock:0.25,win:0.1,host:1,sus:['fusil','fusil','subfusil','subfusil','pistola','pistola','escopeta','fusil'],civ:7,ev:1,
  brief:'Llegamos tarde: la banda esta dentro de la sucursal con rehenes. La camara acorazada esta blindada: tus compañeros llevan cargas, o usa el ariete. Recupera el botin y libera a los rehenes.',
  epi:'Un atracador detenido confiesa: el dinero iba al club Neon, la tapadera del cartel.'},
 {n:'FIESTA EN EL CLUB',map:'club',squad:4,wpn:[0,1],w:38,h:28,min:4,maxA:60,loops:3,lock:0.15,win:0.05,sus:['pistola','pistola','subfusil','desarmado','desarmado','pistola','escopeta'],civ:9,ev:1,
  brief:'El club Neon esta lleno de clientes y los hombres del cartel van armados. Identifica antes de disparar: aqui un error cuesta vidas.',
  epi:'En la sala VIP hay facturas de productos quimicos para un laboratorio en las afueras.'},
 {n:'LABORATORIO DE DROGA',map:'lab',squad:2,wpn:[0,1,3],w:36,h:34,min:3,maxA:34,loops:2,lock:0.3,win:0.1,lot:1,patio:1,out:1,sus:['escopeta','pistola','subfusil','desarmado','pistola','escopeta','desarmado'],civ:1,ev:3,
  brief:'Un narcolaboratorio en una nave aislada con patio y aparcamiento. Solo dos agentes para no levantar sospechas. Asegura todas las pruebas.',
  epi:'Las pruebas llevan a un nombre: Salvador Ferro, el Capo.'},
 {n:'MANSION DEL CAPO',map:'mansion',squad:6,wpn:[0,1,2,3],w:44,h:32,min:4,maxA:45,loops:4,lock:0.25,win:0.18,floors:2,patio:1,out:1,boss:1,sus:['fusil','subfusil','pistola','pistola','escopeta','fusil','subfusil','desarmado','pistola','escopeta','fusil','pistola'],civ:3,host:1,ev:2,
  brief:'Ferro se refugia en su mansion de dos plantas con su escolta. Lo queremos vivo para el juicio. Bravo puede descolgarse desde la azotea mientras Alfa entra por abajo.',
  epi:'Ferro negocia con la fiscalia: el ultimo cargamento llega esta noche al puerto, con rehenes como seguro.'},
 {n:'ALMACEN PORTUARIO',map:'puerto',squad:8,wpn:[0,1,2,3],w:50,h:40,min:5,maxA:70,loops:5,lock:0.25,win:0.08,floors:2,lot:1,out:2,host:1,sus:['fusil','fusil','subfusil','subfusil','escopeta','escopeta','pistola','pistola','pistola','fusil','subfusil','desarmado','desarmado','fusil'],civ:4,ev:3,
  brief:'La operacion mas grande del año: ocho agentes, dos plantas, contenedores y rehenes. Acabemos con Marea Negra.',
  epi:'Operacion Marea Negra cerrada. Enhorabuena, agente.'}];
MISSIONS.forEach((m,i)=>{m.idx=i;m.par=45+m.sus.length*14+((m.floors||1)>1?60:0);});
function randMission(lvl){const R=Math.random,maps=Object.keys(THEMES),map=pick(maps),squad=pick(lvl<2?[1,2,2]:[1,2,2,4,4,6,8]);
 const types=['desarmado','pistola','pistola','subfusil','escopeta','fusil'],ns=Math.min(16,2+lvl+Math.floor(squad/2)+(R()*2|0)),sus=[];
 for(let i=0;i<ns;i++)sus.push(types[Math.floor(R()*Math.min(types.length,2+lvl))]);
 const floors=lvl>=3&&squad>=4&&R()<0.45?2:1,big=Math.min(1,ns/14);
 const wpn=[0];for(const w of[1,2,3])if(R()<0.5)wpn.push(w);if(squad>1&&wpn.length===1)wpn.push(1+(R()*3|0));
 const lot=R()<0.4;const M={n:'OPERACION '+lvl,map,squad,wpn,w:28+Math.round(big*20),h:23+Math.round(big*10)+(lot?4:0),min:map==='piso'?3:4,maxA:30+big*30,loops:2+(big*3|0),lock:0.2,win:0.12,
  lot,patio:R()<0.3,out:R()<0.4?1:0,floors,host:R()<0.35,boss:false,sus,civ:Math.round(R()*(2+ns/2)),ev:R()*3|0,idx:-1,
  brief:'Operacion '+lvl+' de la unidad: '+THEMES[map].n+' con '+ns+' sospechosos'+(floors>1?' en dos plantas':'')+'. '+(squad===1?'Entras solo.':'Equipo de '+squad+'.')+' Cada operacion superada es mas dificil que la anterior.',epi:''};
 M.par=45+ns*14+(floors>1?60:0);return M;}
const SHOUTS=['¡Policía!|¡Al suelo!','¡Policía!|¡Manos arriba!','¡Suelta el arma!|¡Policía!','¡Policía!|¡No te muevas!','¡Policía!|¡Las manos donde pueda verlas!'];

// ===================== ENTIDADES Y PLANTAS =====================
let LV=[],ALLA=[],ALLS=[],ALLC=[];
let P=null,agents=[],sus=[],civs=[],items=[],bullets=[],parts=[],nades=[],popups=[],flashes=[],smoke=[];
let flowP=null,flowX=null,flowS=null;
function useLevel(f){const L=LV[f];world=L;agents=ALLA.filter(e=>e.f===f);sus=ALLS.filter(e=>e.f===f);civs=ALLC.filter(e=>e.f===f);items=L.items;bullets=L.bullets;nades=L.nades;parts=L.parts;popups=L.popups;flashes=L.flashes;smoke=L.smoke;flowP=L.flowP;flowX=L.flowX;flowS=L.flowS;}
function saveLevel(){const L=world;L.items=items;L.bullets=bullets;L.nades=nades;L.parts=parts;L.popups=popups;L.flashes=flashes;L.smoke=smoke;}
function radio(txt,c='#c8d0c0'){G.radio.unshift({txt,c,t:5});if(G.radio.length>5)G.radio.length=5;}
function popup(x,y,txt,c){popups.push({x,y,txt,c,life:1.1});}
function newChar(kind,cx,cy,f){return{kind,f:f||0,x:cx-5,y:cy-5,w:10,h:10,vx:0,vy:0,ang:-Math.PI/2,hp:100,max:100,anim:0,flash:0,stun:0,push:0,pushK:-1,vis:false,dead:false,cd:0,mflash:0,shoutCd:0,seed:Math.random()*99};}
const ctr=e=>[e.x+5,e.y+5];
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const tkey=e=>clamp((e.y+5)/TS|0,0,world.h-1)*world.w+clamp((e.x+5)/TS|0,0,world.w-1);
const who=e=>e===P?'TU':e&&e.short?e.short:'?';
function logEv(t,e,by){const[x,y]=ctr(e);G.events.push({t,x,y,f:e.f,by:who(by)});}

// ===================== COLISIONES =====================
function blockAt(x,y,w,h){const x0=Math.floor(x/TS),x1=Math.floor((x+w-0.01)/TS),y0=Math.floor(y/TS),y1=Math.floor((y+h-0.01)/TS);
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){if(tx<0||ty<0||tx>=world.w||ty>=world.h)return -2;if(!walkT(world.t[ty*world.w+tx]))return ty*world.w+tx;}return -1;}
function moveBox(e,dx,dy){let hit=-1;
 if(dx){const b=blockAt(e.x+dx,e.y,e.w,e.h);if(b===-1)e.x+=dx;else{hit=b;let done=false;for(let s=1;s<=6&&!done;s++)for(const o of[1,-1])if(blockAt(e.x+dx,e.y+o*s,e.w,e.h)===-1&&blockAt(e.x,e.y+o*s,e.w,e.h)===-1){e.y+=o*Math.min(s,Math.abs(dx)+0.4);done=true;break;}}}
 if(dy){const b=blockAt(e.x,e.y+dy,e.w,e.h);if(b===-1)e.y+=dy;else{hit=b;let done=false;for(let s=1;s<=6&&!done;s++)for(const o of[1,-1])if(blockAt(e.x+o*s,e.y+dy,e.w,e.h)===-1&&blockAt(e.x+o*s,e.y,e.w,e.h)===-1){e.x+=o*Math.min(s,Math.abs(dy)+0.4);done=true;break;}}}
 return hit;}
function moveChar(e,dt){const h=moveBox(e,e.vx*dt,e.vy*dt);
 if(h>=0&&world.t[h]===T.DOOR){if(e.pushK!==h){e.pushK=h;e.push=0;}e.push+=dt;const D=world.door.get(h);
  if(D&&D.lock&&e.kind!=='sus'){if(e===P)G.lockHint=0.3;else if(e.kind==='agent'&&e.push>0.7&&!e.grpDoor){if(D.armor){if(!c4At(h))plantC4(h,e);}else kickDoor(h,e);}}
  else if(e.push>(e.kind==='sus'?0.35:e.kind==='civ'?0.5:0.12))openDoor(h,e);}
 else{e.pushK=-1;e.push=0;}
 checkStairs(e);}
function checkStairs(e){const t=world.t[tkey(e)];if(t!==T.STAIR){e.onSt=false;return;}if(e.onSt||LV.length<2)return;e.onSt=true;
 const want=e===P||(e.kind==='agent'&&e.goF!==undefined&&e.goF!==e.f)||(e.kind==='civ'&&e.st==='safe'&&e.f>0);
 if(want){e.f=1-e.f;e.vx*=0.3;e.vy*=0.3;SFX.stairs();if(e===P){G.floorMsg=2;radio(e.f?'PRIMERA PLANTA':'PLANTA BAJA','#7fe6ff');}}}
function losO(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/5);for(let i=1;i<n;i++){const t=i/n;if(opaqueT(tget(Math.floor((x0+(x1-x0)*t)/TS),Math.floor((y0+(y1-y0)*t)/TS))))return false;}return true;}
const DIRS8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function flowStep(e,f,away){if(!f)return null;const cx=e.x+5,cy=e.y+5,tx=cx/TS|0,ty=cy/TS|0,w=world.w,d0=f[ty*w+tx];
 if(d0<0)return null;if(d0===0&&!away){const gx=(tx+0.5)*TS,gy=(ty+0.5)*TS,l=Math.hypot(gx-cx,gy-cy);return l>2?[(gx-cx)/l,(gy-cy)/l]:null;}
 let best=d0,bx=-1,by=-1;
 for(const[dx,dy]of DIRS8){const nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=w||ny>=world.h)continue;const v=f[ny*w+nx];if(v<0)continue;
  if(away?v<=best:v>=best)continue;if(dx&&dy&&(f[ty*w+nx]<0||f[(ty+dy)*w+tx]<0||!pathT(world.t[ty*w+nx])||!pathT(world.t[(ty+dy)*w+tx])))continue;best=v;bx=nx;by=ny;}
 if(bx<0)return null;const gx=(bx+0.5)*TS,gy=(by+0.5)*TS,l=Math.hypot(gx-cx,gy-cy)||1;return[(gx-cx)/l,(gy-cy)/l];}
function steer(e,dir,spd,dt){const k=Math.min(1,dt*10);const tx=dir?dir[0]*spd:0,ty=dir?dir[1]*spd:0;e.vx+=(tx-e.vx)*k;e.vy+=(ty-e.vy)*k;moveChar(e,dt);if(dir)e.anim+=dt*spd/9;stepSound(e,dt);}
function stepSound(e,dt){const v=Math.hypot(e.vx,e.vy);if(v<12){e.stepD=8;return;}e.stepD=(e.stepD||0)+v*dt;if(e.stepD<15)return;e.stepD=0;if(e===P){if(AU.ctx)SFX.step(v<55?0.45:0.8);return;}if(!P||e.f!==P.f||dist(e,P)>260)return;sfxAt('step',e.x+5,e.y+5,e.kind==='sus'?1:0.7);}
const flowAt=(f,e)=>f?f[tkey(e)]:-1;

// ===================== PUERTAS =====================
function doorCenter(k){return[(k%world.w+0.5)*TS,((k/world.w|0)+0.5)*TS];}
function doorSide(k,e){const D=world.door.get(k),[dx,dy]=doorCenter(k);return D.o==='h'?(e.y+5<dy?-1:1):(e.x+5<dx?-1:1);}
function openDoor(k,e){if(world.t[k]!==T.DOOR)return;world.t[k]=T.OPEN;const D=world.door.get(k),[dx,dy]=doorCenter(k);if(D)D.side=-doorSide(k,e);sfxAt('door',dx,dy);noise(dx,dy,90);}
function closeDoor(k){if(world.t[k]!==T.OPEN)return false;const tx=k%world.w,ty=k/world.w|0,r={x:tx*TS,y:ty*TS,w:TS,h:TS};
 for(const c of agents.concat(sus,civs))if(!c.dead&&!c.gone&&c.x<r.x+r.w&&c.x+c.w>r.x&&c.y<r.y+r.h&&c.y+c.h>r.y)return false;world.t[k]=T.DOOR;sfxAt('close',(tx+0.5)*TS,(ty+0.5)*TS);return true;}
function breakDoor(k,e,stunR,stunT){world.t[k]=T.BROKEN;const D=world.door.get(k),[dx,dy]=doorCenter(k);smokeAt(dx,dy,5,{r:[3,6],life:[1.2,2],col:'#7a6a58',a:0.4,sp:18,grow:4});if(D){D.side=e?-doorSide(k,e):1;D.lock=false;D.armor=false;}
 G.shake=Math.max(G.shake,3);for(let i=0;i<14;i++){const a=rand(0,6.283),s=rand(30,120);parts.push({x:dx,y:dy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(0.3,0.7),max:0.7,c:pick(['#8a5a30','#5a3a20','#a8744a']),sz:rint(1,2),drag:5,col:true,stamp:'#4a2e14'});}
 noise(dx,dy,240);
 for(const s of sus.concat(civs)){if(s.dead||s.st==='cuffed'||s.gone)continue;const[sx,sy]=ctr(s),d=Math.hypot(sx-dx,sy-dy);if(d<stunR&&losO(dx,dy,sx,sy))s.stun=Math.max(s.stun,stunT);}}
function kickDoor(k,e){if(world.t[k]!==T.DOOR)return false;const D=world.door.get(k);
 if(D&&D.armor){sfxAt('thud',...doorCenter(k));if(e===P){const[dx,dy]=doorCenter(k);popup(dx,dy-8,'¡BLINDADA!','#ff9a2a');radio('PUERTA BLINDADA: ARIETE O CARGA (ORDENA BRECHA AL EQUIPO).','#ff9a2a');}return false;}
 sfxAt('kick',...doorCenter(k));breakDoor(k,e,72,1.1);if(e===P){const[dx,dy]=doorCenter(k);popup(dx,dy-8,'¡PATADA!','#ffd23a');}return true;}
function ramDoor(k,e){if(world.t[k]!==T.DOOR)return;sfxAt('kick',...doorCenter(k));sfxAt('thud',...doorCenter(k));breakDoor(k,e,80,1.4);const[dx,dy]=doorCenter(k);popup(dx,dy-8,'¡ARIETE!','#ffd23a');}
const c4At=k=>world.c4.some(c=>c.k===k);
function plantC4(k,e){if(world.t[k]!==T.DOOR&&world.t[k]!==T.OPEN)return;const[dx,dy]=doorCenter(k),s=doorSide(k,e),D=world.door.get(k);
 const ox=D.o==='v'?s*6:0,oy=D.o==='h'?s*6:0;world.c4.push({k,x:dx+ox,y:dy+oy,t:2.2,by:e});sfxAt('beep',dx,dy);if(e.kind==='agent'&&e!==P)say(e,'c4',true);else popup(dx,dy-8,'CARGA PUESTA','#ff9a2a');}
function updateC4(dt){for(const c of world.c4){const a=Math.ceil(c.t*3);c.t-=dt;if(Math.ceil(c.t*3)!==a)sfxAt('beep',c.x,c.y);if(c.t<=0){c.dead=true;explodeAt(c.x,c.y,c.by,c.k);}}world.c4=world.c4.filter(c=>!c.dead);}
function explodeAt(x,y,by,k){sfxAt('boom',x,y);smokeAt(x,y,16,{r:[6,13],life:[5,8],col:'#4a4a4e',a:0.75,sp:26,grow:5});G.shake=Math.max(G.shake,7);flashes.push({x,y,r:120,life:0.5,max:0.5,c:'o'});
 if(k!==undefined&&(world.t[k]===T.DOOR||world.t[k]===T.OPEN))breakDoor(k,by,110,4);
 noise(x,y,400);const d0=world.dctx;d0.globalAlpha=0.5;d0.fillStyle='#000';d0.beginPath();d0.arc(x,y,10,0,6.283);d0.fill();d0.globalAlpha=1;
 for(let i=0;i<30;i++){const a=rand(0,6.283),s=rand(40,200);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(0.2,0.5),max:0.5,c:pick(['#ffd890','#ff9a2a','#fff']),sz:1,drag:4,glow:true});}
 for(const e of agents.concat(sus,civs)){if(e.dead||e.gone)continue;const[ex,ey]=ctr(e),d=Math.hypot(ex-x,ey-y);if(d<30)hitChar(e,{dmg:70*(1-d/40),from:'a',src:by,vx:0,vy:0,x,y,boom:1});
  if(e.kind!=='agent'&&d<110&&losO(x,y,ex,ey)){e.stun=Math.max(e.stun||0,4*(1-d/150));}}}
function nearDoorK(e,r,states){const[cx,cy]=ctr(e),tx=cx/TS|0,ty=cy/TS|0;let best=-1,bd=r;
 for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const x=tx+i,y=ty+j;if(x<0||y<0||x>=world.w||y>=world.h)continue;const k=y*world.w+x;if(!states.includes(world.t[k])||!world.door.has(k))continue;
  const[dx,dy]=doorCenter(k),d=Math.hypot(dx-cx,dy-cy)-(Math.abs(angDiff(Math.atan2(dy-cy,dx-cx),e.ang))<1?6:0);if(d<bd){bd=d;best=k;}}return best;}

// ===================== RUIDO, GRITOS, RENDICIÓN =====================
function noise(x,y,r){for(const s of sus){if(s.dead||s.st==='cuffed'||s.st==='surr')continue;if(Math.hypot(s.x+5-x,s.y+5-y)<r){if(s.st==='idle'){s.st='alert';if(Math.random()<0.4)say(s,'search');}s.lx=x;s.ly=y;s.alertT=9;}}
 for(const c of civs){if(c.dead||c.gone||c.st==='safe'||c.st==='comply')continue;if(Math.hypot(c.x+5-x,c.y+5-y)<r*0.8&&r>100){if(c.st!=='panic'&&Math.random()<0.5)say(c,'civ');c.st='panic';c.panT=rand(2,4);c.fx=x;c.fy=y;}}}
function darkAt(x,y){const d=world.dark;if(!d)return 0;const tx=x/TS|0,ty=y/TS|0;return tx>=0&&ty>=0&&tx<world.w&&ty<world.h?d[ty*world.w+tx]:0;}
function agentsSeenBy(s){let n=0;const[sx,sy]=ctr(s);for(const a of agents){if(a.dead)continue;const[ax,ay]=ctr(a);if(Math.hypot(ax-sx,ay-sy)<240&&losO(sx,sy,ax,ay))n++;}return n;}
function doShout(src,power){const[cx,cy]=ctr(src);SFX.shout();
 popup(cx,cy-10,src===P?'¡POLICIA!':'¡AL SUELO!',src===P?'#7fe6ff':'#5aa0ff');
 if(src===P)speakAs(pick(SHOUTS),{vo:voiceOf(P),emo:'command',prio:true,pr:5});
 for(const s of sus){if(s.dead||s.st==='cuffed'||s.st==='surr')continue;const[sx,sy]=ctr(s),d=Math.hypot(sx-cx,sy-cy);if(d>210||!losO(cx,cy,sx,sy))continue;
  if(s.shoutCd>0)continue;s.shoutCd=1.2;const ST=STYPE[s.type];
  let p=ST.surr*DF.surr*power;if(s.stun>0)p+=0.45;p+=(1-s.hp/s.max)*0.45;p+=Math.min(0.3,(agentsSeenBy(s)-1)*0.08);if(s.st==='idle')p+=0.12;if(s.captor)p-=0.12;if(s.boss)p-=0.15;
  if(Math.random()<clamp(p,0.03,0.97))surrender(s);
  else{if(s.st==='idle'){s.st='alert';s.react=Math.max(s.react,0.35*DF.react);}s.lx=cx;s.ly=cy;s.alertT=9;if(s.captor)say(s,'captor');else if(s.armed&&Math.random()<0.4)say(s,'fight');}}
 for(const c of civs){if(c.dead||c.gone||c.st==='safe')continue;const[x,y]=ctr(c);if(Math.hypot(x-cx,y-cy)<210&&losO(cx,cy,x,y)){c.st='comply';}}}
function surrender(s){s.st='surr';s.surrT=0;s.surrAt=G.time;s.vx=s.vy=0;
 if(s.armed){s.armed=false;const[x,y]=ctr(s);items.push({type:'gun',x:x+Math.cos(s.ang)*7,y:y+Math.sin(s.ang)*7,owner:s,a:s.ang});}
 s.fakeT=s.wasArmed&&Math.random()<DF.fake?rand(5,10):1e9;say(s,'surr',true);}
