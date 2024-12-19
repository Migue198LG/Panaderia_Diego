// Manejo del formulario para agregar productos
document.getElementById('formAgregarProducto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const productName = document.getElementById('productNameAgregar').value;
  const productPrice = document.getElementById('productPriceAgregar').value;
  const productStock = document.getElementById('productStockAgregar').value;
  const productImage = document.getElementById('productImageAgregar').value;

  try {
    const response = await fetch('/producto/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, productPrice, productStock, productImage }),
    });

    if (!response.ok) {
      throw new Error('Error al agregar el producto');
    }

    alert('Producto agregado exitosamente');
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error');
  }
});

// Manejo del formulario para actualizar productos
document.getElementById('formActualizarProducto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const productId = document.getElementById('productIdActualizar').value;
  const productName = document.getElementById('productNameActualizar').value;
  const productPrice = document.getElementById('productPriceActualizar').value;
  const productStock = document.getElementById('productStockActualizar').value;
  const productImage = document.getElementById('productImageActualizar').value;

  try {
    const response = await fetch('/producto/actualizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, productName, productPrice, productStock, productImage }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }

    alert('Producto actualizado exitosamente');
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error');
  }
});


  
  // Manejo del formulario para eliminar productos
document.getElementById('formEliminarProducto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const productId = document.getElementById('productIdEliminar').value;

  try {
    const response = await fetch(`/producto/eliminar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }

    alert('Producto eliminado exitosamente');
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error');
  }
});

  
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
  
  
  