// main.js - punto de entrada y eventos DOM
import { iniciarDesdeLocalStorage, iniciarDesdeTextarea } from "./modulo.js";

window.addEventListener("DOMContentLoaded", () => {
	iniciarDesdeLocalStorage();

	const btnReiniciar = document.getElementById("btnReiniciar");
	if (btnReiniciar) {
		btnReiniciar.addEventListener("click", () => {
			const modal = new bootstrap.Modal(document.getElementById("confirmResetModal"));
			modal.show();
		});
	}

	const confirmarReset = document.getElementById("confirmarReset");
	if (confirmarReset) {
		confirmarReset.addEventListener("click", () => {
			localStorage.removeItem("inventario_virtual");
			localStorage.removeItem("progreso_inventario");
			document.getElementById("jsonTextarea").value = "";
			document.getElementById("materialBody").innerHTML = "";
			document.getElementById("tablaMateriales").classList.add("d-none");
			// Volver a mostrar alerta
			const alerta = document.getElementById("alertaInicial");
			if (alerta) alerta.classList.remove("d-none");
		});
	}


	const procesarBtn = document.getElementById("procesarJsonBtn");
	if (procesarBtn) {
		procesarBtn.addEventListener("click", iniciarDesdeTextarea);
	}

	const idBtn = document.getElementById("generarLinkBtn");
	if (idBtn) {
		idBtn.addEventListener("click", () => {
			const id = document.getElementById("inventoryId").value.trim();
			if (!id) return;
			const link = document.getElementById("apiLink");
			const paso = document.getElementById("pasoJson");
			link.href = `http://inventario.panatelcomm.com/api/inventory/${id}`;
			link.textContent = `Abrir JSON del inventario (ID ${id})`;
			paso.classList.remove("d-none");
		});
	}

	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

	const exportarCSV = document.getElementById("btnExportarCSV");
	if (exportarCSV) {
		exportarCSV.addEventListener("click", () => {
			const materiales = JSON.parse(localStorage.getItem("inventario_virtual") || "[]");
			const progreso = JSON.parse(localStorage.getItem("progreso_inventario") || "{}");

			const filas = [["Material", "Código", "Inventario", "Físico", "Diferencia", "Serial"]];

			materiales.forEach(mat => {
				const nombre = mat.name.replace(/^\\d{5,10}/, '').trim();
				const inventario = parseInt(mat.cantidad);
				const fisico = parseInt(progreso[nombre]) || 0;
				const diferencia = fisico - inventario;

				if (diferencia !== 0) {
					const serial = (mat.seriales || []).join(" | ").replace(/"/g, '""');
					filas.push([
						`"${nombre.replace(/"/g, '""')}"`,
						`"${(mat.product_code || "").replace(/"/g, '""')}"`,
						inventario,
						fisico,
						diferencia,
						`"${serial}"`
					]);
				}
			});

			if (filas.length === 1) {
				alert("No hay diferencias para exportar.");
				return;
			}

			const csvContent = filas.map(f => f.join(",")).join("\r\n");
			const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM para Excel
			const url = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = "diferencias_inventario.csv";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		});
	}
	const body = document.body;
	const toggle = document.getElementById("toggleNoche");

	function aplicarModoNoche(activo) {
		if (activo) {
			body.classList.add("bg-dark", "text-light");
			document.querySelectorAll(".table").forEach(t => t.classList.add("table-dark"));
		} else {
			body.classList.remove("bg-dark", "text-light");
			document.querySelectorAll(".table").forEach(t => t.classList.remove("table-dark"));
		}
		document.querySelectorAll(".modal-content").forEach(modal => {
			if (activo) {
				modal.classList.add("bg-dark", "text-white");
			} else {
				modal.classList.remove("bg-dark", "text-white");
			}
		});

	}

	toggle.addEventListener("change", () => {
		const activo = toggle.checked;
		localStorage.setItem("modo_noche", activo ? "1" : "0");
		aplicarModoNoche(activo);
	});

});
// Aplicar modo noche al cargar si está activo
const modoGuardado = localStorage.getItem("modo_noche") === "1";
toggle.checked = modoGuardado;
aplicarModoNoche(modoGuardado);
