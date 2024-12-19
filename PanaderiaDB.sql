-- Reinicia la base de datos
/*DROP DATABASE panaderia;*/
CREATE DATABASE panaderia;
USE panaderia;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- Encriptación recomendada
    rol ENUM('usuario', 'admin') DEFAULT 'usuario' NOT NULL, -- Rol del usuario
    fondos DECIMAL(13, 2) NOT NULL DEFAULT 0.00, -- Fondos del usuario
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL, -- Cantidad disponible
    imagen_url VARCHAR(255), -- URL de imagen del producto
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Carrito de Compras
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);



-- Tabla de Tickets (Historial de Compras)
CREATE TABLE Tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_a_pagar DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Detalle de Productos Comprados (Relación de Productos con Tickets)
CREATE TABLE DetalleProductos (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_ticket) REFERENCES Tickets(id_ticket) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

-- Historial de Movimientos de Fondos
CREATE TABLE HistorialFondos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cambio_saldo DECIMAL(13, 2) NOT NULL, -- Cambio positivo o negativo en fondos
    saldo_final DECIMAL(13, 2) NOT NULL, -- Fondos tras la operación
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);


SELECT * FROM Usuarios;
SELECT * FROM Productos;
SELECT * FROM Carrito;
SELECT * FROM Tickets;
SELECT * FROM DetalleProductos;

-- Ingresando un usuario administrador

USE panaderia;

INSERT INTO Usuarios (nombre_usuario, correo, contrasena, rol, fondos)
VALUES ('admin', 'admin@correo.com', '$2b$10$bJikwNVmSZljKz.MFWzrYevE.3Pqz6w2lYMGfaGt5ymnsAeExeCE6', 'admin', 0.00);