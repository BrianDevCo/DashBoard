// Tipos para el sistema de exportación e impresión

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export type PrintFormat = 'a4' | 'letter' | 'a3' | 'legal';

export type DecimalSeparator = ',' | '.';

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY';

export type TimeFormat = 'HH:mm:ss' | 'HH:mm' | 'h:mm:ss A' | 'h:mm A';

export interface ExportSettings {
  format: ExportFormat;
  decimalSeparator: DecimalSeparator;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  includeHeaders: boolean;
  includeMetadata: boolean;
  includeCharts: boolean;
  includeSummary: boolean;
  language: 'es' | 'en';
  timezone: string;
}

export interface PrintSettings {
  format: PrintFormat;
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includeHeaders: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  scale: number; // 0.5 to 2.0
}

export interface ExportData {
  id: string;
  title: string;
  description?: string;
  data: any[];
  columns: ExportColumn[];
  metadata: {
    generatedAt: string;
    generatedBy: string;
    period: {
      start: string;
      end: string;
    };
    filters?: Record<string, any>;
  };
  charts?: ExportChart[];
  summary?: ExportSummary;
}

export interface ExportColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  format?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  visible: boolean;
}

export interface ExportChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  data: any;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
}

export interface ExportSummary {
  totalRecords: number;
  totalValue?: number;
  averageValue?: number;
  minValue?: number;
  maxValue?: number;
  period: string;
  generatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'energy' | 'billing' | 'analysis' | 'custom';
  sections: ReportSection[];
  settings: {
    includeCover: boolean;
    includeTOC: boolean;
    includeFooter: boolean;
    pageFormat: PrintFormat;
    orientation: 'portrait' | 'landscape';
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'chart' | 'summary' | 'image';
  content: any;
  order: number;
  visible: boolean;
  settings: {
    height?: number;
    width?: number;
    align?: 'left' | 'center' | 'right';
    fontSize?: number;
    color?: string;
  };
}

export interface ExportJob {
  id: string;
  type: 'export' | 'print' | 'report';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  format: ExportFormat | PrintFormat;
  data: ExportData;
  settings: ExportSettings | PrintSettings;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}

// Configuraciones predefinidas
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'csv',
  decimalSeparator: ',',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm:ss',
  includeHeaders: true,
  includeMetadata: true,
  includeCharts: false,
  includeSummary: true,
  language: 'es',
  timezone: 'America/Bogota',
};

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  format: 'a4',
  orientation: 'portrait',
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  includeHeaders: true,
  includeFooter: true,
  includePageNumbers: true,
  scale: 1.0,
};

export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV', description: 'Archivo de valores separados por comas' },
  { value: 'excel', label: 'Excel', description: 'Archivo de Microsoft Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF', description: 'Documento PDF' },
  { value: 'json', label: 'JSON', description: 'Archivo JSON' },
];

export const PRINT_FORMATS = [
  { value: 'a4', label: 'A4', description: '210 × 297 mm' },
  { value: 'letter', label: 'Carta', description: '8.5 × 11 pulgadas' },
  { value: 'a3', label: 'A3', description: '297 × 420 mm' },
  { value: 'legal', label: 'Legal', description: '8.5 × 14 pulgadas' },
];

export const REPORT_TEMPLATES: Partial<ReportTemplate>[] = [
  {
    name: 'Reporte de Consumo Energético',
    description: 'Reporte completo de consumos energéticos con gráficos y análisis',
    category: 'energy',
    sections: [
      {
        id: 'summary',
        title: 'Resumen Ejecutivo',
        type: 'summary',
        order: 1,
        visible: true,
        content: 'Resumen del consumo energético',
        settings: {},
      },
      {
        id: 'consumption-chart',
        title: 'Gráfico de Consumos',
        type: 'chart',
        order: 2,
        visible: true,
        content: 'Gráfico de consumos energéticos',
        settings: {},
      },
      {
        id: 'consumption-table',
        title: 'Tabla de Consumos',
        type: 'table',
        order: 3,
        visible: true,
        content: 'Tabla de consumos energéticos',
        settings: {},
      },
    ],
  },
  {
    name: 'Reporte de Facturación',
    description: 'Análisis detallado de facturación y costos energéticos',
    category: 'billing',
    sections: [
      {
        id: 'billing-summary',
        title: 'Resumen de Facturación',
        type: 'summary',
        order: 1,
        visible: true,
        content: 'Resumen de facturación energética',
        settings: {},
      },
      {
        id: 'cost-breakdown',
        title: 'Desglose de Costos',
        type: 'chart',
        order: 2,
        visible: true,
        content: 'Desglose de costos energéticos',
        settings: {},
      },
      {
        id: 'billing-table',
        title: 'Detalle de Facturación',
        type: 'table',
        order: 3,
        visible: true,
        content: 'Detalle de facturación energética',
        settings: {},
      },
    ],
  },
  {
    name: 'Reporte de Análisis',
    description: 'Análisis avanzado de tendencias y patrones energéticos',
    category: 'analysis',
    sections: [
      {
        id: 'trends-analysis',
        title: 'Análisis de Tendencias',
        type: 'text',
        order: 1,
        visible: true,
        content: 'Análisis de tendencias energéticas',
        settings: {},
      },
      {
        id: 'efficiency-chart',
        title: 'Gráfico de Eficiencia',
        type: 'chart',
        order: 2,
        visible: true,
        content: 'Gráfico de eficiencia energética',
        settings: {},
      },
      {
        id: 'recommendations',
        title: 'Recomendaciones',
        type: 'text',
        order: 3,
        visible: true,
        content: 'Recomendaciones de optimización',
        settings: {},
      },
    ],
  },
];

