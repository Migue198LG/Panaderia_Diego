const bcrypt = require('bcrypt');

(async () => {
    const password = 'admin12345'; // Cambia esta contraseña por la que prefieras
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword);
})();
