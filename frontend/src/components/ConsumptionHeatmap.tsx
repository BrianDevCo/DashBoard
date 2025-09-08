import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Slider,
  Paper,
} from '@mui/material';
import {
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
  LocationOn,
  Business,
  Group,
  ElectricBolt,
  AttachMoney,
  Speed,
  Warning,
  CheckCircle,
  Error,
  Info,
  MoreVert,
  Settings,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { 
  HeatmapData, 
  COMPARATIVE_UTILS,
  METRICS,
  ENTITY_TYPES,
  HEATMAP_COLORS 
} from '../types/comparative';

interface ConsumptionHeatmapProps {
  heatmaps: HeatmapData[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onViewDetails?: (id: string) => void;
}

const ConsumptionHeatmap: React.FC<ConsumptionHeatmapProps> = ({
  heatmaps,
  loading = false,
  onRefresh,
  onExport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHeatmap, setSelectedHeatmap] = useState<HeatmapData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [normalize, setNormalize] = useState(true);
  const [showWeekends, setShowWeekends] = useState(true);
  const [colorScheme, setColorScheme] = useState<'default' | 'viridis' | 'plasma' | 'inferno'>('default');

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
        return <TrendingUpIcon />;
      default:
        return <BarChart />;
    }
  };

  const getMetricLabel = (metric: string) => {
    const metricConfig = METRICS.find(m => m.value === metric);
    return metricConfig?.label || metric;
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

  const getHeatmapColor = (value: number, min: number, max: number) => {
    const normalized = (value - min) / (max - min);
    if (normalized <= 0.2) return HEATMAP_COLORS.low;
    if (normalized <= 0.4) return HEATMAP_COLORS.medium;
    if (normalized <= 0.6) return HEATMAP_COLORS.high;
    if (normalized <= 0.8) return HEATMAP_COLORS.veryHigh;
    return HEATMAP_COLORS.extreme;
  };

  const filteredHeatmaps = heatmaps.filter(heatmap =>
    heatmap.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    heatmap.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStats = () => {
    if (heatmaps.length === 0) return null;
    
    const totalHeatmaps = heatmaps.length;
    const totalDataPoints = heatmaps.reduce((sum, h) => sum + h.data.length, 0);
    const averageValue = heatmaps.reduce((sum, h) => sum + h.statistics.average, 0) / heatmaps.length;
    const maxValue = Math.max(...heatmaps.map(h => h.statistics.max));
    const minValue = Math.min(...heatmaps.map(h => h.statistics.min));
    
    return {
      totalHeatmaps,
      totalDataPoints,
      averageValue,
      maxValue,
      minValue,
    };
  };

  const stats = getStats();

  const renderHeatmapGrid = (heatmap: HeatmapData) => {
    const { data, statistics } = heatmap;
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return (
      <Box>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={1}>
            <Box />
          </Grid>
          {hours.map(hour => (
            <Grid item xs={1} key={hour}>
              <Typography variant="caption" textAlign="center" display="block">
                {hour}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        {days.map((day, dayIndex) => (
          <Grid container spacing={1} key={day} sx={{ mb: 1 }}>
            <Grid item xs={1}>
              <Typography variant="caption" textAlign="center" display="block">
                {day}
              </Typography>
            </Grid>
            {hours.map(hour => {
              const dataPoint = data.find(d => d.hour === hour && d.day === dayIndex + 1);
              const value = dataPoint?.value || 0;
              const color = getHeatmapColor(value, statistics.min, statistics.max);
              
              return (
                <Grid item xs={1} key={hour}>
                  <Tooltip
                    title={`${day} ${hour}:00 - ${formatNumber(value, 'kWh')}`}
                    arrow
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 20,
                        backgroundColor: color,
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    />
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Box>
    );
  };

  const renderHeatmapList = (heatmap: HeatmapData) => {
    const { data, statistics } = heatmap;
    
    return (
      <List dense>
        {data.map((dataPoint, index) => (
          <ListItem key={index} divider>
            <ListItemIcon>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: getHeatmapColor(dataPoint.value, statistics.min, statistics.max),
                  border: '1px solid #ccc',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={`${dataPoint.dayName} ${dataPoint.hour}:00`}
              secondary={formatNumber(dataPoint.value, 'kWh')}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando mapas de calor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <BarChart color="primary" />
          <Typography variant="h5">
            Mapas de Calor de Consumo ({heatmaps.length})
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={() => setShowSettings(true)}>
            <Settings />
          </IconButton>
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
                      {stats.totalHeatmaps}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Mapas
                    </Typography>
                  </Box>
                  <BarChart color="primary" sx={{ fontSize: 40 }} />
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
                      {stats.totalDataPoints}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Puntos de Datos
                    </Typography>
                  </Box>
                  <Timeline color="success" sx={{ fontSize: 40 }} />
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
                      {formatNumber(stats.averageValue, 'kWh')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Promedio
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
                    <Typography variant="h4" color="warning.main">
                      {formatNumber(stats.maxValue, 'kWh')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Máximo
                    </Typography>
                  </Box>
                  <TrendingUpIcon color="warning" sx={{ fontSize: 40 }} />
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
                      {formatNumber(stats.minValue, 'kWh')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Mínimo
                    </Typography>
                  </Box>
                  <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
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
                      {formatPercentage((stats.maxValue - stats.minValue) / stats.maxValue * 100)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rango de Variación
                    </Typography>
                  </Box>
                  <Compare color="secondary" sx={{ fontSize: 40 }} />
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
                <InputLabel>Modo de Vista</InputLabel>
                <Select
                  value={viewMode}
                  label="Modo de Vista"
                  onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
                >
                  <MenuItem value="grid">Cuadrícula</MenuItem>
                  <MenuItem value="list">Lista</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" gap={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={normalize}
                      onChange={(e) => setNormalize(e.target.checked)}
                    />
                  }
                  label="Normalizar"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showWeekends}
                      onChange={(e) => setShowWeekends(e.target.checked)}
                    />
                  }
                  label="Incluir Fines de Semana"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mapas de calor */}
      <Grid container spacing={3}>
        {filteredHeatmaps.map((heatmap) => (
          <Grid item xs={12} md={6} lg={4} key={heatmap.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ bgcolor: 'primary.main', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getEntityIcon(heatmap.entityType)}
                    </Box>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {heatmap.entityName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getEntityLabel(heatmap.entityType)}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedHeatmap(heatmap);
                      setShowDetails(true);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getMetricLabel('consumption')} - {heatmap.period}
                </Typography>

                {viewMode === 'grid' ? (
                  renderHeatmapGrid(heatmap)
                ) : (
                  renderHeatmapList(heatmap)
                )}

                <Box mt={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Min: {formatNumber(heatmap.statistics.min, 'kWh')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Max: {formatNumber(heatmap.statistics.max, 'kWh')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Promedio: {formatNumber(heatmap.statistics.average, 'kWh')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Mediana: {formatNumber(heatmap.statistics.median, 'kWh')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {heatmap.patterns && (
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Patrones Detectados:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {heatmap.patterns.weeklyPattern && (
                        <Chip label="Semanal" size="small" color="primary" />
                      )}
                      {heatmap.patterns.dailyPattern && (
                        <Chip label="Diario" size="small" color="secondary" />
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de detalles */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {selectedHeatmap && getEntityIcon(selectedHeatmap.entityType)}
            <Typography variant="h6">
              Mapa de Calor Detallado
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedHeatmap && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    Visualización del Mapa de Calor
                  </Typography>
                  {renderHeatmapGrid(selectedHeatmap)}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Estadísticas
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Valor Mínimo"
                        secondary={formatNumber(selectedHeatmap.statistics.min, 'kWh')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Valor Máximo"
                        secondary={formatNumber(selectedHeatmap.statistics.max, 'kWh')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Promedio"
                        secondary={formatNumber(selectedHeatmap.statistics.average, 'kWh')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Mediana"
                        secondary={formatNumber(selectedHeatmap.statistics.median, 'kWh')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Desviación Estándar"
                        secondary={formatNumber(selectedHeatmap.statistics.standardDeviation, 'kWh')}
                      />
                    </ListItem>
                  </List>

                  {selectedHeatmap.patterns && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Patrones Detectados
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Patrón Semanal"
                            secondary={selectedHeatmap.patterns.weeklyPattern ? 'Sí' : 'No'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Patrón Diario"
                            secondary={selectedHeatmap.patterns.dailyPattern ? 'Sí' : 'No'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Horas Pico"
                            secondary={selectedHeatmap.patterns.peakHours.join(', ')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Horas Bajas"
                            secondary={selectedHeatmap.patterns.lowHours.join(', ')}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de configuración */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configuración del Mapa de Calor</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Esquema de Colores</InputLabel>
                <Select
                  value={colorScheme}
                  label="Esquema de Colores"
                  onChange={(e) => setColorScheme(e.target.value as any)}
                >
                  <MenuItem value="default">Por Defecto</MenuItem>
                  <MenuItem value="viridis">Viridis</MenuItem>
                  <MenuItem value="plasma">Plasma</MenuItem>
                  <MenuItem value="inferno">Inferno</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={normalize}
                    onChange={(e) => setNormalize(e.target.checked)}
                  />
                }
                label="Normalizar valores"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showWeekends}
                    onChange={(e) => setShowWeekends(e.target.checked)}
                  />
                }
                label="Incluir fines de semana"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsumptionHeatmap;
