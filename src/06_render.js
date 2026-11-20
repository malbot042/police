
// ===================== VISIÓN Y NIEBLA =====================
const VIS=[];
function castRay(ox,oy,dx,dy,maxR){const w=world.w,seen=world.seen;let tx=ox/TS|0,ty=oy/TS|0;
 const sX=dx>0?1:-1,sY=dy>0?1:-1,tDX=dx?Math.abs(TS/dx):1e9,tDY=dy?Math.abs(TS/dy):1e9;
 let tMX=dx>0?((tx+1)*TS-ox)/dx:dx<0?(tx*TS-ox)/dx:1e9,tMY=dy>0?((ty+1)*TS-oy)/dy:dy<0?(ty*TS-oy)/dy:1e9,d=0;
 if(tx>=0&&ty>=0&&tx<w&&ty<world.h)seen[ty*w+tx]=1;
 for(let n=0;n<80;n++){if(tMX<tMY){tx+=sX;d=tMX;tMX+=tDX;}else{ty+=sY;d=tMY;tMY+=tDY;}
  if(d>maxR)return maxR;if(tx<0||ty<0||tx>=w||ty>=world.h)return d;const k=ty*w+tx;seen[k]=1;if(opaqueT(world.t[k]))return d;}
 return maxR;}
function eyePoly(ox,oy,n,R){const pts=new Float32Array(n*2);for(let i=0;i<n;i++){const an=i/n*6.28318,dx=Math.cos(an),dy=Math.sin(an),d=castRay(ox,oy,dx,dy,R),e=Math.min(R,d+6);pts[i*2]=ox+dx*e;pts[i*2+1]=oy+dy*e;}return{ox,oy,pts,R};}
let visT=0;
function computeVision(){VIS.length=0;
 for(const a of agents){if(a.dead)continue;const isP=a===P,[ox,oy]=ctr(a);a.vp=eyePoly(ox,oy,isP?360:150,isP?330:230);VIS.push(a.vp);}
 for(const c of G.cams||[])if(c.f===P.f)VIS.push(eyePoly(c.x,c.y,200,210));
 for(const e of sus.concat(civs)){e.vis=false;if(e.gone)continue;const[ex,ey]=ctr(e);for(const v of VIS){if(Math.hypot(ex-v.ox,ey-v.oy)<v.R&&losO(v.ox,v.oy,ex,ey)){e.vis=true;break;}}if(e.vis&&world.hasDark&&darkAt(ex,ey))e.vis=litAt(ex,ey)||e.mflash>0;}
 if(LV.length>1&&G.t>visT){visT=G.t+0.3;const cur=P.f;for(let f=0;f<LV.length;f++){if(f===cur)continue;const L=LV[f],keep=world;world=L;for(const a of ALLA)if(a.f===f&&!a.dead){const[ox,oy]=ctr(a);for(let i=0;i<90;i++){const an=i/90*6.28318;castRay(ox,oy,Math.cos(an),Math.sin(an),220);}}world=keep;}}}
function litAt(x,y){for(const a of agents){if(a.dead)continue;const[ax,ay]=ctr(a),d=Math.hypot(x-ax,y-ay);if(d<20)return true;if(a.light===false||d>175)continue;if(Math.abs(angDiff(Math.atan2(y-ay,x-ax),a.ang))<0.52&&losO(ax,ay,x,y))return true;}for(const e of agents.concat(sus))if(!e.dead&&e.mflash>0&&Math.hypot(e.x+5-x,e.y+5-y)<60)return true;for(const f of flashes)if(Math.hypot(f.x-x,f.y-y)<f.r*0.8)return true;for(const c of G.cams||[])if(c.f===world.f&&Math.hypot(c.x-x,c.y-y)<120)return true;return false;}
const SEENC=mk(1,1),SEENX=SEENC.getContext('2d');
const lightC=mk(1,1),lctx=lightC.getContext('2d'),DARKC=mk(1,1),DARKX=DARKC.getContext('2d');
const SMOKEI=(()=>{const c=mk(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,0.9)');g.addColorStop(0.45,'rgba(255,255,255,0.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return c;})();
const SMOKEC=new Map();function smokeImg(col){let c=SMOKEC.get(col);if(!c){c=mk(64,64);const x=c.getContext('2d');x.drawImage(SMOKEI,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,64,64);SMOKEC.set(col,c);}return c;}
function drawSmoke(){for(const s of smoke){const k=s.life/s.max;ctx.globalAlpha=s.a*Math.min(1,k*1.6)*Math.min(1,(s.max-s.life)*8+0.3);const r=s.r;ctx.drawImage(smokeImg(s.c),s.x-r,s.y-r,r*2,r*2);}ctx.globalAlpha=1;}
function lightCone(c,a,R,spread,alpha){const[ax,ay]=ctr(a),g=c.createRadialGradient(ax,ay,2,ax,ay,R);g.addColorStop(0,`rgba(0,0,0,${alpha})`);g.addColorStop(0.55,`rgba(0,0,0,${alpha*0.85})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.moveTo(ax,ay);c.arc(ax,ay,R,a.ang-spread,a.ang+spread);c.closePath();c.fill();}
function clipPoly(c,v){c.beginPath();const p=v.pts;c.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)c.lineTo(p[i],p[i+1]);c.closePath();c.clip();}
function softDisc(c,x,y,r,alpha){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,0,0,${alpha})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function drawDark(cx,cy){if(!world.hasDark)return;const w=world.w;
 if(lightC.width!==fogC.width||lightC.height!==fogC.height){lightC.width=fogC.width;lightC.height=fogC.height;}
 lctx.setTransform(RS,0,0,RS,0,0);lctx.globalCompositeOperation='source-over';lctx.clearRect(0,0,W,H);
 const tx0=Math.max(0,Math.floor(cx/TS)-1),ty0=Math.max(0,Math.floor(cy/TS)-1),tx1=Math.min(w-1,Math.floor((cx+W)/TS)+1),ty1=Math.min(world.h-1,Math.floor((cy+H)/TS)+1),nw=tx1-tx0+1,nh=ty1-ty0+1;
 if(DARKC.width!==nw||DARKC.height!==nh){DARKC.width=nw;DARKC.height=nh;}
 const id=DARKX.createImageData(nw,nh),d=id.data;let any=false;for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const v=world.dark[ty*w+tx];if(v){d[((ty-ty0)*nw+tx-tx0)*4+3]=v===1?236:200;any=true;}}if(!any)return;DARKX.putImageData(id,0,0);
 lctx.imageSmoothingEnabled=true;lctx.drawImage(DARKC,tx0*TS-cx-TS/2,ty0*TS-cy-TS/2,nw*TS+TS,nh*TS+TS);
 lctx.globalCompositeOperation='destination-out';lctx.translate(-cx,-cy);
 for(const a of agents){if(a.dead)continue;const[ax,ay]=ctr(a);softDisc(lctx,ax,ay,a.light===false?11:18,a.light===false?0.45:0.8);
  if(a.light!==false&&a.vp){lctx.save();clipPoly(lctx,a.vp);lightCone(lctx,a,175,0.5,1);lightCone(lctx,a,90,0.85,0.5);lctx.restore();}}
 for(const e of agents.concat(sus))if(!e.dead&&e.mflash>0){const[x,y]=ctr(e);softDisc(lctx,x+Math.cos(e.ang)*10,y+Math.sin(e.ang)*10,60,0.95);}
 for(const f of flashes){const k=f.life/f.max;softDisc(lctx,f.x,f.y,f.r*(1.3-k*0.5),k);}
 for(const c of world.c4)softDisc(lctx,c.x,c.y,8,(G.t*6|0)%2?0.6:0.2);
 for(const c of G.cams||[])if(c.f===world.f)softDisc(lctx,c.x,c.y,120,0.7);
 lctx.setTransform(1,0,0,1,0,0);ctx.drawImage(lightC,0,0,W,H);}
function drawBeams(){if(!world.hasDark)return;ctx.globalCompositeOperation='lighter';
 for(const a of agents){if(a.dead||a.light===false||!a.vp)continue;const[ax,ay]=ctr(a);if(!darkAt(ax,ay)&&!darkAt(ax+Math.cos(a.ang)*50,ay+Math.sin(a.ang)*50))continue;
  ctx.save();clipPoly(ctx,a.vp);const g=ctx.createRadialGradient(ax,ay,3,ax,ay,175);g.addColorStop(0,'rgba(255,240,200,0.16)');g.addColorStop(1,'rgba(255,240,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(ax,ay);ctx.arc(ax,ay,175,a.ang-0.5,a.ang+0.5);ctx.closePath();ctx.fill();ctx.restore();}
 ctx.globalCompositeOperation='source-over';}
function drawFog(cx,cy){const w=world.w;
 fctx.setTransform(RS,0,0,RS,0,0);fctx.globalCompositeOperation='source-over';fctx.globalAlpha=1;fctx.fillStyle='#000';fctx.fillRect(0,0,W,H);
 const tx0=Math.max(0,Math.floor(cx/TS)-1),ty0=Math.max(0,Math.floor(cy/TS)-1),tx1=Math.min(w-1,Math.floor((cx+W)/TS)+1),ty1=Math.min(world.h-1,Math.floor((cy+H)/TS)+1),nw=tx1-tx0+1,nh=ty1-ty0+1;
 if(SEENC.width!==nw||SEENC.height!==nh){SEENC.width=nw;SEENC.height=nh;}
 const id=SEENX.createImageData(nw,nh),d=id.data;for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++)if(world.seen[ty*w+tx])d[((ty-ty0)*nw+tx-tx0)*4+3]=255;SEENX.putImageData(id,0,0);
 fctx.globalCompositeOperation='destination-out';fctx.globalAlpha=0.45;fctx.imageSmoothingEnabled=true;fctx.drawImage(SEENC,tx0*TS-cx-TS/2,ty0*TS-cy-TS/2,nw*TS+TS,nh*TS+TS);
 fctx.globalAlpha=1;
 for(const v of VIS){if(v.ox+v.R<cx||v.ox-v.R>cx+W||v.oy+v.R<cy||v.oy-v.R>cy+H)continue;const p=v.pts;fctx.beginPath();fctx.moveTo(p[0]-cx,p[1]-cy);for(let i=2;i<p.length;i+=2)fctx.lineTo(p[i]-cx,p[i+1]-cy);fctx.closePath();fctx.fill();}
 fctx.globalCompositeOperation='source-over';ctx.drawImage(fogC,0,0,W,H);}

// ===================== DIBUJO DEL MUNDO =====================
function darkOf(img){if(!img.dark){const c=mk(img.width,img.height),x=c.getContext('2d');c.lw=img.lw;c.lh=img.lh;x.drawImage(img,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(30,8,8,0.55)';x.fillRect(0,0,c.width,c.height);img.dark=c;}return img.dark;}
// ---------- personajes vectoriales (vista cenital, mirando hacia +x) ----------
const SKINS=['#efc6a2','#e0ad88','#c98f68','#a8714c','#7e5236','#5e3a26'];
const hex2=c=>{const v=parseInt(c.slice(1),16);return[v>>16,(v>>8)&255,v&255];};
const MIXC=new Map();
function mixc(a,b,t){const k=a+b+t;let r=MIXC.get(k);if(r)return r;const A=hex2(a),B=hex2(b);r='#'+A.map((v,i)=>Math.round(v*(1-t)+B[i]*t).toString(16).padStart(2,'0')).join('');MIXC.set(k,r);return r;}
function looks(e){if(e.lk)return e.lk;const sk=SKINS[(e.seed*13|0)%SKINS.length];let pal,leg,hair,helmet=false;
 if(e.kind==='agent'){pal=e===P?PAL_PLY:e.g==='B'?PAL_POLB:PAL_POL;leg='#1a2338';hair='#4a301a';helmet=true;}
 else if(e.kind==='sus'){pal=e.boss?PAL_BOSS:PAL_SUS[e.pi];leg=e.boss?'#d8d6cc':['#2a2e3a','#3a3226','#1c1c20','#34404e'][(e.seed*7|0)%4];hair=pal.H;}
 else{pal=PAL_CIV[e.pi];leg=['#2a3a5a','#3a3a40','#5a4a3a','#1e2a44'][(e.seed*5|0)%4];hair=pal.H;}
 e.lk={pal,leg,hair,helmet,skin:sk};return e.lk;}
function poseOf(e){if(e.dead)return'dead';if(e.kind==='agent')return e===P?curW().kind:WPN[e.w].kind;
 if(e.kind==='sus')return e.st==='cuffed'?'cuffed':e.st==='surr'?'up':e.armed?STYPE[e.type].kind:'unarmed';return(e.st==='comply'||e.st==='cower')?'up':'unarmed';}
function limb(c,w,pts){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.stroke();}
function disc(c,x,y,rx,ry){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry===undefined?rx:ry,0,0,6.2832);ctx.fill();}
function gunShape(C,kind,x0){const L={pistol:3.2,long:8.5,rifle:11,shotgun:10,shield:3}[kind]||4;
 ctx.fillStyle=C('#0c0d10');ctx.fillRect(x0-0.3,-1.1,L+0.6,2.2);ctx.fillStyle=C(kind==='shotgun'?'#3a3a40':'#2a2c33');ctx.fillRect(x0,-0.8,L,1.6);
 ctx.fillStyle=C('#5a5e6a');ctx.fillRect(x0+0.5,-0.8,L-0.8,0.45);
 if(kind==='shotgun'){ctx.fillStyle=C('#7a4a26');ctx.fillRect(x0-2.6,-0.9,3,1.8);ctx.fillStyle=C('#5a3a1c');ctx.fillRect(x0+4.5,-1,2.6,2);}
 if(kind==='rifle'||kind==='long'){ctx.fillStyle=C('#1a1b20');ctx.fillRect(x0+2.4,0.6,1.3,kind==='rifle'?2.2:2.6);}}
function drawPerson(e){const dead=e.dead,[x,y]=ctr(e),Lk=looks(e),pal=Lk.pal,fl=e.flash>0&&!dead;
 const C=c=>fl?'#ffffff':dead?mixc(c,'#240606',0.5):c,pose=poseOf(e),fem=e.gender==='f';
 const spd=dead?0:Math.min(1,Math.hypot(e.vx,e.vy)/55),ph=e.anim||0,sw=Math.sin(ph)*3.6*spd;
 const rel=!dead&&e.kind==='agent'&&((e===P?P.reload:e.reload)>0),rt=G.t*7;
 ctx.save();ctx.translate(x,y);
 if(!dead){ctx.fillStyle='rgba(0,0,0,0.3)';ctx.beginPath();ctx.ellipse(1,1.4,6,4.8,0,0,6.2832);ctx.fill();}
 ctx.rotate(e.ang+(dead?1.25:0));ctx.lineCap='round';ctx.lineJoin='round';
 const sh=fem?4.4:4.9;
 // piernas y botas
 if(dead){for(const s of[-1,1])limb(C(Lk.leg),2.3,[-1,s*1.9,-6.5,s*3.2]);for(const s of[-1,1])disc(C('#141418'),-7.2,s*3.4,1.5,1.2);}
 else for(const s of[-1,1]){const fx=s*sw;limb(C(Lk.leg),2.3,[-0.6,s*2,fx+0.4,s*2.1]);disc(C('#121216'),fx+1.1,s*2.1,1.7,1.25);}
 // brazos (detrás del torso)
 const arm=C(pal.g),hand=C(Lk.skin),gl=e.kind==='agent'?C('#202228'):hand,H=(hx,hy)=>disc(gl,hx,hy,1.15);
 const back=[];
 if(pose==='unarmed'){const a=-sw*0.7;back.push(()=>{limb(arm,2,[0.2,sh-0.6,a+1.2,sh+0.6]);H(a+1.6,sh+0.6);limb(arm,2,[0.2,-sh+0.6,-a+1.2,-sh-0.6]);H(-a+1.6,-sh-0.6);});}
 if(pose==='cuffed')back.push(()=>{limb(arm,2,[0,sh-0.8,-3.6,1.3]);limb(arm,2,[0,-sh+0.8,-3.6,-1.3]);H(-3.9,1);H(-3.9,-1);ctx.fillStyle=C('#c8ccd8');ctx.fillRect(-4.6,-0.5,1.2,1);});
 if(pose==='dead')back.push(()=>{limb(arm,2,[0,sh-0.6,3,sh+3.2]);H(3.4,sh+3.6);limb(arm,2,[0,-sh+0.6,2.2,-sh-3.4]);H(2.6,-sh-3.8);});
 back.forEach(f=>f());
 // torso
 ctx.fillStyle='rgba(6,8,12,0.9)';ctx.beginPath();ctx.ellipse(0,0,3.9,sh+0.6,0,0,6.2832);ctx.fill();
 disc(C(pal.g),0,0,3.4,sh);disc(C(pal.G),0.7,0,2.7,sh-0.7);
 if(e.kind==='agent'){ctx.fillStyle=C('#151c2c');ctx.fillRect(-3,-sh+1.6,2.6,(sh-1.6)*2);ctx.fillStyle=C('#ffd23a');ctx.fillRect(-2.3,-sh+2,0.9,(sh-2)*2);disc(C(pal.g),0.2,sh-0.9,1.3,1);disc(C(pal.g),0.2,-sh+0.9,1.3,1);}
 if(e.boss){ctx.strokeStyle=C('#ffd23a');ctx.lineWidth=0.5;ctx.beginPath();ctx.arc(1.6,0,1.8,-1.2,1.2);ctx.stroke();}
 // brazos y arma (delante)
 const k=pose;
 if(k==='long'||k==='rifle'||k==='shotgun'){ctx.save();if(rel){ctx.translate(2,0);ctx.rotate(-0.45);ctx.translate(-2,0);}gunShape(C,k,2.2);ctx.restore();
  const lh=rel?[2.4+Math.sin(rt)*1,-2.6]:[k==='rifle'?8.6:7.6,-0.5];limb(arm,2,[0.4,sh-0.5,3.4,3.1,4.6,1.1]);H(4.6,1.1);limb(arm,2,[0.4,-sh+0.5,(lh[0]+0.4)/2+1,-3.6,lh[0],lh[1]]);H(lh[0],lh[1]);}
 else if(k==='pistol'){ctx.save();if(rel){ctx.translate(6,0);ctx.rotate(-0.6);ctx.translate(-6,0);}gunShape(C,k,6.6);ctx.restore();
  limb(arm,2,[0.4,sh-0.5,4,2.2,6.6,0.6]);limb(arm,2,[0.4,-sh+0.5,4,-2.2,rel?3.4+Math.sin(rt):6.6,rel?-2.8:-0.6]);H(6.6,0.5);H(rel?3.4+Math.sin(rt):6.6,rel?-2.8:-0.5);}
 else if(k==='shield'){limb(arm,2,[0.4,-sh+0.5,4,-2.6,5.4,-1]);H(5.4,-1);ctx.save();ctx.translate(0,sh-1);if(rel){ctx.translate(8,0);ctx.rotate(-0.6);ctx.translate(-8,0);}gunShape(C,'pistol',8.4);ctx.restore();
  limb(arm,2,[0.4,sh-0.5,4.4,sh+0.4,8.2,sh-0.8]);H(8.2,sh-0.8);
  ctx.fillStyle=C('#0b0d10');ctx.fillRect(6.2,-7.2,2.6,14.4);ctx.fillStyle=C('#2e333e');ctx.fillRect(6.5,-6.9,2,13.8);ctx.fillStyle=C('#5a6270');ctx.fillRect(8,-6.9,0.5,13.8);ctx.fillStyle=C('#7fb8d8');ctx.fillRect(6.6,-1.6,0.6,3.2);}
 else if(k==='up'){limb(arm,2,[0.2,sh-0.7,2.2,sh-0.2,3.2,3.6]);limb(arm,2,[0.2,-sh+0.7,2.2,-sh+0.2,3.2,-3.6]);disc(hand,3.4,3.4,1.25);disc(hand,3.4,-3.4,1.25);}
 // cabeza
 const hx=0.5;
 if(fem&&!Lk.helmet){disc(C(Lk.hair),-1.4,0,2.9,2.9);}
 if(fem)disc(C(Lk.hair),-3.1,0,1.6,1.15);
 ctx.fillStyle='rgba(6,8,12,0.9)';ctx.beginPath();ctx.arc(hx,0,3.05,0,6.2832);ctx.fill();
 if(Lk.helmet){disc(C(pal.H),hx,0,2.7);disc(C(mixc(pal.H,'#ffffff',0.18)),hx-0.5,-0.7,1.3,1);ctx.fillStyle=C('#0b0e14');ctx.beginPath();ctx.ellipse(hx+1.9,0,0.9,1.9,0,0,6.2832);ctx.fill();disc(C('#5a7aa0'),hx+2.1,-0.7,0.35);}
 else{disc(C(Lk.skin),hx+0.3,0,2.6);ctx.fillStyle=C(Lk.hair);ctx.beginPath();ctx.ellipse(hx-0.6,0,2.4,2.65,0,Math.PI*0.5,Math.PI*1.5);ctx.fill();ctx.beginPath();ctx.arc(hx-0.2,0,2.55,Math.PI*0.62,Math.PI*1.38);ctx.lineTo(hx+0.6,0);ctx.fill();if(e.boss){ctx.fillStyle=C('#9a9a9a');ctx.fillRect(hx-2,-0.3,1.6,0.6);}}
 ctx.restore();}
function drawChar(e){const[x,y]=ctr(e);
 if(e.kind==='agent'&&e!==P){ctx.strokeStyle=e.g==='B'?'rgba(90,220,230,0.5)':'rgba(90,160,255,0.5)';ctx.lineWidth=0.8;ctx.beginPath();ctx.ellipse(x,y+0.5,6.4,5.6,0,0,6.2832);ctx.stroke();}
 drawPerson(e);
 if(e.stun>0)for(let i=0;i<3;i++){const a=G.t*5+i*2.1;disc(i%2?'#ffd23a':'#fff',x+Math.cos(a)*6,y-9+Math.sin(a)*2,0.7);}
 if(e.kind==='sus'&&e.st==='surr'&&e.fakeT<1e8&&e.surrT>e.fakeT-1.5&&(G.t*8|0)%2){ctx.fillStyle='#ff3a3a';ctx.fillRect(x-0.5,y-13,1,3);}
 if(e.boss&&!e.dead&&e.st!=='cuffed'){ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(x-3,y-9);ctx.lineTo(x-3,y-12);ctx.lineTo(x-1.5,y-10.5);ctx.lineTo(x,y-12.5);ctx.lineTo(x+1.5,y-10.5);ctx.lineTo(x+3,y-12);ctx.lineTo(x+3,y-9);ctx.fill();}}
function drawCorpse(e){drawPerson(e);}
const seenAt=(x,y)=>{const tx=x/TS|0,ty=y/TS|0;return tx>=0&&ty>=0&&tx<world.w&&ty<world.h&&world.seen[ty*world.w+tx];};
function drawDoors(cx,cy){const w=world.w,tx0=Math.max(0,(cx/TS|0)-1),ty0=Math.max(0,(cy/TS|0)-1),tx1=Math.min(w-1,((cx+W)/TS|0)+1),ty1=Math.min(world.h-1,((cy+H)/TS|0)+1);
 for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const k=ty*w+tx,t=world.t[k];if(t!==T.DOOR&&t!==T.OPEN&&t!==T.BROKEN)continue;const D=world.door.get(k);if(!D)continue;const X=tx*TS,Y=ty*TS;
  ctx.fillStyle=TH.wall[2];if(D.o==='h'){ctx.fillRect(X,Y+4,2,8);ctx.fillRect(X+14,Y+4,2,8);}else{ctx.fillRect(X+4,Y,8,2);ctx.fillRect(X+4,Y+14,8,2);}
  if(t===T.DOOR){const col=D.armor?'#5a6068':D.lock?'#6a3a1a':'#8a5a30',hi=D.armor?'#8a9098':'#a8744a';ctx.fillStyle='#0b0d10';if(D.o==='h')ctx.fillRect(X+1,Y+5,14,6);else ctx.fillRect(X+5,Y+1,6,14);ctx.fillStyle=col;
   if(D.o==='h'){ctx.fillRect(X+2,Y+6,12,4);ctx.fillStyle=hi;ctx.fillRect(X+2,Y+6,12,1);if(D.armor){ctx.fillStyle='#3a3e44';ctx.fillRect(X+4,Y+8,1,1);ctx.fillRect(X+8,Y+8,1,1);ctx.fillRect(X+12,Y+8,1,1);}else{ctx.fillStyle='#e8c040';ctx.fillRect(X+11,Y+7,1,2);}}
   else{ctx.fillRect(X+6,Y+2,4,12);ctx.fillStyle=hi;ctx.fillRect(X+6,Y+2,1,12);if(D.armor){ctx.fillStyle='#3a3e44';ctx.fillRect(X+8,Y+4,1,1);ctx.fillRect(X+8,Y+8,1,1);ctx.fillRect(X+8,Y+12,1,1);}else{ctx.fillStyle='#e8c040';ctx.fillRect(X+7,Y+11,2,1);}}
   if(D.lock&&world.seen[k]){ctx.fillStyle=D.armor?'#ff9a2a':'#ff3a3a';ctx.fillRect(X+7,Y+7,2,2);}}
  else if(t===T.OPEN){ctx.fillStyle='#0b0d10';if(D.o==='h'){const yy=D.side>0?Y+8:Y-4;ctx.fillRect(X,yy,4,12);ctx.fillStyle='#8a5a30';ctx.fillRect(X+1,yy+1,2,10);}else{const xx=D.side>0?X+8:X-4;ctx.fillRect(xx,Y,12,4);ctx.fillStyle='#8a5a30';ctx.fillRect(xx+1,Y+1,10,2);}}
  else{ctx.fillStyle='#5a3a20';for(let i=0;i<5;i++)ctx.fillRect(X+2+(hash(k,i)*11|0),Y+2+(hash(i,k)*11|0),2,1);}}}
function drawWorld(){
 computeVision();
 const sx=(Math.random()-0.5)*G.shake*2,sy=(Math.random()-0.5)*G.shake*2;G.kx=(G.kx||0)*0.8;G.ky=(G.ky||0)*0.8;
 const cx=G.camx+sx+G.kx,cy=G.camy+sy+G.ky;
 ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(-cx,-cy);
 const bx0=Math.max(0,Math.floor(cx)),by0=Math.max(0,Math.floor(cy)),bx1=Math.min(world.w*TS,Math.ceil(cx+W)),by1=Math.min(world.h*TS,Math.ceil(cy+H));
 if(bx1>bx0&&by1>by0){ctx.drawImage(world.base,bx0*2,by0*2,(bx1-bx0)*2,(by1-by0)*2,bx0,by0,bx1-bx0,by1-by0);ctx.drawImage(world.decal,bx0*2,by0*2,(bx1-bx0)*2,(by1-by0)*2,bx0,by0,bx1-bx0,by1-by0);}
 drawDoors(cx,cy);
 for(const it of items){if(!seenAt(it.x,it.y))continue;if(it.type==='ev'){const b=(Math.sin(G.t*4)*1);spr(SPR_EV,(it.x-4),(it.y-3+b));}else{ctx.save();ctx.translate((it.x),(it.y));ctx.rotate(it.a||0);spr(SPR_GUN,-3,-1);ctx.restore();}}
 for(const c of world.c4){spr(SPR_C4,(c.x-3),(c.y-2));if((G.t*6|0)%2){ctx.fillStyle='#ff2020';ctx.fillRect((c.x),(c.y-1),1,1);}}
 for(const L of[civs,sus,agents])for(const e of L)if(e.dead&&seenAt(e.x+5,e.y+5))drawCorpse(e);
 if(G.orderPt&&G.orderPt[2]>0&&G.orderPt[3]===P.f){const[ox,oy]=G.orderPt;ctx.strokeStyle='#5aa0ff';ctx.lineWidth=1;const r=4+(G.t*10%4);ctx.strokeRect((ox-r),(oy-r),r*2|0,r*2|0);}
 // órdenes de puerta
 for(const O of G.orders){if(O.f!==P.f||!(O.mode==='stack'||O.mode==='breach'))continue;const[dx,dy]=doorCenter(O.k),g=O.members[0]?O.members[0].g:'A',col=g==='B'?'#5ae0e6':'#5aa0ff';
  const all=O.members.every(m=>m.g===g);ctx.strokeStyle=col;ctx.strokeRect(dx-9.5,dy-9.5,19,19);
  for(const sk of O.spots||[]){const x=(sk%world.w+0.5)*TS,y=((sk/world.w|0)+0.5)*TS;ctx.fillStyle=col;ctx.fillRect((x-1),(y-1),2,2);}
  text((all?(g==='B'?'B':'A'):'T')+' '+METHODS[O.method],dx,dy-17,col,1,'center');}
 for(const e of civs)if(!e.dead&&!e.gone&&e.vis)drawChar(e);
 for(const e of sus)if(!e.dead&&e.vis)drawChar(e);
 for(const e of agents)if(!e.dead)drawChar(e);
 for(const n of nades){ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect((n.x-2),(n.y),4,2);ctx.save();ctx.translate((n.x),(n.y-(n.z||0)));ctx.rotate(n.rot);spr(SPR_FLASH,-2,-2);ctx.restore();}
 drawSmoke();
 for(const p of parts){if(p.glow)continue;ctx.fillStyle=p.c;ctx.fillRect((p.x),(p.y),p.sz,p.sz);}
 const bar=(e,k,c)=>{const[x,y]=e.kind?ctr(e):[e.x,e.y];ctx.fillStyle='#000';ctx.fillRect((x-8),(y-15),16,3);ctx.fillStyle=c;ctx.fillRect((x-7),(y-14),(14*clamp(k,0,1)),1);};
 if(P.act&&P.act.e)bar(P.act.e,P.act.t/P.act.dur,'#7dff3a');
 if(P.act&&P.act.type==='ram'){const[dx,dy]=doorCenter(P.act.k);bar({x:dx,y:dy},P.act.t/P.act.dur,'#ffd23a');}
 for(const a of agents)if(a!==P&&!a.dead&&a.task&&a.task.t>0)bar(a.task.e,a.task.t/(a.task.type==='cuff'?1.3:0.8),'#5aa0ff');
 ctx.restore();
 drawDark(cx,cy);
 drawFog(cx,cy);
 // emisivos
 ctx.save();ctx.translate(-cx,-cy);
 ctx.strokeStyle='#fff3a0';ctx.lineWidth=0.7;ctx.lineCap='round';ctx.beginPath();for(const b of bullets){const k=b.pel?0.012:0.02;ctx.moveTo((b.x-b.vx*k),(b.y-b.vy*k));ctx.lineTo((b.x),(b.y));}ctx.stroke();
 for(const p of parts){if(!p.glow)continue;ctx.globalAlpha=clamp(p.life/p.max*1.4,0,1);ctx.fillStyle=p.c;ctx.fillRect((p.x),(p.y),p.sz,p.sz);}ctx.globalAlpha=1;
 for(const e of agents.concat(sus)){if(e.dead||e.mflash<=0)continue;const[x,y]=ctr(e),mx=x+Math.cos(e.ang)*12,my=y+Math.sin(e.ang)*12;ctx.fillStyle='#fff6c0';ctx.fillRect((mx-1),(my-1),3,3);ctx.fillStyle='#ffc040';ctx.fillRect((mx-3),(my),7,1);ctx.fillRect((mx),(my-3),1,7);}
 for(const c of world.c4)if((G.t*6|0)%2){ctx.fillStyle='#ff2020';ctx.fillRect((c.x),(c.y-1),1,1);}
 drawBeams();
 ctx.globalCompositeOperation='lighter';
 const glow=(x,y,r,c,i)=>{ctx.globalAlpha=Math.min(1,i);ctx.drawImage(GL[c],x-r,y-r,r*2,r*2);};
 for(const e of agents.concat(sus)){if(e.dead||e.mflash<=0)continue;const[x,y]=ctr(e);glow(x+Math.cos(e.ang)*12,y+Math.sin(e.ang)*12,36,'y',e.kind==='sus'&&!e.vis?0.3:0.45);}
 for(const f of flashes){const k=f.life/f.max;glow(f.x,f.y,f.r*(1.3-k*0.5),f.c||'w',k);}
 if(world.van){const ph=(G.t*3|0)%2;glow(world.van.x-6,world.van.y,50,ph?'r':'b',0.3);glow(world.van.x+6,world.van.y,50,ph?'b':'r',0.3);}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 ctx.restore();
 for(const p of popups){ctx.globalAlpha=clamp(p.life*2,0,1);text(p.txt,p.x-cx,p.y-cy,p.c,1,'center');}ctx.globalAlpha=1;
 if(G.cams&&G.cams.some(c=>c.f===P.f)){const c=G.cams.find(c=>c.f===P.f);const x=c.x-cx,y=c.y-cy;ctx.strokeStyle=(G.t*4|0)%2?'#7fe6ff':'#2a6a8a';ctx.strokeRect((x-12)+0.5,(y-8)+0.5,24,16);text('CAM',x,y-14,'#7fe6ff',1,'center');}
 if(G.blind>0){ctx.fillStyle=`rgba(255,255,250,${Math.min(1,G.blind)})`;ctx.fillRect(0,0,W,H);}
 if(G.hurtFlash>0){ctx.fillStyle=`rgba(255,0,0,${G.hurtFlash*0.6})`;ctx.fillRect(0,0,W,H);}
 if(!P.dead&&P.hp<35){const a=0.12+Math.sin(G.t*6)*0.08;ctx.fillStyle=`rgba(200,0,0,${a})`;ctx.fillRect(0,0,W,4);ctx.fillRect(0,H-4,W,4);ctx.fillRect(0,0,4,H);ctx.fillRect(W-4,0,4,H);}}

// ===================== HUD =====================
const MINI=mk(1,1);let miniT=0,miniF=-1;
function miniDraw(m,L,s,full){m.fillStyle='rgba(0,0,0,0.7)';m.fillRect(0,0,L.w*s,L.h*s);
 for(let ty=0;ty<L.h;ty++)for(let tx=0;tx<L.w;tx++){const k=ty*L.w+tx,t=L.t[k];if(!full&&!L.seen[k]){if(t===T.WALL||t===T.WIN||t===T.STAIR){m.fillStyle=t===T.STAIR?'#5a4a1a':'#26324a';m.fillRect(tx*s,ty*s,s,s);}continue;}
  m.fillStyle=t===T.WALL?'#8a90a0':t===T.DOOR?(L.door.get(k)&&L.door.get(k).armor?'#c8c8d0':'#a8744a'):t===T.OPEN||t===T.BROKEN?'#5a4030':t===T.WIN?'#7fb8d8':t===T.FURN?'#3a3c44':t===T.STAIR?'#ffd23a':t===T.OUT?'#1a2a1a':t===T.VOID?'#05070c':'#262a34';m.fillRect(tx*s,ty*s,s,s);}}
function drawMinimap(){if(G.noMap)return 4;const s=Math.max(1,Math.min(2,Math.floor(110/world.w))),mw=world.w*s,mh=world.h*s,x0=W-mw-4,y0=4;
 if(G.t>miniT||MINI.width!==mw||miniF!==world.f){miniT=G.t+0.25;miniF=world.f;MINI.width=mw;MINI.height=mh;miniDraw(MINI.getContext('2d'),world,s,false);}
 ctx.imageSmoothingEnabled=false;ctx.drawImage(MINI,x0,y0);ctx.imageSmoothingEnabled=true;ctx.strokeStyle='#3a4a6a';ctx.lineWidth=1;ctx.strokeRect(x0-0.5,y0-0.5,mw+1,mh+1);
 const dot=(e,c,sz=2)=>{ctx.fillStyle=c;ctx.fillRect(x0+Math.round((e.x+5)/TS*s)-1,y0+Math.round((e.y+5)/TS*s)-1,sz,sz);};
 for(const it of items)if(it.type==='ev'&&seenAt(it.x,it.y))dot({x:it.x-5,y:it.y-5},'#ffd23a');
 for(const c of civs)if(!c.dead&&!c.gone&&c.vis)dot(c,'#e8e8e8');
 for(const e of sus)if(!e.dead&&e.vis)dot(e,e.st==='cuffed'?'#3a8a3a':e.st==='surr'||!e.armed?'#ffd23a':'#ff3a3a');
 for(const a of agents)if(!a.dead)dot(a,a===P?((G.t*4|0)%2?'#fff':'#5aa0ff'):a.g==='B'?'#5ae0e6':'#5aa0ff');
 if(LV.length>1)text(P.f?'PLANTA 1':'PLANTA BAJA',x0+mw/2,y0+mh+3,'#ffd23a',1,'center');
 return y0+mh+(LV.length>1?8:0);}
function drawHUD(){
 text('VIDA',5,5,'#9fc8ff');ctx.fillStyle='#0a1020';ctx.fillRect(22,5,66,7);
 for(let i=0;i<16;i++){const on=P.hp/P.max>i/16;ctx.fillStyle=on?(P.hp<35?((G.t*6|0)%2?'#ff3a3a':'#a01010'):'#4a8ae8'):'#16203a';ctx.fillRect(23+i*4,6,3,5);}
 text('ATU',5,15,'#c8d0c0');for(let i=0;i<P.flashN;i++)spr(SPR_FLASH,22+i*6,15);
 // arma
 const y0=H-22,wv=curW();ctx.fillStyle='rgba(0,8,20,0.65)';ctx.fillRect(3,y0-3,128,22);ctx.fillStyle='#1d2a4a';ctx.fillRect(3,y0-3,128,1);
 text((P.wi+1)+' '+wv.n,5,y0,wv.c);
 if(P.reload>0&&!wv.shell)text('RECARGA',128,y0,(G.t*8|0)%2?'#ff5a3a':'#7a2a1a',1,'right');
 else text(P.mags[P.wi]+(wv.shell?' +'+P.res[P.wi]:'/'+P.res[P.wi]),128,y0,P.mags[P.wi]<=Math.ceil(wv.mag*0.25)?'#ff5a3a':wv.c,1,'right');
 for(let i=0;i<P.has.length;i++){const x=5+i*11,sel=i===P.wi,ww=WPN[P.has[i]];ctx.fillStyle=sel?ww.c:'#2a3450';ctx.fillRect(x,y0+8,9,9);ctx.fillStyle=sel?'#000':'#0a1020';ctx.fillRect(x+1,y0+9,7,7);text(ww.s,x+3,y0+10,sel?ww.c:'#8a9ab8',1,'left',null);}
 for(let i=0;i<Math.min(wv.mag,30);i++){ctx.fillStyle=i<P.mags[P.wi]?wv.c:'#222a3a';ctx.fillRect(30+i*2+(wv.mag<=15?i*2:0),y0+10,1,5);}
 // táctico
 let ty=H-30;if(world.hasDark||P.light===false){text('L: LINTERNA '+(P.light===false?'NO':'SI'),5,ty,P.light===false?'#6a7a9a':'#ffd890');ty-=8;}P.tac.forEach((t,i)=>{if(t==='none'||t==='flash')return;const nm=t==='c4'?'CARGA X'+P.c4n:TAC[t].n.split(' ')[0];text(tacKey(i)+': '+nm,5,ty,t==='cam'&&P.camCd>0?'#4a5a6a':'#ffd23a');ty-=8;});
 // objetivos
 const M=G.M,r=remaining();
 text(M.n,W/2,4,'#ffd23a',1,'center');
 let ob='SOSPECHOSOS '+(G.nSus-r.s)+'/'+G.nSus;if(G.nCiv)ob+='   CIVILES '+(G.nCiv-r.c)+'/'+G.nCiv;if(G.nEv)ob+='   PRUEBAS '+(G.nEv-r.ev)+'/'+G.nEv;
 text(ob,W/2,12,'#c8d0c0',1,'center');text(fmtT(G.time)+'  '+DF.n+(G.run?'  OP '+G.run.lvl:''),W/2,20,G.time>M.par?'#ff9a6a':DF.c,1,'center');
 const rk=world.room[tkey(P)];if(rk>=0){const fn=RFN[world.rooms[rk].fn];if(fn&&fn!==RFN.pasillo)text(fn.n,W/2,H-12,'#6a7a9a',1,'center');}
 // minimapa y equipo
 let yy=drawMinimap()+5;
 if(ALLA.length>1){text('GRUPO (TAB): '+GRPN[G.selG],W-5,yy,'#ffd23a',1,'right');yy+=8;
  for(const a of ALLA){if(a===P)continue;const O=a.ord,st=a.dead?'BAJA':a.stun>0?'ATUR':a.target?'FUEGO':a.task?(a.task.type==='cuff'?'ESPO':'CIVIL'):O?{hold:'ESPERA',move:'MOVER',stack:'PILA',breach:'BRECHA',enter:'ENTRA'}[O.mode]:'SIGUE';
   const sel=G.selG==='T'||G.selG===a.g;text(a.name+(a.f!==P.f?' P'+a.f:''),W-60,yy,a.dead?'#5a2a2a':sel?(a.g==='B'?'#7ae8ee':'#9ab8e8'):'#4a5a7a',1,'right');ctx.fillStyle='#16203a';ctx.fillRect(W-56,yy+1,18,3);if(!a.dead){ctx.fillStyle=a.hp<35?'#ff3a3a':a.g==='B'?'#5ae0e6':'#4a8ae8';ctx.fillRect(W-56,yy+1,Math.round(18*a.hp/a.max),3);}
   text(st,W-5,yy,a.dead?'#8a2a2a':'#6a7a9a',1,'right');yy+=7;}
  text('C SEGUIR/ESPERAR  V IR  X PILA  B YA',W-5,yy+1,'#3a4a6a',1,'right');}
 // radio
 G.radio.forEach((r,i)=>{ctx.globalAlpha=clamp(r.t,0,1);text(r.txt,5,26+i*8,r.c);});ctx.globalAlpha=1;
 if(G.prompt&&G.state==='play'){const c=(G.t*3|0)%2?'#fff':'#ffd23a';text(G.prompt,W/2,H-34,c,1,'center');}
 if(G.msgT>0&&G.state==='play'){text(G.msg,W/2,H/2-40,(G.t*4|0)%2?'#ffd23a':'#fff6c0',3,'center');text(G.sub,W/2,H/2-18,'#7fe6ff',1,'center');text('ENTRA, IDENTIFICATE (ESPACIO) Y DETEN A LOS SOSPECHOSOS',W/2,H/2-8,'#c8d0c0',1,'center');}
 if(G.floorMsg>0)text(P.f?'PRIMERA PLANTA':'PLANTA BAJA',W/2,H/2-30,'#ffd23a',2,'center');
 if(G.state==='clear')text('ZONA ASEGURADA',W/2,H/2-30,(G.t*4|0)%2?'#7dff3a':'#c8ffb0',3,'center');
 if(TOUCH&&(G.state==='play'||G.state==='clear'))drawTouch();
 if(!P.dead&&(G.state==='play'||G.state==='clear')&&!(TOUCH&&!TCH.fire)){const mx=Math.round(mouse.x),my=Math.round(mouse.y),g=P.mflash>0?4:3;ctx.fillStyle=wv.c;ctx.fillRect(mx-g-3,my,3,1);ctx.fillRect(mx+g+1,my,3,1);ctx.fillRect(mx,my-g-3,1,3);ctx.fillRect(mx,my+g+1,1,3);ctx.fillRect(mx,my,1,1);}}
