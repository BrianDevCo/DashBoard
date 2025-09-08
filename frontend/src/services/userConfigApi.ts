import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
} from '../types/userConfig';

export const userConfigApi = createApi({
  reducerPath: 'userConfigApi',
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
  tagTypes: ['Profile', 'Settings', 'Themes', 'Layouts', 'Templates', 'Notifications', 'Preferences', 'Dashboard', 'Reports', 'Search', 'Alerts', 'Privacy', 'Accessibility'],
  endpoints: (builder) => ({
    // Perfil de usuario
    getProfile: builder.query<UserProfile, string>({
      query: (userId) => `user-config/profile/${userId}`,
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<UserProfile, { userId: string; profile: Partial<UserProfile> }>({
      query: ({ userId, profile }) => ({
        url: `user-config/profile/${userId}`,
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Configuraciones
    getSettings: builder.query<UserSettings[], string>({
      query: (userId) => `user-config/settings?userId=${userId}`,
      providesTags: ['Settings'],
    }),

    getSetting: builder.query<UserSettings, string>({
      query: (id) => `user-config/settings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Settings', id }],
    }),

    createSetting: builder.mutation<UserSettings, Omit<UserSettings, 'id' | 'createdAt' | 'lastUpdated'>>({
      query: (setting) => ({
        url: 'user-config/settings',
        method: 'POST',
        body: setting,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateSetting: builder.mutation<UserSettings, { id: string; setting: Partial<UserSettings> }>({
      query: ({ id, setting }) => ({
        url: `user-config/settings/${id}`,
        method: 'PUT',
        body: setting,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Settings', id }],
    }),

    deleteSetting: builder.mutation<void, string>({
      query: (id) => ({
        url: `user-config/settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Settings'],
    }),

    // Temas
    getThemes: builder.query<UserTheme[], string>({
      query: (userId) => `user-config/themes?userId=${userId}`,
      providesTags: ['Themes'],
    }),

    getTheme: builder.query<UserTheme, string>({
      query: (id) => `user-config/themes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Themes', id }],
    }),

    createTheme: builder.mutation<UserTheme, Omit<UserTheme, 'id' | 'createdAt' | 'lastUpdated'>>({
      query: (theme) => ({
        url: 'user-config/themes',
        method: 'POST',
        body: theme,
      }),
      invalidatesTags: ['Themes'],
    }),

    updateTheme: builder.mutation<UserTheme, { id: string; theme: Partial<UserTheme> }>({
      query: ({ id, theme }) => ({
        url: `user-config/themes/${id}`,
        method: 'PUT',
        body: theme,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Themes', id }],
    }),

    deleteTheme: builder.mutation<void, string>({
      query: (id) => ({
        url: `user-config/themes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Themes'],
    }),

    // Layouts
    getLayouts: builder.query<UserLayout[], string>({
      query: (userId) => `user-config/layouts?userId=${userId}`,
      providesTags: ['Layouts'],
    }),

    getLayout: builder.query<UserLayout, string>({
      query: (id) => `user-config/layouts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Layouts', id }],
    }),

    createLayout: builder.mutation<UserLayout, Omit<UserLayout, 'id' | 'createdAt' | 'lastUpdated'>>({
      query: (layout) => ({
        url: 'user-config/layouts',
        method: 'POST',
        body: layout,
      }),
      invalidatesTags: ['Layouts'],
    }),

    updateLayout: builder.mutation<UserLayout, { id: string; layout: Partial<UserLayout> }>({
      query: ({ id, layout }) => ({
        url: `user-config/layouts/${id}`,
        method: 'PUT',
        body: layout,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Layouts', id }],
    }),

    deleteLayout: builder.mutation<void, string>({
      query: (id) => ({
        url: `user-config/layouts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Layouts'],
    }),

    // Templates
    getTemplates: builder.query<UserTemplate[], string>({
      query: (userId) => `user-config/templates?userId=${userId}`,
      providesTags: ['Templates'],
    }),

    getTemplate: builder.query<UserTemplate, string>({
      query: (id) => `user-config/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Templates', id }],
    }),

    createTemplate: builder.mutation<UserTemplate, Omit<UserTemplate, 'id' | 'createdAt' | 'lastUpdated'>>({
      query: (template) => ({
        url: 'user-config/templates',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['Templates'],
    }),

    updateTemplate: builder.mutation<UserTemplate, { id: string; template: Partial<UserTemplate> }>({
      query: ({ id, template }) => ({
        url: `user-config/templates/${id}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Templates', id }],
    }),

    deleteTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `user-config/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),

    // Configuraciones específicas
    getNotifications: builder.query<NotificationSettings, string>({
      query: (userId) => `user-config/notifications/${userId}`,
      providesTags: ['Notifications'],
    }),

    updateNotifications: builder.mutation<NotificationSettings, { userId: string; notifications: Partial<NotificationSettings> }>({
      query: ({ userId, notifications }) => ({
        url: `user-config/notifications/${userId}`,
        method: 'PUT',
        body: notifications,
      }),
      invalidatesTags: ['Notifications'],
    }),

    getPreferences: builder.query<UserPreferences, string>({
      query: (userId) => `user-config/preferences/${userId}`,
      providesTags: ['Preferences'],
    }),

    updatePreferences: builder.mutation<UserPreferences, { userId: string; preferences: Partial<UserPreferences> }>({
      query: ({ userId, preferences }) => ({
        url: `user-config/preferences/${userId}`,
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['Preferences'],
    }),

    getDashboard: builder.query<DashboardConfig, string>({
      query: (userId) => `user-config/dashboard/${userId}`,
      providesTags: ['Dashboard'],
    }),

    updateDashboard: builder.mutation<DashboardConfig, { userId: string; dashboard: Partial<DashboardConfig> }>({
      query: ({ userId, dashboard }) => ({
        url: `user-config/dashboard/${userId}`,
        method: 'PUT',
        body: dashboard,
      }),
      invalidatesTags: ['Dashboard'],
    }),

    getReports: builder.query<ReportConfig, string>({
      query: (userId) => `user-config/reports/${userId}`,
      providesTags: ['Reports'],
    }),

    updateReports: builder.mutation<ReportConfig, { userId: string; reports: Partial<ReportConfig> }>({
      query: ({ userId, reports }) => ({
        url: `user-config/reports/${userId}`,
        method: 'PUT',
        body: reports,
      }),
      invalidatesTags: ['Reports'],
    }),

    getSearch: builder.query<SearchConfig, string>({
      query: (userId) => `user-config/search/${userId}`,
      providesTags: ['Search'],
    }),

    updateSearch: builder.mutation<SearchConfig, { userId: string; search: Partial<SearchConfig> }>({
      query: ({ userId, search }) => ({
        url: `user-config/search/${userId}`,
        method: 'PUT',
        body: search,
      }),
      invalidatesTags: ['Search'],
    }),

    getAlerts: builder.query<AlertConfig, string>({
      query: (userId) => `user-config/alerts/${userId}`,
      providesTags: ['Alerts'],
    }),

    updateAlerts: builder.mutation<AlertConfig, { userId: string; alerts: Partial<AlertConfig> }>({
      query: ({ userId, alerts }) => ({
        url: `user-config/alerts/${userId}`,
        method: 'PUT',
        body: alerts,
      }),
      invalidatesTags: ['Alerts'],
    }),

    getPrivacy: builder.query<PrivacySettings, string>({
      query: (userId) => `user-config/privacy/${userId}`,
      providesTags: ['Privacy'],
    }),

    updatePrivacy: builder.mutation<PrivacySettings, { userId: string; privacy: Partial<PrivacySettings> }>({
      query: ({ userId, privacy }) => ({
        url: `user-config/privacy/${userId}`,
        method: 'PUT',
        body: privacy,
      }),
      invalidatesTags: ['Privacy'],
    }),

    getAccessibility: builder.query<AccessibilitySettings, string>({
      query: (userId) => `user-config/accessibility/${userId}`,
      providesTags: ['Accessibility'],
    }),

    updateAccessibility: builder.mutation<AccessibilitySettings, { userId: string; accessibility: Partial<AccessibilitySettings> }>({
      query: ({ userId, accessibility }) => ({
        url: `user-config/accessibility/${userId}`,
        method: 'PUT',
        body: accessibility,
      }),
      invalidatesTags: ['Accessibility'],
    }),

    // Configuraciones por categoría
    getSettingsByCategory: builder.query<UserSettings[], { userId: string; category: string }>({
      query: ({ userId, category }) => `user-config/settings/category/${category}?userId=${userId}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones públicas
    getPublicSettings: builder.query<UserSettings[], string>({
      query: (category) => `user-config/settings/public/${category}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones compartidas
    getSharedSettings: builder.query<UserSettings[], string>({
      query: (userId) => `user-config/settings/shared/${userId}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por usuario
    getSettingsByUser: builder.query<UserSettings[], string>({
      query: (userId) => `user-config/settings/user/${userId}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por tipo
    getSettingsByType: builder.query<UserSettings[], { userId: string; type: string }>({
      query: ({ userId, type }) => `user-config/settings/type/${type}?userId=${userId}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por fecha
    getSettingsByDate: builder.query<UserSettings[], { userId: string; startDate: string; endDate: string }>({
      query: ({ userId, startDate, endDate }) => `user-config/settings/date?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por búsqueda
    searchSettings: builder.query<UserSettings[], { userId: string; query: string }>({
      query: ({ userId, query }) => `user-config/settings/search?userId=${userId}&query=${query}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por filtros
    getSettingsByFilters: builder.query<UserSettings[], { userId: string; filters: any }>({
      query: ({ userId, filters }) => ({
        url: `user-config/settings/filters?userId=${userId}`,
        method: 'POST',
        body: filters,
      }),
      providesTags: ['Settings'],
    }),

    // Configuraciones por ordenamiento
    getSettingsBySort: builder.query<UserSettings[], { userId: string; sortBy: string; sortOrder: 'asc' | 'desc' }>({
      query: ({ userId, sortBy, sortOrder }) => `user-config/settings/sort?userId=${userId}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por límite
    getSettingsByLimit: builder.query<UserSettings[], { userId: string; limit: number; offset: number }>({
      query: ({ userId, limit, offset }) => `user-config/settings/limit?userId=${userId}&limit=${limit}&offset=${offset}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por inclusión
    getSettingsByInclusion: builder.query<UserSettings[], { userId: string; includeInactive: boolean; includeArchived: boolean }>({
      query: ({ userId, includeInactive, includeArchived }) => `user-config/settings/inclusion?userId=${userId}&includeInactive=${includeInactive}&includeArchived=${includeArchived}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por visibilidad
    getSettingsByVisibility: builder.query<UserSettings[], { userId: string; visibility: string }>({
      query: ({ userId, visibility }) => `user-config/settings/visibility?userId=${userId}&visibility=${visibility}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por permisos
    getSettingsByPermissions: builder.query<UserSettings[], { userId: string; permissions: string[] }>({
      query: ({ userId, permissions }) => ({
        url: `user-config/settings/permissions?userId=${userId}`,
        method: 'POST',
        body: { permissions },
      }),
      providesTags: ['Settings'],
    }),

    // Configuraciones por compartir
    getSettingsBySharing: builder.query<UserSettings[], { userId: string; sharing: string }>({
      query: ({ userId, sharing }) => `user-config/settings/sharing?userId=${userId}&sharing=${sharing}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por fecha de creación
    getSettingsByCreatedDate: builder.query<UserSettings[], { userId: string; startDate: string; endDate: string }>({
      query: ({ userId, startDate, endDate }) => `user-config/settings/created?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por fecha de actualización
    getSettingsByUpdatedDate: builder.query<UserSettings[], { userId: string; startDate: string; endDate: string }>({
      query: ({ userId, startDate, endDate }) => `user-config/settings/updated?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por usuario que creó
    getSettingsByCreator: builder.query<UserSettings[], { userId: string; creatorId: string }>({
      query: ({ userId, creatorId }) => `user-config/settings/creator?userId=${userId}&creatorId=${creatorId}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por usuario que actualizó
    getSettingsByUpdater: builder.query<UserSettings[], { userId: string; updaterId: string }>({
      query: ({ userId, updaterId }) => `user-config/settings/updater?userId=${userId}&updaterId=${updaterId}`,
      providesTags: ['Settings'],
    }),

    // Configuraciones por etiquetas
    getSettingsByTags: builder.query<UserSettings[], { userId: string; tags: string[] }>({
      query: ({ userId, tags }) => ({
        url: `user-config/settings/tags?userId=${userId}`,
        method: 'POST',
        body: { tags },
      }),
      providesTags: ['Settings'],
    }),

    // Configuraciones por metadatos
    getSettingsByMetadata: builder.query<UserSettings[], { userId: string; metadata: any }>({
      query: ({ userId, metadata }) => ({
        url: `user-config/settings/metadata?userId=${userId}`,
        method: 'POST',
        body: { metadata },
      }),
      providesTags: ['Settings'],
    }),

    // Configuraciones por combinación
    getSettingsByCombination: builder.query<UserSettings[], { 
      userId: string; 
      filters: any;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
      limit: number;
      offset: number;
    }>({
      query: ({ userId, filters, sortBy, sortOrder, limit, offset }) => ({
        url: `user-config/settings/combination?userId=${userId}`,
        method: 'POST',
        body: { filters, sortBy, sortOrder, limit, offset },
      }),
      providesTags: ['Settings'],
    }),

    // Exportación de configuraciones
    exportSettings: builder.mutation<Blob, { 
      userId: string;
      format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml';
      settings: string[];
    }>({
      query: ({ userId, format, settings }) => ({
        url: `user-config/settings/export?userId=${userId}`,
        method: 'POST',
        body: { format, settings },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Importación de configuraciones
    importSettings: builder.mutation<UserSettings[], { 
      userId: string;
      format: 'json' | 'csv' | 'xml';
      data: any;
    }>({
      query: ({ userId, format, data }) => ({
        url: `user-config/settings/import?userId=${userId}`,
        method: 'POST',
        body: { format, data },
      }),
      invalidatesTags: ['Settings'],
    }),

    // Validación de configuraciones
    validateSettings: builder.mutation<{ valid: boolean; errors: string[] }, { 
      userId: string;
      settings: any;
    }>({
      query: ({ userId, settings }) => ({
        url: `user-config/settings/validate?userId=${userId}`,
        method: 'POST',
        body: { settings },
      }),
    }),

    // Optimización de configuraciones
    optimizeSettings: builder.mutation<any, { 
      userId: string;
      settings: any;
    }>({
      query: ({ userId, settings }) => ({
        url: `user-config/settings/optimize?userId=${userId}`,
        method: 'POST',
        body: { settings },
      }),
    }),

    // Respaldo de configuraciones
    backupSettings: builder.mutation<Blob, { 
      userId: string;
      format: 'json' | 'zip';
    }>({
      query: ({ userId, format }) => ({
        url: `user-config/settings/backup?userId=${userId}`,
        method: 'POST',
        body: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Restauración de configuraciones
    restoreSettings: builder.mutation<UserSettings[], { 
      userId: string;
      data: any;
    }>({
      query: ({ userId, data }) => ({
        url: `user-config/settings/restore?userId=${userId}`,
        method: 'POST',
        body: { data },
      }),
      invalidatesTags: ['Settings'],
    }),

    // Estadísticas de configuraciones
    getSettingsStats: builder.query<{
      totalSettings: number;
      totalThemes: number;
      totalLayouts: number;
      totalTemplates: number;
      lastUpdated: string;
    }, string>({
      query: (userId) => `user-config/settings/stats?userId=${userId}`,
      providesTags: ['Settings'],
    }),

    // Rendimiento de configuraciones
    getSettingsPerformance: builder.query<{
      averageLoadTime: number;
      peakLoadTime: number;
      slowestSettings: Array<{
        id: string;
        name: string;
        loadTime: number;
        timestamp: string;
      }>;
    }, { userId: string; startDate: string; endDate: string }>({
      query: ({ userId, startDate, endDate }) => ({
        url: `user-config/settings/performance?userId=${userId}`,
        method: 'POST',
        body: { startDate, endDate },
      }),
      providesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSettingsQuery,
  useGetSettingQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useGetThemesQuery,
  useGetThemeQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
  useGetLayoutsQuery,
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useUpdateLayoutMutation,
  useDeleteLayoutMutation,
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetDashboardQuery,
  useUpdateDashboardMutation,
  useGetReportsQuery,
  useUpdateReportsMutation,
  useGetSearchQuery,
  useUpdateSearchMutation,
  useGetAlertsQuery,
  useUpdateAlertsMutation,
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
  useGetAccessibilityQuery,
  useUpdateAccessibilityMutation,
  useGetSettingsByCategoryQuery,
  useGetPublicSettingsQuery,
  useGetSharedSettingsQuery,
  useGetSettingsByUserQuery,
  useGetSettingsByTypeQuery,
  useGetSettingsByDateQuery,
  useSearchSettingsQuery,
  useGetSettingsByFiltersQuery,
  useGetSettingsBySortQuery,
  useGetSettingsByLimitQuery,
  useGetSettingsByInclusionQuery,
  useGetSettingsByVisibilityQuery,
  useGetSettingsByPermissionsQuery,
  useGetSettingsBySharingQuery,
  useGetSettingsByCreatedDateQuery,
  useGetSettingsByUpdatedDateQuery,
  useGetSettingsByCreatorQuery,
  useGetSettingsByUpdaterQuery,
  useGetSettingsByTagsQuery,
  useGetSettingsByMetadataQuery,
  useGetSettingsByCombinationQuery,
  useExportSettingsMutation,
  useImportSettingsMutation,
  useValidateSettingsMutation,
  useOptimizeSettingsMutation,
  useBackupSettingsMutation,
  useRestoreSettingsMutation,
  useGetSettingsStatsQuery,
  useGetSettingsPerformanceQuery,
} = userConfigApi;


