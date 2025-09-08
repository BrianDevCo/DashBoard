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
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  EmojiEvents,
  Star,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';
import { 
  RankingEntry, 
  COMPARATIVE_UTILS,
  METRICS,
  ENTITY_TYPES 
} from '../types/comparative';

interface ConsumerRankingsProps {
  rankings: RankingEntry[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onViewDetails?: (id: string) => void;
}

const ConsumerRankings: React.FC<ConsumerRankingsProps> = ({
  rankings,
  loading = false,
  onRefresh,
  onExport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<RankingEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const itemsPerPage = 20;

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

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'consumption':
        return <ElectricBolt />;
      case 'cost':
        return <AttachMoney />;
      case 'efficiency':
        return <Speed />;
      case 'powerFactor':
        return <Power />;
      case 'peakDemand':
        return <TrendingUp />;
      default:
        return <BarChart />;
    }
  };

  const getMetricLabel = (metric: string) => {
    const metricConfig = METRICS.find(m => m.value === metric);
    return metricConfig?.label || metric;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <EmojiEvents color="warning" />;
    if (rank === 2) return <Star color="info" />;
    if (rank === 3) return <StarHalf color="success" />;
    return <StarBorder color="action" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'warning';
    if (rank === 2) return 'info';
    if (rank === 3) return 'success';
    return 'default';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="error" />;
      case 'down':
        return <TrendingDown color="success" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'error';
      case 'down':
        return 'success';
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

  const filteredRankings = rankings.filter(ranking =>
    ranking.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ranking.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRankings = [...filteredRankings].sort((a, b) => {
    const aValue = a[sortBy as keyof RankingEntry] as number;
    const bValue = b[sortBy as keyof RankingEntry] as number;
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const paginatedRankings = sortedRankings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStats = () => {
    if (rankings.length === 0) return null;
    
    const totalRankings = rankings.length;
    const top3 = rankings.filter(r => r.rank <= 3).length;
    const improving = rankings.filter(r => r.trend === 'up').length;
    const declining = rankings.filter(r => r.trend === 'down').length;
    const stable = rankings.filter(r => r.trend === 'stable').length;
    const averageValue = rankings.reduce((sum, r) => sum + r.value, 0) / rankings.length;
    
    return {
      totalRankings,
      top3,
      improving,
      declining,
      stable,
      averageValue,
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
    const ranking = rankings.find(r => r.id === id);
    if (ranking) {
      setSelectedRanking(ranking);
      setShowDetails(true);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando rankings de consumidores...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiEvents color="primary" />
          <Typography variant="h5">
            Rankings de Consumidores ({rankings.length})
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
                      {stats.totalRankings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Rankings
                    </Typography>
                  </Box>
                  <EmojiEvents color="primary" sx={{ fontSize: 40 }} />
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
                      {stats.top3}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Top 3
                    </Typography>
                  </Box>
                  <Star color="warning" sx={{ fontSize: 40 }} />
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
                      {stats.improving}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mejorando
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
                    <Typography variant="h4" color="error.main">
                      {stats.declining}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Declinando
                    </Typography>
                  </Box>
                  <TrendingDown color="error" sx={{ fontSize: 40 }} />
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
                      {stats.stable}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estables
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
                    <Typography variant="h4" color="secondary.main">
                      {formatNumber(stats.averageValue, '')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Promedio
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
                  <MenuItem value="rank">Ranking</MenuItem>
                  <MenuItem value="value">Valor</MenuItem>
                  <MenuItem value="percentage">Porcentaje</MenuItem>
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
                  <MenuItem value="asc">Ascendente</MenuItem>
                  <MenuItem value="desc">Descendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de rankings */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ranking</TableCell>
              <TableCell>Entidad</TableCell>
              <TableCell>Métrica</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Porcentaje</TableCell>
              <TableCell>Tendencia</TableCell>
              <TableCell>Cambio de Ranking</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRankings.map((ranking) => (
              <TableRow key={ranking.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRankIcon(ranking.rank)}
                    <Typography variant="h6" fontWeight="bold" color={`${getRankColor(ranking.rank)}.main`}>
                      #{ranking.rank}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {getEntityIcon(ranking.entityType)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {ranking.entityName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getEntityLabel(ranking.entityType)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getMetricIcon(ranking.metric)}
                    <Typography variant="body2">
                      {getMetricLabel(ranking.metric)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {COMPARATIVE_UTILS.formatValue(ranking.value, ranking.unit)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {formatPercentage(ranking.percentage)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(ranking.percentage, 100)}
                      sx={{ width: 60, height: 4, borderRadius: 2 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getTrendIcon(ranking.trend)}
                    <Typography variant="caption" color="text.secondary">
                      {ranking.trend === 'up' ? 'Ascendente' : 
                       ranking.trend === 'down' ? 'Descendente' : 'Estable'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {ranking.rankChange !== undefined && (
                    <Box display="flex" alignItems="center" gap={1}>
                      {ranking.rankChange > 0 ? (
                        <TrendingUp color="error" fontSize="small" />
                      ) : ranking.rankChange < 0 ? (
                        <TrendingDown color="success" fontSize="small" />
                      ) : (
                        <TrendingFlat color="info" fontSize="small" />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {ranking.rankChange > 0 ? `+${ranking.rankChange}` : ranking.rankChange}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, ranking.id)}
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
      {filteredRankings.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredRankings.length / itemsPerPage)}
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
            {selectedRanking && getRankIcon(selectedRanking.rank)}
            <Typography variant="h6">
              Detalles del Ranking
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRanking && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información de la Entidad
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Nombre"
                        secondary={selectedRanking.entityName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tipo"
                        secondary={getEntityLabel(selectedRanking.entityType)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Ranking"
                        secondary={`#${selectedRanking.rank}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Métrica"
                        secondary={getMetricLabel(selectedRanking.metric)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Valores y Tendencias
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Valor"
                        secondary={COMPARATIVE_UTILS.formatValue(selectedRanking.value, selectedRanking.unit)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Porcentaje"
                        secondary={formatPercentage(selectedRanking.percentage)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tendencia"
                        secondary={selectedRanking.trend === 'up' ? 'Ascendente' : 
                                 selectedRanking.trend === 'down' ? 'Descendente' : 'Estable'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Última Actualización"
                        secondary={formatDateTime(selectedRanking.lastUpdated)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                {selectedRanking.rankChange !== undefined && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cambio de Ranking
                    </Typography>
                    <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                      <Typography variant="h4" color="primary">
                        {selectedRanking.rankChange > 0 ? `+${selectedRanking.rankChange}` : selectedRanking.rankChange}
                      </Typography>
                      <Typography variant="caption">
                        {selectedRanking.rankChange > 0 ? 'Posiciones ganadas' : 
                         selectedRanking.rankChange < 0 ? 'Posiciones perdidas' : 'Sin cambio'}
                      </Typography>
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

export default ConsumerRankings;


