// Función para verificar si el usuario está logueado
async function verificarSesion() {
  try {
    const respuesta = await fetch('/auth/usuario');
    if (!respuesta.ok) throw new Error('Usuario no autenticado.');
    return true;
  } catch {
    return false;
  }
}

// Función para cargar los productos del carrito
async function cargarCarrito() {
  const contenedorCarrito = document.querySelector('.carrito-contenedor');
  const totalPrecioElemento = document.getElementById('total-precio');
  const botonComprar = document.getElementById('comprar-btn');

  try {
    const respuesta = await fetch('/carrito/listar');
    if (!respuesta.ok) throw new Error('Error al obtener los productos del carrito.');

    const carrito = await respuesta.json();

    // Limpia el contenedor
    contenedorCarrito.innerHTML = '';
    let totalPrecio = 0;

    if (carrito.length === 0) {
      contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
      totalPrecioElemento.textContent = '0.00';
      return;
    }

    carrito.forEach((producto) => {
      const productoElemento = document.createElement('div');
      productoElemento.classList.add('producto-carrito');

      const precio = parseFloat(producto.precio_unitario) || 0;
      totalPrecio += precio * producto.cantidad;

      productoElemento.innerHTML = `
        <h3>${producto.nombre_producto}</h3>
        <img src="${producto.imagen_url}" alt="${producto.nombre_producto}" width="100">
        <p>Precio Unitario: $${precio.toFixed(2)}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        <p>Subtotal: $${(precio * producto.cantidad).toFixed(2)}</p>
        <button onclick="quitarDelCarrito(${producto.id_producto})">Quitar</button>
        <button onclick="aumentarCantidad(${producto.id_producto})">Añadir Unidad</button>
      `;

      contenedorCarrito.appendChild(productoElemento);
    });

    totalPrecioElemento.textContent = totalPrecio.toFixed(2);

    // Habilitar el botón de compra
    botonComprar.disabled = false;

  } catch (error) {
    console.error('Error al cargar el carrito:', error);
    contenedorCarrito.innerHTML = '<p>Error al cargar el carrito.</p>';

    // Deshabilitar el botón de compra en caso de error
    botonComprar.disabled = true;
  }
}

// Función para comprar los productos del carrito
async function comprarProductos() {
    try {
        const respuesta = await fetch('/carrito/comprar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            console.error('Error recibido del servidor:', resultado);
            throw new Error(resultado.message || 'No se pudo completar la compra.');
        }

        alert(resultado.message); // Mostrar mensaje de éxito
        cargarCarrito(); // Recargar el carrito para reflejar que está vacío

    } catch (error) {
        console.error('Error al realizar la compra:', error);
        alert(error.message || 'Hubo un problema al intentar realizar la compra.');
    }
}


// Función para quitar un producto del carrito
async function quitarDelCarrito(idProducto) {
  try {
    const respuesta = await fetch('/carrito/quitar', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idProducto }),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      throw new Error(error.message || 'No se pudo quitar el producto del carrito.');
    }

    alert('Producto eliminado del carrito.');
    cargarCarrito(); // Recargar el carrito
  } catch (error) {
    console.error('Error al quitar producto del carrito:', error);
    alert('Hubo un problema al intentar quitar el producto.');
  }
}

// Función para aumentar la cantidad de un producto en el carrito
async function aumentarCantidad(idProducto) {
  try {
    const respuesta = await fetch('/carrito/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idProducto, cantidad: 1 }),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      throw new Error(error.message || 'No se pudo aumentar la cantidad del producto.');
    }

    alert('Unidad añadida al producto.');
    cargarCarrito(); // Recargar el carrito
  } catch (error) {
    console.error('Error al aumentar cantidad del producto:', error);
    alert('Hubo un problema al intentar añadir la unidad.');
  }
}

// Verifica la sesión y carga el carrito
document.addEventListener('DOMContentLoaded', async () => {
  const sesionActiva = await verificarSesion();
  if (!sesionActiva) {
    alert('Por favor, inicia sesión para acceder al carrito.');
    window.location.href = 'login.html'; // Redirige al login
    return;
  }

  const botonComprar = document.getElementById('comprar-btn');
  botonComprar.addEventListener('click', comprarProductos);
  cargarCarrito();
});

// Función de la nieve
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'copo-nieve';
    snowflake.style.position = 'fixed'; // Aseguramos que sea absoluto respecto al viewport
    snowflake.style.top = '-50px'; // Siempre inicia fuera del viewport
    snowflake.style.left = Math.random() * 100 + 'vw'; // Posición horizontal aleatoria
    snowflake.style.animationDuration = Math.random() * 5 + 5 + 's'; // Duración más larga para caída lenta
    snowflake.style.opacity = Math.random() * 0.8 + 0.2; // Transparencia entre 0.2 y 1
    snowflake.style.fontSize = Math.random() * 10 + 15 + 'px'; // Tamaño entre 15px y 25px
    snowflake.textContent = '❄'; // Copo de nieve

    body.appendChild(snowflake);

    setTimeout(() => {
      snowflake.remove();
    }, 10000); // Tiempo suficiente para eliminar los copos que ya cayeron
  }

  setInterval(createSnowflake, 500); // Frecuencia moderada de aparición
});

