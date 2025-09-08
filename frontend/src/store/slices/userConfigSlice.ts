import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  UserProfile, 
  UserSettings, 
  UserTheme, 
  UserLayout, 
  UserTemplate,
  NotificationSettings,
  UserPreferences,
  DashboardConfig,
  ReportConfig,
  SearchConfig,
  AlertConfig,
  PrivacySettings,
  AccessibilitySettings
} from '../../types/userConfig';

interface UserConfigState {
  // Perfil de usuario
  profile: UserProfile | null;
  
  // Configuraciones
  settings: UserSettings[];
  themes: UserTheme[];
  layouts: UserLayout[];
  templates: UserTemplate[];
  
  // Configuraciones específicas
  notifications: NotificationSettings;
  preferences: UserPreferences;
  dashboard: DashboardConfig;
  reports: ReportConfig;
  search: SearchConfig;
  alerts: AlertConfig;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  
  // UI State
  activeTab: number;
  showProfile: boolean;
  showSettings: boolean;
  showThemes: boolean;
  showLayouts: boolean;
  showTemplates: boolean;
  showNotifications: boolean;
  showPrivacy: boolean;
  showAccessibility: boolean;
  
  // Configuración actual
  currentTheme: UserTheme | null;
  currentLayout: UserLayout | null;
  currentTemplate: UserTemplate | null;
  
  // Loading states
  loading: {
    profile: boolean;
    settings: boolean;
    themes: boolean;
    layouts: boolean;
    templates: boolean;
    notifications: boolean;
    preferences: boolean;
    dashboard: boolean;
    reports: boolean;
    search: boolean;
    alerts: boolean;
    privacy: boolean;
    accessibility: boolean;
  };
  
  // Error states
  error: {
    profile: string | null;
    settings: string | null;
    themes: string | null;
    layouts: string | null;
    templates: string | null;
    notifications: string | null;
    preferences: string | null;
    dashboard: string | null;
    reports: string | null;
    search: string | null;
    alerts: string | null;
    privacy: string | null;
    accessibility: string | null;
  };
}

const initialState: UserConfigState = {
  profile: null,
  settings: [],
  themes: [],
  layouts: [],
  templates: [],
  notifications: {
    email: {
      enabled: true,
      frequency: 'immediate',
      types: ['alerts', 'reports', 'system'],
    },
    push: {
      enabled: true,
      types: ['alerts', 'reports'],
    },
    sms: {
      enabled: false,
      types: ['critical_alerts'],
    },
    inApp: {
      enabled: true,
      types: ['alerts', 'reports', 'system'],
    },
    alerts: {
      enabled: true,
      severity: ['high', 'critical'],
      types: ['consumption', 'cost', 'efficiency'],
    },
    reports: {
      enabled: true,
      frequency: 'weekly',
      types: ['summary', 'detailed'],
    },
    system: {
      enabled: true,
      types: ['maintenance', 'updates'],
    },
  },
  preferences: {
    dashboard: {
      defaultView: 'executive',
      layout: 'grid',
      widgetSize: 'medium',
      autoRefresh: true,
      refreshInterval: 30000,
      showWelcome: true,
      showTips: true,
      showTours: true,
    },
    navigation: {
      sidebarCollapsed: false,
      showBreadcrumbs: true,
      showQuickActions: true,
      showRecentItems: true,
      showFavorites: true,
    },
    data: {
      defaultPeriod: 'thisMonth',
      defaultEntityType: 'all',
      defaultMetrics: ['consumption', 'cost', 'efficiency'],
      showInactive: false,
      showArchived: false,
      highlightChanges: true,
      showTrends: true,
      showComparisons: true,
    },
    display: {
      density: 'comfortable',
      fontSize: 'medium',
      colorBlind: false,
      highContrast: false,
      animations: true,
      transitions: true,
      shadows: true,
      borders: true,
    },
    performance: {
      lazyLoading: true,
      virtualScrolling: true,
      imageOptimization: true,
      dataCaching: true,
      backgroundSync: true,
    },
  },
  dashboard: {
    layout: 'grid',
    theme: 'light',
    widgets: [],
    columns: 3,
    spacing: 16,
    padding: 16,
    borderRadius: 8,
    shadows: true,
    animations: true,
    autoRefresh: true,
    refreshInterval: 30000,
    showGrid: false,
    showRulers: false,
    snapToGrid: true,
    gridSize: 8,
    lastUpdated: new Date().toISOString(),
  },
  reports: {
    defaultFormat: 'pdf',
    defaultTemplate: 'standard',
    defaultPeriod: 'thisMonth',
    defaultEntities: [],
    defaultMetrics: ['consumption', 'cost', 'efficiency'],
    defaultFilters: [],
    email: {
      enabled: true,
      recipients: [],
      subject: 'Reporte de Energía',
      body: 'Adjunto encontrará el reporte solicitado.',
      attachments: true,
      schedule: {
        enabled: false,
        frequency: 'weekly',
        day: 1,
        time: '09:00',
        timezone: 'America/Bogota',
      },
    },
    export: {
      includeCharts: true,
      includeTables: true,
      includeData: true,
      includeMetadata: true,
      compression: false,
      password: false,
      watermark: false,
    },
    formatting: {
      header: {
        enabled: true,
        title: 'Reporte de Energía',
        logo: '',
        company: '',
        date: true,
        page: true,
      },
      footer: {
        enabled: true,
        text: 'Generado automáticamente',
        page: true,
        total: true,
      },
      styling: {
        font: 'Arial',
        fontSize: 12,
        colors: ['#2196f3', '#4caf50', '#ff9800', '#f44336'],
        borders: true,
        shading: true,
      },
    },
  },
  search: {
    defaultMode: 'simple',
    defaultView: 'list',
    defaultSort: 'relevance',
    defaultOrder: 'desc',
    defaultLimit: 20,
    suggestions: {
      enabled: true,
      count: 10,
      types: ['kpi', 'alert', 'trend', 'insight'],
    },
    autocomplete: {
      enabled: true,
      count: 5,
      types: ['kpi', 'alert', 'trend', 'insight'],
    },
    filters: {
      enabled: true,
      default: [],
      saved: [],
    },
    history: {
      enabled: true,
      maxItems: 50,
      autoSave: true,
    },
    highlights: {
      enabled: true,
      color: '#ffeb3b',
      style: 'background',
    },
    fuzzy: {
      enabled: true,
      threshold: 0.6,
    },
  },
  alerts: {
    defaultSeverity: 'medium',
    defaultTypes: ['consumption', 'cost', 'efficiency'],
    defaultChannels: ['email', 'inApp'],
    defaultSchedule: {
      enabled: false,
      startTime: '08:00',
      endTime: '18:00',
      days: [1, 2, 3, 4, 5],
      timezone: 'America/Bogota',
    },
    escalation: {
      enabled: false,
      levels: [],
    },
    suppression: {
      enabled: false,
      rules: [],
    },
    grouping: {
      enabled: true,
      window: 300,
      maxAlerts: 10,
    },
  },
  privacy: {
    profile: {
      visible: true,
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showDepartment: true,
      showPosition: true,
    },
    activity: {
      visible: false,
      showSearches: false,
      showActions: false,
      showReports: false,
      showExports: false,
    },
    data: {
      visible: true,
      showKPIs: true,
      showAlerts: true,
      showTrends: true,
      showInsights: true,
    },
    sharing: {
      enabled: true,
      allowRequests: true,
      autoApprove: false,
      requireApproval: true,
    },
  },
  accessibility: {
    visual: {
      highContrast: false,
      colorBlind: false,
      fontSize: 'medium',
      fontFamily: 'Arial',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    motor: {
      largeTargets: false,
      keyboardNavigation: true,
      voiceControl: false,
      gestureControl: false,
    },
    cognitive: {
      simplifiedUI: false,
      clearLabels: true,
      tooltips: true,
      helpText: true,
      progressIndicators: true,
    },
    audio: {
      screenReader: false,
      audioDescriptions: false,
      soundEffects: false,
      voiceOver: false,
    },
  },
  activeTab: 0,
  showProfile: false,
  showSettings: false,
  showThemes: false,
  showLayouts: false,
  showTemplates: false,
  showNotifications: false,
  showPrivacy: false,
  showAccessibility: false,
  currentTheme: null,
  currentLayout: null,
  currentTemplate: null,
  loading: {
    profile: false,
    settings: false,
    themes: false,
    layouts: false,
    templates: false,
    notifications: false,
    preferences: false,
    dashboard: false,
    reports: false,
    search: false,
    alerts: false,
    privacy: false,
    accessibility: false,
  },
  error: {
    profile: null,
    settings: null,
    themes: null,
    layouts: null,
    templates: null,
    notifications: null,
    preferences: null,
    dashboard: null,
    reports: null,
    search: null,
    alerts: null,
    privacy: null,
    accessibility: null,
  },
};

const userConfigSlice = createSlice({
  name: 'userConfig',
  initialState,
  reducers: {
    // Perfil de usuario
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    
    // Configuraciones
    setSettings: (state, action: PayloadAction<UserSettings[]>) => {
      state.settings = action.payload;
    },
    
    addSetting: (state, action: PayloadAction<UserSettings>) => {
      state.settings.push(action.payload);
    },
    
    updateSetting: (state, action: PayloadAction<{ id: string; setting: Partial<UserSettings> }>) => {
      const index = state.settings.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.settings[index] = { ...state.settings[index], ...action.payload.setting };
      }
    },
    
    removeSetting: (state, action: PayloadAction<string>) => {
      state.settings = state.settings.filter(s => s.id !== action.payload);
    },
    
    // Temas
    setThemes: (state, action: PayloadAction<UserTheme[]>) => {
      state.themes = action.payload;
    },
    
    addTheme: (state, action: PayloadAction<UserTheme>) => {
      state.themes.push(action.payload);
    },
    
    updateTheme: (state, action: PayloadAction<{ id: string; theme: Partial<UserTheme> }>) => {
      const index = state.themes.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.themes[index] = { ...state.themes[index], ...action.payload.theme };
      }
    },
    
    removeTheme: (state, action: PayloadAction<string>) => {
      state.themes = state.themes.filter(t => t.id !== action.payload);
    },
    
    setCurrentTheme: (state, action: PayloadAction<UserTheme | null>) => {
      state.currentTheme = action.payload;
    },
    
    // Layouts
    setLayouts: (state, action: PayloadAction<UserLayout[]>) => {
      state.layouts = action.payload;
    },
    
    addLayout: (state, action: PayloadAction<UserLayout>) => {
      state.layouts.push(action.payload);
    },
    
    updateLayout: (state, action: PayloadAction<{ id: string; layout: Partial<UserLayout> }>) => {
      const index = state.layouts.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.layouts[index] = { ...state.layouts[index], ...action.payload.layout };
      }
    },
    
    removeLayout: (state, action: PayloadAction<string>) => {
      state.layouts = state.layouts.filter(l => l.id !== action.payload);
    },
    
    setCurrentLayout: (state, action: PayloadAction<UserLayout | null>) => {
      state.currentLayout = action.payload;
    },
    
    // Templates
    setTemplates: (state, action: PayloadAction<UserTemplate[]>) => {
      state.templates = action.payload;
    },
    
    addTemplate: (state, action: PayloadAction<UserTemplate>) => {
      state.templates.push(action.payload);
    },
    
    updateTemplate: (state, action: PayloadAction<{ id: string; template: Partial<UserTemplate> }>) => {
      const index = state.templates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = { ...state.templates[index], ...action.payload.template };
      }
    },
    
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(t => t.id !== action.payload);
    },
    
    setCurrentTemplate: (state, action: PayloadAction<UserTemplate | null>) => {
      state.currentTemplate = action.payload;
    },
    
    // Configuraciones específicas
    setNotifications: (state, action: PayloadAction<NotificationSettings>) => {
      state.notifications = action.payload;
    },
    
    updateNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
    },
    
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    setDashboard: (state, action: PayloadAction<DashboardConfig>) => {
      state.dashboard = action.payload;
    },
    
    updateDashboard: (state, action: PayloadAction<Partial<DashboardConfig>>) => {
      state.dashboard = { ...state.dashboard, ...action.payload };
    },
    
    setReports: (state, action: PayloadAction<ReportConfig>) => {
      state.reports = action.payload;
    },
    
    updateReports: (state, action: PayloadAction<Partial<ReportConfig>>) => {
      state.reports = { ...state.reports, ...action.payload };
    },
    
    setSearch: (state, action: PayloadAction<SearchConfig>) => {
      state.search = action.payload;
    },
    
    updateSearch: (state, action: PayloadAction<Partial<SearchConfig>>) => {
      state.search = { ...state.search, ...action.payload };
    },
    
    setAlerts: (state, action: PayloadAction<AlertConfig>) => {
      state.alerts = action.payload;
    },
    
    updateAlerts: (state, action: PayloadAction<Partial<AlertConfig>>) => {
      state.alerts = { ...state.alerts, ...action.payload };
    },
    
    setPrivacy: (state, action: PayloadAction<PrivacySettings>) => {
      state.privacy = action.payload;
    },
    
    updatePrivacy: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    
    setAccessibility: (state, action: PayloadAction<AccessibilitySettings>) => {
      state.accessibility = action.payload;
    },
    
    updateAccessibility: (state, action: PayloadAction<Partial<AccessibilitySettings>>) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    
    // UI State
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    
    setShowProfile: (state, action: PayloadAction<boolean>) => {
      state.showProfile = action.payload;
    },
    
    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    
    setShowThemes: (state, action: PayloadAction<boolean>) => {
      state.showThemes = action.payload;
    },
    
    setShowLayouts: (state, action: PayloadAction<boolean>) => {
      state.showLayouts = action.payload;
    },
    
    setShowTemplates: (state, action: PayloadAction<boolean>) => {
      state.showTemplates = action.payload;
    },
    
    setShowNotifications: (state, action: PayloadAction<boolean>) => {
      state.showNotifications = action.payload;
    },
    
    setShowPrivacy: (state, action: PayloadAction<boolean>) => {
      state.showPrivacy = action.payload;
    },
    
    setShowAccessibility: (state, action: PayloadAction<boolean>) => {
      state.showAccessibility = action.payload;
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      profile?: boolean;
      settings?: boolean;
      themes?: boolean;
      layouts?: boolean;
      templates?: boolean;
      notifications?: boolean;
      preferences?: boolean;
      dashboard?: boolean;
      reports?: boolean;
      search?: boolean;
      alerts?: boolean;
      privacy?: boolean;
      accessibility?: boolean;
    }>) => {
      if (action.payload.profile !== undefined) {
        state.loading.profile = action.payload.profile;
      }
      if (action.payload.settings !== undefined) {
        state.loading.settings = action.payload.settings;
      }
      if (action.payload.themes !== undefined) {
        state.loading.themes = action.payload.themes;
      }
      if (action.payload.layouts !== undefined) {
        state.loading.layouts = action.payload.layouts;
      }
      if (action.payload.templates !== undefined) {
        state.loading.templates = action.payload.templates;
      }
      if (action.payload.notifications !== undefined) {
        state.loading.notifications = action.payload.notifications;
      }
      if (action.payload.preferences !== undefined) {
        state.loading.preferences = action.payload.preferences;
      }
      if (action.payload.dashboard !== undefined) {
        state.loading.dashboard = action.payload.dashboard;
      }
      if (action.payload.reports !== undefined) {
        state.loading.reports = action.payload.reports;
      }
      if (action.payload.search !== undefined) {
        state.loading.search = action.payload.search;
      }
      if (action.payload.alerts !== undefined) {
        state.loading.alerts = action.payload.alerts;
      }
      if (action.payload.privacy !== undefined) {
        state.loading.privacy = action.payload.privacy;
      }
      if (action.payload.accessibility !== undefined) {
        state.loading.accessibility = action.payload.accessibility;
      }
    },
    
    // Error states
    setError: (state, action: PayloadAction<{
      profile?: string | null;
      settings?: string | null;
      themes?: string | null;
      layouts?: string | null;
      templates?: string | null;
      notifications?: string | null;
      preferences?: string | null;
      dashboard?: string | null;
      reports?: string | null;
      search?: string | null;
      alerts?: string | null;
      privacy?: string | null;
      accessibility?: string | null;
    }>) => {
      if (action.payload.profile !== undefined) {
        state.error.profile = action.payload.profile;
      }
      if (action.payload.settings !== undefined) {
        state.error.settings = action.payload.settings;
      }
      if (action.payload.themes !== undefined) {
        state.error.themes = action.payload.themes;
      }
      if (action.payload.layouts !== undefined) {
        state.error.layouts = action.payload.layouts;
      }
      if (action.payload.templates !== undefined) {
        state.error.templates = action.payload.templates;
      }
      if (action.payload.notifications !== undefined) {
        state.error.notifications = action.payload.notifications;
      }
      if (action.payload.preferences !== undefined) {
        state.error.preferences = action.payload.preferences;
      }
      if (action.payload.dashboard !== undefined) {
        state.error.dashboard = action.payload.dashboard;
      }
      if (action.payload.reports !== undefined) {
        state.error.reports = action.payload.reports;
      }
      if (action.payload.search !== undefined) {
        state.error.search = action.payload.search;
      }
      if (action.payload.alerts !== undefined) {
        state.error.alerts = action.payload.alerts;
      }
      if (action.payload.privacy !== undefined) {
        state.error.privacy = action.payload.privacy;
      }
      if (action.payload.accessibility !== undefined) {
        state.error.accessibility = action.payload.accessibility;
      }
    },
    
    clearErrors: (state) => {
      state.error = {
        profile: null,
        settings: null,
        themes: null,
        layouts: null,
        templates: null,
        notifications: null,
        preferences: null,
        dashboard: null,
        reports: null,
        search: null,
        alerts: null,
        privacy: null,
        accessibility: null,
      };
    },
    
    // Utilidades
    resetUserConfig: (state) => {
      state.profile = null;
      state.settings = [];
      state.themes = [];
      state.layouts = [];
      state.templates = [];
      state.currentTheme = null;
      state.currentLayout = null;
      state.currentTemplate = null;
      state.activeTab = 0;
      state.showProfile = false;
      state.showSettings = false;
      state.showThemes = false;
      state.showLayouts = false;
      state.showTemplates = false;
      state.showNotifications = false;
      state.showPrivacy = false;
      state.showAccessibility = false;
      state.loading = {
        profile: false,
        settings: false,
        themes: false,
        layouts: false,
        templates: false,
        notifications: false,
        preferences: false,
        dashboard: false,
        reports: false,
        search: false,
        alerts: false,
        privacy: false,
        accessibility: false,
      };
      state.error = {
        profile: null,
        settings: null,
        themes: null,
        layouts: null,
        templates: null,
        notifications: null,
        preferences: null,
        dashboard: null,
        reports: null,
        search: null,
        alerts: null,
        privacy: null,
        accessibility: null,
      };
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setSettings,
  addSetting,
  updateSetting,
  removeSetting,
  setThemes,
  addTheme,
  updateTheme,
  removeTheme,
  setCurrentTheme,
  setLayouts,
  addLayout,
  updateLayout,
  removeLayout,
  setCurrentLayout,
  setTemplates,
  addTemplate,
  updateTemplate,
  removeTemplate,
  setCurrentTemplate,
  setNotifications,
  updateNotifications,
  setPreferences,
  updatePreferences,
  setDashboard,
  updateDashboard,
  setReports,
  updateReports,
  setSearch,
  updateSearch,
  setAlerts,
  updateAlerts,
  setPrivacy,
  updatePrivacy,
  setAccessibility,
  updateAccessibility,
  setActiveTab,
  setShowProfile,
  setShowSettings,
  setShowThemes,
  setShowLayouts,
  setShowTemplates,
  setShowNotifications,
  setShowPrivacy,
  setShowAccessibility,
  setLoading,
  setError,
  clearErrors,
  resetUserConfig,
} = userConfigSlice.actions;

export default userConfigSlice.reducer;


