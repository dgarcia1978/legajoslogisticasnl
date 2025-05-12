import React, { useState } from 'react';
import DocumentList from './DocumentList';
import DriverDataForm from './DriverDataForm';

const DriverCard = ({ driver, onDocumentUpdate, onDelete, onUpdateDriver }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-gray-800 hover:shadow-lg transition-shadow flex flex-col justify-between"> {/* Removed fixed height */}
      <div> {/* Group top content */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
              {driver.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wide">{driver.name}</h3>
              <p className="text-gray-600 text-sm">{driver.licenseId}</p>
            </div>
          </div>
        </div>
        
        {/* Buttons for toggling data and documents */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => { setShowData(!showData); setShowDetails(false); }} // Close other desplegables
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs uppercase tracking-wide shadow-sm"
          >
            {showData ? 'Ocultar datos' : 'Datos conductor'}
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
            <p className="mb-3">¿Estás seguro que deseas eliminar este conductor?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onDelete(driver.id);
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
              <DriverDataForm 
                driver={driver} 
                onSave={(updatedDriver) => {
                  onUpdateDriver(updatedDriver);
                  setIsEditingData(false);
                }} 
                onCancel={() => setIsEditingData(false)} 
              />
            ) : (
              <div className="p-4 bg-gray-100 rounded-md text-sm text-gray-700">
                <p><span className="font-medium">Nombre:</span> {driver.name}</p>
                <p><span className="font-medium">Licencia:</span> {driver.licenseId}</p>
                <p><span className="font-medium">Teléfono:</span> {driver.phone}</p>
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
              documents={driver.documents} 
              onDocumentUpdate={(docType, fileName, expiry) => onDocumentUpdate(driver.id, docType, fileName, expiry)}
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

export default DriverCard;

// DONE