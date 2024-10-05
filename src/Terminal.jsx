import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Terminal = () => {
  const [salida, setSalida] = useState(['Inicializando terminal...']);
  const [directorioActual, setDirectorioActual] = useState('');
  const [error, setError] = useState(null);
  const refEntrada = useRef(null);
  const API_URL = 'http://localhost:3001'; // Ajusta esto según tu configuración
  const apipwsh = 'http://localhost:3000';
  useEffect(() => {
    obtenerDirectorioActual();
  }, []);

  const obtenerDirectorioActual = async () => {
    try {
      const respuesta = await axios.post(`${apipwsh}/api/powershell`, { comando: 'Get-Location' });
      setDirectorioActual(respuesta.data.salida.trim());
      setSalida(prev => [...prev, `PS ${respuesta.data.salida.trim()}> `]);
    } catch (error) {
      console.error('Error al obtener el directorio actual:', error);
      setError(`No se pudo conectar con el servidor. Error: ${error.message}`);
    }
  };

  const manejarComando = async (comando) => {
    const nuevaSalida = [...salida, `PS ${directorioActual}> ${comando}`];
    setSalida(nuevaSalida);

    try {
      const respuesta = await axios.post(`${apipwsh}/api/powershell`, { comando });
      setSalida(prev => [...prev, respuesta.data.salida, '', `PS ${directorioActual}> `]);

      if (comando.toLowerCase().startsWith('cd ')) {
        obtenerDirectorioActual();
      }
    } catch (error) {
      console.error('Error al ejecutar el comando:', error);
      setSalida(prev => [...prev, `Error al ejecutar el comando: ${error.message}`, '', `PS ${directorioActual}> `]);
    }
  };

  return (
    <div className="bg-[#012456] text-white p-4 font-mono h-64 overflow-y-auto">
      {error && <div className="text-red-500">{error}</div>}
      {salida.map((linea, indice) => (
        <div key={indice}>{linea}</div>
      ))}
      <input
        ref={refEntrada}
        type="text"
        className="bg-[#012456] text-white w-full outline-none"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            manejarComando(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default Terminal;