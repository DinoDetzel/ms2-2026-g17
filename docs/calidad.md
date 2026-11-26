# Calidad de codigo - Taller III

Grupo 17 · Sistema de control operativo para cuartel de bomberos

## Herramientas

- **ESLint** (`eslint.config.js`): analisis estatico. Usamos las reglas recomendadas mas `eqeqeq`, `prefer-const`, `no-var` y `curly`.
  Hay dos configuraciones: una para Node (`src/`, `test/`) y otra para el navegador (`public/js/`), porque los globals son distintos.
- **Tests automatizados** con `node:test` y `supertest` (detalle en `docs/testing.md`).
- **GitHub Actions** (`.github/workflows/ci.yml`): en cada push o pull request a `main` o `dev` instala dependencias con `npm ci` y corre lint y tests. No era obligatorio, lo agregamos para que nadie mergee algo que rompe los tests.

```bash
npm run lint    # solo eslint
npm test        # solo tests
npm run check   # las dos cosas
```

## Que encontramos y que cambiamos

### 1. ESLint

Salida del primer analisis: `docs/evidencia/eslint-antes.txt`

| Problema | Archivo | Que hicimos |
|----------|---------|-------------|
| `sectorActivo` se asignaba y nunca se leia | `public/js/app.js` | Se elimino. Era estado que quedo del codigo viejo. |
| `mostrarCantidad` declarada con `let` sin reasignarse | `public/js/app.js` | Paso a `const`. |

Despues de los cambios `npm run lint` no da errores (`docs/evidencia/eslint-despues.txt`).

En la configuracion tuvimos que declarar como usadas las funciones que se llaman desde `onclick` en `index.html` (`iniciarSesion`, `volverAlMenu`, etc.), porque ESLint solo mira los `.js` y las marcaba como no usadas.

### 2. Servidor dificil de testear y ruta relativa

`src/server.js` creaba la app y hacia `listen` en el mismo archivo, entonces no se podia importar en un test sin levantar el servidor.
Lo separamos en `src/app.js` y `src/server.js`.

Ademas `express.static("public")` usaba una ruta relativa a la carpeta desde donde se ejecuta `node`. Si se iniciaba desde otra carpeta el frontend daba 404. Ahora se usa `path.join(__dirname, "..", "public")`.

Tambien agregamos un 404 en JSON para las rutas `/api` que no existen.

### 3. Logica mezclada con el DOM

`obtenerControles` y el armado de nombres estaban dentro de `app.js`, que no se puede ejecutar en Node. Las movimos a `public/js/controles.js`:

- `obtenerControles(catalogo, sector, id)`: ahora recibe el catalogo por parametro en vez de leer la variable global, asi en los tests se le puede pasar cualquier dato.
- `nombreUnidad`, `etiquetaBoton`, `esUnidadEspecial`: antes eran condicionales repetidos dentro de `seleccionarUnidad` y `generarGrilla`.
- `armarUsuario`: validacion del login (nombre y apellido obligatorios, sin espacios de mas).

`controles.js` y `data.js` exportan con `module.exports` solo si existe `module` (en Node). En el navegador se cargan como antes con `<script>`.

### 4. innerHTML dentro del bucle (pendiente del Taller II)

En `docs/decisiones-diseno.md` habiamos dejado anotado que `renderizarChecklist` usaba `cont.innerHTML +=` por cada item. Cada `+=` obliga al navegador a volver a parsear todo el contenido del contenedor (MAT U-9 tiene 271 items).
Ahora cada item se arma con `createElement` dentro de un `DocumentFragment` y se inserta una sola vez en el contenedor; los textos se asignan con `textContent`, así que si un control contiene HTML se muestra como texto.

### 5. Nombre de usuario con innerHTML

El nombre que escribe el usuario en el login se mostraba con `innerHTML`. Si alguien escribia HTML (por ejemplo `<b>Perez</b>`) se interpretaba. Ahora se usa `textContent`.

## Verificacion

- `npm run check`: lint sin errores y 30 tests pasando (2 `todo`).
- Probado a mano en `localhost:3000`: login, grilla de materiales (13 botones), checklist de MAT U-2 (118 items), unidad 3 de automotores con sus dos controles de combustible, y que el nombre con HTML se muestra como texto.

## Pendientes

- Corregir los datos repetidos y las categorias con espacios que encontraron los tests (ver `docs/testing.md`).
- `setFuel` recibe el valor del combustible pero no lo guarda en ningun lado; cuando haya guardado real hay que conectarlo.
- `CONTROLES` sigue siendo global en el navegador y depende del orden de los `<script>`. Hay un test que controla ese orden.
- No hay tests de interfaz.
