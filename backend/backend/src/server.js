const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta actual
app.use(express.static(__dirname));

// Función para leer la base de datos JSON de forma segura
function leerDB() {
    if (!fs.existsSync(DB_FILE)) {
        const estructuraInicial = { pacientes: [], turnos: [], obras: [], hc: [] };
        fs.writeFileSync(DB_FILE, JSON.stringify(estructuraInicial, null, 2));
        return estructuraInicial;
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { pacientes: [], turnos: [], obras: [], hc: [] };
    }
}

// Función para escribir en la base de datos JSON
function escribirDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 1. Endpoint para obtener todos los datos (lo usan secretaría y estadísticas)
app.get('/api/datos', (req, res) => {
    const db = leerDB();
    res.json(db);
});

// 2. Endpoint genérico para guardar o actualizar datos en la base de datos
// Espera recibir un objeto como: { tipo: 'turnos', data: [...] } o guarda elementos individuales
app.post('/api/datos', (req, res) => {
    const db = leerDB();
    const { pacientes, turnos, obras, hc } = req.body;

    if (pacientes) db.pacientes = pacientes;
    if (turnos) db.turnos = turnos;
    if (obras) db.obras = obras;
    if (hc) db.hc = hc;

    escribirDB(db);
    res.json({ success: true, message: 'Datos guardados correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor de Medi-Turnos corriendo en http://localhost:${PORT}`);
});