import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  ConsumptionComparison, 
  TrendAnalysis, 
  RankingEntry, 
  HeatmapData, 
  ComparativeAnalysis, 
  ComparisonFilter, 
  TrendFilter, 
  RankingFilter, 
  HeatmapFilter 
} from '../../types/comparative';

interface ComparativeState {
  // Datos principales
  comparisons: ConsumptionComparison[];
  trends: TrendAnalysis[];
  rankings: RankingEntry[];
  heatmaps: HeatmapData[];
  analyses: ComparativeAnalysis[];
  
  // Filtros
  comparisonFilter: ComparisonFilter;
  trendFilter: TrendFilter;
  rankingFilter: RankingFilter;
  heatmapFilter: HeatmapFilter;
  
  // UI State
  activeTab: number;
  selectedAnalysis: ComparativeAnalysis | null;
  selectedEntity: string | null;
  selectedMetric: string | null;
  viewMode: 'table' | 'chart' | 'heatmap';
  showInsights: boolean;
  showForecast: boolean;
  
  // Configuración
  autoRefresh: boolean;
  refreshInterval: number;
  forecastDays: number;
  confidenceLevel: number;
  
  // Loading states
  loading: {
    comparisons: boolean;
    trends: boolean;
    rankings: boolean;
    heatmaps: boolean;
    analyses: boolean;
  };
  
  // Error states
  error: {
    comparisons: string | null;
    trends: string | null;
    rankings: string | null;
    heatmaps: string | null;
    analyses: string | null;
  };
}

const initialState: ComparativeState = {
  comparisons: [],
  trends: [],
  rankings: [],
  heatmaps: [],
  analyses: [],
  comparisonFilter: {
    entityType: 'all',
    entityIds: [],
    periodType: 'current_vs_previous',
    currentPeriod: {
      startDate: '',
      endDate: '',
    },
    comparisonPeriod: {
      startDate: '',
      endDate: '',
    },
    metrics: ['consumption', 'cost'],
    groupBy: 'entity',
    sortBy: 'variance',
    sortOrder: 'desc',
  },
  trendFilter: {
    entityType: 'all',
    entityIds: [],
    metric: 'consumption',
    period: 'month',
    startDate: '',
    endDate: '',
    trendType: 'auto',
    forecastDays: 7,
    includeSeasonality: true,
    detectAnomalies: true,
  },
  rankingFilter: {
    entityType: 'all',
    entityIds: [],
    metric: 'consumption',
    period: 'month',
    startDate: '',
    endDate: '',
    limit: 20,
    includePreviousRank: true,
  },
  heatmapFilter: {
    entityType: 'all',
    entityIds: [],
    period: 'month',
    startDate: '',
    endDate: '',
    metric: 'consumption',
    aggregation: 'sum',
    normalize: true,
    includeWeekends: true,
  },
  activeTab: 0,
  selectedAnalysis: null,
  selectedEntity: null,
  selectedMetric: null,
  viewMode: 'table',
  showInsights: true,
  showForecast: false,
  autoRefresh: false,
  refreshInterval: 60000, // 1 minuto
  forecastDays: 7,
  confidenceLevel: 0.95,
  loading: {
    comparisons: false,
    trends: false,
    rankings: false,
    heatmaps: false,
    analyses: false,
  },
  error: {
    comparisons: null,
    trends: null,
    rankings: null,
    heatmaps: null,
    analyses: null,
  },
};

const comparativeSlice = createSlice({
  name: 'comparative',
  initialState,
  reducers: {
    // Gestión de comparaciones
    setComparisons: (state, action: PayloadAction<ConsumptionComparison[]>) => {
      state.comparisons = action.payload;
    },
    
    addComparison: (state, action: PayloadAction<ConsumptionComparison>) => {
      state.comparisons.push(action.payload);
    },
    
    updateComparison: (state, action: PayloadAction<{ id: string; comparison: Partial<ConsumptionComparison> }>) => {
      const index = state.comparisons.findIndex(comp => comp.id === action.payload.id);
      if (index !== -1) {
        state.comparisons[index] = { ...state.comparisons[index], ...action.payload.comparison };
      }
    },
    
    removeComparison: (state, action: PayloadAction<string>) => {
      state.comparisons = state.comparisons.filter(comp => comp.id !== action.payload);
    },
    
    // Gestión de tendencias
    setTrends: (state, action: PayloadAction<TrendAnalysis[]>) => {
      state.trends = action.payload;
    },
    
    addTrend: (state, action: PayloadAction<TrendAnalysis>) => {
      state.trends.push(action.payload);
    },
    
    updateTrend: (state, action: PayloadAction<{ id: string; trend: Partial<TrendAnalysis> }>) => {
      const index = state.trends.findIndex(trend => trend.id === action.payload.id);
      if (index !== -1) {
        state.trends[index] = { ...state.trends[index], ...action.payload.trend };
      }
    },
    
    removeTrend: (state, action: PayloadAction<string>) => {
      state.trends = state.trends.filter(trend => trend.id !== action.payload);
    },
    
    // Gestión de rankings
    setRankings: (state, action: PayloadAction<RankingEntry[]>) => {
      state.rankings = action.payload;
    },
    
    addRanking: (state, action: PayloadAction<RankingEntry>) => {
      state.rankings.push(action.payload);
    },
    
    updateRanking: (state, action: PayloadAction<{ id: string; ranking: Partial<RankingEntry> }>) => {
      const index = state.rankings.findIndex(rank => rank.id === action.payload.id);
      if (index !== -1) {
        state.rankings[index] = { ...state.rankings[index], ...action.payload.ranking };
      }
    },
    
    removeRanking: (state, action: PayloadAction<string>) => {
      state.rankings = state.rankings.filter(rank => rank.id !== action.payload);
    },
    
    // Gestión de mapas de calor
    setHeatmaps: (state, action: PayloadAction<HeatmapData[]>) => {
      state.heatmaps = action.payload;
    },
    
    addHeatmap: (state, action: PayloadAction<HeatmapData>) => {
      state.heatmaps.push(action.payload);
    },
    
    updateHeatmap: (state, action: PayloadAction<{ id: string; heatmap: Partial<HeatmapData> }>) => {
      const index = state.heatmaps.findIndex(heatmap => heatmap.id === action.payload.id);
      if (index !== -1) {
        state.heatmaps[index] = { ...state.heatmaps[index], ...action.payload.heatmap };
      }
    },
    
    removeHeatmap: (state, action: PayloadAction<string>) => {
      state.heatmaps = state.heatmaps.filter(heatmap => heatmap.id !== action.payload);
    },
    
    // Gestión de análisis
    setAnalyses: (state, action: PayloadAction<ComparativeAnalysis[]>) => {
      state.analyses = action.payload;
    },
    
    addAnalysis: (state, action: PayloadAction<ComparativeAnalysis>) => {
      state.analyses.push(action.payload);
    },
    
    updateAnalysis: (state, action: PayloadAction<{ id: string; analysis: Partial<ComparativeAnalysis> }>) => {
      const index = state.analyses.findIndex(analysis => analysis.id === action.payload.id);
      if (index !== -1) {
        state.analyses[index] = { ...state.analyses[index], ...action.payload.analysis };
      }
    },
    
    removeAnalysis: (state, action: PayloadAction<string>) => {
      state.analyses = state.analyses.filter(analysis => analysis.id !== action.payload);
    },
    
    // Gestión de filtros
    setComparisonFilter: (state, action: PayloadAction<Partial<ComparisonFilter>>) => {
      state.comparisonFilter = { ...state.comparisonFilter, ...action.payload };
    },
    
    setTrendFilter: (state, action: PayloadAction<Partial<TrendFilter>>) => {
      state.trendFilter = { ...state.trendFilter, ...action.payload };
    },
    
    setRankingFilter: (state, action: PayloadAction<Partial<RankingFilter>>) => {
      state.rankingFilter = { ...state.rankingFilter, ...action.payload };
    },
    
    setHeatmapFilter: (state, action: PayloadAction<Partial<HeatmapFilter>>) => {
      state.heatmapFilter = { ...state.heatmapFilter, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.comparisonFilter = {
        entityType: 'all',
        entityIds: [],
        periodType: 'current_vs_previous',
        currentPeriod: { startDate: '', endDate: '' },
        comparisonPeriod: { startDate: '', endDate: '' },
        metrics: ['consumption', 'cost'],
        groupBy: 'entity',
        sortBy: 'variance',
        sortOrder: 'desc',
      };
      state.trendFilter = {
        entityType: 'all',
        entityIds: [],
        metric: 'consumption',
        period: 'month',
        startDate: '',
        endDate: '',
        trendType: 'auto',
        forecastDays: 7,
        includeSeasonality: true,
        detectAnomalies: true,
      };
      state.rankingFilter = {
        entityType: 'all',
        entityIds: [],
        metric: 'consumption',
        period: 'month',
        startDate: '',
        endDate: '',
        limit: 20,
        includePreviousRank: true,
      };
      state.heatmapFilter = {
        entityType: 'all',
        entityIds: [],
        period: 'month',
        startDate: '',
        endDate: '',
        metric: 'consumption',
        aggregation: 'sum',
        normalize: true,
        includeWeekends: true,
      };
    },
    
    // UI State
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    
    setSelectedAnalysis: (state, action: PayloadAction<ComparativeAnalysis | null>) => {
      state.selectedAnalysis = action.payload;
    },
    
    setSelectedEntity: (state, action: PayloadAction<string | null>) => {
      state.selectedEntity = action.payload;
    },
    
    setSelectedMetric: (state, action: PayloadAction<string | null>) => {
      state.selectedMetric = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'table' | 'chart' | 'heatmap'>) => {
      state.viewMode = action.payload;
    },
    
    setShowInsights: (state, action: PayloadAction<boolean>) => {
      state.showInsights = action.payload;
    },
    
    setShowForecast: (state, action: PayloadAction<boolean>) => {
      state.showForecast = action.payload;
    },
    
    // Configuración
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    
    setForecastDays: (state, action: PayloadAction<number>) => {
      state.forecastDays = action.payload;
    },
    
    setConfidenceLevel: (state, action: PayloadAction<number>) => {
      state.confidenceLevel = action.payload;
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      comparisons?: boolean;
      trends?: boolean;
      rankings?: boolean;
      heatmaps?: boolean;
      analyses?: boolean;
    }>) => {
      if (action.payload.comparisons !== undefined) {
        state.loading.comparisons = action.payload.comparisons;
      }
      if (action.payload.trends !== undefined) {
        state.loading.trends = action.payload.trends;
      }
      if (action.payload.rankings !== undefined) {
        state.loading.rankings = action.payload.rankings;
      }
      if (action.payload.heatmaps !== undefined) {
        state.loading.heatmaps = action.payload.heatmaps;
      }
      if (action.payload.analyses !== undefined) {
        state.loading.analyses = action.payload.analyses;
      }
    },
    
    // Error states
    setError: (state, action: PayloadAction<{
      comparisons?: string | null;
      trends?: string | null;
      rankings?: string | null;
      heatmaps?: string | null;
      analyses?: string | null;
    }>) => {
      if (action.payload.comparisons !== undefined) {
        state.error.comparisons = action.payload.comparisons;
      }
      if (action.payload.trends !== undefined) {
        state.error.trends = action.payload.trends;
      }
      if (action.payload.rankings !== undefined) {
        state.error.rankings = action.payload.rankings;
      }
      if (action.payload.heatmaps !== undefined) {
        state.error.heatmaps = action.payload.heatmaps;
      }
      if (action.payload.analyses !== undefined) {
        state.error.analyses = action.payload.analyses;
      }
    },
    
    clearErrors: (state) => {
      state.error = {
        comparisons: null,
        trends: null,
        rankings: null,
        heatmaps: null,
        analyses: null,
      };
    },
    
    // Utilidades
    resetComparative: (state) => {
      state.comparisons = [];
      state.trends = [];
      state.rankings = [];
      state.heatmaps = [];
      state.analyses = [];
      state.selectedAnalysis = null;
      state.selectedEntity = null;
      state.selectedMetric = null;
      state.activeTab = 0;
      state.viewMode = 'table';
      state.showInsights = true;
      state.showForecast = false;
      state.loading = {
        comparisons: false,
        trends: false,
        rankings: false,
        heatmaps: false,
        analyses: false,
      };
      state.error = {
        comparisons: null,
        trends: null,
        rankings: null,
        heatmaps: null,
        analyses: null,
      };
    },
  },
});

export const {
  setComparisons,
  addComparison,
  updateComparison,
  removeComparison,
  setTrends,
  addTrend,
  updateTrend,
  removeTrend,
  setRankings,
  addRanking,
  updateRanking,
  removeRanking,
  setHeatmaps,
  addHeatmap,
  updateHeatmap,
  removeHeatmap,
  setAnalyses,
  addAnalysis,
  updateAnalysis,
  removeAnalysis,
  setComparisonFilter,
  setTrendFilter,
  setRankingFilter,
  setHeatmapFilter,
  clearFilters,
  setActiveTab,
  setSelectedAnalysis,
  setSelectedEntity,
  setSelectedMetric,
  setViewMode,
  setShowInsights,
  setShowForecast,
  setAutoRefresh,
  setRefreshInterval,
  setForecastDays,
  setConfidenceLevel,
  setLoading,
  setError,
  clearErrors,
  resetComparative,
} = comparativeSlice.actions;

export default comparativeSlice.reducer;


