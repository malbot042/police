
function radial(col,inner){const c=mk(64,64),x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,`rgba(${col},1)`);g.addColorStop(inner,`rgba(${col},.55)`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(0,0,64,64);return c;}
const GL={y:radial('255,220,140',.3),w:radial('255,255,255',.4),r:radial('255,40,40',.3),b:radial('40,90,255',.3),o:radial('255,140,40',.3)};

// ===================== AUDIO =====================
// Cadena: fuentes -> bus (ganancia, filtro, panorama) -> sfx (+ envío a reverberación) -> compresor -> master
const AU={ctx:null,on:true,hitT:0,cur:null};
function auInit(){
 if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return;}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
 const a=AU.ctx=new C();
 AU.master=a.createGain();AU.master.gain.value=AU.on?0.6:0;AU.master.connect(a.destination);
 const comp=a.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(AU.master);
 AU.sfx=a.createGain();AU.sfx.gain.value=0.9;AU.sfx.connect(comp);
 AU.mus=a.createGain();AU.mus.gain.value=0.2;AU.mus.connect(comp);
 const len=a.sampleRate;AU.nb=a.createBuffer(1,len,a.sampleRate);const d=AU.nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
 // reverberación de sala (respuesta al impulso sintética)
 const rl=Math.floor(a.sampleRate*1.3),ir=a.createBuffer(2,rl,a.sampleRate);
 for(let c=0;c<2;c++){const b=ir.getChannelData(c);for(let i=0;i<rl;i++){const t=i/rl;b[i]=(Math.random()*2-1)*Math.pow(1-t,3.4)*(i<240?i/240:1)*(Math.random()<0.002&&t<0.12?3:1);}}
 AU.rev=a.createConvolver();AU.rev.buffer=ir;AU.revIn=a.createGain();AU.revIn.gain.value=1;const ro=a.createGain();ro.gain.value=0.42;const rf=a.createBiquadFilter();rf.type='lowpass';rf.frequency.value=3800;
 AU.revIn.connect(AU.rev);AU.rev.connect(rf);rf.connect(ro);ro.connect(comp);
 AU.dry=mkBus(0,1,20000,0.18,true);
 startMusic();
}
function mkBus(pan,gain,lp,rev,keep){const a=AU.ctx,g=a.createGain();g.gain.value=gain;let n=g;const nodes=[g];
 if(lp<18000){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;f.Q.value=0.5;n.connect(f);n=f;nodes.push(f);}
 if(a.createStereoPanner&&pan){const p=a.createStereoPanner();p.pan.value=pan;n.connect(p);n=p;nodes.push(p);}
 n.connect(AU.sfx);if(rev>0){const s=a.createGain();s.gain.value=rev;n.connect(s);s.connect(AU.revIn);nodes.push(s);}
 if(!keep)setTimeout(()=>{for(const x of nodes)try{x.disconnect();}catch(e){}},2600);return g;}
const out=()=>AU.cur||AU.dry;
function nz(dur,f0,f1,type,vol,q=1,delay=0){const a=AU.ctx;if(!a)return;const t=a.currentTime+delay;const s=a.createBufferSource();s.buffer=AU.nb;s.playbackRate.value=rand(0.9,1.1);const f=a.createBiquadFilter();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);const g=a.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+0.002);g.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(f);f.connect(g);g.connect(out());s.start(t,Math.random()*0.5);s.stop(t+dur+0.05);}
function tn(type,f0,f1,dur,vol,delay=0){const a=AU.ctx;if(!a)return;const t=a.currentTime+delay;const o=a.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);const g=a.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+0.003);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(g);g.connect(out());o.start(t);o.stop(t+dur+0.05);}
// sonido situado en el mapa: panorama, atenuación por distancia y sonido apagado tras paredes u otra planta
function sfxAt(name,x,y,arg){if(!AU.ctx)return;if(!P||!world){SFX[name](arg);return;}
 const[px,py]=ctr(P),dx=x-px,dy=y-py,d=Math.hypot(dx,dy),other=world.f!==P.f;if(d>760)return;
 const occ=other||(d>24&&!losO(px,py,x,y));
 let g=1/(1+d/190),lp=20000;if(occ){g*=other?0.35:0.6;lp=other?380:850;}else if(d>320)lp=5200;
 AU.cur=mkBus(clamp(dx/280,-0.85,0.85),g,lp,0.12+Math.min(0.55,d/420));try{SFX[name](arg);}finally{AU.cur=null;}}
const SONGS=[
 {bpm:92,root:33,bass:[0,-1,-1,0,-1,-1,7,-1,0,-1,-1,0,-1,3,-1,-1],prog:[0,-2,-4,-5],chord:[[0,3,7],[0,4,7],[0,4,7],[0,4,7]],wave:'triangle',lead:'square',drum:'menu'},
 {bpm:112,root:28,bass:[0,-1,0,-1,0,-1,3,-1,0,-1,0,-1,5,-1,3,-1],prog:[0,0,1,-1],chord:[[0,3,7],[0,3,7],[0,4,7],[0,3,7]],wave:'sawtooth',lead:'triangle',drum:'tense'},
 {bpm:124,root:31,bass:[0,0,-1,0,12,-1,0,-1,0,0,-1,0,10,-1,7,-1],prog:[0,-2,0,1],chord:[[0,3,7],[0,4,7],[0,3,7],[0,4,7]],wave:'square',lead:'sine',drum:'drive'},
 {bpm:102,root:26,bass:[0,-1,-1,-1,0,-1,1,-1,0,-1,-1,-1,0,-1,3,1],prog:[0,1,0,-1],chord:[[0,3,6],[0,3,7],[0,3,6],[0,3,7]],wave:'sawtooth',lead:'square',drum:'heavy'}];
function curSong(){return(G.state==='play'||G.state==='pause'||G.state==='clear')?SONGS[TH.song]:SONGS[0];}
function startMusic(){
 const a=AU.ctx,mf=m=>440*Math.pow(2,(m-69)/12);let step=0,next=a.currentTime+0.2;
 const note=(type,f,t,dur,vol,lp)=>{const o=a.createOscillator();o.type=type;o.frequency.value=f;const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;const g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(fl);fl.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+dur+0.02);};
 const noise=(t,dur,vol,hp,bp)=>{const s=a.createBufferSource();s.buffer=AU.nb;const f=a.createBiquadFilter();f.type=bp?'bandpass':'highpass';f.frequency.value=hp;const g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(f);f.connect(g);g.connect(AU.mus);s.start(t,Math.random()*0.5);s.stop(t+dur+0.02);};
 const drop=(t,f0,f1,dur,vol)=>{const o=a.createOscillator();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur+0.03);o.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+dur+0.05);};
 const kick=t=>drop(t,130,40,0.15,0.7);
 const drums=(st,s,t,I)=>{const hat=v=>noise(t,0.03,v,7000);
  switch(st){
   case'menu':if(s===0||s===8)kick(t);if(s%4===2)hat(0.04);break;
   case'tense':if(s===0||s===10)kick(t);if(s===4||s===12)noise(t,0.05,0.14,2200,1);if(I>0.25&&s%2===0)hat(0.05);break;
   case'drive':if(s%4===0)kick(t);if(s%8===4)noise(t,0.1,0.24,1600);if(s%2===0||I>0.3)hat(0.05);break;
   case'heavy':if(s===0||s===6||s===10)kick(t);if(s===8)noise(t,0.2,0.28,900);if(s%4===0||I>0.25)hat(0.05);break;}};
 setInterval(()=>{if(a.state!=='running')return;if(next<a.currentTime)next=a.currentTime+0.05;
  while(next<a.currentTime+0.25){const S=curSong(),spb=60/S.bpm/2,t=next,s=step%16,bar=(step>>4)%4,I=G.state==='play'?(G.inten||0):0,root=S.root+S.prog[bar];
   const bn=S.bass[s];if(bn>=0)note(S.wave,mf(root+bn),t,spb*0.9,0.14,S.wave==='sawtooth'?480:650);
   drums(S.drum,s,t,I);
   if(((step%64)>=32||I>0.5)&&step%2===0){const ch=S.chord[bar];note(S.lead,mf(root+24+ch[(step>>1)%3]),t,spb*1.8,0.045+I*0.03,2800);}
   if(I>0.7&&step%4===2)note('square',mf(root+36+S.chord[bar][2]),t,spb*0.5,0.03,4000);
   step++;next+=spb;}},50);
}
// disparo por capas: chasquido supersónico + cuerpo + golpe grave + cola de la sala
const GUNK={pistol:[0.85,2600,0.16,0.9,0],smg:[0.7,2900,0.11,0.75,0],rifle:[1.1,2300,0.22,1.15,0],shotgun:[1.0,1500,0.32,1.45,1]};
function gunSound(kind,v){const K=GUNK[kind]||GUNK.pistol;
 nz(0.025,9000,3500,'highpass',0.6*v*K[0],0.7);
 nz(K[2],K[1],110,'lowpass',0.95*v*K[3],0.9);
 tn('sine',150*(K[4]?0.8:1),36,K[2]*1.3,0.55*v*K[3]);
 nz(0.6*K[3],1100,180,'lowpass',0.16*v*K[3],0.6,0.02);}
const SFX={
 gun(k){gunSound(k||'pistol',1);},
 pistol(){gunSound('pistol',1);tn('triangle',rand(3200,4200),rand(2800,3600),0.04,0.025,rand(0.28,0.4));},
 smg(){gunSound('smg',0.95);tn('triangle',rand(3200,4200),rand(2800,3600),0.03,0.02,rand(0.28,0.4));},
 rifle(){gunSound('rifle',1);tn('triangle',rand(3000,3800),rand(2600,3200),0.04,0.025,rand(0.3,0.45));},
 shotgun(){gunSound('shotgun',1);tn('square',300,240,0.03,0.03,0.25);nz(0.05,900,500,'bandpass',0.12,2,0.32);},
 hit(){const n=performance.now();if(n-AU.hitT<45)return;AU.hitT=n;nz(0.05,4000,1500,'highpass',0.1,1);nz(0.06,500,200,'lowpass',0.25,1);},
 clank(){tn('square',1800,1200,0.05,0.07);tn('sine',2400,2300,0.25,0.05);nz(0.06,5000,2500,'bandpass',0.15,2);},
 hurt(){nz(0.08,700,200,'lowpass',0.4,1);tn('sine',110,60,0.2,0.3);},
 die(){nz(0.25,500,90,'lowpass',0.45,1);nz(0.1,2500,900,'bandpass',0.1,3,0.12);},
 step(v=1){nz(0.045,rand(700,1100),180,'lowpass',0.13*v,1.2);nz(0.02,4000,2500,'bandpass',0.03*v,2,0.01);},
 kick(){nz(0.12,600,80,'lowpass',0.9,1);tn('sine',90,40,0.15,0.4);nz(0.35,2500,500,'bandpass',0.35,1.5,0.03);for(let i=0;i<4;i++)nz(0.03,rand(1500,3000),800,'bandpass',0.12,3,0.05+i*0.04);},
 thud(){nz(0.12,400,80,'lowpass',0.7,1);tn('sine',70,40,0.12,0.3);tn('sine',1200,1150,0.15,0.03);},
 boom(){nz(1.4,1400,40,'lowpass',1.0,0.7);tn('sine',90,24,0.8,0.7);nz(0.08,7000,2000,'highpass',0.6,0.7);for(let i=0;i<8;i++)nz(0.04,rand(1500,4000),900,'bandpass',0.08,3,0.2+i*0.07);},
 beep(){tn('square',2200,2200,0.05,0.04);},
 door(){const b=rand(150,220);tn('triangle',b,b*0.7,0.32,0.05);tn('triangle',b*1.5,b*1.1,0.25,0.025,0.05);nz(0.18,900,300,'bandpass',0.06,4);nz(0.05,300,120,'lowpass',0.15,1,0.28);},
 close(){nz(0.09,500,120,'lowpass',0.45,1);tn('sine',110,70,0.1,0.2);nz(0.03,3000,1500,'bandpass',0.08,3,0.02);},
 cuff(){for(let i=0;i<5;i++)tn('square',rand(2200,2800),rand(1800,2200),0.018,0.04,i*0.045);tn('triangle',3300,3200,0.05,0.04,0.3);},
 flash(){nz(0.05,9000,4000,'highpass',0.9,0.7);nz(0.8,5000,150,'lowpass',1,0.5);tn('sine',120,30,0.5,0.6);},
 ring(){const a=AU.ctx;if(!a)return;tn('sine',3600,3500,2.4,0.06);tn('sine',3610,3505,2.4,0.04);},
 shout(){},
 radio(){nz(0.06,3000,2500,'bandpass',0.06,2);tn('square',1400,1400,0.035,0.025,0.03);},
 radioIn(){nz(0.08,2800,2200,'bandpass',0.07,3);tn('sine',1750,1750,0.05,0.025);},
 radioOut(){nz(0.12,3200,1800,'bandpass',0.06,2);tn('sine',1300,1300,0.04,0.02);},
 glass(){nz(0.35,9000,3000,'highpass',0.35,1);for(let i=0;i<7;i++)tn('sine',rand(3000,7000),rand(2000,4000),0.08,0.03,i*0.035);},
 reload(){tn('square',1500,1300,0.015,0.05);nz(0.03,2500,1500,'bandpass',0.12,3);nz(0.04,1800,900,'bandpass',0.18,3,0.32);tn('square',700,600,0.025,0.06,0.33);},
 shell(){nz(0.03,2200,1200,'bandpass',0.15,3);tn('square',900,800,0.02,0.04,0.02);},
 empty(){tn('square',2400,2200,0.015,0.05);},
 sw(){nz(0.04,1500,800,'bandpass',0.1,2);tn('square',900,700,0.02,0.03,0.04);},
 pick(){tn('square',660,660,0.05,0.05);tn('square',990,990,0.07,0.05,0.06);},
 nade(){nz(0.1,1200,600,'bandpass',0.08,2);tn('square',2600,2500,0.02,0.04);},
 bounce(){tn('triangle',rand(800,1100),600,0.04,0.06);},
 stairs(){for(let i=0;i<4;i++)nz(0.05,700,250,'lowpass',0.17,1,i*0.11);},
 ok(){tn('square',523,523,0.06,0.08);tn('square',784,784,0.1,0.08,0.07);},
 deny(){tn('square',160,120,0.15,0.08);},
 clear(){[523,659,784,1046].forEach((f,i)=>tn('square',f,f,0.14,0.07,i*0.12));},
 fail(){[392,330,262,196].forEach((f,i)=>tn('triangle',f,f*0.98,0.25,0.1,i*0.2));},
};
// ===================== VOCES =====================
// Voces del navegador clasificadas por género; cada personaje tiene timbre y velocidad propios
const VC={all:[],m:[],f:[],ok:false};
const FEMV=/(helena|laura|m[oó]nica|paulina|elvira|luc[ií]a|conchita|sabina|marisol|paloma|esperanza|dalia|elena|ximena|abril|irene|triana|\blia\b|lola|vera|estrella|camila|sof[ií]a|isabel|carmen|silvia|female|femenin|mujer|woman|marta|\bana\b|julia|alba|nuria|catalina|valentina|renata|larissa|beatriz|google espa)/i;
const MASV=/(pablo|jorge|juan|diego|enrique|[aá]lvaro|ra[uú]l|carlos|andr[eé]s|tom[aá]s|arnau|dar[ií]o|gerardo|\bmale\b|masculin|hombre|alonso|jaime|sergio|miguel|antonio|manuel|francisco|javier|gonzalo|alberto|lorenzo|rodrigo|emilio|federico|alejandro|rafael|teo\b|nicol[aá]s)/i;
function loadVoices(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^es/i.test(v.lang));if(!vs.length)return;
 vs.sort((a,b)=>(/^es[-_]ES/i.test(b.lang)-/^es[-_]ES/i.test(a.lang))||(b.localService-a.localService));
 VC.all=vs;VC.m=vs.filter(v=>MASV.test(v.name)&&!FEMV.test(v.name));VC.f=vs.filter(v=>FEMV.test(v.name)&&!MASV.test(v.name));VC.ok=true;}
if(window.speechSynthesis){loadVoices();try{speechSynthesis.addEventListener('voiceschanged',loadVoices);}catch(e){speechSynthesis.onvoiceschanged=loadVoices;}}
// perfil vocal: género, voz, tono y velocidad base
function voiceOf(e){if(!e.vo){const g=e.gender||(Math.random()<0.5?'m':'f');e.vo={g,seed:Math.random()*1000|0,p:rand(0.92,1.08)+(e.kind==='sus'?-0.04:0),r:rand(0.94,1.08)};}return e.vo;}
function pickVoice(vo){if(!VC.ok)loadVoices();const own=VC[vo.g];if(own.length)return{v:own[vo.seed%own.length],shift:0};
 const v=VC.all.length?VC.all[vo.seed%VC.all.length]:null;let shift=0;if(v){const isF=FEMV.test(v.name)||!MASV.test(v.name);shift=vo.g==='m'&&isF?-0.42:vo.g==='f'&&!isF?0.42:0;}return{v,shift};}
// entonación por emoción: velocidad, tono, volumen y contorno entre frases
const EMO={shout:{r:1.12,p:0.06,v:1,c:-0.08},command:{r:1.18,p:0.0,v:1,c:-0.1},panic:{r:1.32,p:0.28,v:1,c:0.08},plead:{r:1.15,p:0.2,v:0.95,c:0.06},threat:{r:0.92,p:-0.14,v:1,c:-0.06},
 question:{r:0.96,p:0.06,v:0.8,c:0.1},calm:{r:1.0,p:0,v:0.85,c:-0.04},radio:{r:1.08,p:-0.03,v:0.85,c:-0.05},pain:{r:1.35,p:0.32,v:1,c:0}};
const SQ=[];let sqT=0,sqCur=null;
function speakAs(txt,o){if(!AU.on||!window.speechSynthesis||COVER)return;o=o||{};const now=performance.now(),parts=txt.split('|');
 if(o.prio){try{speechSynthesis.cancel();}catch(e){}SQ.length=0;sqCur=null;}
 else{for(let i=SQ.length-1;i>=0;i--)if((SQ[i].o.pr||0)<(o.pr||0)&&SQ.length>=3)SQ.splice(i,1);if(SQ.length>=4)return;}
 parts.forEach((p,i)=>SQ.push({txt:p.trim(),o,i,n:parts.length,t:now}));pumpSpeech();}
function pumpSpeech(){if(!window.speechSynthesis)return;const now=performance.now();
 if(sqCur&&(speechSynthesis.speaking||speechSynthesis.pending)&&now-sqCur<6000)return;sqCur=null;
 while(SQ.length&&now-SQ[0].t>2600)SQ.shift();const it=SQ.shift();if(!it)return;
 const o=it.o,E=EMO[o.emo||'calm'],vo=o.vo||{g:'m',seed:0,p:1,r:1},pv=pickVoice(vo);
 try{const u=new SpeechSynthesisUtterance(it.txt);u.lang=pv.v?pv.v.lang:'es-ES';if(pv.v)u.voice=pv.v;
  u.pitch=clamp(vo.p+E.p+pv.shift+E.c*it.i+(o.pitch||0),0.1,2);u.rate=clamp(vo.r*E.r*(o.rate||1),0.5,2);u.volume=clamp((o.vol??1)*E.v,0.12,1);
  if(o.radio&&it.i===0)SFX.radioIn();u.onend=u.onerror=()=>{sqCur=null;if(o.radio&&it.i===it.n-1)SFX.radioOut();setTimeout(pumpSpeech,40);};
  sqCur=now;speechSynthesis.speak(u);}catch(e){sqCur=null;}}
function toggleMute(){AU.on=!AU.on;if(AU.master)AU.master.gain.value=AU.on?0.6:0;if(!AU.on&&window.speechSynthesis){try{speechSynthesis.cancel();}catch(e){}SQ.length=0;}}
const LINES={
 spot:['¡Están aquí!|¡Vamos!','¡La poli!|¡Es la poli!','¡Ahí están!','¡Vienen a por nosotros!'],
 fight:['¡No me cogeréis vivo!','¡Disparad!|¡Disparad!','¡Fuera de aquí!'],
 surr:['¡Vale, vale!|¡Me rindo!','¡No dispares!|¡Por favor!','¡Me rindo!|¡No voy armado!','¡Está bien!|¡Está bien, me rindo!'],
 hurt:['¡Ah!','¡Me han dado!','¡Aaah!|¡Mi pierna!'],
 flee:['¡Corre!|¡Corre!','¡No, no, no!','¡Déjame en paz!'],
 search:['¿Quién anda ahí?','¿Has oído eso?','¿Hola?|¿Hay alguien?','¡Mirad la puerta!'],
 captor:['¡Atrás!|¡O la mato!','¡Ni un paso más!','¡Fuera!|¡Tengo un rehén!'],
 fake:['¡Ahora!','¡Toma!'],
 civ:['¡Socorro!','¡No disparen!|¡Por favor!','¡Ayuda!|¡Ayuda!','¡No me hagan daño!'],
 civsafe:['¡Gracias!','Gracias, agente.','¡Gracias a Dios!'],
 contact:['¡Contacto!','¡Sospechoso armado!','¡Tengo uno!'],
 breach:['¡Brecha!|¡Brecha!','¡Entrando!','¡Adelante!|¡Policía!'],
 flashout:['¡Aturdidora!','¡Granada fuera!'],
 clear:['¡Despejado!','¡Sala limpia!','¡Limpio!'],
 stack:['En posición.','Listos.','Preparados.'],
 c4:['¡Carga puesta!|¡Atrás!'],
 down:['¡Agente herido!|¡Agente herido!','¡Me han dado!|¡Necesito ayuda!'],
 cuffed:['Esposado.','Detenido.','Lo tengo.']};
const LEMO={spot:'shout',fight:'threat',surr:'plead',hurt:'pain',flee:'panic',search:'question',captor:'threat',fake:'threat',civ:'panic',civsafe:'calm',contact:'shout',breach:'command',flashout:'command',clear:'radio',stack:'radio',c4:'command',down:'pain',cuffed:'calm'};
const SAYC={spot:'#ff7a5a',fight:'#ff5a3a',surr:'#ffd23a',hurt:'#ff9a8a',flee:'#ffb07a',search:'#ff9a6a',captor:'#ff3a3a',fake:'#ff3a3a',civ:'#ffffff',civsafe:'#c8ffc8',contact:'#7fb0ff',breach:'#7fb0ff',flashout:'#7fb0ff',clear:'#7fb0ff',stack:'#7fb0ff',c4:'#7fb0ff',down:'#ff7a7a',cuffed:'#7fb0ff'};
function say(e,kind,force){if(!force&&(e.sayT||0)>G.time)return;e.sayT=G.time+rand(3,5);const txt=pick(LINES[kind]);const[x,y]=ctr(e);
 popups.push({x,y:y-12,txt:norm(txt.replace(/\|/g,' ')),c:SAYC[kind],life:1.8});
 if(!P)return;const other=e.f!==P.f,d=Math.hypot(x-P.x-5,y-P.y-5);
 const radioV=e.kind==='agent'&&e!==P&&(other||d>200);if(!radioV&&(other||d>340))return;
 const occ=!other&&d>24&&!losO(P.x+5,P.y+5,x,y);
 speakAs(txt,{vo:voiceOf(e),emo:LEMO[kind]||'calm',vol:radioV?0.7:(1-d/400)*(occ?0.55:1),radio:radioV,pr:e.kind==='sus'?2:e.kind==='civ'?1:1});}
// la central (operadora de radio)
const CENTRAL={gender:'f',kind:'agent'};
function central(txt,emo){speakAs(txt,{vo:voiceOf(CENTRAL),emo:emo||'radio',radio:true,vol:0.8,pr:3});}
