import React, { useState, useEffect } from 'react';
import { vehicles } from '../mock/vehicles';
import { drivers } from '../mock/drivers';
import { formatDateToYYYYMMDD } from '../utils/formatters';
import BulkUpdateForm from './BulkUpdateForm';

const ExpiringDocuments = ({ onDocumentUpdate }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'warning', 'expired'
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all'); // 'all' or specific docType
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkUpdateDocType, setBulkUpdateDocType] = useState(null);
  const [displayItems, setDisplayItems] = useState([]);

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

  const documentNames = {
    cedulaVerde: 'Cédula Verde',
    seguro: 'Póliza de Seguro',
    vtv: 'VTV',
    dni: 'DNI',
    art: 'ART',
    licencia: 'Licencia de Conducir'
  };

  const allItems = [
    ...vehicles.map(v => ({ ...v, itemType: 'vehicle' })),
    ...drivers.map(d => ({ ...d, itemType: 'driver' }))
  ];

  useEffect(() => {
    const processedItems = allItems.reduce((acc, item) => {
      Object.entries(item.documents).forEach(([docType, doc]) => {
        const hasExpiry = documentsWithExpiry.includes(docType);
        if (hasExpiry) {
          const status = doc.expiry ? getExpiryStatus(doc.expiry) : 'expired';
          if ((filter === 'all' || filter === status) && (documentTypeFilter === 'all' || documentTypeFilter === docType)) {
            if (status === 'warning' || status === 'expired') {
               acc.push({
                 id: item.id,
                 name: item.itemType === 'vehicle' ? item.plate : item.name,
                 itemType: item.itemType,
                 docType: docType, // Usar el nombre técnico para la actualización
                 docName: documentNames[docType] || docType, // Nombre legible para mostrar
                 expiry: doc.expiry,
                 status: status
               });
            }
          }
        } else if (hasExpiry && !doc.expiry) {
           // Include documents with expiry field but no date if filter is 'expired' (as they are effectively expired)
           if ((filter === 'all' || filter === 'expired') && (documentTypeFilter === 'all' || documentTypeFilter === docType)) {
            acc.push({
              id: item.id,
              name: item.itemType === 'vehicle' ? item.plate : item.name,
              itemType: item.itemType,
              docType: docType, // Usar el nombre técnico para la actualización
              docName: documentNames[docType] || docType, // Nombre legible para mostrar
              expiry: 'Sin fecha de vencimiento',
              status: 'expired'
            });
           }
        }
      });
      return acc;
    }, []);

    // Sort by name (plate or driver name)
    processedItems.sort((a, b) => a.name.localeCompare(b.name));

    // No filtering by searchTerm here, as per previous instruction
    setDisplayItems(processedItems);

  }, [filter, documentTypeFilter, vehicles, drivers]); // Dependencias para recalcular la lista

  const handleSelectItem = (item) => {
    setSelectedItems(prevSelected => 
      prevSelected.some(selected => selected.id === item.id && selected.docType === item.docType)
        ? prevSelected.filter(selected => !(selected.id === item.id && selected.docType === item.docType))
        : [...prevSelected, { id: item.id, docType: item.docType, itemType: item.itemType }]
    );
  };

  const handleBulkUpdate = (itemsToUpdate, docType, fileName, expiry) => {
    itemsToUpdate.forEach(item => {
      onDocumentUpdate(item.id, item.docType, fileName, expiry, item.itemType);
    });
    setSelectedItems([]);
    setBulkUpdateDocType(null);
  };

  const filterableDocumentTypes = Object.keys(documentNames).filter(docType => documentsWithExpiry.includes(docType));

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Vencimientos</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filter === 'warning' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Por Vencer
        </button>
        <button
          onClick={() => setFilter('expired')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filter === 'expired' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Vencidos
        </button>

        <div className="relative">
          <select
            value={documentTypeFilter}
            onChange={(e) => setDocumentTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg transition-colors text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 appearance-none pr-8"
          >
            <option value="all">Todos los documentos</option>
            {filterableDocumentTypes.map(docType => (
              <option key={docType} value={docType}>
                {documentNames[docType] || docType}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-gray-600 text-sm">{selectedItems.length} documentos seleccionados</span>
          <div className="relative">
            <button
              onClick={() => setBulkUpdateDocType(bulkUpdateDocType ? null : selectedItems[0].docType)} // Abre con el tipo del primer seleccionado
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Actualizar
            </button>
            {bulkUpdateDocType && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                   {/* Mostrar solo el tipo de documento de los seleccionados */}
                   <button
                     onClick={() => setBulkUpdateDocType(selectedItems[0].docType)}
                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                   >
                     {documentNames[selectedItems[0].docType] || selectedItems[0].docType}
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {bulkUpdateDocType && selectedItems.length > 0 && (
        <BulkUpdateForm 
          selectedItems={selectedItems}
          documentType={bulkUpdateDocType}
          onBulkUpdate={handleBulkUpdate}
          onCancel={() => setBulkUpdateDocType(null)}
        />
      )}

      <div className="space-y-4">
        {displayItems.length === 0 ? (
          <p className="text-gray-600">No hay documentos en esta categoría.</p>
        ) : (
          displayItems.map((item, index) => {
            const isSelected = selectedItems.some(selected => selected.id === item.id && selected.docType === item.docType);
            return (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                <div>
                  <p className="font-medium">{item.name} ({item.itemType === 'vehicle' ? 'Vehículo' : 'Conductor'})</p>
                  <p className="text-sm text-gray-600">{item.docName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      item.status === 'expired' ? 'bg-red-500' : 
                      item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                    <p className={`text-xs ${
                      item.status === 'expired' ? 'text-red-600' : 
                      item.status === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {item.expiry === 'Vencida' ? 'Vencido' : `Vence: ${item.expiry}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExpiringDocuments;

// DONE