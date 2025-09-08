import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Save,
  Cancel,
  ExpandMore,
  Schedule,
  Notifications,
  Settings,
  Science,
} from '@mui/icons-material';
import { AlertRule, AlertCondition, AlertRecipient, AlertType, AlertSeverity, NotificationChannel, TimeRange } from '../types/alerts';

interface AlertRuleEditorProps {
  rule?: AlertRule | null;
  onSave: (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onTest?: (rule: AlertRule) => void;
  isEditing?: boolean;
}

const AlertRuleEditor: React.FC<AlertRuleEditorProps> = ({
  rule,
  onSave,
  onCancel,
  onTest,
  isEditing = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    type: 'consumption',
    severity: 'medium',
    enabled: true,
    conditions: [],
    notificationChannels: ['platform'],
    recipients: [],
    cooldownPeriod: 60,
    createdBy: 'current-user',
  });

  const [newCondition, setNewCondition] = useState<AlertCondition>({
    id: '',
    metric: 'kWhD',
    operator: 'gt',
    threshold: 0,
    unit: 'kWh',
    duration: 60,
  });

  const [newRecipient, setNewRecipient] = useState<AlertRecipient>({
    id: '',
    type: 'user',
    value: '',
    name: '',
    channels: ['platform'],
  });

  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: '08:00',
    end: '18:00',
    days: [1, 2, 3, 4, 5], // Lunes a Viernes
  });

  const [showConditionDialog, setShowConditionDialog] = useState(false);
  const [showRecipientDialog, setShowRecipientDialog] = useState(false);
  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const [editingRecipientIndex, setEditingRecipientIndex] = useState<number | null>(null);

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        type: rule.type,
        severity: rule.severity,
        enabled: rule.enabled,
        conditions: rule.conditions,
        notificationChannels: rule.notificationChannels,
        recipients: rule.recipients,
        cooldownPeriod: rule.cooldownPeriod,
        createdBy: rule.createdBy,
      });
      if (rule.timeRange) {
        setTimeRange(rule.timeRange);
      }
    }
  }, [rule]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCondition = () => {
    const condition: AlertCondition = {
      ...newCondition,
      id: `condition-${Date.now()}`,
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, condition],
    }));
    setNewCondition({
      id: '',
      metric: 'kWhD',
      operator: 'gt',
      threshold: 0,
      unit: 'kWh',
      duration: 60,
    });
    setShowConditionDialog(false);
  };

  const handleEditCondition = (index: number) => {
    setEditingConditionIndex(index);
    setNewCondition(formData.conditions[index]);
    setShowConditionDialog(true);
  };

  const handleUpdateCondition = () => {
    if (editingConditionIndex !== null) {
      const updatedConditions = [...formData.conditions];
      updatedConditions[editingConditionIndex] = {
        ...newCondition,
        id: updatedConditions[editingConditionIndex].id,
      };
      setFormData(prev => ({ ...prev, conditions: updatedConditions }));
    }
    setEditingConditionIndex(null);
    setShowConditionDialog(false);
  };

  const handleDeleteCondition = (index: number) => {
    const updatedConditions = formData.conditions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, conditions: updatedConditions }));
  };

  const handleAddRecipient = () => {
    const recipient: AlertRecipient = {
      ...newRecipient,
      id: `recipient-${Date.now()}`,
    };
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, recipient],
    }));
    setNewRecipient({
      id: '',
      type: 'user',
      value: '',
      name: '',
      channels: ['platform'],
    });
    setShowRecipientDialog(false);
  };

  const handleEditRecipient = (index: number) => {
    setEditingRecipientIndex(index);
    setNewRecipient(formData.recipients[index]);
    setShowRecipientDialog(true);
  };

  const handleUpdateRecipient = () => {
    if (editingRecipientIndex !== null) {
      const updatedRecipients = [...formData.recipients];
      updatedRecipients[editingRecipientIndex] = {
        ...newRecipient,
        id: updatedRecipients[editingRecipientIndex].id,
      };
      setFormData(prev => ({ ...prev, recipients: updatedRecipients }));
    }
    setEditingRecipientIndex(null);
    setShowRecipientDialog(false);
  };

  const handleDeleteRecipient = (index: number) => {
    const updatedRecipients = formData.recipients.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, recipients: updatedRecipients }));
  };

  const handleSave = () => {
    const ruleData = {
      ...formData,
      timeRange: formData.conditions.length > 0 ? timeRange : undefined,
    };
    onSave(ruleData);
  };

  const getMetricOptions = (type: AlertType) => {
    switch (type) {
      case 'consumption':
        return [
          { value: 'kWhD', label: 'Energía Activa Importada (kWh)' },
          { value: 'kWhR', label: 'Energía Activa Exportada (kWh)' },
          { value: 'kVarhD', label: 'Energía Reactiva Capacitiva (kVarh)' },
          { value: 'kVarhR', label: 'Energía Reactiva Inductiva (kVarh)' },
        ];
      case 'powerFactor':
        return [
          { value: 'powerFactor', label: 'Factor de Potencia' },
        ];
      case 'dataLoss':
        return [
          { value: 'dataAvailability', label: 'Disponibilidad de Datos' },
        ];
      case 'demand':
        return [
          { value: 'demand', label: 'Demanda Máxima (kW)' },
        ];
      case 'efficiency':
        return [
          { value: 'efficiency', label: 'Eficiencia Energética (%)' },
        ];
      case 'billing':
        return [
          { value: 'cost', label: 'Costo Total ($)' },
          { value: 'costPerKWh', label: 'Costo por kWh ($)' },
        ];
      default:
        return [];
    }
  };

  const getUnitForMetric = (metric: string) => {
    const unitMap: { [key: string]: string } = {
      'kWhD': 'kWh',
      'kWhR': 'kWh',
      'kVarhD': 'kVarh',
      'kVarhR': 'kVarh',
      'powerFactor': '',
      'dataAvailability': '',
      'demand': 'kW',
      'efficiency': '%',
      'cost': '$',
      'costPerKWh': '$/kWh',
    };
    return unitMap[metric] || '';
  };

  const steps = [
    'Información Básica',
    'Condiciones',
    'Notificaciones',
    'Horarios',
    'Revisión',
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Editar Regla de Alerta' : 'Nueva Regla de Alerta'}
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {/* Paso 1: Información Básica */}
        <Step>
          <StepLabel>Información Básica</StepLabel>
          <StepContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de la Regla"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Alerta</InputLabel>
                  <Select
                    value={formData.type}
                    label="Tipo de Alerta"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <MenuItem value="consumption">Consumo Energético</MenuItem>
                    <MenuItem value="powerFactor">Factor de Potencia</MenuItem>
                    <MenuItem value="dataLoss">Pérdida de Datos</MenuItem>
                    <MenuItem value="demand">Demanda</MenuItem>
                    <MenuItem value="efficiency">Eficiencia</MenuItem>
                    <MenuItem value="billing">Facturación</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Severidad</InputLabel>
                  <Select
                    value={formData.severity}
                    label="Severidad"
                    onChange={(e) => handleInputChange('severity', e.target.value)}
                  >
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="critical">Crítica</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.enabled}
                      onChange={(e) => handleInputChange('enabled', e.target.checked)}
                    />
                  }
                  label="Regla Activa"
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

        {/* Paso 2: Condiciones */}
        <Step>
          <StepLabel>Condiciones</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <Button
                startIcon={<Add />}
                onClick={() => setShowConditionDialog(true)}
                variant="outlined"
              >
                Agregar Condición
              </Button>
            </Box>

            {formData.conditions.length === 0 ? (
              <Alert severity="info">
                No hay condiciones configuradas. Agrega al menos una condición para que la regla funcione.
              </Alert>
            ) : (
              <List>
                {formData.conditions.map((condition, index) => (
                  <ListItem key={condition.id}>
                    <ListItemText
                      primary={`${condition.metric} ${condition.operator} ${condition.threshold} ${condition.unit}`}
                      secondary={`Duración: ${condition.duration} minutos`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleEditCondition(index)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCondition(index)} color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
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

        {/* Paso 3: Notificaciones */}
        <Step>
          <StepLabel>Notificaciones</StepLabel>
          <StepContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Canales de Notificación
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.notificationChannels.includes('email')}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...formData.notificationChannels, 'email']
                            : formData.notificationChannels.filter(c => c !== 'email');
                          handleInputChange('notificationChannels', channels);
                        }}
                      />
                    }
                    label="Correo Electrónico"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.notificationChannels.includes('platform')}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...formData.notificationChannels, 'platform']
                            : formData.notificationChannels.filter(c => c !== 'platform');
                          handleInputChange('notificationChannels', channels);
                        }}
                      />
                    }
                    label="Notificación en Plataforma"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.notificationChannels.includes('sms')}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...formData.notificationChannels, 'sms']
                            : formData.notificationChannels.filter(c => c !== 'sms');
                          handleInputChange('notificationChannels', channels);
                        }}
                      />
                    }
                    label="SMS"
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1">
                    Destinatarios
                  </Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={() => setShowRecipientDialog(true)}
                    variant="outlined"
                    size="small"
                  >
                    Agregar
                  </Button>
                </Box>

                {formData.recipients.length === 0 ? (
                  <Alert severity="info">
                    No hay destinatarios configurados. Agrega al menos un destinatario para recibir las alertas.
                  </Alert>
                ) : (
                  <List>
                    {formData.recipients.map((recipient, index) => (
                      <ListItem key={recipient.id}>
                        <ListItemText
                          primary={recipient.name}
                          secondary={`${recipient.type}: ${recipient.value}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => handleEditRecipient(index)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteRecipient(index)} color="error">
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Período de Cooldown (minutos)"
                  type="number"
                  value={formData.cooldownPeriod}
                  onChange={(e) => handleInputChange('cooldownPeriod', parseInt(e.target.value) || 0)}
                  helperText="Tiempo mínimo entre alertas del mismo tipo"
                />
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

        {/* Paso 4: Horarios */}
        <Step>
          <StepLabel>Horarios de Activación</StepLabel>
          <StepContent>
            <FormControlLabel
              control={
                <Switch
                  checked={!!formData.timeRange}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setFormData(prev => ({ ...prev, timeRange: undefined }));
                    }
                  }}
                />
              }
              label="Restringir a horarios específicos"
            />

            {formData.timeRange && (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hora de Inicio"
                    type="time"
                    value={timeRange.start}
                    onChange={(e) => setTimeRange(prev => ({ ...prev, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hora de Fin"
                    type="time"
                    value={timeRange.end}
                    onChange={(e) => setTimeRange(prev => ({ ...prev, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Días de la Semana
                  </Typography>
                  <FormGroup row>
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={timeRange.days.includes(index)}
                            onChange={(e) => {
                              const days = e.target.checked
                                ? [...timeRange.days, index]
                                : timeRange.days.filter(d => d !== index);
                              setTimeRange(prev => ({ ...prev, days }));
                            }}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              </Grid>
            )}

            <Box sx={{ mt: 2 }}>
              <Button onClick={() => setActiveStep(2)} sx={{ mr: 1 }}>
                Anterior
              </Button>
              <Button onClick={() => setActiveStep(4)} variant="contained">
                Siguiente
              </Button>
            </Box>
          </StepContent>
        </Step>

        {/* Paso 5: Revisión */}
        <Step>
          <StepLabel>Revisión</StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de la Regla
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Nombre:</strong> {formData.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tipo:</strong> {formData.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Severidad:</strong> {formData.severity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Estado:</strong> {formData.enabled ? 'Activa' : 'Inactiva'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Condiciones:</strong> {formData.conditions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Destinatarios:</strong> {formData.recipients.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Canales:</strong> {formData.notificationChannels.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cooldown:</strong> {formData.cooldownPeriod} min
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ mt: 2 }}>
              <Button onClick={() => setActiveStep(3)} sx={{ mr: 1 }}>
                Anterior
              </Button>
              <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
                {isEditing ? 'Actualizar' : 'Crear'} Regla
              </Button>
              {onTest && (
                <Button
                  onClick={() => onTest(formData as AlertRule)}
                  startIcon={<Science />}
                  sx={{ ml: 1 }}
                >
                  Probar
                </Button>
              )}
            </Box>
          </StepContent>
        </Step>
      </Stepper>

      {/* Dialog para agregar/editar condición */}
      <Dialog open={showConditionDialog} onClose={() => setShowConditionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingConditionIndex !== null ? 'Editar Condición' : 'Nueva Condición'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Métrica</InputLabel>
                <Select
                  value={newCondition.metric}
                  label="Métrica"
                  onChange={(e) => setNewCondition(prev => ({ ...prev, metric: e.target.value, unit: getUnitForMetric(e.target.value) }))}
                >
                  {getMetricOptions(formData.type).map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Operador</InputLabel>
                <Select
                  value={newCondition.operator}
                  label="Operador"
                  onChange={(e) => setNewCondition(prev => ({ ...prev, operator: e.target.value as any }))}
                >
                  <MenuItem value="gt">Mayor que (&gt;)</MenuItem>
                  <MenuItem value="gte">Mayor o igual que (&gt;=)</MenuItem>
                  <MenuItem value="lt">Menor que (&lt;)</MenuItem>
                  <MenuItem value="lte">Menor o igual que (&lt;=)</MenuItem>
                  <MenuItem value="eq">Igual a (=)</MenuItem>
                  <MenuItem value="ne">Diferente de (≠)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Umbral"
                type="number"
                value={newCondition.threshold}
                onChange={(e) => setNewCondition(prev => ({ ...prev, threshold: parseFloat(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unidad"
                value={newCondition.unit}
                onChange={(e) => setNewCondition(prev => ({ ...prev, unit: e.target.value }))}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duración (minutos)"
                type="number"
                value={newCondition.duration}
                onChange={(e) => setNewCondition(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                helperText="Tiempo que debe mantenerse la condición para activar la alerta"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConditionDialog(false)}>Cancelar</Button>
          <Button
            onClick={editingConditionIndex !== null ? handleUpdateCondition : handleAddCondition}
            variant="contained"
          >
            {editingConditionIndex !== null ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para agregar/editar destinatario */}
      <Dialog open={showRecipientDialog} onClose={() => setShowRecipientDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRecipientIndex !== null ? 'Editar Destinatario' : 'Nuevo Destinatario'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={newRecipient.type}
                  label="Tipo"
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="group">Grupo</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="phone">Teléfono</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={newRecipient.type === 'email' ? 'Email' : newRecipient.type === 'phone' ? 'Teléfono' : 'ID'}
                value={newRecipient.value}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, value: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Canales de Notificación
              </Typography>
              <FormGroup row>
                {(['email', 'platform', 'sms'] as NotificationChannel[]).map(channel => (
                  <FormControlLabel
                    key={channel}
                    control={
                      <Checkbox
                        checked={newRecipient.channels.includes(channel)}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...newRecipient.channels, channel]
                            : newRecipient.channels.filter(c => c !== channel);
                          setNewRecipient(prev => ({ ...prev, channels }));
                        }}
                      />
                    }
                    label={channel === 'platform' ? 'Plataforma' : channel.toUpperCase()}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRecipientDialog(false)}>Cancelar</Button>
          <Button
            onClick={editingRecipientIndex !== null ? handleUpdateRecipient : handleAddRecipient}
            variant="contained"
          >
            {editingRecipientIndex !== null ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertRuleEditor;

