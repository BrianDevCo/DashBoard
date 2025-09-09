import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Chip, Grid, Paper } from '@mui/material';
import { TrendingUp, TrendingDown, ElectricBolt } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ConsumptionBarChartProps {
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

const ConsumptionBarChart: React.FC<ConsumptionBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="body2" color="text.secondary">
          No hay datos disponibles para mostrar
        </Typography>
      </Box>
    );
  }

  // Preparar datos para el gráfico
  const labels = data.map(item => item.location);
  const activeData = data.map(item => item.kWhD);
  const reactiveData = data.map(item => item.kVarhD);
  const exportedData = data.map(item => item.kWhR);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Energía Activa Importada (kWh)',
        data: activeData,
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Energía Reactiva Importada (kVarh)',
        data: reactiveData,
        backgroundColor: 'rgba(255, 152, 0, 0.8)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Energía Activa Exportada (kWh)',
        data: exportedData,
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
            weight: '500' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => `Ubicación: ${context[0].label}`,
          label: (context: any) => {
            const value = context.parsed.y;
            const unit = context.dataset.label.includes('kVarh') ? 'kVarh' : 'kWh';
            return `${context.dataset.label}: ${value.toLocaleString()} ${unit}`;
          },
        },
      },
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
            weight: '500' as const,
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
            weight: '500' as const,
          },
          callback: function(value: any) {
            return value.toLocaleString();
          },
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Calcular estadísticas
  const totalActive = activeData.reduce((sum, val) => sum + val, 0);
  const totalReactive = reactiveData.reduce((sum, val) => sum + val, 0);
  const totalExported = exportedData.reduce((sum, val) => sum + val, 0);
  const maxActive = Math.max(...activeData);
  const avgActive = totalActive / activeData.length;

  return (
    <Box>
      {/* Estadísticas rápidas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
            <ElectricBolt sx={{ color: '#1976d2', mb: 1 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              {totalActive.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Activa (kWh)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)' }}>
            <TrendingUp sx={{ color: '#f57c00', mb: 1 }} />
            <Typography variant="h6" color="warning.main" fontWeight="bold">
              {totalReactive.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Reactiva (kVarh)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
            <TrendingDown sx={{ color: '#4caf50', mb: 1 }} />
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {totalExported.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Exportada (kWh)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)' }}>
            <Typography variant="h6" color="secondary.main" fontWeight="bold">
              {maxActive.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pico Máximo (kWh)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráfico principal */}
      <Box sx={{ height: 400, position: 'relative' }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default ConsumptionBarChart;
