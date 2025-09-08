import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent } from '@mui/material';
import { EnergyMetric } from '../services/energyApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export type ChartType = 'line' | 'bar' | 'area' | 'doughnut';

interface EnergyChartProps {
  data: EnergyMetric[];
  chartType?: ChartType;
  showActiveEnergy?: boolean;
  showReactiveEnergy?: boolean;
  showComparison?: boolean;
  comparisonData?: EnergyMetric[];
}

const EnergyChart: React.FC<EnergyChartProps> = ({ 
  data, 
  chartType = 'line',
  showActiveEnergy = true,
  showReactiveEnergy = true,
  showComparison = false,
  comparisonData = []
}) => {
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
  const prepareChartData = () => {
    const labels = data.map(item => new Date(item.timestamp).toLocaleTimeString());
    const datasets: any[] = [];

    // Energía Activa
    if (showActiveEnergy) {
      datasets.push(
        {
          label: 'Energía Activa Importada (kWh)',
          data: data.map(item => item.kWhD),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.1)',
          fill: chartType === 'area',
          tension: 0.4,
        },
        {
          label: 'Energía Activa Exportada (kWh)',
          data: data.map(item => item.kWhR),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: chartType === 'area',
          tension: 0.4,
        }
      );
    }

    // Energía Reactiva
    if (showReactiveEnergy) {
      datasets.push(
        {
          label: 'Energía Reactiva Capacitiva (kVarh)',
          data: data.map(item => item.kVarhD),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          fill: chartType === 'area',
          tension: 0.4,
        },
        {
          label: 'Energía Reactiva Inductiva (kVarh)',
          data: data.map(item => item.kVarhR),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          fill: chartType === 'area',
          tension: 0.4,
        },
        {
          label: 'Energía Reactiva Penalizada (kVarh)',
          data: data.map(item => item.kVarhPenalized),
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.1)',
          fill: chartType === 'area',
          tension: 0.4,
        }
      );
    }

    // Datos de comparación
    if (showComparison && comparisonData.length > 0) {
      datasets.push(
        {
          label: 'Consumo Típico (kWh)',
          data: comparisonData.map(item => item.kWhD),
          borderColor: 'rgb(128, 128, 128)',
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
        }
      );
    }

    return { labels, datasets };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
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
        title: {
          display: true,
          text: 'Tiempo',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Energía (kWh/kVarh)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Renderizar el tipo de gráfico apropiado
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      case 'area':
      case 'line':
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  return (
    <Box sx={{ height: 400, position: 'relative' }}>
      {renderChart()}
    </Box>
  );
};

export default EnergyChart;

