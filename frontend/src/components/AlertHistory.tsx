import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Alert,
  Pagination,
  Skeleton,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Close,
  FilterList,
  Refresh,
  Download,
  MoreVert,
  Warning,
  Error,
  Info,
  CheckCircleOutline,
  Schedule,
} from '@mui/icons-material';
import { AlertInstance, AlertStatus, AlertSeverity, AlertType } from '../types/alerts';

interface AlertHistoryProps {
  alerts: AlertInstance[];
  loading?: boolean;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onBulkAcknowledge: (ids: string[]) => void;
  onBulkResolve: (ids: string[]) => void;
  onRefresh: () => void;
  onExport?: () => void;
}

const AlertHistory: React.FC<AlertHistoryProps> = ({
  alerts,
  loading = false,
  onAcknowledge,
  onResolve,
  onBulkAcknowledge,
  onBulkResolve,
  onRefresh,
  onExport,
}) => {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertInstance | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    type: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <Error color="error" />;
      case 'high':
        return <Warning color="warning" />;
      case 'medium':
        return <Info color="info" />;
      case 'low':
        return <CheckCircleOutline color="success" />;
      default:
        return <Info />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'acknowledged':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'suppressed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: AlertStatus) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'acknowledged':
        return 'Reconocida';
      case 'resolved':
        return 'Resuelta';
      case 'suppressed':
        return 'Suprimida';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: AlertType) => {
    switch (type) {
      case 'consumption':
        return 'Consumo';
      case 'powerFactor':
        return 'Factor de Potencia';
      case 'dataLoss':
        return 'Pérdida de Datos';
      case 'demand':
        return 'Demanda';
      case 'efficiency':
        return 'Eficiencia';
      case 'billing':
        return 'Facturación';
      default:
        return type;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filters.status !== 'all' && alert.status !== filters.status) return false;
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.type !== 'all' && alert.type !== filters.type) return false;
    if (filters.search && !alert.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !alert.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const paginatedAlerts = filteredAlerts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === paginatedAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(paginatedAlerts.map(alert => alert.id));
    }
  };

  const handleBulkAction = (action: 'acknowledge' | 'resolve') => {
    if (action === 'acknowledge') {
      onBulkAcknowledge(selectedAlerts);
    } else {
      onBulkResolve(selectedAlerts);
    }
    setSelectedAlerts([]);
  };

  const handleViewDetails = (alert: AlertInstance) => {
    setSelectedAlert(alert);
    setShowDetails(true);
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

  const formatDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con filtros y acciones */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Historial de Alertas ({filteredAlerts.length})
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
            startIcon={<Refresh />}
            onClick={onRefresh}
            variant="outlined"
          >
            Actualizar
          </Button>
          {onExport && (
            <Button
              startIcon={<Download />}
              onClick={onExport}
              variant="outlined"
            >
              Exportar
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtros */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Buscar"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.status}
                    label="Estado"
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="active">Activa</MenuItem>
                    <MenuItem value="acknowledged">Reconocida</MenuItem>
                    <MenuItem value="resolved">Resuelta</MenuItem>
                    <MenuItem value="suppressed">Suprimida</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Severidad</InputLabel>
                  <Select
                    value={filters.severity}
                    label="Severidad"
                    onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="critical">Crítica</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="low">Baja</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={filters.type}
                    label="Tipo"
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="consumption">Consumo</MenuItem>
                    <MenuItem value="powerFactor">Factor de Potencia</MenuItem>
                    <MenuItem value="dataLoss">Pérdida de Datos</MenuItem>
                    <MenuItem value="demand">Demanda</MenuItem>
                    <MenuItem value="efficiency">Eficiencia</MenuItem>
                    <MenuItem value="billing">Facturación</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Acciones en lote */}
      {selectedAlerts.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">
                {selectedAlerts.length} alerta(s) seleccionada(s)
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => handleBulkAction('acknowledge')}
                >
                  Reconocer
                </Button>
                <Button
                  size="small"
                  startIcon={<Close />}
                  onClick={() => handleBulkAction('resolve')}
                >
                  Resolver
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tabla de alertas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAlerts.length === paginatedAlerts.length && paginatedAlerts.length > 0}
                  indeterminate={selectedAlerts.length > 0 && selectedAlerts.length < paginatedAlerts.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Severidad</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Activada</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAlerts.map((alert) => (
              <TableRow key={alert.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={() => handleSelectAlert(alert.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getSeverityIcon(alert.severity)}
                    <Chip
                      label={alert.severity}
                      color={getSeverityColor(alert.severity) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getTypeLabel(alert.type)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {alert.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(alert.status)}
                    color={getStatusColor(alert.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {alert.data.location || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(alert.triggeredAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule fontSize="small" />
                    <Typography variant="body2">
                      {formatDuration(alert.triggeredAt, alert.resolvedAt)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(alert)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {alert.status === 'active' && (
                      <Tooltip title="Reconocer">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => onAcknowledge(alert.id)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    {alert.status !== 'resolved' && (
                      <Tooltip title="Resolver">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => onResolve(alert.id)}
                        >
                          <Close />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {filteredAlerts.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredAlerts.length / itemsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Dialog de detalles */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {selectedAlert && getSeverityIcon(selectedAlert.severity)}
            <Typography variant="h6">
              {selectedAlert?.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información General
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Tipo"
                        secondary={getTypeLabel(selectedAlert.type)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Severidad"
                        secondary={
                          <Chip
                            label={selectedAlert.severity}
                            color={getSeverityColor(selectedAlert.severity) as any}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Estado"
                        secondary={
                          <Chip
                            label={getStatusLabel(selectedAlert.status)}
                            color={getStatusColor(selectedAlert.status) as any}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Activada"
                        secondary={formatDateTime(selectedAlert.triggeredAt)}
                      />
                    </ListItem>
                    {selectedAlert.acknowledgedAt && (
                      <ListItem>
                        <ListItemText
                          primary="Reconocida"
                          secondary={formatDateTime(selectedAlert.acknowledgedAt)}
                        />
                      </ListItem>
                    )}
                    {selectedAlert.resolvedAt && (
                      <ListItem>
                        <ListItemText
                          primary="Resuelta"
                          secondary={formatDateTime(selectedAlert.resolvedAt)}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Datos de la Alerta
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Ubicación"
                        secondary={selectedAlert.data.location || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Medidor"
                        secondary={selectedAlert.data.meterId || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Valor Actual"
                        secondary={`${selectedAlert.data.currentValue} ${selectedAlert.data.unit}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Umbral"
                        secondary={`${selectedAlert.data.threshold} ${selectedAlert.data.unit}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Mensaje
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAlert.message}
                  </Typography>
                </Grid>
                {selectedAlert.notifications.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Notificaciones Enviadas
                    </Typography>
                    <List dense>
                      {selectedAlert.notifications.map((notification, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {notification.status === 'sent' ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Error color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={`${notification.channel.toUpperCase()} - ${notification.recipient}`}
                            secondary={`${formatDateTime(notification.sentAt)} - ${notification.status}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
          {selectedAlert && selectedAlert.status === 'active' && (
            <Button
              onClick={() => {
                onAcknowledge(selectedAlert.id);
                setShowDetails(false);
              }}
              startIcon={<CheckCircle />}
              color="warning"
            >
              Reconocer
            </Button>
          )}
          {selectedAlert && selectedAlert.status !== 'resolved' && (
            <Button
              onClick={() => {
                onResolve(selectedAlert.id);
                setShowDetails(false);
              }}
              startIcon={<Close />}
              color="success"
            >
              Resolver
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertHistory;



