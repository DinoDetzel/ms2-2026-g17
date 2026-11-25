// Configuración de ESLint (formato "flat config", ESLint 9).
// Uso:  npm run lint
//
// Hay dos entornos distintos en el proyecto, por eso hay bloques separados:
//   - public/js: código del navegador (scripts clásicos, sin módulos).
//   - src: código de Node (CommonJS).

const js = require("@eslint/js");

const globalsNavegador = {
    window: "readonly",
    document: "readonly",
    localStorage: "readonly",
    alert: "readonly",
    console: "readonly",
    location: "readonly"
};

const globalsNode = {
    require: "readonly",
    module: "writable",
    process: "readonly",
    console: "readonly",
    __dirname: "readonly"
};

module.exports = [
    // docs/evidencia guarda el código original tal cual estaba: es evidencia, no se corrige.
    { ignores: ["node_modules/**", "docs/evidencia/**", "coverage/**"] },

    // Reglas recomendadas por ESLint (errores probables: variables sin definir, código inalcanzable, etc.)
    js.configs.recommended,

    // Las funciones de los scripts del navegador las llama index.html con onclick="...", así que
    // ESLint no ve que se usan. "vars: local" no revisa las declaradas en el nivel superior.
    {
        files: ["public/js/**/*.js"],
        languageOptions: { ecmaVersion: "latest", sourceType: "script", globals: globalsNavegador },
        rules: { "no-unused-vars": ["error", { vars: "local", args: "after-used" }] }
    },

    // app.js usa CONTROLES, que define data.js (se carga antes con <script>).
    {
        files: ["public/js/app.js"],
        languageOptions: { globals: { CONTROLES: "readonly" } }
    },

    {
        files: ["src/**/*.js", "eslint.config.js"],
        languageOptions: { ecmaVersion: "latest", sourceType: "commonjs", globals: globalsNode }
    },

    // Reglas que previenen errores y valen para todo el proyecto
    {
        rules: {
            eqeqeq: "error",         // == convierte tipos sin avisar; exigir ===
            "no-var": "error",       // usar let o const
            "prefer-const": "error"  // si no se reasigna, const
        }
    }
];