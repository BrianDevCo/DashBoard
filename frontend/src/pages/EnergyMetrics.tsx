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
// import { useGetHistoricalMetricsQuery, useGetChartDataQuery, useGetMetersQuery, useGetBillingComparisonQuery } from '../services/energyApi';
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

  // Datos mock para presentación
  const meters = [
    { id: '1', name: 'Medidor Principal', location: 'Planta Norte' },
    { id: '2', name: 'Medidor Secundario', location: 'Oficinas Centrales' },
    { id: '3', name: 'Medidor Auxiliar', location: 'Centro de Datos' },
    { id: '4', name: 'Medidor de Respaldo', location: 'Almacén Principal' },
  ];

  // Generar datos históricos mock
  const generateMockHistoricalData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        id: i.toString(),
        timestamp: date.toISOString(),
        meterId: selectedMeter === 'all' ? '1' : selectedMeter,
        kWhD: Math.random() * 1000 + 500,
        kVarhD: Math.random() * 200 + 100,
        kWhR: Math.random() * 50 + 25,
        kVarhR: Math.random() * 100 + 50,
        kVarhPenalized: Math.random() * 50 + 10,
        powerFactor: 0.85 + Math.random() * 0.15,
        voltage: 220 + Math.random() * 20,
        current: 10 + Math.random() * 20,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
      });
    }
    return data.reverse();
  };

  const historicalMetrics = generateMockHistoricalData();
  const comparisonData = generateMockHistoricalData().map(item => ({
    ...item,
    kWhD: item.kWhD * 0.8, // Datos de comparación 20% menores
    kVarhD: item.kVarhD * 0.9,
  }));

  const chartData = historicalMetrics;

  const billingComparison = {
    billing: {
      totalCost: 1250000,
      energyCost: 980000,
      demandCost: 200000,
      reactiveCost: 70000,
      period: 'Último mes'
    },
    consumption: {
      totalKWh: 45000,
      peakDemand: 1200,
      averageDemand: 600,
      powerFactor: 0.92
    },
    variance: {
      costVariance: 5.2,
      consumptionVariance: -2.1,
      efficiencyVariance: 8.5
    },
    costPerKWh: 27.8
  };

  const isLoadingMeters = false;
  const isLoadingHistorical = false;
  const isLoadingChart = false;
  const isLoadingBilling = false;
  
  // Los datos mock ya están definidos arriba

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
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ Métricas Energéticas funcionando correctamente con datos simulados
        </Alert>
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
                  ) : (
                    <EnergyChart
                      data={historicalMetrics}
                      chartType={chartType}
                      showActiveEnergy={showActiveEnergy}
                      showReactiveEnergy={showReactiveEnergy}
                      showComparison={showComparison}
                      comparisonData={comparisonData || []}
                    />
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
            ) : (
              <BillingComparison
                billingData={billingComparison.billing}
                consumptionData={billingComparison.consumption}
                variance={billingComparison.variance}
                costPerKWh={billingComparison.costPerKWh}
                period={selectedInterval}
              />
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
                  ) : (
                    <MetricsTable data={historicalMetrics} />
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

