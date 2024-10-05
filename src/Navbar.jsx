import React from 'react';
import { Menu } from '@headlessui/react';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution';
import axios from 'axios';

const Navbar = ({ openFile }) => {
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:3002/api/save', { filename, content: code });
      alert('Archivo guardado exitosamente');

    } catch (error) {
      setError(`Error al guardar el archivo: ${error.message}`);
    }
  };

  const openTerminal = () => {
    console.log('Abrir terminal');
    // Aquí puedes implementar la lógica para abrir una terminal
    // Por ejemplo, podrías usar una librería como `node-pty` si estás en un entorno Node.js
  };

  const handleCopy = () => {
  
  }

  const handleOpenFile = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.rs,.txt,.js,.jsx,.ts,.tsx,.html,.css,.java,.py';
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      const text = await file.text();
      console.log(text);
  
      // Set the value of the CodeEditor to the file content
      monaco.editor.getModels()[0].setValue(text);
    };
    fileInput.click();
  };
  return (
    <nav className="bg-gray-800 p-2 flex">
      <Menu as="div" className="relative mr-4">
        <Menu.Button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
          Archivo
        </Menu.Button>
        <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSave}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                Guardar
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleOpenFile}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                Abrir
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSave}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                Copiar
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      <Menu as="div" className="relative">
        <Menu.Button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
          Terminal
        </Menu.Button>
        <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={openTerminal}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                Nuevo terminal
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Menu as="div" className="relative">
        <Menu.Button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
          Ajustes
        </Menu.Button>
        <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <Menu.Item>
            {({ active }) => (
              <button
                
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                Atajos / Snipets
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                Themes
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
      {/* Añadir más opciones de menú según sea necesario */}

    </nav>  );
};

export default Navbar;