import React, { useState } from 'react';
import DocumentUploader from './DocumentUploader';
import { isValidDateDDMMYYYY } from '../utils/validators';
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from '../utils/formatters';
import { getDocument } from '../mock/documents'; // Importar la función para obtener documento

const DocumentList = ({ documents, onDocumentUpdate }) => {
  const documentNames = {
    cedulaVerde: 'Cédula Verde',
    seguro: 'Póliza de Seguro',
    vtv: 'VTV',
    dni: 'DNI',
    art: 'ART',
    licencia: 'Licencia de Conducir'
  };

  const documentsWithExpiry = ['seguro', 'vtv', 'art', 'licencia'];

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate || expiryDate === 'Vencida') return 'expired';
    
    const today = new Date();
    const expiry = new Date(formatDateToYYYYMMDD(expiryDate));
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 10) return 'warning';
    return 'valid';
  };

  const [activeUpdate, setActiveUpdate] = useState(null); // State to manage which document is being updated
  const [expiryDates, setExpiryDates] = useState({});
  const [dateError, setDateError] = useState({});

  const handleUpdateClick = (docType) => {
    setActiveUpdate(activeUpdate === docType ? null : docType);
    setDateError({}); // Clear error when opening/closing
    if (documents[docType].expiry) {
      setExpiryDates({ ...expiryDates, [docType]: documents[docType].expiry });
    } else {
      setExpiryDates({ ...expiryDates, [docType]: '' });
    }
  };

  const handleUploadComplete = (docType, fileName) => {
    const expiry = expiryDates[docType] || ''; // Use the date from state, or empty string
    if (expiry && !isValidDateDDMMYYYY(expiry)) {
      setDateError({ ...dateError, [docType]: 'Formato de fecha inválido (DD/MM/YYYY)' });
      return;
    }
    onDocumentUpdate(docType, fileName, expiry);
    setActiveUpdate(null);
    setExpiryDates({});
    setDateError({});
  };

  const handleExpiryDateChange = (docType, date) => {
    setExpiryDates({
      ...expiryDates,
      [docType]: date
    });
    setDateError({ ...dateError, [docType]: '' });
  };

  const handleSaveExpiry = (docType, currentFile) => {
    const expiry = expiryDates[docType] || '';
    if (expiry && !isValidDateDDMMYYYY(expiry)) {
      setDateError({ ...dateError, [docType]: 'Formato de fecha inválido (DD/MM/YYYY)' });
      return;
    }
    onDocumentUpdate(docType, currentFile, expiry);
    setActiveUpdate(null);
    setExpiryDates({});
    setDateError({});
  };

  const handleViewDocument = (fileName) => {
    const documentData = getDocument(fileName);
    if (documentData) {
      // Abrir el documento en una nueva pestaña
      window.open(documentData, '_blank');
    } else {
      alert('Documento no encontrado.');
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {Object.entries(documents).map(([docType, doc]) => {
        const hasExpiry = documentsWithExpiry.includes(docType);
        const status = hasExpiry && doc.expiry ? getExpiryStatus(doc.expiry) : 'none';
        const hasFile = !!doc.file;

        return (
          <div key={docType} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{documentNames[docType] || docType}</h4>
              <button
                onClick={() => handleUpdateClick(docType)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {activeUpdate === docType ? 'Cancelar' : 'Actualizar'}
              </button>
            </div>
            
            {hasExpiry && (
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  status === 'expired' ? 'bg-red-500' : 
                  status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></span>
                <p className={`text-sm ${
                  status === 'expired' ? 'text-red-600' : 
                  status === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {doc.expiry ? (doc.expiry === 'Vencida' ? 'Vencido' : `Vence: ${doc.expiry}`) : 'Sin fecha de vencimiento'}
                </p>
              </div>
            )}

            <p className={`text-xs mt-1 ${hasFile ? 'text-green-600' : 'text-red-600'}`}>
              {hasFile ? 'Archivo cargado' : 'Archivo no cargado'}
            </p>
            
            {doc.file && (
              <button 
                onClick={() => handleViewDocument(doc.file)}
                className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors mt-2"
              >
                Ver documento
              </button>
            )}
            
            {activeUpdate === docType && (
               <div className="mt-4 space-y-3">
                 {hasExpiry && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Fecha de Vencimiento</label>
                     <input
                       type="date" 
                       value={expiryDates[docType] ? formatDateToYYYYMMDD(expiryDates[docType]) : ''}
                       onChange={(e) => handleExpiryDateChange(docType, formatDateToDDMMYYYY(e.target.value))}
                       className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${dateError[docType] ? 'border-red-500' : 'border-gray-300'}`}
                     />
                     {dateError[docType] && <p className="text-red-500 text-xs mt-1">{dateError[docType]}</p>}
                     <button
                       onClick={() => handleSaveExpiry(docType, doc.file)}
                       className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                       disabled={!!dateError[docType] || !expiryDates[docType]}
                     >
                       Guardar Fecha
                     </button>
                   </div>
                 )}
                 <DocumentUploader 
                   documentType={documentNames[docType] || docType}
                   onUpload={(fileName) => handleUploadComplete(docType, fileName)}
                 />
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DocumentList;

// DONE