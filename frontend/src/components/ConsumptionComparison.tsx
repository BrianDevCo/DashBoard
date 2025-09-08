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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  MoreVert,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  LocationOn,
  Business,
  Group,
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
  Compare,
  Timeline,
  BarChart,
  PieChart,
} from '@mui/icons-material';
import { 
  ConsumptionComparison, 
  COMPARATIVE_UTILS,
  METRICS,
  ENTITY_TYPES 
} from '../types/comparative';

interface ConsumptionComparisonProps {
  comparisons: ConsumptionComparison[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onViewDetails?: (id: string) => void;
}

const ConsumptionComparisonComponent: React.FC<ConsumptionComparisonProps> = ({
  comparisons,
  loading = false,
  onRefresh,
  onExport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('variance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<ConsumptionComparison | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const itemsPerPage = 10;

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'site':
        return <LocationOn />;
      case 'client':
        return <Business />;
      case 'group':
        return <Group />;
      default:
        return <ElectricBolt />;
    }
  };

  const getEntityLabel = (entityType: string) => {
    const entityTypeConfig = ENTITY_TYPES.find(e => e.value === entityType);
    return entityTypeConfig?.label || entityType;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="error" />;
      case 'decreasing':
        return <TrendingDown color="success" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'error';
      case 'decreasing':
        return 'success';
      default:
        return 'info';
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getSignificanceLabel = (significance: string) => {
    switch (significance) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      default:
        return 'Baja';
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

  const filteredComparisons = comparisons.filter(comparison =>
    comparison.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comparison.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedComparisons = [...filteredComparisons].sort((a, b) => {
    const aValue = typeof a[sortBy as keyof ConsumptionComparison] === 'number' 
      ? (a[sortBy as keyof ConsumptionComparison] as unknown as number)
      : 0;
    const bValue = typeof b[sortBy as keyof ConsumptionComparison] === 'number' 
      ? (b[sortBy as keyof ConsumptionComparison] as unknown as number)
      : 0;
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const paginatedComparisons = sortedComparisons.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStats = () => {
    if (comparisons.length === 0) return null;
    
    const totalComparisons = comparisons.length;
    const increasingTrends = comparisons.filter(c => c.trend === 'increasing').length;
    const decreasingTrends = comparisons.filter(c => c.trend === 'decreasing').length;
    const stableTrends = comparisons.filter(c => c.trend === 'stable').length;
    const highSignificance = comparisons.filter(c => c.significance === 'high').length;
    const averageVariance = comparisons.reduce((sum, c) => sum + c.variance.consumption, 0) / comparisons.length;
    
    return {
      totalComparisons,
      increasingTrends,
      decreasingTrends,
      stableTrends,
      highSignificance,
      averageVariance,
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
    const comparison = comparisons.find(c => c.id === id);
    if (comparison) {
      setSelectedComparison(comparison);
      setShowDetails(true);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando comparaciones de consumo...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Compare color="primary" />
          <Typography variant="h5">
            Comparaciones de Consumo ({comparisons.length})
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
                      {stats.totalComparisons}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Comparaciones
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
                    <Typography variant="h4" color="error.main">
                      {stats.increasingTrends}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tendencia Ascendente
                    </Typography>
                  </Box>
                  <TrendingUp color="error" sx={{ fontSize: 40 }} />
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
                      {stats.decreasingTrends}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tendencia Descendente
                    </Typography>
                  </Box>
                  <TrendingDown color="success" sx={{ fontSize: 40 }} />
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
                      {stats.stableTrends}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tendencia Estable
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
                      {stats.highSignificance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alta Significancia
                    </Typography>
                  </Box>
                  <Warning color="warning" sx={{ fontSize: 40 }} />
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
                      {formatPercentage(stats.averageVariance)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Varianza Promedio
                    </Typography>
                  </Box>
                  <BarChart color="secondary" sx={{ fontSize: 40 }} />
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
                  <MenuItem value="variance">Varianza</MenuItem>
                  <MenuItem value="trend">Tendencia</MenuItem>
                  <MenuItem value="significance">Significancia</MenuItem>
                  <MenuItem value="entityName">Nombre</MenuItem>
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

      {/* Tabla de comparaciones */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Entidad</TableCell>
              <TableCell>Período Actual</TableCell>
              <TableCell>Período Comparación</TableCell>
              <TableCell>Varianza</TableCell>
              <TableCell>Tendencia</TableCell>
              <TableCell>Significancia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComparisons.map((comparison) => (
              <TableRow key={comparison.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {getEntityIcon(comparison.entityType)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {comparison.entityName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getEntityLabel(comparison.entityType)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatNumber(comparison.currentPeriod.consumption, 'kWh')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(comparison.currentPeriod.cost)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDateTime(comparison.currentPeriod.startDate)} - {formatDateTime(comparison.currentPeriod.endDate)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatNumber(comparison.comparisonPeriod.consumption, 'kWh')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(comparison.comparisonPeriod.cost)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDateTime(comparison.comparisonPeriod.startDate)} - {formatDateTime(comparison.comparisonPeriod.endDate)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {COMPARATIVE_UTILS.formatVariance(comparison.variance.consumption)}
                    </Typography>
                    <Chip
                      label={COMPARATIVE_UTILS.formatVariance(comparison.variance.cost)}
                      color={COMPARATIVE_UTILS.getVarianceColor(comparison.variance.consumption) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getTrendIcon(comparison.trend)}
                    <Typography variant="caption" color="text.secondary">
                      {comparison.trend === 'increasing' ? 'Ascendente' : 
                       comparison.trend === 'decreasing' ? 'Descendente' : 'Estable'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getSignificanceLabel(comparison.significance)}
                    color={getSignificanceColor(comparison.significance) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, comparison.id)}
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
      {filteredComparisons.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredComparisons.length / itemsPerPage)}
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

      {/* Dialog de detalles */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {selectedComparison && getEntityIcon(selectedComparison.entityType)}
            <Typography variant="h6">
              Detalles de Comparación
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedComparison && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Período Actual
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Consumo"
                        secondary={formatNumber(selectedComparison.currentPeriod.consumption, 'kWh')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Costo"
                        secondary={formatCurrency(selectedComparison.currentPeriod.cost)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Eficiencia"
                        secondary={formatPercentage(selectedComparison.currentPeriod.efficiency)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Factor de Potencia"
                        secondary={selectedComparison.currentPeriod.powerFactor.toFixed(2)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Demanda Máxima"
                        secondary={formatNumber(selectedComparison.currentPeriod.peakDemand, 'kW')}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Período de Comparación
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Consumo"
                        secondary={formatNumber(selectedComparison.comparisonPeriod.consumption, 'kWh')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Costo"
                        secondary={formatCurrency(selectedComparison.comparisonPeriod.cost)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Eficiencia"
                        secondary={formatPercentage(selectedComparison.comparisonPeriod.efficiency)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Factor de Potencia"
                        secondary={selectedComparison.comparisonPeriod.powerFactor.toFixed(2)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Demanda Máxima"
                        secondary={formatNumber(selectedComparison.comparisonPeriod.peakDemand, 'kW')}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Análisis de Varianza
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="primary">
                          {COMPARATIVE_UTILS.formatVariance(selectedComparison.variance.consumption)}
                        </Typography>
                        <Typography variant="caption">Consumo</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="primary">
                          {COMPARATIVE_UTILS.formatVariance(selectedComparison.variance.cost)}
                        </Typography>
                        <Typography variant="caption">Costo</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="primary">
                          {COMPARATIVE_UTILS.formatVariance(selectedComparison.variance.efficiency)}
                        </Typography>
                        <Typography variant="caption">Eficiencia</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="h6" color="primary">
                          {COMPARATIVE_UTILS.formatVariance(selectedComparison.variance.powerFactor)}
                        </Typography>
                        <Typography variant="caption">Factor de Potencia</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
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

export default ConsumptionComparisonComponent;
