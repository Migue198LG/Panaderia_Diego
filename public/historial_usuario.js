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

// Función para cargar el historial de compras
async function cargarHistorial() {
    const mensajeHistorial = document.getElementById('mensaje');
    const tablaBody = document.getElementById('tabla-body'); // ID corregido

    try {
        const respuesta = await fetch('/tickets/compras'); // URL corregida
        if (!respuesta.ok) throw new Error('Error al obtener el historial de compras.');

        const historial = await respuesta.json();

        if (!Array.isArray(historial) || historial.length === 0) {
            mensajeHistorial.textContent = 'No tienes compras registradas.';
            return;
        }

        // Limpia la tabla
        tablaBody.innerHTML = '';

        // Agrega las filas de la tabla
        historial.forEach((compra) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${compra.id_ticket}</td>
                <td>${new Date(compra.fecha_compra).toLocaleString()}</td>
                <td>$${parseFloat(compra.total_a_pagar).toFixed(2)}</td>
            `;
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar el historial de compras:', error);
        mensajeHistorial.textContent = 'Hubo un error al cargar el historial. Por favor, inténtalo más tarde.';
    }
}

// Verifica la sesión y carga el historial
document.addEventListener('DOMContentLoaded', async () => {
    const sesionActiva = await verificarSesion();
    if (!sesionActiva) {
        alert('Por favor, inicia sesión para acceder al historial de compras.');
        window.location.href = 'login.html';
        return;
    }

    cargarHistorial();
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
  
