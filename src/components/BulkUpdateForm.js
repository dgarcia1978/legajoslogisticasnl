import React, { useState } from 'react';
import DocumentUploader from './DocumentUploader';
import { isValidDateDDMMYYYY } from '../utils/validators';
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from '../utils/formatters';
import { uploadDocument } from '../mock/documents'; // Importar la función de subida simulada

const BulkUpdateForm = ({ selectedItems, documentType, onBulkUpdate, onCancel }) => {
  const [file, setFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState(''); // Estado para el error del archivo

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
        setFile(selectedFile);
        setFileError('');
      } else {
        setFile(null);
        setFileError('Solo se permiten archivos PDF o imágenes.');
      }
    } else {
      setFile(null);
      setFileError('');
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    const formattedDate = formatDateToDDMMYYYY(date); // Formatear la fecha del input type="date"
    setExpiryDate(formattedDate);
    if (formattedDate && !isValidDateDDMMYYYY(formattedDate)) {
      setDateError('Formato de fecha inválido (DD/MM/YYYY)');
    } else {
      setDateError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setFileError('Debe subir un documento.');
      return;
    }
    if (!expiryDate) {
      setDateError('Debe ingresar una fecha de vencimiento.');
      return;
    }
    if (expiryDate && !isValidDateDDMMYYYY(expiryDate)) {
      setDateError('Formato de fecha inválido (DD/MM/YYYY)');
      return;
    }

    setIsUploading(true);
    setDateError('');
    setFileError('');

    try {
      const fileName = await uploadDocument(file, `${documentType}_bulk_${Date.now()}.${file.name.split('.').pop()}`);
      onBulkUpdate(selectedItems, documentType, fileName, expiryDate);
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("Error al subir el documento.");
    } finally {
      setIsUploading(false);
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Actualización Masiva: {documentType}</h3>
      <p className="text-sm text-gray-600 mb-4">Aplicando a {selectedItems.length} elementos.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subir Nuevo Documento</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 transition-colors"
            accept=".pdf, image/*"
            required
          />
           {fileError && <p className="text-red-600 text-xs mt-1">{fileError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Fecha de Vencimiento</label>
          <input
            type="date"
            value={expiryDate ? formatDateToYYYYMMDD(expiryDate) : ''}
            onChange={handleDateChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${dateError ? 'border-red-600' : 'border-gray-300'}`}
            required
          />
          {dateError && <p className="text-red-600 text-xs mt-1">{dateError}</p>}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isUploading || !file || !expiryDate || dateError || fileError}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors uppercase tracking-wide shadow-md"
          >
            {isUploading ? 'Actualizando...' : 'Aplicar Actualización'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors uppercase tracking-wide shadow-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateForm;