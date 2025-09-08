// Tipos para el sistema de widgets personalizables

export type WidgetType = 'chart' | 'table' | 'kpi' | 'summary' | 'matrix' | 'billing';

export type ChartType = 'line' | 'bar' | 'area' | 'doughnut';

export type EnergyUnit = 'kWh' | 'MWh' | 'kVarh' | 'MVarh';

export type TimeZone = 'America/Bogota' | 'America/Mexico_City' | 'America/New_York' | 'UTC';

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

export type TimeFormat = '12h' | '24h';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  settings: {
    chartType?: ChartType;
    showActiveEnergy?: boolean;
    showReactiveEnergy?: boolean;
    showComparison?: boolean;
    timeInterval?: string;
    metricType?: string;
    colors?: {
      [key: string]: string;
    };
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  units: {
    energy: EnergyUnit;
    reactive: EnergyUnit;
  };
  timezone: TimeZone;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  customLabels: {
    [meterId: string]: {
      name: string;
      description?: string;
    };
  };
  chartColors: {
    [seriesName: string]: string;
  };
  defaultLayout: string;
  autoRefresh: boolean;
  refreshInterval: number; // en segundos
}

export interface WidgetLibrary {
  [key: string]: {
    type: WidgetType;
    name: string;
    description: string;
    icon: string;
    defaultSize: {
      width: number;
      height: number;
    };
    category: 'energy' | 'billing' | 'analysis' | 'monitoring';
  };
}

// Configuración de widgets disponibles
export const WIDGET_LIBRARY: WidgetLibrary = {
  'energy-chart': {
    type: 'chart',
    name: 'Gráfico de Energía',
    description: 'Visualización de consumos energéticos en tiempo real',
    icon: 'ElectricBolt',
    defaultSize: { width: 6, height: 4 },
    category: 'energy',
  },
  'energy-matrix': {
    type: 'matrix',
    name: 'Matriz de Energía',
    description: 'Tabla detallada de consumos energéticos',
    icon: 'TableChart',
    defaultSize: { width: 12, height: 6 },
    category: 'energy',
  },
  'energy-summary': {
    type: 'summary',
    name: 'Resumen Energético',
    description: 'KPIs principales de consumo energético',
    icon: 'Assessment',
    defaultSize: { width: 6, height: 4 },
    category: 'energy',
  },
  'power-factor-kpi': {
    type: 'kpi',
    name: 'Factor de Potencia',
    description: 'Indicador del factor de potencia actual',
    icon: 'Speed',
    defaultSize: { width: 3, height: 2 },
    category: 'monitoring',
  },
  'efficiency-kpi': {
    type: 'kpi',
    name: 'Eficiencia Energética',
    description: 'Porcentaje de eficiencia energética',
    icon: 'Eco',
    defaultSize: { width: 3, height: 2 },
    category: 'monitoring',
  },
  'billing-comparison': {
    type: 'billing',
    name: 'Comparativa de Facturación',
    description: 'Análisis de facturación vs consumos',
    icon: 'Receipt',
    defaultSize: { width: 12, height: 6 },
    category: 'billing',
  },
  'consumption-table': {
    type: 'table',
    name: 'Tabla de Consumos',
    description: 'Datos históricos de consumos',
    icon: 'TableRows',
    defaultSize: { width: 12, height: 4 },
    category: 'analysis',
  },
  'demand-chart': {
    type: 'chart',
    name: 'Gráfico de Demanda',
    description: 'Curva de demanda energética',
    icon: 'ShowChart',
    defaultSize: { width: 6, height: 4 },
    category: 'energy',
  },
  'reactive-chart': {
    type: 'chart',
    name: 'Gráfico de Energía Reactiva',
    description: 'Visualización de energía reactiva',
    icon: 'BatteryChargingFull',
    defaultSize: { width: 6, height: 4 },
    category: 'energy',
  },
  'cost-analysis': {
    type: 'kpi',
    name: 'Análisis de Costos',
    description: 'Costo promedio por kWh',
    icon: 'AttachMoney',
    defaultSize: { width: 3, height: 2 },
    category: 'billing',
  },
};


