import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  ExecutiveKPI, 
  ExecutiveAlert, 
  ExecutiveTrend, 
  ExecutiveSummary, 
  ExecutiveInsight, 
  ExecutiveWidget, 
  ExecutiveDashboard, 
  ExecutiveFilter 
} from '../../types/executive';

interface ExecutiveState {
  // Datos principales
  kpis: ExecutiveKPI[];
  alerts: ExecutiveAlert[];
  trends: ExecutiveTrend[];
  summary: ExecutiveSummary | null;
  insights: ExecutiveInsight[];
  widgets: ExecutiveWidget[];
  dashboard: ExecutiveDashboard | null;
  
  // Filtros
  filter: ExecutiveFilter;
  
  // UI State
  activeTab: number;
  viewMode: 'grid' | 'list' | 'compact';
  showAlerts: boolean;
  showInsights: boolean;
  showTrends: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Configuración
  theme: 'light' | 'dark' | 'corporate';
  layout: 'grid' | 'flex' | 'custom';
  widgetSize: 'small' | 'medium' | 'large';
  
  // Loading states
  loading: {
    kpis: boolean;
    alerts: boolean;
    trends: boolean;
    summary: boolean;
    insights: boolean;
    widgets: boolean;
    dashboard: boolean;
  };
  
  // Error states
  error: {
    kpis: string | null;
    alerts: string | null;
    trends: string | null;
    summary: string | null;
    insights: string | null;
    widgets: string | null;
    dashboard: string | null;
  };
}

const initialState: ExecutiveState = {
  kpis: [],
  alerts: [],
  trends: [],
  summary: null,
  insights: [],
  widgets: [],
  dashboard: null,
  filter: {
    period: 'thisMonth',
    entityType: 'all',
    entityIds: [],
    metrics: ['consumption', 'cost', 'efficiency'],
    includeAlerts: true,
    includeInsights: true,
    alertSeverity: 'all',
    insightPriority: 'all',
  },
  activeTab: 0,
  viewMode: 'grid',
  showAlerts: true,
  showInsights: true,
  showTrends: true,
  autoRefresh: true,
  refreshInterval: 30000, // 30 segundos
  theme: 'light',
  layout: 'grid',
  widgetSize: 'medium',
  loading: {
    kpis: false,
    alerts: false,
    trends: false,
    summary: false,
    insights: false,
    widgets: false,
    dashboard: false,
  },
  error: {
    kpis: null,
    alerts: null,
    trends: null,
    summary: null,
    insights: null,
    widgets: null,
    dashboard: null,
  },
};

const executiveSlice = createSlice({
  name: 'executive',
  initialState,
  reducers: {
    // Gestión de KPIs
    setKPIs: (state, action: PayloadAction<ExecutiveKPI[]>) => {
      state.kpis = action.payload;
    },
    
    addKPI: (state, action: PayloadAction<ExecutiveKPI>) => {
      state.kpis.push(action.payload);
    },
    
    updateKPI: (state, action: PayloadAction<{ id: string; kpi: Partial<ExecutiveKPI> }>) => {
      const index = state.kpis.findIndex(k => k.id === action.payload.id);
      if (index !== -1) {
        state.kpis[index] = { ...state.kpis[index], ...action.payload.kpi };
      }
    },
    
    removeKPI: (state, action: PayloadAction<string>) => {
      state.kpis = state.kpis.filter(k => k.id !== action.payload);
    },
    
    // Gestión de alertas
    setAlerts: (state, action: PayloadAction<ExecutiveAlert[]>) => {
      state.alerts = action.payload;
    },
    
    addAlert: (state, action: PayloadAction<ExecutiveAlert>) => {
      state.alerts.push(action.payload);
    },
    
    updateAlert: (state, action: PayloadAction<{ id: string; alert: Partial<ExecutiveAlert> }>) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = { ...state.alerts[index], ...action.payload.alert };
      }
    },
    
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    
    acknowledgeAlert: (state, action: PayloadAction<{ id: string; userId: string }>) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index].status = 'acknowledged';
        state.alerts[index].acknowledgedAt = new Date().toISOString();
        state.alerts[index].acknowledgedBy = action.payload.userId;
      }
    },
    
    resolveAlert: (state, action: PayloadAction<{ id: string; userId: string }>) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index].status = 'resolved';
        state.alerts[index].resolvedAt = new Date().toISOString();
        state.alerts[index].resolvedBy = action.payload.userId;
      }
    },
    
    // Gestión de tendencias
    setTrends: (state, action: PayloadAction<ExecutiveTrend[]>) => {
      state.trends = action.payload;
    },
    
    addTrend: (state, action: PayloadAction<ExecutiveTrend>) => {
      state.trends.push(action.payload);
    },
    
    updateTrend: (state, action: PayloadAction<{ id: string; trend: Partial<ExecutiveTrend> }>) => {
      const index = state.trends.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.trends[index] = { ...state.trends[index], ...action.payload.trend };
      }
    },
    
    removeTrend: (state, action: PayloadAction<string>) => {
      state.trends = state.trends.filter(t => t.id !== action.payload);
    },
    
    // Gestión de resumen
    setSummary: (state, action: PayloadAction<ExecutiveSummary | null>) => {
      state.summary = action.payload;
    },
    
    updateSummary: (state, action: PayloadAction<Partial<ExecutiveSummary>>) => {
      if (state.summary) {
        state.summary = { ...state.summary, ...action.payload };
      }
    },
    
    // Gestión de insights
    setInsights: (state, action: PayloadAction<ExecutiveInsight[]>) => {
      state.insights = action.payload;
    },
    
    addInsight: (state, action: PayloadAction<ExecutiveInsight>) => {
      state.insights.push(action.payload);
    },
    
    updateInsight: (state, action: PayloadAction<{ id: string; insight: Partial<ExecutiveInsight> }>) => {
      const index = state.insights.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.insights[index] = { ...state.insights[index], ...action.payload.insight };
      }
    },
    
    removeInsight: (state, action: PayloadAction<string>) => {
      state.insights = state.insights.filter(i => i.id !== action.payload);
    },
    
    // Gestión de widgets
    setWidgets: (state, action: PayloadAction<ExecutiveWidget[]>) => {
      state.widgets = action.payload;
    },
    
    addWidget: (state, action: PayloadAction<ExecutiveWidget>) => {
      state.widgets.push(action.payload);
    },
    
    updateWidget: (state, action: PayloadAction<{ id: string; widget: Partial<ExecutiveWidget> }>) => {
      const index = state.widgets.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index] = { ...state.widgets[index], ...action.payload.widget };
      }
    },
    
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter(w => w.id !== action.payload);
    },
    
    moveWidget: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const index = state.widgets.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index].position = { ...state.widgets[index].position, ...action.payload.position };
      }
    },
    
    resizeWidget: (state, action: PayloadAction<{ id: string; size: { width: number; height: number } }>) => {
      const index = state.widgets.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index].position.width = action.payload.size.width;
        state.widgets[index].position.height = action.payload.size.height;
      }
    },
    
    // Gestión de dashboard
    setDashboard: (state, action: PayloadAction<ExecutiveDashboard | null>) => {
      state.dashboard = action.payload;
    },
    
    updateDashboard: (state, action: PayloadAction<Partial<ExecutiveDashboard>>) => {
      if (state.dashboard) {
        state.dashboard = { ...state.dashboard, ...action.payload };
      }
    },
    
    // Gestión de filtros
    setFilter: (state, action: PayloadAction<Partial<ExecutiveFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    
    clearFilter: (state) => {
      state.filter = {
        period: 'thisMonth',
        entityType: 'all',
        entityIds: [],
        metrics: ['consumption', 'cost', 'efficiency'],
        includeAlerts: true,
        includeInsights: true,
        alertSeverity: 'all',
        insightPriority: 'all',
      };
    },
    
    // UI State
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'compact'>) => {
      state.viewMode = action.payload;
    },
    
    setShowAlerts: (state, action: PayloadAction<boolean>) => {
      state.showAlerts = action.payload;
    },
    
    setShowInsights: (state, action: PayloadAction<boolean>) => {
      state.showInsights = action.payload;
    },
    
    setShowTrends: (state, action: PayloadAction<boolean>) => {
      state.showTrends = action.payload;
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    
    // Configuración
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'corporate'>) => {
      state.theme = action.payload;
    },
    
    setLayout: (state, action: PayloadAction<'grid' | 'flex' | 'custom'>) => {
      state.layout = action.payload;
    },
    
    setWidgetSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.widgetSize = action.payload;
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      kpis?: boolean;
      alerts?: boolean;
      trends?: boolean;
      summary?: boolean;
      insights?: boolean;
      widgets?: boolean;
      dashboard?: boolean;
    }>) => {
      if (action.payload.kpis !== undefined) {
        state.loading.kpis = action.payload.kpis;
      }
      if (action.payload.alerts !== undefined) {
        state.loading.alerts = action.payload.alerts;
      }
      if (action.payload.trends !== undefined) {
        state.loading.trends = action.payload.trends;
      }
      if (action.payload.summary !== undefined) {
        state.loading.summary = action.payload.summary;
      }
      if (action.payload.insights !== undefined) {
        state.loading.insights = action.payload.insights;
      }
      if (action.payload.widgets !== undefined) {
        state.loading.widgets = action.payload.widgets;
      }
      if (action.payload.dashboard !== undefined) {
        state.loading.dashboard = action.payload.dashboard;
      }
    },
    
    // Error states
    setError: (state, action: PayloadAction<{
      kpis?: string | null;
      alerts?: string | null;
      trends?: string | null;
      summary?: string | null;
      insights?: string | null;
      widgets?: string | null;
      dashboard?: string | null;
    }>) => {
      if (action.payload.kpis !== undefined) {
        state.error.kpis = action.payload.kpis;
      }
      if (action.payload.alerts !== undefined) {
        state.error.alerts = action.payload.alerts;
      }
      if (action.payload.trends !== undefined) {
        state.error.trends = action.payload.trends;
      }
      if (action.payload.summary !== undefined) {
        state.error.summary = action.payload.summary;
      }
      if (action.payload.insights !== undefined) {
        state.error.insights = action.payload.insights;
      }
      if (action.payload.widgets !== undefined) {
        state.error.widgets = action.payload.widgets;
      }
      if (action.payload.dashboard !== undefined) {
        state.error.dashboard = action.payload.dashboard;
      }
    },
    
    clearErrors: (state) => {
      state.error = {
        kpis: null,
        alerts: null,
        trends: null,
        summary: null,
        insights: null,
        widgets: null,
        dashboard: null,
      };
    },
    
    // Utilidades
    resetExecutive: (state) => {
      state.kpis = [];
      state.alerts = [];
      state.trends = [];
      state.summary = null;
      state.insights = [];
      state.widgets = [];
      state.dashboard = null;
      state.activeTab = 0;
      state.viewMode = 'grid';
      state.showAlerts = true;
      state.showInsights = true;
      state.showTrends = true;
      state.loading = {
        kpis: false,
        alerts: false,
        trends: false,
        summary: false,
        insights: false,
        widgets: false,
        dashboard: false,
      };
      state.error = {
        kpis: null,
        alerts: null,
        trends: null,
        summary: null,
        insights: null,
        widgets: null,
        dashboard: null,
      };
    },
  },
});

export const {
  setKPIs,
  addKPI,
  updateKPI,
  removeKPI,
  setAlerts,
  addAlert,
  updateAlert,
  removeAlert,
  acknowledgeAlert,
  resolveAlert,
  setTrends,
  addTrend,
  updateTrend,
  removeTrend,
  setSummary,
  updateSummary,
  setInsights,
  addInsight,
  updateInsight,
  removeInsight,
  setWidgets,
  addWidget,
  updateWidget,
  removeWidget,
  moveWidget,
  resizeWidget,
  setDashboard,
  updateDashboard,
  setFilter,
  clearFilter,
  setActiveTab,
  setViewMode,
  setShowAlerts,
  setShowInsights,
  setShowTrends,
  setAutoRefresh,
  setRefreshInterval,
  setTheme,
  setLayout,
  setWidgetSize,
  setLoading,
  setError,
  clearErrors,
  resetExecutive,
} = executiveSlice.actions;

export default executiveSlice.reducer;
