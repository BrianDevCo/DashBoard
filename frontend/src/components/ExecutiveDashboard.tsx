import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Refresh,
  Settings,
  FilterList,
  ViewModule,
  TableChart,
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
  Star,
  StarBorder,
  StarHalf,
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
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setKPIs,
  setAlerts,
  setTrends,
  setSummary,
  setInsights,
  setFilter,
  setViewMode,
  setShowAlerts,
  setShowInsights,
  setShowTrends,
  setLoading,
  setError,
} from '../store/slices/executiveSlice';
import {
  useGetExecutiveKPIsQuery,
  useGetExecutiveAlertsQuery,
  useGetExecutiveTrendsQuery,
  useGetExecutiveSummaryQuery,
  useGetExecutiveInsightsQuery,
  useGetExecutiveStatsQuery,
  useRefreshExecutiveDataMutation,
  useExportExecutiveDataMutation,
} from '../services/executiveApi';
import { 
  EXECUTIVE_KPI_TYPES, 
  EXECUTIVE_ALERT_TYPES, 
  EXECUTIVE_INSIGHT_TYPES, 
  EXECUTIVE_PERIODS,
  EXECUTIVE_UTILS 
} from '../types/executive';

const ExecutiveDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    kpis, 
    alerts, 
    trends, 
    summary, 
    insights,
    filter,
    viewMode,
    showAlerts,
    showInsights,
    showTrends,
    loading,
    error
  } = useSelector((state: RootState) => state.executive);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: kpisData, refetch: refetchKPIs } = useGetExecutiveKPIsQuery(filter);
  const { data: alertsData, refetch: refetchAlerts } = useGetExecutiveAlertsQuery(filter);
  const { data: trendsData, refetch: refetchTrends } = useGetExecutiveTrendsQuery(filter);
  const { data: summaryData, refetch: refetchSummary } = useGetExecutiveSummaryQuery(filter);
  const { data: insightsData, refetch: refetchInsights } = useGetExecutiveInsightsQuery(filter);
  const { data: statsData, refetch: refetchStats } = useGetExecutiveStatsQuery(filter);

  // Mutations
  const [refreshExecutiveData] = useRefreshExecutiveDataMutation();
  const [exportExecutiveData] = useExportExecutiveDataMutation();

  // Sincronizar datos con el store
  useEffect(() => {
    if (kpisData) dispatch(setKPIs(kpisData));
  }, [kpisData, dispatch]);

  useEffect(() => {
    if (alertsData) dispatch(setAlerts(alertsData));
  }, [alertsData, dispatch]);

  useEffect(() => {
    if (trendsData) dispatch(setTrends(trendsData));
  }, [trendsData, dispatch]);

  useEffect(() => {
    if (summaryData) dispatch(setSummary(summaryData));
  }, [summaryData, dispatch]);

  useEffect(() => {
    if (insightsData) dispatch(setInsights(insightsData));
  }, [insightsData, dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshExecutiveData(filter).unwrap();
      setSnackbar({ open: true, message: 'Dashboard ejecutivo actualizado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar el dashboard ejecutivo' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'html') => {
    try {
      const blob = await exportExecutiveData({
        format,
        type: 'all',
        filter,
      }).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-ejecutivo-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({ open: true, message: 'Dashboard exportado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al exportar el dashboard' });
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    dispatch(setFilter({ period: period as any }));
  };

  const getKPIIcon = (kpiId: string) => {
    const kpiType = EXECUTIVE_KPI_TYPES.find(k => k.id === kpiId);
    return kpiType?.icon || '📊';
  };

  const getKPIColor = (kpiId: string) => {
    const kpiType = EXECUTIVE_KPI_TYPES.find(k => k.id === kpiId);
    return kpiType?.color || '#2196f3';
  };

  const getAlertIcon = (type: string) => {
    const alertType = EXECUTIVE_ALERT_TYPES.find(a => a.value === type);
    return alertType?.icon || '⚠️';
  };

  const getAlertColor = (type: string) => {
    const alertType = EXECUTIVE_ALERT_TYPES.find(a => a.value === type);
    return alertType?.color || '#ff9800';
  };

  const getInsightIcon = (type: string) => {
    const insightType = EXECUTIVE_INSIGHT_TYPES.find(i => i.value === type);
    return insightType?.icon || '💡';
  };

  const getInsightColor = (type: string) => {
    const insightType = EXECUTIVE_INSIGHT_TYPES.find(i => i.value === type);
    return insightType?.color || '#00bcd4';
  };

  const getPeriodLabel = (period: string) => {
    const periodConfig = EXECUTIVE_PERIODS.find(p => p.value === period);
    return periodConfig?.label || period;
  };

  const getStats = () => {
    return {
      totalKPIs: kpis.length,
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter(a => a.status === 'active').length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
      totalInsights: insights.length,
      highPriorityInsights: insights.filter(i => i.priority === 'high' || i.priority === 'urgent').length,
      totalTrends: trends.length,
    };
  };

  const stats = getStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Ejecutivo
      </Typography>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Resumen Ejecutivo - {getPeriodLabel(selectedPeriod)}
            </Typography>
            <Box display="flex" gap={1}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={selectedPeriod}
                  label="Período"
                  onChange={(e) => handlePeriodChange(e.target.value)}
                >
                  {EXECUTIVE_PERIODS.map(period => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <IconButton onClick={handleRefresh} disabled={isRefreshing}>
                <Refresh />
              </IconButton>
              <IconButton onClick={() => handleExport('pdf')}>
                <Download />
              </IconButton>
            </Box>
          </Box>

          {/* Filtros */}
          {showFilters && (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Entidad</InputLabel>
                  <Select
                    value={filter.entityType}
                    label="Tipo de Entidad"
                    onChange={(e) => dispatch(setFilter({ entityType: e.target.value as any }))}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="site">Sitios</MenuItem>
                    <MenuItem value="client">Clientes</MenuItem>
                    <MenuItem value="group">Grupos</MenuItem>
                    <MenuItem value="meter">Medidores</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Métricas</InputLabel>
                  <Select
                    multiple
                    value={filter.metrics}
                    label="Métricas"
                    onChange={(e) => dispatch(setFilter({ metrics: e.target.value as string[] }))}
                  >
                    <MenuItem value="consumption">Consumo</MenuItem>
                    <MenuItem value="cost">Costo</MenuItem>
                    <MenuItem value="efficiency">Eficiencia</MenuItem>
                    <MenuItem value="peakDemand">Demanda Máxima</MenuItem>
                    <MenuItem value="powerFactor">Factor de Potencia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Severidad de Alertas</InputLabel>
                  <Select
                    value={filter.alertSeverity}
                    label="Severidad de Alertas"
                    onChange={(e) => dispatch(setFilter({ alertSeverity: e.target.value as any }))}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="critical">Crítica</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Prioridad de Insights</InputLabel>
                  <Select
                    value={filter.insightPriority}
                    label="Prioridad de Insights"
                    onChange={(e) => dispatch(setFilter({ insightPriority: e.target.value as any }))}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="urgent">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Modo de vista */}
          <Box display="flex" gap={1} mt={2}>
            <Button
              startIcon={<ViewModule />}
              onClick={() => dispatch(setViewMode('grid'))}
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            >
              Cuadrícula
            </Button>
            <Button
              startIcon={<TableChart />}
              onClick={() => dispatch(setViewMode('list'))}
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
            >
              Lista
            </Button>
            <Button
              startIcon={<Timeline />}
              onClick={() => dispatch(setViewMode('compact'))}
              variant={viewMode === 'compact' ? 'contained' : 'outlined'}
            >
              Compacto
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Estadísticas resumen */}
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
                    KPIs
                  </Typography>
                </Box>
                <Assessment color="primary" sx={{ fontSize: 40 }} />
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
                    {stats.activeAlerts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alertas Activas
                  </Typography>
                </Box>
                <Warning color="error" sx={{ fontSize: 40 }} />
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
                    {stats.criticalAlerts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Críticas
                  </Typography>
                </Box>
                <Error color="warning" sx={{ fontSize: 40 }} />
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
                    {stats.totalInsights}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Insights
                  </Typography>
                </Box>
                <Lightbulb color="info" sx={{ fontSize: 40 }} />
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
                    {stats.highPriorityInsights}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alta Prioridad
                  </Typography>
                </Box>
                <Star color="success" sx={{ fontSize: 40 }} />
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
                    {stats.totalTrends}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tendencias
                  </Typography>
                </Box>
                <Timeline color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* KPIs principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={kpi.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: getKPIColor(kpi.id), width: 40, height: 40 }}>
                    {getKPIIcon(kpi.id)}
                  </Avatar>
                  <Chip
                    label={EXECUTIVE_UTILS.getStatusIcon(kpi.status)}
                    color={EXECUTIVE_UTILS.getStatusColor(kpi.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {EXECUTIVE_UTILS.formatValue(kpi.value, kpi.unit)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {kpi.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    {EXECUTIVE_UTILS.formatChange(kpi.change)}
                  </Typography>
                  <Chip
                    label={EXECUTIVE_UTILS.getChangeIcon(kpi.changeType)}
                    size="small"
                    color={EXECUTIVE_UTILS.getChangeColor(kpi.change, kpi.changeType) as any}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {kpi.period}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alertas destacadas */}
      {showAlerts && alerts.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Alertas Destacadas"
            action={
              <IconButton onClick={() => dispatch(setShowAlerts(!showAlerts))}>
                {showAlerts ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              {alerts.slice(0, 6).map((alert) => (
                <Grid item xs={12} sm={6} md={4} key={alert.id}>
                  <Alert
                    severity={EXECUTIVE_UTILS.getSeverityColor(alert.severity) as any}
                    icon={getAlertIcon(alert.type)}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                          // Implementar acción de alerta
                        }}
                      >
                        Ver
                      </Button>
                    }
                  >
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                    <Typography variant="caption" display="block">
                      {alert.entityName} • {EXECUTIVE_UTILS.getRelativeTime(alert.createdAt)}
                    </Typography>
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Insights destacados */}
      {showInsights && insights.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Insights y Recomendaciones"
            action={
              <IconButton onClick={() => dispatch(setShowInsights(!showInsights))}>
                {showInsights ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              {insights.slice(0, 6).map((insight) => (
                <Grid item xs={12} sm={6} md={4} key={insight.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Avatar sx={{ bgcolor: getInsightColor(insight.type), width: 32, height: 32 }}>
                          {getInsightIcon(insight.type)}
                        </Avatar>
                        <Typography variant="h6" noWrap>
                          {insight.title}
                        </Typography>
                        <Chip
                          label={EXECUTIVE_UTILS.getPriorityIcon(insight.priority)}
                          color={EXECUTIVE_UTILS.getPriorityColor(insight.priority) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {insight.description}
                      </Typography>
                      {insight.recommendation && (
                        <Typography variant="caption" color="primary">
                          {insight.recommendation}
                        </Typography>
                      )}
                      {insight.estimatedSavings && (
                        <Typography variant="caption" color="success.main" display="block">
                          Ahorro estimado: {EXECUTIVE_UTILS.formatValue(insight.estimatedSavings, insight.currency || 'COP')}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tendencias principales */}
      {showTrends && trends.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Tendencias Principales"
            action={
              <IconButton onClick={() => dispatch(setShowTrends(!showTrends))}>
                {showTrends ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              {trends.slice(0, 4).map((trend) => (
                <Grid item xs={12} sm={6} md={3} key={trend.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {trend.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {trend.period}
                      </Typography>
                      {trend.comparison && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {EXECUTIVE_UTILS.formatChange(trend.comparison.change)}
                          </Typography>
                          <Chip
                            label={EXECUTIVE_UTILS.getChangeIcon(trend.comparison.changeType)}
                            size="small"
                            color={EXECUTIVE_UTILS.getChangeColor(trend.comparison.change, trend.comparison.changeType) as any}
                          />
                        </Box>
                      )}
                      {trend.insights && trend.insights.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary">
                            Insights:
                          </Typography>
                          {trend.insights.slice(0, 2).map((insight, index) => (
                            <Typography key={index} variant="caption" display="block">
                              • {insight.description}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Resumen ejecutivo */}
      {summary && (
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Resumen Ejecutivo" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Consumo Total
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h4" color="primary">
                    {EXECUTIVE_UTILS.formatValue(summary.totalConsumption.current, summary.totalConsumption.unit)}
                  </Typography>
                  <Chip
                    label={EXECUTIVE_UTILS.formatChange(summary.totalConsumption.change)}
                    color={EXECUTIVE_UTILS.getChangeColor(summary.totalConsumption.change, summary.totalConsumption.changeType) as any}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  vs {EXECUTIVE_UTILS.formatValue(summary.totalConsumption.previous, summary.totalConsumption.unit)} período anterior
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Costo Total
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h4" color="primary">
                    {EXECUTIVE_UTILS.formatValue(summary.totalCost.current, summary.totalCost.currency)}
                  </Typography>
                  <Chip
                    label={EXECUTIVE_UTILS.formatChange(summary.totalCost.change)}
                    color={EXECUTIVE_UTILS.getChangeColor(summary.totalCost.change, summary.totalCost.changeType) as any}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  vs {EXECUTIVE_UTILS.formatValue(summary.totalCost.previous, summary.totalCost.currency)} período anterior
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Eficiencia
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h4" color="primary">
                    {EXECUTIVE_UTILS.formatValue(summary.efficiency.current, summary.efficiency.unit)}
                  </Typography>
                  <Chip
                    label={EXECUTIVE_UTILS.formatChange(summary.efficiency.change)}
                    color={EXECUTIVE_UTILS.getChangeColor(summary.efficiency.change, summary.efficiency.changeType) as any}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  vs {EXECUTIVE_UTILS.formatValue(summary.efficiency.previous, summary.efficiency.unit)} período anterior
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Demanda Máxima
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h4" color="primary">
                    {EXECUTIVE_UTILS.formatValue(summary.peakDemand.current, summary.peakDemand.unit)}
                  </Typography>
                  <Chip
                    label={EXECUTIVE_UTILS.formatChange(summary.peakDemand.change)}
                    color={EXECUTIVE_UTILS.getChangeColor(summary.peakDemand.change, summary.peakDemand.changeType) as any}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Registrada a las {summary.peakDemand.time}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Dialog de configuración */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configuración del Dashboard Ejecutivo</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Visualización
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAlerts}
                    onChange={(e) => dispatch(setShowAlerts(e.target.checked))}
                  />
                }
                label="Mostrar alertas"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showInsights}
                    onChange={(e) => dispatch(setShowInsights(e.target.checked))}
                  />
                }
                label="Mostrar insights"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showTrends}
                    onChange={(e) => dispatch(setShowTrends(e.target.checked))}
                  />
                }
                label="Mostrar tendencias"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Actualización
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={true}
                    onChange={() => {}}
                  />
                }
                label="Actualización automática"
              />
              <TextField
                fullWidth
                label="Intervalo de actualización (segundos)"
                type="number"
                value={30}
                sx={{ mt: 2 }}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      {snackbar.open && (
        <Alert
          severity="success"
          onClose={() => setSnackbar({ open: false, message: '' })}
          sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default ExecutiveDashboard;
