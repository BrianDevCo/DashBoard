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
} from '@mui/icons-material';
import { 
  ConsumptionBySite, 
  ConsumptionByClient, 
  ConsumptionByGroup,
  KPI_FORMAT 
} from '../types/kpis';

interface ConsumptionByCategoryProps {
  data: ConsumptionBySite[] | ConsumptionByClient[] | ConsumptionByGroup[];
  type: 'site' | 'client' | 'group';
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onViewDetails?: (id: string) => void;
}

const ConsumptionByCategory: React.FC<ConsumptionByCategoryProps> = ({
  data,
  type,
  loading = false,
  onRefresh,
  onExport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalConsumption');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const itemsPerPage = 10;

  const getTypeIcon = () => {
    switch (type) {
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

  const getTypeLabel = () => {
    switch (type) {
      case 'site':
        return 'Sitios';
      case 'client':
        return 'Clientes';
      case 'group':
        return 'Grupos';
      default:
        return 'Elementos';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="success" />;
      case 'decreasing':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'success';
      case 'decreasing':
        return 'error';
      default:
        return 'info';
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

  const filteredData = (data as any[] || []).filter((item: any) => {
    const searchFields = type === 'site' 
      ? [item.siteName, item.location]
      : type === 'client'
      ? [item.clientName]
      : [item.groupName, item.description];
    
    return searchFields.some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a] as number;
    const bValue = b[sortBy as keyof typeof b] as number;
    
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

  const getTotalConsumption = () => {
    return (data as any[] || []).reduce((sum: number, item: any) => sum + (item.totalConsumption || 0), 0);
  };

  const getTotalCost = () => {
    return (data as any[] || []).reduce((sum: number, item: any) => sum + (item.cost || 0), 0);
  };

  const getAverageEfficiency = () => {
    if ((data as any[] || []).length === 0) return 0;
    return (data as any[] || []).reduce((sum: number, item: any) => sum + (item.efficiency || 0), 0) / (data as any[] || []).length;
  };

  const getAveragePowerFactor = () => {
    if ((data as any[] || []).length === 0) return 0;
    return (data as any[] || []).reduce((sum: number, item: any) => sum + (item.powerFactor || 0), 0) / (data as any[] || []).length;
  };

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

  const getStats = () => {
    return {
      totalConsumption: getTotalConsumption(),
      totalCost: getTotalCost(),
      averageEfficiency: getAverageEfficiency(),
      averagePowerFactor: getAveragePowerFactor(),
      totalItems: data.length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando datos de consumo...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          {getTypeIcon()}
          <Typography variant="h5">
            Consumo por {getTypeLabel()} ({data.length})
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
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {formatNumber(stats.totalConsumption, 'kWh')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consumo Total
                  </Typography>
                </Box>
                <ElectricBolt color="primary" sx={{ fontSize: 40 }} />
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
                    {formatCurrency(stats.totalCost)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Costo Total
                  </Typography>
                </Box>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
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
                    {formatPercentage(stats.averageEfficiency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eficiencia Promedio
                  </Typography>
                </Box>
                <Speed color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.averagePowerFactor.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Factor de Potencia Promedio
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                  <MenuItem value="totalConsumption">Consumo Total</MenuItem>
                  <MenuItem value="cost">Costo</MenuItem>
                  <MenuItem value="efficiency">Eficiencia</MenuItem>
                  <MenuItem value="powerFactor">Factor de Potencia</MenuItem>
                  <MenuItem value="peakDemand">Demanda Máxima</MenuItem>
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
              <TableCell>Nombre</TableCell>
              <TableCell>Consumo Total</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Eficiencia</TableCell>
              <TableCell>Factor de Potencia</TableCell>
              <TableCell>Demanda Máxima</TableCell>
              <TableCell>Tendencia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={(item as any).id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {getTypeIcon()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {type === 'site' ? (item as any).siteName :
                         type === 'client' ? (item as any).clientName :
                         (item as any).groupName}
                      </Typography>
                      {type === 'site' && (
                        <Typography variant="caption" color="text.secondary">
                          {(item as any).location}
                        </Typography>
                      )}
                      {type === 'group' && (
                        <Typography variant="caption" color="text.secondary">
                          {(item as any).description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatNumber(item.totalConsumption, 'kWh')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatNumber(item.activeEnergy, 'kWh')} activa
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency((item as any).cost)}
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
                    <Typography variant="body2">
                      {(item as any).powerFactor.toFixed(2)}
                    </Typography>
                    <Chip
                      label={(item as any).powerFactor >= 0.95 ? 'Excelente' : 
                             (item as any).powerFactor >= 0.9 ? 'Bueno' : 
                             (item as any).powerFactor >= 0.85 ? 'Regular' : 'Malo'}
                      color={getPowerFactorColor((item as any).powerFactor) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatNumber(item.peakDemand, 'kW')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getTrendIcon(item.trend)}
                    <Typography variant="caption" color="text.secondary">
                      {item.trend === 'increasing' ? 'Ascendente' : 
                       item.trend === 'decreasing' ? 'Descendente' : 'Estable'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, (item as any).id)}
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

export default ConsumptionByCategory;
