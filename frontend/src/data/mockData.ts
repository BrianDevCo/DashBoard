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
  realTimeMetrics: [
    { id: '1', timestamp: '2024-01-15T10:30:00Z', kWhD: 1250, kVarhD: 320, kWhR: 50, kVarhR: 15, kVarhPenalized: 25, obisCode: '1.8.0', meterId: 'M001', location: 'Planta Norte' },
    { id: '2', timestamp: '2024-01-15T10:30:00Z', kWhD: 980, kVarhD: 280, kWhR: 30, kVarhR: 10, kVarhPenalized: 20, obisCode: '1.8.0', meterId: 'M002', location: 'Oficinas Centrales' },
    { id: '3', timestamp: '2024-01-15T10:30:00Z', kWhD: 2100, kVarhD: 450, kWhR: 80, kVarhR: 25, kVarhPenalized: 35, obisCode: '1.8.0', meterId: 'M003', location: 'Centro de Datos' }
  ],
  energySummary: {
    totalImported: 1250000,
    totalExported: 45000,
    totalReactive: 320000,
    totalPenalized: 25000,
    efficiency: 87.5,
    cost: 75000000,
    savings: 1250000,
    powerFactor: 0.92,
    reactivePercentage: 25.6,
    maxDemand: 4800,
    avgDemand: 2600,
    minDemand: 1200
  },
  alerts: [
    { id: 1, type: 'warning', message: 'Consumo alto en hora pico', timestamp: '2024-01-01T19:00:00Z', severity: 'medium', resolved: false },
    { id: 2, type: 'info', message: 'Factor de potencia optimizado', timestamp: '2024-01-01T15:30:00Z', severity: 'low', resolved: true },
    { id: 3, type: 'success', message: 'Meta de eficiencia alcanzada', timestamp: '2024-01-01T12:00:00Z', severity: 'low', resolved: true }
  ],
  clients: [
    { id: 1, name: 'Cliente A', consumption: 25000, efficiency: 88.5 },
    { id: 2, name: 'Cliente B', consumption: 18000, efficiency: 82.3 },
    { id: 3, name: 'Cliente C', consumption: 32000, efficiency: 91.2 },
    { id: 4, name: 'Cliente D', consumption: 15000, efficiency: 79.8 }
  ]
};

// Datos ejecutivos expandidos
export const mockExecutiveData = {
  summary: {
    totalEnergy: 1250000,
    totalCost: 75000000,
    efficiency: 87.5,
    savings: 1250000,
    co2Reduction: 450
  },
  trends: [
    { period: 'Enero', consumption: 1200000, cost: 72000000, efficiency: 85.2 },
    { period: 'Febrero', consumption: 1150000, cost: 69000000, efficiency: 86.8 },
    { period: 'Marzo', consumption: 1300000, cost: 78000000, efficiency: 88.1 },
    { period: 'Abril', consumption: 1250000, cost: 75000000, efficiency: 87.5 },
    { period: 'Mayo', consumption: 1350000, cost: 81000000, efficiency: 89.2 },
    { period: 'Junio', consumption: 1400000, cost: 84000000, efficiency: 90.1 }
  ],
  topConsumers: [
    { name: 'Planta Industrial Norte', consumption: 450000, efficiency: 92.3, trend: 'up' },
    { name: 'Oficinas Centrales', consumption: 320000, efficiency: 88.7, trend: 'down' },
    { name: 'Centro de Datos', consumption: 280000, efficiency: 85.4, trend: 'stable' },
    { name: 'Almacén Principal', consumption: 200000, efficiency: 82.1, trend: 'up' }
  ],
  alerts: [
    { id: 1, severity: 'high', message: 'Pico de demanda excedido en Planta Norte', time: '14:30' },
    { id: 2, severity: 'medium', message: 'Factor de potencia bajo en Centro de Datos', time: '10:15' },
    { id: 3, severity: 'low', message: 'Mantenimiento programado completado', time: '08:00' }
  ]
};

// Datos de KPIs
export const mockKPIData = {
  energyMetrics: [
    { name: 'Consumo Total', value: 1250000, unit: 'kWh', trend: 5.2, target: 1200000 },
    { name: 'Costo Total', value: 75000000, unit: 'COP', trend: 3.8, target: 70000000 },
    { name: 'Eficiencia', value: 87.5, unit: '%', trend: 2.1, target: 85 },
    { name: 'Factor de Potencia', value: 0.92, unit: '', trend: -1.2, target: 0.95 }
  ],
  consumptionByCategory: [
    { category: 'Iluminación', consumption: 350000, percentage: 28 },
    { category: 'Climatización', consumption: 420000, percentage: 33.6 },
    { category: 'Equipos', consumption: 300000, percentage: 24 },
    { category: 'Otros', consumption: 180000, percentage: 14.4 }
  ],
  peakDemandRecords: [
    { date: '2024-01-15', time: '19:30', demand: 4500, location: 'Planta Norte' },
    { date: '2024-01-14', time: '18:45', demand: 4200, location: 'Oficinas Centrales' },
    { date: '2024-01-13', time: '20:15', demand: 4800, location: 'Centro de Datos' }
  ],
  reactiveEnergyRatio: [
    { period: 'Enero', ratio: 0.25, target: 0.20 },
    { period: 'Febrero', ratio: 0.23, target: 0.20 },
    { period: 'Marzo', ratio: 0.22, target: 0.20 },
    { period: 'Abril', ratio: 0.21, target: 0.20 }
  ]
};

// Datos de alertas
export const mockAlertsData = {
  activeAlerts: [
    { id: 1, type: 'energy', severity: 'high', message: 'Consumo excesivo en hora pico', location: 'Planta Norte', time: '19:30' },
    { id: 2, type: 'efficiency', severity: 'medium', message: 'Factor de potencia bajo', location: 'Centro de Datos', time: '14:15' },
    { id: 3, type: 'maintenance', severity: 'low', message: 'Mantenimiento programado', location: 'Oficinas Centrales', time: '08:00' }
  ],
  alertRules: [
    { id: 1, name: 'Pico de Demanda', condition: 'Consumo > 4000 kWh', severity: 'high', active: true },
    { id: 2, name: 'Factor de Potencia', condition: 'FP < 0.85', severity: 'medium', active: true },
    { id: 3, name: 'Eficiencia Baja', condition: 'Eficiencia < 80%', severity: 'low', active: false }
  ]
};

// Datos de usuarios
export const mockUsersData = {
  users: [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@cgm.com', role: 'admin', status: 'active', lastLogin: '2024-01-15T10:30:00Z' },
    { id: 2, name: 'María García', email: 'maria.garcia@cgm.com', role: 'operator', status: 'active', lastLogin: '2024-01-15T09:15:00Z' },
    { id: 3, name: 'Carlos López', email: 'carlos.lopez@cgm.com', role: 'viewer', status: 'inactive', lastLogin: '2024-01-10T16:45:00Z' },
    { id: 4, name: 'Ana Rodríguez', email: 'ana.rodriguez@cgm.com', role: 'operator', status: 'active', lastLogin: '2024-01-15T11:20:00Z' }
  ],
  roles: [
    { id: 1, name: 'Administrador', permissions: ['read', 'write', 'delete', 'admin'] },
    { id: 2, name: 'Operador', permissions: ['read', 'write'] },
    { id: 3, name: 'Visualizador', permissions: ['read'] }
  ]
};

// Datos de reportes
export const mockReportsData = {
  templates: [
    { id: 1, name: 'Reporte Mensual', description: 'Resumen de consumo mensual', type: 'monthly', lastUsed: '2024-01-01' },
    { id: 2, name: 'Análisis de Eficiencia', description: 'Análisis detallado de eficiencia energética', type: 'analysis', lastUsed: '2024-01-10' },
    { id: 3, name: 'Alertas del Sistema', description: 'Reporte de alertas y notificaciones', type: 'alerts', lastUsed: '2024-01-15' }
  ],
  scheduledReports: [
    { id: 1, name: 'Reporte Semanal', frequency: 'weekly', recipients: ['admin@cgm.com'], status: 'active' },
    { id: 2, name: 'Resumen Mensual', frequency: 'monthly', recipients: ['director@cgm.com'], status: 'active' }
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
