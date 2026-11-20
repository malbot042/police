
// ===================== PREPARACIÓN Y DESPLIEGUE =====================
const PAL_BOSS={G:'#e8e6dc',g:'#a8a69c',H:'#141414',h:'#000000'};
function prepMission(M){auInit();G.M=M;G.mi=M.idx;TH=THEMES[M.map];
 for(let tries=0;tries<6;tries++){const seed=Math.random()*1e9|0,R=mulberry(seed);LV=[];const nf=M.floors||1;
  for(let f=0;f<nf;f++){const L=newLevel(M.w,M.h,f);LV.push(L);genLayout(L,M,R,f>0);}
  for(const L of LV)assignRooms(L,M,R);
  if(nf>1&&!placeStairs(LV[0],LV[1],R))continue;
  for(const L of LV)furnish(L,M,R);
  break;}
 for(const L of LV)buildBase(L);
 G.entries=entryList();G.bview='info';G.pf=0;G.pg='A';
 const lo=LS.get('lo',{prim:-1,t1:'none',t2:'none',bravo:'main',alfa:'main',voz:'m'});if(!lo.alfa)lo.alfa='main';if(!lo.voz)lo.voz='m';G.lo=lo;fixLoadout();G.bsel=0;G.state='brief';}
function primOpts(){const M=G.M,o=M.wpn.filter(w=>w!==0);if(!o.length)o.push(0);if(totalStars()>=SHIELD_STAR)o.push(4);return o;}
function tacOpts(){const st=totalStars();return Object.keys(TAC).filter(k=>TAC[k].star<=st);}
function fixLoadout(){const lo=G.lo,po=primOpts(),to=tacOpts();if(!po.includes(lo.prim))lo.prim=po[0];if(!to.includes(lo.t1))lo.t1='none';if(!to.includes(lo.t2)||(lo.t2===lo.t1&&lo.t2!=='none'))lo.t2='none';const ids=G.entries.map(e=>e.id);if(!ids.includes(lo.bravo))lo.bravo='main';if(!ids.includes(lo.alfa))lo.alfa='main';}
const ENTRYN={main:'PRINCIPAL',back:'PUERTA TRASERA',side:'PUERTA LATERAL',roof:'AZOTEA (PLANTA 1)'};
function entryList(){const L0=LV[0],E=[{id:'main',f:0,k:L0.entry.y*L0.w+L0.entry.x,x:L0.entry.x,y:L0.entry.y+2}];
 for(const id of['back','side'])if(L0[id])E.push({id,f:0,k:L0[id].dy*L0.w+L0[id].dx,x:L0[id].x,y:L0[id].y});
 if(LV[1]&&LV[1].roof){const r=LV[1].roof;E.push({id:'roof',f:1,k:r.dy*LV[1].w+r.dx,x:r.x,y:r.y});}return E;}
const entryById=id=>G.entries.find(e=>e.id===id)||G.entries[0];
function spotsAround(L,x,y,n){world=L;const out=[],seen=new Set([y*L.w+x]),q=[[x,y]];
 while(q.length&&out.length<n+20){const[cx,cy]=q.shift();const t=tget(cx,cy);if(t===T.OUT)out.push([cx,cy]);for(const[dx,dy]of[[0,1],[1,0],[-1,0],[0,-1]]){const nx=cx+dx,ny=cy+dy,k=ny*L.w+nx;if(seen.has(k)||nx<0||ny<0||nx>=L.w||ny>=L.h)continue;seen.add(k);if(tget(nx,ny)===T.OUT)q.push([nx,ny]);}}
 return out;}
function deploy(){const M=G.M,lo=G.lo;LS.set('lo',lo);
 ALLA=[];ALLS=[];ALLC=[];G.radio=[];G.events=[];G.cams=[];G.orders=[];G.selG='T';G.auto=null;
 for(const L of LV){L.items=[];L.bullets=[];L.nades=[];L.parts=[];L.popups=[];L.smoke=[];L.flashes=[];L.c4=[];L.seen.fill(0);L.ptk=-1;}
 const L0=LV[0],ex=L0.entry.x,ey=L0.entry.y;
 // agentes
 const n=M.squad-1,nA=n>=2?Math.ceil(n/2):n,EA=entryById(lo.alfa||'main'),EB=n>=3?entryById(lo.bravo):EA;
 const near=(E,cnt)=>spotsAround(LV[E.f],E.x,E.y,cnt+4).sort((a,b)=>Math.hypot(a[0]-E.x,(a[1]-E.y)*1.2)-Math.hypot(b[0]-E.x,(b[1]-E.y)*1.2));
 const mainS=near(EA,M.squad);let bS=mainS,bF=EA.f;if(EB!==EA){bS=near(EB,n);bF=EB.f;}
 let mi=0,bi=bS===mainS?nA+1:0;const bravoAt=EB.id;
 const prim=M.wpn.filter(v=>v!==0);
 for(let k=0;k<M.squad;k++){const isB=k>nA,s=isB?bS[bi++]:mainS[mi++],f=isB?bF:EA.f;
  const a=newChar('agent',(s[0]+0.5)*TS,(s[1]+0.5)*TS,f);a.idx=k;a.armor=0.25;a.gender=k===0?(lo.voz||'m'):(Math.random()<0.3?'f':'m');a.g=k===0?'L':isB?'B':'A';
  if(k===0){P=a;a.name='TU';a.short='TU';a.has=lo.prim===4?[4]:(lo.prim===0?[0]:[0,lo.prim]);a.wi=a.has.length-1;a.mags=a.has.map(v=>WPN[v].mag);a.res=a.has.map(v=>WPN[v].res);
   a.flashN=DF.flash+(lo.t1==='flash'?2:0)+(lo.t2==='flash'?2:0);a.tac=[lo.t1,lo.t2];a.c4n=(lo.t1==='c4'?2:0)+(lo.t2==='c4'?2:0);a.inv=0;a.reload=0;a.camCd=0;}
  else{const gi=isB?k-nA:k+1;a.name=(isB?'BRAVO ':'ALFA ')+gi;a.short=(isB?'B':'A')+gi;
   a.w=prim.length?(prim.includes(3)&&(k===1||k===nA+1)?3:prim[(k-1)%prim.length]):0;a.mag=WPN[a.w].mag;a.reload=0;a.react=0;a.task=null;a.rank=isB?k-nA-1:k-1;}
  ALLA.push(a);}
 G.gflash={A:n>=3?2:1,B:2};
 if(EB!==EA&&n>=3){world=LV[EB.f];const mem=ALLA.filter(a=>a.g==='B'),k=EB.k,side=doorSide(k,{x:(EB.x+0.5)*TS-5,y:(EB.y+0.5)*TS-5});let sp=stackSpots(k,side,mem.length);if(!sp.length)sp=[EB.y*world.w+EB.x];
  const O={members:mem,mode:'stack',t:0,f:EB.f,k,side,method:world.door.get(k).armor?1:0,spots:sp,said:false};G.orders.push(O);mem.forEach((a,i)=>{a.ord=O;a.goal={f:EB.f,k:sp[i%sp.length]};});}
 // sospechosos, civiles, pruebas
 const fl=LV.map(L=>{world=L;return computeFlowMulti(L.entry?[[L.entry.x,L.entry.y-1]]:L.stairs.map(k=>[k%L.w,k/L.w|0]));});
 const occ=LV.map(()=>new Set());
 const freeTile=(L,room,minD)=>{world=L;for(let k=0;k<50;k++){const t=room.tiles[Math.random()*room.tiles.length|0];if(L.t[t]!==T.FLOOR||occ[L.f].has(t)||fl[L.f][t]<minD)continue;const x=t%L.w,y=t/L.w|0;
   let nd=false;for(const[dx,dy]of DIRS8){const tt=tget(x+dx,y+dy);if(tt===T.DOOR||tt===T.STAIR)nd=true;}if(nd)continue;occ[L.f].add(t);return[(x+0.5)*TS,(y+0.5)*TS];}return null;};
 const entryRoom=L0.room[(ey-1)*L0.w+ex];
 let cands=[];for(const L of LV)for(const r of L.rooms)if(r.tiles.length>=4&&!(L.f===0&&r.id===entryRoom))cands.push({L,r});if(!cands.length)cands=[{L:L0,r:L0.rooms[0]}];
 const cnt=new Map(),susRooms=[];
 const spawnSus=(type,p,L,room)=>{const ST=STYPE[type],s=newChar('sus',p[0],p[1],L.f);s.gender=Math.random()<0.25?'f':'m';Object.assign(s,{type,hp:ST.hp,max:ST.hp,armed:ST.arm,wasArmed:ST.arm,st:'idle',ang:rand(0,6.283),react:0,alertT:0,lx:p[0],ly:p[1],aggr:Math.random()<0.35,pi:Math.random()*PAL_SUS.length|0,room:room?room.id:-1,wT:rand(1,4),burstN:0,surrT:0,fakeT:1e9,seeT:0});s.wa=s.ang;ALLS.push(s);return s;};
 for(const type of M.sus){let pos=null,c=null;for(let tr=0;tr<80&&!pos;tr++){c=pick(cands);const key=c.L.f+':'+c.r.id;if((cnt.get(key)||0)>=3&&tr<70)continue;pos=freeTile(c.L,c.r,4);}
  if(!pos)continue;const key=c.L.f+':'+c.r.id;cnt.set(key,(cnt.get(key)||0)+1);spawnSus(type,pos,c.L,c.r);if(!susRooms.includes(c))susRooms.push(c);}
 // vigías exteriores
 for(let k=0;k<(M.out||0);k++){world=L0;const opts=[];for(let y=0;y<=L0.by1;y++)for(let x=0;x<L0.w;x++){if(L0.t[y*L0.w+x]===T.OUT&&Math.abs(x-ex)+Math.abs(y-ey)>14)opts.push([x,y]);}
  if(opts.length){const o=pick(opts);const s=spawnSus(pick(['pistola','pistola','subfusil']),[(o[0]+0.5)*TS,(o[1]+0.5)*TS],L0,null);s.out=true;}}
 if(M.boss&&ALLS.length){const b=ALLS.filter(s=>s.type==='fusil'&&!s.out).pop()||ALLS[0];b.boss=true;b.gender='m';b.hp=b.max=170;b.aggr=false;}
 for(let k=0;k<M.civ;k++){const host=M.host&&k<Math.ceil(M.civ*0.6)&&susRooms.length;const c=host?pick(susRooms):pick(cands);const pos=freeTile(c.L,c.r,host?2:3);if(!pos)continue;
  const v=newChar('civ',pos[0],pos[1],c.L.f);v.gender=Math.random()<0.5?'f':'m';Object.assign(v,{st:host?'comply':'idle',host:!!host,pi:Math.random()*PAL_CIV.length|0,ang:rand(0,6.283),hp:60,max:60,wT:rand(1,4)});v.wa=v.ang;ALLC.push(v);
  if(host){const cap=ALLS.find(s=>s.f===c.L.f&&s.room===c.r.id&&s.armed);if(cap){cap.captor=true;cap.aggr=false;}}}
 const evRooms=cands.filter(c=>RFN[c.r.fn]&&RFN[c.r.fn].ev);
 for(let k=0;k<M.ev;k++){let pos=null,c=null;for(let tr=0;tr<40&&!pos;tr++){c=evRooms.length&&tr<20?pick(evRooms):pick(cands);pos=freeTile(c.L,c.r,5);}if(pos)c.L.items.push({type:'ev',x:pos[0],y:pos[1]});}
 // revelar exterior y flujos
 for(const L of LV){world=L;const w=L.w;for(let y=0;y<L.h;y++)for(let x=0;x<w;x++){const t=L.t[y*w+x];if(t===T.OUT||t===T.VOID||((x===L.bx0||x===L.bx1||y===L.by0||y===L.by1)&&x>=L.bx0&&x<=L.bx1&&y>=L.by0&&y<=L.by1))L.seen[y*w+x]=1;}
  L.flowS=L.stairs.length?computeFlowMulti(L.stairs.map(k=>[k%w,k/w|0])):null;L.flowX=L.f===0?computeFlow(ex,ey+2):L.flowS;L.flowP=null;}
 G.stats={arr:0,neu:0,unj:0,civ:0,civHurt:0,civK:0,hostK:0,down:0,ev:0,guns:0,boss:0,bossDead:0};
 G.nSus=ALLS.length;G.nCiv=ALLC.length;G.nEv=LV.reduce((a,L)=>a+L.items.length,0);
 G.time=0;G.clearT=0;G.deadT=0;G.blind=0;G.hurtFlash=0;G.inten=0;G.res=null;G.prompt=null;G.floorMsg=0;
 G.msg=M.n;G.sub=TH.n+' - '+(M.squad===1?'EN SOLITARIO':M.squad+' AGENTES')+(LV.length>1?' - 2 PLANTAS':'');G.msgT=3.2;
 radio('CENTRAL: ADELANTE. ENTRAD CUANDO ESTEIS LISTOS.','#7fe6ff');central(pick(['Central a unidad.|Tenéis luz verde.|Adelante.','Aquí central.|Luz verde para entrar.|Suerte.','Central a unidad.|Perímetro asegurado.|Podéis entrar.']));if(EB!==EA&&n>=3)radio('BRAVO APILADO EN '+ENTRYN[bravoAt]+'. PULSA B PARA ENTRAR A LA VEZ.','#5aa0ff');SFX.radio();
 useLevel(0);const[px,py]=ctr(P);G.camx=px-W/2;G.camy=py-H/2;G.state='play';mouse.x=W/2;mouse.y=H/2-60;}

// ===================== JUGADOR =====================
const curW=()=>WPN[P.has[P.wi]];
function setWeapon(i){if(i<P.has.length&&i!==P.wi){P.wi=i;P.reload=0;SFX.sw();}}
function cycleWeapon(d){if(P.has.length>1)setWeapon((P.wi+d+P.has.length)%P.has.length);}
function magDrop(e,shell){const[x,y]=ctr(e),c=Math.cos(e.ang),s=Math.sin(e.ang);parts.push({x:x+c*3,y:y+s*3,vx:-s*rand(10,30)+c*10,vy:c*rand(10,30)+s*10,life:0.45,max:0.45,c:shell?'#c03020':'#2a2c33',sz:shell?1:2,drag:6,col:true,stamp:shell?'#7a2018':'#25272d'});}
function startReload(){const w=curW();if(P.reload>0||P.mags[P.wi]>=w.mag||P.res[P.wi]<=0)return;P.reload=w.rel;P.relW=P.wi;SFX.reload();if(!w.shell)magDrop(P);}
function updateReload(dt){if(P.reload<=0)return;if(P.relW!==P.wi){P.reload=0;return;}P.reload-=dt;if(P.reload<=0){const w=curW();
 if(w.shell){P.mags[P.wi]++;P.res[P.wi]--;SFX.shell();if(P.mags[P.wi]<w.mag&&P.res[P.wi]>0)P.reload=w.rel;}
 else{P.mags[P.wi]=w.mag;P.res[P.wi]--;}}}
function shoot(a,w,sprMul){const[cx,cy]=ctr(a),ca=Math.cos(a.ang),sa=Math.sin(a.ang),mx=cx+ca*9,my=cy+sa*9;
 const n=w.pel||1;for(let i=0;i<n;i++){const ang=a.ang+rand(-w.spr,w.spr)*sprMul,sp=w.sp*(w.pel?rand(0.85,1.1):1);bullets.push({x:mx,y:my,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:w.pel?0.32:0.9,dmg:w.dmg,from:'a',src:a,pierce:w.pierce||0,pel:!!w.pel});}
 a.mflash=0.05;if(a===P)SFX[w.snd]();else sfxAt(w.snd,cx,cy);smokeAt(mx+ca*2,my+sa*2,w.pel?3:1,{r:[1.5,2.5],life:[0.6,1.1],col:'#8a8a8e',a:w.pel?0.3:0.18,sp:12,grow:6});
 const cs=ca>=0?1:-1;parts.push({x:cx,y:cy,vx:-sa*rand(30,60)*cs,vy:ca*rand(30,60)*cs,life:0.5,max:1,c:w.pel?'#c03020':'#d4a017',sz:1,drag:6,col:true,stamp:w.pel?'#7a2018':'#8a6a10'});
 noise(cx,cy,320);G.inten=Math.min(1,G.inten+0.12);}
function fire(slow){const w=curW();if(P.cd>0)return;
 if(P.reload>0){if(w.shell&&P.mags[P.wi]>0)P.reload=0;else return;}
 if(P.mags[P.wi]<=0){if(P.res[P.wi]>0)startReload();else{SFX.empty();P.cd=0.3;}return;}
 P.mags[P.wi]--;P.cd=w.rof;const mv=Math.hypot(P.vx,P.vy)>30;shoot(P,w,slow?0.5:mv?1.35:1);
 G.shake=Math.max(G.shake,w.shake);G.kx=(G.kx||0)-Math.cos(P.ang)*w.kick;G.ky=(G.ky||0)-Math.sin(P.ang)*w.kick;}
function throwNadeFrom(a,tx,ty){const[ox,oy]=ctr(a),dd=Math.min(Math.hypot(tx-ox,ty-oy),150),Tf=clamp(dd/170,0.25,0.85),v=dd/Tf,an=Math.atan2(ty-oy,tx-ox);
 nades.push({x:ox,y:oy,vx:Math.cos(an)*v,vy:Math.sin(an)*v,z:2,vz:0.5*400*Tf,fuse:Tf+0.45,rot:0});SFX.nade();}
function throwFlash(){if(P.flashN<=0){SFX.empty();radio('SIN ATURDIDORAS.','#ff9a2a');P.ncd=0.5;return;}P.flashN--;P.ncd=0.6;throwNadeFrom(P,mouse.x+G.camx,mouse.y+G.camy);}
function farPoint(k,e,d){const D=world.door.get(k),[dx,dy]=doorCenter(k),s=doorSide(k,e);return D.o==='h'?[dx,dy-s*d]:[dx-s*d,dy];}
function tacKey(i){return i?'Y':'T';}
function useTac(i){const id=P.tac[i];if(!id||id==='none'||id==='flash')return;const k=nearDoorK(P,26,[T.DOOR]);
 if(id==='cam'){if(k<0){SFX.deny();radio('ACERCATE A UNA PUERTA CERRADA.','#ff9a2a');return;}if(P.camCd>0)return;const[x,y]=farPoint(k,P,20);G.cams.push({f:P.f,x,y,t:4});P.camCd=4.5;SFX.beep();radio('CAMARA BAJO LA PUERTA.','#7fe6ff');}
 else if(id==='ram'){if(k<0){SFX.deny();return;}P.act={type:'ram',k,t:0,dur:world.door.get(k).armor?1.4:0.6,key:tacKey(i).toLowerCase()};}
 else if(id==='c4'){const k2=k>=0?k:nearDoorK(P,26,[T.OPEN]);if(k2<0){SFX.deny();radio('ACERCATE A UNA PUERTA.','#ff9a2a');return;}if(P.c4n<=0){SFX.deny();radio('SIN CARGAS.','#ff9a2a');return;}if(c4At(k2))return;P.c4n--;plantC4(k2,P);radio('¡CARGA PUESTA! ALEJATE DE LA PUERTA.','#ff9a2a');}}
function findAct(){const[cx,cy]=ctr(P);let best=null,bd=1e9;const consider=(o,d,type,dur)=>{if(d<bd){bd=d;best={type,e:o,dur};}};
 for(const s of sus){if(s.dead||s.st==='cuffed')continue;if(s.st==='surr'||s.stun>0){const d=dist(s,P);if(d<20)consider(s,d,'cuff',1.0);}}
 for(const c of civs){if(c.dead||c.gone||c.st==='safe')continue;const d=dist(c,P);if(d<20)consider(c,d,'safe',0.6);}
 for(const it of items){if(it.type!=='ev')continue;const d=Math.hypot(it.x-cx,it.y-cy);if(d<18)consider(it,d,'ev',0.5);}
 if(!best){const k=nearDoorK(P,26,[T.DOOR,T.OPEN]);if(k>=0)best={type:'door',k,dur:0};}
 return best;}
function interact(dt){if(P.act&&P.act.type==='ram'){if(K(P.act.key)&&world.t[P.act.k]===T.DOOR){P.act.t+=dt;G.prompt='ARIETE...';if(P.act.t>=P.act.dur){ramDoor(P.act.k,P);P.act=null;}else if(((P.act.t*3)|0)!==(((P.act.t-dt)*3)|0))SFX.thud();}else P.act=null;return;}
 const a=findAct();G.prompt=null;
 if(a){if(a.type==='door'){const D=world.door.get(a.k);let s=world.t[a.k]===T.DOOR?(D.armor?'BLINDADA':D.lock?'CERRADA CON LLAVE - F: PATADA':'E: ABRIR - F: PATADA'):'E: CERRAR';
   if(world.t[a.k]===T.DOOR)P.tac.forEach((t,i)=>{if(t==='ram')s+=' - '+tacKey(i)+': ARIETE';if(t==='c4'&&P.c4n>0)s+=' - '+tacKey(i)+': CARGA';if(t==='cam')s+=' - '+tacKey(i)+': CAMARA';});G.prompt=s;}
  else G.prompt=a.type==='cuff'?'MANTEN E: ESPOSAR':a.type==='safe'?'MANTEN E: ASEGURAR CIVIL':'MANTEN E: RECOGER PRUEBA';}
 else if(G.lockHint>0)G.prompt='CERRADA CON LLAVE - F: PATADA';
 const held=K('e')||padKeys['e']||TCH.use;
 if(a&&a.type==='door'){if(pressed['e']){if(world.t[a.k]===T.DOOR){if(world.door.get(a.k).lock){SFX.deny();radio(world.door.get(a.k).armor?'PUERTA BLINDADA: ARIETE O CARGA.':'CERRADA CON LLAVE. USA LA PATADA (F).','#ffd23a');}else openDoor(a.k,P);}else closeDoor(a.k);}P.act=null;return;}
 if(held&&a){if(!P.act||P.act.e!==a.e)P.act={type:a.type,e:a.e,t:0,dur:a.dur};P.act.t+=dt;if(P.act.t>=P.act.dur){completeAct(P.act.type,P.act.e,P);P.act=null;}}
 else P.act=null;}
function completeAct(type,e,by){const[x,y]=type==='ev'?[e.x,e.y]:ctr(e);const wh=by===P?'':by.name+': ';
 if(type==='cuff'){if(e.st==='cuffed'||e.dead)return;e.st='cuffed';e.stun=0;e.armed=false;G.stats.arr++;if(e.boss)G.stats.boss=1;sfxAt('cuff',x,y);logEv('arr',e,by);popup(x,y-12,e.boss?'¡CAPO DETENIDO!':'DETENIDO','#7dff3a');radio(wh+(e.boss?'¡TENEMOS AL CAPO!':'SOSPECHOSO DETENIDO.'),'#7dff3a');if(by!==P)say(by,'cuffed',true);
  const g=items.find(i=>i.type==='gun'&&i.owner===e);if(g){items.splice(items.indexOf(g),1);G.stats.guns++;}}
 else if(type==='safe'){if(e.st==='safe'||e.dead)return;e.st='safe';G.stats.civ++;SFX.ok();logEv('civ',e,by);say(e,'civsafe',true);if(by!==P)radio(wh+'CIVIL ASEGURADO.','#7fe6ff');}
 else if(type==='ev'){const i=items.indexOf(e);if(i<0)return;items.splice(i,1);G.stats.ev++;SFX.pick();G.events.push({t:'ev',x:e.x,y:e.y,f:world.f,by:who(by)});popup(x,y-10,'PRUEBA ASEGURADA','#ffd23a');radio(wh+'PRUEBA RECOGIDA.','#ffd23a');}}
function updatePlayer(dt){
 const kfire=aimInput();const[cx,cy]=ctr(P);
 P.inv-=dt;P.cd-=dt;P.mflash-=dt;P.shoutCd-=dt;P.kickCd=(P.kickCd||0)-dt;P.ncd=(P.ncd||0)-dt;P.flash-=dt;P.camCd-=dt;
 if(aimMode!=='mouse'){mouse.x=clamp(cx-G.camx+Math.cos(G.kaim)*70,0,W-1);mouse.y=clamp(cy-G.camy+Math.sin(G.kaim)*70,0,H-1);P.ang=G.kaim;}
 else P.ang=Math.atan2(mouse.y+G.camy-cy,mouse.x+G.camx-cx);
 let mx=(K('d')?1:0)-(K('a')?1:0),my=(K('s')?1:0)-(K('w')?1:0);if(pad){mx+=pad.mx;my+=pad.my;}if(TOUCH){mx+=TCH.mx;my+=TCH.my;}
 const m=Math.max(1,Math.hypot(mx,my)),slow=K('shift')||(pad&&pad.slow);
 const spd=(slow?46:80)*(curW().shield?0.8:1),k=Math.min(1,dt*14);P.vx+=(mx/m*spd-P.vx)*k;P.vy+=(my/m*spd-P.vy)*k;moveChar(P,dt);stepSound(P,dt);if(mx||my)P.anim+=dt*(slow?6:10);
 for(let i=0;i<P.has.length;i++)if(pressed[''+(i+1)])setWeapon(i);if(pressed['q'])cycleWeapon(1);
 if(pressed['r'])startReload();
 updateReload(dt);
 if(mouse.down||kfire)fire(slow);
 if(pressed[' ']&&P.shoutCd<=0){doShout(P,1);P.shoutCd=1.1;}
 if(pressed['f']&&P.kickCd<=0){const kd=nearDoorK(P,26,[T.DOOR]);if(kd>=0){kickDoor(kd,P);P.kickCd=0.6;}}
 if((pressed['g']||pressed['rmb'])&&P.ncd<=0)throwFlash();
 if(pressed['t'])useTac(0);if(pressed['y'])useTac(1);
 if(pressed['l']){P.light=P.light===false;SFX.sw();radio(P.light?'LINTERNA ENCENDIDA':'LINTERNA APAGADA: TE VEN MENOS A OSCURAS','#ffd890');}
 if(ALLA.length>1){if(pressed['tab'])cycleGroup();if(pressed['c'])orderToggle();if(pressed['v'])orderMove();if(pressed['x'])orderStack();if(pressed['b'])orderGo();}
 interact(dt);}

// ===================== ÓRDENES DE GRUPO =====================
const GRPN={T:'TODOS',A:'ALFA',B:'BRAVO'};
function groupsAvail(){const g=['T'];if(ALLA.some(a=>a.g==='A'&&!a.dead))g.push('A');if(ALLA.some(a=>a.g==='B'&&!a.dead))g.push('B');return g;}
function cycleGroup(){const g=groupsAvail();if(g.length<3){G.selG='T';return;}G.selG=g[(g.indexOf(G.selG)+1)%g.length];SFX.sw();radio('GRUPO: '+GRPN[G.selG],'#5aa0ff');}
function selMembers(){return ALLA.filter(a=>a!==P&&!a.dead&&(G.selG==='T'||a.g===G.selG));}
function setOrder(mem,O){for(const a of mem){if(a.ord&&a.ord!==O){a.ord.members=a.ord.members.filter(m=>m!==a);}a.ord=O;a.goal=null;a.task=null;}G.orders=G.orders.filter(o=>o.members.length&&o!==O);if(O){O.members=mem.slice();G.orders.push(O);}}
const gTag=()=>G.selG==='T'?'EQUIPO':GRPN[G.selG];
function orderToggle(){const mem=selMembers();if(!mem.length)return;SFX.radio();
 if(mem.some(a=>!a.ord)){setOrder(mem,{mode:'hold',t:0,f:P.f});radio('TU: '+gTag()+', ¡MANTENED POSICION!','#5aa0ff');}
 else{setOrder(mem,null);for(const a of mem)a.ord=null;radio('TU: '+gTag()+', ¡CONMIGO!','#5aa0ff');}}
function orderMove(){const mem=selMembers();if(!mem.length)return;const x=mouse.x+G.camx,y=mouse.y+G.camy,tx=x/TS|0,ty=y/TS|0;
 if(tx<0||ty<0||tx>=world.w||ty>=world.h||!walkT(tget(tx,ty))||!world.seen[ty*world.w+tx]){SFX.deny();return;}
 const f=computeFlow(tx,ty),opts=[];for(let i=0;i<f.length;i++)if(f[i]>=0&&f[i]<6&&walkT(world.t[i]))opts.push(i);opts.sort((a,b)=>f[a]-f[b]);
 const goals=[];for(const k of opts){if(goals.every(g=>Math.abs(g%world.w-k%world.w)+Math.abs((g/world.w|0)-(k/world.w|0))>=1))goals.push(k);if(goals.length>=mem.length)break;}
 const O={mode:'move',t:0,f:P.f};setOrder(mem,O);mem.forEach((a,i)=>a.goal={f:P.f,k:goals[i%goals.length]});G.orderPt=[(tx+0.5)*TS,(ty+0.5)*TS,1.5,P.f];SFX.radio();radio('TU: '+gTag()+', ¡A ESA POSICION!','#5aa0ff');}
const METHODS=['ABRIR','PATADA','ATURDIDORA'];
function doorAtCursor(){const x=mouse.x+G.camx,y=mouse.y+G.camy;let best=-1,bd=40;for(const[k]of world.door){const t=world.t[k];if(t!==T.DOOR&&t!==T.OPEN&&t!==T.BROKEN)continue;if(!world.seen[k])continue;const[dx,dy]=doorCenter(k),d=Math.hypot(dx-x,dy-y);if(d<bd){bd=d;best=k;}}return best;}
function orderStack(){const mem=selMembers();if(!mem.length)return;const k=doorAtCursor();if(k<0){SFX.deny();radio('APUNTA A UNA PUERTA PARA APILAROS.','#ff9a2a');return;}
 const cur=mem[0].ord;if(cur&&cur.mode==='stack'&&cur.k===k&&cur.f===P.f&&mem.every(a=>a.ord===cur)){cur.method=(cur.method+1)%METHODS.length;SFX.sw();radio(gTag()+': BRECHA CON '+METHODS[cur.method],'#5aa0ff');return;}
 let sx=0,sy=0,n=0;for(const a of mem)if(a.f===P.f){sx+=a.x;sy+=a.y;n++;}const ref=n?{x:sx/n,y:sy/n}:P;let side=doorSide(k,ref);
 let spots=stackSpots(k,side,mem.length);if(spots.length<Math.min(2,mem.length)){side=-side;spots=stackSpots(k,side,mem.length);}
 if(!spots.length){SFX.deny();return;}
 const D=world.door.get(k),O={mode:'stack',t:0,f:P.f,k,side,method:D&&D.armor?1:0,spots,said:false};setOrder(mem,O);mem.forEach((a,i)=>a.goal={f:O.f,k:spots[i%spots.length]});
 SFX.radio();radio('TU: '+gTag()+', APILAOS EN LA PUERTA. (X: METODO, B: ¡ADELANTE!)','#5aa0ff');}
function orderGo(){const os=G.orders.filter(o=>o.mode==='stack');if(!os.length){SFX.deny();radio('NADIE ESTA APILADO EN UNA PUERTA (X).','#ff9a2a');return;}
 for(const O of os){O.mode='breach';O.t=0;O.phase='go';}SFX.radio();speakAs('¡Adelante!|¡Adelante!',{vo:voiceOf(P),emo:'command',prio:true,pr:5});radio('TU: ¡ADELANTE!','#5aa0ff');}
function stackSpots(k,side,n){const w=world.w,dx=k%w,dy=k/w|0,D=world.door.get(k),out=[];
 for(let row=1;row<=2&&out.length<n;row++){const stop={'-1':false,'1':false};
  for(let i=1;i<=7&&out.length<n;i++)for(const s of[-1,1]){if(out.length>=n||stop[s])continue;let x,y,wallOk;
   if(D.o==='h'){x=dx+s*i;y=dy+side*row;wallOk=row>1||[T.WALL,T.WIN].includes(tget(x,dy));}else{x=dx+side*row;y=dy+s*i;wallOk=row>1||[T.WALL,T.WIN].includes(tget(dx,y));}
   if(!walkT(tget(x,y))||!wallOk){stop[s]=true;continue;}out.push(y*w+x);}}
 if(out.length<n){const fx=D.o==='h'?dx:dx+side,fy=D.o==='h'?dy+side:dy,f=computeFlow(fx,fy),ex=[];for(let i=0;i<f.length;i++)if(f[i]>=1&&f[i]<5&&walkT(world.t[i])&&!out.includes(i)&&world.room[i]===world.room[fy*w+fx])ex.push(i);ex.sort((a,b)=>f[a]-f[b]);while(out.length<n&&ex.length)out.push(ex.shift());}
 return out;}
function roomSpots(fx,fy,n,avoid){const w=world.w,r=world.room[fy*w+fx];let cand=[];
 if(r>=0)cand=world.rooms[r].tiles.filter(t=>walkT(world.t[t]));else{const f=computeFlow(fx,fy);for(let i=0;i<f.length;i++)if(f[i]>=0&&f[i]<5&&walkT(world.t[i]))cand.push(i);}
 const wallsAt=t=>{const x=t%w,y=t/w|0;let c=0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const tt=tget(x+dx,y+dy);if(tt===T.WALL||tt===T.WIN||tt===T.FURN)c++;}return c;};
 const md=(t,arr)=>{let m=1e9;for(const a of arr)m=Math.min(m,Math.abs(a%w-t%w)+Math.abs((a/w|0)-(t/w|0)));return m;};
 const chosen=[],ref=[fy*w+fx].concat(avoid||[]);
 for(let i=0;i<n&&cand.length;i++){let best=-1,bs=-1e9;for(const t of cand){if(chosen.includes(t))continue;const s=Math.min(md(t,chosen.length?chosen:ref),6)*1.0+Math.min(md(t,ref),4)*0.6+wallsAt(t)*1.6;if(s>bs){bs=s;best=t;}}if(best<0)break;chosen.push(best);}
 return chosen;}
function updateOrders(dt){
 for(const O of G.orders){if((O.f||0)!==world.f)continue;O.t+=dt;const mem=O.members.filter(a=>!a.dead);O.members=mem;if(!mem.length)continue;
  if(O.mode==='stack'){if(!O.said&&mem.every(a=>a.f===O.f&&a.goal&&a.atGoal)){O.said=true;say(mem[0],'stack',true);radio(mem[0].name.split(' ')[0]+': EN POSICION. METODO: '+METHODS[O.method]+'.','#5aa0ff');}}
  else if(O.mode==='breach'&&O.f===world.f){const k=O.k,D=world.door.get(k);const br=mem.filter(a=>a.f===O.f).sort((a,b)=>{const[dx,dy]=doorCenter(k);return Math.hypot(a.x+5-dx,a.y+5-dy)-Math.hypot(b.x+5-dx,b.y+5-dy);})[0];
   if(!br){O.mode='hold';continue;}const[dx,dy]=doorCenter(k),bd=Math.hypot(br.x+5-dx,br.y+5-dy);
   if(O.phase==='go'){
    if(bd>24&&O.t<4){br.goal={f:O.f,k:(()=>{const w=world.w,x=k%w,y=k/w|0;return D.o==='h'?(y+O.side)*w+x:y*w+x+O.side;})()};continue;}
    br.grpDoor=true;say(br,'breach',true);
    if(world.t[k]===T.DOOR){if(D.armor){if(!c4At(k))plantC4(k,br);O.phase='c4';O.t=0;continue;}
     if(METHODS[O.method]==='ABRIR'&&!D.lock)openDoor(k,br);else kickDoor(k,br);}
    if(METHODS[O.method]==='ATURDIDORA'){const g=br.g;if((G.gflash[g]||0)>0){G.gflash[g]--;const[tx,ty]=farPoint(k,br,40);throwNadeFrom(br,tx,ty);say(br,'flashout',true);O.phase='flash';O.t=0;continue;}}
    O.phase='enter';O.t=0;}
   if(O.phase==='c4'){if(world.t[k]!==T.DOOR||O.t>5){O.phase='enter';O.t=0;}else continue;}
   if(O.phase==='flash'){if(O.t<1.2)continue;O.phase='enter';O.t=0;}
   if(O.phase==='enter'){O.mode='enter';O.t=0;const kx=k%world.w,ky=k/world.w|0,fx=D.o==='h'?kx:kx-O.side,fy=D.o==='h'?ky-O.side:ky;
    const spots=roomSpots(fx,fy,mem.length,[k]);mem.forEach((a,i)=>{a.grpDoor=false;a.goal={f:O.f,k:spots.length?spots[i%spots.length]:k};});}}
  else if(O.mode==='enter'){if(mem.every(a=>a.atGoal)||O.t>7){O.mode='hold';const hot=mem.some(a=>a.target);say(mem[0],hot?'contact':'clear',true);radio(mem[0].name.split(' ')[0]+(hot?': ¡CONTACTO!':': ¡DESPEJADO!'),hot?'#ff9a2a':'#7dff3a');}}
  else if(O.mode==='move'){if(mem.every(a=>a.atGoal)&&!O.said){O.said=true;O.mode='hold';}}
  if(O.mode==='hold'){for(const a of mem)if(a.goal&&a.atGoal)a.goal=null;}}
 G.orders=G.orders.filter(o=>o.members.length);
 // comportamiento automático al seguir
 if(P.dead||P.f!==world.f)return;
 const fol=ALLA.filter(a=>a!==P&&!a.dead&&!a.ord&&a.f===P.f);if(!fol.length){G.auto=null;return;}
 const pk=tkey(P),room=world.room[pk];const still=Math.hypot(P.vx,P.vy)<15;P.stillT=still?(P.stillT||0)+dt:0;
 const kd=nearDoorK(P,30,[T.DOOR]);
 if(kd>=0&&P.stillT>0.4){if(!G.auto||G.auto.type!=='stack'||G.auto.k!==kd){const side=doorSide(kd,P),sp=stackSpots(kd,side,fol.length+1);const pt=sp.slice().sort((a,b)=>Math.hypot(a%world.w*16+8-P.x-5,(a/world.w|0)*16+8-P.y-5)-Math.hypot(b%world.w*16+8-P.x-5,(b/world.w|0)*16+8-P.y-5))[0];
   const spots=sp.filter(s=>s!==pt);G.auto={type:'stack',k:kd,f:P.f};fol.forEach((a,i)=>a.goal=spots.length?{f:P.f,k:spots[i%spots.length]}:null);}}
 else if(G.auto&&G.auto.type==='stack'&&(kd!==G.auto.k||world.t[G.auto.k]!==T.DOOR)&&!(kd===G.auto.k&&P.stillT>0)){G.auto=null;for(const a of fol)a.goal=null;}
 if(room>=0&&room!==G.lastRoom){G.lastRoom=room;const rm=world.rooms[room];
  if(rm.fn!=='pasillo'&&rm.tiles.length>=9&&(!G.auto||G.auto.type!=='stack')){const near=fol.filter(a=>{const d=flowAt(flowP,a);return d>=0&&d<14;});const sp=roomSpots(pk%world.w,pk/world.w|0,near.length+1,[pk]).filter(t=>t!==pk);
   G.auto={type:'clear',room,f:P.f,said:false};near.forEach((a,i)=>a.goal=sp.length?{f:P.f,k:sp[i%sp.length]}:null);}}
 else if(G.auto&&G.auto.type==='clear'&&room!==G.auto.room){G.auto=null;for(const a of fol)a.goal=null;}
 else if(room<0&&G.lastRoom!==-1){G.lastRoom=-1;}
 if(G.auto&&G.auto.type==='clear'&&!G.auto.said&&fol.filter(a=>a.goal).every(a=>a.atGoal)&&fol.some(a=>a.goal)){G.auto.said=true;const hot=fol.some(a=>a.target);say(fol[0],hot?'contact':'clear',true);}}

// ===================== EQUIPO (IA) =====================
function hostileFrom(a,R){const[cx,cy]=ctr(a);let th=null,td=R;for(const s of sus){if(s.dead||!s.armed||s.st==='surr'||s.st==='cuffed')continue;const[sx,sy]=ctr(s),d=Math.hypot(sx-cx,sy-cy);if(d>=td||!losO(cx,cy,sx,sy))continue;th=s;td=d;}return th;}
function clearShot(a,t,w){const[ax,ay]=ctr(a),[tx,ty]=ctr(t),dx=tx-ax,dy=ty-ay,L2=dx*dx+dy*dy||1,L=Math.sqrt(L2);
 for(const o of agents.concat(civs)){if(o===a||o.dead||o.gone)continue;const[ox,oy]=ctr(o),u=((ox-ax)*dx+(oy-ay)*dy)/L2;if(u<0||u>(o.kind==='civ'?1.8:1.1))continue;const px=ax+dx*u-ox,py=ay+dy*u-oy,r=9+(w?w.spr:0)*u*L*1.1;if(px*px+py*py<r*r)return false;}return true;}
function findTask(a){const[cx,cy]=ctr(a);let best=null,bd=a.ord?110:170;a.taskCd=G.time+0.5;
 const taken=new Set();for(const o of agents)if(o!==a&&o.task)taken.add(o.task.e);if(P.act)taken.add(P.act.e);
 const nearP=e=>a.ord||P.f!==a.f||dist(e,P)<240;
 for(const s of sus){if(s.dead||s.st==='cuffed'||taken.has(s))continue;if(s.st!=='surr'&&!(s.stun>0.6))continue;const[sx,sy]=ctr(s),d=Math.hypot(sx-cx,sy-cy);if(d<bd&&losO(cx,cy,sx,sy)&&nearP(s)){bd=d;best={type:'cuff',e:s,t:0};}}
 if(!best)for(const c of civs){if(c.dead||c.gone||c.st==='safe'||taken.has(c))continue;const[sx,sy]=ctr(c),d=Math.hypot(sx-cx,sy-cy);if(d<bd&&losO(cx,cy,sx,sy)&&nearP(c)){bd=d;best={type:'safe',e:c,t:0};}}
 return best;}
function updateAlly(a,dt){
 if(a.dead)return;a.cd-=dt;a.mflash-=dt;a.shoutCd-=dt;a.flash-=dt;
 if(a.stun>0){a.stun-=dt;steer(a,null,0,dt);return;}
 const w=WPN[a.w];
 if(a.reload>0){a.reload-=dt;if(a.reload<=0)a.mag=w.mag;}
 const th=hostileFrom(a,290);
 if(th){if(a.target!==th){a.target=th;a.react=rand(0.3,0.5);if(a.shoutCd<=0&&th.st!=='fight'){doShout(a,0.7);a.shoutCd=2.5;}else say(a,'contact');}
  const[cx,cy]=ctr(a),[tx,ty]=ctr(th),ang=Math.atan2(ty-cy,tx-cx);a.ang=turnTo(a.ang,ang,dt*8);a.react-=dt;
  if(a.react<=0&&th.stun<=0&&a.cd<=0&&a.reload<=0&&Math.abs(angDiff(ang,a.ang))<0.15&&clearShot(a,th,w)){
   if(a.mag<=0){a.reload=w.rel*(w.shell?3:1);magDrop(a,w.shell);sfxAt('reload',a.x+5,a.y+5);}else{a.mag--;a.cd=w.rof*(w.pel?1.4:1.2);shoot(a,w,1.15);}}
  a.task=null;}
 else{a.target=null;if(a.mag<w.mag*0.4&&a.reload<=0){a.reload=w.rel*(w.shell?3:1);magDrop(a,w.shell);sfxAt('reload',a.x+5,a.y+5);}}
 const busy=a.ord&&(a.ord.mode==='stack'||a.ord.mode==='breach'||a.ord.mode==='enter'||a.ord.mode==='move');
 if(!th&&!a.task&&!busy&&G.time>(a.taskCd||0))a.task=findTask(a);
 let dir=null,spd=76;a.atGoal=false;
 if(a.task){const e=a.task.e,bad=a.task.type==='cuff'?(e.dead||e.st==='cuffed'||(e.st!=='surr'&&e.stun<=0)||e.f!==a.f):(e.dead||e.gone||e.st==='safe'||e.f!==a.f);
  if(bad)a.task=null;
  else{const d=dist(a,e);
   if(d>13){if(!a.task.f||G.time>a.task.ft){a.task.f=computeFlow((e.x+5)/TS|0,(e.y+5)/TS|0);a.task.ft=G.time+0.7;}dir=flowStep(a,a.task.f);if(!dir){const l=d||1;dir=[(e.x-a.x)/l,(e.y-a.y)/l];}a.task.t=0;}
   else{a.task.t+=dt;a.ang=turnTo(a.ang,Math.atan2(e.y-a.y,e.x-a.x),dt*8);if(a.task.t>=(a.task.type==='cuff'?1.3:0.8)){completeAct(a.task.type,e,a);a.task=null;}}}}
 if(!a.task){a.goF=undefined;
  if(a.goal){const g=a.goal;if(g.f!==a.f){a.goF=g.f;dir=flowStep(a,flowS);}
   else{if(a.gk!==g.k){a.gk=g.k;a.gflow=computeFlow(g.k%world.w,g.k/world.w|0);}const d=flowAt(a.gflow,a);dir=flowStep(a,a.gflow);if(d===0&&!dir)a.atGoal=true;if(d<=1&&d>=0)spd=50;}}
  else if(!a.ord){if(a.f!==P.f){a.goF=P.f;dir=flowStep(a,flowS);}else{const d=flowAt(flowP,a),want=1+((a.rank/2)|0);if(d>want||d<0)dir=flowStep(a,flowP);}if(th)spd=48;}}
 let sx=0,sy=0;for(const o of agents){if(o===a||o.dead)continue;const dx=a.x-o.x,dy=a.y-o.y,d=Math.hypot(dx,dy);if(d<11&&d>0.01){const f=(11-d)/11*(o===P?1.8:a.atGoal?0.3:1);sx+=dx/d*f;sy+=dy/d*f;}}
 if(dir){dir=[dir[0]+sx*0.6,dir[1]+sy*0.6];const l=Math.hypot(dir[0],dir[1])||1;dir=[dir[0]/l,dir[1]/l];if(!th&&!(a.task&&a.task.t>0))a.ang=turnTo(a.ang,Math.atan2(dir[1],dir[0]),dt*6);}
 else if(Math.hypot(sx,sy)>0.08){const l=Math.hypot(sx,sy);dir=[sx/l,sy/l];spd=30*Math.min(1,l);}
 steer(a,dir,spd,dt);
 if(!th&&!a.task&&(a.atGoal||!dir)){let face=null;const O=a.ord;
  if(O&&(O.mode==='stack'||O.mode==='breach')&&O.f===a.f){const[dx,dy]=doorCenter(O.k);face=Math.atan2(dy-a.y-5,dx-a.x-5);}
  else if(G.auto&&G.auto.type==='stack'&&!a.ord&&a.goal){const[dx,dy]=doorCenter(G.auto.k);face=Math.atan2(dy-a.y-5,dx-a.x-5);}
  else if(a.atGoal){const rm=world.room[tkey(a)];if(rm>=0){const r=world.rooms[rm];face=Math.atan2(((r.y0+r.y1)/2+0.5)*TS-a.y-5,((r.x0+r.x1)/2+0.5)*TS-a.x-5);}}
  if(face===null){a.wT=(a.wT||0)-dt;if(a.wT<0){a.wT=rand(1.5,3.5);a.watch=P.ang+(a.rank%2?1:-1)*rand(0.3,1.4);}face=a.watch??a.ang;}
  a.ang=turnTo(a.ang,face,dt*3);}}

// ===================== SOSPECHOSOS Y CIVILES =====================
function susFire(s,ST){if(s.cd>0)return;const[cx,cy]=ctr(s),n=ST.pel||1,sp=ST.spr*DF.acc*(s.seeT<0.8?1.7:1);
 for(let i=0;i<n;i++){const a=s.ang+rand(-sp,sp);bullets.push({x:cx+Math.cos(s.ang)*9,y:cy+Math.sin(s.ang)*9,vx:Math.cos(a)*ST.sp,vy:Math.sin(a)*ST.sp,life:ST.pel?0.4:0.9,dmg:ST.dmg*DF.dmg,from:'s',src:s,pel:!!ST.pel});}
 s.burstN++;if(s.burstN>=ST.burst){s.burstN=0;s.cd=(ST.gap||ST.rof)*rand(0.9,1.4);}else s.cd=ST.rof;
 s.mflash=0.06;smokeAt(cx+Math.cos(s.ang)*11,cy+Math.sin(s.ang)*11,ST.pel?3:1,{r:[1.5,2.5],life:[0.6,1.1],col:'#8a8a8e',a:0.18,sp:12,grow:6});sfxAt('gun',cx,cy,{pistol:'pistol',long:'smg',rifle:'rifle',shotgun:'shotgun'}[ST.kind]);noise(cx,cy,300);G.inten=1;}
function updateSus(s,dt){
 if(s.dead||s.st==='cuffed')return;
 s.flash-=dt;s.shoutCd-=dt;s.cd-=dt;s.mflash-=dt;
 const[cx,cy]=ctr(s);
 if(s.stun>0){s.stun-=dt;s.ang+=Math.sin(G.t*7+s.seed)*dt*1.5;steer(s,null,0,dt);if(s.st==='idle')s.st='alert';s.seeing=false;return;}
 if(s.st==='surr'){s.surrT+=dt;steer(s,null,0,dt);
  if(s.surrT>s.fakeT){const gun=items.find(i=>i.type==='gun'&&i.owner===s);let near=false;for(const a of agents)if(!a.dead&&dist(a,s)<40)near=true;
   if(gun&&!near){items.splice(items.indexOf(gun),1);s.armed=true;s.st='fight';s.react=0.2;s.alertT=9;s.seeing=true;say(s,'fake',true);}else s.fakeT=s.surrT+rand(2,4);}
  return;}
 const ST=STYPE[s.type];
 let tgt=null,td=1e9;
 for(const a of agents){if(a.dead)continue;const[ax,ay]=ctr(a),d=Math.hypot(ax-cx,ay-cy);if(d>280||d>=td)continue;
  const inDark=darkAt(ax,ay),lit=a.light!==false||a.mflash>0;if(inDark&&!lit&&d>48)continue;
  if(s.st==='idle'&&d>44&&!(inDark&&lit)&&Math.abs(angDiff(Math.atan2(ay-cy,ax-cx),s.ang))>1.05)continue;
  if(!losO(cx,cy,ax,ay))continue;tgt=a;td=d;}
 if(tgt){const[ax,ay]=ctr(tgt),a=Math.atan2(ay-cy,ax-cx);s.lx=ax;s.ly=ay;s.alertT=10;s.seeT+=dt;
  if(!s.seeing){s.seeing=true;const fresh=(s.lost||9)>=1.5;s.react=(fresh?0.62:0.28)*DF.react*rand(0.8,1.3);if(s.st==='idle'||s.st==='alert')s.st=s.armed?'fight':'flee';
   if(fresh)say(s,s.captor?'captor':s.armed?(Math.random()<.6?'spot':'fight'):'flee');}
  s.lost=0;
  if(s.armed){s.st='fight';s.ang=turnTo(s.ang,a,dt*5);s.react-=dt;if(s.react<=0&&Math.abs(angDiff(a,s.ang))<0.3)susFire(s,ST);
   if(s.aggr&&!s.captor&&td>100&&tgt.f===s.f&&flowP)steer(s,flowStep(s,flowP),50,dt);else steer(s,null,0,dt);}
  else{s.st='flee';const d=flowP?flowStep(s,flowP,true):null;s.ang=turnTo(s.ang,d?Math.atan2(d[1],d[0]):a+Math.PI,dt*6);steer(s,d,70,dt);
   if(!d||Math.hypot(s.vx,s.vy)<10){s.corner=(s.corner||0)+dt;if(s.corner>1.2&&td<130)surrender(s);}else s.corner=0;}}
 else{s.seeT=0;if(s.seeing){s.seeing=false;s.lost=0;}s.lost=(s.lost||0)+dt;
  if(s.st!=='idle'){s.alertT-=dt;const la=Math.atan2(s.ly-cy,s.lx-cx);
   if(s.armed&&s.aggr&&!s.captor&&s.alertT>0&&Math.hypot(s.lx-cx,s.ly-cy)>24&&P.f===s.f&&flowP){const d=flowStep(s,flowP);steer(s,d,44,dt);if(d)s.ang=turnTo(s.ang,Math.atan2(d[1],d[0]),dt*4);}
   else{steer(s,null,0,dt);s.ang=turnTo(s.ang,la,dt*3);}
   if(s.alertT<=0)s.st='alert';}
  else{s.wT-=dt;if(s.wT<0){s.wT=rand(2,5);s.wa=rand(0,6.283);}s.ang=turnTo(s.ang,s.wa,dt*1.2);steer(s,null,0,dt);}}}
function updateCiv(c,dt){if(c.dead||c.gone)return;c.flash-=dt;
 if(c.stun>0){c.stun-=dt;steer(c,null,0,dt);return;}
 const[cx,cy]=ctr(c);
 switch(c.st){
  case'safe':{const d=flowStep(c,flowX);steer(c,d,58,dt);if(d)c.ang=turnTo(c.ang,Math.atan2(d[1],d[0]),dt*6);if(c.f===0&&cy>(world.by1+1.5)*TS)c.gone=true;break;}
  case'panic':{c.panT-=dt;const ax=cx-c.fx,ay=cy-c.fy,l=Math.hypot(ax,ay)||1;steer(c,[ax/l,ay/l],62,dt);c.ang=turnTo(c.ang,Math.atan2(ay,ax),dt*8);if(c.panT<=0)c.st='cower';break;}
  case'comply':case'cower':steer(c,null,0,dt);break;
  default:{c.wT-=dt;if(c.wT<0){c.wT=rand(2,6);c.wa=rand(0,6.283);c.walkT=Math.random()<0.4?rand(0.5,1.5):0;}c.ang=turnTo(c.ang,c.wa,dt*2);if(c.walkT>0){c.walkT-=dt;steer(c,[Math.cos(c.ang),Math.sin(c.ang)],22,dt);}else steer(c,null,0,dt);}}}

// ===================== DAÑO =====================
function bloodAt(x,y,n){for(let i=0;i<n;i++){const a=rand(0,6.283),s=rand(20,70);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(0.15,0.35),max:0.35,c:'#a01818',sz:1,drag:6,col:true,stamp:'#6a1010'});}}
function pool(x,y){const d=world.dctx;d.fillStyle='rgba(90,10,10,0.55)';for(let i=0;i<10;i++){const a=rand(0,6.283),r=rand(0,5);d.beginPath();d.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,rand(1.5,3.5),0,6.283);d.fill();}}
const hasShield=e=>e===P?curW().shield:e.kind==='agent'&&WPN[e.w]&&WPN[e.w].shield;
function hitChar(e,b){const[x,y]=ctr(e);
 if(e.kind==='agent'&&!b.boom&&hasShield(e)&&Math.abs(angDiff(Math.atan2(-b.vy,-b.vx),e.ang))<1.1){SFX.clank();for(let i=0;i<4;i++){const a=rand(0,6.283),s=rand(30,90);parts.push({x:x+Math.cos(e.ang)*7,y:y+Math.sin(e.ang)*7,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0.15,max:0.15,c:'#fff0a0',sz:1,drag:4,glow:true});}return;}
 e.flash=0.08;bloodAt(x,y,4);SFX.hit();
 if(e.kind==='agent'){if(e===P&&P.inv>0)return;e.hp-=b.dmg*(1-(e.armor||0));
  if(e===P){G.hurtFlash=0.35;G.shake=Math.max(G.shake,3);SFX.hurt();}
  if(e.hp<=0&&!e.dead){e.dead=true;sfxAt('die',x,y);pool(x,y);logEv('down',e,null);if(e!==P){G.stats.down++;radio('¡'+e.name+' ABATIDO!','#ff3a3a');const o=agents.find(o=>o!==e&&o!==P&&!o.dead);if(o)say(o,'down',true);}else radio('¡AGENTE CAIDO!','#ff3a3a');}return;}
 e.vx+=b.vx*0.05;e.vy+=b.vy*0.05;e.hp-=b.dmg;
 if(e.kind==='sus'){if(e.st==='idle'||e.st==='alert'){e.st=e.armed?'fight':'flee';e.react=Math.min(e.react,0.3);e.alertT=9;if(b.src){e.lx=b.src.x+5;e.ly=b.src.y+5;}}
  if(e.hp<=0)killSus(e,b.from,b.src);
  else{if(Math.random()<0.35)say(e,'hurt');if(e.armed&&e.st==='fight'&&Math.random()<0.3*(1-e.hp/e.max)*DF.surr)surrender(e);}}
 else{if(b.from==='a'&&!e.hurtA){e.hurtA=true;G.stats.civHurt++;}
  if(e.hp<=0){e.dead=true;sfxAt('die',x,y);pool(x,y);if(e.st==='safe')G.stats.civ--;if(b.from==='a'){G.stats.civK++;logEv('civk',e,b.src);radio('¡CIVIL ABATIDO POR LA POLICIA!','#ff3a3a');}else{G.stats.hostK++;logEv('civk',e,null);radio('¡HAN MATADO A UN CIVIL!','#ff3a3a');}}
  else if(e.st!=='safe'){if(e.st!=='panic')say(e,'civ');e.st='panic';e.panT=2;e.fx=b.x-b.vx*0.05;e.fy=b.y-b.vy*0.05;}}}
function killSus(s,from,src){const justified=(s.armed&&s.st!=='surr')||(s.st==='surr'&&G.time-(s.surrAt||0)<0.4);s.dead=true;const[x,y]=ctr(s);sfxAt('die',x,y);pool(x,y);
 if(from==='a'){if(justified){G.stats.neu++;logEv('kill',s,src);}else{G.stats.unj++;logEv('unj',s,src);radio('FUERZA INJUSTIFICADA.','#ff9a2a');}}else logEv('kill',s,null);
 if(s.boss)G.stats.bossDead=1;
 if(s.armed)items.push({type:'gun',x:x+Math.cos(s.ang)*8,y:y+Math.sin(s.ang)*8,a:s.ang,owner:null});s.armed=false;}

// ===================== PROYECTILES =====================
function updateBullets(dt){
 for(const b of bullets){const st=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/4)),sx=b.vx*dt/st,sy=b.vy*dt/st;
  for(let i=0;i<st&&!b.dead;i++){b.x+=sx;b.y+=sy;const tx=b.x/TS|0,ty=b.y/TS|0,t=tget(tx,ty);
   if(t===T.WALL||t===T.DOOR){b.dead=true;const hx=b.x-sx,hy=b.y-sy;for(let k=0;k<3;k++){const a=rand(0,6.283),s=rand(30,90);parts.push({x:hx,y:hy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(0.08,0.2),max:0.2,c:t===T.DOOR?'#a8744a':'#ffe0a0',sz:1,drag:4,glow:t!==T.DOOR});}
    world.dctx.fillStyle='rgba(0,0,0,0.6)';world.dctx.fillRect(Math.round(hx),Math.round(hy),1,1);break;}
   if(t===T.WIN){const k=ty*world.w+tx;if(!world.winBroken.has(k)){world.winBroken.add(k);sfxAt('glass',b.x,b.y);drawWin(world.base0.getContext('2d'),tx,ty);rebaseTile(world,tx,ty);for(let q=0;q<8;q++){const a=rand(0,6.283),s=rand(20,80);parts.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(0.2,0.5),max:0.5,c:'#bfe8ff',sz:1,drag:5,col:true,stamp:'#7fb8d8'});}}}
   const lists=b.from==='a'?[sus,civs]:[agents,civs];
   for(const L of lists){for(const e of L){if(e.dead||e.gone||e===b.src||(b.hit&&b.hit.includes(e)))continue;
     if(b.x>e.x-1&&b.x<e.x+e.w+1&&b.y>e.y-1&&b.y<e.y+e.h+1){hitChar(e,b);if(b.pierce>0){b.pierce--;(b.hit=b.hit||[]).push(e);}else b.dead=true;break;}}if(b.dead)break;}}
  b.life-=dt;if(b.life<=0)b.dead=true;}
 bullets=bullets.filter(b=>!b.dead);}
const nadeSolid=(x,y)=>{const t=tget(x/TS|0,y/TS|0);return t===T.WALL||t===T.DOOR||t===T.WIN;};
function updateNades(dt){for(const n of nades){n.fuse-=dt;n.vz-=400*dt;n.z+=n.vz*dt;if(n.z<=0){n.z=0;if(n.vz<-40){n.vz*=-0.35;sfxAt('bounce',n.x,n.y);}else n.vz=0;n.vx*=Math.max(0,1-dt*5);n.vy*=Math.max(0,1-dt*5);}
  n.rot+=dt*10;const nx=n.x+n.vx*dt;if(nadeSolid(nx,n.y)){n.vx*=-0.45;sfxAt('bounce',n.x,n.y);}else n.x=nx;const ny=n.y+n.vy*dt;if(nadeSolid(n.x,ny)){n.vy*=-0.45;sfxAt('bounce',n.x,n.y);}else n.y=ny;
  if(n.fuse<=0){n.dead=true;flashBang(n.x,n.y);}}nades=nades.filter(n=>!n.dead);}
function flashBang(x,y){sfxAt('flash',x,y);smokeAt(x,y,10,{r:[4,8],life:[3,5],col:'#b8b8bc',a:0.5,sp:22,grow:4});flashes.push({x,y,r:150,life:0.5,max:0.5});G.shake=Math.max(G.shake,4);noise(x,y,320);
 for(let i=0;i<20;i++){const a=rand(0,6.283),s=rand(40,160);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(0.15,0.4),max:0.4,c:'#ffffff',sz:1,drag:5,glow:true});}
 const d0=world.dctx;d0.globalAlpha=0.25;d0.fillStyle='#000';d0.beginPath();d0.arc(x,y,5,0,6.283);d0.fill();d0.globalAlpha=1;
 for(const e of sus.concat(civs)){if(e.dead||e.gone||e.st==='cuffed')continue;const[ex,ey]=ctr(e),d=Math.hypot(ex-x,ey-y);if(d<125&&losO(x,y,ex,ey)){e.stun=Math.max(e.stun,4*(1-d/170));if(e.kind==='sus'&&e.st==='idle')e.st='alert';}}
 for(const a of agents){if(a.dead)continue;const[ax,ay]=ctr(a),d=Math.hypot(ax-x,ay-y);if(d<115&&losO(x,y,ax,ay)&&Math.abs(angDiff(Math.atan2(y-ay,x-ax),a.ang))<1.5){if(a===P){G.blind=Math.max(G.blind,1.9*(1-d/150));SFX.ring();}else if(!(a.ord&&a.ord.mode==='breach'))a.stun=Math.max(a.stun,1.2);}}}
function smokeAt(x,y,n,o){for(let i=0;i<n;i++){const a=rand(0,6.283),sp=rand(0.2,1)*o.sp;smoke.push({x:x+rand(-3,3),y:y+rand(-3,3),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:rand(o.r[0],o.r[1]),grow:o.grow*rand(0.7,1.3),life:rand(o.life[0],o.life[1]),max:0,a:o.a*rand(0.7,1),c:o.col,rot:rand(0,6.283)});smoke[smoke.length-1].max=smoke[smoke.length-1].life;}if(smoke.length>220)smoke.splice(0,smoke.length-220);}
function updateParts(dt){for(const s of smoke){s.life-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=1-dt*1.2;s.vy*=1-dt*1.2;s.vx+=0.6*dt;s.r+=s.grow*dt*(s.life/s.max);}smoke=smoke.filter(s=>s.life>0);
 for(const p of parts){p.life-=dt;const dr=p.drag||0;p.vx*=Math.max(0,1-dr*dt);p.vy*=Math.max(0,1-dr*dt);p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.life<=0&&p.stamp&&world){world.dctx.fillStyle=p.stamp;world.dctx.fillRect(p.x|0,p.y|0,p.sz,p.sz);}}
 parts=parts.filter(p=>p.life>0);
 for(const p of popups){p.life-=dt;p.y-=12*dt;}popups=popups.filter(p=>p.life>0);
 for(const f of flashes)f.life-=dt;flashes=flashes.filter(f=>f.life>0);}
function updateItems(){for(const it of items){if(it.type!=='gun')continue;for(const a of agents){if(a.dead)continue;const[ax,ay]=ctr(a);if(Math.hypot(ax-it.x,ay-it.y)<9){it.dead=true;G.stats.guns++;popup(it.x,it.y-8,'ARMA ASEGURADA','#c8d0c0');SFX.pick();break;}}}items=items.filter(i=>!i.dead);}

// ===================== FLUJO DE PARTIDA =====================
function remaining(){let s=0,c=0,ev=0;for(const e of ALLS)if(!e.dead&&e.st!=='cuffed')s++;for(const e of ALLC)if(!e.dead&&e.st!=='safe'&&!e.gone)c++;for(const L of LV)for(const i of L.items)if(i.type==='ev')ev++;return{s,c,ev};}
function computeResults(){const S=G.stats,M=G.M,lines=[];
 const add=(l,n,v)=>{if(n)lines.push([l+' X'+n,n*v]);};
 add('DETENIDOS',S.arr,100);add('NEUTRALIZADOS',S.neu,25);add('CIVILES A SALVO',S.civ,50);add('PRUEBAS',S.ev,75);add('ARMAS ASEGURADAS',S.guns,10);
 if(M.boss)lines.push(S.boss?['CAPO DETENIDO VIVO',300]:['CAPO ABATIDO',-150]);
 add('FUERZA INJUSTIFICADA',S.unj,-150);add('CIVILES HERIDOS',S.civHurt,-40);add('CIVILES MUERTOS (POLICIA)',S.civK,-300);add('REHENES PERDIDOS',S.hostK,-100);add('AGENTES CAIDOS',S.down,-120);
 const tb=Math.max(0,Math.round((M.par-G.time)*3));lines.push(['TIEMPO '+fmtT(G.time)+' (BONUS)',tb]);
 const raw=lines.reduce((a,l)=>a+l[1],0),total=Math.max(0,Math.round(raw*DF.score));
 const max=G.nSus*100+G.nCiv*50+G.nEv*75+(M.boss?300:0),ratio=raw/Math.max(1,max);
 const grade=ratio>=0.95&&!S.unj&&!S.civK&&!S.down?'S':ratio>=0.8?'A':ratio>=0.6?'B':ratio>=0.4?'C':'D';
 const ch=[!S.down&&!S.civK&&!S.hostK,S.arr>=G.nSus,G.time<=M.par];
 let rec=false,unl=[];
 if(M.idx>=0){const before=totalStars(),bits=ch.reduce((a,c,i)=>a|(c?1<<i:0),0);LS.set('st_'+M.idx,starsOf(M.idx)|bits);LS.set('done_'+M.idx,1);const after=totalStars();
  if(after>before){if(before<SHIELD_STAR&&after>=SHIELD_STAR)unl.push('ESCUDO BALISTICO');for(const k in TAC){const s=TAC[k].star;if(s&&before<s&&after>=s)unl.push(TAC[k].n);}}
  const best=getBest(M.idx);rec=!best||total>best.s;if(rec)setBest(M.idx,{s:total,g:grade});}
 else{G.run.score+=total;}
 G.res={lines,total,grade,rec,ch,unl};G.rmapF=0;}
function endRun(){if(!G.run)return;const runs=LS.get('runs_'+DFi,[]);runs.push({s:G.run.score,l:G.run.lvl});runs.sort((a,b)=>b.s-a.s);LS.set('runs_'+DFi,runs.slice(0,10));G.runEnd={s:G.run.score,l:G.run.lvl,top:runs[0]&&runs[0].s===G.run.score};G.run=null;}
const fmtT=t=>{t=Math.max(0,t|0);return(t/60|0)+':'+String(t%60).padStart(2,'0');};
function updateCamera(dt){const[cx,cy]=ctr(P);const lx=(mouse.x-W/2)*0.3,ly=(mouse.y-H/2)*0.3;let tx=cx-W/2+lx,ty=cy-H/2+ly;const mx=world.w*TS-W,my=world.h*TS-H;tx=mx<0?mx/2:clamp(tx,0,mx);ty=my<0?my/2:clamp(ty,0,my);const k=Math.min(1,dt*7);G.camx+=(tx-G.camx)*k;G.camy+=(ty-G.camy)*k;}
function updateGame(dt){
 if(G.state==='play')G.time+=dt;G.inten=Math.max(0,G.inten-dt*0.12);G.lockHint=Math.max(0,(G.lockHint||0)-dt);G.blind=Math.max(0,G.blind-dt);G.msgT-=dt;G.floorMsg=Math.max(0,(G.floorMsg||0)-dt);
 if(G.orderPt)G.orderPt[2]-=dt;for(const c of G.cams)c.t-=dt;G.cams=G.cams.filter(c=>c.t>0);
 const pf=P.f;let pDone=false;
 for(let f=0;f<LV.length;f++){useLevel(f);const L=world;
  if(f===P.f){const k=tkey(P);if(k!==L.ptk||!L.flowP){L.flowP=computeFlow(k%L.w,k/L.w|0);L.ptk=k;}}else{L.flowP=L.flowS;L.ptk=-1;}
  flowP=L.flowP;
  if(f===P.f&&!P.dead&&!pDone){updatePlayer(dt);pDone=true;}
  updateOrders(dt);
  for(const a of agents)if(a!==P)updateAlly(a,dt);
  for(const s of sus)updateSus(s,dt);
  for(const c of civs)updateCiv(c,dt);
  updateBullets(dt);updateNades(dt);updateParts(dt);updateItems();updateC4(dt);
  saveLevel();}
 if(P.f!==pf){G.lastRoom=-2;G.auto=null;for(const a of ALLA)if(!a.ord)a.goal=null;}
 useLevel(P.f);if(P.dead)G.prompt=null;
 for(const r of G.radio)r.t-=dt;G.radio=G.radio.filter(r=>r.t>0);
 updateCamera(dt);
 if(P.dead){G.deadT+=dt;if(G.deadT>1.8&&G.state==='play'){G.state='fail';G.debT=0;SFX.fail();if(G.run)endRun();}return;}
 if(G.state==='play'){const r=remaining();if(!r.s&&!r.c&&!r.ev){G.state='clear';G.clearT=0;SFX.clear();radio('CENTRAL: ZONA ASEGURADA. BUEN TRABAJO.','#7dff3a');central('Aquí central.|Zona asegurada.|Buen trabajo, equipo.','calm');}}
 else if(G.state==='clear'){G.clearT+=dt;if(G.clearT>2.6){computeResults();G.state='debrief';G.debT=0;}}}
