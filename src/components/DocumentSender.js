import React, { useState, useEffect } from 'react';
import { getDocument } from '../mock/documents'; // Importar la función para obtener documento

const DocumentSender = ({ vehicles, drivers, searchTerm }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'driver', 'semi', 'tractor'
  const [sendMethod, setSendMethod] = useState('email'); // 'email' or 'whatsapp'
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [displayItems, setDisplayItems] = useState([]);

  const allItems = [
    ...drivers.map(d => ({ ...d, itemType: 'driver' })),
    ...vehicles.map(v => ({ ...v, itemType: 'vehicle' }))
  ];

  useEffect(() => {
    const filtered = allItems.filter(item => {
      const matchesFilterType = filterType === 'all' || 
                                 (item.itemType === 'driver' && filterType === 'driver') ||
                                 (item.itemType === 'vehicle' && item.type === filterType);
      
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = item.itemType === 'vehicle' 
                            ? item.plate.toLowerCase().includes(searchTermLower) || item.brand.toLowerCase().includes(searchTermLower) || item.model.toLowerCase().includes(searchTermLower) || item.type.toLowerCase().includes(searchTermLower)
                            : item.name.toLowerCase().includes(searchTermLower) || item.licenseId.toLowerCase().includes(searchTermLower) || item.phone.toLowerCase().includes(searchTermLower);

      return matchesFilterType && matchesSearch;
    });
    setDisplayItems(filtered);
  }, [filterType, vehicles, drivers, searchTerm]); // Dependencias para recalcular la lista

  const handleSelectItem = (item) => {
    const itemIdentifier = `${item.itemType}-${item.id}`;
    setSelectedItems(prevSelected => {
      if (prevSelected.some(selected => `${selected.itemType}-${selected.id}` === itemIdentifier)) {
        return prevSelected.filter(selected => `${selected.itemType}-${selected.id}` !== itemIdentifier);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleSend = async () => {
    if (selectedItems.length === 0) {
      alert('Debe seleccionar al menos un vehículo o conductor para enviar.');
      return;
    }
    if (!recipient) {
      alert('Debe ingresar un destinatario.');
      return;
    }

    setIsSending(true);

    const documentsToSend = selectedItems.flatMap(item => {
      return Object.entries(item.documents)
        .filter(([docType, doc]) => doc.file) // Solo documentos con archivo adjunto
        .map(([docType, doc]) => ({
          fileName: doc.file,
          docName: docType, // Usar nombre técnico para simplificar
          itemIdentifier: item.itemType === 'vehicle' ? item.plate : item.name,
          fileData: getDocument(doc.file) // Obtener los datos del archivo
        }));
    });

    if (documentsToSend.length === 0) {
      alert('Los elementos seleccionados no tienen archivos adjuntos.');
      setIsSending(false);
      return;
    }

    // En un proyecto real, necesitarías un backend para manejar adjuntos en mailto o WhatsApp API.
    // La API mailto: no soporta adjuntos directamente por seguridad.
    // WhatsApp Web/App soporta compartir archivos, pero no desde un enlace simple con múltiples adjuntos.
    // Esta simulación solo prellenará los campos de texto y mostrará un mensaje informativo.

    if (sendMethod === 'email') {
      const subject = 'Documentos de Legajo Digital';
      const body = `Adjunto los siguientes documentos:\n\n${documentsToSend.map(d => `- ${d.docName} de ${d.itemIdentifier}`).join('\n')}\n\n${message}`;
      
      const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.location.href = mailtoLink;
      alert(`Se abrirá su cliente de correo predeterminado con los campos prellenados.\n\nPor favor, adjunte manualmente los siguientes archivos:\n${documentsToSend.map(d => `- ${d.fileName}`).join('\n')}`);

    } else if (sendMethod === 'whatsapp') {
      const text = `Adjunto documentos de Legajo Digital:\n\n${documentsToSend.map(d => `- ${d.docName} de ${d.itemIdentifier}`).join('\n')}\n\n${message}`;
      // Usar el enlace wa.me para abrir WhatsApp con el mensaje prellenado
      window.open(`https://wa.me/${recipient}?text=${encodeURIComponent(text)}`, '_blank');
      alert(`Se abrirá WhatsApp con el mensaje prellenado.\n\nPor favor, adjunte manualmente los siguientes archivos:\n${documentsToSend.map(d => `- ${d.fileName}`).join('\n')}`);
    }

    setIsSending(false);
    setSelectedItems([]);
    setRecipient('');
    setMessage('');
  };

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Enviar Documentos</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-md transition-colors text-sm uppercase tracking-wide ${filterType === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterType('driver')}
          className={`px-4 py-2 rounded-md transition-colors text-sm uppercase tracking-wide ${filterType === 'driver' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Conductores
        </button>
        <button
          onClick={() => setFilterType('semi')}
          className={`px-4 py-2 rounded-md transition-colors text-sm uppercase tracking-wide ${filterType === 'semi' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Semi
        </button>
        <button
          onClick={() => setFilterType('tractor')}
          className={`px-4 py-2 rounded-md transition-colors text-sm uppercase tracking-wide ${filterType === 'tractor' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Tractor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {displayItems.length === 0 ? (
          <p className="text-gray-600">No hay elementos que coincidan con los filtros.</p>
        ) : (
          displayItems.map(item => {
            const itemIdentifier = `${item.itemType}-${item.id}`;
            const isSelected = selectedItems.some(selected => `${selected.itemType}-${selected.id}` === itemIdentifier);
            return (
              <div 
                key={itemIdentifier} 
                className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${isSelected ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white"
                  />
                  <div>
                    <h3 className="font-bold uppercase tracking-wide">{item.itemType === 'vehicle' ? item.plate : item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.itemType === 'vehicle' ? `${item.brand} ${item.model} - ${item.type}` : item.licenseId}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide">Elementos Seleccionados para Enviar ({selectedItems.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedItems.map(item => (
              <div key={`${item.itemType}-${item.id}`} className="bg-gray-100 rounded-md p-3 text-sm text-gray-700">
                {item.itemType === 'vehicle' ? item.plate : item.name} ({item.itemType === 'vehicle' ? item.type : 'Conductor'})
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wide">
              Método de Envío
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={sendMethod === 'email'}
                  onChange={() => setSendMethod('email')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-white border-gray-300"
                />
                <span className="ml-2 text-gray-700">Email</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="whatsapp"
                  checked={sendMethod === 'whatsapp'}
                  onChange={() => setSendMethod('whatsapp')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-white border-gray-300"
                />
                <span className="ml-2 text-gray-700">WhatsApp</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wide">
              {sendMethod === 'email' ? 'Email del destinatario' : 'Número de WhatsApp'}
            </label>
            <input
              type={sendMethod === 'email' ? 'email' : 'tel'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              placeholder={sendMethod === 'email' ? 'ejemplo@mail.com' : '+5491123456789'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wide">
              Mensaje (opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 resize-none"
              placeholder="Escribe un mensaje para acompañar los documentos..."
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || selectedItems.length === 0 || !recipient}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors uppercase tracking-wide shadow-md"
          >
            {isSending ? 'Preparando Envío...' : 'Enviar Documentos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentSender;