
const express = require('express');
const cors = require('cors');
const path = require('path');

const { getTurnos, createTurno, updateTurnoEstado, deleteTurno } = require('./controllers/turnosController');
const { getPacientes, createPaciente } = require('./controllers/pacientesController');
const { login } = require('./controllers/authController');

const app = express();
const PORT = 3000;

// 1. Habilitar CORS para evitar errores de conexión en el frontend
app.use(cors());

// 2. Habilitar lectura de JSON en las peticiones
app.use(express.json());

// 3. Endpoints de la API
// -- Login
app.post('/api/login', login);

// -- Turnos
app.get('/api/turnos', getTurnos);
app.post('/api/turnos', createTurno);
app.put('/api/turnos/:id', updateTurnoEstado);
app.delete('/api/turnos/:id', deleteTurno);

// -- Pacientes
app.get('/api/pacientes', getPacientes);
app.post('/api/pacientes', createPaciente);

// 4. Servir los archivos HTML estáticos
app.use(express.static(path.join(__dirname, '../../')));

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
