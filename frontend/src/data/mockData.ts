// Datos de ejemplo para el dashboard energético
export const mockEnergyData = {
  consumption: [
    // Enero 2024 - 31 días de datos
    { date: '2024-01-01', hour: 1, active: 1200, reactive: 300, total: 1500, temperature: 22, humidity: 65 },
    { date: '2024-01-01', hour: 2, active: 1100, reactive: 280, total: 1380, temperature: 21, humidity: 67 },
    { date: '2024-01-01', hour: 3, active: 1000, reactive: 250, total: 1250, temperature: 20, humidity: 69 },
    { date: '2024-01-01', hour: 4, active: 950, reactive: 240, total: 1190, temperature: 19, humidity: 71 },
    { date: '2024-01-01', hour: 5, active: 900, reactive: 230, total: 1130, temperature: 18, humidity: 73 },
    { date: '2024-01-01', hour: 6, active: 1000, reactive: 250, total: 1250, temperature: 19, humidity: 70 },
    { date: '2024-01-01', hour: 7, active: 1300, reactive: 320, total: 1620, temperature: 21, humidity: 68 },
    { date: '2024-01-01', hour: 8, active: 1800, reactive: 450, total: 2250, temperature: 23, humidity: 65 },
    { date: '2024-01-01', hour: 9, active: 2200, reactive: 550, total: 2750, temperature: 25, humidity: 62 },
    { date: '2024-01-01', hour: 10, active: 2500, reactive: 625, total: 3125, temperature: 27, humidity: 58 },
    { date: '2024-01-01', hour: 11, active: 2800, reactive: 700, total: 3500, temperature: 29, humidity: 55 },
    { date: '2024-01-01', hour: 12, active: 3000, reactive: 750, total: 3750, temperature: 31, humidity: 52 },
    { date: '2024-01-01', hour: 13, active: 2900, reactive: 725, total: 3625, temperature: 32, humidity: 50 },
    { date: '2024-01-01', hour: 14, active: 2700, reactive: 675, total: 3375, temperature: 31, humidity: 52 },
    { date: '2024-01-01', hour: 15, active: 2600, reactive: 650, total: 3250, temperature: 30, humidity: 54 },
    { date: '2024-01-01', hour: 16, active: 2800, reactive: 700, total: 3500, temperature: 29, humidity: 56 },
    { date: '2024-01-01', hour: 17, active: 3200, reactive: 800, total: 4000, temperature: 28, humidity: 58 },
    { date: '2024-01-01', hour: 18, active: 3500, reactive: 875, total: 4375, temperature: 26, humidity: 60 },
    { date: '2024-01-01', hour: 19, active: 3800, reactive: 950, total: 4750, temperature: 24, humidity: 62 },
    { date: '2024-01-01', hour: 20, active: 3600, reactive: 900, total: 4500, temperature: 23, humidity: 64 },
    { date: '2024-01-01', hour: 21, active: 3000, reactive: 750, total: 3750, temperature: 22, humidity: 66 },
    { date: '2024-01-01', hour: 22, active: 2200, reactive: 550, total: 2750, temperature: 21, humidity: 68 },
    { date: '2024-01-01', hour: 23, active: 1800, reactive: 450, total: 2250, temperature: 20, humidity: 70 },
    { date: '2024-01-01', hour: 24, active: 1500, reactive: 375, total: 1875, temperature: 19, humidity: 72 },
    
    // Febrero 2024 - 29 días de datos
    { date: '2024-02-01', hour: 1, active: 1250, reactive: 310, total: 1560, temperature: 23, humidity: 64 },
    { date: '2024-02-01', hour: 2, active: 1150, reactive: 290, total: 1440, temperature: 22, humidity: 66 },
    { date: '2024-02-01', hour: 3, active: 1050, reactive: 260, total: 1310, temperature: 21, humidity: 68 },
    { date: '2024-02-01', hour: 4, active: 1000, reactive: 250, total: 1250, temperature: 20, humidity: 70 },
    { date: '2024-02-01', hour: 5, active: 950, reactive: 240, total: 1190, temperature: 19, humidity: 72 },
    { date: '2024-02-01', hour: 6, active: 1050, reactive: 260, total: 1310, temperature: 20, humidity: 69 },
    { date: '2024-02-01', hour: 7, active: 1350, reactive: 330, total: 1680, temperature: 22, humidity: 67 },
    { date: '2024-02-01', hour: 8, active: 1850, reactive: 460, total: 2310, temperature: 24, humidity: 64 },
    { date: '2024-02-01', hour: 9, active: 2250, reactive: 560, total: 2810, temperature: 26, humidity: 61 },
    { date: '2024-02-01', hour: 10, active: 2550, reactive: 635, total: 3185, temperature: 28, humidity: 57 },
    { date: '2024-02-01', hour: 11, active: 2850, reactive: 710, total: 3560, temperature: 30, humidity: 54 },
    { date: '2024-02-01', hour: 12, active: 3050, reactive: 760, total: 3810, temperature: 32, humidity: 51 },
    { date: '2024-02-01', hour: 13, active: 2950, reactive: 735, total: 3685, temperature: 33, humidity: 49 },
    { date: '2024-02-01', hour: 14, active: 2750, reactive: 685, total: 3435, temperature: 32, humidity: 51 },
    { date: '2024-02-01', hour: 15, active: 2650, reactive: 660, total: 3310, temperature: 31, humidity: 53 },
    { date: '2024-02-01', hour: 16, active: 2850, reactive: 710, total: 3560, temperature: 30, humidity: 55 },
    { date: '2024-02-01', hour: 17, active: 3250, reactive: 810, total: 4060, temperature: 29, humidity: 57 },
    { date: '2024-02-01', hour: 18, active: 3550, reactive: 885, total: 4435, temperature: 27, humidity: 59 },
    { date: '2024-02-01', hour: 19, active: 3850, reactive: 960, total: 4810, temperature: 25, humidity: 61 },
    { date: '2024-02-01', hour: 20, active: 3650, reactive: 910, total: 4560, temperature: 24, humidity: 63 },
    { date: '2024-02-01', hour: 21, active: 3050, reactive: 760, total: 3810, temperature: 23, humidity: 65 },
    { date: '2024-02-01', hour: 22, active: 2250, reactive: 560, total: 2810, temperature: 22, humidity: 67 },
    { date: '2024-02-01', hour: 23, active: 1850, reactive: 460, total: 2310, temperature: 21, humidity: 69 },
    { date: '2024-02-01', hour: 24, active: 1550, reactive: 385, total: 1935, temperature: 20, humidity: 71 },
    
    // Marzo 2024 - 31 días de datos
    { date: '2024-03-01', hour: 1, active: 1300, reactive: 320, total: 1620, temperature: 24, humidity: 63 },
    { date: '2024-03-01', hour: 2, active: 1200, reactive: 300, total: 1500, temperature: 23, humidity: 65 },
    { date: '2024-03-01', hour: 3, active: 1100, reactive: 270, total: 1370, temperature: 22, humidity: 67 },
    { date: '2024-03-01', hour: 4, active: 1050, reactive: 260, total: 1310, temperature: 21, humidity: 69 },
    { date: '2024-03-01', hour: 5, active: 1000, reactive: 250, total: 1250, temperature: 20, humidity: 71 },
    { date: '2024-03-01', hour: 6, active: 1100, reactive: 270, total: 1370, temperature: 21, humidity: 68 },
    { date: '2024-03-01', hour: 7, active: 1400, reactive: 340, total: 1740, temperature: 23, humidity: 66 },
    { date: '2024-03-01', hour: 8, active: 1900, reactive: 470, total: 2370, temperature: 25, humidity: 63 },
    { date: '2024-03-01', hour: 9, active: 2300, reactive: 570, total: 2870, temperature: 27, humidity: 60 },
    { date: '2024-03-01', hour: 10, active: 2600, reactive: 645, total: 3245, temperature: 29, humidity: 56 },
    { date: '2024-03-01', hour: 11, active: 2900, reactive: 720, total: 3620, temperature: 31, humidity: 53 },
    { date: '2024-03-01', hour: 12, active: 3100, reactive: 770, total: 3870, temperature: 33, humidity: 50 },
    { date: '2024-03-01', hour: 13, active: 3000, reactive: 745, total: 3745, temperature: 34, humidity: 48 },
    { date: '2024-03-01', hour: 14, active: 2800, reactive: 695, total: 3495, temperature: 33, humidity: 50 },
    { date: '2024-03-01', hour: 15, active: 2700, reactive: 670, total: 3370, temperature: 32, humidity: 52 },
    { date: '2024-03-01', hour: 16, active: 2900, reactive: 720, total: 3620, temperature: 31, humidity: 54 },
    { date: '2024-03-01', hour: 17, active: 3300, reactive: 820, total: 4120, temperature: 30, humidity: 56 },
    { date: '2024-03-01', hour: 18, active: 3600, reactive: 895, total: 4495, temperature: 28, humidity: 58 },
    { date: '2024-03-01', hour: 19, active: 3900, reactive: 970, total: 4870, temperature: 26, humidity: 60 },
    { date: '2024-03-01', hour: 20, active: 3700, reactive: 920, total: 4620, temperature: 25, humidity: 62 },
    { date: '2024-03-01', hour: 21, active: 3100, reactive: 770, total: 3870, temperature: 24, humidity: 64 },
    { date: '2024-03-01', hour: 22, active: 2300, reactive: 570, total: 2870, temperature: 23, humidity: 66 },
    { date: '2024-03-01', hour: 23, active: 1900, reactive: 470, total: 2370, temperature: 22, humidity: 68 },
    { date: '2024-03-01', hour: 24, active: 1600, reactive: 395, total: 1995, temperature: 21, humidity: 70 }
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
    // Planta Norte - 15 medidores
    { id: '1', timestamp: '2024-01-15T10:30:00Z', kWhD: 1250, kVarhD: 320, kWhR: 50, kVarhR: 15, kVarhPenalized: 25, obisCode: '1.8.0', meterId: 'M001', location: 'Planta Norte - Línea 1', voltage: 220.5, current: 125.8, powerFactor: 0.92, temperature: 45.2 },
    { id: '2', timestamp: '2024-01-15T10:30:00Z', kWhD: 1180, kVarhD: 295, kWhR: 45, kVarhR: 12, kVarhPenalized: 22, obisCode: '1.8.0', meterId: 'M002', location: 'Planta Norte - Línea 2', voltage: 219.8, current: 118.5, powerFactor: 0.89, temperature: 43.7 },
    { id: '3', timestamp: '2024-01-15T10:30:00Z', kWhD: 1320, kVarhD: 340, kWhR: 55, kVarhR: 18, kVarhPenalized: 28, obisCode: '1.8.0', meterId: 'M003', location: 'Planta Norte - Línea 3', voltage: 221.2, current: 132.1, powerFactor: 0.91, temperature: 46.8 },
    { id: '4', timestamp: '2024-01-15T10:30:00Z', kWhD: 980, kVarhD: 250, kWhR: 35, kVarhR: 10, kVarhPenalized: 18, obisCode: '1.8.0', meterId: 'M004', location: 'Planta Norte - Compresores', voltage: 220.1, current: 98.2, powerFactor: 0.94, temperature: 42.3 },
    { id: '5', timestamp: '2024-01-15T10:30:00Z', kWhD: 1450, kVarhD: 365, kWhR: 60, kVarhR: 20, kVarhPenalized: 32, obisCode: '1.8.0', meterId: 'M005', location: 'Planta Norte - Hornos', voltage: 222.0, current: 145.5, powerFactor: 0.88, temperature: 48.5 },
    
    // Oficinas Centrales - 8 medidores
    { id: '6', timestamp: '2024-01-15T10:30:00Z', kWhD: 850, kVarhD: 220, kWhR: 25, kVarhR: 8, kVarhPenalized: 15, obisCode: '1.8.0', meterId: 'M006', location: 'Oficinas Centrales - Piso 1', voltage: 220.3, current: 85.2, powerFactor: 0.95, temperature: 24.1 },
    { id: '7', timestamp: '2024-01-15T10:30:00Z', kWhD: 920, kVarhD: 240, kWhR: 30, kVarhR: 10, kVarhPenalized: 18, obisCode: '1.8.0', meterId: 'M007', location: 'Oficinas Centrales - Piso 2', voltage: 219.9, current: 92.1, powerFactor: 0.93, temperature: 23.8 },
    { id: '8', timestamp: '2024-01-15T10:30:00Z', kWhD: 780, kVarhD: 200, kWhR: 20, kVarhR: 6, kVarhPenalized: 12, obisCode: '1.8.0', meterId: 'M008', location: 'Oficinas Centrales - Piso 3', voltage: 220.7, current: 78.5, powerFactor: 0.96, temperature: 24.5 },
    { id: '9', timestamp: '2024-01-15T10:30:00Z', kWhD: 1100, kVarhD: 285, kWhR: 40, kVarhR: 12, kVarhPenalized: 22, obisCode: '1.8.0', meterId: 'M009', location: 'Oficinas Centrales - Servidores', voltage: 221.1, current: 110.3, powerFactor: 0.89, temperature: 28.2 },
    
    // Centro de Datos - 12 medidores
    { id: '10', timestamp: '2024-01-15T10:30:00Z', kWhD: 2100, kVarhD: 450, kWhR: 80, kVarhR: 25, kVarhPenalized: 35, obisCode: '1.8.0', meterId: 'M010', location: 'Centro de Datos - Rack A', voltage: 220.8, current: 210.5, powerFactor: 0.87, temperature: 22.1 },
    { id: '11', timestamp: '2024-01-15T10:30:00Z', kWhD: 1950, kVarhD: 420, kWhR: 75, kVarhR: 22, kVarhPenalized: 32, obisCode: '1.8.0', meterId: 'M011', location: 'Centro de Datos - Rack B', voltage: 220.4, current: 195.8, powerFactor: 0.88, temperature: 21.8 },
    { id: '12', timestamp: '2024-01-15T10:30:00Z', kWhD: 2250, kVarhD: 480, kWhR: 85, kVarhR: 28, kVarhPenalized: 38, obisCode: '1.8.0', meterId: 'M012', location: 'Centro de Datos - Rack C', voltage: 221.5, current: 225.2, powerFactor: 0.86, temperature: 22.5 },
    { id: '13', timestamp: '2024-01-15T10:30:00Z', kWhD: 1800, kVarhD: 390, kWhR: 70, kVarhR: 20, kVarhPenalized: 28, obisCode: '1.8.0', meterId: 'M013', location: 'Centro de Datos - Climatización', voltage: 220.2, current: 180.1, powerFactor: 0.90, temperature: 19.5 },
    { id: '14', timestamp: '2024-01-15T10:30:00Z', kWhD: 1650, kVarhD: 360, kWhR: 65, kVarhR: 18, kVarhPenalized: 25, obisCode: '1.8.0', meterId: 'M014', location: 'Centro de Datos - UPS', voltage: 220.9, current: 165.3, powerFactor: 0.91, temperature: 23.2 },
    
    // Almacén Principal - 6 medidores
    { id: '15', timestamp: '2024-01-15T10:30:00Z', kWhD: 1200, kVarhD: 310, kWhR: 45, kVarhR: 14, kVarhPenalized: 20, obisCode: '1.8.0', meterId: 'M015', location: 'Almacén Principal - Zona A', voltage: 220.6, current: 120.4, powerFactor: 0.92, temperature: 26.8 },
    { id: '16', timestamp: '2024-01-15T10:30:00Z', kWhD: 1350, kVarhD: 350, kWhR: 50, kVarhR: 16, kVarhPenalized: 24, obisCode: '1.8.0', meterId: 'M016', location: 'Almacén Principal - Zona B', voltage: 221.3, current: 135.7, powerFactor: 0.89, temperature: 27.2 },
    { id: '17', timestamp: '2024-01-15T10:30:00Z', kWhD: 1050, kVarhD: 270, kWhR: 40, kVarhR: 12, kVarhPenalized: 18, obisCode: '1.8.0', meterId: 'M017', location: 'Almacén Principal - Montacargas', voltage: 220.1, current: 105.2, powerFactor: 0.94, temperature: 25.5 },
    
    // Laboratorio - 4 medidores
    { id: '18', timestamp: '2024-01-15T10:30:00Z', kWhD: 750, kVarhD: 190, kWhR: 25, kVarhR: 8, kVarhPenalized: 12, obisCode: '1.8.0', meterId: 'M018', location: 'Laboratorio - Equipos', voltage: 220.4, current: 75.1, powerFactor: 0.96, temperature: 21.3 },
    { id: '19', timestamp: '2024-01-15T10:30:00Z', kWhD: 680, kVarhD: 175, kWhR: 22, kVarhR: 7, kVarhPenalized: 10, obisCode: '1.8.0', meterId: 'M019', location: 'Laboratorio - Climatización', voltage: 220.8, current: 68.3, powerFactor: 0.97, temperature: 20.8 },
    
    // Taller de Mantenimiento - 3 medidores
    { id: '20', timestamp: '2024-01-15T10:30:00Z', kWhD: 950, kVarhD: 245, kWhR: 35, kVarhR: 11, kVarhPenalized: 16, obisCode: '1.8.0', meterId: 'M020', location: 'Taller - Herramientas', voltage: 220.5, current: 95.2, powerFactor: 0.93, temperature: 29.1 },
    { id: '21', timestamp: '2024-01-15T10:30:00Z', kWhD: 820, kVarhD: 210, kWhR: 30, kVarhR: 9, kVarhPenalized: 14, obisCode: '1.8.0', meterId: 'M021', location: 'Taller - Soldadura', voltage: 220.7, current: 82.1, powerFactor: 0.94, temperature: 31.5 }
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
    minDemand: 1200,
    // Datos adicionales expandidos
    peakDemandTime: '19:30',
    offPeakDemand: 1800,
    midPeakDemand: 3200,
    peakDemand: 4800,
    totalActiveEnergy: 1205000,
    totalReactiveEnergy: 320000,
    apparentEnergy: 1250000,
    energyQuality: {
      thd: 3.2, // Total Harmonic Distortion
      voltageVariation: 2.1, // %
      frequencyVariation: 0.05, // Hz
      powerQuality: 'Excelente'
    },
    environmentalImpact: {
      co2Reduction: 450, // toneladas
      treesEquivalent: 1200, // árboles
      carbonFootprint: 0.8 // kg CO2/kWh
    },
    costBreakdown: {
      energy: 60000000, // 80%
      demand: 12000000, // 16%
      reactive: 3000000, // 4%
      total: 75000000
    },
    efficiencyMetrics: {
      powerFactor: 0.92,
      loadFactor: 0.78,
      utilizationFactor: 0.85,
      diversityFactor: 1.15
    },
    consumptionByPeriod: {
      peak: 450000, // 36%
      midPeak: 400000, // 32%
      offPeak: 400000 // 32%
    },
    monthlyTrend: {
      current: 1250000,
      previous: 1180000,
      variation: 5.9,
      forecast: 1300000
    }
  },
  alerts: [
    // Alertas críticas
    { id: 1, type: 'critical', message: 'Pico de demanda excedido en Planta Norte', timestamp: '2024-01-15T19:30:00Z', severity: 'high', resolved: false, location: 'Planta Norte', value: 4850, threshold: 4500, unit: 'kW' },
    { id: 2, type: 'critical', message: 'Factor de potencia crítico en Centro de Datos', timestamp: '2024-01-15T14:15:00Z', severity: 'high', resolved: false, location: 'Centro de Datos', value: 0.82, threshold: 0.85, unit: '' },
    { id: 3, type: 'critical', message: 'Sobrecarga en transformador principal', timestamp: '2024-01-15T16:45:00Z', severity: 'high', resolved: false, location: 'Subestación Principal', value: 95, threshold: 90, unit: '%' },
    
    // Alertas de advertencia
    { id: 4, type: 'warning', message: 'Consumo alto en hora pico', timestamp: '2024-01-15T18:00:00Z', severity: 'medium', resolved: false, location: 'Oficinas Centrales', value: 3200, threshold: 3000, unit: 'kW' },
    { id: 5, type: 'warning', message: 'Temperatura elevada en equipos', timestamp: '2024-01-15T13:20:00Z', severity: 'medium', resolved: false, location: 'Planta Norte - Hornos', value: 52, threshold: 50, unit: '°C' },
    { id: 6, type: 'warning', message: 'Variación de voltaje detectada', timestamp: '2024-01-15T11:30:00Z', severity: 'medium', resolved: false, location: 'Almacén Principal', value: 3.2, threshold: 3.0, unit: '%' },
    { id: 7, type: 'warning', message: 'Consumo reactivo excesivo', timestamp: '2024-01-15T09:45:00Z', severity: 'medium', resolved: false, location: 'Taller de Mantenimiento', value: 28, threshold: 25, unit: '%' },
    
    // Alertas informativas
    { id: 8, type: 'info', message: 'Factor de potencia optimizado', timestamp: '2024-01-15T15:30:00Z', severity: 'low', resolved: true, location: 'Laboratorio', value: 0.96, threshold: 0.95, unit: '' },
    { id: 9, type: 'info', message: 'Mantenimiento programado completado', timestamp: '2024-01-15T08:00:00Z', severity: 'low', resolved: true, location: 'Centro de Datos - UPS', value: 0, threshold: 0, unit: '' },
    { id: 10, type: 'info', message: 'Calibración de medidores realizada', timestamp: '2024-01-15T07:30:00Z', severity: 'low', resolved: true, location: 'Sistema General', value: 0, threshold: 0, unit: '' },
    
    // Alertas de éxito
    { id: 11, type: 'success', message: 'Meta de eficiencia alcanzada', timestamp: '2024-01-15T12:00:00Z', severity: 'low', resolved: true, location: 'Sistema General', value: 87.5, threshold: 85, unit: '%' },
    { id: 12, type: 'success', message: 'Ahorro energético del 5% logrado', timestamp: '2024-01-15T10:15:00Z', severity: 'low', resolved: true, location: 'Sistema General', value: 5.2, threshold: 5, unit: '%' },
    { id: 13, type: 'success', message: 'Reducción de penalizaciones por reactiva', timestamp: '2024-01-15T14:00:00Z', severity: 'low', resolved: true, location: 'Sistema General', value: 15, threshold: 0, unit: '%' }
  ],
  clients: [
    { id: 1, name: 'Planta Industrial Norte', consumption: 450000, efficiency: 92.3, cost: 27000000, powerFactor: 0.94, peakDemand: 2800, location: 'Zona Industrial Norte', type: 'Industrial' },
    { id: 2, name: 'Oficinas Centrales', consumption: 320000, efficiency: 88.7, cost: 19200000, powerFactor: 0.96, peakDemand: 1800, location: 'Centro de la Ciudad', type: 'Comercial' },
    { id: 3, name: 'Centro de Datos', consumption: 280000, efficiency: 85.4, cost: 16800000, powerFactor: 0.87, peakDemand: 2200, location: 'Zona Tecnológica', type: 'Tecnológico' },
    { id: 4, name: 'Almacén Principal', consumption: 200000, efficiency: 82.1, cost: 12000000, powerFactor: 0.89, peakDemand: 1500, location: 'Zona Logística', type: 'Logístico' },
    { id: 5, name: 'Laboratorio de Investigación', consumption: 75000, efficiency: 95.2, cost: 4500000, powerFactor: 0.98, peakDemand: 600, location: 'Campus Universitario', type: 'Investigación' },
    { id: 6, name: 'Taller de Mantenimiento', consumption: 120000, efficiency: 79.8, cost: 7200000, powerFactor: 0.85, peakDemand: 800, location: 'Zona Industrial Sur', type: 'Industrial' },
    { id: 7, name: 'Planta de Tratamiento', consumption: 180000, efficiency: 86.5, cost: 10800000, powerFactor: 0.91, peakDemand: 1200, location: 'Zona Ambiental', type: 'Ambiental' },
    { id: 8, name: 'Centro de Distribución', consumption: 150000, efficiency: 84.2, cost: 9000000, powerFactor: 0.88, peakDemand: 1000, location: 'Zona Portuaria', type: 'Logístico' }
  ],
  
  // Datos históricos expandidos - 12 meses
  historicalData: [
    { month: 'Enero 2023', consumption: 720000, cost: 43200000, efficiency: 82.5, peakDemand: 4200, powerFactor: 0.89, temperature: 28.5, humidity: 65 },
    { month: 'Febrero 2023', consumption: 680000, cost: 40800000, efficiency: 84.2, peakDemand: 4000, powerFactor: 0.91, temperature: 29.2, humidity: 68 },
    { month: 'Marzo 2023', consumption: 750000, cost: 45000000, efficiency: 85.8, peakDemand: 4400, powerFactor: 0.90, temperature: 30.1, humidity: 70 },
    { month: 'Abril 2023', consumption: 780000, cost: 46800000, efficiency: 86.5, peakDemand: 4600, powerFactor: 0.92, temperature: 31.5, humidity: 72 },
    { month: 'Mayo 2023', consumption: 820000, cost: 49200000, efficiency: 87.2, peakDemand: 4800, powerFactor: 0.93, temperature: 32.8, humidity: 75 },
    { month: 'Junio 2023', consumption: 850000, cost: 51000000, efficiency: 88.1, peakDemand: 5000, powerFactor: 0.94, temperature: 33.2, humidity: 78 },
    { month: 'Julio 2023', consumption: 880000, cost: 52800000, efficiency: 88.8, peakDemand: 5200, powerFactor: 0.93, temperature: 34.1, humidity: 80 },
    { month: 'Agosto 2023', consumption: 900000, cost: 54000000, efficiency: 89.2, peakDemand: 5400, powerFactor: 0.94, temperature: 33.8, humidity: 82 },
    { month: 'Septiembre 2023', consumption: 870000, cost: 52200000, efficiency: 88.9, peakDemand: 5100, powerFactor: 0.93, temperature: 32.5, humidity: 79 },
    { month: 'Octubre 2023', consumption: 840000, cost: 50400000, efficiency: 88.3, peakDemand: 4900, powerFactor: 0.92, temperature: 31.2, humidity: 76 },
    { month: 'Noviembre 2023', consumption: 800000, cost: 48000000, efficiency: 87.6, peakDemand: 4700, powerFactor: 0.91, temperature: 29.8, humidity: 73 },
    { month: 'Diciembre 2023', consumption: 760000, cost: 45600000, efficiency: 86.9, peakDemand: 4500, powerFactor: 0.90, temperature: 28.5, humidity: 70 }
  ],
  
  // Datos por categoría de consumo
  consumptionByCategory: [
    { category: 'Iluminación LED', consumption: 350000, percentage: 28.0, cost: 21000000, efficiency: 92.5, trend: 'down', savings: 1500000 },
    { category: 'Climatización HVAC', consumption: 420000, percentage: 33.6, cost: 25200000, efficiency: 85.2, trend: 'stable', savings: 800000 },
    { category: 'Equipos Industriales', consumption: 300000, percentage: 24.0, cost: 18000000, efficiency: 88.7, trend: 'up', savings: 500000 },
    { category: 'Sistemas de Control', consumption: 120000, percentage: 9.6, cost: 7200000, efficiency: 95.8, trend: 'stable', savings: 200000 },
    { category: 'Otros Consumos', consumption: 60000, percentage: 4.8, cost: 3600000, efficiency: 78.5, trend: 'down', savings: 100000 }
  ],
  
  // Datos de eficiencia por zona
  efficiencyByZone: [
    { zone: 'Planta Norte', efficiency: 92.3, consumption: 450000, target: 90.0, status: 'excellent', improvements: ['Optimización de motores', 'Control de velocidad variable'] },
    { zone: 'Oficinas Centrales', efficiency: 88.7, consumption: 320000, target: 85.0, status: 'good', improvements: ['Sensores de ocupación', 'Iluminación inteligente'] },
    { zone: 'Centro de Datos', efficiency: 85.4, consumption: 280000, target: 88.0, status: 'needs_improvement', improvements: ['Refrigeración eficiente', 'UPS optimizado'] },
    { zone: 'Almacén Principal', efficiency: 82.1, consumption: 200000, target: 85.0, status: 'needs_improvement', improvements: ['Iluminación LED', 'Sistemas de ventilación'] },
    { zone: 'Laboratorio', efficiency: 95.2, consumption: 75000, target: 90.0, status: 'excellent', improvements: ['Equipos de alta eficiencia', 'Control automático'] },
    { zone: 'Taller', efficiency: 79.8, consumption: 120000, target: 85.0, status: 'poor', improvements: ['Mantenimiento preventivo', 'Actualización de equipos'] }
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
