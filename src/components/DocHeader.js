import React, { useState } from 'react';
import NewVehicleForm from './NewVehicleForm';

const DocHeader = ({ title, onAddVehicle }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo vehículo
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
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
          />
        </div>
      )}
    </header>
  );
};

export default DocHeader;