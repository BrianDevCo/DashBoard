import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
} from '../../types/search';

interface SearchState {
  // Búsqueda actual
  currentQuery: SearchQuery;
  currentResults: SearchResult[];
  currentResponse: SearchResponse | null;
  
  // Filtros
  activeFilters: SearchFilter[];
  savedFilters: SavedFilter[];
  filterGroups: Array<{
    id: string;
    name: string;
    filters: SearchFilter[];
    isCollapsed: boolean;
  }>;
  
  // Sugerencias y autocompletado
  suggestions: SearchSuggestion[];
  autocompleteResults: SearchSuggestion[];
  recentSearches: string[];
  popularSearches: string[];
  
  // Historial
  searchHistory: SearchHistory[];
  recentFilters: SearchFilter[];
  
  // Configuración
  config: SearchConfig | null;
  
  // UI State
  isSearching: boolean;
  isSuggestionsOpen: boolean;
  isFiltersOpen: boolean;
  isHistoryOpen: boolean;
  isAnalyticsOpen: boolean;
  searchMode: 'simple' | 'advanced' | 'saved';
  viewMode: 'list' | 'grid' | 'compact';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
  page: number;
  
  // Filtros de vista
  showInactive: boolean;
  showArchived: boolean;
  highlightResults: boolean;
  showFacets: boolean;
  showAggregations: boolean;
  showRelated: boolean;
  showSuggestions: boolean;
  
  // Loading states
  loading: {
    search: boolean;
    suggestions: boolean;
    filters: boolean;
    history: boolean;
    analytics: boolean;
    config: boolean;
  };
  
  // Error states
  error: {
    search: string | null;
    suggestions: string | null;
    filters: string | null;
    history: string | null;
    analytics: string | null;
    config: string | null;
  };
  
  // Estadísticas
  stats: {
    totalQueries: number;
    totalResults: number;
    averageExecutionTime: number;
    lastSearchTime: string | null;
  };
}

const initialState: SearchState = {
  currentQuery: {
    query: '',
    filters: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
    limit: 20,
    offset: 0,
    includeInactive: false,
    includeArchived: false,
    searchIn: [],
    highlight: true,
    fuzzy: true,
    autocomplete: true,
    suggestions: true,
    related: true,
    facets: true,
    aggregations: true,
  },
  currentResults: [],
  currentResponse: null,
  activeFilters: [],
  savedFilters: [],
  filterGroups: [],
  suggestions: [],
  autocompleteResults: [],
  recentSearches: [],
  popularSearches: [],
  searchHistory: [],
  recentFilters: [],
  config: null,
  isSearching: false,
  isSuggestionsOpen: false,
  isFiltersOpen: false,
  isHistoryOpen: false,
  isAnalyticsOpen: false,
  searchMode: 'simple',
  viewMode: 'list',
  sortBy: 'relevance',
  sortOrder: 'desc',
  limit: 20,
  page: 1,
  showInactive: false,
  showArchived: false,
  highlightResults: true,
  showFacets: true,
  showAggregations: true,
  showRelated: true,
  showSuggestions: true,
  loading: {
    search: false,
    suggestions: false,
    filters: false,
    history: false,
    analytics: false,
    config: false,
  },
  error: {
    search: null,
    suggestions: null,
    filters: null,
    history: null,
    analytics: null,
    config: null,
  },
  stats: {
    totalQueries: 0,
    totalResults: 0,
    averageExecutionTime: 0,
    lastSearchTime: null,
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Búsqueda
    setCurrentQuery: (state, action: PayloadAction<Partial<SearchQuery>>) => {
      state.currentQuery = { ...state.currentQuery, ...action.payload };
    },
    
    setCurrentResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.currentResults = action.payload;
    },
    
    setCurrentResponse: (state, action: PayloadAction<SearchResponse | null>) => {
      state.currentResponse = action.payload;
    },
    
    addSearchResult: (state, action: PayloadAction<SearchResult>) => {
      state.currentResults.push(action.payload);
    },
    
    updateSearchResult: (state, action: PayloadAction<{ id: string; result: Partial<SearchResult> }>) => {
      const index = state.currentResults.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.currentResults[index] = { ...state.currentResults[index], ...action.payload.result };
      }
    },
    
    removeSearchResult: (state, action: PayloadAction<string>) => {
      state.currentResults = state.currentResults.filter(r => r.id !== action.payload);
    },
    
    clearSearchResults: (state) => {
      state.currentResults = [];
      state.currentResponse = null;
    },
    
    // Filtros
    setActiveFilters: (state, action: PayloadAction<SearchFilter[]>) => {
      state.activeFilters = action.payload;
    },
    
    addActiveFilter: (state, action: PayloadAction<SearchFilter>) => {
      state.activeFilters.push(action.payload);
    },
    
    updateActiveFilter: (state, action: PayloadAction<{ id: string; filter: Partial<SearchFilter> }>) => {
      const index = state.activeFilters.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.activeFilters[index] = { ...state.activeFilters[index], ...action.payload.filter };
      }
    },
    
    removeActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilters = state.activeFilters.filter(f => f.id !== action.payload);
    },
    
    clearActiveFilters: (state) => {
      state.activeFilters = [];
    },
    
    // Filtros guardados
    setSavedFilters: (state, action: PayloadAction<SavedFilter[]>) => {
      state.savedFilters = action.payload;
    },
    
    addSavedFilter: (state, action: PayloadAction<SavedFilter>) => {
      state.savedFilters.push(action.payload);
    },
    
    updateSavedFilter: (state, action: PayloadAction<{ id: string; filter: Partial<SavedFilter> }>) => {
      const index = state.savedFilters.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.savedFilters[index] = { ...state.savedFilters[index], ...action.payload.filter };
      }
    },
    
    removeSavedFilter: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter(f => f.id !== action.payload);
    },
    
    // Grupos de filtros
    setFilterGroups: (state, action: PayloadAction<Array<{
      id: string;
      name: string;
      filters: SearchFilter[];
      isCollapsed: boolean;
    }>>) => {
      state.filterGroups = action.payload;
    },
    
    addFilterGroup: (state, action: PayloadAction<{
      id: string;
      name: string;
      filters: SearchFilter[];
      isCollapsed: boolean;
    }>) => {
      state.filterGroups.push(action.payload);
    },
    
    updateFilterGroup: (state, action: PayloadAction<{ id: string; group: Partial<{
      id: string;
      name: string;
      filters: SearchFilter[];
      isCollapsed: boolean;
    }> }>) => {
      const index = state.filterGroups.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.filterGroups[index] = { ...state.filterGroups[index], ...action.payload.group };
      }
    },
    
    removeFilterGroup: (state, action: PayloadAction<string>) => {
      state.filterGroups = state.filterGroups.filter(g => g.id !== action.payload);
    },
    
    toggleFilterGroup: (state, action: PayloadAction<string>) => {
      const index = state.filterGroups.findIndex(g => g.id === action.payload);
      if (index !== -1) {
        state.filterGroups[index].isCollapsed = !state.filterGroups[index].isCollapsed;
      }
    },
    
    // Sugerencias
    setSuggestions: (state, action: PayloadAction<SearchSuggestion[]>) => {
      state.suggestions = action.payload;
    },
    
    addSuggestion: (state, action: PayloadAction<SearchSuggestion>) => {
      state.suggestions.push(action.payload);
    },
    
    updateSuggestion: (state, action: PayloadAction<{ id: string; suggestion: Partial<SearchSuggestion> }>) => {
      const index = state.suggestions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.suggestions[index] = { ...state.suggestions[index], ...action.payload.suggestion };
      }
    },
    
    removeSuggestion: (state, action: PayloadAction<string>) => {
      state.suggestions = state.suggestions.filter(s => s.id !== action.payload);
    },
    
    setAutocompleteResults: (state, action: PayloadAction<SearchSuggestion[]>) => {
      state.autocompleteResults = action.payload;
    },
    
    // Búsquedas recientes
    setRecentSearches: (state, action: PayloadAction<string[]>) => {
      state.recentSearches = action.payload;
    },
    
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload;
      state.recentSearches = state.recentSearches.filter(s => s !== search);
      state.recentSearches.unshift(search);
      if (state.recentSearches.length > 10) {
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(s => s !== action.payload);
    },
    
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    setPopularSearches: (state, action: PayloadAction<string[]>) => {
      state.popularSearches = action.payload;
    },
    
    // Historial
    setSearchHistory: (state, action: PayloadAction<SearchHistory[]>) => {
      state.searchHistory = action.payload;
    },
    
    addSearchHistory: (state, action: PayloadAction<SearchHistory>) => {
      state.searchHistory.unshift(action.payload);
      if (state.searchHistory.length > 100) {
        state.searchHistory = state.searchHistory.slice(0, 100);
      }
    },
    
    updateSearchHistory: (state, action: PayloadAction<{ id: string; history: Partial<SearchHistory> }>) => {
      const index = state.searchHistory.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.searchHistory[index] = { ...state.searchHistory[index], ...action.payload.history };
      }
    },
    
    removeSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(h => h.id !== action.payload);
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    // Filtros recientes
    setRecentFilters: (state, action: PayloadAction<SearchFilter[]>) => {
      state.recentFilters = action.payload;
    },
    
    addRecentFilter: (state, action: PayloadAction<SearchFilter>) => {
      const filter = action.payload;
      state.recentFilters = state.recentFilters.filter(f => f.id !== filter.id);
      state.recentFilters.unshift(filter);
      if (state.recentFilters.length > 20) {
        state.recentFilters = state.recentFilters.slice(0, 20);
      }
    },
    
    removeRecentFilter: (state, action: PayloadAction<string>) => {
      state.recentFilters = state.recentFilters.filter(f => f.id !== action.payload);
    },
    
    clearRecentFilters: (state) => {
      state.recentFilters = [];
    },
    
    // Configuración
    setConfig: (state, action: PayloadAction<SearchConfig | null>) => {
      state.config = action.payload;
    },
    
    updateConfig: (state, action: PayloadAction<Partial<SearchConfig>>) => {
      if (state.config) {
        state.config = { ...state.config, ...action.payload };
      }
    },
    
    // UI State
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    
    setIsSuggestionsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSuggestionsOpen = action.payload;
    },
    
    setIsFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.isFiltersOpen = action.payload;
    },
    
    setIsHistoryOpen: (state, action: PayloadAction<boolean>) => {
      state.isHistoryOpen = action.payload;
    },
    
    setIsAnalyticsOpen: (state, action: PayloadAction<boolean>) => {
      state.isAnalyticsOpen = action.payload;
    },
    
    setSearchMode: (state, action: PayloadAction<'simple' | 'advanced' | 'saved'>) => {
      state.searchMode = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'list' | 'grid' | 'compact'>) => {
      state.viewMode = action.payload;
    },
    
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    
    // Filtros de vista
    setShowInactive: (state, action: PayloadAction<boolean>) => {
      state.showInactive = action.payload;
    },
    
    setShowArchived: (state, action: PayloadAction<boolean>) => {
      state.showArchived = action.payload;
    },
    
    setHighlightResults: (state, action: PayloadAction<boolean>) => {
      state.highlightResults = action.payload;
    },
    
    setShowFacets: (state, action: PayloadAction<boolean>) => {
      state.showFacets = action.payload;
    },
    
    setShowAggregations: (state, action: PayloadAction<boolean>) => {
      state.showAggregations = action.payload;
    },
    
    setShowRelated: (state, action: PayloadAction<boolean>) => {
      state.showRelated = action.payload;
    },
    
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      search?: boolean;
      suggestions?: boolean;
      filters?: boolean;
      history?: boolean;
      analytics?: boolean;
      config?: boolean;
    }>) => {
      if (action.payload.search !== undefined) {
        state.loading.search = action.payload.search;
      }
      if (action.payload.suggestions !== undefined) {
        state.loading.suggestions = action.payload.suggestions;
      }
      if (action.payload.filters !== undefined) {
        state.loading.filters = action.payload.filters;
      }
      if (action.payload.history !== undefined) {
        state.loading.history = action.payload.history;
      }
      if (action.payload.analytics !== undefined) {
        state.loading.analytics = action.payload.analytics;
      }
      if (action.payload.config !== undefined) {
        state.loading.config = action.payload.config;
      }
    },
    
    // Error states
    setError: (state, action: PayloadAction<{
      search?: string | null;
      suggestions?: string | null;
      filters?: string | null;
      history?: string | null;
      analytics?: string | null;
      config?: string | null;
    }>) => {
      if (action.payload.search !== undefined) {
        state.error.search = action.payload.search;
      }
      if (action.payload.suggestions !== undefined) {
        state.error.suggestions = action.payload.suggestions;
      }
      if (action.payload.filters !== undefined) {
        state.error.filters = action.payload.filters;
      }
      if (action.payload.history !== undefined) {
        state.error.history = action.payload.history;
      }
      if (action.payload.analytics !== undefined) {
        state.error.analytics = action.payload.analytics;
      }
      if (action.payload.config !== undefined) {
        state.error.config = action.payload.config;
      }
    },
    
    clearErrors: (state) => {
      state.error = {
        search: null,
        suggestions: null,
        filters: null,
        history: null,
        analytics: null,
        config: null,
      };
    },
    
    // Estadísticas
    setStats: (state, action: PayloadAction<Partial<{
      totalQueries: number;
      totalResults: number;
      averageExecutionTime: number;
      lastSearchTime: string | null;
    }>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    updateStats: (state, action: PayloadAction<{
      executionTime: number;
      resultsCount: number;
    }>) => {
      state.stats.totalQueries += 1;
      state.stats.totalResults += action.payload.resultsCount;
      state.stats.averageExecutionTime = 
        (state.stats.averageExecutionTime + action.payload.executionTime) / 2;
      state.stats.lastSearchTime = new Date().toISOString();
    },
    
    // Utilidades
    resetSearch: (state) => {
      state.currentQuery = {
        query: '',
        filters: [],
        sortBy: 'relevance',
        sortOrder: 'desc',
        limit: 20,
        offset: 0,
        includeInactive: false,
        includeArchived: false,
        searchIn: [],
        highlight: true,
        fuzzy: true,
        autocomplete: true,
        suggestions: true,
        related: true,
        facets: true,
        aggregations: true,
      };
      state.currentResults = [];
      state.currentResponse = null;
      state.activeFilters = [];
      state.isSearching = false;
      state.isSuggestionsOpen = false;
      state.isFiltersOpen = false;
      state.page = 1;
    },
    
    resetSearchState: (state) => {
      state.currentQuery = {
        query: '',
        filters: [],
        sortBy: 'relevance',
        sortOrder: 'desc',
        limit: 20,
        offset: 0,
        includeInactive: false,
        includeArchived: false,
        searchIn: [],
        highlight: true,
        fuzzy: true,
        autocomplete: true,
        suggestions: true,
        related: true,
        facets: true,
        aggregations: true,
      };
      state.currentResults = [];
      state.currentResponse = null;
      state.activeFilters = [];
      state.suggestions = [];
      state.autocompleteResults = [];
      state.recentSearches = [];
      state.popularSearches = [];
      state.searchHistory = [];
      state.recentFilters = [];
      state.isSearching = false;
      state.isSuggestionsOpen = false;
      state.isFiltersOpen = false;
      state.isHistoryOpen = false;
      state.isAnalyticsOpen = false;
      state.searchMode = 'simple';
      state.viewMode = 'list';
      state.sortBy = 'relevance';
      state.sortOrder = 'desc';
      state.limit = 20;
      state.page = 1;
      state.showInactive = false;
      state.showArchived = false;
      state.highlightResults = true;
      state.showFacets = true;
      state.showAggregations = true;
      state.showRelated = true;
      state.showSuggestions = true;
      state.loading = {
        search: false,
        suggestions: false,
        filters: false,
        history: false,
        analytics: false,
        config: false,
      };
      state.error = {
        search: null,
        suggestions: null,
        filters: null,
        history: null,
        analytics: null,
        config: null,
      };
      state.stats = {
        totalQueries: 0,
        totalResults: 0,
        averageExecutionTime: 0,
        lastSearchTime: null,
      };
    },
  },
});

export const {
  setCurrentQuery,
  setCurrentResults,
  setCurrentResponse,
  addSearchResult,
  updateSearchResult,
  removeSearchResult,
  clearSearchResults,
  setActiveFilters,
  addActiveFilter,
  updateActiveFilter,
  removeActiveFilter,
  clearActiveFilters,
  setSavedFilters,
  addSavedFilter,
  updateSavedFilter,
  removeSavedFilter,
  setFilterGroups,
  addFilterGroup,
  updateFilterGroup,
  removeFilterGroup,
  toggleFilterGroup,
  setSuggestions,
  addSuggestion,
  updateSuggestion,
  removeSuggestion,
  setAutocompleteResults,
  setRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setPopularSearches,
  setSearchHistory,
  addSearchHistory,
  updateSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  setRecentFilters,
  addRecentFilter,
  removeRecentFilter,
  clearRecentFilters,
  setConfig,
  updateConfig,
  setIsSearching,
  setIsSuggestionsOpen,
  setIsFiltersOpen,
  setIsHistoryOpen,
  setIsAnalyticsOpen,
  setSearchMode,
  setViewMode,
  setSortBy,
  setSortOrder,
  setLimit,
  setPage,
  setShowInactive,
  setShowArchived,
  setHighlightResults,
  setShowFacets,
  setShowAggregations,
  setShowRelated,
  setShowSuggestions,
  setLoading,
  setError,
  clearErrors,
  setStats,
  updateStats,
  resetSearch,
  resetSearchState,
} = searchSlice.actions;

export default searchSlice.reducer;


