let eventos = [];
let currentYear;
let currentMonth; // 0-11

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

async function cargarEventos() {
  // ⬇⬇⬇ URL de Apps Script (ya estaba bien)
  const url = 'https://script.google.com/macros/s/AKfycbxRBmTRRnG-TGMRxl30psoJXDSCM2L8J3AUyulj634RbZojfgveTwOfIr14T6grbOb7/exec';

  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = `<p style="grid-column:1 / -1; font-size:13px;color:#777;">
    Cargando eventos...
  </p>`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Error al obtener eventos');

    const data = await resp.json();
    console.log("Eventos recibidos:", data);   // debug en consola
    eventos = data.eventos || [];

    if (eventos.length === 0) {
      grid.innerHTML = `<p style="grid-column:1 / -1; font-size:13px;color:#777;">
        No hay eventos cargados desde Notion.
      </p>`;
      return;
    }

    const hoy = new Date();
    currentYear = hoy.getFullYear();
    currentMonth = hoy.getMonth();

    renderCalendar();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="grid-column:1 / -1; color:red; font-size:13px;">
      No se pudo cargar el calendario.
    </p>`;
  }
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const title = document.getElementById("calendar-title");
  grid.innerHTML = "";

  title.textContent = `${meses[currentMonth]} ${currentYear}`;

  const dayNames = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  dayNames.forEach(d => {
    const div = document.createElement("div");
    div.className = "calendar-day-name";
    div.textContent = d;
    grid.appendChild(div);
  });

  const firstDay = new Date(currentYear, currentMonth, 1);
  let start = firstDay.getDay(); // 0=Dom
  if (start === 0) start = 7;
  const blanks = start - 1;

  for (let i = 0; i < blanks; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day";
    empty.classList.add("empty");
    grid.appendChild(empty);
  }

  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  // ⬅ NUEVO: calcular la fecha de HOY en formato YYYY-MM-DD
  const hoy = new Date();
  const hoyISO = toISODate(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  for (let day = 1; day <= lastDay; day++) {
    const fechaStr = toISODate(currentYear, currentMonth, day);

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";

    const number = document.createElement("div");
    number.className = "calendar-day-number";
    number.textContent = day;
    dayDiv.appendChild(number);

    const eventosDelDia = eventos.filter(ev => {
      if (!ev.fecha) return false;
      const soloFecha = ev.fecha.split("T")[0]; // por si viene con hora
      return soloFecha === fechaStr;
    });

    if (eventosDelDia.length > 0) {
      dayDiv.classList.add("has-event");

      // Puntito indicador
      const dot = document.createElement("div");
      dot.className = "event-dot";
      dayDiv.appendChild(dot);

      // ⭐ Mini texto con el título del primer evento
      const preview = document.createElement("div");
      preview.className = "calendar-event-preview";
      const tituloPrimero = eventosDelDia[0].titulo || "";
      preview.textContent = abreviarTitulo(tituloPrimero, 18); // 18 caracteres aprox
      dayDiv.appendChild(preview);

      dayDiv.addEventListener("click", () => {
        mostrarEventosDelDia(fechaStr, eventosDelDia);
      });
    }

    // ⬅ NUEVO: si este cuadrito es el día de HOY, le agregamos el botón
    if (fechaStr === hoyISO) {
      const programaBtnDia = document.createElement("button");
      programaBtnDia.className = "programa-dia-btn";
      programaBtnDia.textContent = "📄 Programación diaria";

      programaBtnDia.addEventListener("click", (e) => {
        e.stopPropagation(); // para que no dispare también el click del día

        const ddStr = String(day).padStart(2, "0");
        const mmStr = String(currentMonth + 1).padStart(2, "0");

        const ruta = `\\\\server2025\\iso_9000\\29-Documentos de Uso Comun\\Programa Diario\\PRODUCCIÓN DIARIA ${ddStr}-${mmStr} UNICO TURNO.xlsx`;

        // nueva pestaña:
        window.open(ruta, "_blank");

        // o si preferís descarga directa:
        // window.location.href = ruta;
        
      });

      dayDiv.appendChild(programaBtnDia);
    }

    grid.appendChild(dayDiv);
  }
}


function mostrarEventosDelDia(fechaStr, eventosDelDia) {
  const cont = document.getElementById("event-list");
  cont.innerHTML = "";

    //
    //const f = new Date(fechaStr);
    //const tituloFecha = document.createElement("p");
    //tituloFecha.style.fontSize = "14px";
    //tituloFecha.style.fontWeight = "bold";
    //tituloFecha.style.marginBottom = "8px";
    //tituloFecha.textContent = `Eventos del ${f.getDate()}/${f.getMonth()+1}/${f.getFullYear()}`;
    //cont.appendChild(tituloFecha);
    //


    // fechaStr viene como "YYYY-MM-DD" - CAMBIO-PRUEBA
    const [year, month, day] = fechaStr.split('-').map(Number);

    
    const tituloFecha = document.createElement("p");
    tituloFecha.style.fontSize = "14px";
    tituloFecha.style.fontWeight = "bold";
    tituloFecha.style.marginBottom = "8px";
    tituloFecha.textContent = `Eventos del ${day}/${month}/${year}`;
    cont.appendChild(tituloFecha);
    //Aca termina la parte de Prueba. Si no anda, reemplazar por lo anterior


  if (eventosDelDia.length === 0) {
    cont.innerHTML += `<p style="font-size:14px;">No hay eventos en esta fecha.</p>`;
    return;
  }

  eventosDelDia.forEach(ev => {
    const item = document.createElement("div");
    item.className = "event-list-item";

    item.innerHTML = `
      <div class="event-title">${ev.titulo || "Sin título"}</div>
      <div class="event-meta">
        ${ev.tipo ? `<strong>Tipo:</strong> ${ev.tipo} · ` : ""}
        ${ev.descripcion || ""}
      </div>
    `;

    cont.appendChild(item);
  });

    

}

function toISODate(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// ⭐ Helper para cortar el texto dentro del cuadrito
function abreviarTitulo(texto, maxLen) {
  if (!texto) return "";
  if (texto.length <= maxLen) return texto;
  return texto.slice(0, maxLen - 1) + "…";
}

//Prueba boton programa diario
function crearLinkProgramaDiario() {
  const btn = document.getElementById("btn-programa");
  if (!btn) return;

  const hoy = new Date();
  let dd = hoy.getDate();
  let mm = hoy.getMonth() + 1;

  // dos dígitos
  dd = String(dd).padStart(2, "0");
  mm = String(mm).padStart(2, "0");

  const fecha = `${dd}-${mm}`;

  const ruta = `\\\\server2025\\iso_9000\\29-Documentos de Uso Comun\\Programa Diario\\PRODUCCIÓN DIARIA ${fecha} UNICO TURNO.csv`;

  btn.addEventListener("click", () => {
    // Para entorno de intranet normalmente alcanza con esto:
    window.location.href = ruta;
    // Si preferís nueva pestaña, usá:
    // window.open(ruta, "_blank");
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
      renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
      if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
      } else {
        currentMonth++;
      }
      renderCalendar();
    });
  }

  // Menú hamburguesa
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("header nav ul");

    if (menuToggle && navList) {
        menuToggle.addEventListener("click", () => {

            // Mostrar / ocultar panel
            navList.classList.toggle("show");

            // Activar animación de hamburguesa a cruz
            menuToggle.classList.toggle("open");
        });
    }
  

  // 🔵 Link dinámico al programa diario de HOY
  crearLinkProgramaDiario();

  // 🔁 Carga de eventos desde Apps Script
  cargarEventos();
});
