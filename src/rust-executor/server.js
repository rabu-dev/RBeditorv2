// server.js
const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/execute', async (req, res) => {
  const { code } = req.body;
  const fileName = 'temp.rs';
  const filePath = path.join(__dirname, fileName);

  console.log('Código recibido:', code);
  console.log('Sistema operativo:', os.platform());
  console.log('Directorio actual:', __dirname);

  try {
    // Verificar la instalación de Rust
    try {
      const rustcVersion = execSync('rustc --version', { encoding: 'utf8' });
      console.log('Versión de Rust:', rustcVersion);
    } catch (rustError) {
      console.error('Error al verificar la instalación de Rust:', rustError);
      res.json({ error: 'Rust no está instalado o no está en el PATH del sistema.' });
      return;
    }

    await fs.writeFile(filePath, code);
    console.log('Archivo temporal creado:', filePath);

    const isWindows = os.platform() === 'win32';
    const executableName = isWindows ? 'temp.exe' : './temp';
    const compileCommand = `rustc "${fileName}" -o "${executableName}"`;
    const runCommand = isWindows ? `"${executableName}"` : `./${executableName}`;

    console.log('Comando de compilación:', compileCommand);

    exec(compileCommand, { cwd: __dirname }, (compileError, compileStdout, compileStderr) => {
      console.log('Resultado de compilación:', { compileError, compileStdout, compileStderr });

      if (compileError) {
        res.json({ error: `Error de compilación: ${compileError.message}` });
        return;
      }
      if (compileStderr) {
        res.json({ error: `Error de compilación: ${compileStderr}` });
        return;
      }

      console.log('Comando de ejecución:', runCommand);

      exec(runCommand, { cwd: __dirname }, (runError, runStdout, runStderr) => {
        console.log('Resultado de ejecución:', { runError, runStdout, runStderr });

        if (runError) {
          res.json({ error: `Error de ejecución: ${runError.message}` });
        } else if (runStderr) {
          res.json({ error: `Error de ejecución: ${runStderr}` });
        } else {
          res.json({ output: runStdout });
        }

        // Eliminar archivos temporales
        fs.unlink(filePath).catch(err => console.error('Error al eliminar archivo temporal:', err));
        fs.unlink(path.join(__dirname, executableName)).catch(err => console.error('Error al eliminar ejecutable:', err));
      });
    });
  } catch (error) {
    console.error('Error del servidor:', error);
    res.status(500).json({ error: `Error del servidor: ${error.message}` });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
   