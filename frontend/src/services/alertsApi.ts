import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AlertRule, AlertInstance, AlertGroup, AlertTemplate, AlertSettings, AlertCondition, AlertRecipient } from '../types/alerts';

// Configuración de la API de Alertas
export const alertsApi = createApi({
  reducerPath: 'alertsApi',
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
  tagTypes: ['AlertRules', 'AlertInstances', 'AlertGroups', 'AlertTemplates', 'AlertSettings'],
  endpoints: (builder) => ({
    // Gestión de reglas de alertas
    getAlertRules: builder.query<AlertRule[], void>({
      query: () => 'alerts/rules',
      providesTags: ['AlertRules'],
    }),

    getAlertRule: builder.query<AlertRule, string>({
      query: (id) => `alerts/rules/${id}`,
      providesTags: (result, error, id) => [{ type: 'AlertRules', id }],
    }),

    createAlertRule: builder.mutation<AlertRule, Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (rule) => ({
        url: 'alerts/rules',
        method: 'POST',
        body: rule,
      }),
      invalidatesTags: ['AlertRules'],
    }),

    updateAlertRule: builder.mutation<AlertRule, { id: string; rule: Partial<AlertRule> }>({
      query: ({ id, rule }) => ({
        url: `alerts/rules/${id}`,
        method: 'PUT',
        body: rule,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AlertRules', id }],
    }),

    deleteAlertRule: builder.mutation<void, string>({
      query: (id) => ({
        url: `alerts/rules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AlertRules'],
    }),

    toggleAlertRule: builder.mutation<AlertRule, { id: string; enabled: boolean }>({
      query: ({ id, enabled }) => ({
        url: `alerts/rules/${id}/toggle`,
        method: 'PATCH',
        body: { enabled },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AlertRules', id }],
    }),

    // Gestión de instancias de alertas
    getAlertInstances: builder.query<AlertInstance[], {
      status?: string;
      severity?: string;
      type?: string;
      limit?: number;
      offset?: number;
    }>({
      query: (params) => ({
        url: 'alerts/instances',
        params,
      }),
      providesTags: ['AlertInstances'],
    }),

    getAlertInstance: builder.query<AlertInstance, string>({
      query: (id) => `alerts/instances/${id}`,
      providesTags: (result, error, id) => [{ type: 'AlertInstances', id }],
    }),

    acknowledgeAlert: builder.mutation<AlertInstance, { id: string; acknowledgedBy: string }>({
      query: ({ id, acknowledgedBy }) => ({
        url: `alerts/instances/${id}/acknowledge`,
        method: 'PATCH',
        body: { acknowledgedBy },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AlertInstances', id }],
    }),

    resolveAlert: builder.mutation<AlertInstance, { id: string; resolvedBy: string }>({
      query: ({ id, resolvedBy }) => ({
        url: `alerts/instances/${id}/resolve`,
        method: 'PATCH',
        body: { resolvedBy },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AlertInstances', id }],
    }),

    bulkAcknowledgeAlerts: builder.mutation<void, { ids: string[]; acknowledgedBy: string }>({
      query: ({ ids, acknowledgedBy }) => ({
        url: 'alerts/instances/bulk-acknowledge',
        method: 'PATCH',
        body: { ids, acknowledgedBy },
      }),
      invalidatesTags: ['AlertInstances'],
    }),

    bulkResolveAlerts: builder.mutation<void, { ids: string[]; resolvedBy: string }>({
      query: ({ ids, resolvedBy }) => ({
        url: 'alerts/instances/bulk-resolve',
        method: 'PATCH',
        body: { ids, resolvedBy },
      }),
      invalidatesTags: ['AlertInstances'],
    }),

    // Gestión de grupos
    getAlertGroups: builder.query<AlertGroup[], void>({
      query: () => 'alerts/groups',
      providesTags: ['AlertGroups'],
    }),

    createAlertGroup: builder.mutation<AlertGroup, Omit<AlertGroup, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (group) => ({
        url: 'alerts/groups',
        method: 'POST',
        body: group,
      }),
      invalidatesTags: ['AlertGroups'],
    }),

    updateAlertGroup: builder.mutation<AlertGroup, { id: string; group: Partial<AlertGroup> }>({
      query: ({ id, group }) => ({
        url: `alerts/groups/${id}`,
        method: 'PUT',
        body: group,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AlertGroups', id }],
    }),

    deleteAlertGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `alerts/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AlertGroups'],
    }),

    // Gestión de plantillas
    getAlertTemplates: builder.query<AlertTemplate[], void>({
      query: () => 'alerts/templates',
      providesTags: ['AlertTemplates'],
    }),

    createAlertTemplate: builder.mutation<AlertTemplate, Omit<AlertTemplate, 'id'>>({
      query: (template) => ({
        url: 'alerts/templates',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['AlertTemplates'],
    }),

    updateAlertTemplate: builder.mutation<AlertTemplate, { id: string; template: Partial<AlertTemplate> }>({
      query: ({ id, template }) => ({
        url: `alerts/templates/${id}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AlertTemplates', id }],
    }),

    deleteAlertTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `alerts/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AlertTemplates'],
    }),

    // Gestión de configuraciones
    getAlertSettings: builder.query<AlertSettings, string>({
      query: (userId) => `alerts/settings/${userId}`,
      providesTags: ['AlertSettings'],
    }),

    updateAlertSettings: builder.mutation<AlertSettings, { userId: string; settings: Partial<AlertSettings> }>({
      query: ({ userId, settings }) => ({
        url: `alerts/settings/${userId}`,
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['AlertSettings'],
    }),

    // Test de alertas
    testAlertRule: builder.mutation<{ success: boolean; message: string }, { ruleId: string; testData: any }>({
      query: ({ ruleId, testData }) => ({
        url: `alerts/rules/${ruleId}/test`,
        method: 'POST',
        body: testData,
      }),
    }),

    // Estadísticas de alertas
    getAlertStats: builder.query<{
      total: number;
      active: number;
      acknowledged: number;
      resolved: number;
      bySeverity: Record<string, number>;
      byType: Record<string, number>;
      recentTrends: Array<{ date: string; count: number }>;
    }, {
      startDate?: string;
      endDate?: string;
      groupBy?: 'hour' | 'day' | 'week' | 'month';
    }>({
      query: (params) => ({
        url: 'alerts/stats',
        params,
      }),
      providesTags: ['AlertInstances'],
    }),

    // Notificaciones en tiempo real
    subscribeToAlerts: builder.query<EventSource, void>({
      queryFn: () => {
        const eventSource = new EventSource(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/alerts/stream`);
        return { data: eventSource };
      },
    }),
  }),
});

export const {
  useGetAlertRulesQuery,
  useGetAlertRuleQuery,
  useCreateAlertRuleMutation,
  useUpdateAlertRuleMutation,
  useDeleteAlertRuleMutation,
  useToggleAlertRuleMutation,
  useGetAlertInstancesQuery,
  useGetAlertInstanceQuery,
  useAcknowledgeAlertMutation,
  useResolveAlertMutation,
  useBulkAcknowledgeAlertsMutation,
  useBulkResolveAlertsMutation,
  useGetAlertGroupsQuery,
  useCreateAlertGroupMutation,
  useUpdateAlertGroupMutation,
  useDeleteAlertGroupMutation,
  useGetAlertTemplatesQuery,
  useCreateAlertTemplateMutation,
  useUpdateAlertTemplateMutation,
  useDeleteAlertTemplateMutation,
  useGetAlertSettingsQuery,
  useUpdateAlertSettingsMutation,
  useTestAlertRuleMutation,
  useGetAlertStatsQuery,
  useSubscribeToAlertsQuery,
} = alertsApi;



