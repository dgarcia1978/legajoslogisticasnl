import React, { useState } from 'react';
import DocumentList from './DocumentList';
import DriverDataForm from './DriverDataForm';

const DriverCard = ({ driver, onDocumentUpdate, onDelete, onUpdateDriver }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
            {driver.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <p className="text-gray-600 text-sm">{driver.licenseId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowData(!showData)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {showData ? 'Ocultar datos' : 'Datos conductor'}
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {showDetails ? 'Ocultar docs' : 'Documentos'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-700 mb-3">¿Estás seguro que deseas eliminar este conductor?</p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                onDelete(driver.id);
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
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
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
              <p><span className="font-medium">Nombre:</span> {driver.name}</p>
              <p><span className="font-medium">Licencia:</span> {driver.licenseId}</p>
              <p><span className="font-medium">Teléfono:</span> {driver.phone}</p>
              <button
                onClick={() => setIsEditingData(true)}
                className="mt-3 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Editar datos
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
  );
};

export default DriverCard;