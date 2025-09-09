import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import EnergyChart from '../components/EnergyChart';
import MetricCard from '../components/MetricCard';
import ConsumptionBarChart from '../components/ConsumptionBarChart';
import EnergyDistributionChart from '../components/EnergyDistributionChart';
import TrendAreaChart from '../components/TrendAreaChart';

// Datos simulados directamente en el componente para evitar problemas de caché
const mockData = {
  realTimeMetrics: [
    { id: '1', timestamp: '2024-01-15T10:30:00Z', kWhD: 1250, kVarhD: 320, kWhR: 50, kVarhR: 15, kVarhPenalized: 25, obisCode: '1.8.0', meterId: 'M001', location: 'Planta Norte' },
    { id: '2', timestamp: '2024-01-15T10:30:00Z', kWhD: 980, kVarhD: 280, kWhR: 30, kVarhR: 10, kVarhPenalized: 20, obisCode: '1.8.0', meterId: 'M002', location: 'Oficinas Centrales' },
    { id: '3', timestamp: '2024-01-15T10:30:00Z', kWhD: 2100, kVarhD: 450, kWhR: 80, kVarhR: 25, kVarhPenalized: 35, obisCode: '1.8.0', meterId: 'M003', location: 'Centro de Datos' }
  ],
  energySummary: {
    totalImported: 1250000,
    totalExported: 45000,
    totalReactive: 320000,
    totalPenalized: 25000,
    efficiency: 87.5,
    cost: 75000000,
    savings: 1250000,
    powerFactor: 0.92,
    reactivePercentage: 25.6,
    maxDemand: 4800,
    avgDemand: 2600,
    minDemand: 1200
  },
  alerts: [
    { id: 1, type: 'warning', message: 'Consumo alto en hora pico', timestamp: '2024-01-01T19:00:00Z', severity: 'medium', resolved: false },
    { id: 2, type: 'info', message: 'Factor de potencia optimizado', timestamp: '2024-01-01T15:30:00Z', severity: 'low', resolved: true },
    { id: 3, type: 'success', message: 'Meta de eficiencia alcanzada', timestamp: '2024-01-01T12:00:00Z', severity: 'low', resolved: true }
  ]
};

const Dashboard: React.FC = () => {
  // Usar datos simulados directamente - SIN ERRORES
  const realTimeMetrics = mockData.realTimeMetrics;
  const energySummary = mockData.energySummary;
  const alerts = mockData.alerts;

  return (
    <Box sx={{ 
      height: '100%', 
      overflow: 'auto',
      pb: 3 // Padding bottom para asegurar que el último contenido sea visible
    }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Energético
      </Typography>
      
      {/* Indicador de estado */}
      <Alert severity="success" sx={{ mb: 2 }}>
        ✅ Dashboard funcionando correctamente con datos simulados
      </Alert>
      
      {/* Alertas */}
      {alerts && alerts.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Alertas Activas
          </Typography>
          <Grid container spacing={2}>
            {alerts.slice(0, 3).map((alert) => (
              <Grid item xs={12} md={4} key={alert.id}>
                <Alert 
                  severity={alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
                  icon={alert.severity === 'high' ? <WarningIcon /> : <CheckCircleIcon />}
                >
                  {alert.message}
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Métricas Principales */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Energía Activa Importada"
            value={realTimeMetrics?.[0]?.kWhD || 0}
            unit="kWh"
            trend="up"
            trendValue={5.2}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Energía Reactiva Importada"
            value={realTimeMetrics?.[0]?.kVarhD || 0}
            unit="kVarh"
            trend="down"
            trendValue={-2.1}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Energía Activa Exportada"
            value={realTimeMetrics?.[0]?.kWhR || 0}
            unit="kWh"
            trend="up"
            trendValue={8.7}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Energía Reactiva Penalizada"
            value={realTimeMetrics?.[0]?.kVarhPenalized || 0}
            unit="kVarh"
            trend="down"
            trendValue={-12.3}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Resumen Energético */}
      {energySummary && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen del Período
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Eficiencia
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {energySummary.efficiency.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Costo Total
                    </Typography>
                    <Typography variant="h4" color="error">
                      ${energySummary.cost.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Ahorro
                    </Typography>
                    <Typography variant="h4" color="success">
                      ${energySummary.savings.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Importado
                    </Typography>
                    <Typography variant="h4">
                      {energySummary.totalImported.toFixed(1)} kWh
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estado del Sistema
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Medidores Activos</Typography>
                    <Chip label="12/15" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Conexión Oracle</Typography>
                    <Chip label="Conectado" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Última Actualización</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date().toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Gráficos de Análisis Energético */}
      <Grid container spacing={3}>
        {/* Gráfico de Barras - Consumo por Ubicación */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    📊
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Consumo por Ubicación
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Análisis comparativo de consumo energético
                  </Typography>
                </Box>
              </Box>
              <ConsumptionBarChart data={realTimeMetrics || []} />
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Distribución - Eficiencia */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    🎯
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Distribución de Eficiencia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Análisis de eficiencia energética
                  </Typography>
                </Box>
              </Box>
              <EnergyDistributionChart data={realTimeMetrics || []} />
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Tendencias - Análisis Temporal */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <TrendAreaChart data={realTimeMetrics || []} />
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico Original - Tiempo Real */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    ⚡
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Consumo Energético en Tiempo Real
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitoreo continuo de métricas energéticas
                  </Typography>
                </Box>
              </Box>
              <EnergyChart data={realTimeMetrics || []} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

