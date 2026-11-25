// Estado de la aplicación (declarado explícitamente, sin globals implícitos)
let usuarioActivo = "";
let unidadSeleccionada = "";
let sectorActivo = "";

// =========================================================
// 1. INICIO DE SESIÓN
// =========================================================
function iniciarSesion() {
    const nom = document.getElementById('nombre-login').value.trim();
    const ape = document.getElementById('apellido-login').value.trim();
    if (!nom || !ape) return alert("Por favor, ingresá nombre y apellido.");

    usuarioActivo = (nom + " " + ape).toUpperCase();
    localStorage.setItem("usuarioBomberosConectado", usuarioActivo);
    ingresarAlSistema();
}

function ingresarAlSistema() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('homeScreen').style.display = 'block';

    const display = document.getElementById('user-display-name');
    if(display) {
        const nombre = document.createElement('span');
        nombre.textContent = usuarioActivo;
        display.replaceChildren(nombre);
    }

    generarGrillaUnidades();
    generarGrillaMateriales();
}

function cerrarSesion() {
    localStorage.removeItem("usuarioBomberosConectado");
    location.reload();
}

window.addEventListener('load', function() {
    const guardado = localStorage.getItem("usuarioBomberosConectado");
    if (guardado) { 
        usuarioActivo = guardado; 
        ingresarAlSistema(); 
    }
});

// =========================================================
// 2. NAVEGACIÓN DE SECTORES
// =========================================================
function mostrarBotonesUnidades() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('sistema-gestion').style.display = 'block';
    
    document.getElementById('grilla-unidades').style.display = 'grid';
    document.getElementById('grilla-materiales').style.display = 'none';
    document.getElementById('titulo-control').innerText = "AUTOMOTORES";
}

function mostrarBotonesMateriales() {
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('sistema-gestion').style.display = 'block';

    document.getElementById('grilla-materiales').style.display = 'grid';
    document.getElementById('grilla-unidades').style.display = 'none';
    document.getElementById('titulo-control').innerText = "MATERIALES";
}

function entrarElectricidad() {
    alert("Sector Electricidad en construcción para la demo");
}

function volverAlMenu() {
    document.getElementById('sistema-gestion').style.display = 'none';
    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('grilla-materiales').style.display = 'none';
    document.getElementById('grilla-unidades').style.display = 'none';
    document.getElementById('campos-control').innerHTML = '';
    document.getElementById('btn-nube').style.display = 'none';
}

// Las grillas se generan desde CONTROLES: agregar una unidad en data.js alcanza para que aparezca su botón.
function generarGrilla(idContenedor, sector, prefijo) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = "";
    Object.keys(CONTROLES[sector]).forEach(id => {
        const btn = document.createElement('div');
        btn.className = 'btn-unidad';
        btn.innerText = (id === 'CENTRAL' || id === 'DESTACAMENTO') ? id : prefijo + id;
        btn.onclick = (e) => { e.stopPropagation(); seleccionarUnidad(id, sector, btn); };
        contenedor.appendChild(btn);
    });
}

function generarGrillaUnidades() { generarGrilla('grilla-unidades', 'AUTO', 'U-'); }
function generarGrillaMateriales() { generarGrilla('grilla-materiales', 'MAT', 'MAT U-'); }

// =========================================================
// 3. FUNCIÓN REFACTORIZADA (TALLER II)
// =========================================================

function obtenerControles(sector, id) {
    const lista = CONTROLES[sector]?.[id];
    if (!lista) console.warn(`Sin controles definidos para ${sector} / ${id}`);
    return lista ?? [];
}

function seleccionarUnidad(num, tipo, btn) {
    sectorActivo = tipo;

    if (num === 'CENTRAL') unidadSeleccionada = "MAT CENTRAL";
    else if (num === 'DESTACAMENTO') unidadSeleccionada = "MAT DESTACAMENTO";
    else unidadSeleccionada = tipo === 'AUTO' ? "UNIDAD " + num : "MAT U-" + num;

    document.querySelectorAll('.btn-unidad').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cont = document.getElementById('campos-control');
    cont.innerHTML = "";
    document.getElementById('btn-nube').style.display = 'block';
    document.getElementById('titulo-control').innerText = unidadSeleccionada;
    document.getElementById('contenedor-km').style.display = tipo === 'AUTO' ? 'block' : 'none';

    // --- REFACTORING CLEAN CODE: ELIMINACIÓN DE CONDICIONALES ---
    const listaItems = obtenerControles(tipo, num);

    // --- REFACTORING CLEAN CODE: EXTRACT METHOD ---
    renderizarChecklist(listaItems, cont, tipo);
}

// Crea un elemento con clase y texto opcionales. El texto se asigna con textContent:
// si un control contiene HTML se muestra como texto y nunca se interpreta.
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

const OPCIONES_COMBUSTIBLE = ['VACIO', '1/4', '1/2', '3/4', 'LLENO'];

function crearItemCombustible(control) {
    const opciones = crearElemento('div', 'fuel-options');
    OPCIONES_COMBUSTIBLE.forEach(valor => {
        const boton = crearElemento('div', 'fuel-btn', valor);
        boton.addEventListener('click', () => setFuel(valor, boton));
        opciones.appendChild(boton);
    });

    const fila = crearElemento('div', 'check-item-row');
    fila.style.display = 'block';
    fila.append(crearElemento('span', 'item-combustible-titulo', control.item), opciones);

    const contenedor = crearElemento('div', 'check-item-container');
    contenedor.appendChild(fila);
    return contenedor;
}

function crearItemEscritura(control, idx) {
    const titulo = crearElemento('div', '', control.item);
    titulo.style.marginBottom = '5px';
    titulo.style.fontWeight = 'bold';

    const entrada = crearElemento('input', 'form-input');
    entrada.type = 'text';
    entrada.id = `input-escritura-${idx}`;
    entrada.placeholder = 'Escriba aquí...';
    entrada.style.width = '100%';

    const fila = crearElemento('div', 'check-item-row');
    fila.style.display = 'block';
    fila.append(titulo, entrada);

    const contenedor = crearElemento('div', 'check-item-container item-escritura');
    contenedor.appendChild(fila);
    return contenedor;
}

function crearOpcionBienMal(idx, valor, texto, mostrarObservacion) {
    const radio = crearElemento('input');
    radio.type = 'radio';
    radio.name = `ctrl-${idx}`;
    radio.value = valor;
    radio.addEventListener('click', () => toggleObs(idx, mostrarObservacion));

    const etiqueta = crearElemento('label');
    etiqueta.append(radio, ` ${texto}`);
    return etiqueta;
}

function crearItemControl(control, idx, tipo) {
    const descripcion = crearElemento('span', '', control.item);
    if (tipo === 'MAT' && control.cant) {
        descripcion.append(' ', crearElemento('span', 'cantidad-material', `(Cant: ${control.cant})`));
    }

    const acciones = crearElemento('div', 'item-actions');
    acciones.append(
        crearOpcionBienMal(idx, 'bien', 'Bien', false),
        crearOpcionBienMal(idx, 'mal', 'Mal', true)
    );

    const fila = crearElemento('div', 'check-item-row');
    fila.append(descripcion, acciones);

    const observacion = crearElemento('textarea', 'form-input obs-textarea');
    observacion.id = `obs-${idx}`;
    observacion.placeholder = 'Detalle el problema...';

    const contenedorObs = crearElemento('div');
    contenedorObs.id = `obs-container-${idx}`;
    contenedorObs.style.display = 'none';
    contenedorObs.appendChild(observacion);

    const contenedor = crearElemento('div', 'check-item-container');
    contenedor.append(fila, contenedorObs);
    return contenedor;
}

// Función extraída para cumplir SRP y limpiar HTML de JS principal.
// Arma todo en un fragmento y lo inserta una sola vez (antes se hacía innerHTML += por cada ítem).
function renderizarChecklist(listaItems, cont, tipo) {
    const fragmento = document.createDocumentFragment();
    let currentCat = "";
    listaItems.forEach((c, idx) => {
        if (c.cat && c.cat !== currentCat) {
            currentCat = c.cat;
            fragmento.appendChild(crearElemento('h3', 'categoria-titulo', currentCat));
        }
        if (c.tipo === "combustible") {
            fragmento.appendChild(crearItemCombustible(c));
        } else if (c.tipo === "escritura") {
            fragmento.appendChild(crearItemEscritura(c, idx));
        } else {
            fragmento.appendChild(crearItemControl(c, idx, tipo));
        }
    });
    cont.appendChild(fragmento);
}

function setFuel(val, btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.fuel-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function toggleObs(idx, mostrar) {
    const el = document.getElementById(`obs-container-${idx}`);
    if(el) el.style.display = mostrar ? 'block' : 'none';
}

function finalizarYEnviar(){
    alert("Simulación: Control guardado con éxito.");
    volverAlMenu();
}