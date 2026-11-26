const { test, describe, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");

const {
    obtenerControles,
    esUnidadEspecial,
    etiquetaBoton,
    nombreUnidad,
    armarUsuario
} = require("../public/js/controles.js");
const { CONTROLES } = require("../public/js/data.js");

describe("obtenerControles", () => {
    // Se silencia el console.warn para que no ensucie la salida de los tests
    // y de paso se puede verificar si se llamo o no.
    beforeEach(() => mock.method(console, "warn", () => {}));
    afterEach(() => mock.restoreAll());

    test("normal: devuelve la lista de una unidad de automotores", () => {
        const lista = obtenerControles(CONTROLES, "AUTO", 1);

        assert.equal(lista, CONTROLES.AUTO[1]);
        assert.ok(lista.length > 0);
        assert.equal(console.warn.mock.callCount(), 0);
    });

    test("normal: devuelve la lista de una unidad de materiales", () => {
        const lista = obtenerControles(CONTROLES, "MAT", 2);

        assert.equal(lista, CONTROLES.MAT[2]);
    });

    test("limite: CENTRAL y DESTACAMENTO usan claves de texto", () => {
        assert.equal(obtenerControles(CONTROLES, "MAT", "CENTRAL"), CONTROLES.MAT.CENTRAL);
        assert.equal(obtenerControles(CONTROLES, "MAT", "DESTACAMENTO"), CONTROLES.MAT.DESTACAMENTO);
    });

    test("limite: el id como numero o como texto da la misma lista", () => {
        // generarGrilla manda el id como string porque sale de Object.keys
        assert.equal(obtenerControles(CONTROLES, "AUTO", "2"), obtenerControles(CONTROLES, "AUTO", 2));
    });

    test("limite: U-1 no devuelve los controles de U-10", () => {
        // Este era el falso positivo posible con includes('U-1') en el codigo original
        assert.notEqual(obtenerControles(CONTROLES, "AUTO", 1), CONTROLES.AUTO[10]);
    });

    test("error: una unidad que no existe devuelve [] y avisa por consola", () => {
        const lista = obtenerControles(CONTROLES, "AUTO", 99);

        assert.deepEqual(lista, []);
        assert.equal(console.warn.mock.callCount(), 1);
    });

    test("error: un sector que no existe devuelve []", () => {
        assert.deepEqual(obtenerControles(CONTROLES, "ELEC", 1), []);
    });

    test("error: unidad que existe en AUTO pero no en MAT devuelve []", () => {
        // La unidad 1 tiene controles de automotores pero no de materiales
        assert.ok(CONTROLES.AUTO[1]);
        assert.deepEqual(obtenerControles(CONTROLES, "MAT", 1), []);
    });

    test("error: sin catalogo no rompe y devuelve []", () => {
        assert.deepEqual(obtenerControles(undefined, "AUTO", 1), []);
        assert.deepEqual(obtenerControles({ AUTO: { 1: "no es una lista" } }, "AUTO", 1), []);
    });
});

describe("nombres de unidades", () => {
    test("esUnidadEspecial reconoce solo CENTRAL y DESTACAMENTO", () => {
        assert.equal(esUnidadEspecial("CENTRAL"), true);
        assert.equal(esUnidadEspecial("DESTACAMENTO"), true);
        assert.equal(esUnidadEspecial("2"), false);
        assert.equal(esUnidadEspecial("central"), false);
    });

    test("etiquetaBoton agrega el prefijo salvo en las unidades especiales", () => {
        assert.equal(etiquetaBoton("5", "U-"), "U-5");
        assert.equal(etiquetaBoton("5", "MAT U-"), "MAT U-5");
        assert.equal(etiquetaBoton("CENTRAL", "MAT U-"), "CENTRAL");
    });

    test("nombreUnidad arma el titulo segun el sector", () => {
        assert.equal(nombreUnidad("AUTO", "3"), "UNIDAD 3");
        assert.equal(nombreUnidad("MAT", "3"), "MAT U-3");
        assert.equal(nombreUnidad("MAT", "DESTACAMENTO"), "MAT DESTACAMENTO");
    });
});

describe("armarUsuario (login)", () => {
    test("normal: une nombre y apellido en mayusculas", () => {
        assert.equal(armarUsuario("Juan", "Perez"), "JUAN PEREZ");
    });

    test("limite: ignora espacios al principio, al final y repetidos", () => {
        assert.equal(armarUsuario("  Juan  ", " Perez "), "JUAN PEREZ");
        assert.equal(armarUsuario("Juan  Carlos", "Perez"), "JUAN CARLOS PEREZ");
    });

    test("error: falta el nombre o el apellido", () => {
        assert.equal(armarUsuario("", "Perez"), null);
        assert.equal(armarUsuario("Juan", ""), null);
    });

    test("error: solo espacios cuenta como vacio", () => {
        assert.equal(armarUsuario("   ", "Perez"), null);
    });

    test("error: valores undefined no rompen", () => {
        assert.equal(armarUsuario(undefined, undefined), null);
    });
});
