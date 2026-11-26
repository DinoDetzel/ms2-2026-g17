const path = require("path");
const express = require("express");

const app = express();

// Ruta absoluta: antes se usaba "public" relativo y fallaba si el servidor
// se iniciaba desde otra carpeta que no fuera la raiz del proyecto.
const carpetaPublica = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.static(carpetaPublica));

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Sistema de Bomberos funcionando"
    });
});

// Cualquier ruta /api que no exista responde 404 en JSON en lugar del HTML por defecto
app.use("/api", (req, res) => {
    res.status(404).json({
        status: "error",
        message: "Ruta no encontrada"
    });
});

module.exports = app;
