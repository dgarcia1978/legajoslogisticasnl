import React, { useState } from 'react';

const DocumentUploader = ({ documentType, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    // Simulamos una subida de archivo
    setTimeout(() => {
      const fileName = `${documentType}_${Date.now()}.${file.name.split('.').pop()}`;
      onUpload(fileName);
      setIsUploading(false);
      setFile(null);
    }, 1500);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium mb-2">Subir {documentType}</h4>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-white file:text-gray-700
            hover:file:bg-gray-100"
        />
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
    </div>
  );
};

export default DocumentUploader;