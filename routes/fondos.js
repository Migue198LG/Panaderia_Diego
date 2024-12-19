const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware para validar autenticación
function ensureAuthenticated(req, res, next) {
    console.log('Sesión actual:', req.session); // Depuración
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
}

// Ruta para obtener fondos
router.get('/get', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id_usuario; // Accede al usuario desde la sesión
        const [result] = await db.query('SELECT fondos FROM Usuarios WHERE id_usuario = ?', [userId]);

        if (result.length > 0) {
            const fondos = parseFloat(result[0].fondos); // Convertir a número
            return res.json({ fondos: isNaN(fondos) ? 0 : fondos }); // Si no es un número, devolver 0
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error en /fondos/get:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Ruta para agregar fondos
router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id_usuario;
        const { amount } = req.body;

        console.log('ID del usuario:', userId); // Depuración
        console.log('Cantidad enviada:', amount); // Depuración

        // Validaciones
        // Validar que la cantidad esté presente y sea un número válido
        if (!amount || isNaN(amount)) {
            console.error('Cantidad inválida:', amount);
            return res.status(400).json({ error: 'La cantidad debe ser un número válido.' });
        }

        const parsedAmount = parseFloat(amount);

        // Validar que sea un número positivo
        if (parsedAmount <= 0) {
            console.error('Cantidad negativa o cero:', parsedAmount);
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0.' });
        }

        // Validar que no exceda el límite permitido (999,999,999,999)
        if (parsedAmount > 999999999999) {
            console.error('Cantidad excede el límite:', parsedAmount);
            return res.status(400).json({ error: 'La cantidad no puede exceder 999,999,999,999.' });
        }

        // Validar que no contenga etiquetas HTML
        const htmlRegex = /<\/?[a-z][\s\S]*>/i;
        if (htmlRegex.test(amount.toString())) {
            console.error('Intento de inyección HTML detectado en la cantidad:', amount);
            return res.status(400).json({ error: 'La cantidad no debe contener etiquetas HTML.' });
        }

        // Actualizar fondos en la base de datos
        const [result] = await db.query(
            'UPDATE Usuarios SET fondos = fondos + ? WHERE id_usuario = ?',
            [parsedAmount, userId]
        );

        console.log('Resultado de la actualización:', result); // Depuración

        // Verificar si la actualización tuvo efecto
        if (result.affectedRows > 0) {
            return res.json({ message: 'Fondos agregados correctamente.' });
        } else {
            console.error('No se pudo actualizar los fondos. Verifica el ID del usuario.');
            return res.status(404).json({ error: 'Usuario no encontrado o sin cambios.' });
        }
    } catch (error) {
        console.error('Error en /fondos/add:', error.message);
        res.status(500).json({ error: 'Error del servidor.' });
    }
});

module.exports = router;
