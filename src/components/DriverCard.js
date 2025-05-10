import React, { useState } from 'react';
import DocumentList from './DocumentList';

const DriverCard = ({ driver, onDocumentUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">{driver.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <p className="text-gray-600">{driver.licenseId}</p>
          </div>
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
            documents={driver.documents} 
            onDocumentUpdate={(docType, fileName) => onDocumentUpdate(driver.id, docType, fileName)}
          />
        </div>
      )}
    </div>
  );
};

export default DriverCard;