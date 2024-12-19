// Obtener y mostrar los fondos del usuario
async function obtenerFondos() {
    try {
        const response = await fetch('/fondos/get', { // Cambiar a /fondos/get
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Depuración

            // Asegurarnos de que fondos sea un número antes de usar toFixed()
            if (typeof data.fondos === 'number') {
                document.getElementById('fondos-usuario').innerText = `$${data.fondos.toFixed(2)}`;
            } else {
                console.error('Fondos no es un número:', data.fondos);
                document.getElementById('fondos-usuario').innerText = 'Error: Fondos inválidos.';
            }
        } else if (response.status === 401) {
            document.getElementById('fondos-usuario').innerText = 'Usuario no autenticado.';
        } else {
            document.getElementById('fondos-usuario').innerText = 'Error al obtener fondos.';
        }
    } catch (error) {
        console.error('Error al obtener fondos:', error);
        document.getElementById('fondos-usuario').innerText = 'Error al obtener fondos.';
    }
}

// Agregar fondos al usuario
document.getElementById('fondos-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const regesxs = /^[0-9]+$/;


    console.log('Cantidad enviada al servidor:', amount); // Depuración

    if (amount <= 0) {
        document.getElementById('mensaje').innerText = 'La cantidad debe ser mayor a 0.';
        return;
    }

    try {
        const response = await fetch('/fondos/add', { // Cambiar a /fondos/add
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ amount }),
        });

        if (response.ok) {
            document.getElementById('mensaje').innerText = 'Fondos agregados correctamente.';
            obtenerFondos();
        } else {
            const data = await response.json();
            document.getElementById('mensaje').innerText = data.error || 'Error al agregar fondos.';
        }
    } catch (error) {
        console.error('Error al agregar fondos:', error);
        document.getElementById('mensaje').innerText = 'Error al agregar fondos.';
    }
});

// Cargar los fondos al cargar la página
obtenerFondos();

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
