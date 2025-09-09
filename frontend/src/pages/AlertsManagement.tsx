import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  IconButton,
  Badge,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Notifications,
  Settings,
  History,
  Group,
  Add,
  Refresh,
  Science,
  Schedule,
  Email,
  Sms,
  NotificationsActive,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  setInstances,
  acknowledgeAlert,
  resolveAlert,
  setGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  setSettings,
  updateSettings,
  markAllAsRead,
} from '../store/slices/alertsSlice';
import {
  useGetAlertRulesQuery,
  useGetAlertInstancesQuery,
  useGetAlertGroupsQuery,
  useGetAlertSettingsQuery,
  useCreateAlertRuleMutation,
  useUpdateAlertRuleMutation,
  useDeleteAlertRuleMutation,
  useAcknowledgeAlertMutation,
  useResolveAlertMutation,
  useBulkAcknowledgeAlertsMutation,
  useBulkResolveAlertsMutation,
  useCreateAlertGroupMutation,
  useUpdateAlertGroupMutation,
  useDeleteAlertGroupMutation,
  useUpdateAlertSettingsMutation,
} from '../services/alertsApi';
import AlertRuleEditor from '../components/AlertRuleEditor';
import AlertHistory from '../components/AlertHistory';
import AlertGroups from '../components/AlertGroups';
import { AlertRule, AlertInstance, AlertGroup, AlertSettings } from '../types/alerts';

const AlertsManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { rules, instances, groups, settings, unreadCount } = useSelector((state: RootState) => state.alerts);
  
  const [activeTab, setActiveTab] = useState(0);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Datos mock para demostración
  const generateMockAlertRules = () => [
    {
      id: 'rule-1',
      name: 'Factor de Potencia Bajo',
      description: 'Alerta cuando el factor de potencia es menor a 0.85',
      type: 'powerFactor' as const,
      severity: 'medium' as const,
      enabled: true,
      conditions: [
        {
          id: 'pf-condition-1',
          metric: 'powerFactor',
          operator: 'lt',
          threshold: 0.85,
          unit: '',
          duration: 300,
        },
      ],
      notificationChannels: ['email', 'platform'],
      recipients: [
        {
          id: 'recipient-1',
          type: 'email',
          value: 'admin@empresa.com',
          name: 'Administrador',
          channels: ['email'],
        },
      ],
      cooldownPeriod: 60,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin@empresa.com',
    },
    {
      id: 'rule-2',
      name: 'Consumo Energético Alto',
      description: 'Alerta cuando el consumo supera el 90% del promedio mensual',
      type: 'consumption' as const,
      severity: 'critical' as const,
      enabled: true,
      conditions: [
        {
          id: 'consumption-condition-1',
          metric: 'kWhD',
          operator: 'gt',
          threshold: 8000,
          unit: 'kWh',
          duration: 30,
        },
      ],
      notificationChannels: ['email', 'platform', 'sms'],
      recipients: [
        {
          id: 'recipient-2',
          type: 'email',
          value: 'supervisor@empresa.com',
          name: 'Supervisor',
          channels: ['email', 'sms'],
        },
      ],
      cooldownPeriod: 30,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin@empresa.com',
    },
    {
      id: 'rule-3',
      name: 'Pérdida de Datos',
      description: 'Alerta cuando no hay datos del medidor por más de 15 minutos',
      type: 'dataLoss' as const,
      severity: 'high' as const,
      enabled: true,
      conditions: [
        {
          id: 'data-condition-1',
          metric: 'dataAvailability',
          operator: 'eq',
          threshold: 0,
          unit: '',
          duration: 15,
        },
      ],
      notificationChannels: ['email', 'platform'],
      recipients: [
        {
          id: 'recipient-3',
          type: 'email',
          value: 'tecnico@empresa.com',
          name: 'Técnico',
          channels: ['email'],
        },
      ],
      cooldownPeriod: 15,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin@empresa.com',
    },
    {
      id: 'rule-4',
      name: 'Demanda Alta',
      description: 'Alerta cuando la demanda supera el 90% de la capacidad',
      type: 'demand' as const,
      severity: 'medium' as const,
      enabled: true,
      conditions: [
        {
          id: 'demand-condition-1',
          metric: 'demand',
          operator: 'gt',
          threshold: 900,
          unit: 'kW',
          duration: 60,
        },
      ],
      notificationChannels: ['email', 'platform'],
      recipients: [
        {
          id: 'recipient-4',
          type: 'email',
          value: 'supervisor@empresa.com',
          name: 'Supervisor',
          channels: ['email'],
        },
      ],
      cooldownPeriod: 60,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin@empresa.com',
    },
  ];

  const generateMockAlertInstances = () => [
    {
      id: 'alert-1',
      ruleId: 'rule-1',
      ruleName: 'Factor de Potencia Bajo',
      type: 'powerFactor',
      severity: 'medium',
      status: 'active',
      title: 'Factor de Potencia Bajo Detectado',
      message: 'Factor de potencia en MTR-001: 0.82 (umbral: 0.85)',
      triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      acknowledgedAt: undefined,
      acknowledgedBy: undefined,
      resolvedAt: undefined,
      resolvedBy: undefined,
      data: {
        meterId: 'MTR-001',
        location: 'Planta Principal',
        currentValue: 0.82,
        threshold: 0.85,
        unit: '',
        additionalData: {
          powerFactor: 0.82,
          recommendedAction: 'Instalar bancos de capacitores',
        },
      },
      notifications: [
        {
          id: 'notif-1',
          channel: 'email',
          recipient: 'admin@empresa.com',
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          retryCount: 0,
        },
      ],
    },
    {
      id: 'alert-2',
      ruleId: 'rule-2',
      ruleName: 'Consumo Energético Alto',
      type: 'consumption',
      severity: 'critical',
      status: 'acknowledged',
      title: 'Consumo Energético Crítico',
      message: 'Consumo energético en MTR-002: 8,450 kWh (umbral: 8,000 kWh)',
      triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      acknowledgedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      acknowledgedBy: 'admin@empresa.com',
      resolvedAt: null,
      resolvedBy: null,
      data: {
        meterId: 'MTR-002',
        location: 'Edificio A',
        currentValue: 8450,
        threshold: 8000,
        unit: 'kWh',
        additionalData: {
          dailyConsumption: 8450,
          monthlyAverage: 7500,
          percentageIncrease: 12.7,
        },
      },
      notifications: [
        {
          id: 'notif-2',
          channel: 'email',
          recipient: 'supervisor@empresa.com',
          sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          retryCount: 0,
        },
        {
          id: 'notif-3',
          channel: 'sms',
          recipient: '+573001234567',
          sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          retryCount: 0,
        },
      ],
    },
    {
      id: 'alert-3',
      ruleId: 'rule-3',
      ruleName: 'Pérdida de Datos',
      type: 'dataLoss',
      severity: 'high',
      status: 'resolved',
      title: 'Pérdida de Comunicación con Medidor',
      message: 'No se han recibido datos del medidor MTR-003 durante 20 minutos',
      triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      acknowledgedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      acknowledgedBy: 'tecnico@empresa.com',
      resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      resolvedBy: 'tecnico@empresa.com',
      data: {
        meterId: 'MTR-003',
        location: 'Edificio B',
        currentValue: 0,
        threshold: 0,
        unit: 'minutos',
        additionalData: {
          lastReading: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          durationWithoutData: 20,
          communicationStatus: 'lost',
        },
      },
      notifications: [
        {
          id: 'notif-4',
          channel: 'email',
          recipient: 'tecnico@empresa.com',
          sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          retryCount: 0,
        },
      ],
    },
    {
      id: 'alert-4',
      ruleId: 'rule-4',
      ruleName: 'Demanda Alta',
      type: 'demand',
      severity: 'medium',
      status: 'active',
      title: 'Demanda de Energía Alta',
      message: 'Demanda actual: 950 kW (umbral: 900 kW)',
      triggeredAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      acknowledgedAt: undefined,
      acknowledgedBy: undefined,
      resolvedAt: undefined,
      resolvedBy: undefined,
      data: {
        meterId: 'MTR-001',
        location: 'Planta Principal',
        currentValue: 950,
        threshold: 900,
        unit: 'kW',
        additionalData: {
          peakDemand: 950,
          capacity: 1000,
          utilizationPercentage: 95,
        },
      },
      notifications: [
        {
          id: 'notif-5',
          channel: 'email',
          recipient: 'supervisor@empresa.com',
          sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          retryCount: 0,
        },
      ],
    },
  ];

  const generateMockAlertGroups = () => [
    {
      id: 'group-1',
      name: 'Grupo Crítico',
      description: 'Alertas críticas que requieren atención inmediata',
      meterIds: ['MTR-001', 'MTR-002'],
      locationIds: ['loc-1', 'loc-2'],
      userIds: ['user-1', 'user-2'],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'group-2',
      name: 'Grupo Monitoreo',
      description: 'Alertas de monitoreo general del sistema',
      meterIds: ['MTR-001', 'MTR-003'],
      locationIds: ['loc-1', 'loc-3'],
      userIds: ['user-3'],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const generateMockAlertSettings = () => ({
    userId: 'current-user',
    globalSettings: {
      enableEmail: true,
      enableSMS: false,
      enablePlatform: true,
      quietHours: [
        {
          start: '22:00',
          end: '06:00',
          days: [0, 1, 2, 3, 4, 5, 6], // Todos los días
        },
      ],
      maxAlertsPerHour: 10,
      digestFrequency: 'daily',
    },
    channelSettings: {
      email: {
        enabled: true,
        address: 'usuario@empresa.com',
        frequency: 'immediate',
      },
      sms: {
        enabled: false,
        phoneNumber: '+573001234567',
        frequency: 'immediate',
      },
      platform: {
        enabled: true,
        showInSidebar: true,
        showAsToast: true,
        soundEnabled: true,
      },
    },
    suppressionRules: [
      {
        id: 'suppress-1',
        name: 'Supresión de Pruebas',
        conditions: [
          {
            id: 'test-condition',
            metric: 'testMode',
            operator: 'eq',
            threshold: 1,
            unit: '',
            duration: 0,
          },
        ],
        duration: 60,
        enabled: true,
      },
    ],
  });

  // Usar datos mock en lugar de las queries
  const rulesData = generateMockAlertRules();
  const instancesData = generateMockAlertInstances();
  const groupsData = generateMockAlertGroups();
  const settingsData = generateMockAlertSettings();

  // Mutations
  const [createRule] = useCreateAlertRuleMutation();
  const [updateRule] = useUpdateAlertRuleMutation();
  const [deleteRule] = useDeleteAlertRuleMutation();
  const [acknowledgeAlert] = useAcknowledgeAlertMutation();
  const [resolveAlert] = useResolveAlertMutation();
  const [bulkAcknowledge] = useBulkAcknowledgeAlertsMutation();
  const [bulkResolve] = useBulkResolveAlertsMutation();
  const [createGroup] = useCreateAlertGroupMutation();
  const [updateGroup] = useUpdateAlertGroupMutation();
  const [deleteGroup] = useDeleteAlertGroupMutation();
  const [updateSettings] = useUpdateAlertSettingsMutation();

  // Sincronizar datos con el store
  useEffect(() => {
    if (rulesData) dispatch(setRules(rulesData));
  }, [rulesData, dispatch]);

  useEffect(() => {
    if (instancesData) dispatch(setInstances(instancesData));
  }, [instancesData, dispatch]);

  useEffect(() => {
    if (groupsData) dispatch(setGroups(groupsData));
  }, [groupsData, dispatch]);

  useEffect(() => {
    if (settingsData) dispatch(setSettings(settingsData));
  }, [settingsData, dispatch]);

  const handleCreateRule = async (ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createRule(ruleData).unwrap();
      setSnackbar({ open: true, message: 'Regla de alerta creada exitosamente' });
      setIsCreatingRule(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al crear la regla de alerta' });
    }
  };

  const handleUpdateRule = async (id: string, ruleData: Partial<AlertRule>) => {
    try {
      await updateRule({ id, rule: ruleData }).unwrap();
      setSnackbar({ open: true, message: 'Regla de alerta actualizada exitosamente' });
      setEditingRule(null);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar la regla de alerta' });
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await deleteRule(id).unwrap();
      setSnackbar({ open: true, message: 'Regla de alerta eliminada exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar la regla de alerta' });
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await acknowledgeAlert({ id, acknowledgedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: 'Alerta reconocida exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al reconocer la alerta' });
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await resolveAlert({ id, resolvedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: 'Alerta resuelta exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al resolver la alerta' });
    }
  };

  const handleBulkAcknowledge = async (ids: string[]) => {
    try {
      await bulkAcknowledge({ ids, acknowledgedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: `${ids.length} alertas reconocidas exitosamente` });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al reconocer las alertas' });
    }
  };

  const handleBulkResolve = async (ids: string[]) => {
    try {
      await bulkResolve({ ids, resolvedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: `${ids.length} alertas resueltas exitosamente` });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al resolver las alertas' });
    }
  };

  const handleCreateGroup = async (groupData: Omit<AlertGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createGroup(groupData).unwrap();
      setSnackbar({ open: true, message: 'Grupo creado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al crear el grupo' });
    }
  };

  const handleUpdateGroup = async (id: string, groupData: Partial<AlertGroup>) => {
    try {
      await updateGroup({ id, group: groupData }).unwrap();
      setSnackbar({ open: true, message: 'Grupo actualizado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar el grupo' });
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteGroup(id).unwrap();
      setSnackbar({ open: true, message: 'Grupo eliminado exitosamente' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el grupo' });
    }
  };

  const handleRefresh = () => {
    // En modo mock, no hay nada que refrescar
    setSnackbar({ open: true, message: 'Datos actualizados (modo demostración)' });
  };

  const handleExport = () => {
    // Implementar exportación de alertas
    setSnackbar({ open: true, message: 'Funcionalidad de exportación en desarrollo' });
  };

  const handleTestRule = (rule: AlertRule) => {
    // Implementar prueba de regla
    setSnackbar({ open: true, message: 'Funcionalidad de prueba en desarrollo' });
  };

  const getActiveAlertsCount = () => {
    return instancesData.filter(instance => instance.status === 'active').length;
  };

  const getCriticalAlertsCount = () => {
    return instancesData.filter(instance => 
      instance.status === 'active' && (instance.severity === 'critical' || instance.severity === 'high')
    ).length;
  };

  const getRulesCount = () => {
    return rulesData.length;
  };

  const getEnabledRulesCount = () => {
    return rulesData.filter(rule => rule.enabled).length;
  };

  const getUnreadCount = () => {
    return instancesData.filter(instance => 
      instance.status === 'active' && instance.acknowledgedAt === undefined
    ).length;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Alertas y Notificaciones
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ Sistema de Alertas funcionando correctamente con datos simulados para demostración
      </Alert>

      {/* Resumen de alertas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error">
                    {getActiveAlertsCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alertas Activas
                  </Typography>
                </Box>
                <NotificationsActive color="error" sx={{ fontSize: 40 }} />
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
                    {getCriticalAlertsCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Críticas
                  </Typography>
                </Box>
                <Notifications color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {getEnabledRulesCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reglas Activas
                  </Typography>
                </Box>
                <Settings color="primary" sx={{ fontSize: 40 }} />
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
                    {groupsData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Grupos
                  </Typography>
                </Box>
                <Group color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas principales */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab
              icon={
                <Badge badgeContent={getUnreadCount()} color="error">
                  <History />
                </Badge>
              }
              label="Historial de Alertas"
            />
            <Tab icon={<Settings />} label="Reglas de Alertas" />
            <Tab icon={<Group />} label="Grupos" />
            <Tab icon={<Schedule />} label="Configuración" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña de Historial */}
          {activeTab === 0 && (
            <AlertHistory
              alerts={instancesData}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
              onBulkAcknowledge={handleBulkAcknowledge}
              onBulkResolve={handleBulkResolve}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />
          )}

          {/* Pestaña de Reglas */}
          {activeTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Reglas de Alertas ({rulesData.length})
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    startIcon={<Add />}
                    onClick={() => setIsCreatingRule(true)}
                    variant="contained"
                  >
                    Nueva Regla
                  </Button>
                  <Button
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    variant="outlined"
                  >
                    Actualizar
                  </Button>
                </Box>
              </Box>

              {rulesData.length === 0 ? (
                <Alert severity="info">
                  No hay reglas de alertas configuradas. Crea tu primera regla para comenzar a monitorear.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {rulesData.map((rule) => (
                    <Grid item xs={12} md={6} lg={4} key={rule.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box flex={1}>
                              <Typography variant="h6" noWrap>
                                {rule.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {rule.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={rule.enabled ? 'Activa' : 'Inactiva'}
                              color={rule.enabled ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>

                          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            <Chip
                              label={rule.type}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={rule.severity}
                              color={rule.severity === 'critical' ? 'error' : 'default'}
                              size="small"
                            />
                            <Chip
                              label={`${rule.conditions.length} condiciones`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {rule.notificationChannels.join(', ')}
                            </Typography>
                            <Box display="flex" gap={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingRule(rule)}
                              >
                                <Settings />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleTestRule(rule)}
                              >
                                <Science />
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

          {/* Pestaña de Grupos */}
          {activeTab === 2 && (
            <AlertGroups
              groups={groupsData}
              meters={[
                { id: 'MTR-001', name: 'Medidor Principal', location: 'Planta Principal' },
                { id: 'MTR-002', name: 'Medidor Edificio A', location: 'Edificio A' },
                { id: 'MTR-003', name: 'Medidor Edificio B', location: 'Edificio B' },
                { id: 'MTR-004', name: 'Medidor Almacén', location: 'Almacén Central' },
              ]}
              users={[
                { id: 'user-1', name: 'Administrador', email: 'admin@empresa.com' },
                { id: 'user-2', name: 'Supervisor', email: 'supervisor@empresa.com' },
                { id: 'user-3', name: 'Técnico', email: 'tecnico@empresa.com' },
              ]}
              locations={[
                { id: 'loc-1', name: 'Planta Principal', description: 'Planta principal de producción' },
                { id: 'loc-2', name: 'Edificio A', description: 'Edificio administrativo A' },
                { id: 'loc-3', name: 'Edificio B', description: 'Edificio administrativo B' },
                { id: 'loc-4', name: 'Almacén Central', description: 'Almacén central de materiales' },
              ]}
              onCreateGroup={handleCreateGroup}
              onUpdateGroup={handleUpdateGroup}
              onDeleteGroup={handleDeleteGroup}
            />
          )}

          {/* Pestaña de Configuración */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Configuración de Notificaciones
              </Typography>
              <Alert severity="info">
                La configuración de notificaciones está en desarrollo. Próximamente podrás configurar
                canales de notificación, horarios de silencio y preferencias de usuario.
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar regla */}
      <Dialog
        open={isCreatingRule}
        onClose={() => setIsCreatingRule(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <AlertRuleEditor
            rule={editingRule}
            onSave={handleCreateRule}
            onCancel={() => {
              setIsCreatingRule(false);
              setEditingRule(null);
            }}
            onTest={handleTestRule}
            isEditing={!!editingRule}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default AlertsManagement;

