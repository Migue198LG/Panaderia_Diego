// Seleccionamos el botón de cierre de sesión
const logoutButton = document.getElementById('buttonLogout');

// Agregamos un evento de clic al botón
logoutButton.addEventListener('click', async () => {
    try {
        // Verificar si hay una sesión activa
        const sessionResponse = await fetch('/auth/usuario', { credentials: 'include' });

        if (sessionResponse.status === 401) {
            // No hay sesión activa
            alert("No hay ninguna sesión iniciada para cerrar.");
            return;
        }

        // Si hay sesión activa, procedemos a cerrarla
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include', // Incluye cookies en la solicitud
        });

        if (response.ok) {
            // Redirigimos al usuario al index.html
            alert("Has cerrado sesión.");
            window.location.href = '/index.html';
        } else {
            console.error('Error al cerrar sesión:', await response.text());
            alert('Hubo un problema al intentar cerrar la sesión.');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert('No se pudo cerrar la sesión. Intenta nuevamente.');
    }
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
