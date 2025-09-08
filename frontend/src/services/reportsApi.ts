import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  ReportTemplate, 
  ScheduledReport, 
  GeneratedReport, 
  ReportHistory, 
  ReportAnalytics, 
  ReportBuilder, 
  ReportExport 
} from '../types/reports';

// Configuración de la API de Reportes
export const reportsApi = createApi({
  reducerPath: 'reportsApi',
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
  tagTypes: ['Templates', 'ScheduledReports', 'GeneratedReports', 'ReportHistory', 'Analytics', 'Builders', 'Exports'],
  endpoints: (builder) => ({
    // Plantillas de reportes
    getTemplates: builder.query<ReportTemplate[], void>({
      query: () => 'reports/templates',
      providesTags: ['Templates'],
    }),

    getTemplate: builder.query<ReportTemplate, string>({
      query: (id) => `reports/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Templates', id }],
    }),

    createTemplate: builder.mutation<ReportTemplate, Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>>({
      query: (template) => ({
        url: 'reports/templates',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['Templates'],
    }),

    updateTemplate: builder.mutation<ReportTemplate, { id: string; template: Partial<ReportTemplate> }>({
      query: ({ id, template }) => ({
        url: `reports/templates/${id}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Templates', id }],
    }),

    deleteTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `reports/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),

    duplicateTemplate: builder.mutation<ReportTemplate, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `reports/templates/${id}/duplicate`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Templates'],
    }),

    // Reportes programados
    getScheduledReports: builder.query<ScheduledReport[], void>({
      query: () => 'reports/scheduled',
      providesTags: ['ScheduledReports'],
    }),

    getScheduledReport: builder.query<ScheduledReport, string>({
      query: (id) => `reports/scheduled/${id}`,
      providesTags: (result, error, id) => [{ type: 'ScheduledReports', id }],
    }),

    createScheduledReport: builder.mutation<ScheduledReport, Omit<ScheduledReport, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'failureCount'>>({
      query: (report) => ({
        url: 'reports/scheduled',
        method: 'POST',
        body: report,
      }),
      invalidatesTags: ['ScheduledReports'],
    }),

    updateScheduledReport: builder.mutation<ScheduledReport, { id: string; report: Partial<ScheduledReport> }>({
      query: ({ id, report }) => ({
        url: `reports/scheduled/${id}`,
        method: 'PUT',
        body: report,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ScheduledReports', id }],
    }),

    deleteScheduledReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `reports/scheduled/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ScheduledReports'],
    }),

    toggleScheduledReport: builder.mutation<ScheduledReport, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `reports/scheduled/${id}/toggle`,
        method: 'POST',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ScheduledReports', id }],
    }),

    runScheduledReport: builder.mutation<GeneratedReport, string>({
      query: (id) => ({
        url: `reports/scheduled/${id}/run`,
        method: 'POST',
      }),
      invalidatesTags: ['ScheduledReports', 'GeneratedReports'],
    }),

    // Reportes generados
    getGeneratedReports: builder.query<GeneratedReport[], { 
      page?: number; 
      limit?: number; 
      status?: string; 
      format?: string; 
      dateRange?: { start: string; end: string } 
    }>({
      query: (params) => ({
        url: 'reports/generated',
        method: 'GET',
        params,
      }),
      providesTags: ['GeneratedReports'],
    }),

    getGeneratedReport: builder.query<GeneratedReport, string>({
      query: (id) => `reports/generated/${id}`,
      providesTags: (result, error, id) => [{ type: 'GeneratedReports', id }],
    }),

    generateReport: builder.mutation<GeneratedReport, {
      templateId: string;
      filters: any;
      format: string;
      recipients?: string[];
    }>({
      query: (data) => ({
        url: 'reports/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GeneratedReports'],
    }),

    downloadReport: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `reports/generated/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteGeneratedReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `reports/generated/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GeneratedReports'],
    }),

    // Historial de reportes
    getReportHistory: builder.query<ReportHistory[], { 
      page?: number; 
      limit?: number; 
      reportId?: string; 
      action?: string; 
      dateRange?: { start: string; end: string } 
    }>({
      query: (params) => ({
        url: 'reports/history',
        method: 'GET',
        params,
      }),
      providesTags: ['ReportHistory'],
    }),

    getReportHistoryByReport: builder.query<ReportHistory[], string>({
      query: (reportId) => `reports/history/report/${reportId}`,
      providesTags: (result, error, reportId) => [{ type: 'ReportHistory', id: reportId }],
    }),

    // Analytics de reportes
    getReportAnalytics: builder.query<ReportAnalytics[], { 
      period?: string; 
      templateId?: string; 
      dateRange?: { start: string; end: string } 
    }>({
      query: (params) => ({
        url: 'reports/analytics',
        method: 'GET',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getReportAnalyticsByTemplate: builder.query<ReportAnalytics[], string>({
      query: (templateId) => `reports/analytics/template/${templateId}`,
      providesTags: (result, error, templateId) => [{ type: 'Analytics', id: templateId }],
    }),

    // Builders de reportes
    getBuilders: builder.query<ReportBuilder[], void>({
      query: () => 'reports/builders',
      providesTags: ['Builders'],
    }),

    getBuilder: builder.query<ReportBuilder, string>({
      query: (id) => `reports/builders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Builders', id }],
    }),

    createBuilder: builder.mutation<ReportBuilder, Omit<ReportBuilder, 'id' | 'version' | 'lastSaved'>>({
      query: (builder) => ({
        url: 'reports/builders',
        method: 'POST',
        body: builder,
      }),
      invalidatesTags: ['Builders'],
    }),

    updateBuilder: builder.mutation<ReportBuilder, { id: string; builder: Partial<ReportBuilder> }>({
      query: ({ id, builder }) => ({
        url: `reports/builders/${id}`,
        method: 'PUT',
        body: builder,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Builders', id }],
    }),

    deleteBuilder: builder.mutation<void, string>({
      query: (id) => ({
        url: `reports/builders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Builders'],
    }),

    saveBuilder: builder.mutation<ReportBuilder, { id: string; changes: any[] }>({
      query: ({ id, changes }) => ({
        url: `reports/builders/${id}/save`,
        method: 'POST',
        body: { changes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Builders', id }],
    }),

    publishBuilder: builder.mutation<ReportTemplate, { id: string; name: string; description: string }>({
      query: ({ id, name, description }) => ({
        url: `reports/builders/${id}/publish`,
        method: 'POST',
        body: { name, description },
      }),
      invalidatesTags: ['Builders', 'Templates'],
    }),

    // Exportaciones
    getExports: builder.query<ReportExport[], void>({
      query: () => 'reports/exports',
      providesTags: ['Exports'],
    }),

    getExport: builder.query<ReportExport, string>({
      query: (id) => `reports/exports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exports', id }],
    }),

    createExport: builder.mutation<ReportExport, {
      templateId: string;
      format: string;
      filters: any;
      maxDownloads?: number;
      expiresAt?: string;
    }>({
      query: (data) => ({
        url: 'reports/exports',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exports'],
    }),

    downloadExport: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `reports/exports/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteExport: builder.mutation<void, string>({
      query: (id) => ({
        url: `reports/exports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exports'],
    }),

    // Utilidades
    validateTemplate: builder.mutation<{ valid: boolean; errors: string[] }, ReportTemplate>({
      query: (template) => ({
        url: 'reports/templates/validate',
        method: 'POST',
        body: template,
      }),
    }),

    previewTemplate: builder.mutation<Blob, { templateId: string; filters: any }>({
      query: (data) => ({
        url: 'reports/templates/preview',
        method: 'POST',
        body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),

    testSchedule: builder.mutation<{ nextRun: string; isValid: boolean }, ScheduledReport>({
      query: (schedule) => ({
        url: 'reports/scheduled/test',
        method: 'POST',
        body: schedule,
      }),
    }),

    getReportStats: builder.query<{
      totalTemplates: number;
      totalScheduled: number;
      totalGenerated: number;
      totalDownloads: number;
      averageGenerationTime: number;
      successRate: number;
    }, void>({
      query: () => 'reports/stats',
      providesTags: ['Templates', 'ScheduledReports', 'GeneratedReports'],
    }),

    // Configuración
    updateReportConfig: builder.mutation<{ success: boolean }, {
      maxFileSize: number;
      retentionDays: number;
      autoCleanup: boolean;
      emailSettings: any;
    }>({
      query: (config) => ({
        url: 'reports/config',
        method: 'POST',
        body: config,
      }),
    }),

    getReportConfig: builder.query<{
      maxFileSize: number;
      retentionDays: number;
      autoCleanup: boolean;
      emailSettings: any;
    }, void>({
      query: () => 'reports/config',
    }),

    // Limpieza
    cleanupExpiredReports: builder.mutation<{ deleted: number }, void>({
      query: () => ({
        url: 'reports/cleanup',
        method: 'POST',
      }),
      invalidatesTags: ['GeneratedReports', 'Exports'],
    }),

    // Notificaciones
    sendTestEmail: builder.mutation<{ success: boolean }, { email: string; templateId: string }>({
      query: (data) => ({
        url: 'reports/test-email',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useDuplicateTemplateMutation,
  useGetScheduledReportsQuery,
  useGetScheduledReportQuery,
  useCreateScheduledReportMutation,
  useUpdateScheduledReportMutation,
  useDeleteScheduledReportMutation,
  useToggleScheduledReportMutation,
  useRunScheduledReportMutation,
  useGetGeneratedReportsQuery,
  useGetGeneratedReportQuery,
  useGenerateReportMutation,
  useDownloadReportMutation,
  useDeleteGeneratedReportMutation,
  useGetReportHistoryQuery,
  useGetReportHistoryByReportQuery,
  useGetReportAnalyticsQuery,
  useGetReportAnalyticsByTemplateQuery,
  useGetBuildersQuery,
  useGetBuilderQuery,
  useCreateBuilderMutation,
  useUpdateBuilderMutation,
  useDeleteBuilderMutation,
  useSaveBuilderMutation,
  usePublishBuilderMutation,
  useGetExportsQuery,
  useGetExportQuery,
  useCreateExportMutation,
  useDownloadExportMutation,
  useDeleteExportMutation,
  useValidateTemplateMutation,
  usePreviewTemplateMutation,
  useTestScheduleMutation,
  useGetReportStatsQuery,
  useUpdateReportConfigMutation,
  useGetReportConfigQuery,
  useCleanupExpiredReportsMutation,
  useSendTestEmailMutation,
} = reportsApi;


