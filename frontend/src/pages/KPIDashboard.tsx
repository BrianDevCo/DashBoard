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
} from '@mui/material';
import {
  Dashboard,
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
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setKPICards,
  setKPISummary,
  setKPITrend,
  setConsumptionBySite,
  setConsumptionByClient,
  setConsumptionByGroup,
  setPeakDemandRecords,
  setReactiveEnergyRatios,
  setFilters,
  setRefreshInterval,
  setAutoRefresh,
  setViewMode,
  setLoading,
  setError,
} from '../store/slices/kpisSlice';
import {
  useGetKPICardsQuery,
  useGetKPISummaryQuery,
  useGetKPITrendQuery,
  useGetConsumptionBySiteQuery,
  useGetConsumptionByClientQuery,
  useGetConsumptionByGroupQuery,
  useGetPeakDemandRecordsQuery,
  useGetReactiveEnergyRatiosQuery,
  useRefreshKPIsMutation,
  useExportKPIsMutation,
} from '../services/kpisApi';
import KPICard from '../components/KPICard';
import ConsumptionByCategory from '../components/ConsumptionByCategory';
import PeakDemandRecords from '../components/PeakDemandRecords';
import ReactiveEnergyRatio from '../components/ReactiveEnergyRatio';
import { KPIFilter, KPI_PERIODS, KPI_AGGREGATION } from '../types/kpis';

const KPIDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    kpiCards, 
    kpiSummary, 
    kpiTrend, 
    consumptionBySite, 
    consumptionByClient, 
    consumptionByGroup, 
    peakDemandRecords, 
    reactiveEnergyRatios,
    filters,
    refreshInterval,
    autoRefresh,
    viewMode,
    loading,
    error
  } = useSelector((state: RootState) => state.kpis);
  
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: kpiCardsData, refetch: refetchKPICards } = useGetKPICardsQuery(filters);
  const { data: kpiSummaryData, refetch: refetchKPISummary } = useGetKPISummaryQuery(filters);
  const { data: kpiTrendData, refetch: refetchKPITrend } = useGetKPITrendQuery(filters);
  const { data: consumptionBySiteData, refetch: refetchConsumptionBySite } = useGetConsumptionBySiteQuery(filters);
  const { data: consumptionByClientData, refetch: refetchConsumptionByClient } = useGetConsumptionByClientQuery(filters);
  const { data: consumptionByGroupData, refetch: refetchConsumptionByGroup } = useGetConsumptionByGroupQuery(filters);
  const { data: peakDemandRecordsData, refetch: refetchPeakDemandRecords } = useGetPeakDemandRecordsQuery({
    startDate: filters.startDate,
    endDate: filters.endDate,
    limit: 100,
  });
  const { data: reactiveEnergyRatiosData, refetch: refetchReactiveEnergyRatios } = useGetReactiveEnergyRatiosQuery({
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  // Mutations
  const [refreshKPIs] = useRefreshKPIsMutation();
  const [exportKPIs] = useExportKPIsMutation();

  // Sincronizar datos con el store
  // Sincronizar datos con el store (solo una vez al montar)
  useEffect(() => {
    if (kpiCardsData) dispatch(setKPICards(kpiCardsData));
    if (kpiSummaryData) dispatch(setKPISummary(kpiSummaryData));
    if (kpiTrendData) dispatch(setKPITrend(kpiTrendData));
    if (consumptionBySiteData) dispatch(setConsumptionBySite(consumptionBySiteData));
    if (consumptionByClientData) dispatch(setConsumptionByClient(consumptionByClientData));
    if (consumptionByGroupData) dispatch(setConsumptionByGroup(consumptionByGroupData));
    if (peakDemandRecordsData) dispatch(setPeakDemandRecords(peakDemandRecordsData));
    if (reactiveEnergyRatiosData) dispatch(setReactiveEnergyRatios(reactiveEnergyRatiosData));
  }, [dispatch]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshKPIs(filters).unwrap();
      setSnackbar({ open: true, message: 'KPIs actualizados exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar los KPIs' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportKPIs({
        format: 'excel',
        filters,
        metrics: kpiCards.map(card => card.id),
      }).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kpis-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({ open: true, message: 'KPIs exportados exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al exportar los KPIs' });
    }
  };

  const handleFilterChange = (newFilters: Partial<KPIFilter>) => {
    dispatch(setFilters(newFilters));
  };

  const handleViewModeChange = (mode: 'cards' | 'table' | 'chart') => {
    dispatch(setViewMode(mode));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ element: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const getStats = () => {
    return {
      totalKPIs: kpiCards.length,
      totalSites: consumptionBySite.length,
      totalClients: consumptionByClient.length,
      totalGroups: consumptionByGroup.length,
      totalPeakRecords: peakDemandRecords.length,
      totalReactiveRatios: reactiveEnergyRatios.length,
    };
  };

  const stats = getStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard de KPIs
      </Typography>

      {/* Resumen de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalKPIs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    KPIs Activos
                  </Typography>
                </Box>
                <Dashboard color="primary" sx={{ fontSize: 40 }} />
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
                    {stats.totalSites}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sitios
                  </Typography>
                </Box>
                <LocationOn color="success" sx={{ fontSize: 40 }} />
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
                    {stats.totalClients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clientes
                  </Typography>
                </Box>
                <Business color="info" sx={{ fontSize: 40 }} />
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
                    {stats.totalGroups}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Grupos
                  </Typography>
                </Box>
                <Group color="warning" sx={{ fontSize: 40 }} />
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
                    {stats.totalPeakRecords}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registros de Pico
                  </Typography>
                </Box>
                <TrendingUp color="secondary" sx={{ fontSize: 40 }} />
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
                    {stats.totalReactiveRatios}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Análisis Reactivo
                  </Typography>
                </Box>
                <BatteryAlert color="error" sx={{ fontSize: 40 }} />
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
              Controles del Dashboard
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
                onClick={handleExport}
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
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={filters.period}
                    label="Período"
                    onChange={(e) => handleFilterChange({ period: e.target.value as any })}
                  >
                    {KPI_PERIODS.map(period => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Agregación</InputLabel>
                  <Select
                    value={filters.aggregation}
                    label="Agregación"
                    onChange={(e) => handleFilterChange({ aggregation: e.target.value as any })}
                  >
                    {KPI_AGGREGATION.map(agg => (
                      <MenuItem key={agg.value} value={agg.value}>
                        {agg.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fecha Inicio"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fecha Fin"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}

          {/* Modo de vista */}
          <Box display="flex" gap={1} mt={2}>
            <Button
              startIcon={<ViewModule />}
              onClick={() => handleViewModeChange('cards')}
              variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            >
              Tarjetas
            </Button>
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
          </Box>
        </CardContent>
      </Card>

      {/* Pestañas principales */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<Dashboard />} label="KPIs Principales" />
            <Tab icon={<LocationOn />} label="Consumo por Sitio" />
            <Tab icon={<Business />} label="Consumo por Cliente" />
            <Tab icon={<Group />} label="Consumo por Grupo" />
            <Tab icon={<TrendingUp />} label="Demanda Máxima" />
            <Tab icon={<BatteryAlert />} label="Energía Reactiva" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña de KPIs Principales */}
          {activeTab === 0 && (
            <Box>
              {viewMode === 'cards' ? (
                <Grid container spacing={3}>
                  {kpiCards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                      <KPICard
                        kpi={card}
                        onRefresh={handleRefresh}
                        loading={loading.kpis}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  Vista de tabla y gráficos en desarrollo para KPIs principales.
                </Alert>
              )}
            </Box>
          )}

          {/* Pestaña de Consumo por Sitio */}
          {activeTab === 1 && (
            <ConsumptionByCategory
              data={consumptionBySite}
              type="site"
              loading={loading.consumption}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          )}

          {/* Pestaña de Consumo por Cliente */}
          {activeTab === 2 && (
            <ConsumptionByCategory
              data={consumptionByClient}
              type="client"
              loading={loading.consumption}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          )}

          {/* Pestaña de Consumo por Grupo */}
          {activeTab === 3 && (
            <ConsumptionByCategory
              data={consumptionByGroup}
              type="group"
              loading={loading.consumption}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          )}

          {/* Pestaña de Demanda Máxima */}
          {activeTab === 4 && (
            <PeakDemandRecords
              records={peakDemandRecords}
              loading={loading.peakDemand}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          )}

          {/* Pestaña de Energía Reactiva */}
          {activeTab === 5 && (
            <ReactiveEnergyRatio
              data={reactiveEnergyRatios}
              loading={loading.reactiveEnergy}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog de configuración */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configuración del Dashboard</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Actualización Automática
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => dispatch(setAutoRefresh(e.target.checked))}
                  />
                }
                label="Habilitar actualización automática"
              />
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Intervalo de actualización: {refreshInterval / 1000} segundos
                </Typography>
                <Slider
                  value={refreshInterval / 1000}
                  onChange={(_, value) => dispatch(setRefreshInterval((value as number) * 1000))}
                  min={10}
                  max={300}
                  step={10}
                  marks={[
                    { value: 10, label: '10s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '1m' },
                    { value: 300, label: '5m' },
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Configuración de Visualización
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Modo de Vista</InputLabel>
                <Select
                  value={viewMode}
                  label="Modo de Vista"
                  onChange={(e) => handleViewModeChange(e.target.value as any)}
                >
                  <MenuItem value="cards">Tarjetas</MenuItem>
                  <MenuItem value="table">Tabla</MenuItem>
                  <MenuItem value="chart">Gráficos</MenuItem>
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

export default KPIDashboard;


