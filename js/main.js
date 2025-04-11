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

	/// Lógica reset de la tabla
	const confirmarReset = document.getElementById("confirmarReset");
	if (confirmarReset) {
		confirmarReset.addEventListener("click", () => {
			localStorage.removeItem("inventario_virtual");
			localStorage.removeItem("progreso_inventario");
			document.getElementById("jsonTextarea").value = "";
			document.getElementById("materialBody").innerHTML = "";
			document.getElementById("tablaMateriales").classList.add("d-none");
			// Alerta confirmación reset
			const alerta = document.getElementById("alertaInicial");
			if (alerta) alerta.classList.remove("d-none");
			document.getElementById("filtroFaltantesWrapper").classList.add("d-none");

		});
	}

	const procesarBtn = document.getElementById("procesarJsonBtn");
	if (procesarBtn) {
		procesarBtn.addEventListener("click", iniciarDesdeTextarea);
	}

	// Genera link de la api con el ID insertado
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

	// Lógica elementos faltantes (Diferencia <= 0 )
	const toggleFaltantes = document.getElementById("toggleFaltantes");
	if (toggleFaltantes) {
		toggleFaltantes.addEventListener("change", () => {
			const mostrarSoloFaltantes = toggleFaltantes.checked;
			document.querySelectorAll("#materialBody tr").forEach(row => {
				const diff = parseInt(row.children[3]?.textContent || "0");
				if (mostrarSoloFaltantes && diff >= 0) {
					row.classList.add("d-none");
				} else {
					row.classList.remove("d-none");
				}
			});
		});
	}

	// Botón para mostrar solo elementos faltantes (diferencia <= 0)
	let mostrandoSoloFaltantes = false;

	const btnFaltantes = document.getElementById("btnFaltantes");
	if (btnFaltantes) {
		btnFaltantes.addEventListener("click", () => {
			mostrandoSoloFaltantes = !mostrandoSoloFaltantes;

			document.querySelectorAll("#materialBody tr").forEach(row => {
				const diff = parseInt(row.children[3]?.textContent || "0");
				if (mostrandoSoloFaltantes && diff >= 0) {
					row.classList.add("d-none");
				} else {
					row.classList.remove("d-none");
				}
			});

			btnFaltantes.textContent = mostrandoSoloFaltantes
				? "🔄 Ver todos"
				: "🔎 Ver solo faltantes";
			btnFaltantes.classList.toggle("btn-outline-warning", mostrandoSoloFaltantes);
			btnFaltantes.classList.toggle("btn-outline-secondary", !mostrandoSoloFaltantes);
		});
	}
	// Inicia los tooltips
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

	// Función para exportar tabla (A mejorar)
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

});
