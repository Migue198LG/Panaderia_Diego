const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware para verificar autenticación
function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
}

// Ruta para obtener el historial de compras de un usuario específico usando su ID
router.post('/consultar', verificarAutenticacion, async (req, res) => {
    const { idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El ID del usuario es requerido.' });
    }

    try {
        const [historial] = await db.query(
            `SELECT id_ticket, fecha_compra, total_a_pagar
             FROM Tickets
             WHERE id_usuario = ?
             ORDER BY fecha_compra DESC`,
            [idUsuario]
        );

        if (!historial || historial.length === 0) {
            return res.status(404).json({ message: `No se encontraron compras para el usuario con ID: ${idUsuario}.` });
        }

        res.json(historial);
    } catch (err) {
        console.error('Error al obtener el historial de compras:', err);
        res.status(500).json({ message: 'Error del servidor al obtener el historial de compras.' });
    }
});

module.exports = router;
