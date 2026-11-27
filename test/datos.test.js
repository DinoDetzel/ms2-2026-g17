const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

const { CONTROLES } = require("../public/js/data.js");

// Estos tests revisan que los checklists esten bien cargados.
// Si alguien agrega una unidad nueva en data.js con un error de tipeo
// en una propiedad, lo detectan antes de que llegue a la pantalla.

const TIPOS_VALIDOS = [undefined, "combustible", "escritura"];

function todasLasListas() {
    return Object.entries(CONTROLES).flatMap(([sector, unidades]) =>
        Object.entries(unidades).map(([id, lista]) => ({ sector, id, lista }))
    );
}

describe("estructura de CONTROLES", () => {
    test("existen los sectores AUTO y MAT", () => {
        assert.deepEqual(Object.keys(CONTROLES).sort(), ["AUTO", "MAT"]);
    });

    test("cada sector tiene al menos una unidad", () => {
        assert.ok(Object.keys(CONTROLES.AUTO).length > 0);
        assert.ok(Object.keys(CONTROLES.MAT).length > 0);
    });

    test("MAT incluye CENTRAL y DESTACAMENTO", () => {
        assert.ok(Array.isArray(CONTROLES.MAT.CENTRAL));
        assert.ok(Array.isArray(CONTROLES.MAT.DESTACAMENTO));
    });

    test("ninguna lista esta vacia", () => {
        for (const { sector, id, lista } of todasLasListas()) {
            assert.ok(Array.isArray(lista), `${sector}/${id} no es una lista`);
            assert.ok(lista.length > 0, `${sector}/${id} esta vacia`);
        }
    });
});

describe("items de los checklists", () => {
    test("todos los items tienen categoria y descripcion", () => {
        for (const { sector, id, lista } of todasLasListas()) {
            lista.forEach((item, i) => {
                assert.equal(typeof item.cat, "string", `${sector}/${id} item ${i} sin cat`);
                assert.ok(item.cat.trim().length > 0, `${sector}/${id} item ${i} con cat vacia`);
                assert.equal(typeof item.item, "string", `${sector}/${id} item ${i} sin item`);
                assert.ok(item.item.trim().length > 0, `${sector}/${id} item ${i} con descripcion vacia`);
            });
        }
    });

    test("todos los items tienen cantidad", () => {
        // En AUTO la cantidad es "-" (no aplica), pero el campo tiene que estar
        for (const { sector, id, lista } of todasLasListas()) {
            lista.forEach((item, i) => {
                assert.equal(typeof item.cant, "string", `${sector}/${id} item ${i} sin cant`);
                assert.ok(item.cant.trim().length > 0, `${sector}/${id} item ${i} con cant vacia`);
            });
        }
    });

    test("el tipo de cada item es uno de los que sabe dibujar renderizarChecklist", () => {
        for (const { sector, id, lista } of todasLasListas()) {
            lista.forEach((item, i) => {
                assert.ok(
                    TIPOS_VALIDOS.includes(item.tipo),
                    `${sector}/${id} item ${i} tiene tipo desconocido: ${item.tipo}`
                );
            });
        }
    });

    test("cada unidad de automotores tiene el control de combustible", () => {
        for (const [id, lista] of Object.entries(CONTROLES.AUTO)) {
            const combustible = lista.filter((item) => item.tipo === "combustible");
            assert.ok(combustible.length >= 1, `AUTO/${id} no tiene item de combustible`);
        }
    });

    // Marcado como todo: el test encontro items repetidos (por ejemplo "Escalera"
    // dos veces en TECHO de MAT U-2). Puede ser un error de carga o que realmente
    // haya dos elementos iguales. Falta confirmarlo con el cuartel antes de tocar los datos.
    test("no hay items repetidos dentro de una misma categoria", { todo: "confirmar repetidos con el cuartel" }, () => {
        for (const { sector, id, lista } of todasLasListas()) {
            const vistos = new Set();
            for (const item of lista) {
                const clave = item.cat + "|" + item.item;
                assert.ok(!vistos.has(clave), `${sector}/${id} repite "${item.item}" en ${item.cat}`);
                vistos.add(clave);
            }
        }
    });

    test("las categorias no tienen espacios de mas", { todo: "hay categorias como 'TECHO ' con espacio al final" }, () => {
        for (const { sector, id, lista } of todasLasListas()) {
            for (const item of lista) {
                assert.equal(item.cat, item.cat.trim(), `${sector}/${id} categoria con espacios: "${item.cat}"`);
            }
        }
    });
});
