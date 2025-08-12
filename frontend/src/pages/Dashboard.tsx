import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useGetRealTimeMetricsQuery, useGetEnergySummaryQuery, useGetAlertsQuery } from '../services/energyApi';
import EnergyChart from '../components/EnergyChart';
import MetricCard from '../components/MetricCard';

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  const { data: realTimeMetrics, isLoading: isLoadingMetrics, error: metricsError } = useGetRealTimeMetricsQuery();
  const { data: energySummary, isLoading: isLoadingSummary } = useGetEnergySummaryQuery({ period: selectedPeriod });
  const { data: alerts, isLoading: isLoadingAlerts } = useGetAlertsQuery();

  if (isLoadingMetrics || isLoadingSummary) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (metricsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error al cargar los datos del dashboard
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Energético
      </Typography>
      
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

      {/* Gráfico de Consumo */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consumo Energético en Tiempo Real
              </Typography>
              <EnergyChart data={realTimeMetrics || []} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

