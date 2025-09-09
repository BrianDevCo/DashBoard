import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography, Grid, Paper, Chip, LinearProgress } from '@mui/material';
import { 
  ElectricBolt, 
  Power, 
  BatteryChargingFull, 
  Warning,
  TrendingUp,
  TrendingDown 
} from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EnergyDistributionChartProps {
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

const EnergyDistributionChart: React.FC<EnergyDistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="body2" color="text.secondary">
          No hay datos disponibles para mostrar
        </Typography>
      </Box>
    );
  }

  // Calcular totales por ubicación
  const locationTotals = data.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = {
        active: 0,
        reactive: 0,
        exported: 0,
        penalized: 0,
      };
    }
    acc[item.location].active += item.kWhD;
    acc[item.location].reactive += item.kVarhD;
    acc[item.location].exported += item.kWhR;
    acc[item.location].penalized += item.kVarhPenalized;
    return acc;
  }, {} as any);

  // Preparar datos para el gráfico de dona
  const locations = Object.keys(locationTotals);
  const activeValues = locations.map(loc => locationTotals[loc].active);
  const totalActive = activeValues.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels: locations,
    datasets: [
      {
        data: activeValues,
        backgroundColor: [
          'rgba(33, 150, 243, 0.8)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(0, 188, 212, 0.8)',
        ],
        borderColor: [
          'rgba(33, 150, 243, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(156, 39, 176, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(0, 188, 212, 1)',
        ],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500' as const,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / totalActive) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  pointStyle: 'circle',
                };
              });
            }
            return [];
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
        callbacks: {
          title: (context: any) => `Ubicación: ${context[0].label}`,
          label: (context: any) => {
            const value = context.parsed;
            const percentage = ((value / totalActive) * 100).toFixed(1);
            return `Consumo: ${value.toLocaleString()} kWh (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Calcular eficiencia por ubicación
  const efficiencyData = locations.map(loc => {
    const locData = locationTotals[loc];
    const efficiency = locData.active > 0 ? 
      ((locData.active - locData.penalized) / locData.active * 100) : 0;
    return {
      location: loc,
      efficiency: efficiency,
      consumption: locData.active,
      penalized: locData.penalized,
    };
  }).sort((a, b) => b.efficiency - a.efficiency);

  return (
    <Box>
      {/* Gráfico principal */}
      <Box sx={{ height: 300, position: 'relative', mb: 3 }}>
        <Doughnut data={chartData} options={options} />
        
        {/* Centro del gráfico */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {totalActive.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total kWh
          </Typography>
        </Box>
      </Box>

      {/* Tabla de eficiencia */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Power sx={{ color: 'primary.main' }} />
          Eficiencia por Ubicación
        </Typography>
        
        <Grid container spacing={2}>
          {efficiencyData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.location}>
              <Paper sx={{ 
                p: 2, 
                background: index < 3 ? 
                  'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' : 
                  'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
                border: index < 3 ? '2px solid #4caf50' : '2px solid #ff9800',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {item.location}
                  </Typography>
                  <Chip 
                    label={`${item.efficiency.toFixed(1)}%`}
                    size="small"
                    color={item.efficiency > 85 ? 'success' : item.efficiency > 70 ? 'warning' : 'error'}
                    icon={item.efficiency > 85 ? <TrendingUp /> : <TrendingDown />}
                  />
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={item.efficiency} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: item.efficiency > 85 ? 
                        'linear-gradient(90deg, #4caf50, #8bc34a)' :
                        item.efficiency > 70 ?
                        'linear-gradient(90deg, #ff9800, #ffc107)' :
                        'linear-gradient(90deg, #f44336, #ff5722)',
                    },
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Consumo: {item.consumption.toLocaleString()} kWh
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Penalizado: {item.penalized.toLocaleString()} kVarh
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default EnergyDistributionChart;
