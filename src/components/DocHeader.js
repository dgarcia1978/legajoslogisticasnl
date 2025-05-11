import React, { useState } from 'react';
import NewVehicleForm from './NewVehicleForm';

const DocHeader = ({ onAddVehicle }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div></div> {/* Espacio vacío para empujar el contenido a la derecha */}
        <div className="flex items-center space-x-3">
          <img 
            src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0QQaFvXhQiykWjlXTqU1cwIADob6V2r5N0P3R" 
            alt="Genesi Logo" 
            className="h-10 w-10"
          />
          <h1 className="text-2xl font-bold text-gray-900">Genesi: Legajos Digitales</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {showForm ? 'Cancelar' : 'Nuevo vehículo'}
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
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