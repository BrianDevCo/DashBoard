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
  Alert,
  Pagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  FilterList,
  Refresh,
  Download,
  Search,
  CheckCircle,
  Error,
  Warning,
  Info,
  Schedule,
  Person,
  Computer,
  LocationOn,
} from '@mui/icons-material';
import { AccessLog } from '../types/users';

interface AccessLogsProps {
  logs: AccessLog[];
  loading?: boolean;
  onRefresh: () => void;
  onExport?: () => void;
}

const AccessLogs: React.FC<AccessLogsProps> = ({
  logs,
  loading = false,
  onRefresh,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    success: 'all',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <CheckCircle color="success" />;
      case 'logout':
        return <Error color="error" />;
      case 'password_change':
        return <Warning color="warning" />;
      case 'permission_change':
        return <Info color="info" />;
      case 'user_creation':
        return <Person color="primary" />;
      case 'user_deletion':
        return <Error color="error" />;
      default:
        return <Info />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'success';
      case 'logout':
        return 'error';
      case 'password_change':
        return 'warning';
      case 'permission_change':
        return 'info';
      case 'user_creation':
        return 'primary';
      case 'user_deletion':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSuccessIcon = (success: boolean) => {
    return success ? (
      <CheckCircle color="success" fontSize="small" />
    ) : (
      <Error color="error" fontSize="small" />
    );
  };

  const getSuccessColor = (success: boolean) => {
    return success ? 'success' : 'error';
  };

  const getSuccessLabel = (success: boolean) => {
    return success ? 'Exitoso' : 'Fallido';
  };

  const filteredLogs = logs.filter(log => {
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
    if (filters.success !== 'all' && log.success !== (filters.success === 'true')) return false;
    if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
    if (filters.search && !log.username.toLowerCase().includes(filters.search.toLowerCase()) &&
        !log.action.toLowerCase().includes(filters.search.toLowerCase()) &&
        !log.resource.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Hace un momento';
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} min`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `Hace ${hours}h`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `Hace ${days}d`;
    }
  };

  const getActionDescription = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'Inicio de sesión';
      case 'logout':
        return 'Cierre de sesión';
      case 'password_change':
        return 'Cambio de contraseña';
      case 'permission_change':
        return 'Cambio de permisos';
      case 'user_creation':
        return 'Creación de usuario';
      case 'user_deletion':
        return 'Eliminación de usuario';
      case 'role_assignment':
        return 'Asignación de rol';
      case 'data_export':
        return 'Exportación de datos';
      case 'data_import':
        return 'Importación de datos';
      case 'settings_change':
        return 'Cambio de configuración';
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getResourceDescription = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'dashboard':
        return 'Dashboard Principal';
      case 'metrics':
        return 'Métricas Energéticas';
      case 'alerts':
        return 'Sistema de Alertas';
      case 'reports':
        return 'Reportes';
      case 'export':
        return 'Exportación de Datos';
      case 'settings':
        return 'Configuración';
      case 'users':
        return 'Gestión de Usuarios';
      case 'roles':
        return 'Gestión de Roles';
      default:
        return resource.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getStats = () => {
    const total = logs.length;
    const successful = logs.filter(log => log.success).length;
    const failed = total - successful;
    const today = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length;
    
    return { total, successful, failed, today };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando historial de acceso...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Historial de Acceso ({filteredLogs.length})
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

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Accesos
                  </Typography>
                </Box>
                <Schedule color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {stats.successful}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exitosos
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error.main">
                    {stats.failed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fallidos
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.today}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hoy
                  </Typography>
                </Box>
                <Info color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                <TextField
                  fullWidth
                  label="Usuario"
                  value={filters.userId}
                  onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Acción"
                  value={filters.action}
                  onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.success}
                    label="Estado"
                    onChange={(e) => setFilters(prev => ({ ...prev, success: e.target.value }))}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="true">Exitosos</MenuItem>
                    <MenuItem value="false">Fallidos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fecha Inicio"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fecha Fin"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tabla de logs */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>Recurso</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" />
                    <Typography variant="body2">
                      {log.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getActionIcon(log.action)}
                    <Typography variant="body2">
                      {getActionDescription(log.action)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getResourceDescription(log.resource)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getSuccessIcon(log.success)}
                    <Chip
                      label={getSuccessLabel(log.success)}
                      color={getSuccessColor(log.success) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Computer fontSize="small" />
                    <Typography variant="body2">
                      {log.ipAddress}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(log.timestamp)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDuration(log.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedLog(log);
                      setShowDetails(true);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {filteredLogs.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredLogs.length / itemsPerPage)}
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
            {selectedLog && getActionIcon(selectedLog.action)}
            <Typography variant="h6">
              Detalles del Acceso
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información del Usuario
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Usuario"
                        secondary={selectedLog.username}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="ID de Usuario"
                        secondary={selectedLog.userId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="IP Address"
                        secondary={selectedLog.ipAddress}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="User Agent"
                        secondary={selectedLog.userAgent}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información de la Acción
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Acción"
                        secondary={getActionDescription(selectedLog.action)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Recurso"
                        secondary={getResourceDescription(selectedLog.resource)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Estado"
                        secondary={
                          <Chip
                            label={getSuccessLabel(selectedLog.success)}
                            color={getSuccessColor(selectedLog.success) as any}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Timestamp"
                        secondary={formatDateTime(selectedLog.timestamp)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Detalles Adicionales
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      }}
                    >
                      <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccessLogs;



