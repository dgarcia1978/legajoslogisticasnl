import React, { useState, useEffect } from 'react';
import DocumentUploader from './DocumentUploader';
import { isValidDateDDMMYYYY } from '../utils/validators';
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from '../utils/formatters';
import { getDocument } from '../mock/documents'; // Importar la función para obtener documento
import { getStorage } from '../utils/storage'; // Importar getStorage

const DocumentList = ({ documents, onDocumentUpdate, itemType }) => { // Recibir itemType
  const [documentTypesConfig, setDocumentTypesConfig] = useState([]);

  useEffect(() => {
    // Cargar tipos de documento desde localStorage al iniciar según el tipo de item
    const storageKey = itemType === 'vehicle' ? 'vehicleDocumentTypes' : 'driverDocumentTypes';
    const defaultTypes = itemType === 'vehicle' ? [
      { name: 'Cedula Verde', hasExpiry: false },
      { name: 'VTV', hasExpiry: true },
      { name: 'Poliza de Seguro', hasExpiry: true },
    ] : [
      { name: 'DNI', hasExpiry: false },
      { name: 'Licencia de Conducir', hasExpiry: true },
      { name: 'ART / Seguro Acc.Pers', hasExpiry: true },
    ];
    const storedTypes = getStorage(storageKey, defaultTypes);
    setDocumentTypesConfig(storedTypes);
  }, [itemType]); // Dependencia para recargar si cambia el tipo de item

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

  const handleUpdateClick = (docName) => {
    setActiveUpdate(activeUpdate === docName ? null : docName);
    setDateError({}); // Clear error when opening/closing
    const docKey = documentTypesConfig.find(doc => doc.name === docName)?.name; // Find the technical name
    if (docKey && documents[docKey] && documents[docKey].expiry) {
      setExpiryDates({ ...expiryDates, [docName]: documents[docKey].expiry });
    } else {
      setExpiryDates({ ...expiryDates, [docName]: '' });
    }
  };

  const handleUploadComplete = (docName, fileName) => {
    const expiry = expiryDates[docName] || ''; // Use the date from state, or empty string
    if (expiry && !isValidDateDDMMYYYY(expiry)) {
      setDateError({ ...dateError, [docName]: 'Formato de fecha inválido (DD/MM/YYYY)' });
      return;
    }
    const docKey = documentTypesConfig.find(doc => doc.name === docName)?.name; // Find the technical name
    if (docKey) {
      onDocumentUpdate(docKey, fileName, expiry);
    }
    setActiveUpdate(null);
    setExpiryDates({});
    setDateError({});
  };

  const handleExpiryDateChange = (docName, date) => {
    setExpiryDates({
      ...expiryDates,
      [docName]: date
    });
    setDateError({ ...dateError, [docName]: '' });
  };

  const handleSaveExpiry = (docName, currentFile) => {
    const expiry = expiryDates[docName] || '';
    if (expiry && !isValidDateDDMMYYYY(expiry)) {
      setDateError({ ...dateError, [docName]: 'Formato de fecha inválido (DD/MM/YYYY)' });
      return;
    }
    const docKey = documentTypesConfig.find(doc => doc.name === docName)?.name; // Find the technical name
     if (docKey) {
      onDocumentUpdate(docKey, currentFile, expiry);
    }
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
      {documentTypesConfig.map(docTypeConfig => {
        const docName = docTypeConfig.name;
        const doc = documents[docName] || { file: '', expiry: '' }; // Get document data, default if not exists
        const hasExpiry = docTypeConfig.hasExpiry;
        const status = hasExpiry && doc.expiry ? getExpiryStatus(doc.expiry) : 'none';
        const hasFile = !!doc.file;

        return (
          <div key={docName} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{docName}</h4>
              <button
                onClick={() => handleUpdateClick(docName)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {activeUpdate === docName ? 'Cancelar' : 'Actualizar'}
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
                className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors mt-2 shadow-sm"
              >
                Ver documento
              </button>
            )}
            
            {activeUpdate === docName && (
               <div className="mt-4 space-y-3">
                 {hasExpiry && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Fecha de Vencimiento</label>
                     <input
                       type="date" 
                       value={expiryDates[docName] ? formatDateToYYYYMMDD(expiryDates[docName]) : ''}
                       onChange={(e) => handleExpiryDateChange(docName, formatDateToDDMMYYYY(e.target.value))}
                       className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${dateError[docName] ? 'border-red-500' : 'border-gray-300'}`}
                     />
                     {dateError[docName] && <p className="text-red-500 text-xs mt-1">{dateError[docName]}</p>}
                     <button
                       onClick={() => handleSaveExpiry(docName, doc.file)}
                       className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                       disabled={!!dateError[docName] || !expiryDates[docName]}
                     >
                       Guardar Fecha
                     </button>
                   </div>
                 )}
                 <DocumentUploader 
                   documentType={docName}
                   onUpload={(fileName) => handleUploadComplete(docName, fileName)}
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