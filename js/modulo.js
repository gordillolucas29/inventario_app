// modulo.js - lógica principal del inventario
import { guardarJson, obtenerJson, esJsonValido } from "./helpers.js";
import { crearFila, crearToast } from "./ui.js";

export function procesarInventario(jsonData) {
	const tbody = document.getElementById("materialBody");
	const tabla = document.getElementById("tablaMateriales");

	if (!Array.isArray(jsonData)) return crearToast("El JSON no es válido.", "danger");

	guardarJson(jsonData);
	tbody.innerHTML = "";

	jsonData.forEach(material => {
		const row = crearFila(material);
		tbody.appendChild(row);
	});

	tabla.classList.remove("d-none");
	document.getElementById("pasoJson")?.classList.add("d-none");

	const alerta = document.getElementById("alertaInicial");
	if (alerta) alerta.classList.add("d-none");

}

export function iniciarDesdeTextarea() {
	const textarea = document.getElementById("jsonTextarea");
	if (!textarea) return;

	const texto = textarea.value.trim();
	if (!esJsonValido(texto)) return crearToast("El JSON ingresado no es válido.", "danger");

	const data = JSON.parse(texto);
	procesarInventario(data);
	document.getElementById("filtroFaltantesWrapper").classList.remove("d-none");
}

export function iniciarDesdeLocalStorage() {
	const data = obtenerJson();
	if (Array.isArray(data)) procesarInventario(data);
	document.getElementById("filtroFaltantesWrapper").classList.remove("d-none");

}