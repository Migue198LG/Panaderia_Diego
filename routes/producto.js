const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear un producto
router.post("/crear", async (req, res) => {
  const { productName, productPrice, productStock, productImage } = req.body;

  if (!productName || !productPrice || !productStock) {
    return res.status(400).send("Nombre, precio y stock son obligatorios.");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO Productos (nombre_producto, precio, stock, imagen_url) VALUES (?, ?, ?, ?)",
      [productName, productPrice, productStock, productImage || null]
    );
    res.status(201).json({ message: "Producto creado exitosamente.", id: result.insertId });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).send("Error del servidor.");
  }
});

// Actualizar un producto
router.post("/actualizar", async (req, res) => {
  const { productId, productName, productPrice, productStock, productImage } = req.body;

  if (!productId) {
      return res.status(400).send("ID del producto es obligatorio.");
  }

  try {
      const [result] = await db.query(
          `UPDATE Productos 
           SET 
               nombre_producto = COALESCE(?, nombre_producto), 
               precio = COALESCE(?, precio), 
               stock = COALESCE(?, stock), 
               imagen_url = COALESCE(?, imagen_url) 
           WHERE id_producto = ?`,
          [
              productName || null, // Convertir cadenas vacías a NULL
              productPrice || null,
              productStock || null,
              productImage || null,
              productId,
          ]
      );

      if (result.affectedRows === 0) {
          return res.status(404).send("Producto no encontrado.");
      }

      res.status(200).send("Producto actualizado exitosamente.");
  } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).send("Error del servidor.");
  }
});


// Eliminar un producto
router.post("/eliminar", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).send("ID del producto es obligatorio.");
  }

  try {
    const [result] = await db.query("DELETE FROM Productos WHERE id_producto = ?", [productId]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Producto no encontrado.");
    }

    res.status(200).send("Producto eliminado exitosamente.");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error del servidor.");
  }
});

// Listar productos
router.get("/listar", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM Productos");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error del servidor.");
  }
});

module.exports = router;
