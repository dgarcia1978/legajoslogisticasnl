export const drivers = [
  {
    id: 1,
    name: 'Juan Pérez',
    licenseId: 'DL-12345678',
    documents: {
      dni: { file: 'dni_juan.pdf' },
      art: { expiry: '15/09/2023', file: 'art_juan.pdf' },
      licencia: { expiry: '10/07/2025', file: 'licencia_juan.pdf' }
    },
    phone: '555-123-4567'
  },
  {
    id: 2,
    name: 'María García',
    licenseId: 'DL-87654321',
    documents: {
      dni: { file: 'dni_maria.pdf' },
      art: { expiry: '30/10/2023', file: 'art_maria.pdf' },
      licencia: { expiry: 'Vencida', file: 'licencia_maria.pdf' }
    },
    phone: '555-987-6543'
  }
];