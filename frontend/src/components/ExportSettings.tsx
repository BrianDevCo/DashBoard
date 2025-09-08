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
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  Save,
  Cancel,
  Edit,
  Delete,
  Add,
  Download,
  Print,
  Settings,
} from '@mui/icons-material';
import { ExportSettings, PrintSettings, ExportFormat, PrintFormat, DEFAULT_EXPORT_SETTINGS, DEFAULT_PRINT_SETTINGS } from '../types/export';

interface ExportSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: ExportSettings) => void;
  currentSettings?: ExportSettings;
  title?: string;
}

const ExportSettingsComponent: React.FC<ExportSettingsProps> = ({
  open,
  onClose,
  onSave,
  currentSettings = DEFAULT_EXPORT_SETTINGS,
  title = 'Configuración de Exportación',
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState<ExportSettings>(currentSettings);
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT_SETTINGS);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleExportSettingsChange = (field: keyof ExportSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePrintSettingsChange = (field: keyof PrintSettings, value: any) => {
    setPrintSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleMarginsChange = (field: keyof PrintSettings['margins'], value: number) => {
    setPrintSettings(prev => ({
      ...prev,
      margins: { ...prev.margins, [field]: value }
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Exportación" />
            <Tab label="Impresión" />
            <Tab label="Avanzado" />
          </Tabs>
        </Box>

        {/* Pestaña de Exportación */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Formato de Archivo
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Formato</InputLabel>
                <Select
                  value={settings.format}
                  label="Formato"
                  onChange={(e) => handleExportSettingsChange('format', e.target.value)}
                >
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="json">JSON</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Separador Decimal</InputLabel>
                <Select
                  value={settings.decimalSeparator}
                  label="Separador Decimal"
                  onChange={(e) => handleExportSettingsChange('decimalSeparator', e.target.value)}
                >
                  <MenuItem value=",">Coma (,)</MenuItem>
                  <MenuItem value=".">Punto (.)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Formato de Fecha</InputLabel>
                <Select
                  value={settings.dateFormat}
                  label="Formato de Fecha"
                  onChange={(e) => handleExportSettingsChange('dateFormat', e.target.value)}
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  <MenuItem value="DD-MM-YYYY">DD-MM-YYYY</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Formato de Hora</InputLabel>
                <Select
                  value={settings.timeFormat}
                  label="Formato de Hora"
                  onChange={(e) => handleExportSettingsChange('timeFormat', e.target.value)}
                >
                  <MenuItem value="HH:mm:ss">24 horas (HH:mm:ss)</MenuItem>
                  <MenuItem value="HH:mm">24 horas (HH:mm)</MenuItem>
                  <MenuItem value="h:mm:ss A">12 horas (h:mm:ss A)</MenuItem>
                  <MenuItem value="h:mm A">12 horas (h:mm A)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Opciones de Contenido
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeHeaders}
                      onChange={(e) => handleExportSettingsChange('includeHeaders', e.target.checked)}
                    />
                  }
                  label="Incluir Encabezados"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeMetadata}
                      onChange={(e) => handleExportSettingsChange('includeMetadata', e.target.checked)}
                    />
                  }
                  label="Incluir Metadatos"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeCharts}
                      onChange={(e) => handleExportSettingsChange('includeCharts', e.target.checked)}
                    />
                  }
                  label="Incluir Gráficos"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeSummary}
                      onChange={(e) => handleExportSettingsChange('includeSummary', e.target.checked)}
                    />
                  }
                  label="Incluir Resumen"
                />
              </FormGroup>

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Idioma</InputLabel>
                <Select
                  value={settings.language}
                  label="Idioma"
                  onChange={(e) => handleExportSettingsChange('language', e.target.value)}
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Zona Horaria"
                value={settings.timezone}
                onChange={(e) => handleExportSettingsChange('timezone', e.target.value)}
                helperText="Ej: America/Bogota, Europe/Madrid"
              />
            </Grid>
          </Grid>
        )}

        {/* Pestaña de Impresión */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Configuración de Página
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Formato de Página</InputLabel>
                <Select
                  value={printSettings.format}
                  label="Formato de Página"
                  onChange={(e) => handlePrintSettingsChange('format', e.target.value)}
                >
                  <MenuItem value="a4">A4 (210 × 297 mm)</MenuItem>
                  <MenuItem value="letter">Carta (8.5 × 11 pulgadas)</MenuItem>
                  <MenuItem value="a3">A3 (297 × 420 mm)</MenuItem>
                  <MenuItem value="legal">Legal (8.5 × 14 pulgadas)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Orientación</InputLabel>
                <Select
                  value={printSettings.orientation}
                  label="Orientación"
                  onChange={(e) => handlePrintSettingsChange('orientation', e.target.value)}
                >
                  <MenuItem value="portrait">Vertical</MenuItem>
                  <MenuItem value="landscape">Horizontal</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Escala"
                type="number"
                value={printSettings.scale}
                onChange={(e) => handlePrintSettingsChange('scale', parseFloat(e.target.value))}
                inputProps={{ min: 0.5, max: 2.0, step: 0.1 }}
                helperText="Escala de 0.5 a 2.0"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Márgenes (mm)
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Superior"
                    type="number"
                    value={printSettings.margins.top}
                    onChange={(e) => handleMarginsChange('top', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Inferior"
                    type="number"
                    value={printSettings.margins.bottom}
                    onChange={(e) => handleMarginsChange('bottom', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Izquierdo"
                    type="number"
                    value={printSettings.margins.left}
                    onChange={(e) => handleMarginsChange('left', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Derecho"
                    type="number"
                    value={printSettings.margins.right}
                    onChange={(e) => handleMarginsChange('right', parseInt(e.target.value) || 0)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={printSettings.includeHeaders}
                      onChange={(e) => handlePrintSettingsChange('includeHeaders', e.target.checked)}
                    />
                  }
                  label="Incluir Encabezados"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={printSettings.includeFooter}
                      onChange={(e) => handlePrintSettingsChange('includeFooter', e.target.checked)}
                    />
                  }
                  label="Incluir Pie de Página"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={printSettings.includePageNumbers}
                      onChange={(e) => handlePrintSettingsChange('includePageNumbers', e.target.checked)}
                    />
                  }
                  label="Incluir Números de Página"
                />
              </FormGroup>
            </Grid>
          </Grid>
        )}

        {/* Pestaña Avanzado */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configuración Avanzada
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Estas configuraciones afectan el comportamiento de exportación e impresión
              en toda la aplicación.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Configuración de Archivos
                </Typography>
                
                <TextField
                  fullWidth
                  label="Prefijo de Archivo"
                  value="reporte_"
                  helperText="Prefijo que se agregará al nombre de los archivos exportados"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Directorio de Descarga"
                  value="~/Downloads"
                  helperText="Directorio donde se guardarán los archivos (solo lectura)"
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Configuración de Rendimiento
                </Typography>
                
                <TextField
                  fullWidth
                  label="Límite de Registros"
                  type="number"
                  value="10000"
                  helperText="Número máximo de registros a exportar por lote"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Tiempo de Espera (ms)"
                  type="number"
                  value="5000"
                  helperText="Tiempo máximo de espera para operaciones de exportación"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Plantillas de Exportación
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Plantilla de Consumo Energético"
                  secondary="Configuración optimizada para datos de energía"
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemText
                  primary="Plantilla de Facturación"
                  secondary="Configuración optimizada para datos de facturación"
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemText
                  primary="Plantilla Personalizada"
                  secondary="Crear nueva plantilla de exportación"
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <Add />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
          Guardar Configuración
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportSettingsComponent;



