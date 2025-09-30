// ================= script.js =================
// CONFIGURA AQUÍ LA FECHA/HORA DEL EVENTO
const eventDate = new Date('2025-10-20T19:00:00');

// Cuenta regresiva
function updateCountdown(){
  const now = new Date();
  const diff = eventDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const short = document.getElementById('countdownShort');
  const fullDateSpan = document.getElementById('eventDateReadable');
  if(short) short.textContent = diff > 0 ? `Faltan ${days}d ${hrs}h ${mins}m` : 'El evento ya pasó';
  if(fullDateSpan) fullDateSpan.textContent = eventDate.toLocaleString();
}
setInterval(updateCountdown,1000);
updateCountdown();

// Lightbox para galería
function openLightbox(src){
  const overlay = document.createElement('div');
  overlay.style.position='fixed'; overlay.style.left=0; overlay.style.top=0; overlay.style.right=0; overlay.style.bottom=0;
  overlay.style.background='rgba(0,0,0,0.85)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex=9999;
  const img = document.createElement('img'); img.src = src; img.style.maxWidth='90%'; img.style.maxHeight='90%'; img.style.borderRadius='10px';
  overlay.appendChild(img);
  overlay.addEventListener('click', ()=>document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.gallery-item').forEach(img=>{
    img.addEventListener('click', ()=> openLightbox(img.src));
  });

  // Formulario RSVP (simulado)
  const form = document.getElementById('rsvpForm');
  const msg = document.getElementById('rsvpMsg');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(form);
      const nombre = data.get('nombre');
      msg.textContent = `Gracias ${nombre}, tu respuesta fue enviada.`;
      form.reset();
    });
  }
});

// Efecto ZOOM en la imagen del hero al hacer scroll
(function(){
  const hero = document.querySelector('.hero');
  const img = document.querySelector('.hero-img');
  if(!hero || !img) return;
  let ticking = false;
  function onScroll(){
    const rect = hero.getBoundingClientRect();
    // progreso entre 0 (inicio) y 1 (cuando se ha movido una altura)
    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    // escala mínima 1, máxima 1.2 -> ajusta el 0.2 para más/menos zoom
    const scale = 1 + progress * 0.2;
    img.style.transform = `translate(-50%,-50%) scale(${scale})`;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      window.requestAnimationFrame(()=>{ onScroll(); ticking = false; });
      ticking = true;
    }
  }, {passive:true});
  // inicial
  onScroll();
})();

// FIN del script