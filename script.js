// ====== CONFIG ======
const TARGET_DATE = new Date('2026-01-24T19:00:00'); // cambia la fecha/hora aquí
// ====================

// DOM helpers
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

// Mobile nav
const navToggle = qs('.nav-toggle');
const navList = qs('.nav-list');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  })
}

// Smooth anchor scroll
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.startsWith('#')){
      const target = document.querySelector(href);
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); navList.classList.remove('show'); }
    }
  })
})

// Countdown
function updateCountdown(){
  const now = new Date();
  let diff = TARGET_DATE - now;
  if(diff < 0) diff = 0;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);
  qs('#days').textContent = String(days).padStart(2,'0');
  qs('#hours').textContent = String(hours).padStart(2,'0');
  qs('#minutes').textContent = String(minutes).padStart(2,'0');
  qs('#seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Simple RSVP storage (local)
const form = qs('#rsvp-form');
const successModal = qs('#form-success');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const record = {};
    for(const [k,v] of data.entries()) record[k] = v;
    // read existing
    const saved = JSON.parse(localStorage.getItem('rsvp_records')||'[]');
    saved.push({record, date: new Date().toISOString()});
    localStorage.setItem('rsvp_records', JSON.stringify(saved));
    // show modal
    successModal.hidden = false;
  })
}
qs('#close-modal')?.addEventListener('click', ()=>{ qs('#form-success').hidden = true; });

// Lazy load gallery images & lightbox
function lazyLoad(){
  qsa('img.lazy').forEach(img=>{
    const src = img.getAttribute('data-src');
    if(src){ img.src = src; img.classList.remove('lazy'); img.addEventListener('click', openLightbox); }
  })
}

function openLightbox(e){
  const src = e.currentTarget.src;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.style.cssText = 'position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.85);z-index:60';
  const img = document.createElement('img');
  img.src = src; img.style.maxWidth='92%'; img.style.maxHeight='92%'; img.alt = '';
  overlay.appendChild(img);
  overlay.addEventListener('click', ()=>overlay.remove());
  document.body.appendChild(overlay);
}

window.addEventListener('load', ()=>{
  lazyLoad();
});
