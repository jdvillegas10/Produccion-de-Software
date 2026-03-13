// Lift & Shift: servir un sitio estático existente con Express

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Servir todos los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'activity')));

// Ruta raíz: devolver index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'activity', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Sitio levantado en http://localhost:${port}`);
});