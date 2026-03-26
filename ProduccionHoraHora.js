// Configurá acá las horas que quieras ver por defecto
const HORAS_INICIALES = [
    "06:00-07:00",
    "07:00-08:00",
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00"
];

// URL de Apps Script que va a escribir en la planilla
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwE0ly7MOuDMORchBZP5lHMf5y3UceWZn5h2Mt1oaF9X3jhSuQW0KblD6t7bfuGdNbQaw/exec";

document.addEventListener("DOMContentLoaded", () => {
    // Setear fecha de hoy por defecto
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const inputFecha = document.getElementById("fecha-dia");
    if (inputFecha) inputFecha.value = `${yyyy}-${mm}-${dd}`;

    // Crear filas iniciales
    const tbody = document.getElementById("tbody-horas");
    HORAS_INICIALES.forEach(hora => {
        agregarFilaHora(tbody, hora);
    });

    // Botones
    document.getElementById("btn-agregar-fila")?.addEventListener("click", () => {
        agregarFilaHora(tbody, "");
    });

    document.getElementById("btn-guardar-dia")?.addEventListener("click", guardarDia);

    // Calcular resumen inicial
    recalcularTotales();
});

function agregarFilaHora(tbody, horaTexto) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>
            <input type="text" class="input-hora" value="${horaTexto}" placeholder="Ej: 14:00-15:00">
        </td>
        <td>
            <input type="number" class="input-meta" min="0" step="1">
        </td>
        <td>
            <input type="number" class="input-producido" min="0" step="1">
        </td>
        <td>
            <input type="number" class="input-merma" readonly>
        </td>
        <td>
            <input type="text" class="input-motivo" placeholder="Motivo si hubo merma">
        </td>
    `;

    // Escuchar cambios en Meta y Producido para recalcular Merma y totales
    const metaInput = tr.querySelector(".input-meta");
    const prodInput = tr.querySelector(".input-producido");

    [metaInput, prodInput].forEach(input => {
        input.addEventListener("input", () => {
            recalcularMermaFila(tr);
            recalcularTotales();
        });
    });

    tbody.appendChild(tr);
}

function recalcularMermaFila(tr) {
    const meta = Number(tr.querySelector(".input-meta")?.value || 0);
    const prod = Number(tr.querySelector(".input-producido")?.value || 0);
    const mermaInput = tr.querySelector(".input-merma");
    if (!mermaInput) return;

    const merma = meta - prod;
    mermaInput.value = isNaN(merma) ? "" : merma;
}

function recalcularTotales() {
    const filas = document.querySelectorAll("#tbody-horas tr");
    let totalMeta = 0;
    let totalProd = 0;
    let totalMerma = 0;

    filas.forEach(tr => {
        const meta = Number(tr.querySelector(".input-meta")?.value || 0);
        const prod = Number(tr.querySelector(".input-producido")?.value || 0);
        const merma = Number(tr.querySelector(".input-merma")?.value || 0);

        totalMeta += meta;
        totalProd += prod;
        totalMerma += merma;
    });

    document.getElementById("meta-total").textContent = totalMeta;
    document.getElementById("producido-total").textContent = totalProd;
    document.getElementById("merma-total").textContent = totalMerma;
}

function obtenerDatosTabla() {
    const fecha = document.getElementById("fecha-dia")?.value || "";
    const linea = document.getElementById("linea")?.value || "";
    const turno = document.getElementById("turno")?.value || "";

    const filas = document.querySelectorAll("#tbody-horas tr");
    const registros = [];

    filas.forEach(tr => {
        const hora = tr.querySelector(".input-hora")?.value.trim();
        const meta = tr.querySelector(".input-meta")?.value;
        const producido = tr.querySelector(".input-producido")?.value;
        const merma = tr.querySelector(".input-merma")?.value;
        const motivo = tr.querySelector(".input-motivo")?.value.trim();

        // Si no hay hora ni meta ni producido, la fila se ignora
        if (!hora && !meta && !producido) return;

        registros.push({
            hora: hora,
            meta: Number(meta || 0),
            producido: Number(producido || 0),
            merma: Number(merma || 0),
            motivo: motivo
        });
    });

    return {
        fecha,
        linea,
        turno,
        registros
    };
}

async function guardarDia() {
    const estado = document.getElementById("estado-guardado");
    if (estado) {
        estado.style.color = "#16a34a";
        estado.textContent = "Guardando...";
    }

    const datos = obtenerDatosTabla();
    console.log("Enviando a Apps Script:", datos);

    try {
        const resp = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                accion: "guardarHoraHora",
                payload: datos
            })
        });

        const texto = await resp.text();
        console.log("Respuesta HTTP:", resp.status, texto);

        if (!resp.ok) {
            throw new Error("HTTP " + resp.status + " - " + texto);
        }

        if (estado) {
            estado.style.color = "#16a34a";
            estado.textContent = "Datos guardados correctamente ✅";
        }

    } catch (err) {
        console.error("Error en guardarDia:", err);
        if (estado) {
            estado.style.color = "red";
            estado.textContent = "No se pudo guardar. Revisar conexión o Apps Script.";
        }
    }
}