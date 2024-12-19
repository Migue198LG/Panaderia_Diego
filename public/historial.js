// Función para cargar el historial de compras de un usuario específico
async function cargarHistorial(idUsuario) {
    const mensajeHistorial = document.getElementById('mensaje');
    const tablaBody = document.getElementById('tabla-body');

    try {
        const respuesta = await fetch('/historial/consultar', {
            method: 'POST', // Usamos POST para enviar el ID del usuario
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario }),
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.message || 'Error al obtener el historial de compras.');
        }

        const historial = await respuesta.json();

        if (!Array.isArray(historial) || historial.length === 0) {
            mensajeHistorial.textContent = `No se encontraron compras para el usuario con ID: ${idUsuario}.`;
            tablaBody.innerHTML = ''; // Limpia la tabla
            return;
        }

        // Limpia la tabla antes de llenarla
        tablaBody.innerHTML = '';

        // Agrega las filas de la tabla con los datos obtenidos
        historial.forEach((compra) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${compra.id_ticket}</td>
                <td>${new Date(compra.fecha_compra).toLocaleString()}</td>
                <td>$${parseFloat(compra.total_a_pagar).toFixed(2)}</td>
            `;
            tablaBody.appendChild(fila);
        });

        mensajeHistorial.textContent = ''; // Limpia el mensaje de error si había
    } catch (error) {
        console.error('Error al cargar el historial de compras:', error);
        mensajeHistorial.textContent = error.message || 'Hubo un error al cargar el historial. Por favor, inténtalo más tarde.';
    }
}

// Listener para el botón de consulta
document.getElementById('consultar-historial').addEventListener('click', () => {
    const usuarioId = document.getElementById('usuario-id').value.trim();
    if (!usuarioId) {
        alert('Por favor, introduce un ID de usuario válido.');
        return;
    }

    cargarHistorial(usuarioId); // Llamada a la función con el ID del usuario
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
  
