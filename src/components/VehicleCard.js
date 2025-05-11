import React, { useState } from 'react';
import DocumentList from './DocumentList';
import VehicleDataForm from './VehicleDataForm';

const VehicleCard = ({ vehicle, onDocumentUpdate, onDelete, onUpdateVehicle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-gray-800 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-bold text-lg uppercase tracking-wide">{vehicle.plate}</h3>
          <p className="text-gray-600 text-sm">
            {vehicle.brand} {vehicle.model} - {vehicle.type}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowData(!showData)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs uppercase tracking-wide shadow-sm"
          >
            {showData ? 'Ocultar datos' : 'Datos vehículo'}
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs uppercase tracking-wide shadow-sm"
          >
            {showDetails ? 'Ocultar docs' : 'Documentos'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs uppercase tracking-wide shadow-sm"
          >
            Eliminar
          </button>
        </div>
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
            </div>
          )}
        </div>
      )}
      
      {showDetails && !showDeleteConfirm && !isEditingData && (
        <div className="mt-4">
          <DocumentList 
            documents={vehicle.documents} 
            onDocumentUpdate={(docType, fileName, expiry) => onDocumentUpdate(vehicle.id, docType, fileName, expiry)}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleCard;