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
	const group = document.createElement("div");
	group.className = "input-group justify-content-center flex-nowrap";

	const menos = document.createElement("button");
	menos.className = "btn btn-outline-dark";
	menos.textContent = "−";

	const mas = document.createElement("button");
	mas.className = "btn btn-outline-dark";
	mas.textContent = "+";

	const completar = document.createElement("button");
	completar.className = "btn btn-outline-success";
	completar.innerHTML = "🟰";

	// Aplicar estilo al input
	input.type = "number";
	input.classList.add("form-control", "text-center", "input-celda");
	input.style.width = "60px";
	input.style.minWidth = "60px";
	input.style.maxWidth = "80px";
	input.style.flex = "0 0 auto"; // ¡esto evita que se estire!

	// Eventos
	menos.onclick = () => {
		input.value = Math.max(0, parseInt(input.value) - 1);
		actualizarDiferencia(input, cantidadApi, row, diffCell, nombre);
	};

	mas.onclick = () => {
		input.value = parseInt(input.value) + 1;
		actualizarDiferencia(input, cantidadApi, row, diffCell, nombre);
	};

	completar.onclick = () => {
		input.value = cantidadApi;
		actualizarDiferencia(input, cantidadApi, row, diffCell, nombre);
	};

	group.appendChild(completar);
	group.appendChild(input);
	group.appendChild(menos);
	group.appendChild(mas);

	return group;
}

export function actualizarDiferencia(input, cantidadApi, row, cell, nombre) {
	const diff = parseInt(input.value || 0) - parseInt(cantidadApi);
	cell.textContent = diff;

	input.dataset.tocado = "1";
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

	// Restaurar color si ya se había tocado ese campo
	if (input.value !== "0" && input.value !== "") {
		input.dataset.tocado = "1";
		row.className = `table ${getRowClass(diffInicial)}`;
	} else {
		row.className = `table`;
	}


	row.appendChild(tdNombre);
	row.appendChild(tdApi);
	row.appendChild(tdInput);
	row.appendChild(tdDiff);
	row.appendChild(tdSerial);

	return row;
}