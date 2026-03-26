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

            // Mostrar / ocultar panel
            navList.classList.toggle("show");

            // Activar animación de hamburguesa a cruz
            menuToggle.classList.toggle("open");
        });
    }
});
