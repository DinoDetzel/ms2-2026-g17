// Funciones sin acceso al DOM. Se usan desde app.js en el navegador
// y desde los tests en Node, por eso reciben los datos por parametro.

const UNIDADES_ESPECIALES = ["CENTRAL", "DESTACAMENTO"];

function obtenerControles(catalogo, sector, id) {
    const lista = catalogo?.[sector]?.[id];
    if (!Array.isArray(lista)) {
        console.warn(`Sin controles definidos para ${sector} / ${id}`);
        return [];
    }
    return lista;
}

function esUnidadEspecial(id) {
    return UNIDADES_ESPECIALES.includes(String(id));
}

// Texto del boton de la grilla
function etiquetaBoton(id, prefijo) {
    return esUnidadEspecial(id) ? String(id) : prefijo + id;
}

// Titulo que se muestra arriba del checklist
function nombreUnidad(sector, id) {
    if (esUnidadEspecial(id)) return "MAT " + id;
    return sector === "AUTO" ? "UNIDAD " + id : "MAT U-" + id;
}

// Devuelve el nombre completo en mayusculas o null si falta algun dato
function armarUsuario(nombre, apellido) {
    const nom = (nombre ?? "").trim();
    const ape = (apellido ?? "").trim();
    if (!nom || !ape) return null;
    return (nom + " " + ape).replace(/\s+/g, " ").toUpperCase();
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        obtenerControles,
        esUnidadEspecial,
        etiquetaBoton,
        nombreUnidad,
        armarUsuario
    };
}
