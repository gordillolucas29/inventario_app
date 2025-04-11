// helpers.js - funciones auxiliares

export function getRowClass(diff) {
	if (diff < 0) return 'table-danger';
	if (diff > 0) return 'table-success';
	return 'table-light';
}

export function guardarProgreso(nombre, cantidad) {
	const progreso = JSON.parse(localStorage.getItem("progreso_inventario") || "{}");
	progreso[nombre] = cantidad;
	localStorage.setItem("progreso_inventario", JSON.stringify(progreso));
}

export function obtenerProgreso(nombre) {
	const progreso = JSON.parse(localStorage.getItem("progreso_inventario") || "{}");
	return progreso[nombre] || 0;
}

export function guardarJson(json) {
	localStorage.setItem("inventario_virtual", JSON.stringify(json));
}

export function obtenerJson() {
	try {
		const json = localStorage.getItem("inventario_virtual");
		return JSON.parse(json);
	} catch {
		return null;
	}
}

export function esJsonValido(texto) {
	try {
		const data = JSON.parse(texto);
		return Array.isArray(data);
	} catch {
		return false;
	}
}