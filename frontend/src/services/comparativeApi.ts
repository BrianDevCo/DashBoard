import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
} from '../types/comparative';

// Configuración de la API de Análisis Comparativo
export const comparativeApi = createApi({
  reducerPath: 'comparativeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Comparisons', 'Trends', 'Rankings', 'Heatmaps', 'Analyses'],
  endpoints: (builder) => ({
    // Comparaciones de consumo
    getConsumptionComparisons: builder.query<ConsumptionComparison[], ComparisonFilter>({
      query: (filter) => ({
        url: 'comparative/consumption-comparisons',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Comparisons'],
    }),

    getConsumptionComparison: builder.query<ConsumptionComparison, string>({
      query: (id) => `comparative/consumption-comparisons/${id}`,
      providesTags: (result, error, id) => [{ type: 'Comparisons', id }],
    }),

    createConsumptionComparison: builder.mutation<ConsumptionComparison, Omit<ConsumptionComparison, 'id' | 'lastUpdated'>>({
      query: (comparison) => ({
        url: 'comparative/consumption-comparisons',
        method: 'POST',
        body: comparison,
      }),
      invalidatesTags: ['Comparisons'],
    }),

    updateConsumptionComparison: builder.mutation<ConsumptionComparison, { id: string; comparison: Partial<ConsumptionComparison> }>({
      query: ({ id, comparison }) => ({
        url: `comparative/consumption-comparisons/${id}`,
        method: 'PUT',
        body: comparison,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Comparisons', id }],
    }),

    deleteConsumptionComparison: builder.mutation<void, string>({
      query: (id) => ({
        url: `comparative/consumption-comparisons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comparisons'],
    }),

    // Análisis de tendencias
    getTrendAnalyses: builder.query<TrendAnalysis[], TrendFilter>({
      query: (filter) => ({
        url: 'comparative/trend-analyses',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Trends'],
    }),

    getTrendAnalysis: builder.query<TrendAnalysis, string>({
      query: (id) => `comparative/trend-analyses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trends', id }],
    }),

    createTrendAnalysis: builder.mutation<TrendAnalysis, Omit<TrendAnalysis, 'id' | 'lastUpdated'>>({
      query: (trend) => ({
        url: 'comparative/trend-analyses',
        method: 'POST',
        body: trend,
      }),
      invalidatesTags: ['Trends'],
    }),

    updateTrendAnalysis: builder.mutation<TrendAnalysis, { id: string; trend: Partial<TrendAnalysis> }>({
      query: ({ id, trend }) => ({
        url: `comparative/trend-analyses/${id}`,
        method: 'PUT',
        body: trend,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Trends', id }],
    }),

    deleteTrendAnalysis: builder.mutation<void, string>({
      query: (id) => ({
        url: `comparative/trend-analyses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trends'],
    }),

    // Rankings
    getRankings: builder.query<RankingEntry[], RankingFilter>({
      query: (filter) => ({
        url: 'comparative/rankings',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Rankings'],
    }),

    getRanking: builder.query<RankingEntry, string>({
      query: (id) => `comparative/rankings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Rankings', id }],
    }),

    createRanking: builder.mutation<RankingEntry, Omit<RankingEntry, 'id' | 'lastUpdated'>>({
      query: (ranking) => ({
        url: 'comparative/rankings',
        method: 'POST',
        body: ranking,
      }),
      invalidatesTags: ['Rankings'],
    }),

    updateRanking: builder.mutation<RankingEntry, { id: string; ranking: Partial<RankingEntry> }>({
      query: ({ id, ranking }) => ({
        url: `comparative/rankings/${id}`,
        method: 'PUT',
        body: ranking,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Rankings', id }],
    }),

    deleteRanking: builder.mutation<void, string>({
      query: (id) => ({
        url: `comparative/rankings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rankings'],
    }),

    // Mapas de calor
    getHeatmaps: builder.query<HeatmapData[], HeatmapFilter>({
      query: (filter) => ({
        url: 'comparative/heatmaps',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Heatmaps'],
    }),

    getHeatmap: builder.query<HeatmapData, string>({
      query: (id) => `comparative/heatmaps/${id}`,
      providesTags: (result, error, id) => [{ type: 'Heatmaps', id }],
    }),

    createHeatmap: builder.mutation<HeatmapData, Omit<HeatmapData, 'id' | 'lastUpdated'>>({
      query: (heatmap) => ({
        url: 'comparative/heatmaps',
        method: 'POST',
        body: heatmap,
      }),
      invalidatesTags: ['Heatmaps'],
    }),

    updateHeatmap: builder.mutation<HeatmapData, { id: string; heatmap: Partial<HeatmapData> }>({
      query: ({ id, heatmap }) => ({
        url: `comparative/heatmaps/${id}`,
        method: 'PUT',
        body: heatmap,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Heatmaps', id }],
    }),

    deleteHeatmap: builder.mutation<void, string>({
      query: (id) => ({
        url: `comparative/heatmaps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Heatmaps'],
    }),

    // Análisis comparativos completos
    getAnalyses: builder.query<ComparativeAnalysis[], void>({
      query: () => 'comparative/analyses',
      providesTags: ['Analyses'],
    }),

    getAnalysis: builder.query<ComparativeAnalysis, string>({
      query: (id) => `comparative/analyses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Analyses', id }],
    }),

    createAnalysis: builder.mutation<ComparativeAnalysis, Omit<ComparativeAnalysis, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (analysis) => ({
        url: 'comparative/analyses',
        method: 'POST',
        body: analysis,
      }),
      invalidatesTags: ['Analyses'],
    }),

    updateAnalysis: builder.mutation<ComparativeAnalysis, { id: string; analysis: Partial<ComparativeAnalysis> }>({
      query: ({ id, analysis }) => ({
        url: `comparative/analyses/${id}`,
        method: 'PUT',
        body: analysis,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Analyses', id }],
    }),

    deleteAnalysis: builder.mutation<void, string>({
      query: (id) => ({
        url: `comparative/analyses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Analyses'],
    }),

    // Análisis específicos
    getPeriodComparison: builder.query<ConsumptionComparison[], {
      entityType: string;
      entityIds: string[];
      currentPeriod: { startDate: string; endDate: string };
      comparisonPeriod: { startDate: string; endDate: string };
      metrics: string[];
    }>({
      query: (params) => ({
        url: 'comparative/period-comparison',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Comparisons'],
    }),

    getEntityComparison: builder.query<ConsumptionComparison[], {
      entityType: string;
      entityIds: string[];
      period: { startDate: string; endDate: string };
      metrics: string[];
    }>({
      query: (params) => ({
        url: 'comparative/entity-comparison',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Comparisons'],
    }),

    getTrendForecast: builder.query<TrendAnalysis, {
      entityId: string;
      entityType: string;
      metric: string;
      period: string;
      forecastDays: number;
      trendType: string;
    }>({
      query: (params) => ({
        url: 'comparative/trend-forecast',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Trends'],
    }),

    getTopConsumers: builder.query<RankingEntry[], {
      entityType: string;
      metric: string;
      period: string;
      limit: number;
      groupBy?: string;
    }>({
      query: (params) => ({
        url: 'comparative/top-consumers',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Rankings'],
    }),

    getEfficiencyRankings: builder.query<RankingEntry[], {
      entityType: string;
      period: string;
      limit: number;
    }>({
      query: (params) => ({
        url: 'comparative/efficiency-rankings',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Rankings'],
    }),

    getCostRankings: builder.query<RankingEntry[], {
      entityType: string;
      period: string;
      limit: number;
    }>({
      query: (params) => ({
        url: 'comparative/cost-rankings',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Rankings'],
    }),

    getConsumptionHeatmap: builder.query<HeatmapData, {
      entityId: string;
      entityType: string;
      period: string;
      metric: string;
      aggregation: string;
    }>({
      query: (params) => ({
        url: 'comparative/consumption-heatmap',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Heatmaps'],
    }),

    getDemandHeatmap: builder.query<HeatmapData, {
      entityId: string;
      entityType: string;
      period: string;
      aggregation: string;
    }>({
      query: (params) => ({
        url: 'comparative/demand-heatmap',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Heatmaps'],
    }),

    // Análisis de anomalías
    getAnomalies: builder.query<Array<{
      id: string;
      entityId: string;
      entityName: string;
      entityType: string;
      metric: string;
      date: string;
      value: number;
      expectedValue: number;
      deviation: number;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>, {
      entityType: string;
      entityIds: string[];
      period: string;
      metrics: string[];
      severity?: string;
    }>({
      query: (params) => ({
        url: 'comparative/anomalies',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Comparisons'],
    }),

    // Análisis de estacionalidad
    getSeasonalityAnalysis: builder.query<Array<{
      entityId: string;
      entityName: string;
      entityType: string;
      metric: string;
      period: string;
      seasonality: {
        detected: boolean;
        period: number;
        strength: number;
        pattern: string;
      };
      patterns: Array<{
        hour: number;
        day: number;
        averageValue: number;
        deviation: number;
      }>;
    }>, {
      entityType: string;
      entityIds: string[];
      period: string;
      metrics: string[];
    }>({
      query: (params) => ({
        url: 'comparative/seasonality',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Trends'],
    }),

    // Exportación
    exportComparativeData: builder.mutation<Blob, {
      format: 'csv' | 'excel' | 'pdf';
      type: 'comparison' | 'trend' | 'ranking' | 'heatmap' | 'analysis';
      filters: any;
    }>({
      query: ({ format, type, filters }) => ({
        url: 'comparative/export',
        method: 'POST',
        body: { format, type, filters },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Actualización en tiempo real
    refreshComparativeData: builder.mutation<{
      comparisons: ConsumptionComparison[];
      trends: TrendAnalysis[];
      rankings: RankingEntry[];
      heatmaps: HeatmapData[];
    }, {
      entityType: string;
      entityIds: string[];
      period: string;
    }>({
      query: (params) => ({
        url: 'comparative/refresh',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Comparisons', 'Trends', 'Rankings', 'Heatmaps'],
    }),

    // Configuración de análisis
    setAnalysisConfig: builder.mutation<{ success: boolean }, {
      forecastDays: number;
      confidenceLevel: number;
      anomalyThreshold: number;
      seasonalityDetection: boolean;
    }>({
      query: (config) => ({
        url: 'comparative/config',
        method: 'POST',
        body: config,
      }),
    }),

    // Estadísticas de rendimiento
    getComparativePerformance: builder.query<{
      responseTime: number;
      lastUpdate: string;
      dataQuality: number;
      accuracy: number;
    }, void>({
      query: () => 'comparative/performance',
      providesTags: ['Comparisons'],
    }),
  }),
});

export const {
  useGetConsumptionComparisonsQuery,
  useGetConsumptionComparisonQuery,
  useCreateConsumptionComparisonMutation,
  useUpdateConsumptionComparisonMutation,
  useDeleteConsumptionComparisonMutation,
  useGetTrendAnalysesQuery,
  useGetTrendAnalysisQuery,
  useCreateTrendAnalysisMutation,
  useUpdateTrendAnalysisMutation,
  useDeleteTrendAnalysisMutation,
  useGetRankingsQuery,
  useGetRankingQuery,
  useCreateRankingMutation,
  useUpdateRankingMutation,
  useDeleteRankingMutation,
  useGetHeatmapsQuery,
  useGetHeatmapQuery,
  useCreateHeatmapMutation,
  useUpdateHeatmapMutation,
  useDeleteHeatmapMutation,
  useGetAnalysesQuery,
  useGetAnalysisQuery,
  useCreateAnalysisMutation,
  useUpdateAnalysisMutation,
  useDeleteAnalysisMutation,
  useGetPeriodComparisonQuery,
  useGetEntityComparisonQuery,
  useGetTrendForecastQuery,
  useGetTopConsumersQuery,
  useGetEfficiencyRankingsQuery,
  useGetCostRankingsQuery,
  useGetConsumptionHeatmapQuery,
  useGetDemandHeatmapQuery,
  useGetAnomaliesQuery,
  useGetSeasonalityAnalysisQuery,
  useExportComparativeDataMutation,
  useRefreshComparativeDataMutation,
  useSetAnalysisConfigMutation,
  useGetComparativePerformanceQuery,
} = comparativeApi;


