const express = require('express');
const cors = require('cors');
const { getTurnos, createTurno, updateTurnoEstado } = require('./controllers/turnosController');

const app = express();
app.use(cors());
app.use(express.json());

// ========== USUARIOS ==========
const usuarios = [
  { usuario: 'paciente',     password: 'paciente',     rol: 'paciente',     redirect: 'pacientes.html' },
  { usuario: 'profesional',  password: 'profesional',  rol: 'profesional',  redirect: 'profesional-dashboard.html' },
  { usuario: 'secretaria',   password: 'secretaria',   rol: 'secretaria',   redirect: 'secretaria.html' },
  { usuario: 'admin',        password: 'admin',        rol: 'admin',        redirect: 'admin-dashboard.html' }
];

// LOGIN
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  const userFound = usuarios.find(u => u.usuario === usuario && u.password === password);

  if (userFound) {
    return res.json({
      ok: true,
      usuario: userFound.usuario,
      rol: userFound.rol,
      redirect: userFound.redirect
    });
  }
  return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
});

// REGISTRO DE PACIENTE (esto te faltaba)
app.post('/api/pacientes', (req, res) => {
  const { nombre, dni, obra, telefono, password } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ mensaje: 'Nombre y DNI son obligatorios' });
  }

  // Verificar si ya existe
  const existe = usuarios.find(u => u.usuario === dni);
  if (existe) {
    return res.status(400).json({ mensaje: 'Ya existe un paciente con ese DNI' });
  }

  // Agregar nuevo paciente
  usuarios.push({
    usuario: dni,
    password: password || '1234',
    rol: 'paciente',
    redirect: 'pacientes.html',
    nombre,
    dni,
    obra,
    telefono
  });

  res.status(201).json({
    mensaje: 'Paciente registrado correctamente',
    usuario: { nombre, dni, obra, telefono, rol: 'paciente' }
  });
});

// TURNOS
app.get('/api/turnos', getTurnos);
app.post('/api/turnos', createTurno);
app.put('/api/turnos/:id', updateTurnoEstado);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});