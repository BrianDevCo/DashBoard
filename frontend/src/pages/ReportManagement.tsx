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
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Description,
  Schedule,
  History,
  Assessment,
  Add,
  Refresh,
  Download,
  Settings,
  FilterList,
  ViewModule,
  TableChart,
  MoreVert,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  Stop,
  Email,
  Person,
  Group,
  CheckCircle,
  Error,
  Warning,
  Info,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Timer,
  CalendarToday,
  AccessTime,
  LocationOn,
  Business,
  Group as GroupIcon,
  ElectricBolt,
  AttachMoney,
  Speed,
  Power,
  BarChart,
  PieChart,
  Image,
  Code,
  Public,
  Lock,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setTemplates,
  setScheduledReports,
  setGeneratedReports,
  setReportHistory,
  setAnalytics,
  setActiveTab,
  setViewMode,
  setLoading,
  setError,
} from '../store/slices/reportsSlice';
import {
  useGetTemplatesQuery,
  useGetScheduledReportsQuery,
  useGetGeneratedReportsQuery,
  useGetReportHistoryQuery,
  useGetReportAnalyticsQuery,
  useGetReportStatsQuery,
  useGenerateReportMutation,
  useDownloadReportMutation,
  useRunScheduledReportMutation,
  useToggleScheduledReportMutation,
} from '../services/reportsApi';
import ReportTemplates from '../components/ReportTemplates';
import ScheduledReports from '../components/ScheduledReports';
import { 
  REPORT_CATEGORIES, 
  REPORT_TYPES, 
  REPORT_FORMATS, 
  SCHEDULE_TYPES,
  REPORT_UTILS 
} from '../types/reports';

const ReportManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    templates, 
    scheduledReports, 
    generatedReports, 
    reportHistory, 
    analytics,
    activeTab,
    viewMode,
    loading,
    error
  } = useSelector((state: RootState) => state.reports);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: templatesData, refetch: refetchTemplates } = useGetTemplatesQuery();
  const { data: scheduledReportsData, refetch: refetchScheduledReports } = useGetScheduledReportsQuery();
  const { data: generatedReportsData, refetch: refetchGeneratedReports } = useGetGeneratedReportsQuery({});
  const { data: reportHistoryData, refetch: refetchReportHistory } = useGetReportHistoryQuery({});
  const { data: analyticsData, refetch: refetchAnalytics } = useGetReportAnalyticsQuery({});
  const { data: statsData, refetch: refetchStats } = useGetReportStatsQuery();

  // Mutations
  const [generateReport] = useGenerateReportMutation();
  const [downloadReport] = useDownloadReportMutation();
  const [runScheduledReport] = useRunScheduledReportMutation();
  const [toggleScheduledReport] = useToggleScheduledReportMutation();

  // Sincronizar datos con el store
  // Sincronizar datos con el store (solo una vez al montar)
  useEffect(() => {
    if (templatesData) dispatch(setTemplates(templatesData));
    if (scheduledReportsData) dispatch(setScheduledReports(scheduledReportsData));
    if (generatedReportsData) dispatch(setGeneratedReports(generatedReportsData));
    if (reportHistoryData) dispatch(setReportHistory(reportHistoryData));
    if (analyticsData) dispatch(setAnalytics(analyticsData));
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchTemplates(),
        refetchScheduledReports(),
        refetchGeneratedReports(),
        refetchReportHistory(),
        refetchAnalytics(),
        refetchStats(),
      ]);
      setSnackbar({ open: true, message: 'Datos de reportes actualizados exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar los datos de reportes' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateReport = async (templateId: string, filters: any, format: string) => {
    try {
      const result = await generateReport({
        templateId,
        filters,
        format,
      }).unwrap();
      setSnackbar({ open: true, message: 'Reporte generado exitosamente' });
      return result;
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al generar el reporte' });
      throw error;
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const blob = await downloadReport(reportId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSnackbar({ open: true, message: 'Reporte descargado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al descargar el reporte' });
    }
  };

  const handleRunScheduledReport = async (reportId: string) => {
    try {
      await runScheduledReport(reportId).unwrap();
      setSnackbar({ open: true, message: 'Reporte programado ejecutado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al ejecutar el reporte programado' });
    }
  };

  const handleToggleScheduledReport = async (reportId: string, isActive: boolean) => {
    try {
      await toggleScheduledReport({ id: reportId, isActive }).unwrap();
      setSnackbar({ open: true, message: `Reporte programado ${isActive ? 'activado' : 'pausado'} exitosamente` });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cambiar el estado del reporte programado' });
    }
  };

  const getStats = () => {
    return {
      totalTemplates: templates.length,
      totalScheduled: scheduledReports.length,
      totalGenerated: generatedReports.length,
      totalHistory: reportHistory.length,
      totalAnalytics: analytics.length,
    };
  };

  const stats = getStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Reportes Automatizados
      </Typography>

      {/* Resumen de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalTemplates}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plantillas
                  </Typography>
                </Box>
                <Description color="primary" sx={{ fontSize: 40 }} />
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
                    {stats.totalScheduled}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Programados
                  </Typography>
                </Box>
                <Schedule color="success" sx={{ fontSize: 40 }} />
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
                    {stats.totalGenerated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generados
                  </Typography>
                </Box>
                <History color="info" sx={{ fontSize: 40 }} />
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
                    {stats.totalHistory}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Historial
                  </Typography>
                </Box>
                <Assessment color="warning" sx={{ fontSize: 40 }} />
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
                    {stats.totalAnalytics}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analytics
                  </Typography>
                </Box>
                <BarChart color="secondary" sx={{ fontSize: 40 }} />
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
                    {scheduledReports.filter(r => r.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activos
                  </Typography>
                </Box>
                <CheckCircle color="error" sx={{ fontSize: 40 }} />
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
              Controles del Sistema de Reportes
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
                onClick={() => {/* Implementar exportación masiva */}}
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
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value="all"
                    label="Categoría"
                    onChange={() => {}}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {REPORT_CATEGORIES.map(category => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value="all"
                    label="Tipo"
                    onChange={() => {}}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {REPORT_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Formato</InputLabel>
                  <Select
                    value="all"
                    label="Formato"
                    onChange={() => {}}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {REPORT_FORMATS.map(format => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.icon} {format.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Frecuencia</InputLabel>
                  <Select
                    value="all"
                    label="Frecuencia"
                    onChange={() => {}}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {SCHEDULE_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
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
          </Box>
        </CardContent>
      </Card>

      {/* Pestañas principales */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => dispatch(setActiveTab(newValue))}>
            <Tab icon={<Description />} label="Plantillas" />
            <Tab icon={<Schedule />} label="Programados" />
            <Tab icon={<History />} label="Generados" />
            <Tab icon={<Assessment />} label="Historial" />
            <Tab icon={<BarChart />} label="Analytics" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña de Plantillas */}
          {activeTab === 0 && (
            <ReportTemplates
              templates={templates}
              loading={loading.templates}
              onRefresh={handleRefresh}
              onEdit={(id) => {
                if (id === 'new') {
                  // Implementar creación de nueva plantilla
                  setSnackbar({ open: true, message: 'Funcionalidad de creación de plantillas en desarrollo' });
                } else {
                  // Implementar edición de plantilla existente
                  setSnackbar({ open: true, message: 'Funcionalidad de edición de plantillas en desarrollo' });
                }
              }}
              onDelete={(id) => {
                setSnackbar({ open: true, message: 'Funcionalidad de eliminación de plantillas en desarrollo' });
              }}
              onDuplicate={(id) => {
                setSnackbar({ open: true, message: 'Funcionalidad de duplicación de plantillas en desarrollo' });
              }}
              onPreview={(id) => {
                setSnackbar({ open: true, message: 'Funcionalidad de vista previa en desarrollo' });
              }}
              onSchedule={(id) => {
                setSnackbar({ open: true, message: 'Funcionalidad de programación en desarrollo' });
              }}
            />
          )}

          {/* Pestaña de Reportes Programados */}
          {activeTab === 1 && (
            <ScheduledReports
              scheduledReports={scheduledReports}
              loading={loading.scheduledReports}
              onRefresh={handleRefresh}
              onEdit={(id) => {
                if (id === 'new') {
                  setSnackbar({ open: true, message: 'Funcionalidad de creación de reportes programados en desarrollo' });
                } else {
                  setSnackbar({ open: true, message: 'Funcionalidad de edición de reportes programados en desarrollo' });
                }
              }}
              onDelete={(id) => {
                setSnackbar({ open: true, message: 'Funcionalidad de eliminación de reportes programados en desarrollo' });
              }}
              onToggle={handleToggleScheduledReport}
              onRun={handleRunScheduledReport}
            />
          )}

          {/* Pestaña de Reportes Generados */}
          {activeTab === 2 && (
            <Box>
              <Alert severity="info">
                La funcionalidad de reportes generados está en desarrollo. 
                Próximamente podrás ver y gestionar todos los reportes generados.
              </Alert>
            </Box>
          )}

          {/* Pestaña de Historial */}
          {activeTab === 3 && (
            <Box>
              <Alert severity="info">
                La funcionalidad de historial de reportes está en desarrollo. 
                Próximamente podrás ver el historial completo de todas las acciones.
              </Alert>
            </Box>
          )}

          {/* Pestaña de Analytics */}
          {activeTab === 4 && (
            <Box>
              <Alert severity="info">
                La funcionalidad de analytics de reportes está en desarrollo. 
                Próximamente podrás ver estadísticas detalladas del uso de reportes.
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog de configuración */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configuración del Sistema de Reportes</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Configuración General
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tamaño Máximo de Archivo (MB)</InputLabel>
                <Select
                  value={50}
                  label="Tamaño Máximo de Archivo (MB)"
                  onChange={() => {}}
                >
                  <MenuItem value={10}>10 MB</MenuItem>
                  <MenuItem value={25}>25 MB</MenuItem>
                  <MenuItem value={50}>50 MB</MenuItem>
                  <MenuItem value={100}>100 MB</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Días de Retención</InputLabel>
                <Select
                  value={90}
                  label="Días de Retención"
                  onChange={() => {}}
                >
                  <MenuItem value={30}>30 días</MenuItem>
                  <MenuItem value={60}>60 días</MenuItem>
                  <MenuItem value={90}>90 días</MenuItem>
                  <MenuItem value={180}>180 días</MenuItem>
                  <MenuItem value={365}>365 días</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Configuración de Email
              </Typography>
              <TextField
                fullWidth
                label="Servidor SMTP"
                value="smtp.gmail.com"
                sx={{ mb: 2 }}
                disabled
              />
              <TextField
                fullWidth
                label="Puerto"
                value="587"
                sx={{ mb: 2 }}
                disabled
              />
              <FormControlLabel
                control={<Switch checked={true} />}
                label="Habilitar notificaciones por email"
              />
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

export default ReportManagement;
