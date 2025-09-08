// Tipos para Dashboard de Resumen Ejecutivo

export interface ExecutiveKPI {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  trend: 'up' | 'down' | 'stable';
  period: string;
  target?: number;
  status: 'good' | 'warning' | 'critical' | 'info';
  icon: string;
  color: string;
  description?: string;
  lastUpdated: string;
}

export interface ExecutiveAlert {
  id: string;
  title: string;
  message: string;
  type: 'consumption' | 'cost' | 'efficiency' | 'maintenance' | 'billing' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  entityId: string;
  entityName: string;
  entityType: 'site' | 'client' | 'group' | 'meter';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  actions?: Array<{
    id: string;
    label: string;
    action: string;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }>;
}

export interface ExecutiveTrend {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'area' | 'pie';
  data: Array<{
    label: string;
    value: number;
    color?: string;
    date?: string;
  }>;
  period: string;
  comparison?: {
    previous: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
  };
  insights?: Array<{
    type: 'peak' | 'valley' | 'trend' | 'anomaly';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  lastUpdated: string;
}

export interface ExecutiveSummary {
  id: string;
  period: string;
  totalConsumption: {
    current: number;
    previous: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    unit: string;
  };
  totalCost: {
    current: number;
    previous: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    currency: string;
  };
  efficiency: {
    current: number;
    previous: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    unit: string;
  };
  peakDemand: {
    current: number;
    previous: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    unit: string;
    time: string;
  };
  powerFactor: {
    current: number;
    previous: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    unit: string;
  };
  savings: {
    potential: number;
    achieved: number;
    currency: string;
  };
  lastUpdated: string;
}

export interface ExecutiveInsight {
  id: string;
  type: 'saving' | 'efficiency' | 'cost' | 'consumption' | 'maintenance' | 'alert';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'energy' | 'cost' | 'efficiency' | 'maintenance' | 'billing';
  entityId?: string;
  entityName?: string;
  entityType?: 'site' | 'client' | 'group' | 'meter';
  value?: number;
  unit?: string;
  currency?: string;
  recommendation?: string;
  actionRequired?: boolean;
  estimatedSavings?: number;
  implementationEffort?: 'low' | 'medium' | 'high';
  timeToImplement?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ExecutiveWidget {
  id: string;
  type: 'kpi' | 'chart' | 'alert' | 'insight' | 'summary' | 'table';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  config: any;
  data: any;
  lastUpdated: string;
}

export interface ExecutiveDashboard {
  id: string;
  name: string;
  description: string;
  userId: string;
  isDefault: boolean;
  widgets: ExecutiveWidget[];
  layout: 'grid' | 'flex' | 'custom';
  theme: 'light' | 'dark' | 'corporate';
  refreshInterval: number; // en segundos
  autoRefresh: boolean;
  lastUpdated: string;
  createdAt: string;
}

export interface ExecutiveFilter {
  period: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';
  startDate?: string;
  endDate?: string;
  entityType: 'all' | 'site' | 'client' | 'group' | 'meter';
  entityIds: string[];
  metrics: string[];
  includeAlerts: boolean;
  includeInsights: boolean;
  alertSeverity: 'all' | 'low' | 'medium' | 'high' | 'critical';
  insightPriority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
}

// Configuración de KPIs
export const EXECUTIVE_KPI_TYPES = [
  { 
    id: 'totalConsumption', 
    title: 'Consumo Total', 
    unit: 'kWh', 
    icon: '⚡', 
    color: '#2196f3',
    description: 'Consumo total de energía activa'
  },
  { 
    id: 'totalCost', 
    title: 'Costo Total', 
    unit: 'COP', 
    icon: '💰', 
    color: '#4caf50',
    description: 'Costo total de la energía'
  },
  { 
    id: 'efficiency', 
    title: 'Eficiencia', 
    unit: '%', 
    icon: '🎯', 
    color: '#ff9800',
    description: 'Eficiencia energética promedio'
  },
  { 
    id: 'peakDemand', 
    title: 'Demanda Máxima', 
    unit: 'kW', 
    icon: '📈', 
    color: '#f44336',
    description: 'Demanda máxima registrada'
  },
  { 
    id: 'powerFactor', 
    title: 'Factor de Potencia', 
    unit: '', 
    icon: '⚡', 
    color: '#9c27b0',
    description: 'Factor de potencia promedio'
  },
  { 
    id: 'savings', 
    title: 'Ahorro Potencial', 
    unit: 'COP', 
    icon: '💡', 
    color: '#00bcd4',
    description: 'Ahorro potencial identificado'
  },
];

// Configuración de alertas
export const EXECUTIVE_ALERT_TYPES = [
  { 
    value: 'consumption', 
    label: 'Consumo', 
    icon: '⚡', 
    color: '#2196f3' 
  },
  { 
    value: 'cost', 
    label: 'Costo', 
    icon: '💰', 
    color: '#4caf50' 
  },
  { 
    value: 'efficiency', 
    label: 'Eficiencia', 
    icon: '🎯', 
    color: '#ff9800' 
  },
  { 
    value: 'maintenance', 
    label: 'Mantenimiento', 
    icon: '🔧', 
    color: '#ff5722' 
  },
  { 
    value: 'billing', 
    label: 'Facturación', 
    icon: '📄', 
    color: '#607d8b' 
  },
  { 
    value: 'system', 
    label: 'Sistema', 
    icon: '⚙️', 
    color: '#795548' 
  },
];

// Configuración de insights
export const EXECUTIVE_INSIGHT_TYPES = [
  { 
    value: 'saving', 
    label: 'Ahorro', 
    icon: '💡', 
    color: '#00bcd4' 
  },
  { 
    value: 'efficiency', 
    label: 'Eficiencia', 
    icon: '🎯', 
    color: '#ff9800' 
  },
  { 
    value: 'cost', 
    label: 'Costo', 
    icon: '💰', 
    color: '#4caf50' 
  },
  { 
    value: 'consumption', 
    label: 'Consumo', 
    icon: '⚡', 
    color: '#2196f3' 
  },
  { 
    value: 'maintenance', 
    label: 'Mantenimiento', 
    icon: '🔧', 
    color: '#ff5722' 
  },
  { 
    value: 'alert', 
    label: 'Alerta', 
    icon: '⚠️', 
    color: '#f44336' 
  },
];

// Configuración de períodos
export const EXECUTIVE_PERIODS = [
  { value: 'today', label: 'Hoy', days: 1 },
  { value: 'yesterday', label: 'Ayer', days: 1 },
  { value: 'thisWeek', label: 'Esta Semana', days: 7 },
  { value: 'lastWeek', label: 'Semana Pasada', days: 7 },
  { value: 'thisMonth', label: 'Este Mes', days: 30 },
  { value: 'lastMonth', label: 'Mes Pasado', days: 30 },
  { value: 'thisYear', label: 'Este Año', days: 365 },
  { value: 'lastYear', label: 'Año Pasado', days: 365 },
  { value: 'custom', label: 'Personalizado', days: 0 },
];

// Utilidades para dashboard ejecutivo
export const EXECUTIVE_UTILS = {
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

  formatChange: (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  },

  getChangeColor: (change: number, type: 'increase' | 'decrease' | 'stable'): 'success' | 'error' | 'warning' | 'info' => {
    if (type === 'increase') {
      return change > 10 ? 'error' : change > 5 ? 'warning' : 'info';
    } else if (type === 'decrease') {
      return change < -10 ? 'success' : change < -5 ? 'success' : 'info';
    }
    return 'info';
  },

  getStatusColor: (status: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'good':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  },

  getSeverityColor: (severity: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (severity) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  },

  getPriorityColor: (priority: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (priority) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'urgent':
        return 'error';
      default:
        return 'info';
    }
  },

  getImpactColor: (impact: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (impact) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'info';
    }
  },

  getTrendIcon: (trend: string): string => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  },

  getChangeIcon: (changeType: string): string => {
    switch (changeType) {
      case 'increase':
        return '📈';
      case 'decrease':
        return '📉';
      default:
        return '➡️';
    }
  },

  getStatusIcon: (status: string): string => {
    switch (status) {
      case 'good':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'critical':
        return '🚨';
      default:
        return 'ℹ️';
    }
  },

  getSeverityIcon: (severity: string): string => {
    switch (severity) {
      case 'low':
        return 'ℹ️';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
      case 'critical':
        return '🚨';
      default:
        return 'ℹ️';
    }
  },

  getPriorityIcon: (priority: string): string => {
    switch (priority) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🟠';
      case 'urgent':
        return '🔴';
      default:
        return '⚪';
    }
  },

  getImpactIcon: (impact: string): string => {
    switch (impact) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🔴';
      default:
        return '⚪';
    }
  },

  formatDateTime: (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  },

  formatTime: (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  getRelativeTime: (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  },

  calculateSavings: (current: number, previous: number, rate: number): number => {
    const difference = current - previous;
    return Math.abs(difference) * rate;
  },

  getEfficiencyStatus: (efficiency: number): 'good' | 'warning' | 'critical' => {
    if (efficiency >= 90) return 'good';
    if (efficiency >= 70) return 'warning';
    return 'critical';
  },

  getPowerFactorStatus: (powerFactor: number): 'good' | 'warning' | 'critical' => {
    if (powerFactor >= 0.95) return 'good';
    if (powerFactor >= 0.85) return 'warning';
    return 'critical';
  },

  getConsumptionStatus: (consumption: number, target: number): 'good' | 'warning' | 'critical' => {
    const percentage = (consumption / target) * 100;
    if (percentage <= 90) return 'good';
    if (percentage <= 110) return 'warning';
    return 'critical';
  },
};


