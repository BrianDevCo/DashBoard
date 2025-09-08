import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Avatar,
  LinearProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
  Alert,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Search,
  FilterList,
  ViewModule,
  TableChart,
  Schedule,
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
  Description,
  Image,
  TableChart as TableIcon,
  Assessment,
  TextFields,
  Code,
  Settings,
  Public,
  Lock,
} from '@mui/icons-material';
import { 
  ScheduledReport, 
  SCHEDULE_TYPES, 
  REPORT_UTILS 
} from '../types/reports';

interface ScheduledReportsProps {
  scheduledReports: ScheduledReport[];
  loading?: boolean;
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, isActive: boolean) => void;
  onRun?: (id: string) => void;
}

const ScheduledReports: React.FC<ScheduledReportsProps> = ({
  scheduledReports,
  loading = false,
  onRefresh,
  onEdit,
  onDelete,
  onToggle,
  onRun,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  const getFrequencyIcon = (type: string) => {
    const freq = SCHEDULE_TYPES.find(f => f.value === type);
    return freq?.icon || '📅';
  };

  const getFrequencyLabel = (type: string) => {
    const freq = SCHEDULE_TYPES.find(f => f.value === type);
    return freq?.label || type;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle /> : <Error />;
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredReports = scheduledReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && report.isActive) ||
                         (filterStatus === 'inactive' && !report.isActive);
    const matchesFrequency = filterFrequency === 'all' || report.schedule.type === filterFrequency;
    
    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const getStats = () => {
    const totalReports = scheduledReports.length;
    const activeReports = scheduledReports.filter(r => r.isActive).length;
    const inactiveReports = scheduledReports.filter(r => !r.isActive).length;
    const totalRuns = scheduledReports.reduce((sum, r) => sum + r.runCount, 0);
    const totalSuccess = scheduledReports.reduce((sum, r) => sum + r.successCount, 0);
    const totalFailures = scheduledReports.reduce((sum, r) => sum + r.failureCount, 0);
    const successRate = totalRuns > 0 ? (totalSuccess / totalRuns) * 100 : 0;
    
    return {
      totalReports,
      activeReports,
      inactiveReports,
      totalRuns,
      totalSuccess,
      totalFailures,
      successRate,
    };
  };

  const stats = getStats();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ element: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = (id: string) => {
    onEdit?.(id);
    handleMenuClose();
  };

  const handleDelete = (id: string) => {
    setReportToDelete(id);
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleToggle = (id: string, isActive: boolean) => {
    onToggle?.(id, isActive);
    handleMenuClose();
  };

  const handleRun = (id: string) => {
    onRun?.(id);
    handleMenuClose();
  };

  const handleViewDetails = (report: ScheduledReport) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      onDelete?.(reportToDelete);
      setShowDeleteDialog(false);
      setReportToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando reportes programados...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Schedule color="primary" />
          <Typography variant="h5">
            Reportes Programados ({scheduledReports.length})
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => onEdit?.('new')}
          >
            Nuevo Reporte
          </Button>
          <IconButton onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Estadísticas resumen */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="primary">
                      {stats.totalReports}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reportes
                    </Typography>
                  </Box>
                  <Schedule color="primary" sx={{ fontSize: 40 }} />
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
                      {stats.activeReports}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activos
                    </Typography>
                  </Box>
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
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
                      {stats.inactiveReports}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactivos
                    </Typography>
                  </Box>
                  <Error color="error" sx={{ fontSize: 40 }} />
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
                      {stats.totalRuns}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Ejecuciones
                    </Typography>
                  </Box>
                  <TrendingUp color="info" sx={{ fontSize: 40 }} />
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
                      {stats.totalSuccess}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exitosas
                    </Typography>
                  </Box>
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
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
                      {REPORT_UTILS.formatPercentage(stats.successRate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Éxito
                    </Typography>
                  </Box>
                  <BarChart color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <Search />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Frecuencia</InputLabel>
                <Select
                  value={filterFrequency}
                  label="Frecuencia"
                  onChange={(e) => setFilterFrequency(e.target.value)}
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
        </CardContent>
      </Card>

      {/* Modo de vista */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Reportes Programados ({filteredReports.length})
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            <ViewModule />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'default'}
          >
            <TableChart />
          </IconButton>
        </Box>
      </Box>

      {/* Lista de reportes programados */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredReports.map((report) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={report.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <Schedule />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" noWrap>
                          {report.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.template.name}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, report.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {report.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={getFrequencyLabel(report.schedule.type)}
                      size="small"
                      icon={<span>{getFrequencyIcon(report.schedule.type)}</span>}
                    />
                    <Chip
                      label={getStatusLabel(report.isActive)}
                      size="small"
                      color={getStatusColor(report.isActive) as any}
                      icon={getStatusIcon(report.isActive)}
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1}>
                      <Typography variant="caption" color="text.secondary">
                        {report.runCount} ejecuciones
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {report.nextRun ? formatTime(report.nextRun) : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Plantilla</TableCell>
                  <TableCell>Frecuencia</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Próxima Ejecución</TableCell>
                  <TableCell>Ejecuciones</TableCell>
                  <TableCell>Éxito</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <Schedule />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {report.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.template.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getFrequencyLabel(report.schedule.type)}
                        size="small"
                        icon={<span>{getFrequencyIcon(report.schedule.type)}</span>}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(report.isActive)}
                        size="small"
                        color={getStatusColor(report.isActive) as any}
                        icon={getStatusIcon(report.isActive)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.nextRun ? formatDateTime(report.nextRun) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.runCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {report.successCount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({REPORT_UTILS.formatPercentage((report.successCount / Math.max(report.runCount, 1)) * 100)})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, report.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(menuAnchor?.id!)}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleRun(menuAnchor?.id!)}>
          <ListItemIcon>
            <PlayArrow />
          </ListItemIcon>
          <ListItemText>Ejecutar Ahora</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleToggle(menuAnchor?.id!, !scheduledReports.find(r => r.id === menuAnchor?.id)?.isActive!)}>
          <ListItemIcon>
            {scheduledReports.find(r => r.id === menuAnchor?.id)?.isActive ? <Pause /> : <PlayArrow />}
          </ListItemIcon>
          <ListItemText>
            {scheduledReports.find(r => r.id === menuAnchor?.id)?.isActive ? 'Pausar' : 'Activar'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(menuAnchor?.id!)}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog de detalles */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Schedule />
            </Avatar>
            <Typography variant="h6">
              {selectedReport?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información General
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Descripción"
                        secondary={selectedReport.description}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Plantilla"
                        secondary={selectedReport.template.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Estado"
                        secondary={getStatusLabel(selectedReport.isActive)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Frecuencia"
                        secondary={getFrequencyLabel(selectedReport.schedule.type)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Programación
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Hora"
                        secondary={selectedReport.schedule.time}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Zona Horaria"
                        secondary={selectedReport.schedule.timezone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Fecha de Inicio"
                        secondary={formatDate(selectedReport.schedule.startDate)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Próxima Ejecución"
                        secondary={selectedReport.nextRun ? formatDateTime(selectedReport.nextRun) : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Estadísticas de Ejecución
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="primary">
                          {selectedReport.runCount}
                        </Typography>
                        <Typography variant="caption">Total Ejecuciones</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="success.main">
                          {selectedReport.successCount}
                        </Typography>
                        <Typography variant="caption">Exitosas</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="error.main">
                          {selectedReport.failureCount}
                        </Typography>
                        <Typography variant="caption">Fallidas</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="warning.main">
                          {REPORT_UTILS.formatPercentage((selectedReport.successCount / Math.max(selectedReport.runCount, 1)) * 100)}
                        </Typography>
                        <Typography variant="caption">Tasa de Éxito</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Destinatarios ({selectedReport.recipients.length})
                  </Typography>
                  <List dense>
                    {selectedReport.recipients.map((recipient, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={recipient.name}
                          secondary={recipient.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este reporte programado? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledReports;
