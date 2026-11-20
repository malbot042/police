
// ===================== CRT (plano) =====================
function buildOverlay(cw,ch,s){
 overlay=mk(cw,ch);const o=overlay.getContext('2d');
 if(s>=2){const p=Math.max(2,Math.round(s)),sl=mk(1,p),x=sl.getContext('2d');x.fillStyle='rgba(0,0,0,0.16)';x.fillRect(0,p-1,1,1);o.fillStyle=o.createPattern(sl,'repeat');o.fillRect(0,0,cw,ch);}
 const vg=o.createRadialGradient(cw/2,ch/2,ch*0.45,cw/2,ch/2,Math.hypot(cw,ch)/2);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');o.fillStyle=vg;o.fillRect(0,0,cw,ch);}
function regenNoise(){const id=nctx.createImageData(128,128),d=id.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255|0;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;}nctx.putImageData(id,0,0);}
function post(){
 const cw=scr.width,ch=scr.height,gw=game.width,gh=game.height;
 dctx.setTransform(1,0,0,1,0,0);dctx.globalCompositeOperation='source-over';dctx.globalAlpha=1;dctx.imageSmoothingEnabled=true;dctx.imageSmoothingQuality='high';
 if(!CRT){dctx.drawImage(game,0,0,cw,ch);return;}
 [[chR,'#f00'],[chG,'#0f0'],[chB,'#00f']].forEach(([cv,col])=>{const c=cv.getContext('2d');c.globalCompositeOperation='copy';c.drawImage(game,0,0);c.globalCompositeOperation='multiply';c.fillStyle=col;c.fillRect(0,0,gw,gh);});
 dctx.fillStyle='#000';dctx.fillRect(0,0,cw,ch);dctx.globalCompositeOperation='lighter';
 const o=Math.max(1,Math.round(cw/W*0.22));
 dctx.drawImage(chR,o,0,cw,ch);dctx.drawImage(chG,0,0,cw,ch);dctx.drawImage(chB,-o,0,cw,ch);
 bctx.globalCompositeOperation='copy';if(FILTER_OK)bctx.filter='brightness(0.75) contrast(2.2) blur(2px)';bctx.drawImage(game,0,0,bloomC.width,bloomC.height);if(FILTER_OK)bctx.filter='none';
 dctx.globalAlpha=FILTER_OK?0.4:0.1;dctx.drawImage(bloomC,0,0,cw,ch);
 dctx.globalAlpha=1;dctx.globalCompositeOperation='source-over';
 dctx.drawImage(overlay,0,0);
 if((G.frame&1)===0)regenNoise();
 dctx.globalAlpha=0.025;dctx.fillStyle=dctx.createPattern(noiseC,'repeat');dctx.fillRect(0,0,cw,ch);dctx.globalAlpha=1;}
function resize(){
 const dpr=window.devicePixelRatio||1,fit=Math.min(innerWidth/W,innerHeight/H);
 scr.style.width=Math.floor(W*fit)+'px';scr.style.height=Math.floor(H*fit)+'px';
 scr.width=Math.max(W,Math.round(W*fit*dpr));scr.height=Math.max(H,Math.round(H*fit*dpr));SC=scr.width/W;
 RS=clamp(SC,1,3);sizeCanvases();buildOverlay(scr.width,scr.height,SC);}
addEventListener('resize',resize);resize();

// ===================== ENTRADA =====================
const keys={};let pressed={};const mouse={x:W/2,y:H/2,down:false};const K=k=>!!keys[k];
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!keys[k])pressed[k]=true;keys[k]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright','tab'].includes(k))e.preventDefault();auInit();});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
function mpos(e){const r=scr.getBoundingClientRect();mouse.x=clamp((e.clientX-r.left)/r.width*W,0,W-1);mouse.y=clamp((e.clientY-r.top)/r.height*H,0,H-1);}
addEventListener('mousemove',e=>{if(Math.abs(e.movementX||0)+Math.abs(e.movementY||0)>0){aimMode='mouse';G.mm=true;}mpos(e);});
scr.addEventListener('mousedown',e=>{aimMode='mouse';mpos(e);auInit();if(e.button===0){mouse.down=true;pressed['lmb']=true;}else if(e.button===2)pressed['rmb']=true;e.preventDefault();});
addEventListener('mouseup',e=>{if(e.button===0)mouse.down=false;});
scr.addEventListener('contextmenu',e=>e.preventDefault());
scr.addEventListener('wheel',e=>{if(G.state==='play'&&P)cycleWeapon(e.deltaY>0?1:-1);e.preventDefault();},{passive:false});
addEventListener('blur',()=>{mouse.down=false;for(const k in keys)keys[k]=false;if(G.state==='play')G.state='pause';});

// ---------- apuntado por teclado / mando ----------
let aimMode='mouse',pad=null;const padKeys={};
function aimInput(){
 let ax=(K('arrowright')?1:0)-(K('arrowleft')?1:0),ay=(K('arrowdown')?1:0)-(K('arrowup')?1:0),fire=false;
 if(ax||ay){aimMode='keys';fire=true;G.kaim=Math.atan2(ay,ax);}
 if(TCH.fire){aimMode='touch';G.kaim=TCH.aim;fire=true;}
 if(pad){if(pad.aimMag>0.35){aimMode='pad';G.kaim=Math.atan2(pad.ay,pad.ax);}if(pad.fire){fire=true;if(aimMode==='mouse'&&pad.aimMag<=0.35&&Math.hypot(pad.mx,pad.my)>0.3){aimMode='pad';G.kaim=Math.atan2(pad.my,pad.mx);}}
  if(aimMode==='pad'&&pad.aimMag<=0.35&&Math.hypot(pad.mx,pad.my)>0.3&&!pad.fire)G.kaim=Math.atan2(pad.my,pad.mx);}
 return fire;}
function pollPad(){
 const gps=navigator.getGamepads?navigator.getGamepads():[];let g=null;for(const p of gps)if(p&&p.connected){g=p;break;}
 if(!g){pad=null;for(const k in padKeys)padKeys[k]=false;return;}
 const dz=v=>Math.abs(v||0)<0.2?0:v,b=i=>!!(g.buttons[i]&&(g.buttons[i].pressed||g.buttons[i].value>0.5));
 pad={mx:dz(g.axes[0]),my:dz(g.axes[1]),ax:dz(g.axes[2]),ay:dz(g.axes[3])};
 if(b(14))pad.mx=-1;if(b(15))pad.mx=1;if(b(12))pad.my=-1;if(b(13))pad.my=1;
 pad.aimMag=Math.hypot(pad.ax,pad.ay);pad.fire=b(7);pad.slow=b(10);
 const inPlay=G.state==='play'||G.state==='clear';if(inPlay){if(b(14)||b(15))pad.mx=0;if(b(12)||b(13))pad.my=0;}
 const map={' ':b(1),e:b(0),r:b(2),q:b(3),g:b(6),f:b(5),tab:b(4),p:b(9),t:b(8),y:b(11),padl:b(14),padr:b(15),padu:b(12),padd:b(13)};if(inPlay){map.x=b(12);map.b=b(13);map.v=b(14);map.c=b(15);}
 for(const k in map){if(map[k]&&!padKeys[k])pressed[k]=true;padKeys[k]=map[k];}
}

// ---------- táctil ----------
let TOUCH=false;const TCH={mx:0,my:0,fire:false,aim:0,ids:{},use:false};
const TBTN=[{id:'shout',dx:28,dy:30,r:14,l:'GRITO',c:'#7fe6ff',k:' '},{id:'use',dx:62,dy:56,r:12,l:'E',c:'#7dff3a',k:'e'},{id:'kick',dx:28,dy:70,r:11,l:'PAT',c:'#ffd23a',k:'f'},
 {id:'flash',dx:96,dy:30,r:10,l:'ATU',c:'#e8e8e8',k:'g'},{id:'wpn',dx:62,dy:92,r:10,l:'ARM',c:'#ff9a2a',k:'q'},{id:'tac',dx:96,dy:66,r:10,l:'T',c:'#ffd23a',k:'t'},
 {id:'grp',dx:28,dy:108,r:10,l:'GRP',c:'#5aa0ff',k:'tab'},{id:'team',dx:28,dy:134,r:10,l:'SEG',c:'#5aa0ff',k:'c'},{id:'stack',dx:62,dy:124,r:10,l:'PILA',c:'#5aa0ff',k:'x'},{id:'go',dx:62,dy:150,r:10,l:'YA',c:'#7dff3a',k:'b'},
 {id:'pause',dx:-1,dy:9,r:8,l:'II',c:'#c8d0c0',k:'p'},{id:'zoom',dx:-2,dy:9,r:8,l:'Z',c:'#7fe6ff',k:'z'}];
function placeBtns(){for(const b of TBTN){b.x=b.dx===-1?W/2-12:b.dx===-2?W/2+12:W-b.dx;b.y=H-b.dy;}}
function tpos(t){const r=scr.getBoundingClientRect();return[clamp((t.clientX-r.left)/r.width*W,0,W-1),clamp((t.clientY-r.top)/r.height*H,0,H-1)];}
function recomputeTouch(){TCH.mx=TCH.my=0;TCH.fire=false;TCH.use=false;for(const id in TCH.ids){const o=TCH.ids[id];if(o.k==='btn'&&o.b.id==='use')TCH.use=true;
 if(o.k==='move'||o.k==='aim'){let dx=o.x-o.ox,dy=o.y-o.oy,d=Math.hypot(dx,dy);if(d>28){o.ox=o.x-dx/d*28;o.oy=o.y-dy/d*28;dx=o.x-o.ox;dy=o.y-o.oy;d=28;}
  if(o.k==='move'&&d>3){const m=Math.min(1,d/20);TCH.mx=dx/d*m;TCH.my=dy/d*m;}if(o.k==='aim'&&d>5){TCH.aim=Math.atan2(dy,dx);TCH.fire=true;}}}}
scr.addEventListener('touchstart',e=>{e.preventDefault();if(!TOUCH){TOUCH=true;try{const de=document.documentElement;(de.requestFullscreen||de.webkitRequestFullscreen||(()=>{})).call(de);}catch(err){}}auInit();
 for(const t of e.changedTouches){const[x,y]=tpos(t);
  if(G.state!=='play'&&G.state!=='clear'){mouse.x=x;mouse.y=y;G.mm=true;aimMode='mouse';pressed['lmb']=true;TCH.ids[t.identifier]={k:'ui'};continue;}
  placeBtns();const b=TBTN.find(b=>Math.hypot(x-b.x,y-b.y)<b.r+5);
  if(b){TCH.ids[t.identifier]={k:'btn',b};b.on=0.15;pressed[b.k]=true;keys[b.k]=true;continue;}
  TCH.ids[t.identifier]={k:x<W*0.45?'move':'aim',ox:x,oy:y,x,y};}
 recomputeTouch();},{passive:false});
scr.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){const o=TCH.ids[t.identifier];if(!o)continue;const[x,y]=tpos(t);o.x=x;o.y=y;if(o.k==='ui'){mouse.x=x;mouse.y=y;}}recomputeTouch();},{passive:false});
const tend=e=>{e.preventDefault();for(const t of e.changedTouches){const o=TCH.ids[t.identifier];if(o&&o.k==='btn')keys[o.b.k]=false;delete TCH.ids[t.identifier];}recomputeTouch();};
scr.addEventListener('touchend',tend,{passive:false});scr.addEventListener('touchcancel',tend,{passive:false});
function drawTouch(){
 for(const id in TCH.ids){const o=TCH.ids[id];if(o.k!=='move'&&o.k!=='aim')continue;const c=o.k==='move'?'rgba(127,230,255,':'rgba(255,120,80,';
  ctx.strokeStyle=c+'0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(Math.round(o.ox),Math.round(o.oy),28,0,6.283);ctx.stroke();ctx.fillStyle=c+'0.45)';ctx.beginPath();ctx.arc(Math.round(o.x),Math.round(o.y),9,0,6.283);ctx.fill();}
 if(!Object.values(TCH.ids).some(o=>o.k==='move')){ctx.strokeStyle='rgba(127,230,255,0.18)';ctx.beginPath();ctx.arc(46,H-60,24,0,6.283);ctx.stroke();text('MOVER',46,H-63,'rgba(127,230,255,0.35)',1,'center',null);}
 placeBtns();for(const b of TBTN){b.on=(b.on||0)-1/60;const act=b.on>0||(b.id==='use'&&TCH.use);ctx.fillStyle=act?b.c:'rgba(0,0,0,0.45)';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.283);ctx.fill();ctx.strokeStyle=b.c;ctx.lineWidth=1;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.283);ctx.stroke();
  text(b.id==='flash'?'ATU'+P.flashN:b.id==='grp'?GRPN[G.selG].slice(0,3):b.l,b.x,b.y-2,act?'#000':b.c,1,'center',null);}}

