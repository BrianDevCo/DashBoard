import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Tipos de datos energéticos
export interface EnergyMetric {
  id: string;
  timestamp: string;
  kWhD: number; // Energía Activa Importada
  kVarhD: number; // Energía Reactiva Importada
  kWhR: number; // Energía Activa Exportada
  kVarhR: number; // Energía Reactiva Exportada
  kVarhPenalized: number; // Energía Reactiva Penalizada
  obisCode: string; // Código OBIS
  meterId: string; // ID del medidor
  location: string; // Ubicación del medidor
}

export interface EnergySummary {
  totalImported: number;
  totalExported: number;
  totalReactive: number;
  totalPenalized: number;
  efficiency: number;
  cost: number;
  savings: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

// Configuración de la API
export const energyApi = createApi({
  reducerPath: 'energyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['EnergyMetrics', 'EnergySummary'],
  endpoints: (builder) => ({
    // Obtener métricas energéticas en tiempo real
    getRealTimeMetrics: builder.query<EnergyMetric[], void>({
      query: () => 'energy/real-time',
      providesTags: ['EnergyMetrics'],
      pollingInterval: 30000, // Actualizar cada 30 segundos
    }),

    // Obtener métricas históricas
    getHistoricalMetrics: builder.query<EnergyMetric[], {
      startDate: string;
      endDate: string;
      meterId?: string;
      interval?: 'hourly' | 'daily' | 'monthly';
    }>({
      query: (params) => ({
        url: 'energy/historical',
        params,
      }),
      providesTags: ['EnergyMetrics'],
    }),

    // Obtener resumen energético
    getEnergySummary: builder.query<EnergySummary, {
      period: 'day' | 'week' | 'month' | 'year';
      meterId?: string;
    }>({
      query: (params) => ({
        url: 'energy/summary',
        params,
      }),
      providesTags: ['EnergySummary'],
    }),

    // Obtener datos para gráficos
    getChartData: builder.query<ChartData, {
      metric: 'kWhD' | 'kVarhD' | 'kWhR' | 'kVarhR' | 'kVarhPenalized';
      period: 'hourly' | 'daily' | 'monthly';
      startDate: string;
      endDate: string;
      meterId?: string;
    }>({
      query: (params) => ({
        url: 'energy/chart-data',
        params,
      }),
      providesTags: ['EnergyMetrics'],
    }),

    // Obtener alertas y anomalías
    getAlerts: builder.query<{
      id: string;
      type: 'warning' | 'error' | 'info';
      message: string;
      timestamp: string;
      severity: 'low' | 'medium' | 'high';
      resolved: boolean;
    }[], void>({
      query: () => 'energy/alerts',
      providesTags: ['EnergyMetrics'],
    }),

    // Obtener códigos OBIS disponibles
    getObisCodes: builder.query<{
      code: string;
      description: string;
      unit: string;
      category: string;
    }[], void>({
      query: () => 'energy/obis-codes',
      providesTags: ['EnergyMetrics'],
    }),

    // Obtener medidores disponibles
    getMeters: builder.query<{
      id: string;
      name: string;
      location: string;
      type: string;
      status: 'active' | 'inactive' | 'maintenance';
    }[], void>({
      query: () => 'energy/meters',
      providesTags: ['EnergyMetrics'],
    }),
  }),
});

export const {
  useGetRealTimeMetricsQuery,
  useGetHistoricalMetricsQuery,
  useGetEnergySummaryQuery,
  useGetChartDataQuery,
  useGetAlertsQuery,
  useGetObisCodesQuery,
  useGetMetersQuery,
} = energyApi;

