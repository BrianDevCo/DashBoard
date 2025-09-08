import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  KPICard, 
  ConsumptionBySite, 
  ConsumptionByClient, 
  ConsumptionByGroup, 
  PeakDemandRecord, 
  ReactiveEnergyRatio, 
  KPISummary, 
  KPITrend, 
  KPIFilter, 
  KPIMetric, 
  KPIDashboard 
} from '../../types/kpis';

interface KPIsState {
  // KPIs principales
  kpiCards: KPICard[];
  kpiSummary: KPISummary | null;
  kpiTrend: KPITrend | null;
  
  // Consumos por categoría
  consumptionBySite: ConsumptionBySite[];
  consumptionByClient: ConsumptionByClient[];
  consumptionByGroup: ConsumptionByGroup[];
  
  // Registros especiales
  peakDemandRecords: PeakDemandRecord[];
  reactiveEnergyRatios: ReactiveEnergyRatio[];
  
  // Configuración
  metrics: KPIMetric[];
  dashboards: KPIDashboard[];
  currentDashboard: KPIDashboard | null;
  
  // Filtros y configuración
  filters: KPIFilter;
  refreshInterval: number;
  autoRefresh: boolean;
  
  // UI State
  selectedMetric: string | null;
  selectedSite: string | null;
  selectedClient: string | null;
  selectedGroup: string | null;
  viewMode: 'cards' | 'table' | 'chart';
  isCreatingDashboard: boolean;
  isEditingDashboard: boolean;
  
  // Loading states
  loading: {
    kpis: boolean;
    consumption: boolean;
    peakDemand: boolean;
    reactiveEnergy: boolean;
    summary: boolean;
    trend: boolean;
  };
  
  // Error states
  error: {
    kpis: string | null;
    consumption: string | null;
    peakDemand: string | null;
    reactiveEnergy: string | null;
    summary: string | null;
    trend: string | null;
  };
}

const initialState: KPIsState = {
  kpiCards: [],
  kpiSummary: null,
  kpiTrend: null,
  consumptionBySite: [],
  consumptionByClient: [],
  consumptionByGroup: [],
  peakDemandRecords: [],
  reactiveEnergyRatios: [],
  metrics: [],
  dashboards: [],
  currentDashboard: null,
  filters: {
    period: 'month',
    aggregation: 'site',
  },
  refreshInterval: 30000, // 30 segundos
  autoRefresh: true,
  selectedMetric: null,
  selectedSite: null,
  selectedClient: null,
  selectedGroup: null,
  viewMode: 'cards',
  isCreatingDashboard: false,
  isEditingDashboard: false,
  loading: {
    kpis: false,
    consumption: false,
    peakDemand: false,
    reactiveEnergy: false,
    summary: false,
    trend: false,
  },
  error: {
    kpis: null,
    consumption: null,
    peakDemand: null,
    reactiveEnergy: null,
    summary: null,
    trend: null,
  },
};

const kpisSlice = createSlice({
  name: 'kpis',
  initialState,
  reducers: {
    // Gestión de KPIs principales
    setKPICards: (state, action: PayloadAction<KPICard[]>) => {
      state.kpiCards = action.payload;
    },
    
    addKPICard: (state, action: PayloadAction<KPICard>) => {
      state.kpiCards.push(action.payload);
    },
    
    updateKPICard: (state, action: PayloadAction<{ id: string; card: Partial<KPICard> }>) => {
      const index = state.kpiCards.findIndex(card => card.id === action.payload.id);
      if (index !== -1) {
        state.kpiCards[index] = { ...state.kpiCards[index], ...action.payload.card };
      }
    },
    
    removeKPICard: (state, action: PayloadAction<string>) => {
      state.kpiCards = state.kpiCards.filter(card => card.id !== action.payload);
    },
    
    setKPISummary: (state, action: PayloadAction<KPISummary | null>) => {
      state.kpiSummary = action.payload;
    },
    
    setKPITrend: (state, action: PayloadAction<KPITrend | null>) => {
      state.kpiTrend = action.payload;
    },
    
    // Gestión de consumos por categoría
    setConsumptionBySite: (state, action: PayloadAction<ConsumptionBySite[]>) => {
      state.consumptionBySite = action.payload;
    },
    
    setConsumptionByClient: (state, action: PayloadAction<ConsumptionByClient[]>) => {
      state.consumptionByClient = action.payload;
    },
    
    setConsumptionByGroup: (state, action: PayloadAction<ConsumptionByGroup[]>) => {
      state.consumptionByGroup = action.payload;
    },
    
    // Gestión de registros especiales
    setPeakDemandRecords: (state, action: PayloadAction<PeakDemandRecord[]>) => {
      state.peakDemandRecords = action.payload;
    },
    
    addPeakDemandRecord: (state, action: PayloadAction<PeakDemandRecord>) => {
      state.peakDemandRecords.unshift(action.payload);
    },
    
    setReactiveEnergyRatios: (state, action: PayloadAction<ReactiveEnergyRatio[]>) => {
      state.reactiveEnergyRatios = action.payload;
    },
    
    // Gestión de métricas
    setMetrics: (state, action: PayloadAction<KPIMetric[]>) => {
      state.metrics = action.payload;
    },
    
    addMetric: (state, action: PayloadAction<KPIMetric>) => {
      state.metrics.push(action.payload);
    },
    
    updateMetric: (state, action: PayloadAction<{ id: string; metric: Partial<KPIMetric> }>) => {
      const index = state.metrics.findIndex(metric => metric.id === action.payload.id);
      if (index !== -1) {
        state.metrics[index] = { ...state.metrics[index], ...action.payload.metric };
      }
    },
    
    removeMetric: (state, action: PayloadAction<string>) => {
      state.metrics = state.metrics.filter(metric => metric.id !== action.payload);
    },
    
    // Gestión de dashboards
    setDashboards: (state, action: PayloadAction<KPIDashboard[]>) => {
      state.dashboards = action.payload;
    },
    
    addDashboard: (state, action: PayloadAction<KPIDashboard>) => {
      state.dashboards.push(action.payload);
    },
    
    updateDashboard: (state, action: PayloadAction<{ id: string; dashboard: Partial<KPIDashboard> }>) => {
      const index = state.dashboards.findIndex(dashboard => dashboard.id === action.payload.id);
      if (index !== -1) {
        state.dashboards[index] = { ...state.dashboards[index], ...action.payload.dashboard };
      }
    },
    
    removeDashboard: (state, action: PayloadAction<string>) => {
      state.dashboards = state.dashboards.filter(dashboard => dashboard.id !== action.payload);
    },
    
    setCurrentDashboard: (state, action: PayloadAction<KPIDashboard | null>) => {
      state.currentDashboard = action.payload;
    },
    
    // Gestión de filtros
    setFilters: (state, action: PayloadAction<Partial<KPIFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        period: 'month',
        aggregation: 'site',
      };
    },
    
    // Configuración de actualización
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    
    // UI State
    setSelectedMetric: (state, action: PayloadAction<string | null>) => {
      state.selectedMetric = action.payload;
    },
    
    setSelectedSite: (state, action: PayloadAction<string | null>) => {
      state.selectedSite = action.payload;
    },
    
    setSelectedClient: (state, action: PayloadAction<string | null>) => {
      state.selectedClient = action.payload;
    },
    
    setSelectedGroup: (state, action: PayloadAction<string | null>) => {
      state.selectedGroup = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'cards' | 'table' | 'chart'>) => {
      state.viewMode = action.payload;
    },
    
    setCreatingDashboard: (state, action: PayloadAction<boolean>) => {
      state.isCreatingDashboard = action.payload;
    },
    
    setEditingDashboard: (state, action: PayloadAction<boolean>) => {
      state.isEditingDashboard = action.payload;
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      kpis?: boolean;
      consumption?: boolean;
      peakDemand?: boolean;
      reactiveEnergy?: boolean;
      summary?: boolean;
      trend?: boolean;
    }>) => {
      if (action.payload.kpis !== undefined) {
        state.loading.kpis = action.payload.kpis;
      }
      if (action.payload.consumption !== undefined) {
        state.loading.consumption = action.payload.consumption;
      }
      if (action.payload.peakDemand !== undefined) {
        state.loading.peakDemand = action.payload.peakDemand;
      }
      if (action.payload.reactiveEnergy !== undefined) {
        state.loading.reactiveEnergy = action.payload.reactiveEnergy;
      }
      if (action.payload.summary !== undefined) {
        state.loading.summary = action.payload.summary;
      }
      if (action.payload.trend !== undefined) {
        state.loading.trend = action.payload.trend;
      }
    },
    
    // Error states
    setError: (state, action: PayloadAction<{
      kpis?: string | null;
      consumption?: string | null;
      peakDemand?: string | null;
      reactiveEnergy?: string | null;
      summary?: string | null;
      trend?: string | null;
    }>) => {
      if (action.payload.kpis !== undefined) {
        state.error.kpis = action.payload.kpis;
      }
      if (action.payload.consumption !== undefined) {
        state.error.consumption = action.payload.consumption;
      }
      if (action.payload.peakDemand !== undefined) {
        state.error.peakDemand = action.payload.peakDemand;
      }
      if (action.payload.reactiveEnergy !== undefined) {
        state.error.reactiveEnergy = action.payload.reactiveEnergy;
      }
      if (action.payload.summary !== undefined) {
        state.error.summary = action.payload.summary;
      }
      if (action.payload.trend !== undefined) {
        state.error.trend = action.payload.trend;
      }
    },
    
    clearErrors: (state) => {
      state.error = {
        kpis: null,
        consumption: null,
        peakDemand: null,
        reactiveEnergy: null,
        summary: null,
        trend: null,
      };
    },
    
    // Utilidades
    resetKPIs: (state) => {
      state.kpiCards = [];
      state.kpiSummary = null;
      state.kpiTrend = null;
      state.consumptionBySite = [];
      state.consumptionByClient = [];
      state.consumptionByGroup = [];
      state.peakDemandRecords = [];
      state.reactiveEnergyRatios = [];
      state.currentDashboard = null;
      state.filters = {
        period: 'month',
        aggregation: 'site',
      };
      state.selectedMetric = null;
      state.selectedSite = null;
      state.selectedClient = null;
      state.selectedGroup = null;
      state.viewMode = 'cards';
      state.isCreatingDashboard = false;
      state.isEditingDashboard = false;
      state.loading = {
        kpis: false,
        consumption: false,
        peakDemand: false,
        reactiveEnergy: false,
        summary: false,
        trend: false,
      };
      state.error = {
        kpis: null,
        consumption: null,
        peakDemand: null,
        reactiveEnergy: null,
        summary: null,
        trend: null,
      };
    },
  },
});

export const {
  setKPICards,
  addKPICard,
  updateKPICard,
  removeKPICard,
  setKPISummary,
  setKPITrend,
  setConsumptionBySite,
  setConsumptionByClient,
  setConsumptionByGroup,
  setPeakDemandRecords,
  addPeakDemandRecord,
  setReactiveEnergyRatios,
  setMetrics,
  addMetric,
  updateMetric,
  removeMetric,
  setDashboards,
  addDashboard,
  updateDashboard,
  removeDashboard,
  setCurrentDashboard,
  setFilters,
  clearFilters,
  setRefreshInterval,
  setAutoRefresh,
  setSelectedMetric,
  setSelectedSite,
  setSelectedClient,
  setSelectedGroup,
  setViewMode,
  setCreatingDashboard,
  setEditingDashboard,
  setLoading,
  setError,
  clearErrors,
  resetKPIs,
} = kpisSlice.actions;

export default kpisSlice.reducer;


