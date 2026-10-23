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
matchMedia('(min-width: 768px)').addEventListener('change', () => closeMenu());

// Reversible, scroll-linked NOSE -> NOISE intro and frosted-glass image exploration.
const interactiveHero = document.querySelector('.interactive-hero');
if (interactiveHero) {
  const photo = interactiveHero.querySelector('.hero-photo');
  const mainVisual = interactiveHero.querySelector('.hero-main');
  const intro = interactiveHero.querySelector('.hero-intro');
  interactiveHero.querySelector('.intro-skip').addEventListener('click', () => {
    const start = interactiveHero.getBoundingClientRect().top + scrollY;
    scrollTo({ top: start + interactiveHero.offsetHeight - innerHeight, behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  const clarity = interactiveHero.querySelector('.clarity-toggle');
  const word = interactiveHero.querySelector('.intro-word');
  const no = interactiveHero.querySelector('.intro-no');
  const letterI = interactiveHero.querySelector('.intro-i');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let scrollDirty = true, frame = 0, lastProgress = 0, glitchTimer;
  let targetX = 0, targetY = 0, x = 0, y = 0, exploring = false, firstPoint = true;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  clarity.hidden = false;
  function measure() {
    interactiveHero.style.setProperty('--i-width', `${letterI.offsetWidth}px`);
    interactiveHero.style.setProperty('--join-x', `${no.offsetLeft + no.offsetWidth}px`);
    scrollDirty = true;
    schedule();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function render() {
    frame = 0;
    if (scrollDirty) {
      scrollDirty = false;
      const bounds = interactiveHero.getBoundingClientRect();
      const distance = Math.max(1, interactiveHero.offsetHeight - innerHeight);
      const progress = reduced.matches ? 1 : clamp(-bounds.top / distance);
      mainVisual.inert = progress < .92;
      intro.inert = progress > .8;
      const split = smooth((progress - .14) / .34);
      interactiveHero.style.setProperty('--hero-split', split);
      interactiveHero.style.setProperty('--hero-i-alpha', clamp((progress - .24) / .2));
      interactiveHero.style.setProperty('--hero-i-y', `${(1 - smooth((progress - .22) / .28)) * 150}px`);
      interactiveHero.style.setProperty('--hero-word-alpha', 1 - smooth((progress - .63) / .17));
      interactiveHero.style.setProperty('--hero-reveal', smooth((progress - .66) / .26));
      document.body.classList.toggle('hero-header-hidden', !reduced.matches && bounds.bottom >= innerHeight - 1 && bounds.top <= 1);
      if (!reduced.matches && lastProgress < .52 && progress >= .52 && progress < .7) {
        word.classList.remove('is-glitch');
        void word.offsetWidth;
        word.classList.add('is-glitch');
        clearTimeout(glitchTimer);
        glitchTimer = setTimeout(() => word.classList.remove('is-glitch'), 280);
      }
      lastProgress = progress;
    }
    if (exploring) {
      const follow = reduced.matches ? 1 : .18;
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      photo.style.setProperty('--lens-x', `${x}px`);
      photo.style.setProperty('--lens-y', `${y}px`);
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .3) schedule();
    }
  }
  function explore(event) {
    if (event.pointerType === 'mouse' && !finePointer.matches) return;
    const rect = photo.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    if (firstPoint) { x = targetX; y = targetY; firstPoint = false; }
    exploring = true;
    photo.classList.add('is-exploring');
    schedule();
  }
  function stopExploring() { exploring = false; firstPoint = true; photo.classList.remove('is-exploring'); }
  photo.addEventListener('pointermove', explore, { passive: true });
  photo.addEventListener('pointerdown', explore, { passive: true });
  photo.addEventListener('pointerleave', stopExploring);
  photo.addEventListener('pointercancel', stopExploring);
  photo.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') stopExploring(); });
  clarity.addEventListener('click', () => {
    const clear = clarity.getAttribute('aria-pressed') !== 'true';
    clarity.setAttribute('aria-pressed', String(clear));
    clarity.textContent = clear ? '블러로 돌아가기' : '이미지 선명하게 보기';
    photo.classList.toggle('is-clear', clear);
  });
  interactiveHero.addEventListener('keydown', event => {
    if (event.key === 'Escape') { stopExploring(); if (clarity.getAttribute('aria-pressed') === 'true') clarity.click(); }
  });
  addEventListener('scroll', () => { scrollDirty = true; schedule(); }, { passive: true });
  addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
}

