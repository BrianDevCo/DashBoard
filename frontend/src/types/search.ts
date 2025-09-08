// Tipos para Sistema de Búsqueda y Filtros Avanzados

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'kpi' | 'alert' | 'trend' | 'insight' | 'user' | 'site' | 'client' | 'group' | 'meter' | 'report' | 'dashboard' | 'metric' | 'consumption' | 'cost' | 'efficiency';
  category: 'energy' | 'cost' | 'efficiency' | 'maintenance' | 'billing' | 'system' | 'user' | 'report' | 'dashboard';
  entityId?: string;
  entityName?: string;
  entityType?: 'site' | 'client' | 'group' | 'meter';
  value?: number;
  unit?: string;
  currency?: string;
  status?: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  date?: string;
  lastUpdated: string;
  tags: string[];
  metadata: Record<string, any>;
  url: string;
  icon: string;
  color: string;
  relevanceScore: number;
}

export interface SearchFilter {
  id: string;
  name: string;
  description?: string;
  type: 'global' | 'entity' | 'metric' | 'date' | 'status' | 'severity' | 'priority' | 'custom';
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn' | 'isNull' | 'isNotNull';
  value: any;
  values?: any[];
  options?: {
    caseSensitive?: boolean;
    exactMatch?: boolean;
    includeSubEntities?: boolean;
    dateFormat?: string;
    numberFormat?: string;
  };
  isActive: boolean;
  isRequired: boolean;
  order: number;
  group?: string;
  category?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  filters: SearchFilter[];
  isPublic: boolean;
  isDefault: boolean;
  category: 'energy' | 'cost' | 'efficiency' | 'maintenance' | 'billing' | 'system' | 'user' | 'report' | 'dashboard' | 'custom';
  tags: string[];
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  sharedWith: string[];
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
    canShare: string[];
  };
}

export interface SearchQuery {
  query: string;
  filters: SearchFilter[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
  includeInactive: boolean;
  includeArchived: boolean;
  searchIn: string[];
  highlight: boolean;
  fuzzy: boolean;
  autocomplete: boolean;
  suggestions: boolean;
  related: boolean;
  facets: boolean;
  aggregations: boolean;
  timeRange?: {
    start: string;
    end: string;
    timezone: string;
  };
  entityScope?: {
    type: 'all' | 'site' | 'client' | 'group' | 'meter';
    ids: string[];
  };
  userScope?: {
    userId: string;
    roles: string[];
    permissions: string[];
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets: Record<string, Array<{
    value: string;
    count: number;
    label: string;
  }>>;
  aggregations: Record<string, any>;
  suggestions: string[];
  related: SearchResult[];
  query: SearchQuery;
  executionTime: number;
  cached: boolean;
  lastUpdated: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'filter' | 'entity' | 'metric' | 'tag' | 'user' | 'site' | 'client' | 'group' | 'meter';
  category: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  value?: any;
  unit?: string;
  currency?: string;
  icon: string;
  color: string;
  relevanceScore: number;
  usageCount: number;
  lastUsed: string;
  metadata: Record<string, any>;
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: SearchFilter[];
  resultsCount: number;
  executionTime: number;
  timestamp: string;
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  clickedResults: string[];
  exportedResults: string[];
  savedAsFilter: boolean;
  savedFilterId?: string;
  metadata: Record<string, any>;
}

export interface SearchAnalytics {
  totalQueries: number;
  uniqueUsers: number;
  averageExecutionTime: number;
  averageResultsPerQuery: number;
  topQueries: Array<{
    query: string;
    count: number;
    averageResults: number;
    averageExecutionTime: number;
  }>;
  topFilters: Array<{
    filter: SearchFilter;
    count: number;
    averageResults: number;
  }>;
  topEntities: Array<{
    entityType: string;
    entityId: string;
    entityName: string;
    count: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
    averageResults: number;
  }>;
  timeDistribution: Array<{
    hour: number;
    count: number;
  }>;
  userDistribution: Array<{
    userId: string;
    userName: string;
    count: number;
  }>;
  performanceMetrics: {
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
    timeoutRate: number;
  };
  period: {
    start: string;
    end: string;
  };
}

export interface SearchConfig {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  settings: {
    maxResults: number;
    defaultLimit: number;
    maxLimit: number;
    timeout: number;
    cacheTimeout: number;
    fuzzyThreshold: number;
    autocompleteThreshold: number;
    suggestionThreshold: number;
    highlightEnabled: boolean;
    facetsEnabled: boolean;
    aggregationsEnabled: boolean;
    relatedEnabled: boolean;
    suggestionsEnabled: boolean;
    historyEnabled: boolean;
    analyticsEnabled: boolean;
  };
  filters: SearchFilter[];
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
    order: number;
    icon: string;
    color: string;
  }>;
  entities: Array<{
    type: string;
    name: string;
    enabled: boolean;
    searchable: boolean;
    filterable: boolean;
    sortable: boolean;
    fields: string[];
  }>;
  permissions: {
    canSearch: string[];
    canUseAdvancedFilters: string[];
    canSaveFilters: string[];
    canViewAnalytics: string[];
    canManageConfig: string[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Configuración de tipos de búsqueda
export const SEARCH_TYPES = [
  { 
    value: 'kpi', 
    label: 'KPIs', 
    icon: '📊', 
    color: '#2196f3',
    category: 'energy'
  },
  { 
    value: 'alert', 
    label: 'Alertas', 
    icon: '⚠️', 
    color: '#f44336',
    category: 'system'
  },
  { 
    value: 'trend', 
    label: 'Tendencias', 
    icon: '📈', 
    color: '#4caf50',
    category: 'energy'
  },
  { 
    value: 'insight', 
    label: 'Insights', 
    icon: '💡', 
    color: '#ff9800',
    category: 'efficiency'
  },
  { 
    value: 'user', 
    label: 'Usuarios', 
    icon: '👤', 
    color: '#9c27b0',
    category: 'user'
  },
  { 
    value: 'site', 
    label: 'Sitios', 
    icon: '🏢', 
    color: '#607d8b',
    category: 'energy'
  },
  { 
    value: 'client', 
    label: 'Clientes', 
    icon: '👥', 
    color: '#795548',
    category: 'user'
  },
  { 
    value: 'group', 
    label: 'Grupos', 
    icon: '👥', 
    color: '#3f51b5',
    category: 'user'
  },
  { 
    value: 'meter', 
    label: 'Medidores', 
    icon: '⚡', 
    color: '#ff5722',
    category: 'energy'
  },
  { 
    value: 'report', 
    label: 'Reportes', 
    icon: '📄', 
    color: '#009688',
    category: 'report'
  },
  { 
    value: 'dashboard', 
    label: 'Dashboards', 
    icon: '📊', 
    color: '#e91e63',
    category: 'dashboard'
  },
  { 
    value: 'metric', 
    label: 'Métricas', 
    icon: '📏', 
    color: '#00bcd4',
    category: 'energy'
  },
  { 
    value: 'consumption', 
    label: 'Consumo', 
    icon: '⚡', 
    color: '#2196f3',
    category: 'energy'
  },
  { 
    value: 'cost', 
    label: 'Costo', 
    icon: '💰', 
    color: '#4caf50',
    category: 'cost'
  },
  { 
    value: 'efficiency', 
    label: 'Eficiencia', 
    icon: '🎯', 
    color: '#ff9800',
    category: 'efficiency'
  },
];

// Configuración de categorías
export const SEARCH_CATEGORIES = [
  { 
    value: 'energy', 
    label: 'Energía', 
    icon: '⚡', 
    color: '#2196f3' 
  },
  { 
    value: 'cost', 
    label: 'Costo', 
    icon: '💰', 
    color: '#4caf50' 
  },
  { 
    value: 'efficiency', 
    label: 'Eficiencia', 
    icon: '🎯', 
    color: '#ff9800' 
  },
  { 
    value: 'maintenance', 
    label: 'Mantenimiento', 
    icon: '🔧', 
    color: '#ff5722' 
  },
  { 
    value: 'billing', 
    label: 'Facturación', 
    icon: '📄', 
    color: '#607d8b' 
  },
  { 
    value: 'system', 
    label: 'Sistema', 
    icon: '⚙️', 
    color: '#795548' 
  },
  { 
    value: 'user', 
    label: 'Usuario', 
    icon: '👤', 
    color: '#9c27b0' 
  },
  { 
    value: 'report', 
    label: 'Reporte', 
    icon: '📊', 
    color: '#009688' 
  },
  { 
    value: 'dashboard', 
    label: 'Dashboard', 
    icon: '📈', 
    color: '#e91e63' 
  },
];

// Configuración de operadores
export const SEARCH_OPERATORS = [
  { 
    value: 'equals', 
    label: 'Igual a', 
    description: 'Coincidencia exacta',
    types: ['string', 'number', 'boolean', 'date']
  },
  { 
    value: 'contains', 
    label: 'Contiene', 
    description: 'Contiene el texto',
    types: ['string']
  },
  { 
    value: 'startsWith', 
    label: 'Comienza con', 
    description: 'Comienza con el texto',
    types: ['string']
  },
  { 
    value: 'endsWith', 
    label: 'Termina con', 
    description: 'Termina con el texto',
    types: ['string']
  },
  { 
    value: 'greaterThan', 
    label: 'Mayor que', 
    description: 'Valor mayor que',
    types: ['number', 'date']
  },
  { 
    value: 'lessThan', 
    label: 'Menor que', 
    description: 'Valor menor que',
    types: ['number', 'date']
  },
  { 
    value: 'between', 
    label: 'Entre', 
    description: 'Valor entre dos números',
    types: ['number', 'date']
  },
  { 
    value: 'in', 
    label: 'En', 
    description: 'Valor en la lista',
    types: ['string', 'number']
  },
  { 
    value: 'notIn', 
    label: 'No en', 
    description: 'Valor no en la lista',
    types: ['string', 'number']
  },
  { 
    value: 'isNull', 
    label: 'Es nulo', 
    description: 'Campo es nulo',
    types: ['string', 'number', 'date']
  },
  { 
    value: 'isNotNull', 
    label: 'No es nulo', 
    description: 'Campo no es nulo',
    types: ['string', 'number', 'date']
  },
];

// Configuración de campos de búsqueda
export const SEARCH_FIELDS = [
  { 
    value: 'title', 
    label: 'Título', 
    type: 'string',
    searchable: true,
    filterable: true,
    sortable: true
  },
  { 
    value: 'description', 
    label: 'Descripción', 
    type: 'string',
    searchable: true,
    filterable: false,
    sortable: false
  },
  { 
    value: 'type', 
    label: 'Tipo', 
    type: 'string',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'category', 
    label: 'Categoría', 
    type: 'string',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'entityName', 
    label: 'Entidad', 
    type: 'string',
    searchable: true,
    filterable: true,
    sortable: true
  },
  { 
    value: 'value', 
    label: 'Valor', 
    type: 'number',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'status', 
    label: 'Estado', 
    type: 'string',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'severity', 
    label: 'Severidad', 
    type: 'string',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'priority', 
    label: 'Prioridad', 
    type: 'string',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'date', 
    label: 'Fecha', 
    type: 'date',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'lastUpdated', 
    label: 'Última Actualización', 
    type: 'date',
    searchable: false,
    filterable: true,
    sortable: true
  },
  { 
    value: 'tags', 
    label: 'Etiquetas', 
    type: 'string',
    searchable: true,
    filterable: true,
    sortable: false
  },
];

// Utilidades para búsqueda
export const SEARCH_UTILS = {
  formatSearchResult: (result: SearchResult): string => {
    return `${result.title} - ${result.description}`;
  },

  formatSearchValue: (value: any, type: string): string => {
    if (type === 'number') {
      return typeof value === 'number' ? value.toLocaleString('es-ES') : String(value);
    }
    if (type === 'date') {
      return new Date(value).toLocaleDateString('es-ES');
    }
    if (type === 'currency') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return String(value);
  },

  getSearchTypeIcon: (type: string): string => {
    const searchType = SEARCH_TYPES.find(t => t.value === type);
    return searchType?.icon || '🔍';
  },

  getSearchTypeColor: (type: string): string => {
    const searchType = SEARCH_TYPES.find(t => t.value === type);
    return searchType?.color || '#2196f3';
  },

  getCategoryIcon: (category: string): string => {
    const searchCategory = SEARCH_CATEGORIES.find(c => c.value === category);
    return searchCategory?.icon || '📁';
  },

  getCategoryColor: (category: string): string => {
    const searchCategory = SEARCH_CATEGORIES.find(c => c.value === category);
    return searchCategory?.color || '#2196f3';
  },

  getOperatorLabel: (operator: string): string => {
    const searchOperator = SEARCH_OPERATORS.find(o => o.value === operator);
    return searchOperator?.label || operator;
  },

  getFieldLabel: (field: string): string => {
    const searchField = SEARCH_FIELDS.find(f => f.value === field);
    return searchField?.label || field;
  },

  getFieldType: (field: string): string => {
    const searchField = SEARCH_FIELDS.find(f => f.value === field);
    return searchField?.type || 'string';
  },

  isFieldSearchable: (field: string): boolean => {
    const searchField = SEARCH_FIELDS.find(f => f.value === field);
    return searchField?.searchable || false;
  },

  isFieldFilterable: (field: string): boolean => {
    const searchField = SEARCH_FIELDS.find(f => f.value === field);
    return searchField?.filterable || false;
  },

  isFieldSortable: (field: string): boolean => {
    const searchField = SEARCH_FIELDS.find(f => f.value === field);
    return searchField?.sortable || false;
  },

  getRelevanceColor: (score: number): string => {
    if (score >= 0.8) return '#4caf50'; // Verde - Alta relevancia
    if (score >= 0.6) return '#ff9800'; // Naranja - Media relevancia
    if (score >= 0.4) return '#ff5722'; // Rojo - Baja relevancia
    return '#9e9e9e'; // Gris - Muy baja relevancia
  },

  getRelevanceLabel: (score: number): string => {
    if (score >= 0.8) return 'Alta relevancia';
    if (score >= 0.6) return 'Media relevancia';
    if (score >= 0.4) return 'Baja relevancia';
    return 'Muy baja relevancia';
  },

  formatExecutionTime: (time: number): string => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  },

  formatResultsCount: (count: number): string => {
    if (count === 0) return 'Sin resultados';
    if (count === 1) return '1 resultado';
    return `${count.toLocaleString('es-ES')} resultados`;
  },

  highlightText: (text: string, query: string): string => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  generateSearchId: (): string => {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  validateSearchQuery: (query: SearchQuery): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!query.query && query.filters.length === 0) {
      errors.push('Se requiere una consulta de búsqueda o al menos un filtro');
    }
    
    if (query.limit < 1 || query.limit > 1000) {
      errors.push('El límite debe estar entre 1 y 1000');
    }
    
    if (query.offset < 0) {
      errors.push('El offset debe ser mayor o igual a 0');
    }
    
    if (query.filters.some(f => !f.field || !f.operator)) {
      errors.push('Todos los filtros deben tener campo y operador definidos');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  buildSearchUrl: (query: SearchQuery): string => {
    const params = new URLSearchParams();
    params.set('q', query.query);
    params.set('limit', query.limit.toString());
    params.set('offset', query.offset.toString());
    params.set('sortBy', query.sortBy);
    params.set('sortOrder', query.sortOrder);
    
    if (query.filters.length > 0) {
      params.set('filters', JSON.stringify(query.filters));
    }
    
    if (query.timeRange) {
      params.set('timeRange', JSON.stringify(query.timeRange));
    }
    
    if (query.entityScope) {
      params.set('entityScope', JSON.stringify(query.entityScope));
    }
    
    return `/search?${params.toString()}`;
  },

  parseSearchUrl: (url: string): Partial<SearchQuery> => {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const query: Partial<SearchQuery> = {
      query: params.get('q') || '',
      limit: parseInt(params.get('limit') || '20'),
      offset: parseInt(params.get('offset') || '0'),
      sortBy: params.get('sortBy') || 'relevance',
      sortOrder: (params.get('sortOrder') as 'asc' | 'desc') || 'desc',
      filters: [],
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
    
    try {
      const filtersParam = params.get('filters');
      if (filtersParam) {
        query.filters = JSON.parse(filtersParam);
      }
      
      const timeRangeParam = params.get('timeRange');
      if (timeRangeParam) {
        query.timeRange = JSON.parse(timeRangeParam);
      }
      
      const entityScopeParam = params.get('entityScope');
      if (entityScopeParam) {
        query.entityScope = JSON.parse(entityScopeParam);
      }
    } catch (error) {
      console.error('Error parsing search URL:', error);
    }
    
    return query;
  },
};


