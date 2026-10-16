# Decisiones de diseño - Taller II (Metodología de Sistemas II)

Grupo 17 · Proyecto: Sistema interno de Bomberos (control de unidades y materiales)

## 1. Código analizado

- Después (código actual): `public/js/app.js` → `seleccionarUnidad`, `obtenerControles`, `renderizarChecklist` y `generarGrilla`; `public/js/data.js` → objeto `CONTROLES`.
- Antes (código original): `docs/evidencia/script.original.js`, función `seleccionarUnidad`, líneas 233-267 (copia sin modificar de la versión previa del proyecto).
- Qué hace: al tocar una unidad, la app busca su lista de controles y arma el checklist en pantalla.
- Aclaración sobre los datos: `public/js/data.js` contiene datos de ejemplo reducidos (una lista base por sector, más `CENTRAL` y `DESTACAMENTO`). Las listas completas del sistema original se incorporarán en una próxima etapa; no afecta al análisis porque la estructura de `CONTROLES` es la misma.
- Aclaración: la versión del repositorio es una versión simplificada del sistema original.

## 2. Diagnóstico

Dentro de `seleccionarUnidad` había un bloque de 35 líneas que elegía qué lista cargar mediante dos cadenas de `if / else if` (una por sector: AUTO y MAT), con una rama por unidad.

Código original (antes):

```javascript
    let listaItems = [];
    if (sectorActivo === 'AUTO') {
        try {
            if(num === 1) listaItems = CONTROLES_U1_AUTO;
            else if(num === 2) listaItems = CONTROLES_U2_AUTO;
            else if(num === 3) listaItems = CONTROLES_U3_AUTO;
            else if(num === 4) listaItems = CONTROLES_U4_AUTO;
            else if(num === 5) listaItems = CONTROLES_U5_AUTO;
            else if(num === 6) listaItems = CONTROLES_U6_AUTO;
            else if(num === 8) listaItems = CONTROLES_U8_AUTO;
            else if(num === 9) listaItems = CONTROLES_U9_AUTO;
            else if(num === 10) listaItems = CONTROLES_U10_AUTO;
            else if(num === 11) listaItems = CONTROLES_U11_AUTO;
            else if(num === 12) listaItems = CONTROLES_U12_AUTO;
            else if(num === 13) listaItems = CONTROLES_U13_AUTO;
            else if(num === 15) listaItems = CONTROLES_U15_AUTO;
            else if(num === 16) listaItems = CONTROLES_U16_AUTO;
        } catch(e) { listaItems = []; }
    } else {
        try {
            if (unidadSeleccionada.includes('CENTRAL')) listaItems = CONTROLES_CENTRAL;
            else if (unidadSeleccionada.includes('DESTACAMENTO')) listaItems = CONTROLES_DESTACAMENTO;
            else if (unidadSeleccionada.includes('U-2')) listaItems = CONTROLES_U2_MAT;
            else if (unidadSeleccionada.includes('U-3')) listaItems = CONTROLES_U3_MAT;
            else if (unidadSeleccionada.includes('U-6')) listaItems = CONTROLES_U6_MAT;
            else if (unidadSeleccionada.includes('U-8')) listaItems = CONTROLES_U8_MAT;
            else if (unidadSeleccionada.includes('U-9')) listaItems = CONTROLES_U9_MAT;
            else if (unidadSeleccionada.includes('U-10')) listaItems = CONTROLES_U10_MAT;
            else if (unidadSeleccionada.includes('U-11')) listaItems = CONTROLES_U11_MAT;
            else if (unidadSeleccionada.includes('U-12')) listaItems = CONTROLES_U12_MAT;
            else if (unidadSeleccionada.includes('U-13')) listaItems = CONTROLES_U13_MAT;
            else if (unidadSeleccionada.includes('U-15')) listaItems = CONTROLES_U15_MAT;
            else if (unidadSeleccionada.includes('U-16')) listaItems = CONTROLES_U16_MAT;
        } catch(e) { listaItems = []; }
    }
```

Qué detectamos y qué conceptos aplicamos:

- Code smells: *Long Method* (la función mezclaba permisos, avisos, selección de datos y armado de HTML), *Switch Statements* (condicional creciente) y código duplicado (la misma línea repetida con otro número).
- OCP (Abierto/Cerrado): agregar la "Unidad 17" obligaba a modificar la función en dos lugares.
- SRP (Responsabilidad Única): la función decidía qué datos usar y además dibujaba la interfaz.
- Fragilidad: la rama MAT decidía con `unidadSeleccionada.includes('U-2')`, una búsqueda en un texto pensado para mostrar en pantalla. Acopla la lógica al formato del nombre y puede dar falsos positivos si un id es substring de otro (por ejemplo `U-1` y `U-10`).
- Conocimiento repetido: la lista de unidades existía en tres lugares (la lista de ids, las cadenas `if/else` y los datos), y había que mantenerlos sincronizados a mano.
- Código muerto y errores ocultos: un mapa `CONTROLES` que no se usaba y `try/catch` vacíos que escondían errores.

## 3. Alternativas consideradas

1. Conservar lo actual: funciona, pero cada unidad nueva obliga a tocar la función y las grillas. Descartada por costo de mantenimiento.
2. Patrón Strategy / Factory Method: una clase por unidad que provea sus controles. Cumple OCP, pero implica ~27 clases para lo que son solo datos (listas), sin comportamiento distinto.
3. Refactoring orientado a datos (Replace Conditional with lookup + Extract Method): usar el mapa `CONTROLES[sector][id]`, extraer la selección a `obtenerControles` y el armado de HTML a `renderizarChecklist`.

## 4. Decisión

Elegimos la alternativa 3. No aplicamos Strategy/Factory porque las unidades no difieren en *comportamiento* sino en *datos*; una clase por unidad sería sobreingeniería (YAGNI). El mapa logra el mismo desacoplamiento (OCP) con menos código.

Cambios realizados:

- `public/js/app.js`: se agregó `obtenerControles(sector, id)` y se eliminaron las dos cadenas `if/else`. Se extrajo `renderizarChecklist` (Extract Method) para separar el armado del HTML de la lógica de selección (SRP).
- `public/js/app.js`: las grillas de botones se generan con `generarGrilla` a partir de las claves de `CONTROLES`, así la lista de ids deja de estar duplicada. El estado global (`usuarioActivo`, `sectorActivo`, `unidadSeleccionada`) se declara de forma explícita y se quitaron los `try/catch` vacíos.
- `public/js/data.js`: los datos se separaron de la lógica y `CONTROLES` quedó al final del archivo (antes se evaluaba antes de declarar las listas y lanzaba `ReferenceError`). `public/index.html` carga `public/js/data.js` antes que `public/js/app.js`.
- `public/css/style.css`: los estilos inline repetidos del checklist pasaron a clases (`categoria-titulo`, `item-escritura`, `item-combustible-titulo`, `cantidad-material`, `obs-textarea`).

## 5. Evidencia y trade-offs

Código refactorizado (después):

```javascript
function obtenerControles(sector, id) {
    const lista = CONTROLES[sector]?.[id];
    if (!lista) console.warn(`Sin controles definidos para ${sector} / ${id}`);
    return lista ?? [];
}

// en seleccionarUnidad:
const listaItems = obtenerControles(tipo, num);
renderizarChecklist(listaItems, cont, tipo);
```

- Evidencia: `public/js/app.js` (`obtenerControles`, `renderizarChecklist`, `generarGrilla`), `public/js/data.js` (`CONTROLES`) y `docs/evidencia/script.original.js` (código anterior).
- Verificación: se simuló la app en un navegador de prueba (jsdom): login, 14 unidades AUTO y 13 entradas MAT (incluidas `CENTRAL` y `DESTACAMENTO`) con su checklist, combustible, observaciones y volver al menú. También se comprobó que, agregando `CONTROLES.AUTO[17]` en los datos, aparece el botón "U-17" y carga su checklist sin modificar ninguna función.
- Beneficios: se eliminaron las cadenas de condicionales; una unidad nueva requiere solo registrar su lista en `public/js/data.js`; se eliminó la dependencia del texto con `includes()` y la duplicación de ids.
- Costos / trade-offs:
  - Un error de tipeo en una clave de `CONTROLES` devuelve una lista vacía (mitigado con `console.warn`, pero no falla de forma visible).
  - El orden de los botones depende del orden de las claves del objeto (números ascendentes y luego textos como `CENTRAL`).
  - `CONTROLES` sigue siendo una variable global y depende del orden de carga de los scripts (`public/js/data.js` antes que `public/js/app.js`).
  - Los datos están en JavaScript y se cargan siempre; a mayor tamaño convendría pasarlos a JSON.
  - Pendiente: `renderizarChecklist` arma el HTML con strings y `innerHTML +=` dentro de un bucle (se vuelve a parsear el DOM en cada item). Una mejora sería construir un solo string, o crear elementos con `createElement`.