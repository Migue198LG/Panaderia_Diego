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

// Ruta para agregar un producto al carrito
router.post('/agregar', ensureAuthenticated, async (req, res) => {
    const { idProducto, cantidad } = req.body;

    console.log('Datos recibidos:', { idProducto, cantidad });

    if (!idProducto || !cantidad) {
        console.log('Faltan datos para agregar el producto al carrito.');
        return res.status(400).json({ message: 'Faltan datos para agregar el producto al carrito.' });
    }

    try {
        const idUsuario = req.session.user.id_usuario;

        if (!idUsuario) {
            console.log('ID de usuario no encontrado en la sesión.');
            return res.status(500).json({ message: 'Error en la sesión del usuario.' });
        }

        // Verificar si el producto ya está en el carrito del usuario
        const [productoExistente] = await db.query(
            'SELECT * FROM Carrito WHERE id_usuario = ? AND id_producto = ?',
            [idUsuario, idProducto]
        );

        console.log('Producto existente en el carrito:', productoExistente);

        if (productoExistente.length > 0) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            await db.query(
                'UPDATE Carrito SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_producto = ?',
                [cantidad, idUsuario, idProducto]
            );
        } else {
            // Si el producto no está en el carrito, agregarlo
            await db.query(
                'INSERT INTO Carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)',
                [idUsuario, idProducto, cantidad]
            );
        }

        res.status(200).json();
    } catch (err) {
        console.error('Error al agregar producto al carrito:', err);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Ruta para listar los productos en el carrito
router.get('/listar', ensureAuthenticated, async (req, res) => {
    try {
        const idUsuario = req.session.user.id_usuario;

        const [carrito] = await db.query(
            `SELECT 
                p.id_producto, 
                p.nombre_producto, 
                p.precio AS precio_unitario, 
                c.cantidad, 
                p.imagen_url 
             FROM Carrito c 
             JOIN Productos p ON c.id_producto = p.id_producto 
             WHERE c.id_usuario = ?`,
            [idUsuario]
        );

        console.log('Carrito listado:', carrito);

        res.json(carrito);
    } catch (err) {
        console.error('Error al listar el carrito:', err);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Ruta para quitar un producto del carrito
router.delete('/quitar', ensureAuthenticated, async (req, res) => {
    const { idProducto } = req.body;

    if (!idProducto) {
        return res.status(400).json({ message: 'Faltan datos para quitar el producto del carrito.' });
    }

    try {
        const idUsuario = req.session.user.id_usuario;

        await db.query(
            'DELETE FROM Carrito WHERE id_usuario = ? AND id_producto = ?',
            [idUsuario, idProducto]
        );

        res.status(200).json({ message: 'Producto eliminado del carrito.' });
    } catch (err) {
        console.error('Error al quitar producto del carrito:', err);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

router.post('/comprar', ensureAuthenticated, async (req, res) => {
    try {
        const idUsuario = req.session.user.id_usuario;

        // Obtener los productos del carrito
        const [carrito] = await db.query(
            `SELECT 
                p.id_producto, 
                p.nombre_producto, 
                p.precio AS precio_unitario, 
                c.cantidad, 
                p.stock 
             FROM Carrito c 
             JOIN Productos p ON c.id_producto = p.id_producto 
             WHERE c.id_usuario = ?`,
            [idUsuario]
        );

        if (carrito.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío.' });
        }

        // Verificar que todos los productos tienen suficiente stock
        for (const producto of carrito) {
            if (producto.cantidad > producto.stock) {
                return res.status(400).json({
                    message: `Stock insuficiente para el producto: ${producto.nombre_producto}. Stock disponible: ${producto.stock}.`
                });
            }
        }
        

        // Calcular el total de la compra
        const totalCompra = carrito.reduce((total, producto) => {
            return total + producto.precio_unitario * producto.cantidad;
        }, 0);

        // Obtener los fondos del usuario
        const [usuario] = await db.query('SELECT fondos FROM Usuarios WHERE id_usuario = ?', [idUsuario]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const fondosUsuario = usuario[0].fondos;

        if (fondosUsuario < totalCompra) {
            return res.status(400).json({ message: 'Fondos insuficientes para realizar la compra.' });
        }

        // Restar el total de la compra de los fondos del usuario
        await db.query('UPDATE Usuarios SET fondos = fondos - ? WHERE id_usuario = ?', [totalCompra, idUsuario]);

        // Insertar la compra en la tabla de tickets
        const [result] = await db.query(
            'INSERT INTO Tickets (id_usuario, total_a_pagar) VALUES (?, ?)',
            [idUsuario, totalCompra]
        );

        const idTicket = result.insertId;

        // Insertar los detalles de los productos comprados y actualizar el stock
        for (const producto of carrito) {
            await db.query(
                'INSERT INTO DetalleProductos (id_ticket, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [idTicket, producto.id_producto, producto.cantidad, producto.precio_unitario, producto.cantidad * producto.precio_unitario]
            );

            // Actualizar el stock del producto
            const [updateResult] = await db.query(
                'UPDATE Productos SET stock = stock - ? WHERE id_producto = ?',
                [producto.cantidad, producto.id_producto]
            );

            // Eliminar productos con stock igual a 0
            if (updateResult.affectedRows > 0) {
                const [stockCheck] = await db.query(
                    'SELECT stock FROM Productos WHERE id_producto = ?',
                    [producto.id_producto]
                );

                if (stockCheck.length > 0 && stockCheck[0].stock === 0) {
                    await db.query(
                        'DELETE FROM Productos WHERE id_producto = ?',
                        [producto.id_producto]
                    );
                }
            }
        }

        try {
            const idUsuario = req.session.user.id_usuario;
        
            console.log('Iniciando compra para usuario:', idUsuario);
        
            // Obtener los productos del carrito
            const [carrito] = await db.query(`
                SELECT 
                    p.id_producto, 
                    p.nombre_producto, 
                    p.precio AS precio_unitario, 
                    c.cantidad, 
                    p.stock 
                FROM Carrito c 
                JOIN Productos p ON c.id_producto = p.id_producto 
                WHERE c.id_usuario = ?
            `, [idUsuario]);
        
            console.log('Productos en el carrito:', carrito);
        
            if (carrito.length === 0) {
                console.log('El carrito está vacío.');
                return res.status(400).json({ message: 'El carrito está vacío.' });
            }
        
            // Verificar que todos los productos tienen suficiente stock
            for (const producto of carrito) {
                if (producto.cantidad > producto.stock) {
                    console.log(`Stock insuficiente para el producto: ${producto.nombre_producto}`);
                    return res.status(400).json({
                        message: `Stock insuficiente para el producto: ${producto.nombre_producto}. Stock disponible: ${producto.stock}.`
                    });
                }
            }
        
            console.log('Todos los productos tienen stock suficiente.');
        
            // Continuar con el flujo normal...
        } catch (err) {
            console.error('Error en la compra:', err.message, err.stack);
            res.status(500).json({ message: 'Error al procesar la compra.' });
        }
        

        // Vaciar carrito
        await db.query('DELETE FROM Carrito WHERE id_usuario = ?', [idUsuario]);

        res.status(200).json({ message: 'Compra realizada con éxito.' });
    } catch (err) {
        console.error('Error en la compra:', err.message, err.stack);
        res.status(500).json({ message: 'Error al procesar la compra.' });
    }
});


module.exports = router;
