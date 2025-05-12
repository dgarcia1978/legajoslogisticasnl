import React, { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage'; // Importar funciones de storage

const VehicleTypeConfig = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [newType, setNewType] = useState('');

  useEffect(() => {
    // Cargar tipos de vehículo desde localStorage al iniciar
    const storedTypes = getStorage('vehicleTypes', [
      'Semirremolque',
      'Tractor',
      'Chasis',
      'Balancin',
      'Camioneta'
    ]);
    setVehicleTypes(storedTypes);
  }, []);

  useEffect(() => {
    // Guardar tipos de vehículo en localStorage cada vez que cambian
    setStorage('vehicleTypes', vehicleTypes);
  }, [vehicleTypes]);

  const handleAddType = () => {
    if (newType.trim() && !vehicleTypes.includes(newType.trim())) {
      setVehicleTypes([...vehicleTypes, newType.trim()]);
      setNewType('');
    }
  };

  const handleDeleteType = (typeToDelete) => {
    setVehicleTypes(vehicleTypes.filter(type => type !== typeToDelete));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Configurar Tipos de Vehículo</h2>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Tipos de Vehículo Actuales</h3>
        <ul className="space-y-2">
          {vehicleTypes.map(type => (
            <li key={type} className="flex justify-between items-center bg-gray-100 rounded-md p-3">
              <span className="text-gray-700">{type}</span>
              <button
                onClick={() => handleDeleteType(type)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs uppercase tracking-wide shadow-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Agregar Nuevo Tipo de Vehículo</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Furgoneta"
          />
          <button
            onClick={handleAddType}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors uppercase tracking-wide shadow-md"
            disabled={!newType.trim()}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeConfig;

// DONE