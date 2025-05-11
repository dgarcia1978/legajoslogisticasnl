import React, { useState } from 'react';
import VehicleCard from './VehicleCard';
import DriverCard from './DriverCard';

const DocGridLayout = ({ items, type, onDocumentUpdate, onDelete, onUpdateVehicle, onUpdateDriver, searchTerm }) => {
  // Ordenar alfabéticamente por patente o nombre
  const sortedItems = [...items].sort((a, b) => {
    if (type === 'vehicles') {
      return a.plate.localeCompare(b.plate);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Filtrar por término de búsqueda
  const filteredItems = sortedItems.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    if (type === 'vehicles') {
      return item.plate.toLowerCase().includes(searchTermLower) ||
             item.brand.toLowerCase().includes(searchTermLower) ||
             item.model.toLowerCase().includes(searchTermLower) ||
             item.type.toLowerCase().includes(searchTermLower);
    } else {
      return item.name.toLowerCase().includes(searchTermLower) ||
             item.licenseId.toLowerCase().includes(searchTermLower) ||
             item.phone.toLowerCase().includes(searchTermLower);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredItems.length === 0 ? (
        <p className="text-gray-600">No se encontraron resultados.</p>
      ) : (
        filteredItems.map(item => {
          return (
            <div key={item.id} className="relative">
                {type === 'vehicles' ? 
                  <VehicleCard 
                    vehicle={item} 
                    onDocumentUpdate={onDocumentUpdate}
                    onDelete={onDelete}
                    onUpdateVehicle={onUpdateVehicle}
                  /> : 
                  <DriverCard 
                    driver={item} 
                    onDocumentUpdate={onDocumentUpdate}
                    onDelete={onDelete}
                    onUpdateDriver={onUpdateDriver}
                  />
                }
              </div>
            );
          })
      )}
    </div>
  );
};

export default DocGridLayout;