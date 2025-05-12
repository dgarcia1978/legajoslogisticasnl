import React, { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage'; // Importar funciones de storage

const DriverDocConfig = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocHasExpiry, setNewDocHasExpiry] = useState(false);

  useEffect(() => {
    // Cargar tipos de documento desde localStorage al iniciar
    const storedTypes = getStorage('driverDocumentTypes', [
      { name: 'DNI', hasExpiry: false },
      { name: 'Licencia de Conducir', hasExpiry: true },
      { name: 'ART / Seguro Acc.Pers', hasExpiry: true },
    ]);
    setDocumentTypes(storedTypes);
  }, []);

  useEffect(() => {
    // Guardar tipos de documento en localStorage cada vez que cambian
    setStorage('driverDocumentTypes', documentTypes);
  }, [documentTypes]);

  const handleAddType = () => {
    if (newDocName.trim() && !documentTypes.some(doc => doc.name === newDocName.trim())) {
      setDocumentTypes([...documentTypes, { name: newDocName.trim(), hasExpiry: newDocHasExpiry }]);
      setNewDocName('');
      setNewDocHasExpiry(false);
    }
  };

  const handleDeleteType = (nameToDelete) => {
    setDocumentTypes(documentTypes.filter(doc => doc.name !== nameToDelete));
  };

  const handleToggleExpiry = (nameToToggle) => {
    setDocumentTypes(documentTypes.map(doc => 
      doc.name === nameToToggle ? { ...doc, hasExpiry: !doc.hasExpiry } : doc
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Configurar Documentación Conductores</h2>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Documentos Conductores Actuales</h3>
        <div className="grid grid-cols-3 gap-4 font-medium text-gray-700 mb-2 border-b pb-2"> {/* Adjusted grid columns */}
            <span>Nombre</span>
            <span className="text-center">Lleva Vencimiento</span> {/* Centered text */}
            <span></span> {/* Empty column for alignment */}
        </div>
        <ul className="space-y-2">
          {documentTypes.map(doc => (
            <li key={doc.name} className="grid grid-cols-3 items-center bg-gray-100 rounded-md p-3"> {/* Adjusted grid columns */}
              <span className="text-gray-700">{doc.name}</span>
              <div className="flex justify-center"> {/* Centered button */}
                <button
                  onClick={() => handleToggleExpiry(doc.name)}
                  className={`px-3 py-1 rounded-md transition-colors text-xs uppercase tracking-wide shadow-sm ${doc.hasExpiry ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  {doc.hasExpiry ? 'Sí' : 'No'}
                </button>
              </div>
              <div className="flex justify-end"> {/* Aligned to the right */}
                <button
                  onClick={() => handleDeleteType(doc.name)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs uppercase tracking-wide shadow-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Agregar Nuevo Documento Conductor</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Documento</label>
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Examen Médico"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newDocHasExpiry}
              onChange={(e) => setNewDocHasExpiry(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Lleva Fecha de Vencimiento</label>
          </div>
          <button
            onClick={handleAddType}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors uppercase tracking-wide shadow-md"
            disabled={!newDocName.trim()}
          >
            Agregar Documento
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDocConfig;