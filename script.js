// script.js (reemplazar todo el contenido actual por este)

document.addEventListener("DOMContentLoaded", () => {
  /* ========== CONFIG ========== */
  const EVENT_DATE = new Date("2026-01-24T20:00:00"); // fecha/hora del evento
  const ORGANIZER_WA = "5212203717321"; // reemplaza por tu número (52+lada+número)

  /* ========== RENDER CALENDAR (ENERO 2026) ========== */
  function renderCalendar() {
    const cal = document.getElementById("calendar");
    if (!cal) return;

    const year = 2026;
    const month = 0; // Enero = 0
    const first = new Date(year, month, 1).getDay(); // 0=Dom ... 6=Sáb
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = "<table class='calendar-table'><thead><tr>";
    ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].forEach((d) => {
      html += `<th>${d}</th>`;
    });
    html += "</tr></thead><tbody>";

    let day = 1;
    for (let r = 0; r < 6; r++) {
      html += "<tr>";
      for (let c = 0; c < 7; c++) {
        if (r === 0 && c < first) {
          html += "<td></td>";
        } else if (day > daysInMonth) {
          html += "<td></td>";
        } else {
          const isEvent = day === 24;
          html += `<td class='${isEvent ? "event" : ""}'>${day}</td>`;
          day++;
        }
      }
      html += "</tr>";
    }

    html += "</tbody></table>";
    cal.innerHTML = html;
  }

  /* ========== COUNTDOWN (se actualiza cada segundo) ========== */
  function updateCountdown() {
    const now = new Date();
    let diff = Math.max(0, EVENT_DATE - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    const container = document.getElementById("countdown");
    if (container) {
      container.innerHTML = `
        <div class='block'><div>${days}</div><small>días</small></div>
        <div class='block'><div>${hours}</div><small>hrs</small></div>
        <div class='block'><div>${minutes}</div><small>min</small></div>
        <div class='block'><div>${seconds}</div><small>seg</small></div>`;
    }
  }

  /* ========== ZOOM on scroll (IntersectionObserver) ========== */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".photo-wrap").forEach((el) => io.observe(el));
  document.querySelectorAll(".photos-grid img").forEach((el) => io.observe(el));
  // también observa thumb del salón (si aplica)
  const salon = document.querySelector(".map-thumb");
  if (salon) io.observe(salon);

  /* ========== MAPS LINK (Google Maps) ========== */
  const mapsLink = document.getElementById("mapsLink");
  if (mapsLink) {
    mapsLink.href = encodeURI(
      "https://www.google.com/maps/search/?api=1&query=Avenida+Paseo+de+la+Reforma+465+Cuauht%C3%A9moc+CDMX"
    );
  }

  /* ========== FORMULARIO RSVP ========== */
  const form = document.getElementById("rsvpForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();
      const rsvp = document.getElementById("rsvp").value;

      if (!nombre || !telefono || !rsvp) {
        alert("Por favor completa los campos requeridos.");
        return;
      }

      const folio = "REG-" + Date.now().toString(36).slice(-6).toUpperCase();
      const data = {
        nombre,
        telefono,
        email,
        mensaje,
        rsvp,
        folio,
        date: new Date().toISOString(),
      };

      // guardado local (placeholder)
      const stored = JSON.parse(localStorage.getItem("invitados") || "[]");
      stored.push(data);
      localStorage.setItem("invitados", JSON.stringify(stored));

      // mensaje y envío a WhatsApp del organizador
      let textOrg = `Confirmación: ${
        rsvp === "si" ? "ASISTIRÁ" : "NO ASISTIRÁ"
      }\nNombre: ${nombre}\nTel: ${telefono}\nEmail: ${email}\nFolio: ${folio}`;
      window.open(
        `https://wa.me/${ORGANIZER_WA}?text=${encodeURIComponent(textOrg)}`,
        "_blank"
      );

      // mensaje en la UI
      const formMsg = document.getElementById("formMsg");
      if (formMsg) {
        formMsg.innerText =
          rsvp === "si"
            ? `Gracias ${nombre}. Se generó el folio: ${folio}.`
            : `Gracias ${nombre} por tu confirmación.`;
      }

      form.reset();
    });
  }

  /* ========== Inicializaciones ========== */
  renderCalendar();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Animación de flores al cargar la página
const circleFlowers = document.querySelectorAll(".circle-container .flower");
circleFlowers.forEach((flower, i) => {
  setTimeout(() => {
    flower.style.opacity = 1;
  }, i * 500); // cada flor aparece con 0.5s de retraso
});

//Musica de fondo con botón de control
const music = document.getElementById("bgMusic");
    const toggle = document.getElementById("toggleMusic");
    let musicIsOn = false;

    // Reanudar música automáticamente si el usuario ya la activó antes
    if (localStorage.getItem("music") === "on") {
      playMusic();
    }

    toggle.addEventListener("click", () => {
      if (musicIsOn) {
        pauseMusic();
      } else {
        playMusic();
      }
    });

    function playMusic() {
      music.play().then(() => {
        musicIsOn = true;
        toggle.textContent = "🎵";
        localStorage.setItem("music", "on");
      }).catch(err => {
        console.log("El navegador bloqueó el autoplay hasta que el usuario interactúe.");
      });
    }

    function pauseMusic() {
      music.pause();
      musicIsOn = false;
      toggle.textContent = "🔇";
      localStorage.setItem("music", "off");
    }

    // Intento de reproducir apenas el usuario haga cualquier interacción
    document.addEventListener("click", () => {
      if (!musicIsOn && localStorage.getItem("music") === "on") {
        playMusic();
      }
    });