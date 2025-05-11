import React, { useState, useEffect } from 'react';
import { vehicles } from '../mock/vehicles';
import { drivers } from '../mock/drivers';
import { getDocument } from '../mock/documents';
import { formatDateToYYYYMMDD } from '../utils/formatters';
import SearchBar from './SearchBar'; // Import SearchBar

const ClientView = ({ searchTerm }) => {
  const [filterTransportista, setFilterTransportista] = useState('all');
  const [filterVehicleType, setFilterVehicleType] = useState('all');
  const [displayItems, setDisplayItems] = useState([]);

  // Simular múltiples transportistas y asignar items a ellos
  const mockTransportistas = [
    { id: 1, name: 'Transportes Rápidos S.A.' },
    { id: 2, name: 'Logística Segura' },
  ];

  const allItems = [
    ...drivers.map(d => ({ ...d, itemType: 'driver', transportistaId: 1 })), // Asignar a Transportes Rápidos
    ...vehicles.map(v => ({ ...v, itemType: 'vehicle', transportistaId: v.id % 2 === 0 ? 2 : 1 })) // Alternar entre transportistas
  ];

  const documentNames = {
    cedulaVerde: 'Cédula Verde',
    seguro: 'Póliza de Seguro',
    vtv: 'VTV',
    dni: 'DNI',
    art: 'ART',
    licencia: 'Licencia de Conducir'
  };

  const documentsWithExpiry = ['seguro', 'vtv', 'art', 'licencia'];

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
    const filtered = allItems.filter(item => {
      const matchesTransportista = filterTransportista === 'all' || item.transportistaId === parseInt(filterTransportista);
      const matchesVehicleType = filterVehicleType === 'all' || 
                                 (item.itemType === 'driver' && filterVehicleType === 'driver') ||
                                 (item.itemType === 'vehicle' && item.type === filterVehicleType);
      
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = item.itemType === 'vehicle' 
                            ? item.plate.toLowerCase().includes(searchTermLower) || item.brand.toLowerCase().includes(searchTermLower) || item.model.toLowerCase().includes(searchTermLower) || item.type.toLowerCase().includes(searchTermLower)
                            : item.name.toLowerCase().includes(searchTermLower) || item.licenseId.toLowerCase().includes(searchTermLower) || item.phone.toLowerCase().includes(searchTermLower);

      return matchesTransportista && matchesVehicleType && matchesSearch;
    });
    setDisplayItems(filtered);
  }, [filterTransportista, filterVehicleType, vehicles, drivers, searchTerm]); // Dependencias para recalcular la lista

  const handleDownloadLegajo = (item) => {
    const documentsToDownload = Object.entries(item.documents)
      .filter(([docType, doc]) => doc.file)
      .map(([docType, doc]) => ({
        fileName: doc.file,
        fileData: getDocument(doc.file)
      }));

    if (documentsToDownload.length === 0) {
      alert('Este legajo no tiene documentos para descargar.');
      return;
    }

    // Simulación de descarga de ZIP
    // En un entorno real, necesitarías una librería para crear ZIPs en el cliente
    // o un endpoint en el backend que genere el ZIP.
    alert(`Simulando descarga de legajo para ${item.itemType === 'vehicle' ? item.plate : item.name}.\n\nSe descargarán los siguientes archivos:\n${documentsToDownload.map(d => `- ${d.fileName}`).join('\n')}`);
    
    // Ejemplo básico de descarga de un solo archivo (si solo hubiera uno)
    // if (documentsToDownload.length > 0) {
    //   const doc = documentsToDownload[0];
    //   const link = document.createElement('a');
    //   link.href = doc.fileData;
    //   link.download = doc.fileName;
    //   link.click();
    // }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Vista de Cliente</h2>

      <div className="flex space-x-4 mb-6">
        <div className="relative">
          <select
            value={filterTransportista}
            onChange={(e) => setFilterTransportista(e.target.value)}
            className="px-4 py-2 rounded-lg transition-colors text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 appearance-none pr-8"
          >
            <option value="all">Todos los Transportistas</option>
            {mockTransportistas.map(trans => (
              <option key={trans.id} value={trans.id}>
                {trans.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={filterVehicleType}
            onChange={(e) => setFilterVehicleType(e.target.value)}
            className="px-4 py-2 rounded-lg transition-colors text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 appearance-none pr-8"
          >
            <option value="all">Todos los Tipos</option>
            <option value="driver">Conductores</option>
            <option value="SEMI">Semi</option>
            <option value="TRACTOR">Tractor</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.length === 0 ? (
          <p className="text-gray-600">No hay elementos que coincidan con los filtros.</p>
        ) : (
          displayItems.map(item => (
            <div key={`${item.itemType}-${item.id}`} className="bg-white rounded-xl shadow-sm p-4 relative"> {/* Added relative positioning */}
              <div className="flex justify-between items-start mb-3"> {/* Adjusted flex for alignment */}
                <div>
                  <h3 className="font-bold">{item.itemType === 'vehicle' ? item.plate : item.name} ({item.itemType === 'vehicle' ? item.type : 'Conductor'})</h3>
                </div>
                <button
                  onClick={() => handleDownloadLegajo(item)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar
                </button>
              </div>
              
              <div className="space-y-2">
                {Object.entries(item.documents).map(([docType, doc]) => {
                  const hasExpiry = documentsWithExpiry.includes(docType);
                  const status = hasExpiry && doc.expiry ? getExpiryStatus(doc.expiry) : 'none';
                  
                  return (
                    doc.file && ( // Mostrar solo si tiene archivo
                      <div key={docType} className="flex items-center space-x-2 p-2 rounded-lg">
                        {hasExpiry && (
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            status === 'expired' ? 'bg-red-500' : 
                            status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></span>
                        )}
                        <span className="text-sm text-gray-700">{documentNames[docType] || docType}</span>
                        {hasExpiry && (
                          <span className={`text-xs ${
                            status === 'expired' ? 'text-red-600' : 
                            status === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {doc.expiry ? (doc.expiry === 'Vencida' ? 'Vencido' : `Vence: ${doc.expiry}`) : ''}
                          </span>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientView;