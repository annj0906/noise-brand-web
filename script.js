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
