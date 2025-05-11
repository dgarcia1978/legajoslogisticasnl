import React, { useEffect, useState } from 'react';
import { formatDateToYYYYMMDD } from '../utils/formatters';

const ReportsSection = ({ vehicles, drivers, searchTerm }) => {
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

  const countDocuments = (items) => {
    let expired = 0;
    let warning = 0;
    let valid = 0;
    let noExpiry = 0;

    items.forEach(item => {
      Object.entries(item.documents).forEach(([docType, doc]) => {
        const hasExpiryField = documentsWithExpiry.includes(docType);
        
        if (hasExpiryField) {
          if (doc.expiry) {
            const status = getExpiryStatus(doc.expiry);
            if (status === 'expired') expired++;
            if (status === 'warning') warning++;
            if (status === 'valid') valid++;
          } else {
            noExpiry++;
          }
        }
      });
    });

    return { expired, warning, valid, noExpiry };
  };

  const [vehicleDocs, setVehicleDocs] = useState({ expired: 0, warning: 0, valid: 0, noExpiry: 0 });
  const [driverDocs, setDriverDocs] = useState({ expired: 0, warning: 0, valid: 0, noExpiry: 0 });
  const [totalDocs, setTotalDocs] = useState({ expired: 0, warning: 0, valid: 0, noExpiry: 0 });

  useEffect(() => {
    // Filtering logic for reports based on search term is complex as it aggregates counts.
    // For simplicity in this example, reports will show counts for ALL items,
    // regardless of the search term applied to the list views.
    // A more complex implementation would filter items *before* counting.

    const vehicleCounts = countDocuments(vehicles);
    const driverCounts = countDocuments(drivers);
    
    setVehicleDocs(vehicleCounts);
    setDriverDocs(driverCounts);
    setTotalDocs({
      expired: vehicleCounts.expired + driverCounts.expired,
      warning: vehicleCounts.warning + driverCounts.warning,
      valid: vehicleCounts.valid + driverCounts.valid,
      noExpiry: vehicleCounts.noExpiry + driverCounts.noExpiry
    });
  }, [vehicles, drivers]); // Recalcular cuando cambian vehicles o drivers

  const StatCard = ({ title, count, type }) => (
    <div className="bg-white p-4 rounded-xl shadow-md text-gray-800">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${
        type === 'expired' ? 'text-red-600' : 
        type === 'warning' ? 'text-yellow-600' : 
        type === 'noExpiry' ? 'text-gray-600' : 'text-green-600'
      }`}>
        {count}
      </p>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Reporte de Documentos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Vencidos" count={totalDocs.expired} type="expired" />
        <StatCard title="Por Vencer (10 días)" count={totalDocs.warning} type="warning" />
        <StatCard title="Vigentes" count={totalDocs.valid} type="valid" />
        <StatCard title="Sin Fecha Vencimiento" count={totalDocs.noExpiry} type="noExpiry" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-gray-800">
          <h3 className="font-medium mb-4 uppercase tracking-wide">Documentos de Vehículos</h3>
          <div className="grid grid-cols-4 gap-2">
            <StatCard title="Vencidos" count={vehicleDocs.expired} type="expired" />
            <StatCard title="Por Vencer" count={vehicleDocs.warning} type="warning" />
            <StatCard title="Vigentes" count={vehicleDocs.valid} type="valid" />
            <StatCard title="Sin Fecha" count={vehicleDocs.noExpiry} type="noExpiry" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md text-gray-800">
          <h3 className="font-medium mb-4 uppercase tracking-wide">Documentos de Conductores</h3>
          <div className="grid grid-cols-4 gap-2">
            <StatCard title="Vencidos" count={driverDocs.expired} type="expired" />
            <StatCard title="Por Vencer" count={driverDocs.warning} type="warning" />
            <StatCard title="Vigentes" count={driverDocs.valid} type="valid" />
            <StatCard title="Sin Fecha" count={driverDocs.noExpiry} type="noExpiry" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;