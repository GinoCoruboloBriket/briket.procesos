// Lógica del lista desplegable Procesos
//document.addEventListener("DOMContentLoaded", () => {
//    const acc = document.getElementsByClassName("accordion");
//
//    for (let i = 0; i < acc.length; i++) {
//        acc[i].addEventListener("click", function () {
//            this.classList.toggle("active");
//
//            const panel = this.nextElementSibling;
//            panel.style.display = panel.style.display === "block" ? "none" : "block";
//        });
//    }
//});


// Lógica del lista desplegable Procesos + menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {

    // Acordeones
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        });
    }

    // Menú hamburguesa
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("header nav ul");

    if (menuToggle && navList) {
        menuToggle.addEventListener("click", () => {
            navList.classList.toggle("show");
            menuToggle.classList.toggle("open");
        });
    }
});

// ===== CARRUSEL DE ÁREAS =====

document.addEventListener("DOMContentLoaded", () => {
    // ... tu código de acordeones y menú ...

    const container = document.querySelector(".areas-scroll-container");
    const leftBtn = document.getElementById("areas-left");
    const rightBtn = document.getElementById("areas-right");

    if (container && leftBtn && rightBtn) {
        const cardWidth = 260 + 14; // ancho + gap

        leftBtn.addEventListener("click", () => {
            container.scrollBy({ left: -cardWidth, behavior: "smooth" });
        });

        rightBtn.addEventListener("click", () => {
            container.scrollBy({ left: cardWidth, behavior: "smooth" });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {


    let scale = 1;
    let posX = 0;
    let posY = 0;
    let drag = false;
    let startX, startY;

    // Zoom con scroll
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(0.5, scale + delta), 4);
        update();
    });

    // Drag para mover plano
    container.addEventListener("mousedown", (e) => {
        drag = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    });

    container.addEventListener("mouseup", () => drag = false);
    container.addEventListener("mouseleave", () => drag = false);

    container.addEventListener("mousemove", (e) => {
        if (!drag) return;
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        update();
    });

    function update() {
        img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

});




// ===== Modal imagen sidebar ===== //
//----------------------------------//
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sidebar-image-btn");
  const modal = document.getElementById("img-modal");
  const backdrop = document.getElementById("img-modal-backdrop");
  const closeBtn = document.getElementById("img-modal-close");

  if (!btn || !modal || !backdrop || !closeBtn) return;

  const open = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
});

