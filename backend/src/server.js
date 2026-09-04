const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos simulada en memoria para los turnos
let turnos = [
  { id: 1, paciente: 'Juan Pérez', profesional: 'Dra. María González', fecha: '2026-09-02', hora: '10:00', estado: 'Confirmado' }
];

// --- ENDPOINTS DE TURNOS ---
app.get('/api/turnos', (req, res) => {
  res.json(turnos);
});

app.post('/api/turnos', (req, res) => {
  const nuevoTurno = { id: Date.now(), ...req.body, estado: 'Pendiente' };
  turnos.push(nuevoTurno);
  res.status(201).json({ mensaje: 'Turno solicitado con éxito', turno: nuevoTurno });
});

// --- ENDPOINT DE AUTENTICACIÓN ---
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  
  // Credenciales de prueba
  if (usuario === 'admin' && password === '1234') {
    return res.json({ autorizado: true, rol: 'admin', redirect: 'admin-dashboard.html' });
  } else if (usuario === 'paciente' && password === '1234') {
    return res.json({ autorizado: true, rol: 'paciente', redirect: 'pacientes.html' });
  } else if (usuario === 'profesional' && password === '1234') {
    return res.json({ autorizado: true, rol: 'profesional', redirect: 'profesional-dashboard.html' });
  }
  
  res.status(401).json({ autorizado: false, mensaje: 'Credenciales inválidas (probá admin/1234)' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend de Medi-Turnos corriendo en http://localhost:${PORT}`);
});