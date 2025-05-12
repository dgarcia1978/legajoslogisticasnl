import React, { useState } from 'react';
import NewVehicleForm from './NewVehicleForm';
import NewDriverForm from './NewDriverForm'; // Importar el formulario de nuevo conductor

const DocHeader = ({ onAddVehicle, onAddDriver }) => { // Recibir onAddDriver
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);

  return (
    <header className="w-full bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-end"> {/* Align content to the right */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowVehicleForm(!showVehicleForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm uppercase tracking-wide shadow-md"
          >
            {showVehicleForm ? 'Cancelar' : 'Nuevo vehículo'}
          </button>
          <button 
            onClick={() => setShowDriverForm(!showDriverForm)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm uppercase tracking-wide shadow-md"
          >
            {showDriverForm ? 'Cancelar' : 'Nuevo conductor'}
          </button>
        </div>
      </div>

      {showVehicleForm && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <NewVehicleForm 
            onAddVehicle={(vehicle) => {
              onAddVehicle(vehicle);
              setShowVehicleForm(false);
            }} 
            onCancel={() => setShowVehicleForm(false)}
          />
        </div>
      )}

      {showDriverForm && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <NewDriverForm 
            onAddDriver={(driver) => {
              onAddDriver(driver);
              setShowDriverForm(false);
            }} 
            onCancel={() => setShowDriverForm(false)}
          />
        </div>
      )}
    </header>
  );
};

export default DocHeader;