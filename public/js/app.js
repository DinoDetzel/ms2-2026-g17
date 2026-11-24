// Estado de la aplicación (declarado explícitamente, sin globals implícitos)
let usuarioActivo = "";
let unidadSeleccionada = "";

// =========================================================
// 1. INICIO DE SESIÓN
// =========================================================
function iniciarSesion() {
    const nom = document.getElementById('nombre-login').value;
    const ape = document.getElementById('apellido-login').value;
    const usuario = armarUsuario(nom, ape);
    if (!usuario) return alert("Por favor, ingresá nombre y apellido.");

    usuarioActivo = usuario;
    localStorage.setItem("usuarioBomberosConectado", usuarioActivo);
    ingresarAlSistema();
}

function ingresarAlSistema() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('homeScreen').style.display = 'block';

    const display = document.getElementById('user-display-name');
    if (display) {
        // textContent en vez de innerHTML: el nombre lo escribe el usuario
        const span = document.createElement('span');
        span.textContent = usuarioActivo;
        display.replaceChildren(span);
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
        btn.innerText = etiquetaBoton(id, prefijo);
        btn.onclick = (e) => { e.stopPropagation(); seleccionarUnidad(id, sector, btn); };
        contenedor.appendChild(btn);
    });
}

function generarGrillaUnidades() { generarGrilla('grilla-unidades', 'AUTO', 'U-'); }
function generarGrillaMateriales() { generarGrilla('grilla-materiales', 'MAT', 'MAT U-'); }

// =========================================================
// 3. FUNCIÓN REFACTORIZADA (TALLER II)
// =========================================================

// obtenerControles, nombreUnidad y etiquetaBoton estan en controles.js
// (sin DOM) para poder probarlas con tests automaticos.

function seleccionarUnidad(num, tipo, btn) {
    unidadSeleccionada = nombreUnidad(tipo, num);

    document.querySelectorAll('.btn-unidad').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cont = document.getElementById('campos-control');
    cont.innerHTML = "";
    document.getElementById('btn-nube').style.display = 'block';
    document.getElementById('titulo-control').innerText = unidadSeleccionada;
    document.getElementById('contenedor-km').style.display = tipo === 'AUTO' ? 'block' : 'none';

    // --- REFACTORING CLEAN CODE: ELIMINACIÓN DE CONDICIONALES ---
    const listaItems = obtenerControles(CONTROLES, tipo, num);

    // --- REFACTORING CLEAN CODE: EXTRACT METHOD ---
    renderizarChecklist(listaItems, cont, tipo);
}

// Función extraída para cumplir SRP y limpiar HTML de JS principal.
// Arma todo el HTML en un array y lo asigna una sola vez: con innerHTML += dentro
// del bucle el navegador volvia a parsear todo el contenedor en cada item.
function renderizarChecklist(listaItems, cont, tipo) {
    let currentCat = "";
    const partes = [];
    listaItems.forEach((c, idx) => {
        if (c.cat && c.cat !== currentCat) {
            currentCat = c.cat;
            partes.push(`<h3 class="categoria-titulo">${currentCat}</h3>`);
        }
        if (c.tipo === "combustible") {
            partes.push(`
                <div class="check-item-container">
                    <div class="check-item-row" style="display:block;">
                        <span class="item-combustible-titulo">${c.item}</span>
                        <div class="fuel-options">
                            <div class="fuel-btn" onclick="setFuel('VACIO', this)">VACIO</div>
                            <div class="fuel-btn" onclick="setFuel('1/4', this)">1/4</div>
                            <div class="fuel-btn" onclick="setFuel('1/2', this)">1/2</div>
                            <div class="fuel-btn" onclick="setFuel('3/4', this)">3/4</div>
                            <div class="fuel-btn" onclick="setFuel('LLENO', this)">LLENO</div>
                        </div>
                    </div>
                </div>`);
        } else if (c.tipo === "escritura") {
            partes.push(`
                <div class="check-item-container item-escritura">
                    <div class="check-item-row" style="display:block;">
                        <div style="margin-bottom:5px; font-weight:bold;">${c.item}</div>
                        <input type="text" id="input-escritura-${idx}" placeholder="Escriba aquí..." class="form-input" style="width:100%;">
                    </div>
                </div>`);
        } else {
            const mostrarCantidad = (tipo === 'MAT' && c.cant) ? `<span class="cantidad-material">(Cant: ${c.cant})</span>` : "";
            partes.push(`
                <div class="check-item-container">
                    <div class="check-item-row">
                        <span>${c.item} ${mostrarCantidad}</span>
                        <div class="item-actions">
                            <label><input type="radio" name="ctrl-${idx}" value="bien" onclick="toggleObs(${idx}, false)"> Bien</label>
                            <label><input type="radio" name="ctrl-${idx}" value="mal" onclick="toggleObs(${idx}, true)"> Mal</label>
                        </div>
                    </div>
                    <div id="obs-container-${idx}" style="display:none;">
                        <textarea id="obs-${idx}" class="form-input obs-textarea" placeholder="Detalle el problema..."></textarea>
                    </div>
                </div>`);
        }
    });
    cont.innerHTML = partes.join("");
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
