// Tipos para Reportes Automatizados y Programados

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'energy' | 'cost' | 'efficiency' | 'comparative' | 'kpi' | 'custom';
  type: 'dashboard' | 'chart' | 'table' | 'summary' | 'detailed';
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'image';
  sections: ReportSection[];
  filters: ReportFilter[];
  styling: ReportStyling;
  isPublic: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  usageCount: number;
  tags: string[];
}

export interface ReportSection {
  id: string;
  type: 'header' | 'summary' | 'chart' | 'table' | 'kpi' | 'text' | 'image' | 'footer';
  title: string;
  content: any;
  order: number;
  visible: boolean;
  height?: number;
  width?: number;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  styling?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    border?: string;
    padding?: number;
    margin?: number;
  };
}

export interface ReportFilter {
  id: string;
  name: string;
  type: 'dateRange' | 'entity' | 'metric' | 'period' | 'threshold' | 'custom';
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'in' | 'notIn' | 'between';
  value: any;
  required: boolean;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  description?: string;
}

export interface ReportStyling {
  theme: 'light' | 'dark' | 'corporate' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    title: string;
    subtitle: string;
    body: string;
    caption: string;
  };
  layout: {
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    spacing: number;
    columns: number;
  };
  branding: {
    logo?: string;
    companyName?: string;
    headerText?: string;
    footerText?: string;
    showTimestamp: boolean;
    showPageNumbers: boolean;
  };
}

export interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  templateId: string;
  template: ReportTemplate;
  schedule: ReportSchedule;
  recipients: ReportRecipient[];
  filters: ReportFilter[];
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successCount: number;
  failureCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastError?: string;
}

export interface ReportSchedule {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  frequency: number; // Para tipos personalizados
  time: string; // HH:MM formato 24h
  daysOfWeek?: number[]; // 0-6 (domingo-sábado)
  daysOfMonth?: number[]; // 1-31
  months?: number[]; // 1-12
  timezone: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface ReportRecipient {
  id: string;
  type: 'user' | 'email' | 'group';
  userId?: string;
  email: string;
  name: string;
  format: 'pdf' | 'excel' | 'csv' | 'html';
  isActive: boolean;
  lastSent?: string;
  failureCount: number;
  lastError?: string;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  template: ReportTemplate;
  scheduledReportId?: string;
  name: string;
  description: string;
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'image';
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  filePath?: string;
  fileSize?: number;
  downloadUrl?: string;
  filters: ReportFilter[];
  data: any;
  generatedBy: string;
  generatedAt: string;
  completedAt?: string;
  error?: string;
  recipients: ReportRecipient[];
  sentAt?: string;
  deliveryStatus: 'pending' | 'sent' | 'failed' | 'partial';
  deliveryError?: string;
}

export interface ReportHistory {
  id: string;
  reportId: string;
  report: GeneratedReport;
  action: 'created' | 'generated' | 'sent' | 'downloaded' | 'failed' | 'deleted';
  details: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  metadata?: any;
}

export interface ReportAnalytics {
  id: string;
  templateId: string;
  period: string;
  totalGenerated: number;
  totalSent: number;
  totalDownloaded: number;
  totalFailed: number;
  averageGenerationTime: number; // en segundos
  averageFileSize: number; // en bytes
  mostUsedFilters: Array<{
    filter: string;
    count: number;
  }>;
  mostActiveUsers: Array<{
    userId: string;
    userEmail: string;
    count: number;
  }>;
  deliverySuccessRate: number; // 0-100
  generationSuccessRate: number; // 0-100
  createdAt: string;
}

export interface ReportBuilder {
  id: string;
  name: string;
  description: string;
  template: ReportTemplate;
  isDraft: boolean;
  lastSaved: string;
  version: number;
  changes: Array<{
    id: string;
    type: 'add' | 'edit' | 'delete' | 'move' | 'resize';
    sectionId: string;
    data: any;
    timestamp: string;
  }>;
}

export interface ReportExport {
  id: string;
  templateId: string;
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'image';
  filters: ReportFilter[];
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filePath?: string;
  downloadUrl?: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  createdBy: string;
  createdAt: string;
}

// Configuración de reportes
export const REPORT_CATEGORIES = [
  { value: 'energy', label: 'Energía', icon: '⚡', color: '#2196f3' },
  { value: 'cost', label: 'Costo', icon: '💰', color: '#4caf50' },
  { value: 'efficiency', label: 'Eficiencia', icon: '🎯', color: '#ff9800' },
  { value: 'comparative', label: 'Comparativo', icon: '📊', color: '#9c27b0' },
  { value: 'kpi', label: 'KPIs', icon: '📈', color: '#f44336' },
  { value: 'custom', label: 'Personalizado', icon: '🛠️', color: '#607d8b' },
];

export const REPORT_TYPES = [
  { value: 'dashboard', label: 'Dashboard', icon: '📊' },
  { value: 'chart', label: 'Gráfico', icon: '📈' },
  { value: 'table', label: 'Tabla', icon: '📋' },
  { value: 'summary', label: 'Resumen', icon: '📄' },
  { value: 'detailed', label: 'Detallado', icon: '📑' },
];

export const REPORT_FORMATS = [
  { value: 'pdf', label: 'PDF', icon: '📄', mimeType: 'application/pdf' },
  { value: 'excel', label: 'Excel', icon: '📊', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { value: 'csv', label: 'CSV', icon: '📋', mimeType: 'text/csv' },
  { value: 'html', label: 'HTML', icon: '🌐', mimeType: 'text/html' },
  { value: 'image', label: 'Imagen', icon: '🖼️', mimeType: 'image/png' },
];

export const SCHEDULE_TYPES = [
  { value: 'daily', label: 'Diario', icon: '📅' },
  { value: 'weekly', label: 'Semanal', icon: '📆' },
  { value: 'monthly', label: 'Mensual', icon: '🗓️' },
  { value: 'quarterly', label: 'Trimestral', icon: '📊' },
  { value: 'yearly', label: 'Anual', icon: '📈' },
  { value: 'custom', label: 'Personalizado', icon: '⚙️' },
];

export const SECTION_TYPES = [
  { value: 'header', label: 'Encabezado', icon: '📝' },
  { value: 'summary', label: 'Resumen', icon: '📄' },
  { value: 'chart', label: 'Gráfico', icon: '📈' },
  { value: 'table', label: 'Tabla', icon: '📋' },
  { value: 'kpi', label: 'KPI', icon: '🎯' },
  { value: 'text', label: 'Texto', icon: '📝' },
  { value: 'image', label: 'Imagen', icon: '🖼️' },
  { value: 'footer', label: 'Pie de Página', icon: '📄' },
];

export const FILTER_TYPES = [
  { value: 'dateRange', label: 'Rango de Fechas', icon: '📅' },
  { value: 'entity', label: 'Entidad', icon: '🏢' },
  { value: 'metric', label: 'Métrica', icon: '📊' },
  { value: 'period', label: 'Período', icon: '⏰' },
  { value: 'threshold', label: 'Umbral', icon: '🎯' },
  { value: 'custom', label: 'Personalizado', icon: '⚙️' },
];

export const OPERATORS = [
  { value: 'equals', label: 'Igual a', symbol: '=' },
  { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
  { value: 'greaterThan', label: 'Mayor que', symbol: '>' },
  { value: 'lessThan', label: 'Menor que', symbol: '<' },
  { value: 'contains', label: 'Contiene', symbol: '⊃' },
  { value: 'in', label: 'En', symbol: '∈' },
  { value: 'notIn', label: 'No en', symbol: '∉' },
  { value: 'between', label: 'Entre', symbol: '↔' },
];

export const THEMES = [
  { value: 'light', label: 'Claro', colors: { primary: '#2196f3', secondary: '#4caf50', accent: '#ff9800' } },
  { value: 'dark', label: 'Oscuro', colors: { primary: '#1976d2', secondary: '#388e3c', accent: '#f57c00' } },
  { value: 'corporate', label: 'Corporativo', colors: { primary: '#1565c0', secondary: '#2e7d32', accent: '#ef6c00' } },
  { value: 'custom', label: 'Personalizado', colors: { primary: '#000000', secondary: '#000000', accent: '#000000' } },
];

// Utilidades para reportes
export const REPORT_UTILS = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatDuration: (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  },

  formatPercentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
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

  getStatusColor: (status: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'completed':
      case 'sent':
        return 'success';
      case 'failed':
        return 'error';
      case 'generating':
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  },

  getStatusIcon: (status: string): string => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'generating':
        return '⏳';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏸️';
      case 'cancelled':
        return '🚫';
      case 'sent':
        return '📧';
      case 'downloaded':
        return '⬇️';
      default:
        return '❓';
    }
  },

  getCategoryIcon: (category: string): string => {
    const cat = REPORT_CATEGORIES.find(c => c.value === category);
    return cat?.icon || '📊';
  },

  getCategoryColor: (category: string): string => {
    const cat = REPORT_CATEGORIES.find(c => c.value === category);
    return cat?.color || '#2196f3';
  },

  getFormatIcon: (format: string): string => {
    const fmt = REPORT_FORMATS.find(f => f.value === format);
    return fmt?.icon || '📄';
  },

  getFormatMimeType: (format: string): string => {
    const fmt = REPORT_FORMATS.find(f => f.value === format);
    return fmt?.mimeType || 'application/octet-stream';
  },

  calculateNextRun: (schedule: ReportSchedule): string => {
    const now = new Date();
    const time = schedule.time.split(':');
    const hour = parseInt(time[0]);
    const minute = parseInt(time[1]);
    
    let nextRun = new Date(now);
    nextRun.setHours(hour, minute, 0, 0);
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.toISOString();
  },

  validateSchedule: (schedule: ReportSchedule): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!schedule.type) {
      errors.push('El tipo de programación es requerido');
    }
    
    if (!schedule.time) {
      errors.push('La hora es requerida');
    }
    
    if (!schedule.timezone) {
      errors.push('La zona horaria es requerida');
    }
    
    if (!schedule.startDate) {
      errors.push('La fecha de inicio es requerida');
    }
    
    if (schedule.type === 'weekly' && (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0)) {
      errors.push('Los días de la semana son requeridos para programación semanal');
    }
    
    if (schedule.type === 'monthly' && (!schedule.daysOfMonth || schedule.daysOfMonth.length === 0)) {
      errors.push('Los días del mes son requeridos para programación mensual');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  generateReportId: (): string => {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateTemplateId: (): string => {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateScheduleId: (): string => {
    return `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};


