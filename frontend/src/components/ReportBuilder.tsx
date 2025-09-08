import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Slider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Preview,
  Download,
  ExpandMore,
  TextFields,
  TableChart,
  BarChart,
  PieChart,
  Image,
  Assessment,
  DragIndicator,
  Settings,
  Visibility,
} from '@mui/icons-material';
import { ReportTemplate, ReportSection, ExportFormat } from '../types/export';

interface ReportBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (template: ReportTemplate) => void;
  template?: ReportTemplate | null;
  data?: any[];
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({
  open,
  onClose,
  onSave,
  template,
  data = [],
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [reportTemplate, setReportTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    category: 'energy',
    sections: [],
    settings: {
      includeCover: true,
      includeTOC: true,
      includeFooter: true,
      pageFormat: 'a4',
      orientation: 'portrait',
    },
  });
  const [editingSection, setEditingSection] = useState<ReportSection | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    'Información Básica',
    'Configurar Secciones',
    'Configuración de Página',
    'Vista Previa',
  ];

  const sectionTypes = [
    {
      type: 'text',
      label: 'Texto',
      icon: <TextFields />,
      description: 'Bloque de texto libre',
    },
    {
      type: 'table',
      label: 'Tabla',
      icon: <TableChart />,
      description: 'Tabla de datos',
    },
    {
      type: 'chart',
      label: 'Gráfico',
      icon: <BarChart />,
      description: 'Gráfico de datos',
    },
    {
      type: 'summary',
      label: 'Resumen',
      icon: <Assessment />,
      description: 'Resumen ejecutivo',
    },
    {
      type: 'image',
      label: 'Imagen',
      icon: <Image />,
      description: 'Imagen o logo',
    },
  ];

  const handleAddSection = (type: string) => {
    const newSection: ReportSection = {
      id: `section-${Date.now()}`,
      title: `Nueva Sección ${reportTemplate.sections?.length || 0 + 1}`,
      type: type as any,
      content: {},
      order: reportTemplate.sections?.length || 0,
      visible: true,
      settings: {
        height: 200,
        width: 100,
        align: 'left',
        fontSize: 12,
        color: '#000000',
      },
    };

    setReportTemplate(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));

    setEditingSection(newSection);
    setShowSectionDialog(true);
  };

  const handleEditSection = (section: ReportSection) => {
    setEditingSection(section);
    setShowSectionDialog(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    setReportTemplate(prev => ({
      ...prev,
      sections: prev.sections?.filter(s => s.id !== sectionId) || [],
    }));
  };

  const handleUpdateSection = (updatedSection: ReportSection) => {
    setReportTemplate(prev => ({
      ...prev,
      sections: prev.sections?.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      ) || [],
    }));
    setEditingSection(null);
    setShowSectionDialog(false);
  };

  const handleSave = () => {
    if (reportTemplate.name && reportTemplate.sections && reportTemplate.sections.length > 0) {
      const template: ReportTemplate = {
        id: reportTemplate.id || `template-${Date.now()}`,
        name: reportTemplate.name,
        description: reportTemplate.description || '',
        category: reportTemplate.category || 'energy',
        sections: reportTemplate.sections,
        settings: reportTemplate.settings || {
          includeCover: true,
          includeTOC: true,
          includeFooter: true,
          pageFormat: 'a4',
          orientation: 'portrait',
        },
        createdAt: reportTemplate.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user',
      };
      onSave(template);
      onClose();
    }
  };

  const renderSectionPreview = (section: ReportSection) => {
    switch (section.type) {
      case 'text':
        return (
          <Box
            sx={{
              p: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              minHeight: 100,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {section.content.text || 'Texto de la sección...'}
            </Typography>
          </Box>
        );
      case 'table':
        return (
          <Box
            sx={{
              p: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              minHeight: 100,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Tabla de datos ({data.length} registros)
            </Typography>
          </Box>
        );
      case 'chart':
        return (
          <Box
            sx={{
              p: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              minHeight: 100,
              backgroundColor: '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Gráfico: {section.content.chartType || 'Tipo de gráfico'}
            </Typography>
          </Box>
        );
      case 'summary':
        return (
          <Box
            sx={{
              p: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              minHeight: 100,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Resumen ejecutivo
            </Typography>
          </Box>
        );
      case 'image':
        return (
          <Box
            sx={{
              p: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              minHeight: 100,
              backgroundColor: '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Imagen: {section.content.src || 'URL de la imagen'}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {template ? 'Editar Plantilla de Reporte' : 'Nueva Plantilla de Reporte'}
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Paso 1: Información Básica */}
          <Step>
            <StepLabel>Información Básica</StepLabel>
            <StepContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Reporte"
                    value={reportTemplate.name}
                    onChange={(e) => setReportTemplate(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={reportTemplate.category}
                      label="Categoría"
                      onChange={(e) => setReportTemplate(prev => ({
                        ...prev,
                        category: e.target.value as any
                      }))}
                    >
                      <MenuItem value="energy">Energía</MenuItem>
                      <MenuItem value="billing">Facturación</MenuItem>
                      <MenuItem value="analysis">Análisis</MenuItem>
                      <MenuItem value="custom">Personalizado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={reportTemplate.description}
                    onChange={(e) => setReportTemplate(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(1)} variant="contained">
                  Siguiente
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Paso 2: Configurar Secciones */}
          <Step>
            <StepLabel>Configurar Secciones</StepLabel>
            <StepContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Secciones del Reporte ({reportTemplate.sections?.length || 0})
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => setShowSectionDialog(true)}
                  variant="outlined"
                >
                  Agregar Sección
                </Button>
              </Box>

              {reportTemplate.sections && reportTemplate.sections.length > 0 ? (
                <List>
                  {reportTemplate.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <ListItem key={section.id}>
                        <ListItemIcon>
                          <DragIndicator />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${index + 1}. ${section.title}`}
                          secondary={`Tipo: ${section.type} | Visible: ${section.visible ? 'Sí' : 'No'}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => handleEditSection(section)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteSection(section.id)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              ) : (
                <Alert severity="info">
                  No hay secciones configuradas. Agrega al menos una sección para crear el reporte.
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(0)} sx={{ mr: 1 }}>
                  Anterior
                </Button>
                <Button onClick={() => setActiveStep(2)} variant="contained">
                  Siguiente
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Paso 3: Configuración de Página */}
          <Step>
            <StepLabel>Configuración de Página</StepLabel>
            <StepContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Formato de Página</InputLabel>
                    <Select
                      value={reportTemplate.settings?.pageFormat}
                      label="Formato de Página"
                      onChange={(e) => setReportTemplate(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings!,
                          pageFormat: e.target.value as any
                        }
                      }))}
                    >
                      <MenuItem value="a4">A4</MenuItem>
                      <MenuItem value="letter">Carta</MenuItem>
                      <MenuItem value="a3">A3</MenuItem>
                      <MenuItem value="legal">Legal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Orientación</InputLabel>
                    <Select
                      value={reportTemplate.settings?.orientation}
                      label="Orientación"
                      onChange={(e) => setReportTemplate(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings!,
                          orientation: e.target.value as any
                        }
                      }))}
                    >
                      <MenuItem value="portrait">Vertical</MenuItem>
                      <MenuItem value="landscape">Horizontal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Opciones del Reporte
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={reportTemplate.settings?.includeCover}
                          onChange={(e) => setReportTemplate(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings!,
                              includeCover: e.target.checked
                            }
                          }))}
                        />
                      }
                      label="Incluir Portada"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={reportTemplate.settings?.includeTOC}
                          onChange={(e) => setReportTemplate(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings!,
                              includeTOC: e.target.checked
                            }
                          }))}
                        />
                      }
                      label="Incluir Índice"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={reportTemplate.settings?.includeFooter}
                          onChange={(e) => setReportTemplate(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings!,
                              includeFooter: e.target.checked
                            }
                          }))}
                        />
                      }
                      label="Incluir Pie de Página"
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(1)} sx={{ mr: 1 }}>
                  Anterior
                </Button>
                <Button onClick={() => setActiveStep(3)} variant="contained">
                  Siguiente
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Paso 4: Vista Previa */}
          <Step>
            <StepLabel>Vista Previa</StepLabel>
            <StepContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Vista Previa del Reporte
                </Typography>
                <Button
                  startIcon={<Visibility />}
                  onClick={() => setPreviewMode(!previewMode)}
                  variant="outlined"
                >
                  {previewMode ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
                </Button>
              </Box>

              {previewMode && reportTemplate.sections && (
                <Box>
                  {reportTemplate.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <Box key={section.id} sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {section.title}
                        </Typography>
                        {renderSectionPreview(section)}
                      </Box>
                    ))}
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(2)} sx={{ mr: 1 }}>
                  Anterior
                </Button>
                <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
                  {template ? 'Actualizar' : 'Crear'} Plantilla
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>

        {/* Dialog para agregar/editar sección */}
        <Dialog open={showSectionDialog} onClose={() => setShowSectionDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingSection ? 'Editar Sección' : 'Nueva Sección'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título de la Sección"
                  value={editingSection?.title || ''}
                  onChange={(e) => setEditingSection(prev => ({
                    ...prev!,
                    title: e.target.value
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Sección</InputLabel>
                  <Select
                    value={editingSection?.type || 'text'}
                    label="Tipo de Sección"
                    onChange={(e) => setEditingSection(prev => ({
                      ...prev!,
                      type: e.target.value as any
                    }))}
                  >
                    {sectionTypes.map(type => (
                      <MenuItem key={type.type} value={type.type}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {type.icon}
                          <Box>
                            <Typography>{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingSection?.visible || true}
                      onChange={(e) => setEditingSection(prev => ({
                        ...prev!,
                        visible: e.target.checked
                      }))}
                    />
                  }
                  label="Sección Visible"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSectionDialog(false)}>Cancelar</Button>
            <Button
              onClick={() => editingSection && handleUpdateSection(editingSection)}
              variant="contained"
            >
              {editingSection ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
          {template ? 'Actualizar' : 'Crear'} Plantilla
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportBuilder;

