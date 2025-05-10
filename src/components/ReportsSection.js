import React from 'react';
import { vehicles } from '../mock/vehicles';
import { drivers } from '../mock/drivers';

const ReportsSection = () => {
  const getExpiryStatus = (expiryDate) => {
    if (expiryDate === 'Vencida') return 'expired';
    
    const today = new Date();
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 10) return 'warning';
    return 'valid';
  };

  const countDocuments = (items) => {
    let expired = 0;
    let warning = 0;
    let valid = 0;

    items.forEach(item => {
      Object.values(item.documents).forEach(doc => {
        if (doc.expiry) {
          const status = getExpiryStatus(doc.expiry);
          if (status === 'expired') expired++;
          if (status === 'warning') warning++;
          if (status === 'valid') valid++;
        }
      });
    });

    return { expired, warning, valid };
  };

  const vehicleDocs = countDocuments(vehicles);
  const driverDocs = countDocuments(drivers);
  const totalDocs = {
    expired: vehicleDocs.expired + driverDocs.expired,
    warning: vehicleDocs.warning + driverDocs.warning,
    valid: vehicleDocs.valid + driverDocs.valid
  };

  const StatCard = ({ title, count, type }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${
        type === 'expired' ? 'text-red-600' : 
        type === 'warning' ? 'text-yellow-600' : 'text-green-600'
      }`}>
        {count}
      </p>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Reporte de Documentos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Vencidos" count={totalDocs.expired} type="expired" />
        <StatCard title="Por Vencer (10 días)" count={totalDocs.warning} type="warning" />
        <StatCard title="Vigentes" count={totalDocs.valid} type="valid" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-medium mb-4">Documentos de Vehículos</h3>
          <div className="grid grid-cols-3 gap-2">
            <StatCard title="Vencidos" count={vehicleDocs.expired} type="expired" />
            <StatCard title="Por Vencer" count={vehicleDocs.warning} type="warning" />
            <StatCard title="Vigentes" count={vehicleDocs.valid} type="valid" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-medium mb-4">Documentos de Conductores</h3>
          <div className="grid grid-cols-3 gap-2">
            <StatCard title="Vencidos" count={driverDocs.expired} type="expired" />
            <StatCard title="Por Vencer" count={driverDocs.warning} type="warning" />
            <StatCard title="Vigentes" count={driverDocs.valid} type="valid" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;

// DONE