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