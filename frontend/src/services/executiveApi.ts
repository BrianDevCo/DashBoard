import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  ExecutiveKPI, 
  ExecutiveAlert, 
  ExecutiveTrend, 
  ExecutiveSummary, 
  ExecutiveInsight, 
  ExecutiveWidget, 
  ExecutiveDashboard, 
  ExecutiveFilter 
} from '../types/executive';

// Configuración de la API del Dashboard Ejecutivo
export const executiveApi = createApi({
  reducerPath: 'executiveApi',
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
  tagTypes: ['KPIs', 'Alerts', 'Trends', 'Summary', 'Insights', 'Widgets', 'Dashboard'],
  endpoints: (builder) => ({
    // KPIs Ejecutivos
    getExecutiveKPIs: builder.query<ExecutiveKPI[], ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/kpis',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['KPIs'],
    }),

    getExecutiveKPI: builder.query<ExecutiveKPI, string>({
      query: (id) => `executive/kpis/${id}`,
      providesTags: (result, error, id) => [{ type: 'KPIs', id }],
    }),

    updateExecutiveKPI: builder.mutation<ExecutiveKPI, { id: string; kpi: Partial<ExecutiveKPI> }>({
      query: ({ id, kpi }) => ({
        url: `executive/kpis/${id}`,
        method: 'PUT',
        body: kpi,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'KPIs', id }],
    }),

    // Alertas Ejecutivas
    getExecutiveAlerts: builder.query<ExecutiveAlert[], ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/alerts',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Alerts'],
    }),

    getExecutiveAlert: builder.query<ExecutiveAlert, string>({
      query: (id) => `executive/alerts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Alerts', id }],
    }),

    acknowledgeExecutiveAlert: builder.mutation<ExecutiveAlert, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `executive/alerts/${id}/acknowledge`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Alerts', id }],
    }),

    resolveExecutiveAlert: builder.mutation<ExecutiveAlert, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `executive/alerts/${id}/resolve`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Alerts', id }],
    }),

    // Tendencias Ejecutivas
    getExecutiveTrends: builder.query<ExecutiveTrend[], ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/trends',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Trends'],
    }),

    getExecutiveTrend: builder.query<ExecutiveTrend, string>({
      query: (id) => `executive/trends/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trends', id }],
    }),

    updateExecutiveTrend: builder.mutation<ExecutiveTrend, { id: string; trend: Partial<ExecutiveTrend> }>({
      query: ({ id, trend }) => ({
        url: `executive/trends/${id}`,
        method: 'PUT',
        body: trend,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Trends', id }],
    }),

    // Resumen Ejecutivo
    getExecutiveSummary: builder.query<ExecutiveSummary, ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/summary',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Summary'],
    }),

    updateExecutiveSummary: builder.mutation<ExecutiveSummary, Partial<ExecutiveSummary>>({
      query: (summary) => ({
        url: 'executive/summary',
        method: 'PUT',
        body: summary,
      }),
      invalidatesTags: ['Summary'],
    }),

    // Insights Ejecutivos
    getExecutiveInsights: builder.query<ExecutiveInsight[], ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/insights',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['Insights'],
    }),

    getExecutiveInsight: builder.query<ExecutiveInsight, string>({
      query: (id) => `executive/insights/${id}`,
      providesTags: (result, error, id) => [{ type: 'Insights', id }],
    }),

    updateExecutiveInsight: builder.mutation<ExecutiveInsight, { id: string; insight: Partial<ExecutiveInsight> }>({
      query: ({ id, insight }) => ({
        url: `executive/insights/${id}`,
        method: 'PUT',
        body: insight,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Insights', id }],
    }),

    dismissExecutiveInsight: builder.mutation<ExecutiveInsight, string>({
      query: (id) => ({
        url: `executive/insights/${id}/dismiss`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Insights', id }],
    }),

    // Widgets Ejecutivos
    getExecutiveWidgets: builder.query<ExecutiveWidget[], string>({
      query: (dashboardId) => `executive/widgets?dashboardId=${dashboardId}`,
      providesTags: ['Widgets'],
    }),

    getExecutiveWidget: builder.query<ExecutiveWidget, string>({
      query: (id) => `executive/widgets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Widgets', id }],
    }),

    createExecutiveWidget: builder.mutation<ExecutiveWidget, Omit<ExecutiveWidget, 'id' | 'lastUpdated'>>({
      query: (widget) => ({
        url: 'executive/widgets',
        method: 'POST',
        body: widget,
      }),
      invalidatesTags: ['Widgets'],
    }),

    updateExecutiveWidget: builder.mutation<ExecutiveWidget, { id: string; widget: Partial<ExecutiveWidget> }>({
      query: ({ id, widget }) => ({
        url: `executive/widgets/${id}`,
        method: 'PUT',
        body: widget,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Widgets', id }],
    }),

    deleteExecutiveWidget: builder.mutation<void, string>({
      query: (id) => ({
        url: `executive/widgets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Widgets'],
    }),

    moveExecutiveWidget: builder.mutation<ExecutiveWidget, { id: string; position: { x: number; y: number } }>({
      query: ({ id, position }) => ({
        url: `executive/widgets/${id}/move`,
        method: 'POST',
        body: { position },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Widgets', id }],
    }),

    resizeExecutiveWidget: builder.mutation<ExecutiveWidget, { id: string; size: { width: number; height: number } }>({
      query: ({ id, size }) => ({
        url: `executive/widgets/${id}/resize`,
        method: 'POST',
        body: { size },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Widgets', id }],
    }),

    // Dashboard Ejecutivo
    getExecutiveDashboard: builder.query<ExecutiveDashboard, string>({
      query: (userId) => `executive/dashboard?userId=${userId}`,
      providesTags: ['Dashboard'],
    }),

    createExecutiveDashboard: builder.mutation<ExecutiveDashboard, Omit<ExecutiveDashboard, 'id' | 'createdAt' | 'lastUpdated'>>({
      query: (dashboard) => ({
        url: 'executive/dashboard',
        method: 'POST',
        body: dashboard,
      }),
      invalidatesTags: ['Dashboard'],
    }),

    updateExecutiveDashboard: builder.mutation<ExecutiveDashboard, { id: string; dashboard: Partial<ExecutiveDashboard> }>({
      query: ({ id, dashboard }) => ({
        url: `executive/dashboard/${id}`,
        method: 'PUT',
        body: dashboard,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Dashboard', id }],
    }),

    deleteExecutiveDashboard: builder.mutation<void, string>({
      query: (id) => ({
        url: `executive/dashboard/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),

    // Análisis específicos
    getConsumptionTrend: builder.query<ExecutiveTrend, {
      entityType: string;
      entityIds: string[];
      period: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: 'executive/trends/consumption',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Trends'],
    }),

    getCostTrend: builder.query<ExecutiveTrend, {
      entityType: string;
      entityIds: string[];
      period: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: 'executive/trends/cost',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Trends'],
    }),

    getEfficiencyTrend: builder.query<ExecutiveTrend, {
      entityType: string;
      entityIds: string[];
      period: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: 'executive/trends/efficiency',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Trends'],
    }),

    getPeakDemandTrend: builder.query<ExecutiveTrend, {
      entityType: string;
      entityIds: string[];
      period: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: 'executive/trends/peak-demand',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Trends'],
    }),

    // Alertas específicas
    getConsumptionAlerts: builder.query<ExecutiveAlert[], {
      entityType: string;
      entityIds: string[];
      severity?: string;
      status?: string;
    }>({
      query: (params) => ({
        url: 'executive/alerts/consumption',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Alerts'],
    }),

    getCostAlerts: builder.query<ExecutiveAlert[], {
      entityType: string;
      entityIds: string[];
      severity?: string;
      status?: string;
    }>({
      query: (params) => ({
        url: 'executive/alerts/cost',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Alerts'],
    }),

    getEfficiencyAlerts: builder.query<ExecutiveAlert[], {
      entityType: string;
      entityIds: string[];
      severity?: string;
      status?: string;
    }>({
      query: (params) => ({
        url: 'executive/alerts/efficiency',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Alerts'],
    }),

    getMaintenanceAlerts: builder.query<ExecutiveAlert[], {
      entityType: string;
      entityIds: string[];
      severity?: string;
      status?: string;
    }>({
      query: (params) => ({
        url: 'executive/alerts/maintenance',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Alerts'],
    }),

    // Insights específicos
    getSavingInsights: builder.query<ExecutiveInsight[], {
      entityType: string;
      entityIds: string[];
      priority?: string;
      impact?: string;
    }>({
      query: (params) => ({
        url: 'executive/insights/saving',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Insights'],
    }),

    getEfficiencyInsights: builder.query<ExecutiveInsight[], {
      entityType: string;
      entityIds: string[];
      priority?: string;
      impact?: string;
    }>({
      query: (params) => ({
        url: 'executive/insights/efficiency',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Insights'],
    }),

    getCostInsights: builder.query<ExecutiveInsight[], {
      entityType: string;
      entityIds: string[];
      priority?: string;
      impact?: string;
    }>({
      query: (params) => ({
        url: 'executive/insights/cost',
        method: 'POST',
        body: params,
      }),
      providesTags: ['Insights'],
    }),

    // Estadísticas del dashboard
    getExecutiveStats: builder.query<{
      totalKPIs: number;
      totalAlerts: number;
      totalTrends: number;
      totalInsights: number;
      activeAlerts: number;
      criticalAlerts: number;
      highPriorityInsights: number;
      lastUpdate: string;
    }, ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/stats',
        method: 'POST',
        body: filter,
      }),
      providesTags: ['KPIs', 'Alerts', 'Trends', 'Insights'],
    }),

    // Actualización en tiempo real
    refreshExecutiveData: builder.mutation<{
      kpis: ExecutiveKPI[];
      alerts: ExecutiveAlert[];
      trends: ExecutiveTrend[];
      summary: ExecutiveSummary;
      insights: ExecutiveInsight[];
    }, ExecutiveFilter>({
      query: (filter) => ({
        url: 'executive/refresh',
        method: 'POST',
        body: filter,
      }),
      invalidatesTags: ['KPIs', 'Alerts', 'Trends', 'Summary', 'Insights'],
    }),

    // Exportación
    exportExecutiveData: builder.mutation<Blob, {
      format: 'pdf' | 'excel' | 'csv' | 'html';
      type: 'summary' | 'kpis' | 'alerts' | 'trends' | 'insights' | 'all';
      filter: ExecutiveFilter;
    }>({
      query: ({ format, type, filter }) => ({
        url: 'executive/export',
        method: 'POST',
        body: { format, type, filter },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Configuración
    setExecutiveConfig: builder.mutation<{ success: boolean }, {
      theme: string;
      layout: string;
      widgetSize: string;
      autoRefresh: boolean;
      refreshInterval: number;
    }>({
      query: (config) => ({
        url: 'executive/config',
        method: 'POST',
        body: config,
      }),
    }),

    getExecutiveConfig: builder.query<{
      theme: string;
      layout: string;
      widgetSize: string;
      autoRefresh: boolean;
      refreshInterval: number;
    }, void>({
      query: () => 'executive/config',
    }),
  }),
});

export const {
  useGetExecutiveKPIsQuery,
  useGetExecutiveKPIQuery,
  useUpdateExecutiveKPIMutation,
  useGetExecutiveAlertsQuery,
  useGetExecutiveAlertQuery,
  useAcknowledgeExecutiveAlertMutation,
  useResolveExecutiveAlertMutation,
  useGetExecutiveTrendsQuery,
  useGetExecutiveTrendQuery,
  useUpdateExecutiveTrendMutation,
  useGetExecutiveSummaryQuery,
  useUpdateExecutiveSummaryMutation,
  useGetExecutiveInsightsQuery,
  useGetExecutiveInsightQuery,
  useUpdateExecutiveInsightMutation,
  useDismissExecutiveInsightMutation,
  useGetExecutiveWidgetsQuery,
  useGetExecutiveWidgetQuery,
  useCreateExecutiveWidgetMutation,
  useUpdateExecutiveWidgetMutation,
  useDeleteExecutiveWidgetMutation,
  useMoveExecutiveWidgetMutation,
  useResizeExecutiveWidgetMutation,
  useGetExecutiveDashboardQuery,
  useCreateExecutiveDashboardMutation,
  useUpdateExecutiveDashboardMutation,
  useDeleteExecutiveDashboardMutation,
  useGetConsumptionTrendQuery,
  useGetCostTrendQuery,
  useGetEfficiencyTrendQuery,
  useGetPeakDemandTrendQuery,
  useGetConsumptionAlertsQuery,
  useGetCostAlertsQuery,
  useGetEfficiencyAlertsQuery,
  useGetMaintenanceAlertsQuery,
  useGetSavingInsightsQuery,
  useGetEfficiencyInsightsQuery,
  useGetCostInsightsQuery,
  useGetExecutiveStatsQuery,
  useRefreshExecutiveDataMutation,
  useExportExecutiveDataMutation,
  useSetExecutiveConfigMutation,
  useGetExecutiveConfigQuery,
} = executiveApi;


