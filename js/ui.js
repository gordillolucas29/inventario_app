// ui.js - renderizado de interfaz, toasts, tablas
import { getRowClass, guardarProgreso, obtenerProgreso } from "./helpers.js";

export function crearToast(mensaje, tipo = 'info') {
	const body = document.getElementById("toast-body");
	const toastEl = document.getElementById("liveToast");
	const iconos = {
		success: "✅",
		danger: "❌",
		warning: "⚠️",
		info: "ℹ️"
	};
	body.innerHTML = `${iconos[tipo] || ""} ${mensaje}`;
	toastEl.className = `toast bg-${tipo} text-white`;
	new bootstrap.Toast(toastEl).show();
}


export function crearControlesCantidad(input, cantidadApi, row, diffCell, nombre) {
	const container = document.createElement("div");
	container.className = "d-flex gap-1 justify-content-center align-items-center";

	const menos = document.createElement("button");
	menos.className = "btn btn-outline-secondary btn-sm minus";
	menos.textContent = "-";

	const mas = document.createElement("button");
	mas.className = "btn btn-outline-secondary btn-sm plus";
	mas.textContent = "+";

	menos.onclick = () => {
		input.value = Math.max(0, parseInt(input.value) - 1);
		actualizarDiferencia(input, cantidadApi, row, diffCell, nombre);
	};

	mas.onclick = () => {
		input.value = parseInt(input.value) + 1;
		actualizarDiferencia(input, cantidadApi, row, diffCell, nombre);
	};


	container.appendChild(menos);
	container.appendChild(input);
	container.appendChild(mas);

	return container;
}

export function actualizarDiferencia(input, cantidadApi, row, cell, nombre) {
	const diff = parseInt(input.value || 0) - parseInt(cantidadApi);
	cell.textContent = diff;

	input.dataset.tocado = "1"; // marcar que el usuario tocó este input

	if (input.dataset.tocado === "1") {
		row.className = `table ${getRowClass(diff)}`;
	} else {
		row.className = `table`;
	}

	guardarProgreso(nombre, parseInt(input.value));
}

export function crearFila(material) {
	const row = document.createElement("tr");
	row.className = `table`; // neutro por defecto


	const nombre = material.name.replace(/^\d{5,10}/, '').trim();

	const tdNombre = document.createElement("td");
	tdNombre.innerHTML = `<strong>${nombre}</strong><br><span class='text-muted small'>${material.product_code || ''}</span>`;

	const tdApi = document.createElement("td");
	tdApi.textContent = material.cantidad;

	const tdInput = document.createElement("td");
	const input = document.createElement("input");
	input.type = "number";
	input.className = "form-control form-control-sm input-celda";
	input.value = obtenerProgreso(nombre);
	input.min = 0;

	const tdDiff = document.createElement("td");
	const tdSerial = document.createElement("td");

	tdSerial.innerHTML = material.seriales?.length
		? `<span class='seriales'>${material.seriales.join(", ")}</span>`
		: "-";

	tdInput.appendChild(crearControlesCantidad(input, material.cantidad, row, tdDiff, nombre));
	const diffInicial = parseInt(input.value || 0) - parseInt(material.cantidad);
	tdDiff.textContent = diffInicial;
	row.className = `table`; // sin color al cargar

	row.appendChild(tdNombre);
	row.appendChild(tdApi);
	row.appendChild(tdInput);
	row.appendChild(tdDiff);
	row.appendChild(tdSerial);

	return row;
}