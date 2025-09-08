import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ElectricBolt,
  BatteryChargingFull,
  Warning,
} from '@mui/icons-material';
import { EnergyMetric } from '../services/energyApi';

interface EnergySummaryProps {
  currentData: EnergyMetric[];
  comparisonData?: EnergyMetric[];
  period: string;
  showComparison?: boolean;
}

const EnergySummary: React.FC<EnergySummaryProps> = ({
  currentData,
  comparisonData = [],
  period,
  showComparison = false,
}) => {
  if (!currentData || currentData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="body2" color="text.secondary">
          No hay datos disponibles para mostrar
        </Typography>
      </Box>
    );
  }

  // Calcular métricas del período actual
  const currentMetrics = currentData.reduce((acc, item) => ({
    totalKWhD: acc.totalKWhD + item.kWhD,
    totalKWhR: acc.totalKWhR + item.kWhR,
    totalKVarhD: acc.totalKVarhD + item.kVarhD,
    totalKVarhR: acc.totalKVarhR + item.kVarhR,
    totalKVarhPenalized: acc.totalKVarhPenalized + item.kVarhPenalized,
    maxKWhD: Math.max(acc.maxKWhD, item.kWhD),
    minKWhD: Math.min(acc.minKWhD, item.kWhD),
  }), {
    totalKWhD: 0,
    totalKWhR: 0,
    totalKVarhD: 0,
    totalKVarhR: 0,
    totalKVarhPenalized: 0,
    maxKWhD: 0,
    minKWhD: Infinity,
  });

  // Calcular métricas de comparación si están disponibles
  const comparisonMetrics = comparisonData.length > 0 ? comparisonData.reduce((acc, item) => ({
    totalKWhD: acc.totalKWhD + item.kWhD,
    totalKWhR: acc.totalKWhR + item.kWhR,
    totalKVarhD: acc.totalKVarhD + item.kVarhD,
    totalKVarhR: acc.totalKVarhR + item.kVarhR,
    totalKVarhPenalized: acc.totalKVarhPenalized + item.kVarhPenalized,
  }), {
    totalKWhD: 0,
    totalKWhR: 0,
    totalKVarhD: 0,
    totalKVarhR: 0,
    totalKVarhPenalized: 0,
  }) : null;

  // Calcular promedios
  const currentAvg = {
    avgKWhD: currentMetrics.totalKWhD / currentData.length,
    avgKWhR: currentMetrics.totalKWhR / currentData.length,
    avgKVarhD: currentMetrics.totalKVarhD / currentData.length,
    avgKVarhR: currentMetrics.totalKVarhR / currentData.length,
  };

  // Calcular factor de potencia promedio
  const powerFactor = currentMetrics.totalKWhD / 
    Math.sqrt(currentMetrics.totalKWhD * currentMetrics.totalKWhD + 
              currentMetrics.totalKVarhD * currentMetrics.totalKVarhD);

  // Calcular eficiencia energética
  const efficiency = ((currentMetrics.totalKWhD - currentMetrics.totalKWhR) / 
                     currentMetrics.totalKWhD) * 100;

  // Calcular porcentaje de energía reactiva
  const reactivePercentage = (currentMetrics.totalKVarhD / 
                             (currentMetrics.totalKWhD + currentMetrics.totalKVarhD)) * 100;

  // Función para calcular el cambio porcentual
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Función para obtener el icono de tendencia
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp color="error" />;
    if (change < 0) return <TrendingDown color="success" />;
    return <TrendingFlat color="info" />;
  };

  // Función para obtener el color del chip de tendencia
  const getTrendColor = (change: number) => {
    if (change > 5) return 'error';
    if (change < -5) return 'success';
    return 'info';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen de Consumos - {period}
      </Typography>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {currentMetrics.totalKWhD.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energía Activa Importada (kWh)
                  </Typography>
                  {showComparison && comparisonMetrics && (
                    <Box display="flex" alignItems="center" mt={1}>
                      {getTrendIcon(calculatePercentageChange(currentMetrics.totalKWhD, comparisonMetrics.totalKWhD))}
                      <Chip
                        label={`${calculatePercentageChange(currentMetrics.totalKWhD, comparisonMetrics.totalKWhD).toFixed(1)}%`}
                        color={getTrendColor(calculatePercentageChange(currentMetrics.totalKWhD, comparisonMetrics.totalKWhD))}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  )}
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
                    {currentMetrics.totalKWhR.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energía Activa Exportada (kWh)
                  </Typography>
                  {showComparison && comparisonMetrics && (
                    <Box display="flex" alignItems="center" mt={1}>
                      {getTrendIcon(calculatePercentageChange(currentMetrics.totalKWhR, comparisonMetrics.totalKWhR))}
                      <Chip
                        label={`${calculatePercentageChange(currentMetrics.totalKWhR, comparisonMetrics.totalKWhR).toFixed(1)}%`}
                        color={getTrendColor(calculatePercentageChange(currentMetrics.totalKWhR, comparisonMetrics.totalKWhR))}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  )}
                </Box>
                <BatteryChargingFull color="success" sx={{ fontSize: 40 }} />
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
                    {powerFactor.toFixed(3)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Factor de Potencia Promedio
                  </Typography>
                  <Box mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={powerFactor * 100}
                      color={powerFactor > 0.9 ? 'success' : powerFactor > 0.8 ? 'warning' : 'error'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {powerFactor > 0.9 ? 'Excelente' : powerFactor > 0.8 ? 'Bueno' : 'Necesita mejora'}
                    </Typography>
                  </Box>
                </Box>
                <Warning color={powerFactor > 0.9 ? 'success' : powerFactor > 0.8 ? 'warning' : 'error'} sx={{ fontSize: 40 }} />
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
                    {efficiency.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eficiencia Energética
                  </Typography>
                  <Box mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={efficiency}
                      color={efficiency > 80 ? 'success' : efficiency > 60 ? 'warning' : 'error'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
                <ElectricBolt color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estadísticas Detalladas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas de Consumo
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Métrica</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell align="right">Promedio</TableCell>
                      <TableCell align="right">Máximo</TableCell>
                      <TableCell align="right">Mínimo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Energía Activa Importada (kWh)</TableCell>
                      <TableCell align="right">{currentMetrics.totalKWhD.toFixed(2)}</TableCell>
                      <TableCell align="right">{currentAvg.avgKWhD.toFixed(2)}</TableCell>
                      <TableCell align="right">{currentMetrics.maxKWhD.toFixed(2)}</TableCell>
                      <TableCell align="right">{currentMetrics.minKWhD.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Energía Activa Exportada (kWh)</TableCell>
                      <TableCell align="right">{currentMetrics.totalKWhR.toFixed(2)}</TableCell>
                      <TableCell align="right">{currentAvg.avgKWhR.toFixed(2)}</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Energía Reactiva Capacitiva (kVarh)</TableCell>
                      <TableCell align="right">{currentMetrics.totalKVarhD.toFixed(2)}</TableCell>
                      <TableCell align="right">{currentAvg.avgKVarhD.toFixed(2)}</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Energía Reactiva Inductiva (kVarh)</TableCell>
                      <TableCell align="right">{currentMetrics.totalKVarhR.toFixed(2)}</TableCell>
                      <TableCell align="right">{currentAvg.avgKVarhR.toFixed(2)}</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Análisis de Calidad Energética
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Factor de Potencia</Typography>
                  <Typography variant="body2" color={powerFactor > 0.9 ? 'success.main' : 'warning.main'}>
                    {powerFactor.toFixed(3)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={powerFactor * 100}
                  color={powerFactor > 0.9 ? 'success' : 'warning'}
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Eficiencia Energética</Typography>
                  <Typography variant="body2" color={efficiency > 80 ? 'success.main' : 'warning.main'}>
                    {efficiency.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={efficiency}
                  color={efficiency > 80 ? 'success' : 'warning'}
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">% Energía Reactiva</Typography>
                  <Typography variant="body2" color={reactivePercentage > 20 ? 'error.main' : 'success.main'}>
                    {reactivePercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={reactivePercentage}
                  color={reactivePercentage > 20 ? 'error' : 'success'}
                  sx={{ height: 8, borderRadius: 4 }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  <strong>Recomendaciones:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {powerFactor < 0.8 && '• Considera instalar bancos de capacitores para mejorar el factor de potencia'}
                  {reactivePercentage > 20 && '• Revisa la carga reactiva inductiva en tu instalación'}
                  {efficiency < 60 && '• Optimiza el uso de equipos para mejorar la eficiencia energética'}
                  {powerFactor > 0.9 && efficiency > 80 && '• ¡Excelente! Tu instalación tiene un buen rendimiento energético'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnergySummary;

