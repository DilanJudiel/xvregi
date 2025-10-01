/* ====== CONFIGURACION ====== */
const EVENT_DATE = new Date("2026-01-24T20:00:00"); // fecha y hora del evento
const ORGANIZER_WA = "5212203717321"; // Reemplaza por tu número con código país (ej: 52 + lada + número)

/* ====== Calendario simple para Enero 2026 ====== */
function renderCalendar() {
  const cal = document.getElementById("calendar");
  const year = 2026;
  const month = 0; // Enero = 0
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = "<table><thead><tr>";
  ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].forEach(
    (d) => (html += `<th>${d}</th>`)
  );
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
renderCalendar();

/* ====== Countdown ====== */
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
  container.innerHTML = `
        <div class='block'><div>${days}</div><small>días</small></div>
        <div class='block'><div>${hours}</div><small>hrs</small></div>
        <div class='block'><div>${minutes}</div><small>min</small></div>
        <div class='block'><div>${seconds}</div><small>seg</small></div>`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ====== Enlace a Google Maps / Waze ====== */
document.getElementById("mapsLink").href = encodeURI(
  "https://www.google.com/maps/search/?api=1&query=Avenida+Paseo+de+la+Reforma+465+Cuauht%C3%A9moc+CDMX"
);

/* ====== Formulario: guardado en localStorage + generacion folio + envio via WA (cliente) ====== */
function genFolio() {
  const t = Date.now().toString(36).toUpperCase();
  return "REG-" + t.slice(-6);
}

document
  .getElementById("rsvpForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const rsvp = document.getElementById("rsvp").value;
    const acomp = parseInt(
      document.getElementById("acompanantes").value || "0",
      10
    );
    if (!nombre || !telefono || !rsvp) {
      alert("Completa los campos requeridos");
      return;
    }
    const folio = genFolio();
    const data = {
      nombre,
      telefono,
      email,
      mensaje,
      rsvp,
      acompanantes: acomp,
      folio,
      date: new Date().toISOString(),
    };

    // === Guardar localmente (placeholder para base de datos). ===
    // Reemplaza este bloque por llamada a tu API o Firebase.
    const stored = JSON.parse(localStorage.getItem("invitados") || "[]");
    stored.push(data);
    localStorage.setItem("invitados", JSON.stringify(stored));

    // === Preparar mensaje WhatsApp prellenado al organizador y al invitado ===
    if (rsvp === "si") {
      // Mensaje para el invitado con folio
      const textGuest = `¡Gracias ${nombre}! Tu confirmación se registró. Folio: ${folio}. Nos vemos el 24/01/2026.`;
      // Abrir chat de invitado (esto abre la app de WhatsApp del usuario para enviar el mensaje automáticamente desde su teléfono).
      // Puedes quitar esta línea si no deseas que el invitado necesite enviar nada.
      // window.open(`https://wa.me/${telefono.replace(/\D/g,'')}?text=${encodeURIComponent(textGuest)}`,'_blank');

      // Mensaje para organizador con datos completos
      const textOrg = `Nueva confirmación\nNombre: ${nombre}\nTel: ${telefono}\nEmail: ${email}\nRSVP: Sí\nAcompañantes: ${acomp}\nFolio: ${folio}`;
      // Abre chat del organizador (usuario debe tener WhatsApp). Se puede comentar si no se quiere abrir.
      window.open(
        `https://wa.me/${ORGANIZER_WA}?text=${encodeURIComponent(textOrg)}`,
        "_blank"
      );

      document.getElementById(
        "formMsg"
      ).innerText = `Gracias ${nombre}. Se generó el folio: ${folio}.`;
    } else {
      // RSVP = no
      const textOrg = `Confirmación de NO asistencia\nNombre: ${nombre}\nTel: ${telefono}\nEmail: ${email}\nMensaje: ${mensaje}\nFolio: ${folio}`;
      window.open(
        `https://wa.me/${ORGANIZER_WA}?text=${encodeURIComponent(textOrg)}`,
        "_blank"
      );
      document.getElementById("formMsg").innerText =
        "Gracias por tu confirmación.";
    }

    // reset (opcional)
    document.getElementById("rsvpForm").reset();
  });
