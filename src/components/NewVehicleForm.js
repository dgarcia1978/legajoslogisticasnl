import React, { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage'; // Importar funciones de storage

const NewVehicleForm = ({ onAddVehicle, onCancel }) => {
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
    type: '', // Inicializar vacío para que se seleccione del listado
    status: 'active'
  });
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    // Cargar tipos de vehículo desde localStorage al iniciar
    const storedTypes = getStorage('vehicleTypes', ['Tractor', 'Semirremolque', 'Chasis', 'Camioneta', 'Balancin']);
    setAvailableTypes(storedTypes);
    // Establecer el primer tipo como valor por defecto si hay opciones
    if (storedTypes.length > 0) {
      setFormData(prevData => ({ ...prevData, type: storedTypes[0] }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicle = {
      ...formData,
      id: Date.now(), // ID temporal
      documents: {
        cedulaVerde: { file: '' },
        seguro: { expiry: '', file: '' },
        vtv: { expiry: '', file: '' }
      }
    };
    onAddVehicle(newVehicle);
    setFormData({
      plate: '',
      brand: '',
      model: '',
      year: '',
      type: availableTypes.length > 0 ? availableTypes[0] : '', // Resetear al primer tipo disponible
      status: 'active'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Agregar Nuevo Vehículo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patente</label>
            <input
              type="text"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Vehículo
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVehicleForm;