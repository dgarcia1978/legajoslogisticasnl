import React, { useState } from 'react';
import DocHeader from './components/DocHeader';
import DocSidebar from './components/DocSidebar';
import DocGridLayout from './components/DocGridLayout';
import ReportsSection from './components/ReportsSection';
import ExpiringDocuments from './components/ExpiringDocuments';
import DocumentSender from './components/DocumentSender';
import ClientView from './components/ClientView';
import InsuranceProducerView from './components/InsuranceProducerView'; // Importar la vista de productor
import SearchBar from './components/SearchBar';
import { vehicles as initialVehicles, drivers as initialDrivers } from './mock/vehicles';
import { drivers as initialDriversData } from './mock/drivers';
import { isValidDateDDMMYYYY } from './utils/validators';

const App = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [viewType, setViewType] = useState('transportista'); // 'transportista', 'cliente', 'productor'
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDriversData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddVehicle = (newVehicle) => {
    // Inicializar documentos con semáforo en rojo (sin archivo ni fecha de vencimiento)
    const vehicleWithDefaultDocs = {
      ...newVehicle,
      documents: {
        cedulaVerde: { file: '' },
        seguro: { expiry: '', file: '' },
        vtv: { expiry: '', file: '' }
      }
    };
    setVehicles([...vehicles, vehicleWithDefaultDocs]);
  };

  const handleDeleteVehicle = (id) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
  };

  const handleDeleteDriver = (id) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  const handleDocumentUpdate = (id, docType, fileName, expiry, itemType) => {
    const formattedExpiry = expiry && isValidDateDDMMYYYY(expiry) ? expiry : '';

    const updateItem = (items, setItems) => {
      setItems(items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              documents: { 
                ...item.documents, 
                [docType]: { 
                  ...item.documents[docType], 
                  file: fileName || item.documents[docType].file, // Mantener file si no se actualiza
                  expiry: formattedExpiry || item.documents[docType].expiry // Mantener expiry si no se actualiza
                } 
              } 
            }
          : item
      ));
    };

    if (itemType === 'vehicle') {
      updateItem(vehicles, setVehicles);
    } else if (itemType === 'driver') {
      updateItem(drivers, setDrivers);
    } else { // Fallback if itemType is not provided (e.g., from DocGridLayout)
       if (activeTab === 'vehicles') {
         updateItem(vehicles, setVehicles);
       } else if (activeTab === 'drivers') {
         updateItem(drivers, setDrivers);
       }
    }
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    ));
  };

  const handleUpdateDriver = (updatedDriver) => {
    setDrivers(drivers.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
      <DocSidebar activeTab={activeTab} setActiveTab={setActiveTab} viewType={viewType} setViewType={setViewType} />
      
      <div className="flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto px-4 py-4 w-full">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <main className="flex-1 overflow-y-auto">
          {viewType === 'transportista' && (
            <>
              <DocHeader onAddVehicle={handleAddVehicle} />
              {activeTab === 'vehicles' && (
                <DocGridLayout 
                  items={vehicles} 
                  type="vehicles" 
                  onDocumentUpdate={handleDocumentUpdate}
                  onDelete={handleDeleteVehicle}
                  onUpdateVehicle={handleUpdateVehicle}
                  searchTerm={searchTerm}
                />
              )}
              {activeTab === 'drivers' && (
                <DocGridLayout 
                  items={drivers} 
                  type="drivers" 
                  onDocumentUpdate={handleDocumentUpdate}
                  onDelete={handleDeleteDriver}
                  onUpdateDriver={handleUpdateDriver}
                  searchTerm={searchTerm}
                />
              )}
              {activeTab === 'expiring' && <ExpiringDocuments onDocumentUpdate={handleDocumentUpdate} searchTerm={searchTerm} />}
              {activeTab === 'reports' && <ReportsSection vehicles={vehicles} drivers={drivers} searchTerm={searchTerm} />}
              {activeTab === 'send' && <DocumentSender vehicles={vehicles} drivers={drivers} searchTerm={searchTerm} />}
            </>
          )}
          {viewType === 'cliente' && <ClientView vehicles={vehicles} drivers={drivers} searchTerm={searchTerm} />}
          {viewType === 'productor' && <InsuranceProducerView onDocumentUpdate={handleDocumentUpdate} />}
        </main>
      </div>
    </div>
  );
};

export default App;