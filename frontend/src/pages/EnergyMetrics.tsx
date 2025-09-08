import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useGetHistoricalMetricsQuery, useGetChartDataQuery, useGetMetersQuery, useGetBillingComparisonQuery } from '../services/energyApi';
import EnergyChart, { ChartType } from '../components/EnergyChart';
import EnergyMatrix from '../components/EnergyMatrix';
import EnergySummary from '../components/EnergySummary';
import TimeIntervalSelector, { TimeInterval } from '../components/TimeIntervalSelector';
import MetricsTable from '../components/MetricsTable';
import BillingComparison from '../components/BillingComparison';

const EnergyMetrics: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedMeter, setSelectedMeter] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'kWhD' | 'kVarhD' | 'kWhR' | 'kVarhR' | 'kVarhPenalized'>('kWhD');
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('day');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showActiveEnergy, setShowActiveEnergy] = useState<boolean>(true);
  const [showReactiveEnergy, setShowReactiveEnergy] = useState<boolean>(true);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { data: meters, isLoading: isLoadingMeters } = useGetMetersQuery();
  
  // Convertir TimeInterval a formato de API
  const getApiInterval = (interval: TimeInterval): 'hourly' | 'daily' | 'monthly' => {
    switch (interval) {
      case '15min':
      case 'hour':
        return 'hourly';
      case 'day':
      case 'week':
        return 'daily';
      case 'month':
      case 'year':
        return 'monthly';
      case 'custom':
        return 'daily';
      default:
        return 'daily';
    }
  };

  const { data: historicalMetrics, isLoading: isLoadingHistorical } = useGetHistoricalMetricsQuery({
    startDate: startDate?.toISOString() || '',
    endDate: endDate?.toISOString() || '',
    meterId: selectedMeter === 'all' ? undefined : selectedMeter,
    interval: getApiInterval(selectedInterval),
  });

  const { data: chartData, isLoading: isLoadingChart } = useGetChartDataQuery({
    metric: selectedMetric,
    period: getApiInterval(selectedInterval),
    startDate: startDate?.toISOString() || '',
    endDate: endDate?.toISOString() || '',
    meterId: selectedMeter === 'all' ? undefined : selectedMeter,
  });

  // Obtener datos de comparación (consumos típicos)
  const { data: comparisonData } = useGetHistoricalMetricsQuery({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    meterId: selectedMeter === 'all' ? undefined : selectedMeter,
    interval: getApiInterval(selectedInterval),
  });

  // Obtener datos de facturación vs consumos
  const { data: billingComparison, isLoading: isLoadingBilling } = useGetBillingComparisonQuery({
    startDate: startDate?.toISOString() || '',
    endDate: endDate?.toISOString() || '',
    meterId: selectedMeter === 'all' ? undefined : selectedMeter,
  });

  const handleSearch = () => {
    // Los datos se actualizan automáticamente con RTK Query
  };

  if (isLoadingMeters) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Visualización del Consumo de Energía
        </Typography>

        {/* Selector de Intervalo de Tiempo */}
        <Box sx={{ mb: 3 }}>
          <TimeIntervalSelector
            selectedInterval={selectedInterval}
            onIntervalChange={setSelectedInterval}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            showCustomRange={true}
          />
        </Box>

        {/* Filtros Adicionales */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configuración de Visualización
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Medidor</InputLabel>
                  <Select
                    value={selectedMeter}
                    label="Medidor"
                    onChange={(e) => setSelectedMeter(e.target.value)}
                  >
                    <MenuItem value="all">Todos los Medidores</MenuItem>
                    {meters?.map((meter) => (
                      <MenuItem key={meter.id} value={meter.id}>
                        {meter.name} - {meter.location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Gráfico</InputLabel>
                  <Select
                    value={chartType}
                    label="Tipo de Gráfico"
                    onChange={(e) => setChartType(e.target.value as ChartType)}
                  >
                    <MenuItem value="line">Líneas</MenuItem>
                    <MenuItem value="bar">Barras</MenuItem>
                    <MenuItem value="area">Áreas</MenuItem>
                    <MenuItem value="doughnut">Torta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label="Energía Activa"
                    color={showActiveEnergy ? "primary" : "default"}
                    onClick={() => setShowActiveEnergy(!showActiveEnergy)}
                    variant={showActiveEnergy ? "filled" : "outlined"}
                  />
                  <Chip
                    label="Energía Reactiva"
                    color={showReactiveEnergy ? "secondary" : "default"}
                    onClick={() => setShowReactiveEnergy(!showReactiveEnergy)}
                    variant={showReactiveEnergy ? "filled" : "outlined"}
                  />
                  <Chip
                    label="Comparación"
                    color={showComparison ? "warning" : "default"}
                    onClick={() => setShowComparison(!showComparison)}
                    variant={showComparison ? "filled" : "outlined"}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={!startDate || !endDate}
                  fullWidth
                >
                  Actualizar Datos
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Pestañas de Visualización */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Resumen" />
              <Tab label="Gráficos" />
              <Tab label="Matrices" />
              <Tab label="Facturación" />
              <Tab label="Datos Históricos" />
            </Tabs>
          </Box>
        </Card>

        {/* Contenido de las Pestañas */}
        {activeTab === 0 && (
          <Box sx={{ mb: 3 }}>
            <EnergySummary
              currentData={historicalMetrics || []}
              comparisonData={showComparison ? (comparisonData || []) : undefined}
              period={selectedInterval}
              showComparison={showComparison}
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Gráfico de Consumos Energéticos
                  </Typography>
                  {isLoadingChart ? (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : historicalMetrics && historicalMetrics.length > 0 ? (
                    <EnergyChart
                      data={historicalMetrics}
                      chartType={chartType}
                      showActiveEnergy={showActiveEnergy}
                      showReactiveEnergy={showReactiveEnergy}
                      showComparison={showComparison}
                      comparisonData={comparisonData || []}
                    />
                  ) : (
                    <Alert severity="info">
                      Selecciona un rango de fechas y métrica para visualizar los datos
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Box sx={{ mb: 3 }}>
            <EnergyMatrix
              data={historicalMetrics || []}
              showActiveEnergy={showActiveEnergy}
              showReactiveEnergy={showReactiveEnergy}
              title="Matriz de Consumos Energéticos"
            />
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ mb: 3 }}>
            {isLoadingBilling ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : billingComparison ? (
              <BillingComparison
                billingData={billingComparison.billing}
                consumptionData={billingComparison.consumption}
                variance={billingComparison.variance}
                costPerKWh={billingComparison.costPerKWh}
                period={selectedInterval}
              />
            ) : (
              <Alert severity="info">
                No hay datos de facturación disponibles para el período seleccionado
              </Alert>
            )}
          </Box>
        )}

        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Datos Históricos Detallados
                  </Typography>
                  {isLoadingHistorical ? (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : historicalMetrics && historicalMetrics.length > 0 ? (
                    <MetricsTable data={historicalMetrics} />
                  ) : (
                    <Alert severity="info">
                      No se encontraron datos para el período seleccionado
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default EnergyMetrics;

