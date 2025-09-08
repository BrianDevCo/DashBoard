// Tipos para Análisis Comparativo y Tendencias

export interface ComparisonPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'current' | 'previous' | 'baseline' | 'custom';
  description?: string;
}

export interface ComparisonEntity {
  id: string;
  name: string;
  type: 'site' | 'client' | 'group' | 'meter';
  location?: string;
  description?: string;
}

export interface ConsumptionComparison {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'site' | 'client' | 'group' | 'meter';
  currentPeriod: {
    startDate: string;
    endDate: string;
    consumption: number;
    cost: number;
    efficiency: number;
    powerFactor: number;
    peakDemand: number;
    averageDemand: number;
  };
  comparisonPeriod: {
    startDate: string;
    endDate: string;
    consumption: number;
    cost: number;
    efficiency: number;
    powerFactor: number;
    peakDemand: number;
    averageDemand: number;
  };
  variance: {
    consumption: number;
    cost: number;
    efficiency: number;
    powerFactor: number;
    peakDemand: number;
    averageDemand: number;
  };
  percentageChange: {
    consumption: number;
    cost: number;
    efficiency: number;
    powerFactor: number;
    peakDemand: number;
    averageDemand: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  significance: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export interface TrendAnalysis {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'site' | 'client' | 'group' | 'meter';
  metric: 'consumption' | 'cost' | 'efficiency' | 'powerFactor' | 'peakDemand';
  period: string;
  dataPoints: Array<{
    date: string;
    value: number;
    timestamp: string;
  }>;
  trend: {
    type: 'linear' | 'exponential' | 'polynomial' | 'logarithmic';
    equation: string;
    rSquared: number;
    slope: number;
    intercept: number;
    direction: 'up' | 'down' | 'stable';
    strength: 'strong' | 'moderate' | 'weak';
  };
  forecast: Array<{
    date: string;
    predictedValue: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  }>;
  seasonality: {
    detected: boolean;
    period: number;
    strength: number;
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  anomalies: Array<{
    date: string;
    value: number;
    expectedValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  lastUpdated: string;
}

export interface RankingEntry {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'site' | 'client' | 'group' | 'meter';
  location?: string;
  metric: 'consumption' | 'cost' | 'efficiency' | 'powerFactor' | 'peakDemand';
  value: number;
  unit: string;
  rank: number;
  previousRank?: number;
  rankChange?: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  lastUpdated: string;
}

export interface HeatmapData {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'site' | 'client' | 'group' | 'meter';
  period: string;
  data: Array<{
    hour: number;
    day: number;
    dayName: string;
    value: number;
    normalizedValue: number;
    color: string;
  }>;
  statistics: {
    min: number;
    max: number;
    average: number;
    median: number;
    standardDeviation: number;
  };
  patterns: {
    peakHours: number[];
    lowHours: number[];
    peakDays: number[];
    lowDays: number[];
    weeklyPattern: boolean;
    dailyPattern: boolean;
  };
  lastUpdated: string;
}

export interface ComparativeAnalysis {
  id: string;
  name: string;
  description: string;
  type: 'period' | 'entity' | 'mixed';
  entities: ComparisonEntity[];
  periods: ComparisonPeriod[];
  comparisons: ConsumptionComparison[];
  trends: TrendAnalysis[];
  rankings: RankingEntry[];
  heatmaps: HeatmapData[];
  insights: Array<{
    type: 'variance' | 'trend' | 'ranking' | 'pattern';
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    recommendations: string[];
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ComparisonFilter {
  entityType: 'site' | 'client' | 'group' | 'meter' | 'all';
  entityIds: string[];
  periodType: 'current_vs_previous' | 'current_vs_baseline' | 'custom_periods';
  currentPeriod: {
    startDate: string;
    endDate: string;
  };
  comparisonPeriod: {
    startDate: string;
    endDate: string;
  };
  metrics: string[];
  groupBy: 'entity' | 'period' | 'metric';
  sortBy: 'variance' | 'value' | 'trend' | 'rank';
  sortOrder: 'asc' | 'desc';
}

export interface TrendFilter {
  entityType: 'site' | 'client' | 'group' | 'meter' | 'all';
  entityIds: string[];
  metric: 'consumption' | 'cost' | 'efficiency' | 'powerFactor' | 'peakDemand';
  period: string;
  startDate: string;
  endDate: string;
  trendType: 'linear' | 'exponential' | 'polynomial' | 'logarithmic' | 'auto';
  forecastDays: number;
  includeSeasonality: boolean;
  detectAnomalies: boolean;
}

export interface RankingFilter {
  entityType: 'site' | 'client' | 'group' | 'meter' | 'all';
  entityIds: string[];
  metric: 'consumption' | 'cost' | 'efficiency' | 'powerFactor' | 'peakDemand';
  period: string;
  startDate: string;
  endDate: string;
  limit: number;
  groupBy?: string;
  includePreviousRank: boolean;
}

export interface HeatmapFilter {
  entityType: 'site' | 'client' | 'group' | 'meter' | 'all';
  entityIds: string[];
  period: string;
  startDate: string;
  endDate: string;
  metric: 'consumption' | 'cost' | 'efficiency' | 'powerFactor' | 'peakDemand';
  aggregation: 'sum' | 'average' | 'max' | 'min';
  normalize: boolean;
  includeWeekends: boolean;
}

// Configuración de análisis comparativo
export const COMPARISON_TYPES = [
  { value: 'current_vs_previous', label: 'Actual vs Anterior' },
  { value: 'current_vs_baseline', label: 'Actual vs Línea Base' },
  { value: 'custom_periods', label: 'Períodos Personalizados' },
];

export const ENTITY_TYPES = [
  { value: 'site', label: 'Sitios', icon: '🏢' },
  { value: 'client', label: 'Clientes', icon: '👥' },
  { value: 'group', label: 'Grupos', icon: '📊' },
  { value: 'meter', label: 'Medidores', icon: '⚡' },
];

export const METRICS = [
  { value: 'consumption', label: 'Consumo', unit: 'kWh', icon: '⚡' },
  { value: 'cost', label: 'Costo', unit: 'COP', icon: '💰' },
  { value: 'efficiency', label: 'Eficiencia', unit: '%', icon: '🎯' },
  { value: 'powerFactor', label: 'Factor de Potencia', unit: '', icon: '⚡' },
  { value: 'peakDemand', label: 'Demanda Máxima', unit: 'kW', icon: '📈' },
];

export const TREND_TYPES = [
  { value: 'linear', label: 'Lineal' },
  { value: 'exponential', label: 'Exponencial' },
  { value: 'polynomial', label: 'Polinomial' },
  { value: 'logarithmic', label: 'Logarítmico' },
  { value: 'auto', label: 'Automático' },
];

export const PERIODS = [
  { value: 'day', label: 'Día', days: 1 },
  { value: 'week', label: 'Semana', days: 7 },
  { value: 'month', label: 'Mes', days: 30 },
  { value: 'quarter', label: 'Trimestre', days: 90 },
  { value: 'year', label: 'Año', days: 365 },
  { value: 'custom', label: 'Personalizado', days: 0 },
];

// Configuración de colores para mapas de calor
export const HEATMAP_COLORS = {
  low: '#e3f2fd',
  medium: '#2196f3',
  high: '#1976d2',
  veryHigh: '#0d47a1',
  extreme: '#000051',
};

// Configuración de tendencias
export const TREND_CONFIG = {
  minDataPoints: 7,
  maxForecastDays: 30,
  confidenceLevel: 0.95,
  anomalyThreshold: 2.5,
  seasonalityMinPeriod: 7,
  seasonalityMaxPeriod: 365,
};

// Utilidades para análisis comparativo
export const COMPARATIVE_UTILS = {
  calculateVariance: (current: number, comparison: number): number => {
    if (comparison === 0) return 0;
    return ((current - comparison) / comparison) * 100;
  },
  
  calculatePercentageChange: (current: number, comparison: number): number => {
    if (comparison === 0) return 0;
    return ((current - comparison) / comparison) * 100;
  },
  
  getTrendDirection: (slope: number): 'up' | 'down' | 'stable' => {
    if (slope > 0.1) return 'up';
    if (slope < -0.1) return 'down';
    return 'stable';
  },
  
  getTrendStrength: (rSquared: number): 'strong' | 'moderate' | 'weak' => {
    if (rSquared >= 0.8) return 'strong';
    if (rSquared >= 0.5) return 'moderate';
    return 'weak';
  },
  
  getSignificance: (variance: number): 'high' | 'medium' | 'low' => {
    const absVariance = Math.abs(variance);
    if (absVariance >= 20) return 'high';
    if (absVariance >= 10) return 'medium';
    return 'low';
  },
  
  getHeatmapColor: (value: number, min: number, max: number): string => {
    const normalized = (value - min) / (max - min);
    if (normalized <= 0.2) return HEATMAP_COLORS.low;
    if (normalized <= 0.4) return HEATMAP_COLORS.medium;
    if (normalized <= 0.6) return HEATMAP_COLORS.high;
    if (normalized <= 0.8) return HEATMAP_COLORS.veryHigh;
    return HEATMAP_COLORS.extreme;
  },
  
  formatValue: (value: number, unit: string): string => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'COP') return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    if (unit === 'kWh' || unit === 'kW') return `${value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} ${unit}`;
    return value.toLocaleString('es-ES');
  },
  
  formatVariance: (variance: number): string => {
    const sign = variance >= 0 ? '+' : '';
    return `${sign}${variance.toFixed(1)}%`;
  },
  
  getVarianceColor: (variance: number): 'success' | 'error' | 'warning' | 'info' => {
    if (variance > 10) return 'error';
    if (variance > 5) return 'warning';
    if (variance < -10) return 'error';
    if (variance < -5) return 'warning';
    return 'info';
  },
  
  getTrendIcon: (trend: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  },
  
  getTrendColor: (trend: 'up' | 'down' | 'stable'): 'success' | 'error' | 'info' => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      default: return 'info';
    }
  },
};


