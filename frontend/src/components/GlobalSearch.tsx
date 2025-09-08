import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Chip,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  CircularProgress,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  History,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  CheckCircle,
  Error,
  Warning,
  Info,
  ElectricBolt,
  AttachMoney,
  Speed,
  Power,
  Lightbulb,
  Schedule,
  Email,
  Notifications,
  Assessment,
  BarChart,
  PieChart,
  Timeline,
  MoreVert,
  Visibility,
  VisibilityOff,
  Download,
  Share,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  LocationOn,
  Business,
  Group,
  Timer,
  CalendarToday,
  AccessTime,
  Thermostat,
  WbSunny,
  Cloud,
  Thunderstorm,
  BatteryChargingFull,
  BatteryAlert,
  BatteryUnknown,
  Compare,
  Timeline as TimelineIcon,
  EmojiEvents,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setCurrentQuery,
  setCurrentResults,
  setSuggestions,
  setAutocompleteResults,
  addRecentSearch,
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
} from '../store/slices/searchSlice';
import {
  useSearchQuery,
  useGetSuggestionsQuery,
  useGetAutocompleteQuery,
  useGetSearchHistoryQuery,
  useGetSavedFiltersQuery,
  useExportSearchResultsMutation,
} from '../services/searchApi';
import { 
  SEARCH_TYPES, 
  SEARCH_CATEGORIES, 
  SEARCH_OPERATORS, 
  SEARCH_FIELDS,
  SEARCH_UTILS 
} from '../types/search';

const GlobalSearch: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    currentQuery,
    currentResults,
    suggestions,
    autocompleteResults,
    recentSearches,
    searchHistory,
    savedFilters,
    searchMode,
    viewMode,
    sortBy,
    sortOrder,
    limit,
    page,
    showInactive,
    showArchived,
    highlightResults,
    showFacets,
    showAggregations,
    showRelated,
    showSuggestions,
    loading,
    error
  } = useSelector((state: RootState) => state.search);
  
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [localSortBy, setLocalSortBy] = useState('relevance');
  const [localSortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>('desc');
  const [localLimit, setLocalLimit] = useState(20);
  const [localPage, setLocalPage] = useState(1);
  const [localShowInactive, setLocalShowInactive] = useState(false);
  const [localShowArchived, setLocalShowArchived] = useState(false);
  const [localHighlightResults, setLocalHighlightResults] = useState(true);
  const [localShowFacets, setLocalShowFacets] = useState(true);
  const [localShowAggregations, setLocalShowAggregations] = useState(true);
  const [localShowRelated, setLocalShowRelated] = useState(true);
  const [localShowSuggestions, setLocalShowSuggestions] = useState(true);

  // Queries
  const { data: searchData, refetch: refetchSearch } = useSearchQuery(currentQuery);
  const { data: suggestionsData, refetch: refetchSuggestions } = useGetSuggestionsQuery({ 
    query: searchValue, 
    limit: 10 
  });
  const { data: autocompleteData, refetch: refetchAutocomplete } = useGetAutocompleteQuery({ 
    query: searchValue, 
    limit: 5 
  });
  const { data: historyData, refetch: refetchHistory } = useGetSearchHistoryQuery({ 
    limit: 20, 
    offset: 0 
  });
  const { data: savedFiltersData, refetch: refetchSavedFilters } = useGetSavedFiltersQuery();

  // Mutations
  const [exportSearchResults] = useExportSearchResultsMutation();

  // Sincronizar datos con el store
  useEffect(() => {
    if (searchData) {
      dispatch(setCurrentResults(searchData.results));
    }
  }, [searchData, dispatch]);

  useEffect(() => {
    if (suggestionsData) {
      dispatch(setSuggestions(suggestionsData));
    }
  }, [suggestionsData, dispatch]);

  useEffect(() => {
    if (autocompleteData) {
      dispatch(setAutocompleteResults(autocompleteData));
    }
  }, [autocompleteData, dispatch]);

  useEffect(() => {
    if (historyData) {
      // dispatch(setSearchHistory(historyData));
    }
  }, [historyData, dispatch]);

  useEffect(() => {
    if (savedFiltersData) {
      // dispatch(setSavedFilters(savedFiltersData));
    }
  }, [savedFiltersData, dispatch]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    dispatch(setLoading({ search: true }));
    dispatch(setError({ search: null }));
    
    try {
      const query = {
        ...currentQuery,
        query: searchValue,
        filters: selectedFilters.map(filterId => {
          const filter = savedFilters.find(f => f.id === filterId);
          return filter ? filter.filters : [];
        }).flat(),
        sortBy,
        sortOrder,
        limit,
        offset: (page - 1) * limit,
        includeInactive: showInactive,
        includeArchived: showArchived,
        highlight: highlightResults,
        facets: showFacets,
        aggregations: showAggregations,
        related: showRelated,
        suggestions: showSuggestions,
      };
      
      dispatch(setCurrentQuery(query));
      await refetchSearch();
      dispatch(addRecentSearch(searchValue));
      setShowSuggestions(false);
    } catch (error) {
      dispatch(setError({ search: 'Error al realizar la búsqueda' }));
    } finally {
      dispatch(setLoading({ search: false }));
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchValue(suggestion.text);
    setShowSuggestions(false);
    handleSearch();
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    try {
      const blob = await exportSearchResults({
        format,
        query: currentQuery,
      }).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `busqueda-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const getSearchTypeIcon = (type: string) => {
    const searchType = SEARCH_TYPES.find(t => t.value === type);
    return searchType?.icon || '🔍';
  };

  const getSearchTypeColor = (type: string) => {
    const searchType = SEARCH_TYPES.find(t => t.value === type);
    return searchType?.color || '#2196f3';
  };

  const getCategoryIcon = (category: string) => {
    const searchCategory = SEARCH_CATEGORIES.find(c => c.value === category);
    return searchCategory?.icon || '📁';
  };

  const getCategoryColor = (category: string) => {
    const searchCategory = SEARCH_CATEGORIES.find(c => c.value === category);
    return searchCategory?.color || '#2196f3';
  };

  return (
    <Box>
      {/* Barra de búsqueda principal */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Buscar en todo el sistema..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setShowSuggestions(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchValue('')}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading.search || !searchValue.trim()}
            startIcon={loading.search ? <CircularProgress size={20} /> : <Search />}
          >
            Buscar
          </Button>
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <FilterList />
          </IconButton>
          <IconButton onClick={() => setShowHistory(!showHistory)}>
            <History />
          </IconButton>
          <IconButton onClick={() => setShowSavedFilters(!showSavedFilters)}>
            <Star />
          </IconButton>
        </Box>

        {/* Sugerencias */}
        <Collapse in={showSuggestions && (suggestions.length > 0 || autocompleteResults.length > 0)}>
          <Paper sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: getSearchTypeColor(suggestion.type), width: 32, height: 32 }}>
                      {getSearchTypeIcon(suggestion.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.text}
                    secondary={suggestion.category}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={SEARCH_UTILS.formatSearchValue(suggestion.value, suggestion.type)}
                      size="small"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Collapse>
      </Paper>

      {/* Filtros avanzados */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros Avanzados
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categorías</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={(e) => setSelectedCategories(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {SEARCH_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{category.icon}</span>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipos</InputLabel>
                <Select
                  multiple
                  value={selectedTypes}
                  onChange={(e) => setSelectedTypes(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {SEARCH_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{type.icon}</span>
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="relevance">Relevancia</MenuItem>
                  <MenuItem value="title">Título</MenuItem>
                  <MenuItem value="date">Fecha</MenuItem>
                  <MenuItem value="value">Valor</MenuItem>
                  <MenuItem value="type">Tipo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Orden</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="desc">Descendente</MenuItem>
                  <MenuItem value="asc">Ascendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Resultados de búsqueda */}
      {currentResults.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {SEARCH_UTILS.formatResultsCount(currentResults.length)} encontrados
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<Download />}
                onClick={() => handleExport('pdf')}
                variant="outlined"
              >
                Exportar PDF
              </Button>
              <Button
                startIcon={<Download />}
                onClick={() => handleExport('excel')}
                variant="outlined"
              >
                Exportar Excel
              </Button>
              <Button
                startIcon={<Download />}
                onClick={() => handleExport('csv')}
                variant="outlined"
              >
                Exportar CSV
              </Button>
            </Box>
          </Box>

          <List>
            {currentResults.map((result, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: getSearchTypeColor(result.type), width: 40, height: 40 }}>
                    {getSearchTypeIcon(result.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={result.title}
                  secondary={result.description}
                />
                <ListItemSecondaryAction>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Chip
                      label={result.type}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={result.category}
                      size="small"
                      color="secondary"
                    />
                    {result.value && (
                      <Chip
                        label={SEARCH_UTILS.formatSearchValue(result.value, result.type)}
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Sin resultados */}
      {currentResults.length === 0 && searchValue && !loading.search && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron resultados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otros términos de búsqueda o ajusta los filtros
          </Typography>
        </Paper>
      )}

      {/* Error */}
      {error.search && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.search}
        </Alert>
      )}
    </Box>
  );
};

export default GlobalSearch;
