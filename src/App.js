import React, { useState } from 'react';
import DocHeader from './components/DocHeader';
import DocSidebar from './components/DocSidebar';
import DocGridLayout from './components/DocGridLayout';
import ReportsSection from './components/ReportsSection';
import { vehicles as initialVehicles, drivers as initialDrivers } from './mock/vehicles';
import { drivers as initialDriversData } from './mock/drivers';

const App = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDriversData);

  const handleAddVehicle = (newVehicle) => {
    setVehicles([...vehicles, newVehicle]);
  };

  const handleDocumentUpdate = (id, docType, fileName) => {
    if (activeTab === 'vehicles') {
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, documents: { ...vehicle.documents, [docType]: { ...vehicle.documents[docType], file: fileName } } }
          : vehicle
      ));
    } else {
      setDrivers(drivers.map(driver => 
        driver.id === id 
          ? { ...driver, documents: { ...driver.documents, [docType]: { ...driver.documents[docType], file: fileName } } }
          : driver
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DocHeader title="DMV Sync" onAddVehicle={handleAddVehicle} />
      
      <div className="flex">
        <DocSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 min-h-[calc(100vh-80px)] overflow-y-auto">
          {activeTab === 'vehicles' && (
            <DocGridLayout 
              items={vehicles} 
              type="vehicles" 
              onDocumentUpdate={handleDocumentUpdate}
            />
          )}
          {activeTab === 'drivers' && (
            <DocGridLayout 
              items={drivers} 
              type="drivers" 
              onDocumentUpdate={handleDocumentUpdate}
            />
          )}
          {activeTab === 'expiring' && <div className="p-6">Próximos documentos por vencer</div>}
          {activeTab === 'reports' && <ReportsSection />}
        </main>
      </div>
    </div>
  );
};

export default App;

// DONE