import React, { useState, useEffect } from 'react';
import { vehicles } from '../mock/vehicles';
import { getDocument } from '../mock/documents';
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from '../utils/formatters';
import { isValidDateDDMMYYYY } from '../utils/validators';
import DocumentUploader from './DocumentUploader';
import BulkUpdateForm from './BulkUpdateForm'; // Reutilizar BulkUpdateForm

const InsuranceProducerView = ({ onDocumentUpdate }) => {
  const [displayVehicles, setDisplayVehicles] = useState([]);
  const [filterTransportista, setFilterTransportista] = useState('all');
  const [showBulkUpdateForm, setShowBulkUpdateForm] = useState(false);

  // Simular múltiples transportistas y asignar items a ellos
  const mockTransportistas = [
    { id: 1, name: 'Transportes Rápidos S.A.' },
    { id: 2, name: 'Logística Segura' },
  ];

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate || expiryDate === 'Vencida') return 'expired';
    
    const today = new Date();
    const expiry = new Date(formatDateToYYYYMMDD(expiryDate));
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 10) return 'warning';
    return 'valid';
  };

  useEffect(() => {
    // Solo mostrar vehículos en esta vista y filtrar por transportista
    const filteredVehicles = vehicles.filter(vehicle => {
      const matchesTransportista = filterTransportista === 'all' || vehicle.transportistaId === parseInt(filterTransportista);
      return matchesTransportista;
    });

    const sortedVehicles = [...filteredVehicles].sort((a, b) => a.plate.localeCompare(b.plate));
    setDisplayVehicles(sortedVehicles);
  }, [vehicles, filterTransportista]); // Dependencias para recalcular la lista

  const handleBulkUpdateComplete = (itemsToUpdate, docType, fileName, expiry) => {
    itemsToUpdate.forEach(vehicleId => {
      onDocumentUpdate(vehicleId, docType, fileName, expiry, 'vehicle');
    });
    setShowBulkUpdateForm(false);
  };

  const handleViewDocument = (fileName) => {
    const documentData = getDocument(fileName);
    if (documentData) {
      window.open(documentData, '_blank');
    } else {
      alert('Documento no encontrado.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Pólizas de Seguro</h2>

      <div className="flex space-x-4 mb-6 items-center"> {/* Added items-center for vertical alignment */}
        <div className="relative">
          <select
            value={filterTransportista}
            onChange={(e) => setFilterTransportista(e.target.value)}
            className="px-4 py-2 rounded-md transition-colors text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 appearance-none pr-8 shadow-md"
          >
            <option value="all">Todos los Transportistas</option>
            {mockTransportistas.map(trans => (
              <option key={trans.id} value={trans.id}>
                {trans.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <button
          onClick={() => setShowBulkUpdateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm uppercase tracking-wide shadow-md"
        >
          Actualizar Póliza
        </button>
      </div>

      {showBulkUpdateForm && (
        <BulkUpdateForm
          selectedItems={displayVehicles.map(v => v.id)} // Pass all displayed vehicle IDs
          documentType="seguro"
          onBulkUpdate={handleBulkUpdateComplete}
          onCancel={() => setShowBulkUpdateForm(false)}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayVehicles.length === 0 ? (
          <p className="text-gray-600">No hay vehículos que coincidan con los filtros.</p>
        ) : (
          displayVehicles.map((vehicle) => {
            const seguroDoc = vehicle.documents.seguro || {};
            const hasFile = !!seguroDoc.file;
            const status = seguroDoc.expiry ? getExpiryStatus(seguroDoc.expiry) : 'expired';

            return (
              <div 
                key={vehicle.id} 
                className="bg-white rounded-xl shadow-md p-4 text-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{vehicle.plate}</p>
                    <p className="text-sm text-gray-600">Póliza de Seguro</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    status === 'expired' ? 'bg-red-600' : 
                    status === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
                  }`}></span>
                  <p className={`text-sm ${
                    status === 'expired' ? 'text-red-600' : 
                    status === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {seguroDoc.expiry ? (seguroDoc.expiry === 'Vencida' ? 'Vencido' : `Vence: ${seguroDoc.expiry}`) : 'Sin fecha de vencimiento'}
                  </p>
                </div>

                <p className={`text-xs mt-1 ${hasFile ? 'text-green-600' : 'text-red-600'}`}>
                  {hasFile ? 'Archivo cargado' : 'Archivo no cargado'}
                </p>
                
                {seguroDoc.file && (
                  <button 
                    onClick={() => handleViewDocument(seguroDoc.file)}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors mt-2 shadow-sm"
                  >
                    Ver documento
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InsuranceProducerView;

// DONE