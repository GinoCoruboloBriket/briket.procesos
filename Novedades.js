async function cargarNovedades() {
  const contenedor = document.getElementById('news-grid-dinamicas');
  if (!contenedor) return;

  const url = 'https://script.google.com/macros/s/AKfycbw2ELKuxsM4n8F6kNwoZfRaKloDy2_XKruuAjFJSGMPRLHWR9DMP8m160KGsP3cuQ/exec';

  contenedor.innerHTML = '<p style="font-size:13px;color:#777;">Cargando novedades...</p>';

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Error en la respuesta');

    const data = await resp.json();
    const novedades = data.novedades || [];

    if (novedades.length === 0) {
      contenedor.innerHTML = '<p style="font-size:13px;color:#777;">No hay novedades cargadas.</p>';
      return;
    }

    // 1) Ordenar por fecha (más nuevas primero)
    const ordenadas = [...novedades].sort((a, b) => {
      const fa = a.fecha ? new Date(a.fecha) : 0;
      const fb = b.fecha ? new Date(b.fecha) : 0;
      return fb - fa; // descendente
    });

    // 2) Quedarnos solo con las últimas 4
    const ultimas = ordenadas.slice(0, 4);

    contenedor.innerHTML = '';

    // 3) Renderizar solo esas 4
    ultimas.forEach(n => {
      const card = document.createElement('div');
      card.className = 'news-card';

      card.innerHTML = `
        ${
          n.imagen
          ? `
            <div class="news-image">
                <img class="clickable-image" src="${n.imagen}" alt="${n.titulo || 'Imagen de la novedad'}">
            </div>
            `
          : `
            <div class="news-image placeholder">
                <span>Sin imagen</span>
            </div>
            `
        }

        <div class="news-header">
            <div class="news-title">${n.titulo || 'Sin título'}</div>
            <div class="news-date">${n.fecha || ''}</div>
        </div>

        <div class="news-area">Área: ${n.area || 'General'}</div>

        <div class="news-body">
            ${n.descripcion || ''}
            ${n.link ? `<br><br><a href="${n.link}" target="_blank" style="font-size:12px;">Ver detalle en Notion →</a>` : ''}
        </div>

        <span class="news-tag ${(n.tipo || '').toLowerCase()}">${n.tipo || ''}</span>
      `;

      contenedor.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p style="font-size:13px;color:red;">No se pudieron cargar las novedades.</p>';
  }
}

cargarNovedades();

// Lightbox
document.addEventListener("click", function(e){
  if (e.target.classList.contains("clickable-image")) {
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");

      lightboxImg.src = e.target.src;
      lightbox.classList.add("active");
  }
});

document.getElementById("lightbox").addEventListener("click", function(){
    this.classList.remove("active");
});


// Menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
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
    });
