// ===================== BUCLE =====================
function openMission(i){if(i>=MISSIONS.length){G.run={lvl:1,score:0};G.runEnd=null;prepMission(randMission(1));return;}if(!unlocked(i)){SFX.deny();return;}G.run=null;G.runEnd=null;prepMission(MISSIONS[i]);SFX.ok();}
function updateMenu(){const n=MISSIONS.length+1;
 if(pressed['w']||pressed['arrowup']||pressed['padu']){G.sel=(G.sel+n-1)%n;SFX.sw();}
 if(pressed['s']||pressed['arrowdown']||pressed['padd']){G.sel=(G.sel+1)%n;SFX.sw();}
 if(pressed['arrowleft']||pressed['a']||pressed['padl']){setDiff(DFi-1);SFX.sw();}
 if(pressed['arrowright']||pressed['d']||pressed['padr']){setDiff(DFi+1);SFX.sw();}
 const mx=vmx(),my=vmy(),row=Math.floor((my-26)/18),inRow=mx>8&&mx<192&&my>=26&&row>=0&&row<n&&(my-26)%18<16;
 if(inRow&&G.mm&&!TOUCH)G.sel=row;
 if(pressed['lmb']){if(inRow){if(TOUCH&&row!==G.sel){G.sel=row;SFX.sw();}else openMission(row);}else if(mx>300&&my<22)setDiff(DFi+1);else if(my>196)openMission(G.sel);}
 else if(pressed['enter']||pressed[' ']||pressed['e'])openMission(G.sel);
 if(pressed['escape'])G.state='title';}
let last=performance.now();
function update(dt){
 pollPad();
 G.t+=dt;G.frame++;G.shake=Math.max(0,G.shake-dt*22);G.hurtFlash=Math.max(0,G.hurtFlash-dt);
 if(pressed['m'])toggleMute();
 if((G.frame&7)===0)pumpSpeech();
 if(pressed['z']&&(G.state==='play'||G.state==='pause'))setZoom(ZI+1);
 if(pressed['n'])G.noMap=!G.noMap;
 if(pressed['k']){CRT=!CRT;try{localStorage.setItem('brecha_crt',CRT?'1':'0');}catch(e){}}
 if(AU.mus)AU.mus.gain.value=G.state==='pause'?0.07:0.18;
 const ok=pressed['enter']||pressed['lmb']||pressed['e'];
 switch(G.state){
  case'title':{if(pressed['h']){G.help=!G.help;break;}if(G.help){if(ok||pressed['escape'])G.help=false;break;}
   if(pressed['arrowleft']||pressed['a']||pressed['padl'])setDiff(DFi-1);if(pressed['arrowright']||pressed['d']||pressed['padr'])setDiff(DFi+1);
   if(pressed['1'])setDiff(0);if(pressed['2'])setDiff(1);if(pressed['3'])setDiff(2);
   let hit=-1;if(pressed['lmb']&&G.diffRects)G.diffRects.forEach((r,i)=>{const x=vmx(),y=vmy();if(x>=r[0]&&x<r[0]+r[2]&&y>=r[1]-3&&y<r[1]+r[3]+3)hit=i;});
   if(hit>=0){setDiff(hit);SFX.sw();}else if(ok||pressed[' ']){auInit();G.state='menu';SFX.ok();let s=0;while(s<MISSIONS.length-1&&unlocked(s+1))s++;G.sel=s;}break;}
  case'menu':updateMenu();break;
  case'brief':updateBrief();break;
  case'play':if(pressed['escape']||pressed['p']){G.state='pause';break;}updateGame(dt);break;
  case'clear':updateGame(dt);break;
  case'pause':if(pressed['escape']||pressed['p']||pressed['lmb'])G.state='play';else if(pressed['enter']){G.state='menu';if(G.run)endRun();if(window.speechSynthesis)try{speechSynthesis.cancel();}catch(e){}}break;
  case'debrief':G.debT+=dt;
   if(LV.length>1&&(pressed['arrowleft']||pressed['arrowright']||pressed['a']||pressed['d']||pressed['padl']||pressed['padr']))G.rmapF=1-(G.rmapF||0);
   if(G.debT>1){if(pressed['r']&&G.M.idx>=0)prepMission(G.M);else if(pressed['escape']){if(G.run)endRun();G.state='menu';}
    else if(ok||pressed[' ']){if(G.run){G.run.lvl++;prepMission(randMission(G.run.lvl));}else{const nx=Math.min(MISSIONS.length-1,G.M.idx+1);G.sel=nx;if(G.M.idx>=MISSIONS.length-1)G.state='menu';else prepMission(MISSIONS[nx]);}}}break;
  case'fail':G.debT+=dt;if(G.debT>1){if(ok||pressed['r']||pressed[' ']){if(G.runEnd){G.run={lvl:1,score:0};G.runEnd=null;prepMission(randMission(1));}else prepMission(G.M);}else if(pressed['escape']){G.state='menu';G.runEnd=null;}}break;
 }}
function frame(now){
 const dt=Math.min(0.033,(now-last)/1000);last=now;
 update(dt);render();post();pressed={};G.mm=false;
 requestAnimationFrame(frame);}
requestAnimationFrame(frame);
window.__BR={press:k=>{pressed[k]=true;},clr:()=>{pressed={};},G,prepMission,deploy,randMission,MISSIONS,update,render,get P(){return P;},get ALLA(){return ALLA;},get ALLS(){return ALLS;},get ALLC(){return ALLC;},get LV(){return LV;},get world(){return world;},surrender,completeAct,doShout,explodeAt,flashBang,keys,mouse,remaining,computeResults,setZoom,orderStack,orderGo,orderToggle,cycleGroup,useLevel,doorAtCursor,stackSpots,LS};
})();
</script>
</body>
</html>
