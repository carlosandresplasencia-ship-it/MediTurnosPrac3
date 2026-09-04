const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/turnos.json');

const readTurnos = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeTurnos = (turnos) => {
  fs.writeFileSync(dataPath, JSON.stringify(turnos, null, 2), 'utf8');
};

const getTurnos = (req, res) => {
  const turnos = readTurnos();
  res.json(turnos);
};

const createTurno = (req, res) => {
  const { paciente, profesional, fecha, hora, motivo } = req.body;

  if (!paciente || !profesional) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios' });
  }

  const turnos = readTurnos();
  const nuevoTurno = {
    id: turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1 : 1,
    hora: hora || '09:00',
    fecha: fecha || new Date().toISOString().split('T')[0],
    paciente,
    profesional,
    estado: 'Pendiente',
    motivo: motivo || 'Consulta general'
  };

  turnos.push(nuevoTurno);
  writeTurnos(turnos);

  res.status(201).json({ ok: true, turno: nuevoTurno });
};

const updateTurnoEstado = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const turnos = readTurnos();
  const index = turnos.findIndex(t => t.id === parseInt(id) || t.id == id);

  if (index !== -1) {
    turnos[index].estado = estado || turnos[index].estado;
    writeTurnos(turnos);
    return res.json({ ok: true, turno: turnos[index] });
  }

  res.status(404).json({ ok: false, mensaje: 'Turno no encontrado' });
};

module.exports = {
  getTurnos,
  createTurno,
  updateTurnoEstado
};
