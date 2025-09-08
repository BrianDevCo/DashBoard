import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Download,
  Print,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility,
  FileDownload,
  PictureAsPdf,
  TableChart,
  Description,
  Schedule,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { ExportData, ExportFormat, ReportTemplate, ExportSettings, DEFAULT_EXPORT_SETTINGS } from '../types/export';
import { ExportService, PrintService } from '../utils/exportUtils';
import DataExporter from '../components/DataExporter';
import ExportSettingsComponent from '../components/ExportSettings';
import ReportBuilder from '../components/ReportBuilder';

const ExportAndPrint: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [exportJobs, setExportJobs] = useState<any[]>([]);
  const [sampleData, setSampleData] = useState<ExportData>({
    id: 'sample-1',
    title: 'Datos de Consumo Energético',
    description: 'Muestra de datos para exportación',
    data: [
      { fecha: '2024-01-01', kWhD: 1250.5, kWhR: 0, kVarhD: 150.2, kVarhR: 0, costo: 125000 },
      { fecha: '2024-01-02', kWhD: 1180.3, kWhR: 0, kVarhD: 142.8, kVarhR: 0, costo: 118000 },
      { fecha: '2024-01-03', kWhD: 1320.7, kWhR: 0, kVarhD: 158.4, kVarhR: 0, costo: 132000 },
    ],
    columns: [
      { key: 'fecha', label: 'Fecha', type: 'date', visible: true },
      { key: 'kWhD', label: 'Energía Activa (kWh)', type: 'number', visible: true },
      { key: 'kWhR', label: 'Energía Reactiva (kWh)', type: 'number', visible: true },
      { key: 'kVarhD', label: 'Energía Reactiva Capacitiva (kVarh)', type: 'number', visible: true },
      { key: 'kVarhR', label: 'Energía Reactiva Inductiva (kVarh)', type: 'number', visible: true },
      { key: 'costo', label: 'Costo ($)', type: 'currency', visible: true },
    ],
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: 'Sistema',
      period: {
        start: '2024-01-01',
        end: '2024-01-03',
      },
    },
  });

  // Cargar plantillas de reporte desde localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('reportTemplates');
    if (savedTemplates) {
      setReportTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Guardar plantillas en localStorage
  const saveTemplates = (templates: ReportTemplate[]) => {
    setReportTemplates(templates);
    localStorage.setItem('reportTemplates', JSON.stringify(templates));
  };

  const handleCreateTemplate = (template: ReportTemplate) => {
    const newTemplates = [...reportTemplates, template];
    saveTemplates(newTemplates);
    setShowReportBuilder(false);
    setEditingTemplate(null);
  };

  const handleUpdateTemplate = (template: ReportTemplate) => {
    const updatedTemplates = reportTemplates.map(t => 
      t.id === template.id ? template : t
    );
    saveTemplates(updatedTemplates);
    setShowReportBuilder(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      const updatedTemplates = reportTemplates.filter(t => t.id !== templateId);
      saveTemplates(updatedTemplates);
    }
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setEditingTemplate(template);
    setShowReportBuilder(true);
  };

  const handleExport = (format: ExportFormat, settings: ExportSettings) => {
    // Simular trabajo de exportación
    const job = {
      id: `job-${Date.now()}`,
      format,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    
    setExportJobs(prev => [...prev, job]);
    
    // Simular progreso
    const interval = setInterval(() => {
      setExportJobs(prev => prev.map(j => {
        if (j.id === job.id) {
          const newProgress = j.progress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...j, progress: 100, status: 'completed' };
          }
          return { ...j, progress: newProgress };
        }
        return j;
      }));
    }, 200);
  };

  const handlePrint = () => {
    PrintService.printTable(sampleData, {});
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <TableChart />;
      case 'excel':
        return <FileDownload />;
      case 'pdf':
        return <PictureAsPdf />;
      case 'json':
        return <Description />;
      default:
        return <FileDownload />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'processing':
        return <Schedule color="info" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Schedule />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Exportación e Impresión de Datos
      </Typography>

      {/* Resumen de exportaciones */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {exportJobs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trabajos de Exportación
                  </Typography>
                </Box>
                <Download color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {exportJobs.filter(j => j.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completados
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    {reportTemplates.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plantillas de Reporte
                  </Typography>
                </Box>
                <Description color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {exportJobs.filter(j => j.status === 'processing').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Proceso
                  </Typography>
                </Box>
                <Schedule color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas principales */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Exportar Datos" />
            <Tab label="Plantillas de Reporte" />
            <Tab label="Trabajos de Exportación" />
            <Tab label="Configuración" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña de Exportar Datos */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Exportar Datos de Muestra
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {sampleData.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {sampleData.description}
                      </Typography>
                      
                      <Box display="flex" gap={1} mb={2}>
                        <Chip label={`${sampleData.data.length} registros`} size="small" />
                        <Chip label={`${sampleData.columns.length} columnas`} size="small" />
                      </Box>

                      <DataExporter
                        data={sampleData}
                        onExport={handleExport}
                        onPrint={handlePrint}
                        showSettings={true}
                        showPrint={true}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Vista Previa de Datos
                      </Typography>
                      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {sampleData.columns.slice(0, 3).map(col => (
                                <TableCell key={col.key}>{col.label}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sampleData.data.slice(0, 5).map((row, index) => (
                              <TableRow key={index}>
                                {sampleData.columns.slice(0, 3).map(col => (
                                  <TableCell key={col.key}>
                                    {row[col.key]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Pestaña de Plantillas de Reporte */}
          {activeTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Plantillas de Reporte ({reportTemplates.length})
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => setShowReportBuilder(true)}
                  variant="contained"
                >
                  Nueva Plantilla
                </Button>
              </Box>

              {reportTemplates.length === 0 ? (
                <Alert severity="info">
                  No hay plantillas de reporte configuradas. Crea tu primera plantilla para comenzar.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {reportTemplates.map((template) => (
                    <Grid item xs={12} md={6} lg={4} key={template.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box flex={1}>
                              <Typography variant="h6" noWrap>
                                {template.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {template.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={template.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>

                          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            <Chip
                              label={`${template.sections.length} secciones`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={template.settings.pageFormat.toUpperCase()}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={template.settings.orientation}
                              size="small"
                              variant="outlined"
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              Creado: {new Date(template.createdAt).toLocaleDateString()}
                            </Typography>
                            <Box display="flex" gap={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTemplate(template.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Pestaña de Trabajos de Exportación */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Trabajos de Exportación ({exportJobs.length})
              </Typography>

              {exportJobs.length === 0 ? (
                <Alert severity="info">
                  No hay trabajos de exportación recientes.
                </Alert>
              ) : (
                <List>
                  {exportJobs.map((job) => (
                    <ListItem key={job.id}>
                      <ListItemIcon>
                        {getStatusIcon(job.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={`Exportación ${job.format.toUpperCase()}`}
                        secondary={`Creado: ${new Date(job.createdAt).toLocaleString()}`}
                      />
                      <ListItemSecondaryAction>
                        {job.status === 'processing' && (
                          <Box sx={{ width: 100 }}>
                            <LinearProgress variant="determinate" value={job.progress} />
                            <Typography variant="caption" color="text.secondary">
                              {job.progress}%
                            </Typography>
                          </Box>
                        )}
                        {job.status === 'completed' && (
                          <Chip label="Completado" color="success" size="small" />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Pestaña de Configuración */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Configuración de Exportación
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Configuración General
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Formato por defecto"
                            secondary={exportSettings.format.toUpperCase()}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Separador decimal"
                            secondary={exportSettings.decimalSeparator}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Formato de fecha"
                            secondary={exportSettings.dateFormat}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Idioma"
                            secondary={exportSettings.language === 'es' ? 'Español' : 'English'}
                          />
                        </ListItem>
                      </List>
                      <Button
                        startIcon={<Settings />}
                        onClick={() => setShowSettingsDialog(true)}
                        variant="outlined"
                        fullWidth
                      >
                        Configurar Exportación
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Configuración de Impresión
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Formato de página"
                            secondary="A4"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Orientación"
                            secondary="Vertical"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Márgenes"
                            secondary="20mm"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Escala"
                            secondary="100%"
                          />
                        </ListItem>
                      </List>
                      <Button
                        startIcon={<Print />}
                        onClick={() => setShowSettingsDialog(true)}
                        variant="outlined"
                        fullWidth
                      >
                        Configurar Impresión
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog de configuración */}
      <ExportSettingsComponent
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        onSave={setExportSettings}
        currentSettings={exportSettings}
      />

      {/* Dialog de constructor de reportes */}
      <ReportBuilder
        open={showReportBuilder}
        onClose={() => {
          setShowReportBuilder(false);
          setEditingTemplate(null);
        }}
        onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        template={editingTemplate}
        data={sampleData.data}
      />
    </Box>
  );
};

export default ExportAndPrint;

