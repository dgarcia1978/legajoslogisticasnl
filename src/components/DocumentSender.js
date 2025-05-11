import React, { useState } from 'react';
import { getDocument } from '../mock/documents'; // Importar la función para obtener documento

const DocumentSender = ({ vehicles, drivers }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'driver', 'semi', 'tractor'
  const [sendMethod, setSendMethod] = useState('email'); // 'email' or 'whatsapp'
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const allItems = [
    ...drivers.map(d => ({ ...d, itemType: 'driver' })),
    ...vehicles.map(v => ({ ...v, itemType: 'vehicle' }))
  ];

  const filteredItems = allItems.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'driver' && item.itemType === 'driver') return true;
    if (filterType === 'semi' && item.itemType === 'vehicle' && item.type === 'SEMI') return true;
    if (filterType === 'tractor' && item.itemType === 'vehicle' && item.type === 'TRACTOR') return true;
    return false;
  });

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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Enviar Documentos</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterType('driver')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filterType === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Conductores
        </button>
        <button
          onClick={() => setFilterType('semi')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filterType === 'semi' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Semi
        </button>
        <button
          onClick={() => setFilterType('tractor')}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${filterType === 'tractor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Tractor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredItems.length === 0 ? (
          <p className="text-gray-600">No hay elementos que coincidan con los filtros.</p>
        ) : (
          filteredItems.map(item => {
            const itemIdentifier = `${item.itemType}-${item.id}`;
            const isSelected = selectedItems.some(selected => `${selected.itemType}-${selected.id}` === itemIdentifier);
            return (
              <div 
                key={itemIdentifier} 
                className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="font-bold">{item.itemType === 'vehicle' ? item.plate : item.name}</h3>
                    <p className="text-sm text-gray-600">
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
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold">Elementos Seleccionados para Enviar ({selectedItems.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedItems.map(item => (
              <div key={`${item.itemType}-${item.id}`} className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                {item.itemType === 'vehicle' ? item.plate : item.name} ({item.itemType === 'vehicle' ? item.type : 'Conductor'})
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Envío
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={sendMethod === 'email'}
                  onChange={() => setSendMethod('email')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="whatsapp"
                  checked={sendMethod === 'whatsapp'}
                  onChange={() => setSendMethod('whatsapp')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">WhatsApp</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {sendMethod === 'email' ? 'Email del destinatario' : 'Número de WhatsApp'}
            </label>
            <input
              type={sendMethod === 'email' ? 'email' : 'tel'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={sendMethod === 'email' ? 'ejemplo@mail.com' : '+5491123456789'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje (opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escribe un mensaje para acompañar los documentos..."
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || selectedItems.length === 0 || !recipient}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Preparando Envío...' : 'Enviar Documentos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentSender;

// DONE