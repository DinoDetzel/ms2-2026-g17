# 🚒 Sistema de Control Operativo para Cuartel de Bomberos

Materia: Metodología de Sistemas II (MSII) — 2026

Grupo: 17

## 👥 Integrantes
Luca Aversano

Dino Detzel

Joaquín Robles

Owen Braggi Bamberger Carrasco

## 📋 Descripción

Este proyecto consiste en un sistema de gestión diseñado para optimizar la logística y la operatividad de un cuartel de bomberos.

La plataforma busca digitalizar y centralizar el control diario de los vehículos, el inventario de materiales y equipamiento, las tareas de electricidad de las autobombas e instalaciones del cuartel y las revisiones periódicas.

El objetivo principal es facilitar el seguimiento del mantenimiento y permitir que las unidades, herramientas y equipamiento críticos se encuentren en condiciones adecuadas para el servicio.

## 🎯 Objetivos

- Centralizar la información operativa del cuartel.

- Facilitar el control y mantenimiento de los vehículos.

- Administrar el inventario de materiales y equipamiento.

- Registrar y realizar revisiones periódicas.

- Gestionar tareas relacionadas con electricidad.

- Visualizar tareas pendientes y necesidades de mantenimiento.

- Facilitar el acceso a la información necesaria para mantener las unidades y equipamientos en condiciones operativas.

## ✅ Funcionalidades actuales

Lo que se puede usar hoy al ejecutar el proyecto en `http://localhost:3000`:

- **Ingreso al sistema:** se ingresa con nombre y apellido (ambos obligatorios). El navegador recuerda la sesión hasta que se presiona `CERRAR SESIÓN`.
- **Menú de sectores:** acceso a `Materiales`, `Automotores` y `Electricidad`, junto con los datos de los encargados de cada sector.
- **Automotores:** grilla con las 14 unidades del cuartel. Al elegir una se muestra su checklist de control, con carga del nivel de combustible y del kilometraje actual.
- **Materiales:** grilla con las unidades que llevan equipamiento, más `CENTRAL` y `DESTACAMENTO`. Cada checklist muestra la cantidad que debería haber de cada elemento.
- **Checklists de control:** cada ítem se marca como `Bien` o `Mal`; al marcar `Mal` se habilita un campo para detallar el problema. Algunos ítems piden un dato escrito (por ejemplo, horas de uso o cantidad de aire de un cilindro). Cada control incluye la fecha en que se realiza.
- **Agregar unidades:** las grillas y los checklists se generan a partir de `public/js/data.js`, así que para sumar una unidad alcanza con cargar su lista ahí.

> **Importante:** el botón `GUARDAR CONTROL` todavía es una simulación. Los datos cargados en un checklist no se guardan y se pierden al salir o recargar la página.

## 🚒 Funcionalidades a implementar

Lo que está planificado y todavía no está implementado:

- **Guardado de los controles:** registrar cada revisión con su fecha, responsable, resultados y observaciones, para dejar constancia y consultar el historial. Requiere incorporar persistencia (por ejemplo, una base de datos).
- **Sector Electricidad:** gestión de tareas sobre las luces de las autobombas y las instalaciones eléctricas del cuartel. Hoy el botón solo muestra un aviso de que está en construcción.
- **Inventario y stock:** administrar altas, bajas y el estado de herramientas y equipamiento especializado (trauma, rescate en altura, riesgo eléctrico, equipos de respiración autónoma).
- **Vencimientos y alertas:** seguimiento de VTV, services y otros vencimientos de las unidades, con avisos de lo que requiere atención.
- **Tareas pendientes:** listado de mantenimientos necesarios y equipos que requieren revisión, generado a partir de los controles con ítems en `Mal`.
- **Usuarios y permisos:** inicio de sesión real con contraseña y roles (por ejemplo, encargado de sector y administrador).
- **Checklists desde el backend:** servir los checklists desde la API en lugar de cargarlos en el navegador con `data.js`.

## 🛠️ Tecnologías

El proyecto utiliza actualmente:

`Node.js` — entorno de ejecución del backend.

`Express` — framework utilizado para desarrollar el servidor y la API.

`HTML` — estructura del frontend.

`CSS` — estilos de la interfaz.

`JavaScript` — lógica del frontend.

Herramientas de desarrollo:

`node:test` y `supertest` — tests automatizados.

`ESLint` — análisis estático del código.

`GitHub Actions` — corre lint y tests en cada push o pull request a `main` y `dev`.

## 📁 Estructura del proyecto

```text
ms2-2026-g17/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   ├── evidencia/
│   │   ├── eslint-antes.txt
│   │   ├── eslint-despues.txt
│   │   └── script.original.js
│   ├── calidad.md
│   ├── decisiones-diseno.md
│   └── testing.md
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js          (interfaz, usa el DOM)
│   │   ├── controles.js    (logica sin DOM, se testea)
│   │   └── data.js         (checklists por unidad)
│   └── index.html
│
├── src/
│   ├── app.js              (app de Express, se testea)
│   └── server.js           (arranca el servidor)
│
├── test/
│   ├── api.test.js
│   ├── controles.test.js
│   └── datos.test.js
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
```

## 💻 Requisitos

Para ejecutar el proyecto se necesita tener instalado:

`Node.js`

`npm`

`Git`

Se puede comprobar la instalación mediante:
```bash
node --version
```
```bash
npm --version
```
```bash
git --version
```
**Versión de Node.js:** se necesita Node.js **20.19 o superior, 22.13 o superior, o 24 en adelante** (Node 23 no es compatible con ESLint).

Se recomienda **Node.js 22 LTS**, que es la versión con la que se ejecutan el lint y los tests en GitHub Actions.

## 📥 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/DinoDetzel/ms2-2026-g17.git
```
2. Ingresar a la carpeta del proyecto:
```bash
cd ms2-2026-g17
```
3. Instalar las dependencias:
```bash
npm install
```
Las dependencias están declaradas en package.json y sus versiones concretas se registran en package-lock.json.

## ⚙️ Configuración

El proyecto utiliza variables de entorno para configurar determinados parámetros de ejecución.

Se proporciona el archivo .env.example como referencia.

Actualmente contiene:

`PORT=3000`

Para configurar el entorno local, crear un archivo .env tomando como referencia .env.example.

Ejemplo:

`PORT=3000`

## ▶️ Ejecución

Para iniciar el proyecto en modo desarrollo:
```bash
npm run dev
```
El servidor estará disponible en:

http://localhost:3000

También se puede iniciar mediante:
```bash
npm start
```
## 🧪 Comprobación del servidor

El proyecto cuenta con un endpoint de prueba para verificar que el backend se encuentra funcionando correctamente.

Endpoint:

`GET /api/health`

Puede comprobarse accediendo a:

http://localhost:3000/api/health

La respuesta esperada es:
```text
{
  "status": "ok",
  "message": "Sistema de Bomberos funcionando"
}
```

## ✅ Tests

Los tests están en la carpeta `test/` y usan `node:test` (incluido en Node) y `supertest`.

```bash
npm test
```

Con reporte de cobertura:

```bash
npm run test:coverage
```

Qué se prueba:

- `test/api.test.js`: endpoint `/api/health`, rutas inexistentes y archivos estáticos.
- `test/controles.test.js`: `obtenerControles`, nombres de unidades y validación del login, con casos normales, límite y de error.
- `test/datos.test.js`: que los checklists de `data.js` estén bien cargados.

Si todo está bien la salida termina con `fail 0`. Los tests marcados como `todo` son problemas detectados en los datos que todavía no corregimos; se muestran pero no hacen fallar la corrida.

El detalle de cada caso y por qué lo elegimos está en [docs/testing.md](docs/testing.md).

## 🔍 Calidad de código

```bash
npm run lint     # ESLint
npm run check    # lint + tests
```

Qué encontramos con ESLint y los tests, y qué cambiamos: [docs/calidad.md](docs/calidad.md).

## 🚧 Estado actual

El proyecto se encuentra en desarrollo. Cuenta con la base técnica en Node.js y Express y con un prototipo funcional del frontend, que todavía no está conectado a una base de datos.

Tiene tests automatizados del backend, de la lógica del checklist y de los datos. La interfaz (navegación y pantallas) todavía se prueba a mano.
