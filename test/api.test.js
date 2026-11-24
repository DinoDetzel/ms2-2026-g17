const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

describe("API del servidor", () => {
    test("GET /api/health responde 200 con estado ok", async () => {
        const res = await request(app).get("/api/health");

        assert.equal(res.status, 200);
        assert.match(res.headers["content-type"], /json/);
        assert.deepEqual(res.body, {
            status: "ok",
            message: "Sistema de Bomberos funcionando"
        });
    });

    test("una ruta /api inexistente responde 404 en JSON", async () => {
        const res = await request(app).get("/api/unidades-que-no-existen");

        assert.equal(res.status, 404);
        assert.equal(res.body.status, "error");
    });

    test("POST a /api/health no esta permitido y devuelve 404", async () => {
        const res = await request(app).post("/api/health").send({});

        assert.equal(res.status, 404);
    });
});

describe("Archivos estaticos", () => {
    test("GET / sirve el index.html del frontend", async () => {
        const res = await request(app).get("/");

        assert.equal(res.status, 200);
        assert.match(res.headers["content-type"], /html/);
        assert.match(res.text, /js\/data\.js/);
        assert.match(res.text, /js\/app\.js/);
    });

    test("los scripts del frontend se cargan en el orden correcto", async () => {
        const res = await request(app).get("/");

        const posData = res.text.indexOf("js/data.js");
        const posControles = res.text.indexOf("js/controles.js");
        const posApp = res.text.indexOf("js/app.js");

        // data.js define CONTROLES y app.js lo usa, por eso tiene que ir antes
        assert.ok(posData < posControles, "data.js tiene que cargarse antes que controles.js");
        assert.ok(posControles < posApp, "controles.js tiene que cargarse antes que app.js");
    });

    test("un archivo estatico inexistente responde 404", async () => {
        const res = await request(app).get("/js/no-existe.js");

        assert.equal(res.status, 404);
    });
});
