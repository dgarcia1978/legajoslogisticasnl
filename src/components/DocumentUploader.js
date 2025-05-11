import React, { useState } from 'react';
import { uploadDocument } from '../mock/documents'; // Importar la función de subida simulada

const DocumentUploader = ({ documentType, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Solo se permiten archivos PDF o imágenes.');
      }
    } else {
      setFile(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Debe seleccionar un archivo para subir.');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const fileName = await uploadDocument(file, `${documentType}_${Date.now()}.${file.name.split('.').pop()}`);
      onUpload(fileName);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("Error al subir el documento.");
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium mb-2">Subir {documentType}</h4>
      <div className="flex items-center space-x-4">
        <label className="block w-full text-sm text-gray-500 cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden" // Ocultar el input por defecto
            accept=".pdf, image/*" // Limitar tipos de archivo permitidos
          />
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
            Seleccionar Archivo
          </span>
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>
      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Archivo seleccionado: <span className="font-medium">{file.name}</span>
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DocumentUploader;