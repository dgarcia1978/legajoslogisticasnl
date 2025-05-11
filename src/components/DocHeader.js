import React, { useState } from 'react';
import NewVehicleForm from './NewVehicleForm';

const DocHeader = ({ onAddVehicle }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <header className="w-full bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-end"> {/* Align content to the right */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm uppercase tracking-wide shadow-md"
          >
            {showForm ? 'Cancelar' : 'Nuevo vehículo'}
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm uppercase tracking-wide shadow-md">
            Nuevo conductor
          </button>
        </div>
      </div>

      {showForm && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <NewVehicleForm 
            onAddVehicle={(vehicle) => {
              onAddVehicle(vehicle);
              setShowForm(false);
            }} 
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </header>
  );
};

export default DocHeader;