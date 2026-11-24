const js = require("@eslint/js");
const globals = require("globals");

// Funciones que se llaman desde onclick en index.html o que se comparten
// entre scripts del navegador. ESLint no ve esos usos y las marcaria como no usadas.
const usadasDesdeHtml = "^(iniciarSesion|cerrarSesion|mostrarBotones.*|entrarElectricidad|volverAlMenu|setFuel|toggleObs|finalizarYEnviar|obtenerControles|esUnidadEspecial|etiquetaBoton|nombreUnidad|armarUsuario|CONTROLES|CONTROLES_.*)$";

module.exports = [
    {
        ignores: ["node_modules/", "coverage/", "docs/evidencia/"]
    },
    js.configs.recommended,
    {
        rules: {
            eqeqeq: "error",
            "prefer-const": "error",
            "no-var": "error",
            curly: ["error", "multi-line"]
        }
    },
    {
        files: ["src/**/*.js", "test/**/*.js", "eslint.config.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: { ...globals.node }
        }
    },
    {
        files: ["public/js/**/*.js"],
        languageOptions: {
            sourceType: "script",
            globals: {
                ...globals.browser,
                module: "readonly",
                // definidas en data.js y controles.js, que se cargan antes que app.js
                CONTROLES: "readonly",
                obtenerControles: "readonly",
                etiquetaBoton: "readonly",
                nombreUnidad: "readonly",
                armarUsuario: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["error", { varsIgnorePattern: usadasDesdeHtml }],
            "no-redeclare": ["error", { builtinGlobals: false }]
        }
    }
];
