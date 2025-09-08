import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  ReportTemplate, 
  ScheduledReport, 
  GeneratedReport, 
  ReportHistory, 
  ReportAnalytics, 
  ReportBuilder, 
  ReportExport 
} from '../../types/reports';

interface ReportsState {
  // Plantillas de reportes
  templates: ReportTemplate[];
  selectedTemplate: ReportTemplate | null;
  
  // Reportes programados
  scheduledReports: ScheduledReport[];
  selectedScheduledReport: ScheduledReport | null;
  
  // Reportes generados
  generatedReports: GeneratedReport[];
  selectedGeneratedReport: GeneratedReport | null;
  
  // Historial de reportes
  reportHistory: ReportHistory[];
  
  // Analytics de reportes
  analytics: ReportAnalytics[];
  
  // Builder de reportes
  builders: ReportBuilder[];
  activeBuilder: ReportBuilder | null;
  
  // Exportaciones
  exports: ReportExport[];
  
  // Filtros y búsqueda
  filters: {
    category: string;
    type: string;
    format: string;
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
    searchTerm: string;
  };
  
  // UI State
  activeTab: number;
  viewMode: 'grid' | 'list' | 'builder';
  showFilters: boolean;
  showSettings: boolean;
  showBuilder: boolean;
  
  // Configuración
  autoRefresh: boolean;
  refreshInterval: number;
  maxFileSize: number; // en MB
  retentionDays: number;
  
  // Loading states
  loading: {
    templates: boolean;
    scheduledReports: boolean;
    generatedReports: boolean;
    reportHistory: boolean;
    analytics: boolean;
    builders: boolean;
    exports: boolean;
  };
  
  // Error states
  error: {
    templates: string | null;
    scheduledReports: string | null;
    generatedReports: string | null;
    reportHistory: string | null;
    analytics: string | null;
    builders: string | null;
    exports: string | null;
  };
}

const initialState: ReportsState = {
  templates: [],
  selectedTemplate: null,
  scheduledReports: [],
  selectedScheduledReport: null,
  generatedReports: [],
  selectedGeneratedReport: null,
  reportHistory: [],
  analytics: [],
  builders: [],
  activeBuilder: null,
  exports: [],
  filters: {
    category: 'all',
    type: 'all',
    format: 'all',
    status: 'all',
    dateRange: {
      start: '',
      end: '',
    },
    searchTerm: '',
  },
  activeTab: 0,
  viewMode: 'grid',
  showFilters: false,
  showSettings: false,
  showBuilder: false,
  autoRefresh: false,
  refreshInterval: 60000, // 1 minuto
  maxFileSize: 50, // 50 MB
  retentionDays: 90, // 90 días
  loading: {
    templates: false,
    scheduledReports: false,
    generatedReports: false,
    reportHistory: false,
    analytics: false,
    builders: false,
    exports: false,
  },
  error: {
    templates: null,
    scheduledReports: null,
    generatedReports: null,
    reportHistory: null,
    analytics: null,
    builders: null,
    exports: null,
  },
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Gestión de plantillas
    setTemplates: (state, action: PayloadAction<ReportTemplate[]>) => {
      state.templates = action.payload;
    },
    
    addTemplate: (state, action: PayloadAction<ReportTemplate>) => {
      state.templates.push(action.payload);
    },
    
    updateTemplate: (state, action: PayloadAction<{ id: string; template: Partial<ReportTemplate> }>) => {
      const index = state.templates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = { ...state.templates[index], ...action.payload.template };
      }
    },
    
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(t => t.id !== action.payload);
    },
    
    setSelectedTemplate: (state, action: PayloadAction<ReportTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    
    // Gestión de reportes programados
    setScheduledReports: (state, action: PayloadAction<ScheduledReport[]>) => {
      state.scheduledReports = action.payload;
    },
    
    addScheduledReport: (state, action: PayloadAction<ScheduledReport>) => {
      state.scheduledReports.push(action.payload);
    },
    
    updateScheduledReport: (state, action: PayloadAction<{ id: string; report: Partial<ScheduledReport> }>) => {
      const index = state.scheduledReports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.scheduledReports[index] = { ...state.scheduledReports[index], ...action.payload.report };
      }
    },
    
    removeScheduledReport: (state, action: PayloadAction<string>) => {
      state.scheduledReports = state.scheduledReports.filter(r => r.id !== action.payload);
    },
    
    setSelectedScheduledReport: (state, action: PayloadAction<ScheduledReport | null>) => {
      state.selectedScheduledReport = action.payload;
    },
    
    // Gestión de reportes generados
    setGeneratedReports: (state, action: PayloadAction<GeneratedReport[]>) => {
      state.generatedReports = action.payload;
    },
    
    addGeneratedReport: (state, action: PayloadAction<GeneratedReport>) => {
      state.generatedReports.push(action.payload);
    },
    
    updateGeneratedReport: (state, action: PayloadAction<{ id: string; report: Partial<GeneratedReport> }>) => {
      const index = state.generatedReports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.generatedReports[index] = { ...state.generatedReports[index], ...action.payload.report };
      }
    },
    
    removeGeneratedReport: (state, action: PayloadAction<string>) => {
      state.generatedReports = state.generatedReports.filter(r => r.id !== action.payload);
    },
    
    setSelectedGeneratedReport: (state, action: PayloadAction<GeneratedReport | null>) => {
      state.selectedGeneratedReport = action.payload;
    },
    
    // Gestión de historial
    setReportHistory: (state, action: PayloadAction<ReportHistory[]>) => {
      state.reportHistory = action.payload;
    },
    
    addReportHistory: (state, action: PayloadAction<ReportHistory>) => {
      state.reportHistory.push(action.payload);
    },
    
    // Gestión de analytics
    setAnalytics: (state, action: PayloadAction<ReportAnalytics[]>) => {
      state.analytics = action.payload;
    },
    
    addAnalytics: (state, action: PayloadAction<ReportAnalytics>) => {
      state.analytics.push(action.payload);
    },
    
    // Gestión de builders
    setBuilders: (state, action: PayloadAction<ReportBuilder[]>) => {
      state.builders = action.payload;
    },
    
    addBuilder: (state, action: PayloadAction<ReportBuilder>) => {
      state.builders.push(action.payload);
    },
    
    updateBuilder: (state, action: PayloadAction<{ id: string; builder: Partial<ReportBuilder> }>) => {
      const index = state.builders.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.builders[index] = { ...state.builders[index], ...action.payload.builder };
      }
    },
    
    removeBuilder: (state, action: PayloadAction<string>) => {
      state.builders = state.builders.filter(b => b.id !== action.payload);
    },
    
    setActiveBuilder: (state, action: PayloadAction<ReportBuilder | null>) => {
      state.activeBuilder = action.payload;
    },
    
    // Gestión de exportaciones
    setExports: (state, action: PayloadAction<ReportExport[]>) => {
      state.exports = action.payload;
    },
    
    addExport: (state, action: PayloadAction<ReportExport>) => {
      state.exports.push(action.payload);
    },
    
    updateExport: (state, action: PayloadAction<{ id: string; export: Partial<ReportExport> }>) => {
      const index = state.exports.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.exports[index] = { ...state.exports[index], ...action.payload.export };
      }
    },
    
    removeExport: (state, action: PayloadAction<string>) => {
      state.exports = state.exports.filter(e => e.id !== action.payload);
    },
    
    // Gestión de filtros
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        type: 'all',
        format: 'all',
        status: 'all',
        dateRange: {
          start: '',
          end: '',
        },
        searchTerm: '',
      };
    },
    
    // UI State
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'builder'>) => {
      state.viewMode = action.payload;
    },
    
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    
    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    
    setShowBuilder: (state, action: PayloadAction<boolean>) => {
      state.showBuilder = action.payload;
    },
    
    // Configuración
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    
    setMaxFileSize: (state, action: PayloadAction<number>) => {
      state.maxFileSize = action.payload;
    },
    
    setRetentionDays: (state, action: PayloadAction<number>) => {
      state.retentionDays = action.payload;
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      templates?: boolean;
      scheduledReports?: boolean;
      generatedReports?: boolean;
      reportHistory?: boolean;
      analytics?: boolean;
      builders?: boolean;
      exports?: boolean;
    }>) => {
      if (action.payload.templates !== undefined) {
        state.loading.templates = action.payload.templates;
      }
      if (action.payload.scheduledReports !== undefined) {
        state.loading.scheduledReports = action.payload.scheduledReports;
      }
      if (action.payload.generatedReports !== undefined) {
        state.loading.generatedReports = action.payload.generatedReports;
      }
      if (action.payload.reportHistory !== undefined) {
        state.loading.reportHistory = action.payload.reportHistory;
      }
      if (action.payload.analytics !== undefined) {
        state.loading.analytics = action.payload.analytics;
      }
      if (action.payload.builders !== undefined) {
        state.loading.builders = action.payload.builders;
      }
      if (action.payload.exports !== undefined) {
        state.loading.exports = action.payload.exports;
      }
    },
    
    // Error states
    setError: (state, action: PayloadAction<{
      templates?: string | null;
      scheduledReports?: string | null;
      generatedReports?: string | null;
      reportHistory?: string | null;
      analytics?: string | null;
      builders?: string | null;
      exports?: string | null;
    }>) => {
      if (action.payload.templates !== undefined) {
        state.error.templates = action.payload.templates;
      }
      if (action.payload.scheduledReports !== undefined) {
        state.error.scheduledReports = action.payload.scheduledReports;
      }
      if (action.payload.generatedReports !== undefined) {
        state.error.generatedReports = action.payload.generatedReports;
      }
      if (action.payload.reportHistory !== undefined) {
        state.error.reportHistory = action.payload.reportHistory;
      }
      if (action.payload.analytics !== undefined) {
        state.error.analytics = action.payload.analytics;
      }
      if (action.payload.builders !== undefined) {
        state.error.builders = action.payload.builders;
      }
      if (action.payload.exports !== undefined) {
        state.error.exports = action.payload.exports;
      }
    },
    
    clearErrors: (state) => {
      state.error = {
        templates: null,
        scheduledReports: null,
        generatedReports: null,
        reportHistory: null,
        analytics: null,
        builders: null,
        exports: null,
      };
    },
    
    // Utilidades
    resetReports: (state) => {
      state.templates = [];
      state.selectedTemplate = null;
      state.scheduledReports = [];
      state.selectedScheduledReport = null;
      state.generatedReports = [];
      state.selectedGeneratedReport = null;
      state.reportHistory = [];
      state.analytics = [];
      state.builders = [];
      state.activeBuilder = null;
      state.exports = [];
      state.activeTab = 0;
      state.viewMode = 'grid';
      state.showFilters = false;
      state.showSettings = false;
      state.showBuilder = false;
      state.loading = {
        templates: false,
        scheduledReports: false,
        generatedReports: false,
        reportHistory: false,
        analytics: false,
        builders: false,
        exports: false,
      };
      state.error = {
        templates: null,
        scheduledReports: null,
        generatedReports: null,
        reportHistory: null,
        analytics: null,
        builders: null,
        exports: null,
      };
    },
  },
});

export const {
  setTemplates,
  addTemplate,
  updateTemplate,
  removeTemplate,
  setSelectedTemplate,
  setScheduledReports,
  addScheduledReport,
  updateScheduledReport,
  removeScheduledReport,
  setSelectedScheduledReport,
  setGeneratedReports,
  addGeneratedReport,
  updateGeneratedReport,
  removeGeneratedReport,
  setSelectedGeneratedReport,
  setReportHistory,
  addReportHistory,
  setAnalytics,
  addAnalytics,
  setBuilders,
  addBuilder,
  updateBuilder,
  removeBuilder,
  setActiveBuilder,
  setExports,
  addExport,
  updateExport,
  removeExport,
  setFilters,
  clearFilters,
  setActiveTab,
  setViewMode,
  setShowFilters,
  setShowSettings,
  setShowBuilder,
  setAutoRefresh,
  setRefreshInterval,
  setMaxFileSize,
  setRetentionDays,
  setLoading,
  setError,
  clearErrors,
  resetReports,
} = reportsSlice.actions;

export default reportsSlice.reducer;


