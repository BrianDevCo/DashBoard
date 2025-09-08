import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Compare,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ElectricBolt,
  AttachMoney,
  Speed,
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
  Download,
  Settings,
  FilterList,
  ViewModule,
  TableChart,
  BarChart,
  PieChart,
  MoreVert,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Schedule,
  Power,
  BatteryAlert,
  LocationOn,
  Business,
  Group,
  Timeline,
  EmojiEvents,
  Star,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setComparisons,
  setTrends,
  setRankings,
  setHeatmaps,
  setAnalyses,
  setComparisonFilter,
  setTrendFilter,
  setRankingFilter,
  setHeatmapFilter,
  setActiveTab,
  setViewMode,
  setLoading,
  setError,
} from '../store/slices/comparativeSlice';
import {
  useGetConsumptionComparisonsQuery,
  useGetTrendAnalysesQuery,
  useGetRankingsQuery,
  useGetHeatmapsQuery,
  useGetAnalysesQuery,
  useRefreshComparativeDataMutation,
  useExportComparativeDataMutation,
} from '../services/comparativeApi';
import ConsumptionComparisonComponent from '../components/ConsumptionComparison';
import ConsumerRankings from '../components/ConsumerRankings';
import ConsumptionHeatmap from '../components/ConsumptionHeatmap';
import { 
  COMPARISON_TYPES, 
  ENTITY_TYPES, 
  METRICS, 
  TREND_TYPES, 
  PERIODS 
} from '../types/comparative';

const ComparativeAnalysis: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    comparisons, 
    trends, 
    rankings, 
    heatmaps, 
    analyses,
    comparisonFilter,
    trendFilter,
    rankingFilter,
    heatmapFilter,
    activeTab,
    viewMode,
    loading,
    error
  } = useSelector((state: RootState) => state.comparative);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: comparisonsData, refetch: refetchComparisons } = useGetConsumptionComparisonsQuery(comparisonFilter);
  const { data: trendsData, refetch: refetchTrends } = useGetTrendAnalysesQuery(trendFilter);
  const { data: rankingsData, refetch: refetchRankings } = useGetRankingsQuery(rankingFilter);
  const { data: heatmapsData, refetch: refetchHeatmaps } = useGetHeatmapsQuery(heatmapFilter);
  const { data: analysesData, refetch: refetchAnalyses } = useGetAnalysesQuery();

  // Mutations
  const [refreshComparativeData] = useRefreshComparativeDataMutation();
  const [exportComparativeData] = useExportComparativeDataMutation();

  // Sincronizar datos con el store
  useEffect(() => {
    if (comparisonsData) dispatch(setComparisons(comparisonsData));
  }, [comparisonsData, dispatch]);

  useEffect(() => {
    if (trendsData) dispatch(setTrends(trendsData));
  }, [trendsData, dispatch]);

  useEffect(() => {
    if (rankingsData) dispatch(setRankings(rankingsData));
  }, [rankingsData, dispatch]);

  useEffect(() => {
    if (heatmapsData) dispatch(setHeatmaps(heatmapsData));
  }, [heatmapsData, dispatch]);

  useEffect(() => {
    if (analysesData) dispatch(setAnalyses(analysesData));
  }, [analysesData, dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshComparativeData({
        entityType: 'all',
        entityIds: [],
        period: 'month',
      }).unwrap();
      setSnackbar({ open: true, message: 'Datos comparativos actualizados exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar los datos comparativos' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (type: 'comparison' | 'trend' | 'ranking' | 'heatmap' | 'analysis') => {
    try {
      const blob = await exportComparativeData({
        format: 'excel',
        type,
        filters: type === 'comparison' ? comparisonFilter : 
                 type === 'trend' ? trendFilter :
                 type === 'ranking' ? rankingFilter :
                 type === 'heatmap' ? heatmapFilter : {},
      }).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analisis-comparativo-${type}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({ open: true, message: 'Datos exportados exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al exportar los datos' });
    }
  };

  const handleFilterChange = (filterType: string, newFilters: any) => {
    switch (filterType) {
      case 'comparison':
        dispatch(setComparisonFilter(newFilters));
        break;
      case 'trend':
        dispatch(setTrendFilter(newFilters));
        break;
      case 'ranking':
        dispatch(setRankingFilter(newFilters));
        break;
      case 'heatmap':
        dispatch(setHeatmapFilter(newFilters));
        break;
    }
  };

  const handleViewModeChange = (mode: 'table' | 'chart' | 'heatmap') => {
    dispatch(setViewMode(mode));
  };

  const getStats = () => {
    return {
      totalComparisons: comparisons.length,
      totalTrends: trends.length,
      totalRankings: rankings.length,
      totalHeatmaps: heatmaps.length,
      totalAnalyses: analyses.length,
    };
  };

  const stats = getStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Análisis Comparativo y Tendencias
      </Typography>

      {/* Resumen de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalComparisons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comparaciones
                  </Typography>
                </Box>
                <Compare color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {stats.totalTrends}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tendencias
                  </Typography>
                </Box>
                <Timeline color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.totalRankings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rankings
                  </Typography>
                </Box>
                <EmojiEvents color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.totalHeatmaps}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mapas de Calor
                  </Typography>
                </Box>
                <BarChart color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {stats.totalAnalyses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Análisis
                  </Typography>
                </Box>
                <PieChart color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error.main">
                    {stats.totalComparisons + stats.totalTrends + stats.totalRankings + stats.totalHeatmaps}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Datos
                  </Typography>
                </Box>
                <BarChart color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Controles del Análisis
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'contained' : 'outlined'}
              >
                Filtros
              </Button>
              <Button
                startIcon={<Settings />}
                onClick={() => setShowSettings(true)}
                variant="outlined"
              >
                Configuración
              </Button>
              <Button
                startIcon={<Refresh />}
                onClick={handleRefresh}
                variant="outlined"
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Button
                startIcon={<Download />}
                onClick={() => handleExport('analysis')}
                variant="outlined"
              >
                Exportar
              </Button>
            </Box>
          </Box>

          {/* Filtros */}
          {showFilters && (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Entidad</InputLabel>
                  <Select
                    value={comparisonFilter.entityType}
                    label="Tipo de Entidad"
                    onChange={(e) => handleFilterChange('comparison', { entityType: e.target.value })}
                  >
                    {ENTITY_TYPES.map(entity => (
                      <MenuItem key={entity.value} value={entity.value}>
                        {entity.icon} {entity.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Comparación</InputLabel>
                  <Select
                    value={comparisonFilter.periodType}
                    label="Tipo de Comparación"
                    onChange={(e) => handleFilterChange('comparison', { periodType: e.target.value })}
                  >
                    {COMPARISON_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Métrica</InputLabel>
                  <Select
                    value={trendFilter.metric}
                    label="Métrica"
                    onChange={(e) => handleFilterChange('trend', { metric: e.target.value })}
                  >
                    {METRICS.map(metric => (
                      <MenuItem key={metric.value} value={metric.value}>
                        {metric.icon} {metric.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={trendFilter.period}
                    label="Período"
                    onChange={(e) => handleFilterChange('trend', { period: e.target.value })}
                  >
                    {PERIODS.map(period => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Modo de vista */}
          <Box display="flex" gap={1} mt={2}>
            <Button
              startIcon={<TableChart />}
              onClick={() => handleViewModeChange('table')}
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
            >
              Tabla
            </Button>
            <Button
              startIcon={<BarChart />}
              onClick={() => handleViewModeChange('chart')}
              variant={viewMode === 'chart' ? 'contained' : 'outlined'}
            >
              Gráficos
            </Button>
            <Button
              startIcon={<BarChart />}
              onClick={() => handleViewModeChange('heatmap')}
              variant={viewMode === 'heatmap' ? 'contained' : 'outlined'}
            >
              Mapas de Calor
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Pestañas principales */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => dispatch(setActiveTab(newValue))}>
            <Tab icon={<Compare />} label="Comparaciones" />
            <Tab icon={<Timeline />} label="Tendencias" />
            <Tab icon={<EmojiEvents />} label="Rankings" />
            <Tab icon={<BarChart />} label="Mapas de Calor" />
            <Tab icon={<PieChart />} label="Análisis" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña de Comparaciones */}
          {activeTab === 0 && (
            <ConsumptionComparisonComponent
              comparisons={comparisons}
              loading={loading.comparisons}
              onRefresh={handleRefresh}
              onExport={() => handleExport('comparison')}
            />
          )}

          {/* Pestaña de Tendencias */}
          {activeTab === 1 && (
            <Box>
              <Alert severity="info">
                La funcionalidad de análisis de tendencias está en desarrollo. 
                Próximamente podrás ver tendencias lineales y de regresión para análisis predictivo.
              </Alert>
            </Box>
          )}

          {/* Pestaña de Rankings */}
          {activeTab === 2 && (
            <ConsumerRankings
              rankings={rankings}
              loading={loading.rankings}
              onRefresh={handleRefresh}
              onExport={() => handleExport('ranking')}
            />
          )}

          {/* Pestaña de Mapas de Calor */}
          {activeTab === 3 && (
            <ConsumptionHeatmap
              heatmaps={heatmaps}
              loading={loading.heatmaps}
              onRefresh={handleRefresh}
              onExport={() => handleExport('heatmap')}
            />
          )}

          {/* Pestaña de Análisis */}
          {activeTab === 4 && (
            <Box>
              <Alert severity="info">
                La funcionalidad de análisis avanzado está en desarrollo. 
                Próximamente podrás crear análisis personalizados con múltiples métricas.
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog de configuración */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configuración del Análisis Comparativo</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Configuración de Comparaciones
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo de Comparación</InputLabel>
                <Select
                  value={comparisonFilter.periodType}
                  label="Tipo de Comparación"
                  onChange={(e) => handleFilterChange('comparison', { periodType: e.target.value })}
                >
                  {COMPARISON_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Configuración de Tendencias
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo de Tendencia</InputLabel>
                <Select
                  value={trendFilter.trendType}
                  label="Tipo de Tendencia"
                  onChange={(e) => handleFilterChange('trend', { trendType: e.target.value })}
                >
                  {TREND_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ComparativeAnalysis;


