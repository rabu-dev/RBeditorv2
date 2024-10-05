import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import CodeEditor from './CodeEditor';
import Navbar from './Navbar';
import Terminal from './Terminal';
import axios from 'axios';

const App = () => {
  const [code, setCode] = useState('// Escribe tu código aquí');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    listFiles();
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const executeCode = () => {
    setOutput('');
    setError('');

    if (language === 'javascript') {
      try {
        const func = new Function(code);
        const result = func();
        setOutput(String(result));
      } catch (error) {
        setError(`Error de JavaScript: ${error.message}`);
      }
    } else if (language === 'rust') {
      fetch('http://localhost:3001/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(response => {
          console.log('Respuesta del servidor:', response);
          return response.text();
        })
        .then(result => {
          console.log('Resultado del servidor:', result);
          try {
            const jsonResult = JSON.parse(result);
            if (jsonResult.error) {
              setError(`Error de Rust: ${jsonResult.error}`);
            } else {
              setOutput(jsonResult.output);
            }
          } catch (parseError) {
            setError(`Error del servidor (respuesta no válida): ${result}`);
          }
        })
        .catch(error => {
          console.error('Error de red:', error);
          setError(`Error de red: ${error.message}`);
        });
    }
  };

  const saveFile = async () => {
    try {
      await axios.post('http://localhost:3002/api/save', { filename, content: code });
      alert('Archivo guardado exitosamente');
      listFiles();
    } catch (error) {
      setError(`Error al guardar el archivo: ${error.message}`);
    }
  };

  const openFile = async (selectedFilename) => {
    try {
      const response = await axios.get(`http://localhost:3002/api/open?filename=${selectedFilename}`);
      setCode(response.data.content);
      setFilename(selectedFilename);
      const editor = document.querySelector('.editor');
      editor.value = response.data.content;
    } catch (error) {
      setError(`Error al abrir el archivo: ${error.message}`);
    }
  };

  const listFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/list');
      setFiles(response.data.files);
    } catch (error) {
      setError(`Error al listar los archivos: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar openFile={openFile} />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Editor de Código</h1>
        <div className="flex flex-col flex-1">
          <div className="flex mb-4">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Nombre del archivo"
              className="mr-2 p-2 rounded"
            />
            <button onClick={saveFile} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2">
              Guardar
            </button>
            <select onChange={(e) => openFile(e.target.value)} className="p-2 rounded">
              <option value="">Seleccionar archivo</option>
              {files.map(file => (
                <option key={file} value={file}>{file}</option>
              ))}
            </select>
          </div>
          <div className="flex mb-4">
            <div className="w-full">
              <CodeEditor 
                code={code} 
                onCodeChange={handleCodeChange} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <button 
              onClick={executeCode}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Ejecutar
            </button>
          </div>
          {error && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-red-500">Error:</h2>
              <pre className="bg-red-200 text-red-800 p-4 rounded-md">{error}</pre>
            </div>
          )}
          {output && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-green-500">Salida:</h2>
              <pre className="bg-green-200 text-green-800 p-4 rounded-md">{output}</pre>
            </div>
          )}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2 text-white">Terminal:</h2>
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;