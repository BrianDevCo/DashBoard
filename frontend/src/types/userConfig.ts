// Tipos para Configuración de Usuario y Personalización

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  department?: string;
  position?: string;
  location?: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  numberFormat: string;
  theme: 'light' | 'dark' | 'auto' | 'corporate';
  notifications: NotificationSettings;
  preferences: UserPreferences;
  dashboard: DashboardConfig;
  reports: ReportConfig;
  search: SearchConfig;
  alerts: AlertConfig;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  lastUpdated: string;
  createdAt: string;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
    types: string[];
  };
  push: {
    enabled: boolean;
    types: string[];
  };
  sms: {
    enabled: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    types: string[];
  };
  alerts: {
    enabled: boolean;
    severity: string[];
    types: string[];
  };
  reports: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly' | 'never';
    types: string[];
  };
  system: {
    enabled: boolean;
    types: string[];
  };
}

export interface UserPreferences {
  dashboard: {
    defaultView: 'executive' | 'technical' | 'custom';
    layout: 'grid' | 'list' | 'compact';
    widgetSize: 'small' | 'medium' | 'large';
    autoRefresh: boolean;
    refreshInterval: number;
    showWelcome: boolean;
    showTips: boolean;
    showTours: boolean;
  };
  navigation: {
    sidebarCollapsed: boolean;
    showBreadcrumbs: boolean;
    showQuickActions: boolean;
    showRecentItems: boolean;
    showFavorites: boolean;
  };
  data: {
    defaultPeriod: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';
    defaultEntityType: 'all' | 'site' | 'client' | 'group' | 'meter';
    defaultMetrics: string[];
    showInactive: boolean;
    showArchived: boolean;
    highlightChanges: boolean;
    showTrends: boolean;
    showComparisons: boolean;
  };
  display: {
    density: 'comfortable' | 'compact' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
    colorBlind: boolean;
    highContrast: boolean;
    animations: boolean;
    transitions: boolean;
    shadows: boolean;
    borders: boolean;
  };
  performance: {
    lazyLoading: boolean;
    virtualScrolling: boolean;
    imageOptimization: boolean;
    dataCaching: boolean;
    backgroundSync: boolean;
  };
}

export interface DashboardConfig {
  layout: 'grid' | 'flex' | 'custom';
  theme: 'light' | 'dark' | 'corporate';
  widgets: DashboardWidget[];
  columns: number;
  spacing: number;
  padding: number;
  borderRadius: number;
  shadows: boolean;
  animations: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  gridSize: number;
  lastUpdated: string;
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'alert' | 'insight' | 'trend' | 'summary' | 'custom';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  locked: boolean;
  config: any;
  data: any;
  lastUpdated: string;
}

export interface ReportConfig {
  defaultFormat: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  defaultTemplate: string;
  defaultPeriod: string;
  defaultEntities: string[];
  defaultMetrics: string[];
  defaultFilters: any[];
  email: {
    enabled: boolean;
    recipients: string[];
    subject: string;
    body: string;
    attachments: boolean;
    schedule: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
      day: number;
      time: string;
      timezone: string;
    };
  };
  export: {
    includeCharts: boolean;
    includeTables: boolean;
    includeData: boolean;
    includeMetadata: boolean;
    compression: boolean;
    password: boolean;
    watermark: boolean;
  };
  formatting: {
    header: {
      enabled: boolean;
      title: string;
      logo: string;
      company: string;
      date: boolean;
      page: boolean;
    };
    footer: {
      enabled: boolean;
      text: string;
      page: boolean;
      total: boolean;
    };
    styling: {
      font: string;
      fontSize: number;
      colors: string[];
      borders: boolean;
      shading: boolean;
    };
  };
}

export interface SearchConfig {
  defaultMode: 'simple' | 'advanced' | 'saved';
  defaultView: 'list' | 'grid' | 'compact';
  defaultSort: string;
  defaultOrder: 'asc' | 'desc';
  defaultLimit: number;
  suggestions: {
    enabled: boolean;
    count: number;
    types: string[];
  };
  autocomplete: {
    enabled: boolean;
    count: number;
    types: string[];
  };
  filters: {
    enabled: boolean;
    default: string[];
    saved: string[];
  };
  history: {
    enabled: boolean;
    maxItems: number;
    autoSave: boolean;
  };
  highlights: {
    enabled: boolean;
    color: string;
    style: 'background' | 'underline' | 'bold' | 'italic';
  };
  fuzzy: {
    enabled: boolean;
    threshold: number;
  };
}

export interface AlertConfig {
  defaultSeverity: 'low' | 'medium' | 'high' | 'critical';
  defaultTypes: string[];
  defaultChannels: string[];
  defaultSchedule: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: number[];
    timezone: string;
  };
  escalation: {
    enabled: boolean;
    levels: Array<{
      delay: number;
      channels: string[];
      recipients: string[];
    }>;
  };
  suppression: {
    enabled: boolean;
    rules: Array<{
      condition: string;
      duration: number;
      channels: string[];
    }>;
  };
  grouping: {
    enabled: boolean;
    window: number;
    maxAlerts: number;
  };
}

export interface PrivacySettings {
  profile: {
    visible: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showDepartment: boolean;
    showPosition: boolean;
  };
  activity: {
    visible: boolean;
    showSearches: boolean;
    showActions: boolean;
    showReports: boolean;
    showExports: boolean;
  };
  data: {
    visible: boolean;
    showKPIs: boolean;
    showAlerts: boolean;
    showTrends: boolean;
    showInsights: boolean;
  };
  sharing: {
    enabled: boolean;
    allowRequests: boolean;
    autoApprove: boolean;
    requireApproval: boolean;
  };
}

export interface AccessibilitySettings {
  visual: {
    highContrast: boolean;
    colorBlind: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    fontFamily: string;
    lineHeight: number;
    letterSpacing: number;
  };
  motor: {
    largeTargets: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
    gestureControl: boolean;
  };
  cognitive: {
    simplifiedUI: boolean;
    clearLabels: boolean;
    tooltips: boolean;
    helpText: boolean;
    progressIndicators: boolean;
  };
  audio: {
    screenReader: boolean;
    audioDescriptions: boolean;
    soundEffects: boolean;
    voiceOver: boolean;
  };
}

export interface UserSettings {
  id: string;
  userId: string;
  category: 'profile' | 'preferences' | 'dashboard' | 'reports' | 'search' | 'alerts' | 'privacy' | 'accessibility';
  settings: any;
  isDefault: boolean;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: string[];
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
    canShare: string[];
  };
  lastUpdated: string;
  createdAt: string;
  updatedBy: string;
}

export interface UserTheme {
  id: string;
  name: string;
  description?: string;
  type: 'light' | 'dark' | 'corporate' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  spacing: {
    unit: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    enabled: boolean;
    levels: string[];
  };
  borders: {
    enabled: boolean;
    radius: number;
    width: number;
    style: string;
  };
  animations: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
  isDefault: boolean;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: string[];
  lastUpdated: string;
  createdAt: string;
  createdBy: string;
}

export interface UserLayout {
  id: string;
  name: string;
  description?: string;
  type: 'dashboard' | 'report' | 'search' | 'custom';
  layout: any;
  widgets: any[];
  config: any;
  isDefault: boolean;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: string[];
  lastUpdated: string;
  createdAt: string;
  createdBy: string;
}

export interface UserTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'report' | 'dashboard' | 'search' | 'alert' | 'custom';
  template: any;
  config: any;
  isDefault: boolean;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: string[];
  lastUpdated: string;
  createdAt: string;
  createdBy: string;
}

// Configuración de idiomas
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// Configuración de zonas horarias
export const SUPPORTED_TIMEZONES = [
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)', offset: '-05:00' },
  { value: 'America/New_York', label: 'New York (UTC-5)', offset: '-05:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)', offset: '-08:00' },
  { value: 'Europe/London', label: 'London (UTC+0)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Paris (UTC+1)', offset: '+01:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', offset: '+09:00' },
  { value: 'UTC', label: 'UTC (UTC+0)', offset: '+00:00' },
];

// Configuración de formatos de fecha
export const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '25/12/2023' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/25/2023' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2023-12-25' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY', example: '25-12-2023' },
  { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY', example: '12-25-2023' },
];

// Configuración de formatos de hora
export const TIME_FORMATS = [
  { value: '12h', label: '12 horas (AM/PM)', example: '2:30 PM' },
  { value: '24h', label: '24 horas', example: '14:30' },
];

// Configuración de monedas
export const SUPPORTED_CURRENCIES = [
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
];

// Configuración de formatos numéricos
export const NUMBER_FORMATS = [
  { value: '1,234.56', label: '1,234.56 (US)', example: '1,234.56' },
  { value: '1.234,56', label: '1.234,56 (EU)', example: '1.234,56' },
  { value: '1 234,56', label: '1 234,56 (FR)', example: '1 234,56' },
  { value: '1,234', label: '1,234 (Integer)', example: '1,234' },
];

// Configuración de temas
export const THEME_OPTIONS = [
  { value: 'light', label: 'Claro', icon: '☀️' },
  { value: 'dark', label: 'Oscuro', icon: '🌙' },
  { value: 'auto', label: 'Automático', icon: '🔄' },
  { value: 'corporate', label: 'Corporativo', icon: '🏢' },
];

// Configuración de densidades
export const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Cómodo', description: 'Más espacio entre elementos' },
  { value: 'compact', label: 'Compacto', description: 'Menos espacio entre elementos' },
  { value: 'spacious', label: 'Espacioso', description: 'Máximo espacio entre elementos' },
];

// Configuración de tamaños de fuente
export const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Pequeño', size: 12 },
  { value: 'medium', label: 'Mediano', size: 14 },
  { value: 'large', label: 'Grande', size: 16 },
  { value: 'extra-large', label: 'Extra Grande', size: 18 },
];

// Utilidades para configuración de usuario
export const USER_CONFIG_UTILS = {
  formatDate: (date: string, format: string): string => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      case 'MM-DD-YYYY':
        return `${month}-${day}-${year}`;
      default:
        return d.toLocaleDateString();
    }
  },

  formatTime: (date: string, format: '12h' | '24h'): string => {
    const d = new Date(date);
    
    if (format === '12h') {
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  },

  formatCurrency: (amount: number, currency: string): string => {
    const currencyConfig = SUPPORTED_CURRENCIES.find(c => c.code === currency);
    if (!currencyConfig) return amount.toString();
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  formatNumber: (number: number, format: string): string => {
    switch (format) {
      case '1,234.56':
        return number.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case '1.234,56':
        return number.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case '1 234,56':
        return number.toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case '1,234':
        return number.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      default:
        return number.toString();
    }
  },

  getLanguageName: (code: string): string => {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return language?.name || code;
  },

  getTimezoneName: (value: string): string => {
    const timezone = SUPPORTED_TIMEZONES.find(t => t.value === value);
    return timezone?.label || value;
  },

  getCurrencyName: (code: string): string => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === code);
    return currency?.name || code;
  },

  getThemeName: (value: string): string => {
    const theme = THEME_OPTIONS.find(t => t.value === value);
    return theme?.label || value;
  },

  getDensityName: (value: string): string => {
    const density = DENSITY_OPTIONS.find(d => d.value === value);
    return density?.label || value;
  },

  getFontSizeName: (value: string): string => {
    const fontSize = FONT_SIZE_OPTIONS.find(f => f.value === value);
    return fontSize?.label || value;
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  generateAvatar: (name: string): string => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
  },

  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  generateUserId: (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateConfigId: (): string => {
    return `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateThemeId: (): string => {
    return `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateLayoutId: (): string => {
    return `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateTemplateId: (): string => {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};


