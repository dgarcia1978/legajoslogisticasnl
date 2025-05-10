import React, { useState } from 'react';
import DocumentList from './DocumentList';

const VehicleCard = ({ vehicle, onDocumentUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{vehicle.plate}</h3>
          <p className="text-gray-600">
            {vehicle.brand} {vehicle.model} - {vehicle.type}
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showDetails ? 'Ocultar' : 'Ver documentos'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4">
          <DocumentList 
            documents={vehicle.documents} 
            onDocumentUpdate={(docType, fileName) => onDocumentUpdate(vehicle.id, docType, fileName)}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleCard;

// DONE