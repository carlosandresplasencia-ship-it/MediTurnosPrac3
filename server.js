const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ========== BASE DE DATOS SIMPLE (JSON) ==========
const DB_FILE = path.join(__dirname, 'database.json');

// Usuarios por defecto (relacionados con el sistema)
const DEFAULT_USERS = [
  {
    id: 1,
    usuario: 'admin',
    password: '1234',
    rol: 'admin',
    nombre: 'Administrador Master',
    email: 'admin@mediturnos.com'
  },
  {
    id: 2,
    usuario: 'secretaria',
    password: '1234',
    rol: 'secretaria',
    nombre: 'Secretaría',
    email: 'secretaria@mediturnos.com'
  },
  {
    id: 3,
    usuario: 'doctora',
    password: '1234',
    rol: 'profesional',
    nombre: 'Dra. María González',
    especialidad: 'Dermatología',
    matricula: 'MP 12345',
    email: 'maria.gonzalez@mediturnos.com'
  },
  {
    id: 4,
    usuario: 'profesional',
    password: '1234',
    rol: 'profesional',
    nombre: 'Dra. María González',
    especialidad: 'Dermatología',
    matricula: 'MP 12345',
    email: 'maria.gonzalez@mediturnos.com'
  },
  {
    id: 5,
    usuario: 'paciente',
    password: '1234',
    rol: 'paciente',
    nombre: 'Juan Pérez',
    dni: '32456789',
    obra: 'OSDE',
    telefono: '11 5555-1234',
    email: 'juan.perez@mail.com'
  },
  {
    id: 6,
    usuario: '32456789',
    password: '1234',
    rol: 'paciente',
    nombre: 'Juan Pérez',
    dni: '32456789',
    obra: 'OSDE',
    telefono: '11 5555-1234',
    email: 'juan.perez@mail.com'
  }
];

// Cargar o crear base de datos
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      // Asegurarnos de que existan todas las estructuras necesarias
      if (!data.usuarios) data.usuarios = DEFAULT_USERS;
      if (!data.turnos) data.turnos = [];
      if (!data.pacientes) data.pacientes = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          dni: '32456789',
          obra: 'OSDE',
          telefono: '11 5555-1234',
          email: 'juan.perez@mail.com',
          estado: 'Habilitado'
        }
      ];
      if (!data.obras) data.obras = [];
      if (!data.hc) data.hc = [];
      if (!data.contactos) data.contactos = [];
      return data;
    } catch (e) {
      console.log('Error leyendo DB, se crea nueva...');
    }
  }
  const db = {
    usuarios: DEFAULT_USERS,
    turnos: [],
    pacientes: [
      {
        id: 1,
        nombre: 'Juan Pérez',
        dni: '32456789',
        obra: 'OSDE',
        telefono: '11 5555-1234',
        email: 'juan.perez@mail.com',
        estado: 'Habilitado'
      }
    ],
    obras: [],
    hc: [],
    contactos: []
  };
  saveDB(db);
  return db;
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

let db = loadDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // sirve los HTML

// ========== RUTAS API DE DATOS (Secretaría y Estadísticas) ==========

// Obtener todos los datos centralizados
app.get('/api/datos', (req, res) => {
  db = loadDB();
  res.json(db);
});

// Guardar/Actualizar todos los datos centralizados
app.post('/api/datos', (req, res) => {
  const { pacientes, turnos, obras, hc, contactos } = req.body;
  
  if (pacientes) db.pacientes = pacientes;
  if (turnos) db.turnos = turnos;
  if (obras) db.obras = obras;
  if (hc) db.hc = hc;
  if (contactos) db.contactos = contactos;

  saveDB(db);
  res.json({ success: true, message: 'Datos guardados correctamente' });
});

// ========== RUTAS API TRADICIONALES ==========

// LOGIN
app.post('/api/login', (req, res) => {
  const { usuario, password, rol } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  const user = db.usuarios.find(u =>
    (u.usuario.toLowerCase() === usuario.toLowerCase() || u.dni === usuario) &&
    u.password === password &&
    (!rol || u.rol === rol || (rol === 'profesional' && u.rol === 'profesional'))
  );

  if (!user) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  const { password: _, ...usuarioSinPass } = user;
  res.json({
    mensaje: 'Login exitoso',
    usuario: usuarioSinPass
  });
});

// REGISTRO DE PACIENTE
app.post('/api/pacientes', (req, res) => {
  const { nombre, dni, obra, telefono, password } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ mensaje: 'Nombre y DNI son obligatorios' });
  }

  const existe = db.usuarios.find(u => u.dni === dni || u.usuario === dni);
  if (existe) {
    return res.status(400).json({ mensaje: 'Ya existe un paciente con ese DNI' });
  }

  const nuevoId = db.usuarios.length ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
  const nuevoUsuario = {
    id: nuevoId,
    usuario: dni,
    password: password || '1234',
    rol: 'paciente',
    nombre,
    dni,
    obra: obra || 'Particular',
    telefono: telefono || '',
    email: ''
  };

  db.usuarios.push(nuevoUsuario);
  db.pacientes.push({
    id: nuevoId,
    nombre,
    dni,
    obra: obra || 'Particular',
    telefono: telefono || '',
    estado: 'Habilitado'
  });
  saveDB(db);

  const { password: _, ...sinPass } = nuevoUsuario;
  res.status(201).json({ mensaje: 'Paciente registrado', usuario: sinPass });
});

// LISTAR TURNOS
app.get('/api/turnos', (req, res) => {
  res.json(db.turnos);
});

// CREAR TURNO
app.post('/api/turnos', (req, res) => {
  const { paciente, profesional, fecha, hora, motivo } = req.body;

  if (!paciente || !fecha || !hora) {
    return res.status(400).json({ mensaje: 'Faltan datos del turno' });
  }

  const nuevoTurno = {
    id: db.turnos.length ? Math.max(...db.turnos.map(t => t.id)) + 1 : 1,
    paciente,
    profesional: profesional || 'Dra. María González',
    fecha,
    hora,
    motivo: motivo || 'Consulta',
    estado: 'Pendiente',
    creado: new Date().toISOString()
  };

  db.turnos.push(nuevoTurno);
  saveDB(db);
  res.status(201).json(nuevoTurno);
});

// ACTUALIZAR ESTADO DE TURNO
app.put('/api/turnos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const turno = db.turnos.find(t => t.id === id);
  if (!turno) return res.status(404).json({ mensaje: 'Turno no encontrado' });

  Object.assign(turno, req.body);
  saveDB(db);
  res.json(turno);
});

// LISTAR USUARIOS (solo admin)
app.get('/api/usuarios', (req, res) => {
  const usuariosSinPass = db.usuarios.map(({ password, ...u }) => u);
  res.json(usuariosSinPass);
});

// CREAR USUARIO
app.post('/api/usuarios', (req, res) => {
  const { usuario, password, rol, nombre } = req.body;
  if (!usuario || !password || !rol) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const existe = db.usuarios.find(u => u.usuario.toLowerCase() === usuario.toLowerCase());
  if (existe) return res.status(400).json({ mensaje: 'El usuario ya existe' });

  const nuevo = {
    id: db.usuarios.length ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1,
    usuario,
    password,
    rol,
    nombre: nombre || usuario
  };
  db.usuarios.push(nuevo);
  saveDB(db);

  const { password: _, ...sinPass } = nuevo;
  res.status(201).json(sinPass);
});

// ========== INICIO ==========
app.listen(PORT, () => {
  console.log('');
  console.log('=============================================');
  console.log('   Medi-Turnos Backend corriendo');
  console.log('   http://localhost:' + PORT);
  console.log('=============================================');
  console.log('');
  console.log('LOGINS DISPONIBLES (todos con password: 1234)');
  console.log('---------------------------------------------');
  console.log('   ADMIN      →   usuario: admin');
  console.log('   SECRETARIA →   usuario: secretaria');
  console.log('   DOCTORA    →   usuario: doctora   (o profesional)');
  console.log('   PACIENTE   →   usuario: paciente  (o 32456789)');
  console.log('---------------------------------------------');
  console.log('');
});