// Tipos para Indicadores Clave de Desempeño (KPIs)

export interface KPICard {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  period: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description?: string;
  target?: number;
  actual?: number;
  variance?: number;
}

export interface ConsumptionBySite {
  siteId: string;
  siteName: string;
  location: string;
  totalConsumption: number;
  activeEnergy: number;
  reactiveEnergy: number;
  peakDemand: number;
  averageDemand: number;
  powerFactor: number;
  cost: number;
  efficiency: number;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number;
}

export interface ConsumptionByClient {
  clientId: string;
  clientName: string;
  totalSites: number;
  totalConsumption: number;
  activeEnergy: number;
  reactiveEnergy: number;
  peakDemand: number;
  averageDemand: number;
  totalCost: number;
  averagePowerFactor: number;
  efficiency: number;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number;
  sites: ConsumptionBySite[];
}

export interface ConsumptionByGroup {
  groupId: string;
  groupName: string;
  description: string;
  totalSites: number;
  totalConsumption: number;
  activeEnergy: number;
  reactiveEnergy: number;
  peakDemand: number;
  averageDemand: number;
  totalCost: number;
  averagePowerFactor: number;
  efficiency: number;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number;
  sites: ConsumptionBySite[];
}

export interface PeakDemandRecord {
  id: string;
  siteId: string;
  siteName: string;
  peakDemand: number;
  timestamp: string;
  date: string;
  time: string;
  duration: number; // en minutos
  powerFactor: number;
  temperature?: number;
  weather?: string;
  notes?: string;
  cost: number;
  efficiency: number;
}

export interface ReactiveEnergyRatio {
  siteId: string;
  siteName: string;
  activeEnergy: number;
  reactiveEnergy: number;
  reactivePercentage: number;
  powerFactor: number;
  capacitiveEnergy: number;
  inductiveEnergy: number;
  penalizedEnergy: number;
  penaltyCost: number;
  efficiency: number;
  lastUpdated: string;
  trend: 'improving' | 'degrading' | 'stable';
  recommendation: string;
}

export interface KPISummary {
  totalConsumption: number;
  totalActiveEnergy: number;
  totalReactiveEnergy: number;
  totalPeakDemand: number;
  averagePowerFactor: number;
  totalCost: number;
  totalEfficiency: number;
  reactivePercentage: number;
  peakDemandRecord: PeakDemandRecord | null;
  topConsumers: Array<{
    id: string;
    name: string;
    consumption: number;
    percentage: number;
  }>;
  efficiencyLeaders: Array<{
    id: string;
    name: string;
    efficiency: number;
    powerFactor: number;
  }>;
  costLeaders: Array<{
    id: string;
    name: string;
    cost: number;
    consumption: number;
  }>;
  lastUpdated: string;
}

export interface KPITrend {
  period: string;
  startDate: string;
  endDate: string;
  consumption: number[];
  demand: number[];
  powerFactor: number[];
  cost: number[];
  efficiency: number[];
  reactivePercentage: number[];
  timestamps: string[];
  labels: string[];
}

export interface KPIFilter {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  sites?: string[];
  clients?: string[];
  groups?: string[];
  meters?: string[];
  aggregation: 'site' | 'client' | 'group' | 'meter';
}

export interface KPIMetric {
  id: string;
  name: string;
  description: string;
  category: 'consumption' | 'demand' | 'efficiency' | 'cost' | 'quality';
  unit: string;
  format: 'number' | 'percentage' | 'currency' | 'time';
  precision: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  target?: number;
  isEnabled: boolean;
  order: number;
}

export interface KPIDashboard {
  id: string;
  name: string;
  description: string;
  layout: KPICard[];
  filters: KPIFilter;
  refreshInterval: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRefresh: string;
}

// Configuración de KPIs predefinidos
export const DEFAULT_KPI_METRICS: KPIMetric[] = [
  {
    id: 'total_consumption',
    name: 'Consumo Total',
    description: 'Consumo total de energía en el período seleccionado',
    category: 'consumption',
    unit: 'kWh',
    format: 'number',
    precision: 0,
    isEnabled: true,
    order: 1,
  },
  {
    id: 'peak_demand',
    name: 'Demanda Máxima',
    description: 'Demanda máxima registrada en el período',
    category: 'demand',
    unit: 'kW',
    format: 'number',
    precision: 2,
    isEnabled: true,
    order: 2,
  },
  {
    id: 'power_factor',
    name: 'Factor de Potencia',
    description: 'Factor de potencia promedio del período',
    category: 'quality',
    unit: '%',
    format: 'percentage',
    precision: 1,
    threshold: {
      warning: 0.85,
      critical: 0.8,
    },
    target: 0.9,
    isEnabled: true,
    order: 3,
  },
  {
    id: 'reactive_percentage',
    name: 'Energía Reactiva',
    description: 'Porcentaje de energía reactiva respecto a la activa',
    category: 'quality',
    unit: '%',
    format: 'percentage',
    precision: 1,
    threshold: {
      warning: 20,
      critical: 30,
    },
    target: 15,
    isEnabled: true,
    order: 4,
  },
  {
    id: 'total_cost',
    name: 'Costo Total',
    description: 'Costo total de la energía en el período',
    category: 'cost',
    unit: 'COP',
    format: 'currency',
    precision: 0,
    isEnabled: true,
    order: 5,
  },
  {
    id: 'efficiency',
    name: 'Eficiencia',
    description: 'Eficiencia energética del sistema',
    category: 'efficiency',
    unit: '%',
    format: 'percentage',
    precision: 1,
    target: 85,
    isEnabled: true,
    order: 6,
  },
  {
    id: 'average_demand',
    name: 'Demanda Promedio',
    description: 'Demanda promedio en el período',
    category: 'demand',
    unit: 'kW',
    format: 'number',
    precision: 2,
    isEnabled: true,
    order: 7,
  },
  {
    id: 'cost_per_kwh',
    name: 'Costo por kWh',
    description: 'Costo promedio por kilovatio-hora',
    category: 'cost',
    unit: 'COP/kWh',
    format: 'currency',
    precision: 2,
    isEnabled: true,
    order: 8,
  },
];

// Configuración de colores para KPIs
export const KPI_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#ed6c02',
  info: '#0288d1',
};

// Configuración de iconos para KPIs
export const KPI_ICONS = {
  consumption: '⚡',
  demand: '📈',
  efficiency: '🎯',
  cost: '💰',
  quality: '⭐',
  power: '🔌',
  energy: '⚡',
  trend: '📊',
  alert: '⚠️',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

// Configuración de umbrales
export const KPI_THRESHOLDS = {
  powerFactor: {
    excellent: 0.95,
    good: 0.9,
    warning: 0.85,
    critical: 0.8,
  },
  reactivePercentage: {
    excellent: 10,
    good: 15,
    warning: 20,
    critical: 30,
  },
  efficiency: {
    excellent: 90,
    good: 85,
    warning: 80,
    critical: 75,
  },
  costVariance: {
    excellent: 5,
    good: 10,
    warning: 15,
    critical: 20,
  },
};

// Configuración de períodos
export const KPI_PERIODS = [
  { value: 'day', label: 'Último Día', days: 1 },
  { value: 'week', label: 'Última Semana', days: 7 },
  { value: 'month', label: 'Último Mes', days: 30 },
  { value: 'quarter', label: 'Último Trimestre', days: 90 },
  { value: 'year', label: 'Último Año', days: 365 },
  { value: 'custom', label: 'Personalizado', days: 0 },
];

// Configuración de agregación
export const KPI_AGGREGATION = [
  { value: 'site', label: 'Por Sitio' },
  { value: 'client', label: 'Por Cliente' },
  { value: 'group', label: 'Por Grupo' },
  { value: 'meter', label: 'Por Medidor' },
];

// Configuración de formato
export const KPI_FORMAT = {
  number: (value: number, precision: number = 0) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  },
  percentage: (value: number, precision: number = 1) => {
    return `${value.toFixed(precision)}%`;
  },
  currency: (value: number, precision: number = 0) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value);
  },
  time: (value: number) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours}h ${minutes}m`;
  },
};

// Utilidades para KPIs
export const KPI_UTILS = {
  getChangeType: (change: number): 'increase' | 'decrease' | 'neutral' => {
    if (change > 0) return 'increase';
    if (change < 0) return 'decrease';
    return 'neutral';
  },
  
  getTrend: (values: number[]): 'up' | 'down' | 'stable' => {
    if (values.length < 2) return 'stable';
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  },
  
  getColorByThreshold: (value: number, thresholds: any): string => {
    if (value >= thresholds.excellent) return 'success';
    if (value >= thresholds.good) return 'info';
    if (value >= thresholds.warning) return 'warning';
    return 'error';
  },
  
  calculateVariance: (actual: number, target: number): number => {
    if (target === 0) return 0;
    return ((actual - target) / target) * 100;
  },
  
  formatValue: (value: number, metric: KPIMetric): string => {
    switch (metric.format) {
      case 'number':
        return KPI_FORMAT.number(value, metric.precision);
      case 'percentage':
        return KPI_FORMAT.percentage(value, metric.precision);
      case 'currency':
        return KPI_FORMAT.currency(value, metric.precision);
      case 'time':
        return KPI_FORMAT.time(value);
      default:
        return value.toString();
    }
  },
};


