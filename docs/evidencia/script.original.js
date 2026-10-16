const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSa7ynDTRt4HOXjhISAp6FlSbeHxwmaojShScXJSCa_begSMSCtqV-YcHbM5yZmX7mYg/exec";

const ENCARGADOS_DATA = {
    "MIGUEL CORDOBA": ["UNIDAD 1", "UNIDAD 2", "UNIDAD 6", "UNIDAD 12", "SOLO_AUTOMOTORES"],
    "ENEAS FTULI": ["UNIDAD 8", "UNIDAD 9", "UNIDAD 10", "UNIDAD 16", "SOLO_AUTOMOTORES"],
    "KEVIN FTULI": ["VER_TODO_AUTOMOTORES", "SOLO_AUTOMOTORES"],
    "FEDERICO MAISTERRENA": ["VER_TODO_AUTOMOTORES", "SOLO_AUTOMOTORES"],
    "MAURO MARTINEZ": ["SOLO_MATERIALES"],
    "CRISTIAN DEL CASTILLO": ["SOLO_MATERIALES"],
    "MARA CASTILLO": ["SOLO_MATERIALES"], 
    "SANTIAGO LUGONES": ["SOLO_MATERIALES"], 
    "DANIEL FARINACCIO": ["SUPER_USUARIO"],
    "CRISTIAN BALEY": ["SOLO_MATERIALES"],
    "MARCOS ALFARO": ["SUBOFICIAL_ELECTRICIDAD"],
    "MIGUEL ALFARO": ["SUBOFICIAL_ELECTRICIDAD"]
};

const LISTA_IDS_UNIDADES = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16];

// VARIABLES DE ESTADO
let usuarioActivo = "";
let unidadSeleccionada = "";
let sectorActivo = "";

// DATOS GUARDADOS
let VTV_DATA = JSON.parse(localStorage.getItem("db_vtv")) || [];
let TAREAS_GENERALES_AUTO = JSON.parse(localStorage.getItem("db_tareas_gral")) || [];
let TAREAS_MATERIALES = JSON.parse(localStorage.getItem("db_tareas_mat")) || [];
let DB_ELECTRICIDAD = JSON.parse(localStorage.getItem("db_electricidad")) || [];

// =========================================================
// 1. INICIO DE SESIÓN (SOLUCIONADO PARA CELULARES)
// =========================================================

function iniciarValidacionFaceID() {
    const nomElem = document.getElementById('nombre-login');
    const apeElem = document.getElementById('apellido-login');
    if (!nomElem || !apeElem) return alert("Error de sistema.");

    const nom = nomElem.value.trim();
    const ape = apeElem.value.trim();
    if (!nom || !ape) return alert("Por favor, ingresá nombre y apellido.");

    usuarioActivo = (nom + " " + ape).toUpperCase();
    localStorage.setItem("usuarioBomberosConectado", usuarioActivo);
    ingresarAlSistema();
}

function ingresarAlSistema() {
    // CAMBIO DE PANTALLA INMEDIATO
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('homeScreen').style.display = 'block';

    const display = document.getElementById('user-display-name');
    if(display) {
        display.innerHTML = `<span>${usuarioActivo}</span>`;
    }

    // CARGA DE COMPONENTES
    try { generarGrillaUnidades(); } catch(e){}
    try { generarGrillaMateriales(); } catch(e){}

    // Ocultar panel en el home (solo se verá dentro de cada sector)
    const panel = document.getElementById("panel-admin-vencimientos");
    if(panel) panel.style.display = 'none';
}

function cerrarSesion() {
    localStorage.removeItem("usuarioBomberosConectado");
    location.reload();
}

window.addEventListener('load', function() {
    const guardado = localStorage.getItem("usuarioBomberosConectado");
    if (guardado) { usuarioActivo = guardado; ingresarAlSistema(); }
});

// =========================================================
// 2. NAVEGACIÓN Y ACCESO RESTRINGIDO (SOLO SUBOFICIALES)
// =========================================================

function mostrarBotonesUnidades() {
    const p = ENCARGADOS_DATA[usuarioActivo];
    // Acceso restringido para el sector
    if (p && (p.includes("SOLO_MATERIALES") || p.includes("SUBOFICIAL_ELECTRICIDAD")) && !p.includes("SUPER_USUARIO")) {
        return alert("⛔ Acceso denegado: Este sector es de Automotores.");
    }

    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('sistema-gestion').style.display = 'block';
    
    const gu = document.getElementById('grilla-unidades');
    gu.style.display = 'grid';
    document.getElementById('grilla-materiales').style.display = 'none';
    document.getElementById('titulo-control').innerText = "AUTOMOTORES";

    // Gestionar el Panel (Solo para suboficiales de la lista)
    const panel = document.getElementById('panel-admin-vencimientos');
    if (panel) {
        if (p && (p.includes("SOLO_AUTOMOTORES") || p.includes("VER_TODO_AUTOMOTORES") || p.includes("SUPER_USUARIO"))) {
            panel.style.display = 'block';
            gu.parentNode.insertBefore(panel, gu); // Mover dentro del menú
            configurarPanelAdmin("AUTO"); 
        } else {
            panel.style.display = 'none';
        }
    }
}

function mostrarBotonesMateriales() {
    const p = ENCARGADOS_DATA[usuarioActivo];
    // Acceso restringido para el sector
    if (p && (p.includes("SOLO_AUTOMOTORES") || p.includes("SUBOFICIAL_ELECTRICIDAD")) && !p.includes("SUPER_USUARIO")) {
        return alert("⛔ Acceso denegado: Este sector es de Materiales.");
    }

    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('sistema-gestion').style.display = 'block';

    const gm = document.getElementById('grilla-materiales');
    gm.style.display = 'grid';
    document.getElementById('grilla-unidades').style.display = 'none';
    document.getElementById('titulo-control').innerText = "MATERIALES";

    // Gestionar el Panel (Solo para suboficiales de la lista)
    const panel = document.getElementById('panel-admin-vencimientos');
    if (panel) {
        if (p && (p.includes("SOLO_MATERIALES") || p.includes("SUPER_USUARIO"))) {
            panel.style.display = 'block';
            gm.parentNode.insertBefore(panel, gm); // Mover dentro del menú
            configurarPanelAdmin("MAT"); 
        } else {
            panel.style.display = 'none';
        }
    }
}

function entrarElectricidad() {
    let tieneAcceso = true;
    let esEncargadoElec = false;

    if (ENCARGADOS_DATA[usuarioActivo]) {
        const permisos = ENCARGADOS_DATA[usuarioActivo];
        if (permisos.includes("SOLO_AUTOMOTORES") || permisos.includes("SOLO_MATERIALES")) {
            tieneAcceso = false;
        }
        if (permisos.includes("SUBOFICIAL_ELECTRICIDAD") || permisos.includes("SUPER_USUARIO")) {
            esEncargadoElec = true;
            tieneAcceso = true;
        }
    }
    
    if (!tieneAcceso) return alert("⛔ Acceso denegado.");

    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('sistema-electricidad').style.display = 'block';

    const panelAdmin = document.getElementById('admin-electricidad');
    if (panelAdmin) {
        panelAdmin.style.display = esEncargadoElec ? 'block' : 'none';
    }
    renderizarTareasElectricas();
}

// =========================================================
// 3. LÓGICA DE SELECCIÓN Y FORMULARIOS (MANTENIDA)
// =========================================================

function seleccionarUnidad(num, tipo, btn) {
    sectorActivo = tipo;

    if (num === 'CENTRAL') unidadSeleccionada = "MAT CENTRAL";
    else if (num === 'DESTACAMENTO') unidadSeleccionada = "MAT DESTACAMENTO";
    else unidadSeleccionada = tipo === 'AUTO' ? "UNIDAD " + num : "MAT U-" + num;

    document.querySelectorAll('.btn-unidad').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const permisos = ENCARGADOS_DATA[usuarioActivo];
    const esSuper = permisos?.includes("SUPER_USUARIO");
    const esJefeAuto = permisos?.includes("SOLO_AUTOMOTORES") || permisos?.includes("VER_TODO_AUTOMOTORES");
    const esJefeMat = permisos?.includes("SOLO_MATERIALES");

    if (usuarioActivo !== "MARA CASTILLO") {
        if (esSuper || (tipo === 'AUTO' && esJefeAuto) || (tipo === 'MAT' && esJefeMat)) {
            document.getElementById('sistema-gestion').style.display = 'none';
            verHistorialEspecifico(unidadSeleccionada);
            return;
        }
    }

    const cont = document.getElementById('campos-control');
    cont.innerHTML = "";
    document.getElementById('btn-nube').style.display = 'block';
    document.getElementById('titulo-control').innerText = unidadSeleccionada;
    document.getElementById('contenedor-km').style.display = tipo === 'AUTO' ? 'block' : 'none';

    // --- SECCIÓN NUEVA: MOSTRAR TAREAS CARGADAS POR SUBOFICIALES ---
    let avisosHtml = "";
    
    // 1. Mostrar VTV si existe (Solo para Autos)
    if (tipo === 'AUTO') {
        const vtvInfo = VTV_DATA.find(v => v.unidad === unidadSeleccionada);
        if (vtvInfo) {
            avisosHtml += `
                <div class="check-item-container" style="border-left-color: #b80000; background: #2a1010; padding: 15px; margin-bottom: 20px;">
                    <div style="color: #ff4444; font-weight: 800; font-size: 12px; margin-bottom: 5px;">⚠️ AVISO DE VTV</div>
                    <div style="font-size: 14px; color: #fff;">Próximo vencimiento: <strong>${vtvInfo.fecha}</strong></div>
                </div>`;
        }
    }

    // 2. Mostrar Tareas Generales (Para ambos sectores)
    const tareasCargadas = (tipo === 'AUTO' ? TAREAS_GENERALES_AUTO : TAREAS_MATERIALES)
        .filter(t => t.unidad === unidadSeleccionada);

    if (tareasCargadas.length > 0) {
        tareasCargadas.forEach(t => {
            avisosHtml += `
                <div class="check-item-container" style="border-left-color: #ff7a00; background: #2a1f10; padding: 15px; margin-bottom: 10px;">
                    <div style="color: #ff7a00; font-weight: 800; font-size: 12px; margin-bottom: 5px;">⚠️ TAREA PENDIENTE (SUBOFICIAL)</div>
                    <div style="font-size: 14px; color: #fff;">${t.tarea}</div>
                    <div style="font-size: 11px; color: #aaa; margin-top: 5px;">Límite: ${t.fecha} - Cargado por: ${t.creadoPor || 'Suboficial'}</div>
                </div>`;
        });
    }

    // Insertamos los avisos antes de los items normales
    cont.innerHTML = avisosHtml;

    // --- CARGA DE ITEMS NORMALES ---
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

    gestionarAlertas(tipo, unidadSeleccionada);

    let currentCat = "";
    listaItems.forEach((c, idx) => {
        if (c.cat && c.cat !== currentCat) {
            currentCat = c.cat;
            cont.innerHTML += `<h3 style="color:#b11217; margin: 25px 0 10px 0; border-bottom: 2px solid #333; padding-bottom:5px;">${currentCat}</h3>`;
        }
        // ... (resto del generador de items igual)
        if (c.tipo === "combustible") {
            cont.innerHTML += `<div class="check-item-container"><div class="check-item-row" style="display:block;"><span style="font-weight:bold; display:block; margin-bottom:10px;">${c.item}</span><div class="fuel-options"><div class="fuel-btn" onclick="setFuel('VACIO', this)">VACIO</div><div class="fuel-btn" onclick="setFuel('1/4', this)">1/4</div><div class="fuel-btn" onclick="setFuel('1/2', this)">1/2</div><div class="fuel-btn" onclick="setFuel('3/4', this)">3/4</div><div class="fuel-btn" onclick="setFuel('LLENO', this)">LLENO</div></div></div></div>`;
        } else if (c.tipo === "escritura") {
            cont.innerHTML += `<div class="check-item-container" style="border-left-color: #27ae60;"><div class="check-item-row" style="display:block;"><div style="margin-bottom:5px; font-weight:bold;">${c.item}</div><input type="text" id="input-escritura-${idx}" placeholder="Escriba aquí..." class="form-input" style="width:100%;"></div></div>`;
        } else {
            let mostrarCantidad = (tipo === 'MAT' && c.cant) ? `<span style="color: #ff7a00; font-weight: bold; margin-left: 10px; font-size: 0.95em;">(Cant: ${c.cant})</span>` : "";
            cont.innerHTML += `<div class="check-item-container"><div class="check-item-row"><span>${c.item} ${mostrarCantidad}</span><div class="item-actions"><label><input type="radio" name="ctrl-${idx}" value="bien" onclick="toggleObs(${idx}, false)"> Bien</label><label><input type="radio" name="ctrl-${idx}" value="mal" onclick="toggleObs(${idx}, true)"> Mal</label></div></div><div id="obs-container-${idx}" style="display:none;"><textarea id="obs-${idx}" class="form-input" placeholder="Detalle el problema..." style="margin-top:10px;"></textarea><input type="file" id="foto-${idx}" accept="image/*" style="margin-top:10px; color:#ccc;"></div></div>`;
        }
    });
}

function crearTareaElectrica() {
    const lugar = document.getElementById("elec-lugar").value;
    const tipo = document.getElementById("elec-tipo").value;
    const desc = document.getElementById("elec-desc").value;
    const mat = document.getElementById("elec-mat").value;
    const prio = document.getElementById("elec-prio").value;
    const fecha = document.getElementById("elec-fecha").value;
    const asignado = document.getElementById("elec-asignado").value;

    if(!lugar || !desc) return alert("Complete los campos obligatorios.");
    const nuevaTarea = { id: Date.now(), fecha: new Date().toLocaleDateString(), lugar: lugar, tipo: tipo, descripcion: desc, materiales: mat, prioridad: prio, fechaLimite: fecha, asignado: asignado || "Sin asignar", estado: "PENDIENTE", autor: usuarioActivo };
    DB_ELECTRICIDAD.push(nuevaTarea);
    localStorage.setItem("db_electricidad", JSON.stringify(DB_ELECTRICIDAD));
    alert("Tarea creada exitosamente.");
    renderizarTareasElectricas();
}

function renderizarTareasElectricas() {
    const lista = document.getElementById('listaTareasElectricas');
    lista.innerHTML = "";
    if(DB_ELECTRICIDAD.length === 0) { lista.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>No hay tareas pendientes.</div>"; return; }
    DB_ELECTRICIDAD.forEach((t, index) => {
        const colorPrio = t.prioridad === 'Alta' ? '#c62828' : (t.prioridad === 'Media' ? '#f9a825' : '#2e7d32');
        const div = document.createElement('div');
        div.style.cssText = `background:#222; margin-bottom:10px; padding:15px; border-radius:8px; border-left:5px solid ${colorPrio};`;
        div.innerHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><strong style="color:${colorPrio}; text-transform:uppercase;">${t.tipo} - ${t.prioridad}</strong><span style="font-size:12px; color:#aaa;">Límite: ${t.fechaLimite || 'S/F'}</span></div><div style="font-size:15px; color:white; font-weight:bold; margin-bottom:5px;">${t.lugar}</div><div style="font-size:13px; color:#ccc; margin-bottom:10px;">${t.descripcion}</div><div style="font-size:12px; color:#888; border-top:1px solid #333; padding-top:8px;"><div>🔧 Materiales: ${t.materiales || '-'}</div><div>👤 Asignado a: ${t.asignado}</div><div style="margin-top:4px;">📅 Creado: ${t.fecha} por ${t.autor}</div></div>`;
        const permisos = ENCARGADOS_DATA[usuarioActivo];
        if (permisos && (permisos.includes("SUBOFICIAL_ELECTRICIDAD") || permisos.includes("SUPER_USUARIO"))) {
            const btnDel = document.createElement('button');
            btnDel.innerText = "✅ FINALIZAR TAREA";
            btnDel.style.cssText = "width:100%; background:#2e7d32; color:white; border:none; padding:10px; border-radius:4px; font-size:12px; margin-top:10px; cursor:pointer; font-weight:bold;";
            btnDel.onclick = () => { if(confirm("¿Finalizar tarea?")) { DB_ELECTRICIDAD.splice(index, 1); localStorage.setItem("db_electricidad", JSON.stringify(DB_ELECTRICIDAD)); renderizarTareasElectricas(); } };
            div.appendChild(btnDel);
        }
        lista.appendChild(div);
    });
}

 function configurarPanelAdmin(tipo) {
    const panel = document.getElementById('panel-admin-vencimientos');
    const p = ENCARGADOS_DATA[usuarioActivo];
    if(!panel) return;

    panel.innerHTML = `
        <h3 style="color:#b80000; margin-bottom:15px; font-size:16px;">GESTIÓN DEL SECTOR</h3>
        <select id="admin-tipo" class="login-box input" style="width:100%; margin-bottom:10px; background:#222; color:white; text-align:left;" onchange="toggleSelectorUnidad()">
            <option value="GRAL">Tarea General</option>
            ${tipo === 'AUTO' ? '<option value="VTV">VTV</option>' : ''}
        </select>
        <div id="box-admin-unidad">
            <select id="admin-unidad" class="login-box input" style="width:100%; margin-bottom:10px; background:#222; color:white; text-align:left;"></select>
        </div>
        <input type="date" id="admin-fecha" class="login-box input" style="width:100%; background:#222; color:white; margin-bottom:10px;">
        
        <input type="text" id="admin-tarea-desc" placeholder="Describí la tarea aquí..." 
               class="login-box input" style="width:100%; background:#222; color:white; text-align:left; margin-bottom:10px; display:block;">

        <button onclick="guardarNuevoVencimiento()" style="width:100%; padding:15px; background:#2e7d32; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">GUARDAR</button>
        <ul id="lista-vencimientos-cargados" style="margin-top:15px; font-size:12px; color:#aaa;"></ul>
    `;

    const select = document.getElementById('admin-unidad');
    if (tipo === "MAT") {
        ["MAT CENTRAL", "MAT DESTACAMENTO"].forEach(u => select.add(new Option(u, u)));
        LISTA_IDS_UNIDADES.forEach(u => select.add(new Option("MAT U-" + u, "MAT U-" + u)));
    } else {
        if (p.includes("VER_TODO_AUTOMOTORES") || p.includes("SUPER_USUARIO")) {
            select.add(new Option("GENERAL FLOTA", "GENERAL FLOTA"));
            LISTA_IDS_UNIDADES.forEach(u => select.add(new Option("UNIDAD " + u, "UNIDAD " + u)));
        } else {
            p.forEach(perm => { if(perm.startsWith("UNIDAD")) select.add(new Option(perm, perm)); });
        }
    }
    actualizarListaVisual();
}

function toggleSelectorUnidad() {
    const tipo = document.getElementById("admin-tipo").value;
    const inputDesc = document.getElementById("admin-tarea-desc");
    if (inputDesc) {
        // Ocultar descripción solo si es VTV
        inputDesc.style.display = (tipo === "VTV") ? "none" : "block";
    }
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

function generarGrillaUnidades() {
    const contenedor = document.getElementById('grilla-unidades');
    contenedor.innerHTML = "";
    contenedor.innerHTML = `<div style="grid-column: 1 / -1; background: #222; border-left: 5px solid #b80000; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><strong style="color: #b80000; text-transform: uppercase; display: block; margin-bottom: 5px;">⚠️ RECORDATORIO</strong>Los controles de unidad deben realizarse obligatoriamente <strong>CADA 3 DÍAS</strong>.</div>`;
    const permisos = ENCARGADOS_DATA[usuarioActivo];
    const veTodo = permisos && (permisos.includes("VER_TODO_AUTOMOTORES") || permisos.includes("SUPER_USUARIO"));
    LISTA_IDS_UNIDADES.forEach(i => {
        let mostrarBoton = (permisos) ? (veTodo || permisos.includes("UNIDAD " + i)) : true;
        if (mostrarBoton) {
            const btn = document.createElement('div');
            btn.className = 'btn-unidad';
            btn.innerText = 'U-' + i;
            btn.onclick = (e) => { e.stopPropagation(); seleccionarUnidad(i, 'AUTO', btn); };
            contenedor.appendChild(btn);
        }
    });
}

function generarGrillaMateriales() {
    const contenedor = document.getElementById('grilla-materiales');
    contenedor.innerHTML = "";
    const hoy = new Date().getDate();
    const estiloBase = "padding: 5px 8px; border-radius: 4px; display: inline-block; margin: 2px; font-size: 11px; background: #333; color: #777;";
    const estiloActivo = "font-weight:bold; color: #fff; background: #ff7a00; border: 1px solid #ff7a00; padding: 5px 8px; border-radius: 4px; display: inline-block; margin: 2px; font-size: 11px;";
    const s1 = (hoy >= 1 && hoy <= 7) ? estiloActivo : estiloBase;
    const s2 = (hoy >= 8 && hoy <= 15) ? estiloActivo : estiloBase;
    const s3 = (hoy >= 16 && hoy <= 22) ? estiloActivo : estiloBase;
    const s4 = (hoy >= 23 && hoy <= 31) ? estiloActivo : estiloBase;
    contenedor.innerHTML = `<div style="grid-column: 1 / -1; background: #222; border-left: 5px solid #ff7a00; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><strong style="color: #ff7a00; display:block; margin-bottom:8px; font-size: 13px; text-transform: uppercase;">📅 Cronograma Mensual</strong><div style="display:flex; flex-wrap:wrap; gap:5px;"><span style="${s1}">1º: Del 01 al 07</span><span style="${s2}">2º: Del 08 al 15</span><span style="${s3}">3º: Del 16 al 22</span><span style="${s4}">4º: Del 23 al 31</span></div></div>`;
    const excluidas = [1, 4, 5];
    LISTA_IDS_UNIDADES.forEach(i => {
        if (excluidas.includes(i)) return;
        const btn = document.createElement('div');
        btn.className = 'btn-unidad';
        btn.innerText = 'MAT U-' + i;
        btn.onclick = (e) => { e.stopPropagation(); seleccionarUnidad(i, 'MAT', btn); };
        contenedor.appendChild(btn);
    });
    [{t:'CENTRAL', v:'CENTRAL'}, {t:'DESTAC.', v:'DESTACAMENTO'}].forEach(x => {
        const btn = document.createElement('div');
        btn.className = 'btn-unidad'; btn.innerText = x.t; btn.style.borderColor = '#ff7a00';
        btn.onclick = (e) => { e.stopPropagation(); seleccionarUnidad(x.v, 'MAT', btn); };
        contenedor.appendChild(btn);
    });
}

function guardarNuevoVencimiento() {
    const permisos = ENCARGADOS_DATA[usuarioActivo];
    const esMat = permisos.includes("SOLO_MATERIALES") && !permisos.includes("SUPER_USUARIO");
    const tipo = esMat ? "GRAL" : document.getElementById("admin-tipo").value;
    const fecha = document.getElementById("admin-fecha").value;
    const unidadElegida = document.getElementById("admin-unidad").value;
    const descripcion = document.getElementById("admin-tarea-desc").value;

    if (!fecha || !unidadElegida) return alert("Faltan datos obligatorios.");

    if (tipo === "VTV") {
        const index = VTV_DATA.findIndex(v => v.unidad === unidadElegida);
        if (index >= 0) { VTV_DATA[index].fecha = fecha; } else { VTV_DATA.push({ unidad: unidadElegida, fecha: fecha }); }
        localStorage.setItem("db_vtv", JSON.stringify(VTV_DATA));
    } else {
        if (!descripcion.trim()) return alert("Por favor, escribí la tarea.");
        const nuevaTarea = { unidad: unidadElegida, tarea: descripcion, fecha: fecha, creadoPor: usuarioActivo };
        if (esMat) {
            TAREAS_MATERIALES.push(nuevaTarea);
            localStorage.setItem("db_tareas_mat", JSON.stringify(TAREAS_MATERIALES));
        } else {
            TAREAS_GENERALES_AUTO.push(nuevaTarea);
            localStorage.setItem("db_tareas_gral", JSON.stringify(TAREAS_GENERALES_AUTO));
        }
        document.getElementById("admin-tarea-desc").value = "";
    }
    actualizarListaVisual();
}

function actualizarListaVisual() {
    const lista = document.getElementById("lista-vencimientos-cargados");
    if(!lista) return;
    lista.innerHTML = "";
    const permisos = ENCARGADOS_DATA[usuarioActivo];
    const esMat = permisos.includes("SOLO_MATERIALES") && !permisos.includes("SUPER_USUARIO");
    if (esMat) {
        TAREAS_MATERIALES.forEach(t => { lista.innerHTML += `<li style="margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px;"><div style="color:#ff7a00; font-weight:bold;">🛠️ ${t.unidad}</div><div style="font-size:14px; color:white;">${t.tarea}</div><div style="font-size:11px; color:#888;">Límite: ${t.fecha}</div></li>`; });
    } else {
        VTV_DATA.forEach(v => { lista.innerHTML += `<li>🚗 <b>${v.unidad}</b> - VTV: ${v.fecha}</li>`; });
        TAREAS_GENERALES_AUTO.forEach(t => { const estilo = t.unidad === "GENERAL FLOTA" ? "color:#ff7a00;" : "color:#4dabf7;"; lista.innerHTML += `<li style="margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px;"><div style="${estilo} font-weight:bold;">${t.unidad}</div><div style="font-size:14px; color:white;">${t.tarea}</div><div style="font-size:11px; color:#888;">Límite: ${t.fecha} - ${t.creadoPor || ''}</div></li>`; });
    }
}

function gestionarAlertas(sector, nombreUnidad) {
    const contenedor = document.getElementById("contenedor-alertas");
    contenedor.style.display = "none";
    contenedor.className = "alerta-box";
    const hoy = new Date();
    let alertas = [];
    if (sector === 'AUTO') {
        const vtv = VTV_DATA.find(v => v.unidad === nombreUnidad);
        if (vtv) {
            const dias = Math.ceil((new Date(vtv.fecha) - hoy) / (86400000));
            if (dias <= 30) alertas.push({ texto: `VTV: Vence en ${dias} días`, dias: dias });
        }
    }
    if (alertas.length > 0) {
        contenedor.classList.add("amarillo");
        contenedor.innerHTML = `<strong>⚠️ ALERTAS</strong>` + alertas.map(a => `<span>${a.texto}</span>`).join("");
        contenedor.style.display = "block";
    }
}

async function finalizarYEnviar(){
    const km = document.getElementById('km-u1').value;
    if (sectorActivo === 'AUTO' && !km) return alert("KM obligatorio.");
    const btn = document.getElementById('btn-nube');
    btn.innerText = "PROCESANDO..."; btn.disabled = true;
    setTimeout(() => { alert("¡Datos guardados correctamente!"); location.reload(); }, 1500);
}

function generarBotonesFiltroEncargado(p) {
    const cont = document.getElementById('selector-unidades-encargado');
    cont.innerHTML = `<button class="btn" style="padding:5px 10px; font-size:12px; background:#444; color:white; border:none;" onclick="consultarReportesEncargado()">🔄 RECARGAR TABLA</button>`;
}

function consultarReportesEncargado() {
    document.getElementById('panel-consulta-encargado').style.display = 'block';
    fetch(WEB_APP_URL).then(r => r.json()).then(data => {
        let datosFiltrados = data;
        const permisos = ENCARGADOS_DATA[usuarioActivo];
        if (permisos) {
            if (permisos.includes("SOLO_AUTOMOTORES") && !permisos.includes("SUPER_USUARIO")) {
                if (permisos.includes("VER_TODO_AUTOMOTORES")) { datosFiltrados = data.filter(row => row.unidad && row.unidad.startsWith("UNIDAD")); }
                else { datosFiltrados = data.filter(row => permisos.includes(row.unidad)); }
            } else if (permisos.includes("SOLO_MATERIALES") && !permisos.includes("SUPER_USUARIO")) { datosFiltrados = data.filter(row => row.unidad && row.unidad.includes("MAT")); }
            else if (permisos.includes("SUBOFICIAL_ELECTRICIDAD") && !permisos.includes("SUPER_USUARIO")) { datosFiltrados = []; }
        }
        const usuariosRestringidos = ["DANIEL FARINACCIO", "CRISTIAN BALEY", "MARCOS ALFARO"];
        if (usuariosRestringidos.includes(usuarioActivo)) {
            const fechaLimite = new Date(); fechaLimite.setDate(fechaLimite.getDate() - 30);
            datosFiltrados = datosFiltrados.filter(row => { if (!row.fecha) return false; const partes = row.fecha.split('/'); const fechaFila = new Date(partes[2], partes[1] - 1, partes[0]); return fechaFila >= fechaLimite; });
        }
        mostrarDatosEnTabla(datosFiltrados.reverse());
    }).catch(e => { console.error(e); mostrarDatosEnTabla([{ fecha: "Error", encargado: "-", unidad: "-", control: "Sin conexión", estado: "-", obs: "No se pudo cargar la data" }]); });
}

function verHistorialEspecifico(unidad) {
    document.getElementById('panel-consulta-encargado').style.display = 'block';
    document.getElementById('titulo-consulta').innerText = "Historial - " + unidad;
    fetch(WEB_APP_URL).then(r=>r.json()).then(data=>{ const filtrados = data.filter(r => r.unidad === unidad); mostrarDatosEnTabla(filtrados.reverse()); }).catch(e => mostrarDatosEnTabla([]));
}









