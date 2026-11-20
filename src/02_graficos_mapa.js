function norm(s){return String(s).toUpperCase();}
const FUI="'DejaVu Sans Mono','Menlo','Consolas','Liberation Mono','Courier New',monospace",FBIG="Impact,'Haettenschweiler','Arial Narrow Bold','Arial Black',sans-serif";
function text(s,x,y,col='#fff',sc=1,al='left',sh='#000'){s=norm(s);const big=sc>=3,fs=big?sc*6.4:sc*6.5;ctx.font=(big?'':'bold ')+fs.toFixed(2)+'px '+(big?FBIG:FUI);ctx.textBaseline='top';ctx.textAlign=al;
 const yy=y-(big?sc*1.1:sc*0.75);if(sh){ctx.fillStyle=sh;ctx.fillText(s,x+sc*0.55,yy+sc*0.55);}ctx.fillStyle=col;ctx.fillText(s,x,yy);ctx.textAlign='left';}
const tw=(s,sc=1)=>norm(s).length*4*sc-sc;
const STAR=["..#..","#####",".###.",".#.#.","#...#"];
function star(x,y,on){for(let j=0;j<5;j++)for(let i=0;i<5;i++)if(STAR[j][i]==='#'){ctx.fillStyle=on?'#ffd23a':'#2a3450';ctx.fillRect(x+i,y+j,1,1);}}

// ===================== SPRITES =====================
const PAL0={d:'#0b0d12',s:'#d29a74',k:'#1a1a1e',K:'#5a5a64',W:'#c0c0cc',n:'#5a3a20',N:'#8a5a30',y:'#ffd23a',c:'#d8dce8',w:'#ffffff',r:'#c02020',b:'#3a6ad0',v:'#7fb8d8'};
function scale2x(src){const w=src.width,h=src.height,sd=src.getContext('2d').getImageData(0,0,w,h),d=new ImageData(w*2,h*2),a=new Uint32Array(sd.data.buffer),o=new Uint32Array(d.data.buffer),W2=w*2;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i0=y*w+x,P=a[i0],A=y>0?a[i0-w]:P,B=x<w-1?a[i0+1]:P,C=x>0?a[i0-1]:P,D=y<h-1?a[i0+w]:P;let e0=P,e1=P,e2=P,e3=P;
  if(C===A&&C!==D&&A!==B)e0=A;if(A===B&&A!==C&&B!==D)e1=B;if(D===C&&D!==B&&C!==A)e2=C;if(B===D&&B!==A&&D!==C)e3=D;const i=y*2*W2+x*2;o[i]=e0;o[i+1]=e1;o[i+W2]=e2;o[i+W2+1]=e3;}
 const c=mk(w*2,h*2);c.getContext('2d').putImageData(d,0,0);return c;}
function sprite(rows,pal){const h=rows.length,w=Math.max(...rows.map(r=>r.length));const c0=mk(w,h),x=c0.getContext('2d');
 rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){if(r[i]==='.')continue;const col=(pal&&pal[r[i]])||PAL0[r[i]];if(col){x.fillStyle=col;x.fillRect(i,j,1,1);}}});
 const c=scale2x(scale2x(c0));c.lw=w;c.lh=h;const o=mk(c.width,c.height),ox=o.getContext('2d');ox.drawImage(c,0,0);ox.globalCompositeOperation='source-in';ox.fillStyle='#fff';ox.fillRect(0,0,o.width,o.height);o.lw=w;o.lh=h;c.white=o;return c;}
function spr(img,x,y){ctx.drawImage(img,x,y,img.lw||img.width,img.lh||img.height);}
const BASE=[
"....dddd........",
"...dgGGgd.......",
"..dgGGGGGd......",
"..dGGhhhGd......",
".dGGhHHHhd......",
".dGYhHHHhd......",
".dGghHHHhd......",
".dGYhHHHhd......",
".dGGhHHHhd......",
"..dGGhhhGd......",
"..dgGGGGGd......",
"...dgGGgd.......",
"....dddd........"];
const ARMS={
 pistol:[[5,10,'s'],[6,10,'ssKW'],[7,10,'s']],
 long:[[5,10,'kkk'],[6,10,'KKKKKW'],[7,10,'kkkk'],[8,11,'ss']],
 rifle:[[5,10,'kkkk'],[6,10,'KKKKKKKW'],[7,10,'kkkkk'],[8,11,'ss']],
 shotgun:[[5,10,'nnk'],[6,10,'nNKKKKW'],[7,10,'nnk'],[8,11,'ss']],
 shield:[[0,11,'kk'],[1,11,'kK'],[2,11,'kK'],[3,11,'kv'],[4,11,'kK'],[5,10,'skK'],[6,10,'skKKW'],[7,10,'skK'],[8,11,'kK'],[9,11,'kK'],[10,11,'kK'],[11,11,'kK'],[12,11,'kk']],
 unarmed:[[4,10,'s'],[8,10,'s']],
 up:[[2,8,'ss'],[10,8,'ss']],
 cuffed:[[5,0,'s'],[6,0,'c'],[7,0,'s']]};
const SPRC=new Map();
function charSpr(pk,pal,kind,fem){const key=pk+(fem?'f':'')+'|'+kind;let s=SPRC.get(key);if(s)return s;
 const r=BASE.map(l=>l.split(''));if(fem){r[5][3]='z';r[6][2]='z';r[6][3]='z';r[7][3]='z';r[6][1]='z';}for(const[y,x,str]of ARMS[kind]){while(r[y].length<x+str.length)r[y].push('.');for(let i=0;i<str.length;i++)if(str[i]!=='.')r[y][x+i]=str[i];}
 const p=Object.assign({Y:pal.G,z:pal.H==='#323844'||pal.H==='#3a414e'?'#5a3a1e':pal.H},pal);s=sprite(r.map(a=>a.join('')),p);SPRC.set(key,s);return s;}
const PAL_POL={G:'#2f4f99',g:'#1c2f60',H:'#323844',h:'#1b1f26',Y:'#ffd23a'};
const PAL_POLB={G:'#2f6a8a',g:'#1c4258',H:'#323844',h:'#1b1f26',Y:'#ffd23a'};
const PAL_PLY={G:'#4a7ae0',g:'#27489a',H:'#3a414e',h:'#1e232b',Y:'#ffd23a'};
const PAL_SUS=[{G:'#8a2a2a',g:'#5a1a1a',H:'#2a1a10',h:'#1a1008'},{G:'#55585e',g:'#36383d',H:'#3a2a1a',h:'#22180e'},{G:'#3d5a2a',g:'#26391a',H:'#141414',h:'#050505'},{G:'#2e2a2a',g:'#1a1616',H:'#6a4a2a',h:'#3a2a18'},{G:'#7a6a2a',g:'#4a401a',H:'#1a1a1a',h:'#0a0a0a'},{G:'#6a2a6a',g:'#401a40',H:'#2a1a10',h:'#140a04'}];
const PAL_CIV=[{G:'#c8c0b0',g:'#8a8478',H:'#c8a050',h:'#8a6a30'},{G:'#c05aa8',g:'#7a3a6a',H:'#2a1a10',h:'#1a1008'},{G:'#4a9ab0',g:'#2a5a6a',H:'#5a3a20',h:'#3a2410'},{G:'#e0a840',g:'#9a7020',H:'#202020',h:'#101010'},{G:'#9ad07a',g:'#5a8a4a',H:'#8a5a2a',h:'#5a3a18'}];
const SPR_EV=sprite(["..nnnn..",".nNNNNn.","nNwwwwNn","nNNNNNNn","nNwyywNn",".nnnnnn."]);
const SPR_GUN=sprite(["kKKKKW","kk....","k....."]);
const SPR_FLASH=sprite([".kK.","cccc","cwcc","cccc",".cc."]);
const SPR_C4=sprite(["kkkkkk","knnnnk","knrrnk","kNNNNk","kkkkkk"]);

// ===================== BALDOSAS =====================
const F=(x,c,a,b,w=1,h=1)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
function T16(fn,seed){const c=mk(TS,TS),x=c.getContext('2d');fn(x,mulberry(seed));return c;}
function speck(x,R,cols,n){for(let i=0;i<n;i++)F(x,cols[R()*cols.length|0],R()*16|0,R()*16|0);}
function floorStyle(x,R,st,v){
 switch(st){
 case'wood':F(x,'#6a4428',0,0,16,16);for(let j=0;j<4;j++){F(x,j%2?'#734b2d':'#653f25',0,j*4,16,4);F(x,'#4a2e18',0,j*4+3,16,1);F(x,'#4a2e18',(j*7+v*5)%16,j*4,1,3);}speck(x,R,['#7d5636','#5a3820'],10);break;
 case'conc':F(x,'#45484d',0,0,16,16);speck(x,R,['#4d5056','#3e4146','#52555a'],30);F(x,'#393b40',0,15,16,1);F(x,'#393b40',15,0,1,16);if(v===1)for(let i=0;i<10;i++)F(x,'#2c2a26',5+R()*6|0,5+R()*6|0,2,1);if(v===2)F(x,'#c8a020',0,7,16,1);break;
 case'dirty':F(x,'#3e3d36',0,0,16,16);speck(x,R,['#46453c','#35342e','#4a4a3a','#2e3a26'],40);if(v)for(let i=0;i<12;i++)F(x,R()<.5?'#3a4a2a':'#2a2a22',4+R()*8|0,4+R()*8|0,2,2);break;
 case'marble':for(let j=0;j<2;j++)for(let i=0;i<2;i++)F(x,(i+j+v)%2?'#c8c2b6':'#8e887c',i*8,j*8,8,8);speck(x,R,['#d8d2c6','#a49e92'],8);F(x,'#6e6a60',0,0,16,1);F(x,'#6e6a60',0,0,1,16);break;
 case'club':F(x,'#18121f',0,0,16,16);F(x,'#261a33',0,0,16,1);F(x,'#261a33',0,0,1,16);speck(x,R,['#1e1628','#130e18'],14);if(v===1){F(x,'#ff3aa0',3,3);F(x,'#3affe0',11,10);}if(v===2){F(x,'#3a1a4a',2,2,12,12);F(x,'#4a2a5e',3,3,10,10);}break;
 case'carpet':F(x,'#5a1e24',0,0,16,16);for(let i=0;i<16;i+=4)for(let j=0;j<16;j+=4)if(((i+j)/4)%2===0)F(x,'#66262c',i+1,j+1,2,2);speck(x,R,['#4e1a1f','#6a2a30'],12);if(v===1)F(x,'#a88a3a',7,7,2,2);break;
 case'carpetb':F(x,'#26344e',0,0,16,16);speck(x,R,['#2c3a56','#202c44'],30);if(v===1)F(x,'#3a4a6a',6,6,4,4);break;
 case'tile':F(x,'#b4b8bc',0,0,16,16);F(x,'#8a8e92',0,7,16,1);F(x,'#8a8e92',7,0,1,16);F(x,'#8a8e92',0,15,16,1);F(x,'#8a8e92',15,0,1,16);speck(x,R,['#c0c4c8','#a8acb0'],8);if(v===1)for(let i=0;i<6;i++)F(x,'#7a6a4a',R()*15|0,R()*15|0);break;
 case'street':F(x,'#26282c',0,0,16,16);speck(x,R,['#2e3034','#1f2124','#333539'],40);if(v===1)F(x,'#1a1b1e',R()*10|0,R()*10|0,5,3);break;
 case'alley':F(x,'#2e2c2a',0,0,16,16);speck(x,R,['#363431','#262422','#3a3632'],40);if(v===1)F(x,'#22201e',R()*10|0,R()*10|0,4,4);break;
 case'walk':F(x,'#6a6a66',0,0,16,16);speck(x,R,['#727270','#5e5e5a'],20);F(x,'#55554f',0,15,16,1);F(x,'#55554f',15,0,1,16);break;
 case'roof':F(x,'#3c3e44',0,0,16,16);speck(x,R,['#46484e','#33353a','#50525a','#2c2e33'],60);break;
 case'grass':F(x,'#1d3516',0,0,16,16);speck(x,R,['#25421c','#172c12','#2d5222'],40);for(let i=0;i<6;i++){F(x,'#3f7a2a',R()*15|0,1+R()*14|0,1,2);}if(v===1)for(let i=0;i<3;i++)F(x,R()<.5?'#d8d04a':'#d86aa0',R()*15|0,R()*15|0);break;
 }}
const FLOORS={};function floorTile(st,v){const k=st+v;if(!FLOORS[k])FLOORS[k]=T16((x,R)=>floorStyle(x,R,st,v),v*31+st.length*7+st.charCodeAt(0));return FLOORS[k];}

// ===================== TEMAS Y SALAS =====================
const THEMES={
 piso:{dark:0.2,n:'PISO',floor:'wood',wall:['#a8a090','#cfc8b8','#7a7264','#4e483e'],big:'salon',fns:['cocina','dormitorio','bano','dormitorio','salon'],song:1},
 nave:{dark:0.3,n:'NAVE INDUSTRIAL',floor:'conc',wall:['#666a70','#8a8f96','#44484e','#2c2f33'],big:'almacen',fns:['taller','oficina','vestuario','almacen','garaje'],song:2},
 banco:{dark:0.15,n:'BANCO',floor:'marble',wall:['#a89a80','#c8bca0','#6e6450','#463f32'],big:'vestibulo',one:'camara',fns:['oficina','archivo','reuniones','bano','oficina'],song:3},
 club:{dark:0.45,n:'CLUB',floor:'club',wall:['#3a2a4a','#5a3a6e','#24182e','#140c1c'],big:'pista',fns:['barra','vip','almacen','bano','oficina'],song:2},
 lab:{dark:0.4,n:'LABORATORIO',floor:'dirty',wall:['#66665a','#86866e','#44443a','#2a2a22'],big:'laboratorio',fns:['laboratorio','almacen','oficina','vestuario'],song:1},
 mansion:{dark:0.25,n:'MANSION',floor:'carpet',wall:['#9a8a6a','#bca888','#665a44','#40382a'],big:'salon',one:'despacho',fns:['cocina','dormitorio','bano','biblioteca','comedor','musica','dormitorio'],song:3},
 puerto:{dark:0.4,n:'ALMACEN PORTUARIO',floor:'conc',wall:['#5a646e','#76828e','#3a4148','#23282d'],big:'almacen',fns:['almacen','oficina','taller','vestuario','almacen'],song:2}};
let TH=THEMES.piso;
const RFN={
 salon:{n:'SALON',wall:['sofa','armario','tv','planta','estante'],ctr:['mesa'],d:0.09},
 cocina:{n:'COCINA',fl:'tile',wall:['encimera','nevera','fogon','encimera'],ctr:['mesa4'],d:0.13},
 dormitorio:{n:'DORMITORIO',wall:['cama','armario','planta'],ctr:[],d:0.12},
 bano:{n:'BAÑO',fl:'tile',wall:['banera','vater','lavabo'],ctr:[],d:0.25},
 pasillo:{n:'PASILLO',wall:['planta'],ctr:[],d:0.03},
 taller:{n:'TALLER',fl:'dirty',wall:['banco_t','estante','bidon','caja'],ctr:['coche'],d:0.07},
 almacen:{n:'ALMACEN',fl:'conc',wall:['estante','caja','caja','bidon','estante'],ctr:['contenedor','caja','caja'],d:0.08},
 oficina:{n:'OFICINA',fl:'carpetb',wall:['archivador','estante','planta'],ctr:['escritorio','escritorio'],d:0.1},
 vestuario:{n:'VESTUARIO',fl:'tile',wall:['taquilla','taquilla','lavabo'],ctr:['banco_p'],d:0.1},
 garaje:{n:'GARAJE',fl:'conc',wall:['estante','bidon'],ctr:['coche'],d:0.06},
 vestibulo:{n:'VESTIBULO',fl:'marble',wall:['planta','sillon','mostrador','planta'],ctr:['sillon'],d:0.05},
 camara:{n:'CAMARA ACORAZADA',fl:'conc',wall:['cajafuerte','oro','cajafuerte','oro'],ctr:[],d:0.2,armor:1,ev:1},
 archivo:{n:'ARCHIVO',wall:['archivador','archivador','estante'],ctr:['estante'],d:0.12,ev:1},
 reuniones:{n:'SALA DE REUNIONES',fl:'carpetb',wall:['planta'],ctr:['mesa4'],d:0.06},
 pista:{n:'PISTA DE BAILE',fl:'club',wall:['altavoz','altavoz','sofa'],ctr:[],d:0.05},
 barra:{n:'BARRA',wall:['barra','sillon'],ctr:['mesa'],d:0.08},
 vip:{n:'SALA VIP',fl:'carpet',wall:['sofa','sofa','planta'],ctr:['mesa'],d:0.1,ev:1},
 laboratorio:{n:'LABORATORIO',fl:'tile',wall:['mesalab','estante','bidon'],ctr:['mesalab'],d:0.11,ev:1},
 despacho:{n:'DESPACHO',fl:'carpet',wall:['libreria','cajafuerte','planta'],ctr:['escritorio'],d:0.1,armor:1,ev:1},
 biblioteca:{n:'BIBLIOTECA',fl:'wood',wall:['libreria','libreria','sillon'],ctr:['mesa'],d:0.12},
 comedor:{n:'COMEDOR',fl:'wood',wall:['armario','planta'],ctr:['mesa4','mesa4'],d:0.08},
 musica:{n:'SALA DE MUSICA',fl:'carpet',wall:['piano','estante','planta'],ctr:['sillon'],d:0.08},
 patio:{n:'PATIO',fl:'grass',wall:['arbol','banco_p','planta','arbol'],ctr:['fuente'],d:0.06,out:1}};
const FS={sofa:[2,1],mesa:[2,1],mesa4:[2,2],cama:[2,2],armario:[2,1],estante:[2,1],planta:[1,1],tv:[1,1],nevera:[1,1],encimera:[3,1],fogon:[1,1],banera:[2,1],vater:[1,1],lavabo:[1,1],escritorio:[2,1],archivador:[1,1],cajafuerte:[1,1],oro:[2,1],mostrador:[3,1],barra:[3,1],altavoz:[1,1],sillon:[1,1],caja:[1,1],bidon:[1,1],contenedor:[3,2],mesalab:[2,1],piano:[2,2],estatua:[1,1],taquilla:[2,1],coche:[3,2],banco_t:[2,1],arbol:[1,1],banco_p:[2,1],fuente:[2,2],libreria:[3,1],van:[3,2]};

// ===================== MAPA =====================
const T={FLOOR:0,WALL:1,DOOR:2,OPEN:3,FURN:4,OUT:5,WIN:6,BROKEN:7,STAIR:8,VOID:9};
const walkT=t=>t===0||t===3||t===5||t===7||t===8;
const pathT=t=>t===0||t===2||t===3||t===5||t===7||t===8;
const opaqueT=t=>t===1||t===2;
let world=null;
function tget(x,y){if(x<0||y<0||x>=world.w||y>=world.h)return T.WALL;return world.t[y*world.w+x];}
function tset(x,y,v){world.t[y*world.w+x]=v;}
function newLevel(w,h,f){return{f,w,h,t:new Uint8Array(w*h).fill(T.OUT),seen:new Uint8Array(w*h),room:new Int16Array(w*h).fill(-1),door:new Map(),furn:new Map(),rooms:[],winBroken:new Set(),items:[],bullets:[],nades:[],parts:[],popups:[],flashes:[],smoke:[],c4:[],stairs:[],flowP:null,flowS:null,flowX:null,ptk:-1};}
function genLayout(L,M,R,upper){world=L;const Rp=a=>a[R()*a.length|0],w=L.w,h=L.h;
 const bx0=2,by0=2,bx1=w-3,by1=h-(M.lot?11:7);Object.assign(L,{bx0,by0,bx1,by1,upper,lot:!!M.lot&&!upper});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const inB=x>=bx0&&x<=bx1&&y>=by0&&y<=by1;
  if(inB)tset(x,y,(x===bx0||x===bx1||y===by0||y===by1)?T.WALL:T.FLOOR);else tset(x,y,upper&&y>by1+2?T.VOID:T.OUT);}
 const addDoor=(x,y,o,lock)=>{tset(x,y,T.DOOR);L.door.set(y*w+x,{o,lock:!!lock,side:1});};
 function split(x,y,ww,hh){
  const mn=M.min,canV=ww>=2*mn+1,canH=hh>=2*mn+1;
  if((!canV&&!canH)||(ww*hh<=M.maxA&&R()<0.55))return;
  const ax=canV&&canH?(ww>hh*1.2?'v':hh>ww*1.2?'h':R()<.5?'v':'h'):canV?'v':'h';
  let c=-1;
  for(let k=0;k<24;k++){
   if(ax==='v'){const cc=x+mn+Math.floor(R()*(ww-2*mn));if(tget(cc,y-1)!==T.DOOR&&tget(cc,y+hh)!==T.DOOR){c=cc;break;}}
   else{const cc=y+mn+Math.floor(R()*(hh-2*mn));if(tget(x-1,cc)!==T.DOOR&&tget(x+ww,cc)!==T.DOOR){c=cc;break;}}}
  if(c<0)return;
  if(ax==='v'){for(let j=y;j<y+hh;j++)tset(c,j,T.WALL);const d=y+Math.floor(R()*hh);addDoor(c,d,'v',R()<M.lock);
   if(hh>=9&&R()<0.35){const d2=y+Math.floor(R()*hh);if(Math.abs(d2-d)>2)addDoor(c,d2,'v',false);}
   split(x,y,c-x,hh);split(c+1,y,x+ww-1-c,hh);}
  else{for(let i=x;i<x+ww;i++)tset(i,c,T.WALL);const d=x+Math.floor(R()*ww);addDoor(d,c,'h',R()<M.lock);
   if(ww>=9&&R()<0.35){const d2=x+Math.floor(R()*ww);if(Math.abs(d2-d)>2)addDoor(d2,c,'h',false);}
   split(x,y,ww,c-y);split(x,c+1,ww,y+hh-1-c);}}
 split(bx0+1,by0+1,bx1-bx0-1,by1-by0-1);
 const sideDoor=(lock)=>{const opts=[];for(let y=by0+2;y<=by1-2;y++){if(tget(bx0+1,y)===T.FLOOR)opts.push([bx0,y,'v',bx0-1,y]);if(tget(bx1-1,y)===T.FLOOR)opts.push([bx1,y,'v',bx1+1,y]);}
  for(let x=bx0+2;x<=bx1-2;x++)if(tget(x,by0+1)===T.FLOOR)opts.push([x,by0,'h',x,by0-1]);if(!opts.length)return null;const o=Rp(opts);addDoor(o[0],o[1],o[2],lock);return{x:o[3],y:o[4],dx:o[0],dy:o[1]};};
 if(!upper){let cand=[];for(let x=bx0+2;x<=bx1-2;x++)if(tget(x,by1-1)===T.FLOOR&&Math.abs(x-w/2)<w*0.3)cand.push(x);
  if(!cand.length)for(let x=bx0+2;x<=bx1-2;x++)if(tget(x,by1-1)===T.FLOOR)cand.push(x);
  const ex=Rp(cand);addDoor(ex,by1,'h',false);L.entry={x:ex,y:by1};
  if(R()<0.8)L.back=sideDoor(R()<0.4);
  if(R()<0.6){for(let tr=0;tr<6;tr++){const sd=sideDoor(R()<0.3);if(!sd)break;if(!L.back||Math.abs(sd.dx-L.back.dx)+Math.abs(sd.dy-L.back.dy)>8){L.side=sd;break;}L.door.delete(sd.dy*w+sd.dx);tset(sd.dx,sd.dy,T.WALL);}}}
 else L.roof=sideDoor(false);
 floodRooms(L);
 let loops=M.loops;
 for(let k=0;k<600&&loops>0;k++){const x=bx0+1+Math.floor(R()*(bx1-bx0-1)),y=by0+1+Math.floor(R()*(by1-by0-1));if(tget(x,y)!==T.WALL)continue;
  let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(tget(x+i,y+j)===T.DOOR)near=true;if(near)continue;
  const Lt=tget(x-1,y),Rr=tget(x+1,y),U=tget(x,y-1),D=tget(x,y+1),rm=(a,b)=>L.room[b*w+a];
  if(Lt===T.FLOOR&&Rr===T.FLOOR&&U===T.WALL&&D===T.WALL&&rm(x-1,y)!==rm(x+1,y)){addDoor(x,y,'v',false);loops--;}
  else if(U===T.FLOOR&&D===T.FLOOR&&Lt===T.WALL&&Rr===T.WALL&&rm(x,y-1)!==rm(x,y+1)){addDoor(x,y,'h',false);loops--;}}
 for(let x=bx0+1;x<bx1;x++)for(const[y,iy]of[[by0,by0+1],[by1,by1-1]]){if(tget(x,y)===T.WALL&&tget(x,iy)===T.FLOOR&&tget(x-1,y)===T.WALL&&tget(x+1,y)===T.WALL&&R()<M.win)tset(x,y,T.WIN);}
 for(let y=by0+1;y<by1;y++)for(const[x,ix]of[[bx0,bx0+1],[bx1,bx1-1]]){if(tget(x,y)===T.WALL&&tget(ix,y)===T.FLOOR&&tget(x,y-1)===T.WALL&&tget(x,y+1)===T.WALL&&R()<M.win*0.7)tset(x,y,T.WIN);}
}
function floodRooms(L){const w=L.w;L.rooms=[];L.room.fill(-1);
 for(let i=0;i<L.t.length;i++){if(L.t[i]!==T.FLOOR||L.room[i]>=0)continue;const id=L.rooms.length,tiles=[],st=[i];L.room[i]=id;let x0=1e9,y0=1e9,x1=-1,y1=-1;
  while(st.length){const k=st.pop();tiles.push(k);const x=k%w,y=(k/w)|0;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=L.h)continue;const nk=ny*w+nx;if(L.room[nk]<0&&(L.t[nk]===T.FLOOR||L.t[nk]===T.STAIR)){L.room[nk]=id;st.push(nk);}}}
  L.rooms.push({id,tiles,x0,y0,x1,y1,fn:'pasillo'});}}
function assignRooms(L,M,R){world=L;const Rp=a=>a[R()*a.length|0];const entryRoom=L.entry?L.room[(L.entry.y-1)*L.w+L.entry.x]:-1;
 const rs=L.rooms.filter(r=>r.tiles.length>=4);
 for(const r of rs){const bw=r.x1-r.x0+1,bh=r.y1-r.y0+1;r.fn=Math.min(bw,bh)<=2?'pasillo':Rp(TH.fns);}
 const big=rs.filter(r=>r.fn!=='pasillo').sort((a,b)=>b.tiles.length-a.tiles.length);
 if(big.length)big[0].fn=TH.big;
 if(TH.one&&big.length>2&&(TH.one!=='despacho'||L.upper||!M.floors||M.floors<2)){const c=big.slice(1).filter(r=>r.id!==entryRoom&&r.tiles.length>=6&&r.tiles.length<=40);if(c.length)c[c.length-1].fn=TH.one;}
 if(M.patio&&!L.upper){const c=big.filter(r=>r.id!==entryRoom&&r.tiles.length>=20&&r.fn!==TH.one);if(c.length){const p=c[Math.min(c.length-1,1)];p.fn='patio';
  for(let y=p.y0-1;y<=p.y1+1;y++)for(let x=p.x0-1;x<=p.x1+1;x++){if(tget(x,y)!==T.WALL)continue;const o=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>tget(x+dx,y+dy)===T.FLOOR);if(o.length===2&&L.room[(y+o[0][1])*L.w+x+o[0][0]]!==L.room[(y+o[1][1])*L.w+x+o[1][0]]&&R()<0.35)tset(x,y,T.WIN);}}}
 const dk=M.dark!==undefined?M.dark:TH.dark;for(const r of L.rooms){r.dark=r.tiles.length>=4&&r.id!==entryRoom&&r.fn!=='patio'&&R()<dk;}
 for(const r of L.rooms){r.st=(RFN[r.fn]&&RFN[r.fn].fl)||TH.floor;if(RFN[r.fn]&&RFN[r.fn].armor){for(const t of r.tiles){const x=t%L.w,y=t/L.w|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(y+dy)*L.w+x+dx,D=L.door.get(k);if(D&&L.t[k]===T.DOOR&&M.squad>1&&!(L.entry&&k===L.entry.y*L.w+L.entry.x)){D.armor=true;D.lock=true;}}}}}}
function placeStairs(A,B,R){const w=A.w,cand=[];
 for(let y=A.by0+2;y<A.by1-1;y++)for(let x=A.bx0+2;x<A.bx1-1;x++){let ok=true;for(const L of[A,B]){world=L;for(let j=-1;j<=1&&ok;j++)for(let i=-1;i<=1;i++){const t=tget(x+i,y+j);if(t!==T.FLOOR){ok=false;break;}}}
  const bad=L=>{const r=L.room[y*w+x];return r<0||['patio','camara','pasillo'].includes(L.rooms[r].fn);};
  if(ok&&!bad(A)&&!bad(B)&&!(A.entry&&Math.abs(x-A.entry.x)<4&&y>A.by1-5))cand.push(y*w+x);}
 if(!cand.length)return false;const k=cand[R()*cand.length|0];
 for(const L of[A,B]){L.t[k]=T.STAIR;L.stairs.push(k);}
 const far=cand.filter(c=>Math.hypot(c%w-k%w,(c/w|0)-(k/w|0))>16);if(far.length&&A.w>40){const k2=far[R()*far.length|0];for(const L of[A,B]){L.t[k2]=T.STAIR;L.stairs.push(k2);}}
 return true;}
function furnish(L,M,R){world=L;const w=L.w,Rp=a=>a[R()*a.length|0];
 const src=L.entry?[[L.entry.x,L.entry.y-1]]:L.stairs.map(k=>[k%w,k/w|0]);
 let floorN=0;for(let i=0;i<w*L.h;i++)if(L.t[i]===T.FLOOR)floorN++;
 const connected=()=>{const f=computeFlowMulti(src);let n=0;for(let i=0;i<w*L.h;i++)if(L.t[i]===T.FLOOR&&f[i]>=0)n++;return n===floorN;};
 const nearBlock=(x,y)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const t=tget(x+i,y+j);if(t===T.DOOR||t===T.STAIR)return true;}return L.entry&&Math.abs(x-L.entry.x)<=1&&y>=L.by1-2;};
 let fid=L.f*1000+1;
 const put=(type,x,y,fw,fh,room)=>{const cells=[];for(let j=0;j<fh;j++)for(let i=0;i<fw;i++){const cx=x+i,cy=y+j,t=tget(cx,cy);if(room>=0?(t!==T.FLOOR||L.room[cy*w+cx]!==room):t!==T.OUT)return false;if(nearBlock(cx,cy))return false;cells.push([cx,cy]);}
  cells.forEach(c=>tset(c[0],c[1],T.FURN));if(room>=0){floorN-=cells.length;if(!connected()){cells.forEach(c=>tset(c[0],c[1],T.FLOOR));floorN+=cells.length;return false;}}
  const k0=y*w+x;L.furn.set(k0,{type,x,y,w:fw,h:fh,id:fid++});for(const c of cells){const k=c[1]*w+c[0];if(k!==k0)L.furn.set(k,{ref:k0});}return true;};
 const tryPlace=(rm,type,mode)=>{const[pw,ph]=FS[type];for(let tr=0;tr<14;tr++){let x,y,fw=pw,fh=ph;
   if(mode==='wall'){const side=R()*4|0;if(side>=2){fw=ph;fh=pw;}
    if(side===0){y=rm.y0;x=rm.x0+(R()*(rm.x1-rm.x0-fw+2)|0);}else if(side===1){y=rm.y1-fh+1;x=rm.x0+(R()*(rm.x1-rm.x0-fw+2)|0);}
    else if(side===2){x=rm.x0;y=rm.y0+(R()*(rm.y1-rm.y0-fh+2)|0);}else{x=rm.x1-fw+1;y=rm.y0+(R()*(rm.y1-rm.y0-fh+2)|0);}}
   else{if(R()<.5){fw=ph;fh=pw;}const sx=rm.x1-rm.x0-fw-1,sy=rm.y1-rm.y0-fh-1;if(sx<0||sy<0)return false;x=rm.x0+1+(R()*(sx+1)|0);y=rm.y0+1+(R()*(sy+1)|0);}
   if(put(type,x,y,fw,fh,rm.id))return true;}return false;};
 for(const rm of L.rooms){if(rm.tiles.length<4)continue;const fn=RFN[rm.fn]||RFN.pasillo,area=rm.tiles.length;let n=Math.max(1,Math.round(area*fn.d));
  for(const t of fn.ctr){if(n<=0)break;if(area>=12&&tryPlace(rm,t,'ctr'))n--;}
  let k=0;while(n>0&&k<n*3+6){if(tryPlace(rm,Rp(fn.wall),'wall'))n--;k++;}}
 if(!L.upper){// furgón y exterior
  const ex=L.entry.x,by1=L.by1,vx=ex>w/2?ex-6:ex+3;put('van',vx,by1+3,3,2,-1);L.van={x:(vx+1.5)*TS,y:(by1+4)*TS};
  if(M.lot){for(let x=3;x<w-5;x+=4){if(Math.abs(x-ex)<6||Math.abs(x-vx)<5)continue;if(R()<0.65)put(R()<0.25&&TH===THEMES.puerto?'contenedor':'coche',x,by1+7,3,2,-1);}}
  for(let k=0;k<6;k++){const x=1+(R()*(w-2)|0),y=R()<.5?0:1+(R()*(by1-1)|0);if(tget(x,y)===T.OUT&&(x<=1||x>=w-2||y<=1))put(R()<.6?'bidon':'caja',x,y,1,1,-1);}}
}
function computeFlowMulti(src,L){L=L||world;const w=L.w,h=L.h,f=new Int16Array(w*h).fill(-1),q=new Int32Array(w*h);let qh=0,qt=0;
 for(const[tx,ty]of src){const k0=clamp(ty,0,h-1)*w+clamp(tx,0,w-1);if(f[k0]<0){f[k0]=0;q[qt++]=k0;}}
 const t=L.t;
 while(qh<qt){const k=q[qh++],x=k%w,y=(k/w)|0,d=f[k]+1;
  if(x>0&&f[k-1]<0&&pathT(t[k-1])){f[k-1]=d;q[qt++]=k-1;}
  if(x<w-1&&f[k+1]<0&&pathT(t[k+1])){f[k+1]=d;q[qt++]=k+1;}
  if(y>0&&f[k-w]<0&&pathT(t[k-w])){f[k-w]=d;q[qt++]=k-w;}
  if(y<h-1&&f[k+w]<0&&pathT(t[k+w])){f[k+w]=d;q[qt++]=k+w;}}
 return f;}
const computeFlow=(tx,ty)=>computeFlowMulti([[tx,ty]]);

// ---------- capa estática ----------
function floorAt(x,y){const L=world,w=L.w,t=tget(x,y);
 if(t===T.OUT||t===T.VOID||(t===T.FURN&&L.room[y*w+x]<0&&!roomNear(x,y))){
  if(L.upper)return floorTile(y>L.by1+2?'street':'roof',hash(x,y)<.2?1:0);
  if(y<=L.by1)return floorTile('alley',hash(x,y)<.2?1:0);if(y===L.by1+1)return floorTile('walk',0);return floorTile('street',hash(x,y)<.15?1:0);}
 let r=L.room[y*w+x];
 if(r<0)for(const[dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const rr=L.room[(y+dy)*w+x+dx];if(x+dx>=0&&y+dy>=0&&rr>=0){r=rr;break;}}
 const st=r>=0?L.rooms[r].st:TH.floor,hv=hash(x*3,y*5);
 return floorTile(st,hv<0.12?1:hv<0.18?2:0);}
function roomNear(x,y){const L=world;return x>L.bx0&&x<L.bx1&&y>L.by0&&y<L.by1;}
function drawWallTile(x,X,Y,tx,ty){const c=TH.wall,below=tget(tx,ty+1),front=below!==T.WALL&&below!==T.WIN&&below!==T.DOOR&&ty+1<world.h;
 F(x,c[0],X,Y,16,front?11:16);
 const R=mulberry(tx*131+ty*7);for(let i=0;i<6;i++)F(x,R()<.5?c[1]:c[2],X+(R()*16|0),Y+(R()*(front?11:16)|0));
 if(tget(tx,ty-1)!==T.WALL)F(x,c[1],X,Y,16,1);
 if(tget(tx-1,ty)!==T.WALL)F(x,c[1],X,Y,1,front?11:16);
 if(tget(tx+1,ty)!==T.WALL)F(x,c[2],X+15,Y,1,front?11:16);
 if(front){F(x,c[2],X,Y+11,16,5);F(x,c[3],X,Y+15,16,1);F(x,c[3],X,Y+11,16,1);}}
function drawStairs(x,X,Y,up){F(x,'#2a2c30',X,Y,16,16);for(let i=0;i<5;i++){const c=up?40+i*14:110-i*14;F(x,`rgb(${c},${c+2},${c+8})`,X+1,Y+1+i*3,14,3);F(x,'#111',X+1,Y+3+i*3,14,1);}
 F(x,'#ffd23a',X+7,Y+4,2,8);if(up){F(x,'#ffd23a',X+5,Y+6,6,1);F(x,'#ffd23a',X+6,Y+5,4,1);}else{F(x,'#ffd23a',X+5,Y+10,6,1);F(x,'#ffd23a',X+6,Y+11,4,1);}}
function darkMask(L){const w=L.w,h=L.h,d=new Uint8Array(w*h);L.hasDark=false;for(let i=0;i<w*h;i++){const r=L.room[i];if(r>=0&&L.rooms[r].dark){d[i]=1;L.hasDark=true;}}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(d[i]||L.t[i]===T.OUT||L.t[i]===T.VOID)continue;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&d[ny*w+nx]===1&&L.t[i]!==T.FLOOR){d[i]=2;break;}}}L.dark=d;}
function buildBase(L){world=L;darkMask(L);const w=L.w,h=L.h;L.base0=mk(w*TS,h*TS);const x=L.base0.getContext('2d');
 L.decal=mk(w*TS*2,h*TS*2);L.dctx=L.decal.getContext('2d');L.dctx.setTransform(2,0,0,2,0,0);
 for(let ty=0;ty<h;ty++)for(let tx=0;tx<w;tx++){const t=tget(tx,ty),X=tx*TS,Y=ty*TS;
  if(t!==T.WALL&&t!==T.WIN)x.drawImage(floorAt(tx,ty),X,Y);
  if(t===T.VOID){x.fillStyle='rgba(2,4,10,0.78)';x.fillRect(X,Y,16,16);}}
 if(!L.upper){const sy=(L.by1+4)*TS+7;for(let tx=0;tx<w;tx+=2){x.fillStyle='#b8b090';x.fillRect(tx*TS+2,sy,10,2);}x.fillStyle='#8a8a84';x.fillRect(0,(L.by1+2)*TS,w*TS,1);
  if(L.lot){x.fillStyle='#8a8a7a';for(let tx=3;tx<w-4;tx+=4)x.fillRect(tx*TS-2,(L.by1+7)*TS,1,TS*2);}}
 else{x.fillStyle='#1a1c20';x.fillRect(0,(L.by1+3)*TS,w*TS,2);}
 for(let ty=0;ty<h;ty++)for(let tx=0;tx<w;tx++){const t=tget(tx,ty),X=tx*TS,Y=ty*TS;
  if(t===T.WALL)drawWallTile(x,X,Y,tx,ty);
  else if(t===T.WIN)drawWin(x,tx,ty);
  else if(t===T.STAIR)drawStairs(x,X,Y,!L.upper);
  else if(t!==T.FURN&&t!==T.OUT&&t!==T.VOID&&tget(tx,ty-1)===T.WALL){x.fillStyle='rgba(0,0,0,0.28)';x.fillRect(X,Y,16,3);x.fillStyle='rgba(0,0,0,0.14)';x.fillRect(X,Y+3,16,2);}}
 L.base=scale2x(L.base0);const xb=L.base.getContext('2d');xb.setTransform(2,0,0,2,0,0);for(const[k,f]of L.furn)if(!f.ref)drawFurn(xb,f);}
function rebaseTile(L,tx,ty){const x0=Math.max(0,tx-1),y0=Math.max(0,ty-1),x1=Math.min(L.w-1,tx+1),y1=Math.min(L.h-1,ty+1),sw=(x1-x0+1)*TS,sh=(y1-y0+1)*TS,t=mk(sw,sh);t.getContext('2d').drawImage(L.base0,x0*TS,y0*TS,sw,sh,0,0,sw,sh);const u=scale2x(t),b=L.base.getContext('2d');b.save();b.setTransform(1,0,0,1,0,0);b.drawImage(u,(tx-x0)*TS*2,(ty-y0)*TS*2,TS*2,TS*2,tx*TS*2,ty*TS*2,TS*2,TS*2);b.restore();}
function drawWin(x,tx,ty){const X=tx*TS,Y=ty*TS,hz=tget(tx-1,ty)===T.WALL||tget(tx+1,ty)===T.WALL,br=world.winBroken.has(ty*world.w+tx),c=TH.wall;
 x.drawImage(floorAt(tx,ty+(hz?1:0)),X,Y);
 if(hz){F(x,c[2],X,Y+5,16,6);F(x,br?'#1a2228':'#7fb8d8',X,Y+6,16,4);if(!br){F(x,'#c8eaff',X+2,Y+7,5,1);}else for(let i=0;i<4;i++)F(x,'#9ad0ea',X+(i*5)%15,Y+6+(i%3),1,1);F(x,c[3],X,Y+5,16,1);}
 else{F(x,c[2],X+5,Y,6,16);F(x,br?'#1a2228':'#7fb8d8',X+6,Y,4,16);if(!br)F(x,'#c8eaff',X+7,Y+2,1,5);else for(let i=0;i<4;i++)F(x,'#9ad0ea',X+6+(i%3),Y+(i*5)%15,1,1);}}
function drawFurn(x,f){const px=f.x*TS,py=f.y*TS,w=f.w*TS,h=f.h*TS,R=mulberry(f.id*97+13),Rp=a=>a[R()*a.length|0],hz=w>=h;
 const box=(a,b,c,d,col,top)=>{x.fillStyle='rgba(0,0,0,0.35)';x.fillRect(a+2,b+2,c,d);x.fillStyle='#0b0d10';x.fillRect(a-1,b-1,c+2,d+2);x.fillStyle=col;x.fillRect(a,b,c,d);if(top){x.fillStyle=top;x.fillRect(a,b,c,1);x.fillRect(a,b,1,d);}};
 const circ=(cx,cy,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(cx,cy,r,0,6.283);x.fill();};
 switch(f.type){
 case'sofa':case'sillon':{const c=Rp([['#7a3a2a','#5a2418'],['#3a4a6a','#26324a'],['#4a5a3a','#323e26'],['#6a5a4a','#4a3e32']]);box(px+1,py+1,w-2,h-2,c[0],'#ffffff22');x.fillStyle=c[1];if(hz){x.fillRect(px+1,py+1,w-2,4);x.fillRect(px+1,py+1,3,h-2);x.fillRect(px+w-4,py+1,3,h-2);for(let i=px+8;i<px+w-4;i+=8)x.fillRect(i,py+6,1,h-8);}else{x.fillRect(px+1,py+1,4,h-2);x.fillRect(px+1,py+1,w-2,3);x.fillRect(px+1,py+h-4,w-2,3);}break;}
 case'mesa':case'mesa4':{box(px+2,py+2,w-4,h-4,'#8a5a30','#a8744a');if(f.type==='mesa4'){x.fillStyle='#5a3a20';for(let i=px+5;i<px+w-5;i+=9){x.fillRect(i,py,4,2);x.fillRect(i,py+h-2,4,2);}}for(let i=0;i<4;i++){x.fillStyle=Rp(['#e8e8e0','#c03030','#3a6ad0','#e8c040']);x.fillRect(px+4+R()*(w-10)|0,py+4+R()*(h-10)|0,2,2);}break;}
 case'cama':{box(px+1,py+1,w-2,h-2,'#d8d8d0','#fff');const c=Rp(['#3a5a9a','#9a3a4a','#4a7a4a','#7a6a3a']);x.fillStyle=c;if(hz)x.fillRect(px+10,py+1,w-11,h-2);else x.fillRect(px+1,py+10,w-2,h-11);x.fillStyle='#f4f4f0';if(hz){x.fillRect(px+3,py+3,5,h/2-4);x.fillRect(px+3,py+h/2+1,5,h/2-4);}else{x.fillRect(px+3,py+3,w/2-4,5);x.fillRect(px+w/2+1,py+3,w/2-4,5);}break;}
 case'armario':box(px+1,py+2,w-2,h-4,'#5a3a20','#7a5232');x.fillStyle='#3a2410';if(hz)x.fillRect(px+w/2,py+2,1,h-4);else x.fillRect(px+1,py+h/2,w-2,1);x.fillStyle='#c8a050';x.fillRect(px+w/2-2,py+h/2-1,1,2);x.fillRect(px+w/2+1,py+h/2-1,1,2);break;
 case'estante':case'libreria':box(px+1,py+2,w-2,h-4,f.type==='libreria'?'#4a2e18':'#4a4e54',f.type==='libreria'?'#6a4428':'#6a6e74');for(let i=0;i<(w*h)/30;i++){x.fillStyle=Rp(['#c03030','#3a6ad0','#e8c040','#3a9a4a','#d8d8d0','#8a5a30']);x.fillRect(px+3+R()*(w-7)|0,py+4+R()*(h-9)|0,2,3);}break;
 case'planta':circ(px+9,py+9,5,'rgba(0,0,0,0.35)');x.fillStyle='#8a4a2a';x.fillRect(px+4,py+4,8,8);x.fillStyle='#2f6a2a';for(let i=0;i<9;i++)x.fillRect(px+2+R()*9|0,py+2+R()*9|0,3,3);x.fillStyle='#5aa04a';for(let i=0;i<5;i++)x.fillRect(px+3+R()*9|0,py+3+R()*9|0,1,1);break;
 case'tv':box(px+2,py+5,12,5,'#141418','#333');x.fillStyle='#2a5a9a';x.fillRect(px+3,py+6,10,3);break;
 case'caja':box(px+1,py+1,14,14,'#6a4422','#8a5a30');x.fillStyle='#4a2e14';for(let i=0;i<14;i++){x.fillRect(px+1+i,py+1+i,1,1);x.fillRect(px+14-i,py+1+i,1,1);}x.fillStyle='#7d522a';x.fillRect(px+1,py+7,14,1);break;
 case'bidon':{const c=Rp(['#2a5a8a','#8a2a1a','#3a6a2a','#8a7a1a']);circ(px+9,py+9,6,'rgba(0,0,0,0.35)');circ(px+8,py+8,6.5,'#0b0d10');circ(px+8,py+8,5.5,c);x.fillStyle='#ffffff30';x.fillRect(px+5,py+5,3,2);x.fillStyle='#0b0d10';x.fillRect(px+9,py+9,2,2);break;}
 case'mostrador':case'encimera':box(px+1,py+2,w-2,h-4,f.type==='encimera'?'#8a8e94':'#5a4a3a',f.type==='encimera'?'#c8ccd0':'#8a7a6a');if(f.type==='encimera'){x.fillStyle='#5a6a7a';x.fillRect(px+w/2-3,py+h/2-2,6,4);x.fillStyle='#c8c8d0';x.fillRect(px+w/2,py+h/2-3,1,2);}else{x.fillStyle='#c8bca0';if(hz)x.fillRect(px+1,py+2,w-2,2);else x.fillRect(px+1,py+2,2,h-4);x.fillStyle='#141418';x.fillRect(px+6,py+6,4,3);}break;
 case'barra':box(px+1,py+3,w-2,h-6,'#2a1a2a','#4a2a4a');for(let i=0;i<6;i++){x.fillStyle=Rp(['#3affe0','#ff3aa0','#ffd23a','#7dff3a']);x.fillRect(px+3+R()*(w-6)|0,py+5+R()*(h-10)|0,1,2);}break;
 case'escritorio':box(px+1,py+3,w-2,h-6,'#6a5a48','#8a7a66');x.fillStyle='#141418';x.fillRect(px+4,py+5,6,4);x.fillStyle='#3affb0';x.fillRect(px+5,py+6,4,2);x.fillStyle='#e8e8e0';x.fillRect(px+w-9,py+6,5,3);break;
 case'cajafuerte':box(px+2,py+2,12,12,'#5a5e66','#7a7e86');circ(px+8,py+8,3,'#2a2c30');x.fillStyle='#c8c8d0';x.fillRect(px+8,py+6,1,2);break;
 case'oro':box(px+1,py+2,w-2,h-4,'#4a4e54','#6a6e74');for(let i=0;i<(w*h)/26;i++){x.fillStyle=R()<.5?'#e8c040':'#c89a20';x.fillRect(px+3+R()*(w-8)|0,py+4+R()*(h-9)|0,4,2);}break;
 case'altavoz':box(px+2,py+2,12,12,'#121214','#2a2a2e');circ(px+8,py+8,4,'#2e2e34');x.fillStyle='#0a0a0c';x.fillRect(px+7,py+7,2,2);break;
 case'mesalab':box(px+1,py+2,w-2,h-4,'#7a8088','#b0b8c0');for(let i=0;i<5;i++){x.fillStyle=Rp(['#7dff3a','#ff3aa0','#3ad0ff','#ffd23a','#e8e8e8']);x.fillRect(px+3+R()*(w-6)|0,py+4+R()*(h-8)|0,2,2);}break;
 case'piano':box(px+1,py+1,w-2,h-2,'#0e0e10','#2a2a30');x.fillStyle='#e8e8e0';if(hz)x.fillRect(px+2,py+h-5,w-4,3);else x.fillRect(px+w-5,py+2,3,h-4);break;
 case'estatua':x.fillStyle='rgba(0,0,0,0.35)';x.fillRect(px+4,py+4,10,10);x.fillStyle='#6a6a6a';x.fillRect(px+3,py+3,10,10);circ(px+8,py+8,3.5,'#b0b0b0');break;
 case'contenedor':{const c=Rp([['#8a3a2a','#6a2a1e'],['#2a5a8a','#1e4268'],['#3a6a3a','#2a4e2a'],['#8a7a2a','#685c1e']]);box(px+1,py+1,w-2,h-2,c[0],'#ffffff30');x.fillStyle=c[1];if(hz)for(let i=px+4;i<px+w-2;i+=3)x.fillRect(i,py+2,1,h-4);else for(let j=py+4;j<py+h-2;j+=3)x.fillRect(px+2,j,w-4,1);break;}
 case'nevera':box(px+2,py+2,12,12,'#d8dce0','#ffffff');x.fillStyle='#8a8e94';x.fillRect(px+2,py+7,12,1);x.fillRect(px+11,py+4,1,2);break;
 case'fogon':box(px+2,py+2,12,12,'#2a2c30','#4a4c50');for(const[a,b]of[[5,5],[11,5],[5,11],[11,11]])circ(px+a,py+b,2,'#111');x.fillStyle='#ff6a1a';x.fillRect(px+4,py+4,1,1);break;
 case'banera':box(px+1,py+2,w-2,h-4,'#e8ecf0','#ffffff');x.fillStyle='#7fb8d8';if(hz)x.fillRect(px+4,py+5,w-8,h-10);else x.fillRect(px+5,py+4,w-10,h-8);break;
 case'vater':box(px+4,py+3,8,10,'#e8ecf0','#fff');circ(px+8,py+9,2.5,'#9ab8c8');break;
 case'lavabo':box(px+3,py+4,10,8,'#e8ecf0','#fff');circ(px+8,py+8,2.5,'#9ab8c8');x.fillStyle='#8a8e94';x.fillRect(px+8,py+4,1,2);break;
 case'archivador':box(px+2,py+2,12,12,'#6a6e78','#8a8e98');x.fillStyle='#3a3e48';for(let j=py+5;j<py+14;j+=3)x.fillRect(px+3,j,10,1);x.fillStyle='#c8c8d0';x.fillRect(px+7,py+4,2,1);break;
 case'taquilla':box(px+1,py+2,w-2,h-4,'#5a6a7a','#7a8a9a');x.fillStyle='#3a4a5a';if(hz)for(let i=px+5;i<px+w-1;i+=5)x.fillRect(i,py+2,1,h-4);else for(let j=py+5;j<py+h-1;j+=5)x.fillRect(px+1,j,w-2,1);break;
 case'banco_t':box(px+1,py+2,w-2,h-4,'#5a4030','#7a5a40');for(let i=0;i<4;i++){x.fillStyle=Rp(['#c8c8d0','#c03030','#e8c040','#3a3a40']);x.fillRect(px+3+R()*(w-8)|0,py+4+R()*(h-8)|0,3,1);}break;
 case'banco_p':box(px+1,py+4,w-2,h-8,'#7a5a3a','#9a7a5a');x.fillStyle='#3a2a1a';if(hz)for(let i=px+3;i<px+w-2;i+=3)x.fillRect(i,py+4,1,h-8);else for(let j=py+3;j<py+h-2;j+=3)x.fillRect(px+4,j,w-8,1);break;
 case'fuente':circ(px+w/2+2,py+h/2+2,w/2-2,'rgba(0,0,0,0.35)');circ(px+w/2,py+h/2,w/2-2,'#8a8a88');circ(px+w/2,py+h/2,w/2-5,'#3a7ab0');circ(px+w/2,py+h/2,3,'#a8a8a4');x.fillStyle='#c8eaff';x.fillRect(px+w/2-1,py+h/2-1,2,2);break;
 case'arbol':circ(px+10,py+10,9,'rgba(0,0,0,0.35)');circ(px+8,py+8,8.5,'#0e1c0a');circ(px+8,py+8,7.5,'#2a5a20');for(let i=0;i<8;i++)circ(px+3+R()*10,py+3+R()*10,2,'#3f7a2a');x.fillStyle='#5aa04a';x.fillRect(px+6,py+5,2,1);break;
 case'coche':{const c=Rp(['#8a2a2a','#2a4a8a','#c8c8c8','#2a2a2e','#c8a030','#3a6a3a']);const vw=hz;box(px+2,py+3,w-4,h-6,c,'#ffffff40');x.fillStyle='#1a2a3a';if(vw){x.fillRect(px+w*0.28|0,py+5,6,h-10);x.fillRect(px+w*0.62|0,py+5,5,h-10);}else{x.fillRect(px+5,py+h*0.28|0,w-10,6);x.fillRect(px+5,py+h*0.62|0,w-10,5);}break;}
 case'van':{x.fillStyle='rgba(0,0,0,0.4)';x.fillRect(px+3,py+4,w-2,h-4);x.fillStyle='#0b0d10';x.fillRect(px,py+1,w,h-2);x.fillStyle='#e8eaf0';x.fillRect(px+1,py+2,w-2,h-4);x.fillStyle='#2a4fb0';x.fillRect(px+1,py+h/2-3,w-2,6);x.fillStyle='#ffd23a';x.fillRect(px+1,py+h/2-1,w-2,1);x.fillStyle='#1a2a3a';x.fillRect(px+w-10,py+3,7,h-6);x.fillStyle='#c02020';x.fillRect(px+w/2-6,py+h/2-2,5,4);x.fillStyle='#2050ff';x.fillRect(px+w/2+1,py+h/2-2,5,4);break;}
 }}
