# Tests automatizados - Taller III

Grupo 17 · Sistema de control operativo para cuartel de bomberos

## Herramientas

- `node:test`: el runner de tests que viene con Node. No agrega dependencias y alcanza para lo que necesitamos.
- `node:assert/strict`: para las comprobaciones.
- `supertest`: para hacer requests a la app de Express sin levantar el servidor en un puerto.

Para poder testear el servidor separamos `src/app.js` (crea y exporta la app) de `src/server.js` (solo hace `listen`).
Para poder testear la logica del frontend la movimos a `public/js/controles.js`, que no usa el DOM y recibe los datos por parametro.

## Como se ejecutan

```bash
npm install
npm test
```

Con cobertura:

```bash
npm run test:coverage
```

Lint y tests juntos (lo mismo que corre el workflow de GitHub Actions):

```bash
npm run check
```

## Como leer el resultado

Salida actual de `npm test` (resumen):

```text
ℹ tests 33
ℹ suites 7
ℹ pass 31
ℹ fail 0
ℹ todo 2
```

- `pass`: tests que pasaron.
- `fail`: tests que fallaron. Si hay alguno, `npm test` termina con codigo de error y abajo muestra el test, el archivo y la linea, junto con el valor esperado y el obtenido.
- `todo`: tests que marcamos como pendientes. Se ejecutan y muestran el resultado, pero no hacen fallar la corrida. Los usamos para dos problemas que encontramos en los datos y que todavia no corregimos (ver abajo).

## Casos elegidos

### API (`test/api.test.js`)

| Caso | Tipo | Por que |
|------|------|---------|
| `GET /api/health` devuelve 200 y el JSON esperado | Normal | Es el endpoint que usamos para saber si el backend esta funcionando. |
| Ruta `/api` inexistente devuelve 404 en JSON | Error | Antes respondia con el HTML por defecto de Express. Un cliente que espera JSON no podria leer el error. |
| `POST /api/health` devuelve 404 | Error | El endpoint solo acepta GET. |
| `GET /` sirve `index.html` | Normal | Comprueba que la carpeta `public` se sirve bien. Antes se usaba una ruta relativa que fallaba si el servidor se iniciaba desde otra carpeta. |
| Orden de los scripts en `index.html` | Limite | `app.js` usa `CONTROLES`, que se define en `data.js`. Si el orden cambia, la app tira `ReferenceError` (nos paso en el Taller II). |
| Archivo estatico inexistente devuelve 404 | Error | Para no devolver otra cosa en lugar del archivo pedido. |

### Logica del checklist (`test/controles.test.js`)

| Caso | Tipo | Por que |
|------|------|---------|
| Unidad de AUTO y de MAT devuelven su lista | Normal | Es el comportamiento principal de `obtenerControles`. |
| `CENTRAL` y `DESTACAMENTO` | Limite | Son las unicas unidades con clave de texto y no numero. |
| Id `2` y id `"2"` devuelven la misma lista | Limite | Los botones mandan el id como string porque sale de `Object.keys`. |
| `U-1` no devuelve la lista de `U-10` | Limite | Es el falso positivo que podia dar el `includes('U-1')` del codigo original. |
| Unidad inexistente devuelve `[]` y avisa por consola | Error | Si falta una unidad la pantalla queda vacia pero no se rompe, y queda el aviso. |
| Sector inexistente y unidad que no existe en ese sector | Error | Por ejemplo la U-1 tiene controles de AUTO pero no de MAT. |
| Catalogo `undefined` o dato que no es lista | Error | La funcion no tiene que tirar excepcion. |
| `armarUsuario` con nombre y apellido | Normal | Arma el nombre que se muestra arriba. |
| `armarUsuario` con espacios de mas | Limite | El usuario puede escribir espacios sin querer. |
| `armarUsuario` vacio, solo espacios o `undefined` | Error | No se tiene que poder entrar sin nombre. |
| `nombreUnidad` y `etiquetaBoton` | Normal y limite | El titulo cambia segun el sector y las unidades especiales no llevan prefijo. |

### Datos (`test/datos.test.js`)

Revisan los checklists de `public/js/data.js`. Como para agregar una unidad alcanza con cargar su lista ahi, un error de tipeo en una propiedad pasaba desapercibido (la app simplemente no mostraba el item o mostraba `undefined`).

- Existen los sectores `AUTO` y `MAT`, y `MAT` incluye `CENTRAL` y `DESTACAMENTO`.
- Ninguna lista esta vacia.
- Todos los items tienen `cat` e `item` con texto.
- Todos los items tienen `cant` con texto. En automotores vale `"-"` porque no aplica. En materiales, si falta, `renderizarChecklist` no muestra la cantidad y el error pasa desapercibido.
- El `tipo` de cada item es uno de los que sabe dibujar `renderizarChecklist` (`combustible`, `escritura` o ninguno).
- Cada unidad de automotores tiene el control de combustible.

### Lo que encontraron los tests (pendiente)

- Items repetidos en la misma categoria: por ejemplo "Escalera" dos veces en `TECHO` de MAT U-2 y U-8, y "Apositos" dos veces en `BOLSO DE TRAUMA`. Puede ser un error de carga o que realmente haya dos elementos iguales con distinta cantidad. Lo dejamos como `todo` hasta confirmarlo con el cuartel.
- Categorias con espacios de mas (`"TECHO "`). En pantalla no se nota, pero si se agrupara por categoria quedarian dos grupos distintos.

## Limitaciones

- No hay tests de interfaz: `app.js` usa el DOM (`document`, `localStorage`, `alert`) y no se ejecuta en Node. La navegacion, el login y el dibujo del checklist los seguimos probando a mano en `localhost:3000`.
- La cobertura que muestra `npm run test:coverage` (100%) es solo de los archivos que cargan los tests (`src/app.js`, `controles.js`, `data.js`). `app.js` del frontend no aparece en el reporte.
- No hay base de datos ni endpoints de guardado todavia, asi que no hay tests de persistencia.
