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

// Ruta para obtener el historial de compras del usuario
router.get('/compras', verificarAutenticacion, async (req, res) => {
    try {
        const idUsuario = req.session.user.id_usuario;

        const [historial] = await db.query(
            `SELECT id_ticket, fecha_compra, total_a_pagar
             FROM Tickets
             WHERE id_usuario = ?
             ORDER BY fecha_compra DESC`,
            [idUsuario]
        );

        res.json(historial);
    } catch (err) {
        console.error('Error al obtener el historial de compras:', err);
        res.status(500).json({ message: 'Error del servidor al obtener el historial de compras.' });
    }
});

module.exports = router;
