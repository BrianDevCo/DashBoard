// API simple para Vercel (Backend)
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo
const mockData = {
  consumption: [
    { date: '2024-01-01', hour: 1, active: 1200, reactive: 300, total: 1500 },
    { date: '2024-01-01', hour: 2, active: 1100, reactive: 280, total: 1380 },
    { date: '2024-01-01', hour: 3, active: 1000, reactive: 250, total: 1250 },
    { date: '2024-01-01', hour: 4, active: 950, reactive: 240, total: 1190 },
    { date: '2024-01-01', hour: 5, active: 900, reactive: 230, total: 1130 },
    { date: '2024-01-01', hour: 6, active: 1000, reactive: 250, total: 1250 },
    { date: '2024-01-01', hour: 7, active: 1300, reactive: 320, total: 1620 },
    { date: '2024-01-01', hour: 8, active: 1800, reactive: 450, total: 2250 },
    { date: '2024-01-01', hour: 9, active: 2200, reactive: 550, total: 2750 },
    { date: '2024-01-01', hour: 10, active: 2500, reactive: 625, total: 3125 },
    { date: '2024-01-01', hour: 11, active: 2800, reactive: 700, total: 3500 },
    { date: '2024-01-01', hour: 12, active: 3000, reactive: 750, total: 3750 },
    { date: '2024-01-01', hour: 13, active: 2900, reactive: 725, total: 3625 },
    { date: '2024-01-01', hour: 14, active: 2700, reactive: 675, total: 3375 },
    { date: '2024-01-01', hour: 15, active: 2600, reactive: 650, total: 3250 },
    { date: '2024-01-01', hour: 16, active: 2800, reactive: 700, total: 3500 },
    { date: '2024-01-01', hour: 17, active: 3200, reactive: 800, total: 4000 },
    { date: '2024-01-01', hour: 18, active: 3500, reactive: 875, total: 4375 },
    { date: '2024-01-01', hour: 19, active: 3800, reactive: 950, total: 4750 },
    { date: '2024-01-01', hour: 20, active: 3600, reactive: 900, total: 4500 },
    { date: '2024-01-01', hour: 21, active: 3000, reactive: 750, total: 3750 },
    { date: '2024-01-01', hour: 22, active: 2200, reactive: 550, total: 2750 },
    { date: '2024-01-01', hour: 23, active: 1800, reactive: 450, total: 2250 },
    { date: '2024-01-01', hour: 24, active: 1500, reactive: 375, total: 1875 }
  ],
  kpis: {
    totalConsumption: 62500,
    averageConsumption: 2604,
    maxConsumption: 4750,
    minConsumption: 1130,
    peakHour: 19,
    efficiency: 85.2
  },
  alerts: [
    { id: 1, type: 'warning', message: 'Consumo alto en hora pico', timestamp: '2024-01-01T19:00:00Z' },
    { id: 2, type: 'info', message: 'Factor de potencia optimizado', timestamp: '2024-01-01T15:30:00Z' },
    { id: 3, type: 'success', message: 'Meta de eficiencia alcanzada', timestamp: '2024-01-01T12:00:00Z' }
  ]
};

// Rutas de la API
app.get('/api/energy/consumption', (req, res) => {
  res.json(mockData.consumption);
});

app.get('/api/energy/kpis', (req, res) => {
  res.json(mockData.kpis);
});

app.get('/api/alerts', (req, res) => {
  res.json(mockData.alerts);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({ message: 'Dashboard Energético API' });
});

module.exports = app;
