import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useGetEnergySummaryQuery, useGetMetersQuery } from '../services/energyApi';

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedMeter, setSelectedMeter] = useState<string>('all');
  const [selectedReportType, setSelectedReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  const { data: meters, isLoading: isLoadingMeters } = useGetMetersQuery();
  
  const { data: energySummary, isLoading: isLoadingSummary } = useGetEnergySummaryQuery({
    period: 'month',
    meterId: selectedMeter === 'all' ? undefined : selectedMeter,
  });

  const handleGenerateReport = () => {
    // Aquí iría la lógica para generar y descargar el reporte
    console.log('Generando reporte...', {
      startDate,
      endDate,
      selectedMeter,
      selectedReportType,
      selectedFormat,
    });
  };

  const handleExportData = (format: 'pdf' | 'excel' | 'csv') => {
    // Aquí iría la lógica para exportar datos
    console.log('Exportando datos en formato:', format);
  };

  if (isLoadingMeters) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reportes y Exportación
        </Typography>

        {/* Filtros de Reporte */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configuración del Reporte
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha Fin"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Medidor</InputLabel>
                  <Select
                    value={selectedMeter}
                    label="Medidor"
                    onChange={(e) => setSelectedMeter(e.target.value)}
                  >
                    <MenuItem value="all">Todos los Medidores</MenuItem>
                    {meters?.map((meter) => (
                      <MenuItem key={meter.id} value={meter.id}>
                        {meter.name} - {meter.location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Reporte</InputLabel>
                  <Select
                    value={selectedReportType}
                    label="Tipo de Reporte"
                    onChange={(e) => setSelectedReportType(e.target.value as any)}
                  >
                    <MenuItem value="summary">Resumen Ejecutivo</MenuItem>
                    <MenuItem value="detailed">Detallado</MenuItem>
                    <MenuItem value="comparison">Comparativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Formato</InputLabel>
                  <Select
                    value={selectedFormat}
                    label="Formato"
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<ReportIcon />}
                onClick={handleGenerateReport}
                disabled={!startDate || !endDate}
              >
                Generar Reporte
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Resumen del Período */}
        {energySummary && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumen del Período Seleccionado
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Energía Total Importada
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {energySummary.totalImported.toFixed(1)} kWh
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Energía Total Exportada
                      </Typography>
                      <Typography variant="h5" color="success">
                        {energySummary.totalExported.toFixed(1)} kWh
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Eficiencia Energética
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {energySummary.efficiency.toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Ahorro Estimado
                      </Typography>
                      <Typography variant="h5" color="success">
                        ${energySummary.savings.toFixed(2)}
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
                    Exportación Rápida
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      onClick={() => handleExportData('pdf')}
                      fullWidth
                    >
                      Exportar a PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExcelIcon />}
                      onClick={() => handleExportData('excel')}
                      fullWidth
                    >
                      Exportar a Excel
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExportData('csv')}
                      fullWidth
                    >
                      Exportar a CSV
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tipos de Reportes Disponibles */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tipos de Reportes Disponibles
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Resumen Ejecutivo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Reporte de alto nivel con métricas clave y tendencias principales
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip label="PDF" size="small" />
                          <Chip label="Excel" size="small" />
                          <Chip label="Dashboard" size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Reporte Detallado
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Análisis profundo con datos granulares y análisis de patrones
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip label="PDF" size="small" />
                          <Chip label="Excel" size="small" />
                          <Chip label="CSV" size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Reporte Comparativo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Comparación entre períodos, medidores o ubicaciones
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip label="PDF" size="small" />
                          <Chip label="Excel" size="small" />
                          <Chip label="Gráficos" size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;

