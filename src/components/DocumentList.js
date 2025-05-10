import React, { useState } from 'react';
import DocumentUploader from './DocumentUploader';

const DocumentList = ({ documents, onDocumentUpdate }) => {
  const documentNames = {
    cedulaVerde: 'Cédula Verde',
    seguro: 'Póliza de Seguro',
    vtv: 'VTV',
    dni: 'DNI',
    art: 'ART',
    licencia: 'Licencia de Conducir'
  };

  const getExpiryStatus = (expiryDate) => {
    if (expiryDate === 'Vencida') return 'expired';
    
    const today = new Date();
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 10) return 'warning';
    return 'valid';
  };

  const [activeUploader, setActiveUploader] = useState(null);

  const handleUploadComplete = (docType, fileName) => {
    onDocumentUpdate(docType, fileName);
    setActiveUploader(null);
  };

  return (
    <div className="mt-4 space-y-3">
      {Object.entries(documents).map(([docType, doc]) => (
        <div key={docType} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{documentNames[docType] || docType}</h4>
            <button
              onClick={() => setActiveUploader(activeUploader === docType ? null : docType)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {activeUploader === docType ? 'Cancelar' : 'Actualizar'}
            </button>
          </div>
          
          {doc.expiry && (
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                getExpiryStatus(doc.expiry) === 'expired' ? 'bg-red-500' : 
                getExpiryStatus(doc.expiry) === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></span>
              <p className={`text-sm ${
                getExpiryStatus(doc.expiry) === 'expired' ? 'text-red-600' : 
                getExpiryStatus(doc.expiry) === 'warning' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {doc.expiry === 'Vencida' ? 'Vencido' : `Vence: ${doc.expiry}`}
              </p>
            </div>
          )}
          
          {doc.file && (
            <a 
              href={`/docs/${doc.file}`} 
              className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver documento
            </a>
          )}
          
          {activeUploader === docType && (
            <DocumentUploader 
              documentType={documentNames[docType] || docType}
              onUpload={(fileName) => handleUploadComplete(docType, fileName)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentList;