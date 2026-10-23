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
 const photo=interactiveHero.querySelector('.hero-photo'),intro=interactiveHero.querySelector('.hero-intro'),word=intro.querySelector('.intro-word'),logo=interactiveHero.querySelector('.hero-logo'),clarity=interactiveHero.querySelector('.clarity-toggle'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let finished=false,animation,timer,step=0;
 function finishIntro(){finished=true;clearTimeout(timer);animation?.cancel();intro.hidden=true;interactiveHero.classList.remove('logo-resolving');}
 function resolveLetters(){
  if(finished)return;
  [...word.children].forEach(letter=>letter.classList.toggle('is-pixel',step<6&&Math.random()>.45));
  if(++step<8){timer=setTimeout(resolveLetters,65);return;}
  const from=word.getBoundingClientRect(),to=logo.getBoundingClientRect();
  animation=word.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+(to.left-from.left)+'px,'+(to.top-from.top)+'px) scale('+(to.height/from.height)+')',opacity:1}],{duration:520,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
  animation.onfinish=finishIntro;
 }
 function updateScroll(){const box=interactiveHero.getBoundingClientRect();photo.classList.toggle('is-scroll-clear',box.top < -8);document.body.classList.toggle('hero-header-hidden',box.top > -photo.offsetHeight*.72);if(box.top < -8)finishIntro();}
 clarity.hidden=false;
 clarity.addEventListener('click',()=>{const clear=clarity.getAttribute('aria-pressed')!=='true';clarity.setAttribute('aria-pressed',String(clear));clarity.textContent=clear?'이미지 흐리게 보기':'이미지 선명하게 보기';photo.classList.toggle('is-clear',clear);});
 photo.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduced.matches)return;const box=photo.getBoundingClientRect();photo.style.setProperty('--lens-x',(event.clientX-box.left)+'px');photo.style.setProperty('--lens-y',(event.clientY-box.top)+'px');photo.classList.add('is-exploring');});
 photo.addEventListener('pointerleave',()=>photo.classList.remove('is-exploring'));
 window.addEventListener('scroll',updateScroll,{passive:true});window.addEventListener('resize',updateScroll);reduced.addEventListener('change',finishIntro);updateScroll();
 if(reduced.matches||scrollY>8)finishIntro();else{interactiveHero.classList.add('logo-resolving');document.fonts.ready.then(()=>{if(!finished)resolveLetters();});}
}
