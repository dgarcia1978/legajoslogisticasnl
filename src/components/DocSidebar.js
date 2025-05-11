import React from 'react';

const DocSidebar = ({ activeTab, setActiveTab, viewType, setViewType }) => {
  const transportistaTabs = [
    { id: 'vehicles', label: 'Vehículos' },
    { id: 'drivers', label: 'Conductores' },
    { id: 'expiring', label: 'Vencimientos' },
    { id: 'reports', label: 'Reportes' },
    { id: 'send', label: 'Enviar documentos' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
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
      
      <div className="mb-6">
         <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Vista Actual</h3>
         <div className="flex flex-col space-y-2"> {/* Changed to flex-col for vertical buttons */}
            <button
              onClick={() => setViewType('transportista')}
              className={`px-3 py-1 rounded-md transition-colors text-xs uppercase tracking-wide ${viewType === 'transportista' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Transportista
            </button>
            <button
              onClick={() => setViewType('cliente')}
              className={`px-3 py-1 rounded-md transition-colors text-xs uppercase tracking-wide ${viewType === 'cliente' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Cliente
            </button>
             <button
              onClick={() => setViewType('productor')}
              className={`px-3 py-1 rounded-md transition-colors text-xs uppercase tracking-wide ${viewType === 'productor' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Productor
            </button>
         </div>
      </div>

      {viewType === 'transportista' && (
        <nav className="flex-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Menú Transportista</h3>
          <ul className="space-y-2">
            {transportistaTabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors uppercase tracking-wide text-sm ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200'}`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {/* Add navigation for other views if needed */}
    </aside>
  );
};

export default DocSidebar;