import React from 'react';

const DocSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'vehicles', label: 'Vehículos' },
    { id: 'drivers', label: 'Conductores' },
    { id: 'expiring', label: 'Por vencer' },
    { id: 'reports', label: 'Reportes' },
    { id: 'send', label: 'Enviar documentos' }
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DocSidebar;

// DONE