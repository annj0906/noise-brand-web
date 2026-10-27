'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.hidden = false;
document.documentElement.classList.add('js');
function closeMenu(returnFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
const cards = [...document.querySelectorAll('.product')];
function setNote(card, open, focus = false) {
  const toggle = card.querySelector('.note-toggle');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('span').textContent = open ? '−' : '+';
  card.querySelector('.note').hidden = !open;
  if (focus) toggle.focus();
}
cards.forEach(card => {
  let preview = false;
  card.querySelector('.note-toggle').addEventListener('pointerenter', e => {
    if (e.pointerType === 'mouse' && matchMedia('(hover: hover)').matches && card.querySelector('.note').hidden) {
      preview = true;
      setNote(card, true);
    }
  });
  card.addEventListener('pointerleave', () => {
    if (preview && !card.contains(document.activeElement)) setNote(card, false);
    preview = false;
  });
  card.querySelector('.note-toggle').addEventListener('click', () => {
    const open = preview || card.querySelector('.note').hidden;
    preview = false;
    setNote(card, open);
  });
  card.querySelector('.note-close').addEventListener('click', () => { preview = false; setNote(card, false, true); });
});
function filterCollection(family) {
  cards.forEach(card => { setNote(card, false); card.hidden = family !== 'ALL' && card.dataset.family !== family; });
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === family)));
  document.querySelector('#result-count').textContent = `${family} / ${cards.filter(card => !card.hidden).length} SCENTS`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterCollection(button.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach(link => link.addEventListener('click', () => filterCollection(link.dataset.filterLink)));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  cards.forEach(card => { if (!card.querySelector('.note').hidden) setNote(card, false, card.contains(document.activeElement)); });
});
matchMedia('(min-width: 1024px)').addEventListener('change', () => closeMenu());


const interactiveHero=document.querySelector('.interactive-hero');
if(interactiveHero){
 const photo=interactiveHero.querySelector('.hero-photo'),intro=interactiveHero.querySelector('.hero-intro'),word=intro.querySelector('.intro-word'),logo=document.querySelector('.header .wordmark'),reduced=matchMedia('(prefers-reduced-motion: reduce)');

 let glitchPlayed=false,glitchTimer=null,glitchStep=0;
 function stopGlitch(){clearTimeout(glitchTimer);word.classList.remove('is-glitching');word.querySelectorAll('span').forEach(letter=>letter.classList.remove('is-pixel'));}
 function playGlitch(){
  glitchPlayed=true;
  if(reduced.matches)return;
  glitchStep=0;word.classList.add('is-glitching');
  function tick(){
   const letters=[...word.querySelectorAll('.intro-no,.intro-i,.intro-se')];
   letters.forEach(letter=>letter.classList.toggle('is-pixel',Math.random()>.5));
   if(++glitchStep<7)glitchTimer=setTimeout(tick,65);else stopGlitch();
  }
  tick();
 }
 function updateScroll(){
  const box=interactiveHero.getBoundingClientRect();if(box.bottom < -innerHeight)return;const distance=Math.max(0,-box.top),height=photo.offsetHeight;
  const progress=Math.max(0,Math.min(1,distance/(height*3.5)));
  const insert=Math.max(0,Math.min(1,(progress-.05)/.4));
  const fade=Math.max(0,Math.min(1,(progress-.88)/.12));
  intro.style.setProperty('--insert',String(insert));
  const noWidth=word.querySelector('.intro-no').getBoundingClientRect().width;
  const seWidth=word.querySelector('.intro-se').getBoundingClientRect().width;
  word.style.setProperty('--no-width',noWidth+'px');
  word.style.setProperty('--se-width',seWidth+'px');

  intro.style.setProperty('--intro-opacity',String(1-fade));
  intro.style.setProperty('--intro-blur',(fade*18)+'px');
  if(insert>=1&&!glitchPlayed)playGlitch();
  if(progress<.05){stopGlitch();glitchPlayed=false;}
  if(progress>=1||reduced.matches)stopGlitch();
  intro.hidden=progress>=1;
  const heroCopy=interactiveHero.querySelector('.hero-line');
  heroCopy.classList.toggle('copy-visible',progress>=.96||reduced.matches);
  heroCopy.inert=progress<.96&&!reduced.matches;
  if(!intro.hidden)photo.classList.remove('is-exploring');
  const clarityProgress=Math.max(0,Math.min(1,(distance-height*3.7)/(height*1.15)));
  photo.classList.toggle('is-scroll-clear',clarityProgress>0);
  photo.style.setProperty('--scroll-blur',(14*(1-clarityProgress))+'px');photo.style.setProperty('--scroll-sharp',String(clarityProgress));
  photo.style.setProperty('--lens-sharp-alpha',String(1-clarityProgress));
  photo.style.setProperty('--lens-blur-alpha',String(clarityProgress));
  const introActive=progress<1&&!reduced.matches;
  document.body.classList.toggle('intro-active',introActive);
  document.querySelector('.header').inert=introActive;
  document.body.classList.remove('hero-header-hidden');
 }
 const trails=[.48,.34,.23,.13].map((strength,index)=>{
  const layer=photo.querySelector('.photo-blur-lens').cloneNode();layer.classList.add('lens-trail');layer.style.setProperty('--trail-strength',String(strength));photo.append(layer);
  return {layer,x:0,y:0,tau:420+index*240};
 });
 let lensFrame=0,lensX=0,lensY=0,targetX=0,targetY=0,lastTime=0,lensInitialized=false;
 function followLens(time){
  const delta=lastTime?Math.min(50,time-lastTime):16.67;lastTime=time;
  const ease=1-Math.exp(-delta/135);
  const stretchX=Math.min(1.32,1+Math.abs(targetX-lensX)/650);
  const stretchY=Math.min(1.32,1+Math.abs(targetY-lensY)/650);
  photo.style.setProperty('--lens-rx',(120*stretchX)+'px');photo.style.setProperty('--lens-ry',(120*stretchY)+'px');
  lensX+=(targetX-lensX)*ease;lensY+=(targetY-lensY)*ease;
  photo.style.setProperty('--lens-x',lensX+'px');photo.style.setProperty('--lens-y',lensY+'px');
  let unsettled=Math.abs(targetX-lensX)+Math.abs(targetY-lensY)>.15;
  trails.forEach(trail=>{const k=1-Math.exp(-delta/trail.tau);trail.x+=(targetX-trail.x)*k;trail.y+=(targetY-trail.y)*k;trail.layer.style.setProperty('--lens-x',trail.x+'px');trail.layer.style.setProperty('--lens-y',trail.y+'px');if(Math.abs(targetX-trail.x)+Math.abs(targetY-trail.y)>.3)unsettled=true;});
  if(unsettled)lensFrame=requestAnimationFrame(followLens);else{lensFrame=0;lastTime=0;}
 }
 photo.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||reduced.matches||!intro.hidden)return;
  const box=photo.getBoundingClientRect();targetX=event.clientX-box.left;targetY=event.clientY-box.top;
  if(!lensInitialized){lensX=targetX;lensY=targetY;trails.forEach(trail=>{trail.x=targetX;trail.y=targetY;});lensInitialized=true;}
  photo.classList.add('is-exploring');if(!lensFrame)lensFrame=requestAnimationFrame(followLens);
 });
 photo.addEventListener('pointerleave',()=>{photo.classList.remove('is-exploring');cancelAnimationFrame(lensFrame);lensFrame=0;lastTime=0;lensInitialized=false;});
 window.addEventListener('scroll',updateScroll,{passive:true});window.addEventListener('resize',updateScroll);reduced.addEventListener('change',updateScroll);updateScroll();
}

// Brief visual type fracture, without changing labels or accessible names.
if(typeof window!=='undefined')document.querySelectorAll('button,.header nav a,.text-link,footer nav a').forEach(control=>{
 let hoverTimer;
 control.addEventListener('pointerenter',event=>{
  if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  clearTimeout(hoverTimer);control.classList.remove('type-fracture');
  void control.offsetWidth;control.classList.add('type-fracture');
  hoverTimer=setTimeout(()=>control.classList.remove('type-fracture'),260);
 });
 control.addEventListener('pointerleave',()=>{clearTimeout(hoverTimer);control.classList.remove('type-fracture');});
});

// A local red light clipped to the hero lettering, independent of photo blur.
if(typeof window!=='undefined')document.querySelectorAll('.hero-line .hero-logo,.hero-line .hero-slogan').forEach(label=>{
 const region=document.querySelector('.hero-main');
 region.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const box=label.getBoundingClientRect();
  label.style.setProperty('--light-x',(event.clientX-box.left)+'px');
  label.style.setProperty('--light-y',(event.clientY-box.top)+'px');
  label.classList.toggle('red-light',event.clientX>box.left-70&&event.clientX<box.right+70&&event.clientY>box.top-70&&event.clientY<box.bottom+70);
 });
 region.addEventListener('pointerleave',()=>label.classList.remove('red-light'));
});

// Keep the soft red fade while briefly fracturing only the menu lettering.
if(typeof window!=='undefined')document.querySelectorAll('.hero-line nav a').forEach(link=>{
 let timer;
 link.addEventListener('pointerenter',event=>{
  if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  clearTimeout(timer);link.classList.remove('menu-glitch');void link.offsetWidth;link.classList.add('menu-glitch');
  timer=setTimeout(()=>link.classList.remove('menu-glitch'),240);
 });
 link.addEventListener('pointerleave',()=>{clearTimeout(timer);link.classList.remove('menu-glitch');});
});

// Product caption appears only over the photographed bottle or package.
if(typeof window!=='undefined'){
 const photo=document.querySelector('.hero-photo'),caption=photo?.querySelector('figcaption');
 if(caption){
  photo.addEventListener('pointermove',event=>{
   const hide=()=>caption.classList.remove('caption-follow');
   if(event.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||!document.querySelector('.hero-intro').hidden){hide();return;}
   const image=photo.querySelector('.photo-soft'),box=image.getBoundingClientRect(),bounds=photo.getBoundingClientRect();
   // Match the supplied studio WebP silhouettes, excluding the backdrop.
   const iw=image.naturalWidth||3840,ih=image.naturalHeight||2162;
   const scale=Math.max(box.width/iw,box.height/ih),imageWidth=iw*scale,imageHeight=ih*scale;
   const u=(event.clientX-(box.left+(box.width-imageWidth)/2))/imageWidth,v=(event.clientY-(box.top+(box.height-imageHeight)/2))/imageHeight;
   const onPackage=u>=.345&&u<=.55&&v>=.25&&v<=.84;
   const onBottle=u>=.56&&u<=.74&&v>=.38&&v<=.85;
   if(!onPackage&&!onBottle){hide();return;}
   const x=Math.max(16,Math.min(event.clientX-bounds.left+22,bounds.width-caption.offsetWidth-16));
   let y=event.clientY-bounds.top+24;if(y+caption.offsetHeight>bounds.height-16)y=event.clientY-bounds.top-caption.offsetHeight-18;
   caption.style.setProperty('--caption-x',x+'px');caption.style.setProperty('--caption-y',Math.max(16,y)+'px');caption.classList.add('caption-follow');
  });
  photo.addEventListener('pointerleave',()=>caption.classList.remove('caption-follow'));
  window.addEventListener('scroll',()=>caption.classList.remove('caption-follow'),{passive:true});
 }
}

// One real backdrop lens travels from the hero into the white scene and becomes a cursor.
if(typeof window!=='undefined'){
 const section=document.querySelector('.temperature-section');
 if(section){
  const region=section.querySelector('.temperature-scroll'),stage=section.querySelector('.temperature-stage'),world=section.querySelector('.temperature-world'),next=section.querySelector('.sense-black'),hero=document.querySelector('#top'),line=hero.querySelector('.hero-line'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const lens=document.createElement('div');lens.className='journey-glass';lens.setAttribute('aria-hidden','true');document.body.append(lens);
  let blackStartTimer=0;
  let frame=0,mouseX=innerWidth/2,mouseY=innerHeight*.6,lensX=mouseX,lensY=mouseY,cursorVisible=false;
  for(let i=0;i<16;i++){const particle=document.createElement('i');particle.style.left=((i*37+19)%100)+'%';particle.style.top=((i*17+5)%85)+'%';particle.style.animationDelay=-(i*.37)+'s';section.querySelector('.temperature-debris').append(particle);}
  const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{const x=clamp(n);return x*x*(3-2*x);};
  function draw(){frame=0;
   const vh=innerHeight,vw=stage.clientWidth,rect=region.getBoundingClientRect();if(rect.bottom < -vh && document.querySelector('.sense-scroll').getBoundingClientRect().bottom < 0){lens.style.opacity='0';cursorVisible=false;stage.classList.remove('is-sequence-pinned');next.classList.remove('is-sequence-pinned');return;}const p=clamp(-rect.top/Math.max(1,region.offsetHeight-stage.offsetHeight));
   const depth=clamp(p/.65),motionScale=Math.min(1,vw/1200);
   const motions=[['.temp-chevron',-20,-46,-5],['.temp-cross',24,-72,9],['.temp-cross-red',-12,32,-8],['.temp-star',30,-104,14]];
   motions.forEach(([selector,x,y,rotation])=>{const object=world.querySelector(selector);if(!object)return;const progress=reduced.matches?0:depth;object.style.setProperty('--depth-x',(x*progress*motionScale)+'px');object.style.setProperty('--depth-y',(y*progress*motionScale)+'px');object.style.setProperty('--depth-turn',(rotation*progress)+'deg');});
   const zoom=reduced.matches?0:smooth((p-.57)/.42),fade=smooth((zoom-.67)/.33);
   section.style.setProperty('--temp-progress',String(p));section.style.setProperty('--temp-exit',String(fade));section.style.setProperty('--black-arrival',String(fade));
   const landing=rect.top<0&&rect.bottom>0&&fade>0&&!reduced.matches;next.classList.remove('is-landing');next.classList.toggle('is-sequence-pinned',landing||(!reduced.matches&&document.querySelector('.sense-scroll').getBoundingClientRect().top<=0&&document.querySelector('.sense-scroll').getBoundingClientRect().bottom>0));
   stage.classList.toggle('is-sequence-pinned',!reduced.matches&&rect.top<=0&&rect.bottom>0);
   const fullyBlack=fade>=.999999;
   if(!fullyBlack){clearTimeout(blackStartTimer);blackStartTimer=0;next.classList.remove('sense-content-active');}
   else if(next.classList.contains('sense-ready'))next.classList.add('sense-content-active');
   else if(!blackStartTimer){blackStartTimer=setTimeout(()=>{blackStartTimer=0;if(Number(section.style.getPropertyValue('--black-arrival'))<.999999)return;next.classList.add('sense-ready','sense-content-active');next.dispatchEvent(new Event('sense-ready'));},180);}
world.classList.toggle('is-zooming',zoom>.02);section.style.setProperty('--zoom-surround-blur',(zoom*12)+'px');
   const footnote=section.querySelector('.temperature-footnote'),noteExit=smooth((p-.12)/.36);footnote.style.transform='translateX('+(noteExit*innerWidth*.75)+'px)';footnote.style.opacity=String(1-noteExit);
   const target=section.querySelector('.temp-strip'),slot=target.getBoundingClientRect(),wb=world.getBoundingClientRect(),oldScale=Number(world.dataset.scale||1),cx=(slot.left+slot.width/2-wb.left)/oldScale,cy=(slot.top+slot.height/2-wb.top)/oldScale,factor=1+zoom*zoom*42;
   world.style.transformOrigin=cx+'px '+cy+'px';world.style.transform='translate('+((vw/2-cx)*zoom)+'px,'+((stage.offsetHeight/2-cy)*zoom)+'px) scale('+factor+')';world.dataset.scale=String(factor);world.style.opacity=String(1-fade);
   const nb=next.getBoundingClientRect();next.style.setProperty('--sense-reveal','1');
   const handoff=smooth((vh-rect.top)/vh),baseDiameter=Math.min(330,Math.max(190,vw*.22));
   cursorVisible=!reduced.matches&&matchMedia('(hover:hover) and (pointer:fine)').matches&&next.classList.contains('sense-content-active')&&nb.top<vh*.85&&nb.bottom>0&&document.querySelector('.frequency-black').getBoundingClientRect().top>=vh*.85;
   let diameter=baseDiameter,x=vw/2,y=rect.top-baseDiameter*.45+handoff*(vh*.2+baseDiameter*.45),opacity=rect.top<vh&&rect.bottom>0?1:0,rx=0,ry=0;
   if(rect.top<=0){const travel=smooth(p/.72);x=vw/2;y=vh*(.2+travel*.56);diameter=baseDiameter*(1-smooth(p/.72)*.87);opacity*=1-smooth(zoom*4);rx=p*280;ry=p*360;}
   if(cursorVisible){lensX+=(mouseX-lensX)*.12;lensY+=(mouseY-lensY)*.12;x=lensX;y=lensY;diameter=42;opacity=1;rx=ry=0;}
   else{lensX=x;lensY=y;}
   const covered=rect.top>0&&!cursorVisible?Math.max(0,Math.min(diameter,rect.top-(y-diameter/2))):0;
   lens.style.clipPath='inset('+covered+'px 0 0 0)';
   lens.style.setProperty('--glass-diameter',diameter+'px');lens.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-50%) perspective(1000px) rotateX('+rx+'deg) rotateY('+ry+'deg)';lens.style.opacity=String(reduced.matches?0:opacity);
   // Move the editorial row down as the hero's final scroll segment passes, then clamp it.
   const descent=smooth((vh-rect.top)/vh);
   const baseTop=vh*(innerWidth>=768?.49:.43),maxDescent=Math.max(0,vh-baseTop-line.offsetHeight-32);line.style.setProperty('--hero-line-descent',(descent*maxDescent)+'px');
   if(cursorVisible&&Math.abs(mouseX-lensX)+Math.abs(mouseY-lensY)>.2)schedule();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  window.addEventListener('pointermove',event=>{mouseX=event.clientX;mouseY=event.clientY;if(cursorVisible)schedule();},{passive:true});
  const words=[...section.querySelectorAll('.temperature-word')];
  words.forEach(word=>{word.dataset.fullText=word.textContent;word.setAttribute('aria-hidden','true');word.style.setProperty('--typed-width',word.getBoundingClientRect().width+'px');});
  let typed=false;
  new IntersectionObserver(entries=>{
   if(typed||!entries.some(e=>e.isIntersecting))return;typed=true;section.classList.add('is-entered');
   if(reduced.matches)return;
   words.forEach(word=>{word.textContent='';});let wordIndex=0,charIndex=0;
   function type(){const word=words[wordIndex];if(!word)return;word.textContent=word.dataset.fullText.slice(0,++charIndex);if(charIndex>=word.dataset.fullText.length){wordIndex++;charIndex=0;}setTimeout(type,wordIndex===0?100:85);}
   setTimeout(type,250);
  },{threshold:.12}).observe(stage);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.fonts.ready.then(schedule);draw();
 }
}

// The main navigation returns on upward scroll after the hero.
if(typeof window!=='undefined'){
 const header=document.querySelector('.header'),hero=document.querySelector('#top');let previous=scrollY,travel=0;
 window.addEventListener('scroll',()=>{
  const delta=scrollY-previous;previous=scrollY;
  if(hero.getBoundingClientRect().bottom>innerHeight*.2){header.classList.remove('nav-scroll-hidden');travel=0;return;}
  if(Math.abs(delta)<1)return;
  travel=delta*travel<0?delta:travel+delta;
  if(header.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true'){header.classList.remove('nav-scroll-hidden');return;}
  if(travel>12)header.classList.add('nav-scroll-hidden');else if(travel < -9)header.classList.remove('nav-scroll-hidden');
 },{passive:true});
 // Preserve line breaks while typing the smaller scene copy.
 const scene=document.querySelector('.temperature-stage');
 const copy=[...document.querySelectorAll('.temperature-heading p,.temperature-footnote')];let started=false;
 new IntersectionObserver(entries=>{
  if(started||!entries.some(entry=>entry.isIntersecting))return;started=true;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  copy.forEach((element,index)=>{
   const lines=element.innerHTML.split(/<br\s*\/?>/i).map(line=>line.replace(/<[^>]*>/g,''));
   element.setAttribute('aria-label',lines.join(' '));element.style.minHeight=element.offsetHeight+'px';element.textContent='';
   const spans=lines.map((line,i)=>{const span=document.createElement('span');span.setAttribute('aria-hidden','true');if(i)element.append(document.createElement('br'));element.append(span);return span;});
   let row=0,ch=0;function type(){if(!spans[row])return;spans[row].textContent=lines[row].slice(0,++ch);if(ch>=lines[row].length){row++;ch=0;}setTimeout(type,index?40:70);}setTimeout(type,index?700:950);
  });
 },{threshold:.15}).observe(scene);
}

// Type the black scene without disturbing its inline product graphics.
if(typeof window!=='undefined'){
 const black=document.querySelector('.sense-black');
 if(black&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.fonts.ready.then(()=>{
   const groups=[...black.querySelectorAll('.sense-label,.sense-content h2,.sense-copy,.sense-footnote')].map(element=>{
    const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),nodes=[];let node;
    while(node=walker.nextNode())if(node.textContent.trim())nodes.push(node);
    const spans=nodes.map(text=>{const range=document.createRange();range.selectNodeContents(text);const world=black.querySelector('.sense-world'),scale=world.getBoundingClientRect().width/Math.max(1,world.offsetWidth),width=range.getBoundingClientRect().width/Math.max(.001,scale),span=document.createElement('span');span.className='sense-typed';span.dataset.fullText=text.textContent;span.style.width=width+'px';span.setAttribute('aria-hidden','true');text.replaceWith(span);return span;});
    element.setAttribute('aria-label',spans.map(span=>span.dataset.fullText).join(' '));return spans;
   });

   let started=false,animation=0,startTime=0;
   const delays=[100,400,1600,800],speeds=[45,85,45,45];
   function resetTyping(){cancelAnimationFrame(animation);animation=0;started=false;groups.flat().forEach(span=>span.textContent='');}
   function tick(now){
    let pending=false;
    groups.forEach((spans,index)=>{
     let remaining=Math.max(0,Math.floor((now-startTime-delays[index])/speeds[index]));
     spans.forEach(span=>{const full=span.dataset.fullText,count=Math.min(full.length,remaining),text=full.slice(0,count);if(span.textContent!==text)span.textContent=text;remaining=Math.max(0,remaining-full.length);if(count<full.length)pending=true;});
    });
    animation=pending?requestAnimationFrame(tick):0;
   }
   function checkVisible(){
    const rect=black.getBoundingClientRect(),world=black.querySelector('.sense-world');
    const visible=black.classList.contains('sense-content-active')&&rect.top<=2&&rect.bottom>=innerHeight*.8&&Number(world.style.opacity||1)>.9;
    if(visible&&!started){started=true;startTime=performance.now();animation=requestAnimationFrame(tick);}
    else if(!black.classList.contains('sense-content-active')||rect.bottom<=0||rect.top>=innerHeight||Number(world.style.opacity||1)<.2){if(started)resetTyping();}
   }
   resetTyping();
   new MutationObserver(checkVisible).observe(black,{attributes:true,attributeFilter:['class']});
   window.addEventListener('scroll',checkVisible,{passive:true});
   black.addEventListener('sense-ready',checkVisible);checkVisible();
  });
 }
}

// Black philosophy: reverse footnote travel, independent objects and car zoom.
if(typeof window!=='undefined'){
 const region=document.querySelector('.sense-scroll'),scene=document.querySelector('.sense-black'),world=document.querySelector('.sense-world'),frequency=document.querySelector('#frequencies'),product=document.querySelector('.frequency-black'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
 function render(){frame=0;const vh=innerHeight,b=region.getBoundingClientRect(),p=clamp(-b.top/Math.max(1,region.offsetHeight-scene.offsetHeight));
  const travel=smooth((p-.06)/.4),note=world.querySelector('.sense-footnote');note.style.transform='translateX('+(-travel*innerWidth*.75)+'px)';note.style.opacity=String(1-travel);
  const objects=[['.sense-cross',18,-62,8],['.sense-red',-12,32,-7],['.sense-asterisk',-25,-42,-12],['.sense-star',20,-95,14],['.sense-spark',-16,48,9],['.sense-ring',25,-56,-10]];
  objects.forEach(([selector,x,y,r])=>{const el=world.querySelector(selector),d=reduced.matches?0:clamp(p/.7);el.style.setProperty('--depth-x',(x*d)+'px');el.style.setProperty('--depth-y',(y*d)+'px');el.style.setProperty('--depth-turn',(r*d)+'deg');});
  const zoom=reduced.matches?0:smooth((p-.52)/.46),fade=smooth((zoom-.63)/.37),car=world.querySelector('.sense-car'),cb=car.getBoundingClientRect(),wb=world.getBoundingClientRect(),previous=Number(world.dataset.scale||1),cx=(cb.left+cb.width/2-wb.left)/previous,cy=(cb.top+cb.height/2-wb.top)/previous,scale=1+zoom*zoom*36;
  world.style.transformOrigin=cx+'px '+cy+'px';world.style.transform='translate('+((scene.clientWidth/2-cx)*zoom)+'px,'+((scene.offsetHeight/2-cy)*zoom)+'px) scale('+scale+')';world.dataset.scale=String(scale);world.style.opacity=String(1-fade);scene.style.setProperty('--car-exit',String(fade));world.classList.toggle('is-car-zooming',zoom>.02);world.style.setProperty('--car-blur',(zoom*10)+'px');frequency.style.setProperty('--frequency-arrival',String(fade));
  const fr=document.querySelector('.frequency-scroll'),fb=fr.getBoundingClientRect(),fp=clamp(-fb.top/Math.max(1,fr.offsetHeight-innerHeight));
  const productLanding=!reduced.matches&&((b.top<0&&fade>0&&fb.top>0)||(fb.top<=0&&fb.bottom>innerHeight));
  product.classList.remove('is-landing');product.classList.toggle('is-sequence-pinned',productLanding);product.classList.toggle('frequency-content-active',fade>=.999999);
  product.style.setProperty('--car-entry',String(reduced.matches?1:smooth(fp/.14)));
frequency.classList.remove('has-fixed-landing');
  const settle=reduced.matches?1:smooth(fp/.5),crop=product.querySelector('.frequency-car-crop'),figure=product.querySelector('.frequency-car').getBoundingClientRect(),centerX=figure.left+figure.width/2,centerY=figure.top+figure.width*589/824/2;
  crop.style.transform='translate('+((innerWidth/2-centerX)*(1-settle))+'px,'+((innerHeight/2-centerY)*(1-settle))+'px) scale('+(1+Math.pow(1-settle,2)*7)+')';
  product.style.setProperty('--car-settle',String(smooth((settle-.78)/.22)));
  const white=document.querySelector('.frequency-white'),whiteReveal=reduced.matches?1:smooth((fp-.67)/.3);white.style.opacity=String(whiteReveal);white.style.pointerEvents=whiteReveal>.5?'auto':'none';white.classList.toggle('is-sequence-pinned',!reduced.matches&&fb.bottom>innerHeight&&fb.top<=0);
  product.style.setProperty('--black-leave',String(1-whiteReveal));product.classList.toggle('is-white-handoff',whiteReveal>.01);

  product.classList.remove('is-product-focus');
  const carVisible=reduced.matches||(productLanding&&whiteReveal<1);crop.style.visibility=carVisible?'visible':'hidden';world.style.visibility=fade>=1?'hidden':'visible';
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.fonts.ready.then(schedule);render();
 document.querySelectorAll('.frequency-black,.frequency-white').forEach(surface=>surface.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduced.matches)return;const b=surface.getBoundingClientRect();surface.style.setProperty('--target-x',(event.clientX-b.left)+'px');surface.style.setProperty('--target-y',(event.clientY-b.top)+'px');}));
}

// A single wheel gesture switches the settled product state.
if(typeof window!=='undefined'){
 const track=document.querySelector('.frequency-scroll'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let lockedUntil=0,quietUntil=0;
 window.addEventListener('wheel',event=>{
  if(!track||reduce.matches||event.ctrlKey||Math.abs(event.deltaY)<=Math.abs(event.deltaX)||Math.abs(event.deltaY)<2)return;
  const now=performance.now(),box=track.getBoundingClientRect(),range=track.offsetHeight-innerHeight,p=-box.top/Math.max(1,range);
  if(now<lockedUntil||now<quietUntil){event.preventDefault();quietUntil=now+180;return;}
  let target=null;
  if(event.deltaY>0&&p>=.49&&p<.975)target=.98;
  if(event.deltaY<0&&p>.7&&p<=1.015)target=.52;
  if(target===null)return;
  event.preventDefault();lockedUntil=now+850;quietUntil=now+180;
  window.scrollTo({top:scrollY+box.top+range*target,behavior:'smooth'});
 },{passive:false});
}

// A short target glitch on product contact, without moving the pointer center.
if(typeof window!=='undefined'){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.frequency-car-link,.white-snow a').forEach(link=>{
  const target=link.closest('.frequency-black,.frequency-white').querySelector('.frequency-target');
  let timer=0;
  function clear(){clearTimeout(timer);target.classList.remove('target-static');}
  link.addEventListener('pointerenter',event=>{if(event.pointerType!=='mouse'||reduced.matches)return;clear();target.classList.add('target-static');timer=setTimeout(clear,260);});
  link.addEventListener('pointerleave',clear);
 });
}

// The collection swaps products in the same frame; the catalogue opens in place.
if(typeof window!=='undefined'){
 const region=document.querySelector('.collection-showcase'),stage=document.querySelector('.collection-stage'),object=document.querySelector('.collection-object'),details=document.querySelector('#collection-details'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
 function draw(){frame=0;const b=region.getBoundingClientRect(),p=Math.max(0,Math.min(1,-b.top/Math.max(1,region.offsetHeight-innerHeight))),t=Math.max(0,Math.min(1,(p-.25)/.5));stage.style.setProperty('--swap',(t*100)+'%');stage.style.setProperty('--scan-alpha',t>0&&t<1?'.25':'0');}
 function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);draw();
 object.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduce.matches)return;const b=object.getBoundingClientRect(),x=event.clientX-b.left,y=event.clientY-b.top,u=x/b.width,v=y/b.height,over=u>.24&&u<.88&&v>.08&&v<.9;object.classList.toggle('is-following',over);object.style.setProperty('--view-x',Math.min(b.width-155,x+22)+'px');object.style.setProperty('--view-y',Math.min(b.height-44,y+20)+'px');});
 object.addEventListener('pointerleave',()=>object.classList.remove('is-following'));
 function reveal(){details.hidden=false;object.setAttribute('aria-expanded','true');}
 object.addEventListener('click',()=>{reveal();details.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});});
 document.querySelectorAll('[data-filter-link]').forEach(link=>link.addEventListener('click',()=>{reveal();requestAnimationFrame(()=>details.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'}));}));
}
