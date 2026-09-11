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

## 🚒 Funcionalidades previstas

- Control de unidades

- Permitirá realizar el seguimiento de los vehículos del cuartel, incluyendo: `Estado operativo`, `kilometraje`, `vencimientos importantes`, `información relacionada con el mantenimiento`, `gestión de inventario y materiales`.

- Permitirá administrar el stock y estado de herramientas y equipamiento especializado.

- Se contemplan diferentes áreas, entre ellas: `Trauma`, `rescate en altura`, `riesgo eléctrico`, `equipos de Respiración Autónoma (E.R.A.)`, `gestión de tareas de electricidad`.

- Permitirá registrar y gestionar tareas relacionadas con: `Luces de autobombas`, `instalaciones eléctricas del cuartel`, `revisiones periódicas`.

- El sistema contará con checklists para realizar controles de rutina.

- Las revisiones permitirán: `Verificar el estado de los elementos`, `registrar observaciones`, `detectar fallas`, `dejar constancia de las revisiones realizadas`, `alertas y tareas`.

- Permitirá visualizar y gestionar: `Tareas pendientes`, `mantenimientos necesarios`, `equipos que requieren revisión`.

## 🛠️ Tecnologías

El proyecto utiliza actualmente:

`Node.js` — entorno de ejecución del backend.

`Express` — framework utilizado para desarrollar el servidor y la API.

`HTML` — estructura del frontend.

`CSS` — estilos de la interfaz.

`JavaScript` — lógica del frontend.

## 📁 Estructura del proyecto

```text
ms2-2026-g17/
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
├── src/
│   └── server.js
│
├── .env.example
├── .gitignore
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
Se recomienda utilizar la misma versión de Node.js utilizada durante el desarrollo del proyecto.

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

El archivo .env no debe subirse al repositorio cuando contenga información sensible.

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
## 🔄 Reproducibilidad

El proyecto está preparado para que cualquier integrante del grupo pueda obtener el código y reconstruir el entorno de desarrollo utilizando únicamente el repositorio y la documentación disponible.

Los pasos básicos para reproducir el proyecto son:
```bash
git clone https://github.com/DinoDetzel/ms2-2026-g17.git
cd ms2-2026-g17
npm install
```
Luego se debe configurar el archivo .env a partir de .env.example y ejecutar:
```bash
npm run dev
```
Las dependencias no se incluyen directamente en el repositorio mediante la carpeta node_modules, ya que pueden reconstruirse ejecutando npm install.

El repositorio contiene:

- package.json para declarar las dependencias del proyecto.
- package-lock.json para registrar las versiones concretas de las dependencias.
- .env.example para documentar las variables de entorno necesarias.
- .gitignore para excluir archivos que no deben versionarse.

## 🔐 Versionado y archivos ignorados

La carpeta node_modules y los archivos de configuración locales, como .env, no se versionan.

El objetivo es mantener en Git únicamente los archivos necesarios para reconstruir el proyecto, evitando incluir dependencias generadas, configuraciones locales o información sensible.

## 🚧 Estado actual

El proyecto se encuentra en una etapa inicial de desarrollo.

La base técnica del proyecto ya se encuentra configurada utilizando Node.js y Express. En las siguientes etapas se incorporarán las funcionalidades correspondientes a los diferentes módulos del sistema.
