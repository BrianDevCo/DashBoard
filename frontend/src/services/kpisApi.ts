import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
} from '../types/kpis';

// Configuración de la API de KPIs
export const kpisApi = createApi({
  reducerPath: 'kpisApi',
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
  tagTypes: ['KPIs', 'Consumption', 'PeakDemand', 'ReactiveEnergy', 'KPISummary', 'KPITrend', 'KPIMetrics', 'KPIDashboards'],
  endpoints: (builder) => ({
    // KPIs principales
    getKPICards: builder.query<KPICard[], KPIFilter>({
      query: (filters) => ({
        url: 'kpis/cards',
        params: filters,
      }),
      providesTags: ['KPIs'],
    }),

    getKPISummary: builder.query<KPISummary, KPIFilter>({
      query: (filters) => ({
        url: 'kpis/summary',
        params: filters,
      }),
      providesTags: ['KPISummary'],
    }),

    getKPITrend: builder.query<KPITrend, KPIFilter>({
      query: (filters) => ({
        url: 'kpis/trend',
        params: filters,
      }),
      providesTags: ['KPITrend'],
    }),

    // Consumos por categoría
    getConsumptionBySite: builder.query<ConsumptionBySite[], KPIFilter>({
      query: (filters) => ({
        url: 'kpis/consumption/sites',
        params: filters,
      }),
      providesTags: ['Consumption'],
    }),

    getConsumptionByClient: builder.query<ConsumptionByClient[], KPIFilter>({
      query: (filters) => ({
        url: 'kpis/consumption/clients',
        params: filters,
      }),
      providesTags: ['Consumption'],
    }),

    getConsumptionByGroup: builder.query<ConsumptionByGroup[], KPIFilter>({
      query: (filters) => ({
        url: 'kpis/consumption/groups',
        params: filters,
      }),
      providesTags: ['Consumption'],
    }),

    // Registros especiales
    getPeakDemandRecords: builder.query<PeakDemandRecord[], {
      siteId?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
    }>({
      query: (params) => ({
        url: 'kpis/peak-demand',
        params,
      }),
      providesTags: ['PeakDemand'],
    }),

    getReactiveEnergyRatios: builder.query<ReactiveEnergyRatio[], {
      siteId?: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: 'kpis/reactive-energy',
        params,
      }),
      providesTags: ['ReactiveEnergy'],
    }),

    // Métricas
    getKPIMetrics: builder.query<KPIMetric[], void>({
      query: () => 'kpis/metrics',
      providesTags: ['KPIMetrics'],
    }),

    createKPIMetric: builder.mutation<KPIMetric, Omit<KPIMetric, 'id'>>({
      query: (metric) => ({
        url: 'kpis/metrics',
        method: 'POST',
        body: metric,
      }),
      invalidatesTags: ['KPIMetrics'],
    }),

    updateKPIMetric: builder.mutation<KPIMetric, { id: string; metric: Partial<KPIMetric> }>({
      query: ({ id, metric }) => ({
        url: `kpis/metrics/${id}`,
        method: 'PUT',
        body: metric,
      }),
      invalidatesTags: ['KPIMetrics'],
    }),

    deleteKPIMetric: builder.mutation<void, string>({
      query: (id) => ({
        url: `kpis/metrics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KPIMetrics'],
    }),

    // Dashboards
    getKPIDashboards: builder.query<KPIDashboard[], void>({
      query: () => 'kpis/dashboards',
      providesTags: ['KPIDashboards'],
    }),

    getKPIDashboard: builder.query<KPIDashboard, string>({
      query: (id) => `kpis/dashboards/${id}`,
      providesTags: (result, error, id) => [{ type: 'KPIDashboards', id }],
    }),

    createKPIDashboard: builder.mutation<KPIDashboard, Omit<KPIDashboard, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (dashboard) => ({
        url: 'kpis/dashboards',
        method: 'POST',
        body: dashboard,
      }),
      invalidatesTags: ['KPIDashboards'],
    }),

    updateKPIDashboard: builder.mutation<KPIDashboard, { id: string; dashboard: Partial<KPIDashboard> }>({
      query: ({ id, dashboard }) => ({
        url: `kpis/dashboards/${id}`,
        method: 'PUT',
        body: dashboard,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'KPIDashboards', id }],
    }),

    deleteKPIDashboard: builder.mutation<void, string>({
      query: (id) => ({
        url: `kpis/dashboards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KPIDashboards'],
    }),

    // Análisis específicos
    getTopConsumers: builder.query<Array<{
      id: string;
      name: string;
      consumption: number;
      percentage: number;
    }>, {
      period: string;
      limit?: number;
      aggregation: string;
    }>({
      query: (params) => ({
        url: 'kpis/top-consumers',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    getEfficiencyLeaders: builder.query<Array<{
      id: string;
      name: string;
      efficiency: number;
      powerFactor: number;
    }>, {
      period: string;
      limit?: number;
      aggregation: string;
    }>({
      query: (params) => ({
        url: 'kpis/efficiency-leaders',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    getCostLeaders: builder.query<Array<{
      id: string;
      name: string;
      cost: number;
      consumption: number;
    }>, {
      period: string;
      limit?: number;
      aggregation: string;
    }>({
      query: (params) => ({
        url: 'kpis/cost-leaders',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    // Comparaciones
    getConsumptionComparison: builder.query<{
      current: number;
      previous: number;
      variance: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }, {
      period: string;
      aggregation: string;
      siteId?: string;
      clientId?: string;
      groupId?: string;
    }>({
      query: (params) => ({
        url: 'kpis/consumption-comparison',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    getDemandComparison: builder.query<{
      current: number;
      previous: number;
      variance: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }, {
      period: string;
      aggregation: string;
      siteId?: string;
      clientId?: string;
      groupId?: string;
    }>({
      query: (params) => ({
        url: 'kpis/demand-comparison',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    getPowerFactorComparison: builder.query<{
      current: number;
      previous: number;
      variance: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }, {
      period: string;
      aggregation: string;
      siteId?: string;
      clientId?: string;
      groupId?: string;
    }>({
      query: (params) => ({
        url: 'kpis/power-factor-comparison',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    // Alertas y umbrales
    getKPIAlerts: builder.query<Array<{
      id: string;
      metric: string;
      value: number;
      threshold: number;
      severity: 'warning' | 'critical';
      message: string;
      timestamp: string;
    }>, {
      period: string;
      aggregation: string;
    }>({
      query: (params) => ({
        url: 'kpis/alerts',
        params,
      }),
      providesTags: ['KPIs'],
    }),

    // Exportación
    exportKPIs: builder.mutation<Blob, {
      format: 'csv' | 'excel' | 'pdf';
      filters: KPIFilter;
      metrics: string[];
    }>({
      query: ({ format, filters, metrics }) => ({
        url: 'kpis/export',
        method: 'POST',
        body: { format, filters, metrics },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Actualización en tiempo real
    refreshKPIs: builder.mutation<{
      kpiCards: KPICard[];
      summary: KPISummary;
      trend: KPITrend;
    }, KPIFilter>({
      query: (filters) => ({
        url: 'kpis/refresh',
        method: 'POST',
        body: filters,
      }),
      invalidatesTags: ['KPIs', 'KPISummary', 'KPITrend'],
    }),

    // Configuración de actualización automática
    setAutoRefresh: builder.mutation<{ success: boolean }, {
      enabled: boolean;
      interval: number;
    }>({
      query: (config) => ({
        url: 'kpis/auto-refresh',
        method: 'POST',
        body: config,
      }),
    }),

    // Estadísticas de rendimiento
    getKPIPerformance: builder.query<{
      responseTime: number;
      lastUpdate: string;
      dataQuality: number;
      accuracy: number;
    }, void>({
      query: () => 'kpis/performance',
      providesTags: ['KPIs'],
    }),
  }),
});

export const {
  useGetKPICardsQuery,
  useGetKPISummaryQuery,
  useGetKPITrendQuery,
  useGetConsumptionBySiteQuery,
  useGetConsumptionByClientQuery,
  useGetConsumptionByGroupQuery,
  useGetPeakDemandRecordsQuery,
  useGetReactiveEnergyRatiosQuery,
  useGetKPIMetricsQuery,
  useCreateKPIMetricMutation,
  useUpdateKPIMetricMutation,
  useDeleteKPIMetricMutation,
  useGetKPIDashboardsQuery,
  useGetKPIDashboardQuery,
  useCreateKPIDashboardMutation,
  useUpdateKPIDashboardMutation,
  useDeleteKPIDashboardMutation,
  useGetTopConsumersQuery,
  useGetEfficiencyLeadersQuery,
  useGetCostLeadersQuery,
  useGetConsumptionComparisonQuery,
  useGetDemandComparisonQuery,
  useGetPowerFactorComparisonQuery,
  useGetKPIAlertsQuery,
  useExportKPIsMutation,
  useRefreshKPIsMutation,
  useSetAutoRefreshMutation,
  useGetKPIPerformanceQuery,
} = kpisApi;


