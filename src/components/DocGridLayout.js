import React from 'react';
import VehicleCard from './VehicleCard';
import DriverCard from './DriverCard';

const DocGridLayout = ({ items, type, onDocumentUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {items.map(item => (
        type === 'vehicles' ? 
          <VehicleCard 
            key={item.id} 
            vehicle={item} 
            onDocumentUpdate={onDocumentUpdate} 
          /> : 
          <DriverCard 
            key={item.id} 
            driver={item} 
            onDocumentUpdate={onDocumentUpdate} 
          />
      ))}
    </div>
  );
};

export default DocGridLayout;

// DONE