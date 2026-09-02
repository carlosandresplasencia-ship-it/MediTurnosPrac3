# Medi-Turnos — versión completa y funcional

## Cómo ejecutarlo

1. Abrí esta carpeta en Visual Studio Code.
2. Abrí `index.html`.
3. Clic derecho → **Open with Live Server**.
4. El navegador abrirá la pantalla de inicio de Medi-Turnos.

Desde `index.html` podés acceder a las tres áreas:

- **Administración** → `admin-login.html` → `admin-dashboard.html`
- **Pacientes y Turnos** → `pacientes-login.html` → `pacientes.html` / `turnos.html`
- **Área Profesional** → `profesional-login.html` → `profesional-dashboard.html`

## Estructura

```
mediturnos/
├── index.html                 → Landing / entrada única
├── admin-login.html
├── admin-dashboard.html
├── pacientes-login.html
├── pacientes.html
├── turnos.html
├── profesionales.html
├── configuracion.html
├── profesional-login.html
├── profesional-dashboard.html
├── README.md
└── assets/
    ├── styles.css             → Estilos compartidos (completo)
    └── Logo-MediTurnos.png
```

## Notas

- Todos los HTML comparten el mismo `assets/styles.css`.
- Los enlaces de navegación y “Volver al inicio” funcionan correctamente.
- El dashboard profesional tiene menú lateral + secciones internas (SPA ligera).
- Esta versión es una maqueta estática: no tiene base de datos ni autenticación real.
