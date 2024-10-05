const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:1420' // Ajusta esto a la URL de tu aplicación React
}));
app.use(express.json());

app.post('/api/powershell', (req, res) => {
  const { comando } = req.body;
  exec(`powershell -Command "${comando}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error de ejecución: ${error}`);
      return res.status(500).json({ error: 'Error al ejecutar el comando' });
    }
    res.json({ salida: stdout || stderr });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor1 escuchando  en el puerto ${PORT}`));