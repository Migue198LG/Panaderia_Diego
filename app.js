const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/producto');
const carritoRoutes = require('./routes/carrito');
const fondosRoutes = require('./routes/fondos');
const ticketsRoutes = require('./routes/tickets'); // Nueva ruta para historial
const historialRoutes = require('./routes/historial'); // Nueva ruta para historial

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear cuerpo de solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Asegúrate de usar `secure: true` en producción con HTTPS
  })
);

// Verificar conexión a la base de datos
(async () => {
  try {
    const [result] = await db.query('SELECT 1');
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  }
})();

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar autenticación
function verificarAutenticacion(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }
}

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/producto', productosRoutes);
app.use('/carrito', verificarAutenticacion, carritoRoutes);
app.use('/fondos', fondosRoutes);
app.use('/tickets', verificarAutenticacion, ticketsRoutes); // Nueva ruta protegida para tickets
// Nueva ruta protegida para tickets
app.use('/historial', verificarAutenticacion, historialRoutes);


// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir carrito.html
app.get('/carrito', verificarAutenticacion, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'carrito.html'));
});

// Ruta para servir historial.html
app.get('/historial', verificarAutenticacion, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'historial_usuario.html')); // Asegura que el nombre coincide
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión.');
    }
    res.clearCookie('connect.sid'); // Limpia la cookie de sesión
    res.status(200).send('Sesión cerrada.');
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocurrió un error en el servidor.');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
