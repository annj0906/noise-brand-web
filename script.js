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
  const box=interactiveHero.getBoundingClientRect(),distance=Math.max(0,-box.top),height=photo.offsetHeight;
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
 photo.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduced.matches||!intro.hidden)return;const box=photo.getBoundingClientRect();photo.style.setProperty('--lens-x',(event.clientX-box.left)+'px');photo.style.setProperty('--lens-y',(event.clientY-box.top)+'px');photo.classList.add('is-exploring');});
 photo.addEventListener('pointerleave',()=>photo.classList.remove('is-exploring'));
 window.addEventListener('scroll',updateScroll,{passive:true});window.addEventListener('resize',updateScroll);reduced.addEventListener('change',updateScroll);updateScroll();
}

// Brief visual type fracture, without changing labels or accessible names.
if(typeof window!=='undefined')document.querySelectorAll('button,.header nav a,.hero-line nav a,.text-link,footer nav a').forEach(control=>{
 let hoverTimer;
 control.addEventListener('pointerenter',event=>{
  if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  clearTimeout(hoverTimer);control.classList.remove('type-fracture');
  void control.offsetWidth;control.classList.add('type-fracture');
  hoverTimer=setTimeout(()=>control.classList.remove('type-fracture'),260);
 });
 control.addEventListener('pointerleave',()=>{clearTimeout(hoverTimer);control.classList.remove('type-fracture');});
});
