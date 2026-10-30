// Smooth the native scroll position so every existing trigger reads the same value.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,target=scrollY,last=0,expected=scrollY;
 const stop=()=>{cancelAnimationFrame(frame);frame=0;target=expected=scrollY;last=0};
 const limit=()=>Math.max(0,document.documentElement.scrollHeight-innerHeight);
 function tick(now){
  if(reduce.matches||document.querySelector('dialog[open]')||Math.abs(scrollY-expected)>3){stop();return;}
  target=Math.max(0,Math.min(limit(),target));
  const dt=Math.min(50,now-last||16.67);last=now;
  const next=scrollY+(target-scrollY)*(1-Math.exp(-dt/100));
  window.scrollTo({top:Math.abs(target-next)<.6?target:next,behavior:'instant'});expected=scrollY;
  if(Math.abs(target-scrollY)>.6)frame=requestAnimationFrame(tick);else stop();
 }
 addEventListener('wheel',event=>{
  // The existing BLACK/WHITE snap handler takes precedence.
  if(event.defaultPrevented){stop();return;}
  if(reduce.matches||event.ctrlKey||event.metaKey||!event.cancelable||Math.abs(event.deltaX)>=Math.abs(event.deltaY)||document.querySelector('dialog[open]'))return;
  for(let el=event.target instanceof Element?event.target:null;el&&el!==document.body;el=el.parentElement){
   const css=getComputedStyle(el);
   if(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+1)return;
  }
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  if(!delta||scrollY<=0&&delta<0||scrollY>=limit()&&delta>0)return;
  event.preventDefault();
  if(!frame)target=expected=scrollY;
  if((target-scrollY)*delta<0)target=scrollY;
  target=Math.max(0,Math.min(limit(),target+delta));
  if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}
 },{passive:false});
 for(const name of ['pointerdown','touchstart','keydown','resize','hashchange'])addEventListener(name,stop,{passive:true});
 reduce.addEventListener('change',stop);
})();
