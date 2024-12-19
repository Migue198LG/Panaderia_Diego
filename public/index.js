// Verificar si el usuario está logueado
async function verificarSesion() {
  try {
    const respuesta = await fetch('/auth/usuario');
    if (!respuesta.ok) throw new Error('Usuario no autenticado.');
    return true;
  } catch {
    return false;
  }
}


// Carga y muestra los productos en la página principal
async function cargarProductos() {
  const contenedorProductos = document.querySelector('.productos');

  // Mensaje inicial mientras se cargan los productos
  contenedorProductos.innerHTML = '<p>Cargando productos...</p>';

  try {
    const respuesta = await fetch('/producto/listar');
    if (!respuesta.ok) throw new Error('Error al obtener los productos.');

    const productos = await respuesta.json();

    // Limpia el contenedor
    contenedorProductos.innerHTML = '';

    if (productos.length === 0) {
      contenedorProductos.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    productos.forEach((producto) => {
      const productoElemento = document.createElement('div');
      productoElemento.classList.add('producto');

      const precio = parseFloat(producto.precio) || 0;

      productoElemento.innerHTML = `
        <h3>${producto.nombre_producto}</h3>
        <img src="${producto.imagen_url}" alt="${producto.nombre_producto}" width="200">
        <p>Precio: $${precio.toFixed(2)}</p>
        <p>Stock: ${producto.stock}</p>
        <button onclick="agregarAlCarrito(${producto.id_producto})">Agregar al carrito</button>
      `;

      contenedorProductos.appendChild(productoElemento);
    });
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    contenedorProductos.innerHTML = '<p>Error al cargar los productos.</p>';
  }
}

// Función para agregar un producto al carrito
async function agregarAlCarrito(idProducto) {
  try {
    const sesionActiva = await verificarSesion();
    if (!sesionActiva) {
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      return;
    }

    const respuesta = await fetch('/carrito/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idProducto, cantidad: 1 }),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      throw new Error(error.message || 'No se pudo agregar al carrito.');
    }

    alert('Producto agregado al carrito.');
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    alert('Hubo un problema al intentar agregar el producto.');
  }
}

document.addEventListener('DOMContentLoaded', cargarProductos);

/*nieve*/
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

