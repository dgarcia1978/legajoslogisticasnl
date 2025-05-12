import React, { useState, useEffect } from 'react';
import DocumentList from './DocumentList';
import VehicleDataForm from './VehicleDataForm';
import { formatDateToYYYYMMDD } from '../utils/formatters';
import { getStorage } from '../utils/storage';

const VehicleCard = ({ vehicle, onDocumentUpdate, onDelete, onUpdateVehicle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);
  const [cardStatus, setCardStatus] = useState('green'); // Default status

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

  useEffect(() => {
    let status = 'green';
    const vehicleDocumentTypes = getStorage('vehicleDocumentTypes', []);

    for (const docTypeConfig of vehicleDocumentTypes) {
      const doc = vehicle.documents[docTypeConfig.name] || { file: '', expiry: '', active: true };
      const hasExpiry = docTypeConfig.hasExpiry;
      const hasFile = !!doc.file;
      const isActive = doc.active !== undefined ? doc.active : true;

      if (isActive) { // Only check status if the document is active for tracking
        if (!hasFile) {
          status = 'red';
          break; // If any active document is missing a file, the card is red
        }

        if (hasExpiry) {
          const expiryStatus = getExpiryStatus(doc.expiry);
          if (expiryStatus === 'expired') {
            status = 'red';
            break; // If any active expiring document is expired, the card is red
          }
          if (expiryStatus === 'warning') {
            if (status !== 'red') { // Don't override red status
              status = 'yellow'; // If any active expiring document is warning, the card is yellow
            }
          }
        }
      }
    }
    setCardStatus(status);

  }, [vehicle.documents]); // Recalculate status when vehicle documents change

  const statusBorderColor = {
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    green: 'border-green-600',
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 text-gray-800 hover:shadow-lg transition-shadow flex flex-col border-t-4 ${statusBorderColor[cardStatus]}`}> {/* Added border */}
      <div> {/* Group top content */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-lg uppercase tracking-wide">{vehicle.plate}</h3>
            <p className="text-gray-600 text-sm">
              {vehicle.brand} {vehicle.model} - {vehicle.type}
            </p>
          </div>
        </div>
        
        {/* Buttons for toggling data and documents */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => { setShowData(!showData); setShowDetails(false); }} // Close other desplegables
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs uppercase tracking-wide shadow-sm"
          >
            {showData ? 'Ocultar datos' : 'Datos vehículo'}
          </button>
          <button
            onClick={() => { setShowDetails(!showDetails); setShowData(false); }} // Close other desplegables
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs uppercase tracking-wide shadow-sm"
          >
            {showDetails ? 'Ocultar docs' : 'Documentos'}
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-red-50 rounded-md text-red-700">
            <p className="mb-3">¿Estás seguro que deseas eliminar este vehículo?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onDelete(vehicle.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm uppercase tracking-wide shadow-md"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm uppercase tracking-wide shadow-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {showData && !showDeleteConfirm && (
          <div className="mt-4">
            {isEditingData ? (
              <VehicleDataForm 
                vehicle={vehicle} 
                onSave={(updatedVehicle) => {
                  onUpdateVehicle(updatedVehicle);
                  setIsEditingData(false);
                }} 
                onCancel={() => setIsEditingData(false)} 
              />
            ) : (
              <div className="p-4 bg-gray-100 rounded-md text-sm text-gray-700">
                <p><span className="font-medium">Marca:</span> {vehicle.brand}</p>
                <p><span className="font-medium">Modelo:</span> {vehicle.model}</p>
                <p><span className="font-medium">Año:</span> {vehicle.year}</p>
                <p><span className="font-medium">Tipo:</span> {vehicle.type}</p>
                <p><span className="font-medium">Estado:</span> {vehicle.status === 'active' ? 'Activo' : 'Inactivo'}</p>
                <button
                  onClick={() => setIsEditingData(true)}
                  className="mt-3 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs uppercase tracking-wide shadow-sm"
                >
                  Editar datos
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs uppercase tracking-wide shadow-sm"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
        
        {showDetails && !showDeleteConfirm && !isEditingData && (
          <div className="mt-4">
            <DocumentList 
              documents={vehicle.documents} 
              onDocumentUpdate={(docType, fileName, expiry) => onDocumentUpdate(vehicle.id, docType, fileName, expiry, 'vehicle')} // Pass itemType
              itemType="vehicle" // Pass itemType
            />
          </div>
        )}
      </div>

      {/* Buttons at the bottom - Removed Delete button */}
      <div className="flex space-x-2 mt-auto"> 
        {/* Buttons moved inside the data/document sections */}
      </div>
    </div>
  );
};

export default VehicleCard;