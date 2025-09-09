import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography, Grid, Paper, Chip, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Refresh,
  Download,
  Fullscreen,
  Timeline
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendAreaChartProps {
  data: {
    id: string;
    timestamp: string;
    kWhD: number;
    kVarhD: number;
    kWhR: number;
    kVarhR: number;
    kVarhPenalized: number;
    obisCode: string;
    meterId: string;
    location: string;
  }[];
}

const TrendAreaChart: React.FC<TrendAreaChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="body2" color="text.secondary">
          No hay datos disponibles para mostrar
        </Typography>
      </Box>
    );
  }

  // Generar datos de tendencia simulados (en un caso real vendrían de la API)
  const generateTrendData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const baseConsumption = 1000;
    
    return hours.map(hour => {
      // Simular patrón de consumo diario
      let multiplier = 1;
      if (hour >= 6 && hour <= 9) multiplier = 1.5; // Mañana
      else if (hour >= 18 && hour <= 22) multiplier = 2.2; // Noche
      else if (hour >= 0 && hour <= 5) multiplier = 0.6; // Madrugada
      else if (hour >= 10 && hour <= 17) multiplier = 1.8; // Día
      else multiplier = 1.2; // Tarde
      
      const consumption = baseConsumption * multiplier + (Math.random() - 0.5) * 200;
      const reactive = consumption * 0.25 + (Math.random() - 0.5) * 50;
      const exported = Math.max(0, consumption * 0.1 + (Math.random() - 0.5) * 30);
      
      return {
        hour: hour,
        consumption: Math.max(0, consumption),
        reactive: Math.max(0, reactive),
        exported: Math.max(0, exported),
        efficiency: Math.max(70, 100 - (reactive / consumption * 100) + (Math.random() - 0.5) * 10),
      };
    });
  };

  const trendData = generateTrendData();
  const labels = trendData.map(item => `${item.hour.toString().padStart(2, '0')}:00`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Consumo Activo (kWh)',
        data: trendData.map(item => item.consumption),
        borderColor: 'rgba(33, 150, 243, 1)',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(33, 150, 243, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Energía Reactiva (kVarh)',
        data: trendData.map(item => item.reactive),
        borderColor: 'rgba(255, 152, 0, 1)',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(255, 152, 0, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Energía Exportada (kWh)',
        data: trendData.map(item => item.exported),
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context: any) => `Hora: ${context[0].label}`,
          label: (context: any) => {
            const value = context.parsed.y;
            const unit = context.dataset.label.includes('kVarh') ? 'kVarh' : 'kWh';
            return `${context.dataset.label}: ${value.toFixed(1)} ${unit}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: 'normal' as const,
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
            weight: 'normal' as const,
          },
          callback: function(value: any) {
            return value.toLocaleString();
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Calcular estadísticas de tendencia
  const totalConsumption = trendData.reduce((sum, item) => sum + item.consumption, 0);
  const avgConsumption = totalConsumption / trendData.length;
  const maxConsumption = Math.max(...trendData.map(item => item.consumption));
  const minConsumption = Math.min(...trendData.map(item => item.consumption));
  const peakHour = trendData.find(item => item.consumption === maxConsumption)?.hour;
  const avgEfficiency = trendData.reduce((sum, item) => sum + item.efficiency, 0) / trendData.length;

  return (
    <Box>
      {/* Header con controles */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Timeline sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Tendencias de Consumo Diario
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Análisis de 24 horas - Patrones de consumo
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MuiTooltip title="Actualizar datos">
            <IconButton size="small" sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
              <Refresh />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Descargar gráfico">
            <IconButton size="small" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <Download />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Pantalla completa">
            <IconButton size="small" sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
              <Fullscreen />
            </IconButton>
          </MuiTooltip>
        </Box>
      </Box>

      {/* Estadísticas de tendencia */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid rgba(33, 150, 243, 0.2)',
          }}>
            <TrendingUp sx={{ color: '#1976d2', mb: 1 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              {totalConsumption.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Diario (kWh)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
          }}>
            <Typography variant="h6" color="warning.main" fontWeight="bold">
              {maxConsumption.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pico Máximo (kWh)
            </Typography>
            <Chip 
              label={`${peakHour}:00`} 
              size="small" 
              color="warning" 
              sx={{ mt: 0.5 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {avgConsumption.toFixed(0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Promedio (kWh)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}>
            <Typography variant="h6" color="secondary.main" fontWeight="bold">
              {avgEfficiency.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Eficiencia Promedio
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráfico principal */}
      <Box sx={{ height: 400, position: 'relative' }}>
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default TrendAreaChart;
