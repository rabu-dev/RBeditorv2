const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(cors({
  origin: 'http://localhost:1420'
}));
app.use(express.json());

// Directorio donde se guardarán los archivos
const FILES_DIR = path.join(__dirname, 'files');

// Asegurarse de que el directorio existe
fs.mkdir(FILES_DIR, { recursive: true }).catch(console.error);

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

// Guardar archivo
app.post('/api/save', async (req, res) => {
  const { filename, content } = req.body;
  try {
    await fs.writeFile(path.join(FILES_DIR, filename), content);
    res.json({ message: 'Archivo guardado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el archivo' });
  }
});

// Abrir archivo
app.get('/api/open', async (req, res) => {
  const { filename } = req.query;
  try {
    const content = await fs.readFile(path.join(FILES_DIR, filename), 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Error al abrir el archivo' });
  }
});

// Listar archivos
app.get('/api/list', async (req, res) => {
  try {
    const files = await fs.readdir(FILES_DIR);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los archivos' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));