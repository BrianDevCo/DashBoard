// Datos simulados para el dashboard ejecutivo
export const mockExecutiveData = {
  summary: {
    totalEnergy: 1250000,
    totalCost: 75000000,
    efficiency: 87.5,
    savings: 1250000,
    co2Reduction: 450,
    powerFactor: 0.92,
    peakDemand: 4800,
    avgDemand: 2600
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
  ],
  kpis: [
    { id: '1', title: 'Consumo Total', value: 1250000, unit: 'kWh', change: 5.2, changeType: 'increase' as const, trend: 'up' as const, period: 'mes', target: 1200000, status: 'warning' as const, icon: '⚡', color: '#2196f3', description: 'Consumo total de energía activa', lastUpdated: '2024-01-15T10:30:00Z' },
    { id: '2', title: 'Costo Total', value: 75000000, unit: 'COP', change: 3.8, changeType: 'increase' as const, trend: 'up' as const, period: 'mes', target: 70000000, status: 'warning' as const, icon: '💰', color: '#4caf50', description: 'Costo total de la energía', lastUpdated: '2024-01-15T10:30:00Z' },
    { id: '3', title: 'Eficiencia', value: 87.5, unit: '%', change: 2.1, changeType: 'increase' as const, trend: 'up' as const, period: 'mes', target: 85, status: 'good' as const, icon: '🎯', color: '#ff9800', description: 'Eficiencia energética promedio', lastUpdated: '2024-01-15T10:30:00Z' },
    { id: '4', title: 'Factor de Potencia', value: 0.92, unit: '', change: -1.2, changeType: 'decrease' as const, trend: 'down' as const, period: 'mes', target: 0.95, status: 'warning' as const, icon: '⚡', color: '#9c27b0', description: 'Factor de potencia promedio', lastUpdated: '2024-01-15T10:30:00Z' }
  ],
  consumptionByCategory: [
    { category: 'Iluminación', consumption: 350000, percentage: 28, color: '#1976d2' },
    { category: 'Climatización', consumption: 420000, percentage: 33.6, color: '#2e7d32' },
    { category: 'Equipos', consumption: 300000, percentage: 24, color: '#ed6c02' },
    { category: 'Otros', consumption: 180000, percentage: 14.4, color: '#d32f2f' }
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
