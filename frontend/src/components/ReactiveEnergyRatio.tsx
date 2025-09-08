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
  CircularProgress,
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
  Power,
  BatteryChargingFull,
  BatteryAlert,
  BatteryUnknown,
} from '@mui/icons-material';
import { ReactiveEnergyRatio as ReactiveEnergyRatioType, KPI_FORMAT } from '../types/kpis';

interface ReactiveEnergyRatioProps {
  data: ReactiveEnergyRatioType[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onViewDetails?: (id: string) => void;
}

const ReactiveEnergyRatio: React.FC<ReactiveEnergyRatioProps> = ({
  data,
  loading = false,
  onRefresh,
  onExport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('reactivePercentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const itemsPerPage = 10;

  const getReactiveIcon = (percentage: number) => {
    if (percentage <= 10) return <BatteryChargingFull color="success" />;
    if (percentage <= 20) return <BatteryUnknown color="warning" />;
    return <BatteryAlert color="error" />;
  };

  const getReactiveColor = (percentage: number) => {
    if (percentage <= 10) return 'success';
    if (percentage <= 20) return 'warning';
    return 'error';
  };

  const getReactiveLabel = (percentage: number) => {
    if (percentage <= 10) return 'Excelente';
    if (percentage <= 20) return 'Aceptable';
    if (percentage <= 30) return 'Regular';
    return 'Crítico';
  };

  const getPowerFactorColor = (powerFactor: number) => {
    if (powerFactor >= 0.95) return 'success';
    if (powerFactor >= 0.9) return 'info';
    if (powerFactor >= 0.85) return 'warning';
    return 'error';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'success';
    if (efficiency >= 80) return 'info';
    if (efficiency >= 70) return 'warning';
    return 'error';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingDown color="success" />;
      case 'degrading':
        return <TrendingUp color="error" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'success';
      case 'degrading':
        return 'error';
      default:
        return 'info';
    }
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

  const filteredData = data.filter(item =>
    item.siteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy as keyof ReactiveEnergyRatioType] as number;
    const bValue = b[sortBy as keyof ReactiveEnergyRatioType] as number;
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStats = () => {
    if (data.length === 0) return null;
    
    const totalActiveEnergy = data.reduce((sum, item) => sum + item.activeEnergy, 0);
    const totalReactiveEnergy = data.reduce((sum, item) => sum + item.reactiveEnergy, 0);
    const averageReactivePercentage = data.reduce((sum, item) => sum + item.reactivePercentage, 0) / data.length;
    const averagePowerFactor = data.reduce((sum, item) => sum + item.powerFactor, 0) / data.length;
    const totalPenaltyCost = data.reduce((sum, item) => sum + item.penaltyCost, 0);
    const averageEfficiency = data.reduce((sum, item) => sum + item.efficiency, 0) / data.length;
    
    return {
      totalActiveEnergy,
      totalReactiveEnergy,
      averageReactivePercentage,
      averagePowerFactor,
      totalPenaltyCost,
      averageEfficiency,
      totalSites: data.length,
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
          Cargando datos de energía reactiva...
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
            Análisis de Energía Reactiva ({data.length})
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
                      {formatNumber(stats.totalActiveEnergy, 'kWh')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Energía Activa Total
                    </Typography>
                  </Box>
                  <Power color="primary" sx={{ fontSize: 40 }} />
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
                      {formatNumber(stats.totalReactiveEnergy, 'kVARh')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Energía Reactiva Total
                    </Typography>
                  </Box>
                  <BatteryAlert color="warning" sx={{ fontSize: 40 }} />
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
                      {formatPercentage(stats.averageReactivePercentage)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      % Reactiva Promedio
                    </Typography>
                  </Box>
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(stats.averageReactivePercentage, 100)}
                    color={getReactiveColor(stats.averageReactivePercentage) as any}
                    sx={{ fontSize: 40 }}
                  />
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
                      {stats.averagePowerFactor.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Factor de Potencia Promedio
                    </Typography>
                  </Box>
                  <Speed color="info" sx={{ fontSize: 40 }} />
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
                      {formatCurrency(stats.totalPenaltyCost)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Costo de Penalización
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
                    <Typography variant="h4" color="success.main">
                      {formatPercentage(stats.averageEfficiency)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Eficiencia Promedio
                    </Typography>
                  </Box>
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
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
                  <MenuItem value="reactivePercentage">% Energía Reactiva</MenuItem>
                  <MenuItem value="powerFactor">Factor de Potencia</MenuItem>
                  <MenuItem value="penaltyCost">Costo de Penalización</MenuItem>
                  <MenuItem value="efficiency">Eficiencia</MenuItem>
                  <MenuItem value="activeEnergy">Energía Activa</MenuItem>
                  <MenuItem value="reactiveEnergy">Energía Reactiva</MenuItem>
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

      {/* Tabla de datos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sitio</TableCell>
              <TableCell>Energía Activa</TableCell>
              <TableCell>Energía Reactiva</TableCell>
              <TableCell>% Reactiva</TableCell>
              <TableCell>Factor de Potencia</TableCell>
              <TableCell>Costo Penalización</TableCell>
              <TableCell>Eficiencia</TableCell>
              <TableCell>Tendencia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.siteId} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <LocationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {item.siteName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatNumber(item.activeEnergy, 'kWh')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {formatNumber(item.reactiveEnergy, 'kVARh')}
                    </Typography>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Capacitiva: {formatNumber(item.capacitiveEnergy, 'kVARh')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Inductiva: {formatNumber(item.inductiveEnergy, 'kVARh')}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getReactiveIcon(item.reactivePercentage)}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatPercentage(item.reactivePercentage)}
                      </Typography>
                      <Chip
                        label={getReactiveLabel(item.reactivePercentage)}
                        color={getReactiveColor(item.reactivePercentage) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {item.powerFactor.toFixed(2)}
                    </Typography>
                    <Chip
                      label={item.powerFactor >= 0.95 ? 'Excelente' : 
                             item.powerFactor >= 0.9 ? 'Bueno' : 
                             item.powerFactor >= 0.85 ? 'Regular' : 'Malo'}
                      color={getPowerFactorColor(item.powerFactor) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium" color="error.main">
                    {formatCurrency(item.penaltyCost)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {formatPercentage(item.efficiency)}
                    </Typography>
                    <Chip
                      label={item.efficiency >= 90 ? 'Excelente' : 
                             item.efficiency >= 80 ? 'Bueno' : 
                             item.efficiency >= 70 ? 'Regular' : 'Malo'}
                      color={getEfficiencyColor(item.efficiency) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getTrendIcon(item.trend)}
                    <Typography variant="caption" color="text.secondary">
                      {item.trend === 'improving' ? 'Mejorando' : 
                       item.trend === 'degrading' ? 'Empeorando' : 'Estable'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item.siteId)}
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
      {filteredData.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredData.length / itemsPerPage)}
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

export default ReactiveEnergyRatio;


