export const vehicles = [
  {
    id: 1,
    plate: 'ABC1234',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2021,
    type: 'SEMI',
    status: 'active',
    documents: {
      cedulaVerde: { file: 'cedula_abc1234.pdf' },
      seguro: { expiry: '30/11/2023', file: 'seguro_abc1234.pdf' },
      vtv: { expiry: '15/06/2024', file: 'vtv_abc1234.pdf' }
    }
  },
  {
    id: 2,
    plate: 'XYZ7890',
    brand: 'Nissan',
    model: 'Sentra',
    year: 2019,
    type: 'TRACTOR',
    status: 'active',
    documents: {
      cedulaVerde: { file: 'cedula_xyz7890.pdf' },
      seguro: { expiry: '15/12/2023', file: 'seguro_xyz7890.pdf' },
      vtv: { expiry: '22/08/2023', file: 'vtv_xyz7890.pdf' }
    }
  }
];