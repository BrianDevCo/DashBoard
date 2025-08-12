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
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useGetHistoricalMetricsQuery, useGetChartDataQuery, useGetMetersQuery } from '../services/energyApi';
import EnergyChart from '../components/EnergyChart';
import MetricsTable from '../components/MetricsTable';

const EnergyMetrics: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedMeter, setSelectedMeter] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'kWhD' | 'kVarhD' | 'kWhR' | 'kVarhR' | 'kVarhPenalized'>('kWhD');
  const [selectedInterval, setSelectedInterval] = useState<'hourly' | 'daily' | 'monthly'>('daily');

  const { data: meters, isLoading: isLoadingMeters } = useGetMetersQuery();
  
  const { data: historicalMetrics, isLoading: isLoadingHistorical } = useGetHistoricalMetricsQuery({
    startDate: startDate?.toISOString() || '',
    endDate: endDate?.toISOString() || '',
    meterId: selectedMeter === 'all' ? undefined : selectedMeter,
    interval: selectedInterval,
  });

  const { data: chartData, isLoading: isLoadingChart } = useGetChartDataQuery({
    metric: selectedMetric,
    period: selectedInterval,
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
          Métricas Energéticas Detalladas
        </Typography>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtros de Búsqueda
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha Fin"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
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
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Métrica</InputLabel>
                  <Select
                    value={selectedMetric}
                    label="Métrica"
                    onChange={(e) => setSelectedMetric(e.target.value as any)}
                  >
                    <MenuItem value="kWhD">Energía Activa Importada</MenuItem>
                    <MenuItem value="kVarhD">Energía Reactiva Importada</MenuItem>
                    <MenuItem value="kWhR">Energía Activa Exportada</MenuItem>
                    <MenuItem value="kVarhR">Energía Reactiva Exportada</MenuItem>
                    <MenuItem value="kVarhPenalized">Energía Reactiva Penalizada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Intervalo</InputLabel>
                  <Select
                    value={selectedInterval}
                    label="Intervalo"
                    onChange={(e) => setSelectedInterval(e.target.value as any)}
                  >
                    <MenuItem value="hourly">Por Hora</MenuItem>
                    <MenuItem value="daily">Por Día</MenuItem>
                    <MenuItem value="monthly">Por Mes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                Buscar Métricas
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Gráfico */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gráfico de {selectedMetric === 'kWhD' ? 'Energía Activa Importada' :
                             selectedMetric === 'kVarhD' ? 'Energía Reactiva Importada' :
                             selectedMetric === 'kWhR' ? 'Energía Activa Exportada' :
                             selectedMetric === 'kVarhR' ? 'Energía Reactiva Exportada' :
                             'Energía Reactiva Penalizada'}
                </Typography>
                {isLoadingChart ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                  </Box>
                ) : chartData ? (
                  <EnergyChart data={chartData} />
                ) : (
                  <Alert severity="info">
                    Selecciona un rango de fechas y métrica para visualizar los datos
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de Métricas */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Datos Históricos
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
      </Box>
    </LocalizationProvider>
  );
};

export default EnergyMetrics;

