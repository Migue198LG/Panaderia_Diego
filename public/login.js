document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const role = await response.text();
            if (role === 'Admin login') {
                window.location.href = '/admin_index.html';
            } else {
                window.location.href = '/index.html';
            }
        } else {
            alert(await response.text());
        }
    });
});

// Función de la nieve
function generarCopoDeNieve() {
    const copo = document.createElement('div');
    copo.classList.add('copo-nieve');

    copo.style.left = Math.random() * 100 + 'vw';
    copo.style.animationDuration = Math.random() * 3 + 2 + 's'; // Duración aleatoria entre 2 y 5 segundos
    copo.style.opacity = Math.random();
    copo.style.fontSize = Math.random() * 10 + 10 + 'px';

    copo.textContent = '❄';
    document.body.appendChild(copo);

    setTimeout(() => {
        copo.remove();
    }, 5000); // Elimina el copo después de 5 segundos
}

// Generar copos de nieve cada 300ms
setInterval(generarCopoDeNieve, 500);
