const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validar que todos los campos estén completos
    if (!username || !password) {
        return res.status(400).send('Por favor, completa todos los campos.');
    }

    // Validar que el nombre de usuario no contenga etiquetas HTML
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    if (htmlRegex.test(username) || htmlRegex.test(password)) {
        return res.status(400).send('No se permiten etiquetas HTML en los campos.');
    }

    // Validar que el nombre de usuario no contenga caracteres especiales ni números si es necesario
    const usernameRegex = /^[a-zA-Z\s]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).send('El nombre de usuario no debe contener números ni caracteres especiales.');
    }

    try {
        // Consultar el usuario en la base de datos
        const [results] = await db.query(
            'SELECT * FROM Usuarios WHERE nombre_usuario = ?',
            [username]
        );

        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.status(401).send('Usuario o contraseña incorrectos.');
        }

        const user = results[0];

        // Comparar la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(password, user.contrasena);

        // Validar la contraseña
        if (!isMatch) {
            return res.status(401).send('Usuario o contraseña incorrectos.');
        }

        // Si las credenciales son correctas, guardar la sesión
        req.session.user = {
            id_usuario: user.id_usuario,
            nombre_usuario: user.nombre_usuario,
            rol: user.rol,
        };

        // Responder según el rol del usuario
        if (user.rol === 'admin') {
            res.status(200).send('Admin login');
        } else {
            res.status(200).send('User login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor.');
    }
});


// Ruta para registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validar que todas las entradas estén presentes
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).send('Por favor, completa todos los campos.');
    }

    // Validar que el nombre no contenga números ni caracteres especiales
    const nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(username)) {
        return res.status(400).send('El nombre no puede contener números ni caracteres especiales.');
    }

    // Validar que no se incluyan etiquetas HTML o scripts
    const htmlRegex = /<[^>]*>/g;
    if (htmlRegex.test(username) || htmlRegex.test(email) || htmlRegex.test(password)) {
        return res.status(400).send('No se permiten etiquetas HTML en los campos.');
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Por favor, introduce un correo electrónico válido.');
    }

    // Validar la longitud de la contraseña
    if (password.length < 5 || password.length > 15) {
        return res.status(400).send('La contraseña debe tener entre 5 y 15 caracteres.');
    }

    // Validar que la contraseña contenga al menos un número y un signo
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{5,15}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send('La contraseña debe contener al menos un número y un signo.');
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        return res.status(400).send('Las contraseñas no coinciden.');
    }

    try {
        // Verificar si el usuario o el correo ya existen
        const [existingUser] = await db.query(
            'SELECT * FROM Usuarios WHERE nombre_usuario = ? OR correo = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).send('El nombre de usuario o correo ya están en uso.');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        await db.query(
            'INSERT INTO Usuarios (nombre_usuario, correo, contrasena, rol, fondos) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, 'usuario', 0.00]
        );

        res.status(201).send('Usuario registrado exitosamente.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta para verificar sesión
router.get('/usuario', (req, res) => {
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: 'No hay una sesión activa.' });
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al cerrar sesión.');
        } else {
            res.clearCookie('connect.sid');
            res.status(200).send('Sesión cerrada.');
        }
    });
});

module.exports = router;
