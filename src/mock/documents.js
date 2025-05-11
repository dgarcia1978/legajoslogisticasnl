// En un proyecto real, aquí no habría datos, solo funciones para interactuar con el almacenamiento.
// Para esta simulación, usaremos localStorage.

// Función para simular la subida de un archivo y guardarlo en localStorage
export const uploadDocument = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      const storedDocuments = getStorage('documents', {});
      storedDocuments[fileName] = base64data;
      setStorage('documents', storedDocuments);
      resolve(fileName);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Función para simular la obtención de un documento de localStorage
export const getDocument = (fileName) => {
  const storedDocuments = getStorage('documents', {});
  return storedDocuments[fileName] || null;
};

// Helper para obtener todos los documentos almacenados (para simulación)
export const getAllDocuments = () => {
  return getStorage('documents', {});
};

import { getStorage, setStorage } from '../utils/storage';