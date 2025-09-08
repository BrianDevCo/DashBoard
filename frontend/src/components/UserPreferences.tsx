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
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save,
  Edit,
  Delete,
  Add,
  Palette,
  Schedule,
  Language,
  Settings,
  Label,
} from '@mui/icons-material';
import { UserPreferences, EnergyUnit, TimeZone, DateFormat, TimeFormat } from '../types/widgets';

interface UserPreferencesProps {
  preferences: UserPreferences | null;
  onSavePreferences: (preferences: UserPreferences) => void;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
}

const UserPreferencesComponent: React.FC<UserPreferencesProps> = ({
  preferences,
  onSavePreferences,
  onUpdatePreferences,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editingMeterId, setEditingMeterId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState({ name: '', description: '' });
  const [colorDialog, setColorDialog] = useState<{ open: boolean; seriesName: string; color: string }>({
    open: false,
    seriesName: '',
    color: '#1976d2',
  });

  if (!preferences) {
    return (
      <Alert severity="info">
        No hay preferencias de usuario configuradas. Contacta al administrador.
      </Alert>
    );
  }

  const handleSave = () => {
    onSavePreferences(preferences);
  };

  const handleUnitsChange = (field: 'energy' | 'reactive', value: EnergyUnit) => {
    onUpdatePreferences({
      units: {
        ...preferences.units,
        [field]: value,
      },
    });
  };

  const handleTimezoneChange = (timezone: TimeZone) => {
    onUpdatePreferences({ timezone });
  };

  const handleDateTimeFormatsChange = (field: 'dateFormat' | 'timeFormat', value: DateFormat | TimeFormat) => {
    onUpdatePreferences({
      [field]: value,
    });
  };

  const handleAddCustomLabel = () => {
    if (editingMeterId && newLabel.name) {
      onUpdatePreferences({
        customLabels: {
          ...preferences.customLabels,
          [editingMeterId]: {
            name: newLabel.name,
            description: newLabel.description,
          },
        },
      });
      setEditingMeterId(null);
      setNewLabel({ name: '', description: '' });
    }
  };

  const handleRemoveCustomLabel = (meterId: string) => {
    const newLabels = { ...preferences.customLabels };
    delete newLabels[meterId];
    onUpdatePreferences({ customLabels: newLabels });
  };

  const handleColorChange = (seriesName: string, color: string) => {
    onUpdatePreferences({
      chartColors: {
        ...preferences.chartColors,
        [seriesName]: color,
      },
    });
  };

  const openColorDialog = (seriesName: string) => {
    setColorDialog({
      open: true,
      seriesName,
      color: preferences.chartColors[seriesName] || '#1976d2',
    });
  };

  const handleColorDialogSave = () => {
    handleColorChange(colorDialog.seriesName, colorDialog.color);
    setColorDialog({ open: false, seriesName: '', color: '#1976d2' });
  };

  const defaultSeries = [
    'Energía Activa Importada',
    'Energía Activa Exportada',
    'Energía Reactiva Capacitiva',
    'Energía Reactiva Inductiva',
    'Energía Reactiva Penalizada',
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Configuración Personal
      </Typography>
      
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<Settings />} label="General" />
            <Tab icon={<Language />} label="Unidades" />
            <Tab icon={<Schedule />} label="Fecha/Hora" />
            <Tab icon={<Label />} label="Etiquetas" />
            <Tab icon={<Palette />} label="Colores" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña General */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Configuración General
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoRefresh}
                      onChange={(e) => onUpdatePreferences({ autoRefresh: e.target.checked })}
                    />
                  }
                  label="Actualización Automática"
                />
                
                <TextField
                  fullWidth
                  label="Intervalo de Actualización (segundos)"
                  type="number"
                  value={preferences.refreshInterval}
                  onChange={(e) => onUpdatePreferences({ refreshInterval: parseInt(e.target.value) || 30 })}
                  disabled={!preferences.autoRefresh}
                  sx={{ mt: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Layout por Defecto
                </Typography>
                
                <FormControl fullWidth>
                  <InputLabel>Layout Predeterminado</InputLabel>
                  <Select
                    value={preferences.defaultLayout}
                    label="Layout Predeterminado"
                    onChange={(e) => onUpdatePreferences({ defaultLayout: e.target.value })}
                  >
                    <MenuItem value="default">Dashboard Principal</MenuItem>
                    <MenuItem value="energy">Energía</MenuItem>
                    <MenuItem value="billing">Facturación</MenuItem>
                    <MenuItem value="analysis">Análisis</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Pestaña Unidades */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Unidades de Energía
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Unidad de Energía Activa</InputLabel>
                  <Select
                    value={preferences.units.energy}
                    label="Unidad de Energía Activa"
                    onChange={(e) => handleUnitsChange('energy', e.target.value as EnergyUnit)}
                  >
                    <MenuItem value="kWh">kWh (kilovatio-hora)</MenuItem>
                    <MenuItem value="MWh">MWh (megavatio-hora)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Unidad de Energía Reactiva</InputLabel>
                  <Select
                    value={preferences.units.reactive}
                    label="Unidad de Energía Reactiva"
                    onChange={(e) => handleUnitsChange('reactive', e.target.value as EnergyUnit)}
                  >
                    <MenuItem value="kVarh">kVarh (kilovar-hora)</MenuItem>
                    <MenuItem value="MVarh">MVarh (megavar-hora)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Nota:</strong> Los cambios en las unidades afectarán la visualización 
                    de todos los gráficos y tablas. Los datos se convertirán automáticamente.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* Pestaña Fecha/Hora */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Zona Horaria
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Zona Horaria</InputLabel>
                  <Select
                    value={preferences.timezone}
                    label="Zona Horaria"
                    onChange={(e) => handleTimezoneChange(e.target.value as TimeZone)}
                  >
                    <MenuItem value="America/Bogota">Bogotá (UTC-5)</MenuItem>
                    <MenuItem value="America/Mexico_City">Ciudad de México (UTC-6)</MenuItem>
                    <MenuItem value="America/New_York">Nueva York (UTC-5)</MenuItem>
                    <MenuItem value="UTC">UTC (UTC+0)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Formatos de Fecha y Hora
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Formato de Fecha</InputLabel>
                  <Select
                    value={preferences.dateFormat}
                    label="Formato de Fecha"
                    onChange={(e) => handleDateTimeFormatsChange('dateFormat', e.target.value as DateFormat)}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Formato de Hora</InputLabel>
                  <Select
                    value={preferences.timeFormat}
                    label="Formato de Hora"
                    onChange={(e) => handleDateTimeFormatsChange('timeFormat', e.target.value as TimeFormat)}
                  >
                    <MenuItem value="12h">12 horas (AM/PM)</MenuItem>
                    <MenuItem value="24h">24 horas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Pestaña Etiquetas */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Etiquetas Personalizadas
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    label="ID del Medidor"
                    value={editingMeterId || ''}
                    onChange={(e) => setEditingMeterId(e.target.value)}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setIsEditingLabel(true)}
                    disabled={!editingMeterId}
                  >
                    Agregar
                  </Button>
                </Box>
                
                <List>
                  {Object.entries(preferences.customLabels).map(([meterId, label]) => (
                    <ListItem key={meterId}>
                      <ListItemText
                        primary={label.name}
                        secondary={`${meterId} - ${label.description || 'Sin descripción'}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveCustomLabel(meterId)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Alert severity="info">
                  <Typography variant="body2">
                    Las etiquetas personalizadas te permiten asignar nombres más descriptivos 
                    a los puntos de medición en lugar de usar solo los IDs técnicos.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* Pestaña Colores */}
          {activeTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Colores de Series de Datos
                </Typography>
                
                <Grid container spacing={2}>
                  {defaultSeries.map((seriesName) => (
                    <Grid item xs={12} sm={6} md={4} key={seriesName}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2" noWrap>
                              {seriesName}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  backgroundColor: preferences.chartColors[seriesName] || '#1976d2',
                                  borderRadius: 1,
                                  border: 1,
                                  borderColor: 'divider',
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => openColorDialog(seriesName)}
                              >
                                <Palette />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Botón Guardar */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          size="large"
        >
          Guardar Configuración
        </Button>
      </Box>

      {/* Dialog para editar etiqueta */}
      <Dialog open={isEditingLabel} onClose={() => setIsEditingLabel(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Etiqueta Personalizada</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre Personalizado"
            value={newLabel.name}
            onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Descripción (opcional)"
            value={newLabel.description}
            onChange={(e) => setNewLabel({ ...newLabel, description: e.target.value })}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditingLabel(false)}>Cancelar</Button>
          <Button onClick={handleAddCustomLabel} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para seleccionar color */}
      <Dialog open={colorDialog.open} onClose={() => setColorDialog({ open: false, seriesName: '', color: '#1976d2' })}>
        <DialogTitle>Seleccionar Color para {colorDialog.seriesName}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
            <Box
              sx={{
                width: 100,
                height: 100,
                backgroundColor: colorDialog.color,
                borderRadius: 2,
                border: 2,
                borderColor: 'divider',
              }}
            />
            <TextField
              label="Código de Color"
              value={colorDialog.color}
              onChange={(e) => setColorDialog({ ...colorDialog, color: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorDialog({ open: false, seriesName: '', color: '#1976d2' })}>
            Cancelar
          </Button>
          <Button onClick={handleColorDialogSave} variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPreferencesComponent;

