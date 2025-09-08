// Datos de ejemplo para el dashboard energético
export const mockEnergyData = {
  consumption: [
    { date: '2024-01-01', hour: 1, active: 1200, reactive: 300, total: 1500 },
    { date: '2024-01-01', hour: 2, active: 1100, reactive: 280, total: 1380 },
    { date: '2024-01-01', hour: 3, active: 1000, reactive: 250, total: 1250 },
    { date: '2024-01-01', hour: 4, active: 950, reactive: 240, total: 1190 },
    { date: '2024-01-01', hour: 5, active: 900, reactive: 230, total: 1130 },
    { date: '2024-01-01', hour: 6, active: 1000, reactive: 250, total: 1250 },
    { date: '2024-01-01', hour: 7, active: 1300, reactive: 320, total: 1620 },
    { date: '2024-01-01', hour: 8, active: 1800, reactive: 450, total: 2250 },
    { date: '2024-01-01', hour: 9, active: 2200, reactive: 550, total: 2750 },
    { date: '2024-01-01', hour: 10, active: 2500, reactive: 625, total: 3125 },
    { date: '2024-01-01', hour: 11, active: 2800, reactive: 700, total: 3500 },
    { date: '2024-01-01', hour: 12, active: 3000, reactive: 750, total: 3750 },
    { date: '2024-01-01', hour: 13, active: 2900, reactive: 725, total: 3625 },
    { date: '2024-01-01', hour: 14, active: 2700, reactive: 675, total: 3375 },
    { date: '2024-01-01', hour: 15, active: 2600, reactive: 650, total: 3250 },
    { date: '2024-01-01', hour: 16, active: 2800, reactive: 700, total: 3500 },
    { date: '2024-01-01', hour: 17, active: 3200, reactive: 800, total: 4000 },
    { date: '2024-01-01', hour: 18, active: 3500, reactive: 875, total: 4375 },
    { date: '2024-01-01', hour: 19, active: 3800, reactive: 950, total: 4750 },
    { date: '2024-01-01', hour: 20, active: 3600, reactive: 900, total: 4500 },
    { date: '2024-01-01', hour: 21, active: 3000, reactive: 750, total: 3750 },
    { date: '2024-01-01', hour: 22, active: 2200, reactive: 550, total: 2750 },
    { date: '2024-01-01', hour: 23, active: 1800, reactive: 450, total: 2250 },
    { date: '2024-01-01', hour: 24, active: 1500, reactive: 375, total: 1875 }
  ],
  kpis: {
    totalConsumption: 62500,
    averageConsumption: 2604,
    maxConsumption: 4750,
    minConsumption: 1130,
    peakHour: 19,
    efficiency: 85.2
  },
  alerts: [
    { id: 1, type: 'warning', message: 'Consumo alto en hora pico', timestamp: '2024-01-01T19:00:00Z' },
    { id: 2, type: 'info', message: 'Factor de potencia optimizado', timestamp: '2024-01-01T15:30:00Z' },
    { id: 3, type: 'success', message: 'Meta de eficiencia alcanzada', timestamp: '2024-01-01T12:00:00Z' }
  ],
  clients: [
    { id: 1, name: 'Cliente A', consumption: 25000, efficiency: 88.5 },
    { id: 2, name: 'Cliente B', consumption: 18000, efficiency: 82.3 },
    { id: 3, name: 'Cliente C', consumption: 32000, efficiency: 91.2 },
    { id: 4, name: 'Cliente D', consumption: 15000, efficiency: 79.8 }
  ]
};

export const mockHistoricalData = [
  { month: 'Enero', consumption: 750000, cost: 45000000 },
  { month: 'Febrero', consumption: 720000, cost: 43200000 },
  { month: 'Marzo', consumption: 780000, cost: 46800000 },
  { month: 'Abril', consumption: 760000, cost: 45600000 },
  { month: 'Mayo', consumption: 800000, cost: 48000000 },
  { month: 'Junio', consumption: 820000, cost: 49200000 }
];

export const mockComparativeData = {
  current: { consumption: 62500, cost: 3750000 },
  previous: { consumption: 58000, cost: 3480000 },
  variation: { consumption: 7.8, cost: 7.8 }
};
