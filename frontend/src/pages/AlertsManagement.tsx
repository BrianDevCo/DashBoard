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

  // Queries
  const { data: rulesData, refetch: refetchRules } = useGetAlertRulesQuery();
  const { data: instancesData, refetch: refetchInstances } = useGetAlertInstancesQuery({
    status: 'all',
    limit: 100,
  });
  const { data: groupsData, refetch: refetchGroups } = useGetAlertGroupsQuery();
  const { data: settingsData, refetch: refetchSettings } = useGetAlertSettingsQuery('current-user');

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
      refetchRules();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al crear la regla de alerta' });
    }
  };

  const handleUpdateRule = async (id: string, ruleData: Partial<AlertRule>) => {
    try {
      await updateRule({ id, rule: ruleData }).unwrap();
      setSnackbar({ open: true, message: 'Regla de alerta actualizada exitosamente' });
      setEditingRule(null);
      refetchRules();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar la regla de alerta' });
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await deleteRule(id).unwrap();
      setSnackbar({ open: true, message: 'Regla de alerta eliminada exitosamente' });
      refetchRules();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar la regla de alerta' });
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await acknowledgeAlert({ id, acknowledgedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: 'Alerta reconocida exitosamente' });
      refetchInstances();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al reconocer la alerta' });
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await resolveAlert({ id, resolvedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: 'Alerta resuelta exitosamente' });
      refetchInstances();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al resolver la alerta' });
    }
  };

  const handleBulkAcknowledge = async (ids: string[]) => {
    try {
      await bulkAcknowledge({ ids, acknowledgedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: `${ids.length} alertas reconocidas exitosamente` });
      refetchInstances();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al reconocer las alertas' });
    }
  };

  const handleBulkResolve = async (ids: string[]) => {
    try {
      await bulkResolve({ ids, resolvedBy: 'current-user' }).unwrap();
      setSnackbar({ open: true, message: `${ids.length} alertas resueltas exitosamente` });
      refetchInstances();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al resolver las alertas' });
    }
  };

  const handleCreateGroup = async (groupData: Omit<AlertGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createGroup(groupData).unwrap();
      setSnackbar({ open: true, message: 'Grupo creado exitosamente' });
      refetchGroups();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al crear el grupo' });
    }
  };

  const handleUpdateGroup = async (id: string, groupData: Partial<AlertGroup>) => {
    try {
      await updateGroup({ id, group: groupData }).unwrap();
      setSnackbar({ open: true, message: 'Grupo actualizado exitosamente' });
      refetchGroups();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar el grupo' });
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteGroup(id).unwrap();
      setSnackbar({ open: true, message: 'Grupo eliminado exitosamente' });
      refetchGroups();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el grupo' });
    }
  };

  const handleRefresh = () => {
    refetchRules();
    refetchInstances();
    refetchGroups();
    refetchSettings();
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
    return instances.filter(instance => instance.status === 'active').length;
  };

  const getCriticalAlertsCount = () => {
    return instances.filter(instance => 
      instance.status === 'active' && instance.severity === 'critical'
    ).length;
  };

  const getRulesCount = () => {
    return rules.length;
  };

  const getEnabledRulesCount = () => {
    return rules.filter(rule => rule.enabled).length;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Alertas y Notificaciones
      </Typography>

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
                    {groups.length}
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
                <Badge badgeContent={unreadCount} color="error">
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
              alerts={instances}
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
                  Reglas de Alertas ({rules.length})
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

              {rules.length === 0 ? (
                <Alert severity="info">
                  No hay reglas de alertas configuradas. Crea tu primera regla para comenzar a monitorear.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {rules.map((rule) => (
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
              groups={groups}
              meters={[]} // TODO: Obtener de la API
              users={[]} // TODO: Obtener de la API
              locations={[]} // TODO: Obtener de la API
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

