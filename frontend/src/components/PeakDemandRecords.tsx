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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Avatar,
  LinearProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  Pagination,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
} from '@mui/material';
import {
  MoreVert,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  LocationOn,
  ElectricBolt,
  AttachMoney,
  Speed,
  Warning,
  CheckCircle,
  Error,
  Search,
  FilterList,
  Download,
  Refresh,
  Visibility,
  VisibilityOff,
  Schedule,
  Thermostat,
  WbSunny,
  Cloud,
  Thunderstorm,
} from '@mui/icons-material';
import { PeakDemandRecord, KPI_FORMAT } from '../types/kpis';

interface PeakDemandRecordsProps {
  records: PeakDemandRecord[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onViewDetails?: (id: string) => void;
}

const PeakDemandRecords: React.FC<PeakDemandRecordsProps> = ({
  records,
  loading = false,
  onRefresh,
  onExport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('peakDemand');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const itemsPerPage = 10;

  const getWeatherIcon = (weather?: string) => {
    switch (weather?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <WbSunny color="warning" />;
      case 'cloudy':
      case 'overcast':
        return <Cloud color="info" />;
      case 'rainy':
      case 'storm':
        return <Thunderstorm color="primary" />;
      default:
        return <Thermostat color="action" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'success';
    if (efficiency >= 80) return 'info';
    if (efficiency >= 70) return 'warning';
    return 'error';
  };

  const getPowerFactorColor = (powerFactor: number) => {
    if (powerFactor >= 0.95) return 'success';
    if (powerFactor >= 0.9) return 'info';
    if (powerFactor >= 0.85) return 'warning';
    return 'error';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, unit: string = '') => {
    return `${value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} ${unit}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRecords = records.filter(record =>
    record.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.siteName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aValue = a[sortBy as keyof PeakDemandRecord] as number;
    const bValue = b[sortBy as keyof PeakDemandRecord] as number;
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const paginatedRecords = sortedRecords.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStats = () => {
    if (records.length === 0) return null;
    
    const totalPeakDemand = records.reduce((sum, record) => sum + record.peakDemand, 0);
    const averagePeakDemand = totalPeakDemand / records.length;
    const maxPeakDemand = Math.max(...records.map(r => r.peakDemand));
    const minPeakDemand = Math.min(...records.map(r => r.peakDemand));
    const totalCost = records.reduce((sum, record) => sum + record.cost, 0);
    const averageEfficiency = records.reduce((sum, record) => sum + record.efficiency, 0) / records.length;
    
    return {
      totalRecords: records.length,
      averagePeakDemand,
      maxPeakDemand,
      minPeakDemand,
      totalCost,
      averageEfficiency,
    };
  };

  const stats = getStats();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ element: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleViewDetails = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando registros de demanda máxima...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <ElectricBolt color="primary" />
          <Typography variant="h5">
            Registros de Demanda Máxima ({records.length})
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={onRefresh}>
            <Refresh />
          </IconButton>
          <IconButton onClick={onExport}>
            <Download />
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
                      {stats.totalRecords}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Registros
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
                      {formatNumber(stats.maxPeakDemand, 'kW')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Máxima Registrada
                    </Typography>
                  </Box>
                  <TrendingUp color="success" sx={{ fontSize: 40 }} />
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
                      {formatNumber(stats.averagePeakDemand, 'kW')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Promedio
                    </Typography>
                  </Box>
                  <TrendingFlat color="info" sx={{ fontSize: 40 }} />
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
                      {formatNumber(stats.minPeakDemand, 'kW')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mínima
                    </Typography>
                  </Box>
                  <TrendingDown color="warning" sx={{ fontSize: 40 }} />
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
                      {formatCurrency(stats.totalCost)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Costo Total
                    </Typography>
                  </Box>
                  <AttachMoney color="secondary" sx={{ fontSize: 40 }} />
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
                      {formatPercentage(stats.averageEfficiency)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Eficiencia Promedio
                    </Typography>
                  </Box>
                  <Speed color="error" sx={{ fontSize: 40 }} />
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
                label="Buscar sitio"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  label="Ordenar por"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="peakDemand">Demanda Máxima</MenuItem>
                  <MenuItem value="timestamp">Fecha y Hora</MenuItem>
                  <MenuItem value="cost">Costo</MenuItem>
                  <MenuItem value="efficiency">Eficiencia</MenuItem>
                  <MenuItem value="powerFactor">Factor de Potencia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Orden</InputLabel>
                <Select
                  value={sortOrder}
                  label="Orden"
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="desc">Descendente</MenuItem>
                  <MenuItem value="asc">Ascendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de registros */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sitio</TableCell>
              <TableCell>Demanda Máxima</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Factor de Potencia</TableCell>
              <TableCell>Eficiencia</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Condiciones</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <LocationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {record.siteName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.siteName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatNumber(record.peakDemand, 'kW')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(record.date)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(record.time)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatNumber(record.duration, 'min')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {record.powerFactor.toFixed(2)}
                    </Typography>
                    <Chip
                      label={record.powerFactor >= 0.95 ? 'Excelente' : 
                             record.powerFactor >= 0.9 ? 'Bueno' : 
                             record.powerFactor >= 0.85 ? 'Regular' : 'Malo'}
                      color={getPowerFactorColor(record.powerFactor) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {formatPercentage(record.efficiency)}
                    </Typography>
                    <Chip
                      label={record.efficiency >= 90 ? 'Excelente' : 
                             record.efficiency >= 80 ? 'Bueno' : 
                             record.efficiency >= 70 ? 'Regular' : 'Malo'}
                      color={getEfficiencyColor(record.efficiency) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(record.cost)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getWeatherIcon(record.weather)}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {record.weather || 'N/A'}
                      </Typography>
                      {record.temperature && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {record.temperature}°C
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, record.id)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {filteredRecords.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredRecords.length / itemsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(menuAnchor?.id!)}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText>Ver Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Exportar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PeakDemandRecords;
