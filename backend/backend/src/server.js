// Actualizar estado de un turno (Atendido / Confirmado / Cancelado)
app.put('/api/turnos/:index', (req, res) => {
  const { index } = req.params;
  const { estado } = req.body;

  if (turnos[index]) {
    turnos[index].estado = estado;
    return res.json({ ok: true, turno: turnos[index] });
  }
  
  res.status(404).json({ ok: false, mensaje: 'Turno no encontrado' });
});