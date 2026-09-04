const express = require('express');
const cors = require('cors');
const { getTurnos, createTurno, updateTurnoEstado } = require('./controllers/turnosController');

const app = express();
app.use(cors());
app.use(express.json());

const usuarios = [
  { usuario: 'paciente', password: 'paciente', rol: 'paciente', redirect: 'pacientes.html' },
  { usuario: 'profesional', password: 'profesional', rol: 'profesional', redirect: 'profesional-dashboard.html' },
  { usuario: 'secretaria', password: 'secretaria', rol: 'secretaria', redirect: 'secretaria.html' },
  { usuario: 'admin', password: 'admin', rol: 'admin', redirect: 'admin-dashboard.html' }
];

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

app.get('/api/turnos', getTurnos);
app.post('/api/turnos', createTurno);
app.put('/api/turnos/:id', updateTurnoEstado);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});