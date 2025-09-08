import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  SearchResult, 
  SearchFilter, 
  SavedFilter, 
  SearchQuery, 
  SearchResponse, 
  SearchSuggestion, 
  SearchHistory, 
  SearchAnalytics, 
  SearchConfig 
} from '../types/search';

export const searchApi = createApi({
  reducerPath: 'searchApi',
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
  tagTypes: ['Search', 'Filters', 'Suggestions', 'History', 'Analytics', 'Config'],
  endpoints: (builder) => ({
    // Búsqueda principal
    search: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Sugerencias y autocompletado
    getSuggestions: builder.query<SearchSuggestion[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: 'search/suggestions',
        method: 'POST',
        body: { query, limit },
      }),
      providesTags: ['Suggestions'],
    }),

    getAutocomplete: builder.query<SearchSuggestion[], { query: string; limit?: number }>({
      query: ({ query, limit = 5 }) => ({
        url: 'search/autocomplete',
        method: 'POST',
        body: { query, limit },
      }),
      providesTags: ['Suggestions'],
    }),

    // Filtros
    getFilters: builder.query<SearchFilter[], void>({
      query: () => 'search/filters',
      providesTags: ['Filters'],
    }),

    createFilter: builder.mutation<SearchFilter, Omit<SearchFilter, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>>({
      query: (filter) => ({
        url: 'search/filters',
        method: 'POST',
        body: filter,
      }),
      invalidatesTags: ['Filters'],
    }),

    updateFilter: builder.mutation<SearchFilter, { id: string; filter: Partial<SearchFilter> }>({
      query: ({ id, filter }) => ({
        url: `search/filters/${id}`,
        method: 'PUT',
        body: filter,
      }),
      invalidatesTags: ['Filters'],
    }),

    deleteFilter: builder.mutation<void, string>({
      query: (id) => ({
        url: `search/filters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Filters'],
    }),

    // Filtros guardados
    getSavedFilters: builder.query<SavedFilter[], void>({
      query: () => 'search/saved-filters',
      providesTags: ['Filters'],
    }),

    createSavedFilter: builder.mutation<SavedFilter, Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'usageCount' | 'lastUsed' | 'sharedWith' | 'permissions'>>({
      query: (filter) => ({
        url: 'search/saved-filters',
        method: 'POST',
        body: filter,
      }),
      invalidatesTags: ['Filters'],
    }),

    updateSavedFilter: builder.mutation<SavedFilter, { id: string; filter: Partial<SavedFilter> }>({
      query: ({ id, filter }) => ({
        url: `search/saved-filters/${id}`,
        method: 'PUT',
        body: filter,
      }),
      invalidatesTags: ['Filters'],
    }),

    deleteSavedFilter: builder.mutation<void, string>({
      query: (id) => ({
        url: `search/saved-filters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Filters'],
    }),

    // Historial de búsquedas
    getSearchHistory: builder.query<SearchHistory[], { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 }) => ({
        url: 'search/history',
        method: 'GET',
        params: { limit, offset },
      }),
      providesTags: ['History'],
    }),

    addSearchHistory: builder.mutation<SearchHistory, Omit<SearchHistory, 'id' | 'timestamp'>>({
      query: (history) => ({
        url: 'search/history',
        method: 'POST',
        body: history,
      }),
      invalidatesTags: ['History'],
    }),

    deleteSearchHistory: builder.mutation<void, string>({
      query: (id) => ({
        url: `search/history/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['History'],
    }),

    clearSearchHistory: builder.mutation<void, void>({
      query: () => ({
        url: 'search/history',
        method: 'DELETE',
      }),
      invalidatesTags: ['History'],
    }),

    // Analytics
    getSearchAnalytics: builder.query<SearchAnalytics, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: 'search/analytics',
        method: 'POST',
        body: { startDate, endDate },
      }),
      providesTags: ['Analytics'],
    }),

    // Configuración
    getSearchConfig: builder.query<SearchConfig, void>({
      query: () => 'search/config',
      providesTags: ['Config'],
    }),

    updateSearchConfig: builder.mutation<SearchConfig, Partial<SearchConfig>>({
      query: (config) => ({
        url: 'search/config',
        method: 'PUT',
        body: config,
      }),
      invalidatesTags: ['Config'],
    }),

    // Búsquedas específicas
    searchKPIs: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/kpis',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchAlerts: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/alerts',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchTrends: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/trends',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchInsights: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/insights',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchUsers: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/users',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchSites: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/sites',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchClients: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/clients',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchGroups: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/groups',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchMeters: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/meters',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchReports: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/reports',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    searchDashboards: builder.query<SearchResponse, SearchQuery>({
      query: (query) => ({
        url: 'search/dashboards',
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por categoría
    searchByCategory: builder.query<SearchResponse, { category: string; query: SearchQuery }>({
      query: ({ category, query }) => ({
        url: `search/category/${category}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por entidad
    searchByEntity: builder.query<SearchResponse, { entityType: string; entityId: string; query: SearchQuery }>({
      query: ({ entityType, entityId, query }) => ({
        url: `search/entity/${entityType}/${entityId}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por usuario
    searchByUser: builder.query<SearchResponse, { userId: string; query: SearchQuery }>({
      query: ({ userId, query }) => ({
        url: `search/user/${userId}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por período
    searchByPeriod: builder.query<SearchResponse, { startDate: string; endDate: string; query: SearchQuery }>({
      query: ({ startDate, endDate, query }) => ({
        url: 'search/period',
        method: 'POST',
        body: { startDate, endDate, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por estado
    searchByStatus: builder.query<SearchResponse, { status: string; query: SearchQuery }>({
      query: ({ status, query }) => ({
        url: `search/status/${status}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por severidad
    searchBySeverity: builder.query<SearchResponse, { severity: string; query: SearchQuery }>({
      query: ({ severity, query }) => ({
        url: `search/severity/${severity}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por prioridad
    searchByPriority: builder.query<SearchResponse, { priority: string; query: SearchQuery }>({
      query: ({ priority, query }) => ({
        url: `search/priority/${priority}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por etiquetas
    searchByTags: builder.query<SearchResponse, { tags: string[]; query: SearchQuery }>({
      query: ({ tags, query }) => ({
        url: 'search/tags',
        method: 'POST',
        body: { tags, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por valor
    searchByValue: builder.query<SearchResponse, { minValue: number; maxValue: number; query: SearchQuery }>({
      query: ({ minValue, maxValue, query }) => ({
        url: 'search/value',
        method: 'POST',
        body: { minValue, maxValue, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por rango de fechas
    searchByDateRange: builder.query<SearchResponse, { startDate: string; endDate: string; query: SearchQuery }>({
      query: ({ startDate, endDate, query }) => ({
        url: 'search/date-range',
        method: 'POST',
        body: { startDate, endDate, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por texto completo
    searchByText: builder.query<SearchResponse, { text: string; query: SearchQuery }>({
      query: ({ text, query }) => ({
        url: 'search/text',
        method: 'POST',
        body: { text, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por similitud
    searchBySimilarity: builder.query<SearchResponse, { resultId: string; query: SearchQuery }>({
      query: ({ resultId, query }) => ({
        url: `search/similar/${resultId}`,
        method: 'POST',
        body: query,
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por relevancia
    searchByRelevance: builder.query<SearchResponse, { minRelevance: number; query: SearchQuery }>({
      query: ({ minRelevance, query }) => ({
        url: 'search/relevance',
        method: 'POST',
        body: { minRelevance, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por facetas
    searchByFacets: builder.query<SearchResponse, { facets: Record<string, string[]>; query: SearchQuery }>({
      query: ({ facets, query }) => ({
        url: 'search/facets',
        method: 'POST',
        body: { facets, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por agregaciones
    searchByAggregations: builder.query<SearchResponse, { aggregations: string[]; query: SearchQuery }>({
      query: ({ aggregations, query }) => ({
        url: 'search/aggregations',
        method: 'POST',
        body: { aggregations, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por ordenamiento
    searchBySort: builder.query<SearchResponse, { sortBy: string; sortOrder: 'asc' | 'desc'; query: SearchQuery }>({
      query: ({ sortBy, sortOrder, query }) => ({
        url: 'search/sort',
        method: 'POST',
        body: { sortBy, sortOrder, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por límite
    searchByLimit: builder.query<SearchResponse, { limit: number; offset: number; query: SearchQuery }>({
      query: ({ limit, offset, query }) => ({
        url: 'search/limit',
        method: 'POST',
        body: { limit, offset, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por inclusión
    searchByInclusion: builder.query<SearchResponse, { includeInactive: boolean; includeArchived: boolean; query: SearchQuery }>({
      query: ({ includeInactive, includeArchived, query }) => ({
        url: 'search/inclusion',
        method: 'POST',
        body: { includeInactive, includeArchived, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por resaltado
    searchByHighlight: builder.query<SearchResponse, { highlight: boolean; query: SearchQuery }>({
      query: ({ highlight, query }) => ({
        url: 'search/highlight',
        method: 'POST',
        body: { highlight, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por fuzzy
    searchByFuzzy: builder.query<SearchResponse, { fuzzy: boolean; query: SearchQuery }>({
      query: ({ fuzzy, query }) => ({
        url: 'search/fuzzy',
        method: 'POST',
        body: { fuzzy, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por autocompletado
    searchByAutocomplete: builder.query<SearchResponse, { autocomplete: boolean; query: SearchQuery }>({
      query: ({ autocomplete, query }) => ({
        url: 'search/autocomplete',
        method: 'POST',
        body: { autocomplete, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por sugerencias
    searchBySuggestions: builder.query<SearchResponse, { suggestions: boolean; query: SearchQuery }>({
      query: ({ suggestions, query }) => ({
        url: 'search/suggestions',
        method: 'POST',
        body: { suggestions, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por relacionados
    searchByRelated: builder.query<SearchResponse, { related: boolean; query: SearchQuery }>({
      query: ({ related, query }) => ({
        url: 'search/related',
        method: 'POST',
        body: { related, query },
      }),
      providesTags: ['Search'],
    }),


    // Búsquedas por tiempo
    searchByTime: builder.query<SearchResponse, { timeRange: { start: string; end: string; timezone: string }; query: SearchQuery }>({
      query: ({ timeRange, query }) => ({
        url: 'search/time',
        method: 'POST',
        body: { timeRange, query },
      }),
      providesTags: ['Search'],
    }),


    // Búsquedas por combinación
    searchByCombination: builder.query<SearchResponse, { 
      filters: SearchFilter[];
      sortBy: string;
      sortOrder: 'asc' | 'desc';
      limit: number;
      offset: number;
      query: SearchQuery;
    }>({
      query: ({ filters, sortBy, sortOrder, limit, offset, query }) => ({
        url: 'search/combination',
        method: 'POST',
        body: { filters, sortBy, sortOrder, limit, offset, query },
      }),
      providesTags: ['Search'],
    }),

    // Búsquedas por exportación
    exportSearchResults: builder.mutation<Blob, { 
      format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml';
      query: SearchQuery;
    }>({
      query: ({ format, query }) => ({
        url: 'search/export',
        method: 'POST',
        body: { format, query },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Búsquedas por importación
    importSearchResults: builder.mutation<SearchResponse, { 
      format: 'json' | 'csv' | 'xml';
      data: any;
    }>({
      query: ({ format, data }) => ({
        url: 'search/import',
        method: 'POST',
        body: { format, data },
      }),
      invalidatesTags: ['Search'],
    }),

    // Búsquedas por validación
    validateSearchQuery: builder.mutation<{ valid: boolean; errors: string[] }, SearchQuery>({
      query: (query) => ({
        url: 'search/validate',
        method: 'POST',
        body: query,
      }),
    }),

    // Búsquedas por optimización
    optimizeSearchQuery: builder.mutation<SearchQuery, SearchQuery>({
      query: (query) => ({
        url: 'search/optimize',
        method: 'POST',
        body: query,
      }),
    }),

    // Búsquedas por caché
    clearSearchCache: builder.mutation<void, void>({
      query: () => ({
        url: 'search/cache',
        method: 'DELETE',
      }),
      invalidatesTags: ['Search'],
    }),

    // Búsquedas por estadísticas
    getSearchStats: builder.query<{
      totalQueries: number;
      totalResults: number;
      averageExecutionTime: number;
      cacheHitRate: number;
      errorRate: number;
    }, void>({
      query: () => 'search/stats',
      providesTags: ['Analytics'],
    }),

    // Búsquedas por rendimiento
    getSearchPerformance: builder.query<{
      averageResponseTime: number;
      peakResponseTime: number;
      slowestQueries: Array<{
        query: string;
        executionTime: number;
        timestamp: string;
      }>;
    }, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: 'search/performance',
        method: 'POST',
        body: { startDate, endDate },
      }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useSearchQuery,
  useGetSuggestionsQuery,
  useGetAutocompleteQuery,
  useGetFiltersQuery,
  useCreateFilterMutation,
  useUpdateFilterMutation,
  useDeleteFilterMutation,
  useGetSavedFiltersQuery,
  useCreateSavedFilterMutation,
  useUpdateSavedFilterMutation,
  useDeleteSavedFilterMutation,
  useGetSearchHistoryQuery,
  useAddSearchHistoryMutation,
  useDeleteSearchHistoryMutation,
  useClearSearchHistoryMutation,
  useGetSearchAnalyticsQuery,
  useGetSearchConfigQuery,
  useUpdateSearchConfigMutation,
  useSearchKPIsQuery,
  useSearchAlertsQuery,
  useSearchTrendsQuery,
  useSearchInsightsQuery,
  useSearchUsersQuery,
  useSearchSitesQuery,
  useSearchClientsQuery,
  useSearchGroupsQuery,
  useSearchMetersQuery,
  useSearchReportsQuery,
  useSearchDashboardsQuery,
  useSearchByCategoryQuery,
  useSearchByEntityQuery,
  useSearchByUserQuery,
  useSearchByPeriodQuery,
  useSearchByStatusQuery,
  useSearchBySeverityQuery,
  useSearchByPriorityQuery,
  useSearchByTagsQuery,
  useSearchByValueQuery,
  useSearchByDateRangeQuery,
  useSearchByTextQuery,
  useSearchBySimilarityQuery,
  useSearchByRelevanceQuery,
  useSearchByFacetsQuery,
  useSearchByAggregationsQuery,
  useSearchBySortQuery,
  useSearchByLimitQuery,
  useSearchByInclusionQuery,
  useSearchByHighlightQuery,
  useSearchByFuzzyQuery,
  useSearchByAutocompleteQuery,
  useSearchBySuggestionsQuery,
  useSearchByRelatedQuery,
  useSearchByTimeQuery,
  useSearchByCombinationQuery,
  useExportSearchResultsMutation,
  useImportSearchResultsMutation,
  useValidateSearchQueryMutation,
  useOptimizeSearchQueryMutation,
  useClearSearchCacheMutation,
  useGetSearchStatsQuery,
  useGetSearchPerformanceQuery,
} = searchApi;
