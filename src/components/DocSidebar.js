import React, { useState } from 'react';

const DocSidebar = ({ activeTab, setActiveTab, viewType, setViewType }) => {
  const transportistaTabs = [
    { id: 'vehicles', label: 'Vehículos' },
    { id: 'drivers', label: 'Conductores' },
    { id: 'expiring', label: 'Vencimientos' },
    { id: 'reports', label: 'Reportes' },
    { id: 'send', label: 'Enviar documentos' },
    { id: 'config', label: 'Configuración' } // Nuevo tab de configuración
  ];

  const [showConfigSubmenu, setShowConfigSubmenu] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'config') {
      setShowConfigSubmenu(!showConfigSubmenu);
    } else {
      setShowConfigSubmenu(false);
    }
  };

  const handleConfigSubmenuClick = (subTabId) => {
    setActiveTab(subTabId);
    setShowConfigSubmenu(false); // Close submenu after selection
  };

  return (
    <aside className="w-60 bg-white shadow-md h-screen text-gray-700 p-4 flex flex-col"> {/* h-screen and flex-col for full height */}
      <div className="flex items-center space-x-2 mb-6"> {/* Added logo and title here */}
        <img 
          src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0QQaFvXhQiykWjlXTqU1cwIADob6V2r5N0P3R" 
          alt="Genesi Logo" 
          className="h-7 w-7"
        />
        <h1 className="text-xl font-bold uppercase tracking-wide">Genesi</h1>
      </div>

      <div className="flex flex-col space-y-2 mb-6"> {/* Selector de vista */}
        <button
          onClick={() => setViewType('transportista')}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors uppercase tracking-wide text-sm ${viewType === 'transportista' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200'}`}
        >
          Vista Transportista
        </button>
        <button
          onClick={() => setViewType('cliente')}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors uppercase tracking-wide text-sm ${viewType === 'cliente' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200'}`}
        >
          Vista Cliente
        </button>
         <button
          onClick={() => setViewType('productor')}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm uppercase tracking-wide ${viewType === 'productor' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200'}`}
        >
          Vista Productor
        </button>
      </div>

      {viewType === 'transportista' && (
        <nav className="flex-1">
          <ul className="space-y-2">
            {transportistaTabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors uppercase tracking-wide text-sm ${activeTab === tab.id || (tab.id === 'config' && showConfigSubmenu) ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200'}`}
                >
                  {tab.label}
                </button>
                {tab.id === 'config' && showConfigSubmenu && (
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>
                      <button
                        onClick={() => handleConfigSubmenuClick('config-vehicle-types')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${activeTab === 'config-vehicle-types' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                      >
                        Tipo de Vehículo
                      </button>
                    </li>
                     <li> {/* Nuevo submenú */}
                      <button
                        onClick={() => handleConfigSubmenuClick('config-vehicle-docs')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${activeTab === 'config-vehicle-docs' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                      >
                        Documentación Vehículo
                      </button>
                    </li>
                     <li> {/* Nuevo submenú */}
                      <button
                        onClick={() => handleConfigSubmenuClick('config-driver-docs')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${activeTab === 'config-driver-docs' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                      >
                        Documentación Conductores
                      </button>
                    </li>
                    {/* Otros submenús de configuración aquí */}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
      {/* Aquí podrías agregar navegación específica para otras vistas si fuera necesario */}
    </aside>
  );
};

export default DocSidebar;