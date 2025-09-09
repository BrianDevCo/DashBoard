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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Divider,
  Chip,
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
  Avatar,
  Menu,
  MenuItem as MenuItemComponent,
  Pagination,
} from '@mui/material';
import {
  Person,
  Group,
  Security,
  History,
  Add,
  Edit,
  Delete,
  MoreVert,
  Settings,
  Download,
  Upload,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Info,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  setRoles,
  addRole,
  updateRole,
  deleteRole,
  setAccessLogs,
  setSessions,
  updateUserStatus,
  updateUserPermissions,
  updateUserMeters,
  updateUserGroups,
} from '../store/slices/usersSlice';
import {
  useGetUsersQuery,
  useGetUserGroupsQuery,
  useGetRolesQuery,
  useGetAccessLogsQuery,
  useGetUserSessionsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserPermissionsMutation,
  useUpdateUserMetersMutation,
  useUpdateUserGroupsMutation,
  useCreateUserGroupMutation,
  useUpdateUserGroupMutation,
  useDeleteUserGroupMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetUserStatsQuery,
} from '../services/usersApi';
import UserManagement from '../components/UserManagement';
import AccessLogs from '../components/AccessLogs';
import { User, UserGroup, Role, AccessLog, Permission, SYSTEM_ROLES, PERMISSION_GROUPS } from '../types/users';

const UserAdministration: React.FC = () => {
  const dispatch = useDispatch();
  const { users, groups, roles, accessLogs, sessions } = useSelector((state: RootState) => state.users);
  
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Queries
  const { data: usersData, refetch: refetchUsers } = useGetUsersQuery({
    page: 1,
    limit: 100,
  });
  const { data: groupsData, refetch: refetchGroups } = useGetUserGroupsQuery();
  const { data: rolesData, refetch: refetchRoles } = useGetRolesQuery();
  const { data: logsData, refetch: refetchLogs } = useGetAccessLogsQuery({
    page: 1,
    limit: 100,
  });
  const { data: sessionsData, refetch: refetchSessions } = useGetUserSessionsQuery('current-user');
  const { data: statsData } = useGetUserStatsQuery({});

  // Mutations
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserPermissions] = useUpdateUserPermissionsMutation();
  const [updateUserMeters] = useUpdateUserMetersMutation();
  const [updateUserGroups] = useUpdateUserGroupsMutation();
  const [createGroup] = useCreateUserGroupMutation();
  const [updateGroup] = useUpdateUserGroupMutation();
  const [deleteGroup] = useDeleteUserGroupMutation();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  // Sincronizar datos con el store
  // Sincronizar datos con el store (solo una vez al montar)
  useEffect(() => {
    if (usersData) dispatch(setUsers(usersData));
    if (groupsData) dispatch(setGroups(groupsData));
    if (rolesData) dispatch(setRoles(rolesData));
    if (logsData) dispatch(setAccessLogs(logsData));
    if (sessionsData) dispatch(setSessions(sessionsData));
  }, [dispatch]);

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createUser(userData).unwrap();
      setSnackbar({ open: true, message: 'Usuario creado exitosamente' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al crear el usuario' });
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      await updateUser({ id, user: userData }).unwrap();
      setSnackbar({ open: true, message: 'Usuario actualizado exitosamente' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar el usuario' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      setSnackbar({ open: true, message: 'Usuario eliminado exitosamente' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el usuario' });
    }
  };

  const handleUserStatusChange = async (id: string, status: string) => {
    try {
      await updateUserStatus({ id, status }).unwrap();
      setSnackbar({ open: true, message: 'Estado del usuario actualizado' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar el estado' });
    }
  };

  const handleUserPermissionsChange = async (id: string, permissions: Permission[]) => {
    try {
      await updateUserPermissions({ id, permissions }).unwrap();
      setSnackbar({ open: true, message: 'Permisos actualizados exitosamente' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar los permisos' });
    }
  };

  const handleUserMetersChange = async (id: string, meterIds: string[]) => {
    try {
      await updateUserMeters({ id, meterIds }).unwrap();
      setSnackbar({ open: true, message: 'Medidores asignados exitosamente' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al asignar medidores' });
    }
  };

  const handleUserGroupsChange = async (id: string, groupIds: string[]) => {
    try {
      await updateUserGroups({ id, groupIds }).unwrap();
      setSnackbar({ open: true, message: 'Grupos asignados exitosamente' });
      refetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al asignar grupos' });
    }
  };

  const handleRefresh = () => {
    refetchUsers();
    refetchGroups();
    refetchRoles();
    refetchLogs();
    refetchSessions();
  };

  const getStats = () => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalGroups: groups.length,
      totalRoles: roles.length,
      totalLogs: accessLogs.length,
      activeSessions: sessions.filter(s => s.isActive).length,
    };
  };

  const stats = getStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administración de Usuarios y Roles
      </Typography>

      {/* Resumen de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Usuarios
                  </Typography>
                </Box>
                <Person color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {stats.activeUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activos
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.totalGroups}
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

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.totalRoles}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Roles
                  </Typography>
                </Box>
                <Security color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {stats.totalLogs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Logs de Acceso
                  </Typography>
                </Box>
                <History color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error.main">
                    {stats.activeSessions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sesiones Activas
                  </Typography>
                </Box>
                <Settings color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas principales */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<Person />} label="Usuarios" />
            <Tab icon={<Group />} label="Grupos" />
            <Tab icon={<Security />} label="Roles" />
            <Tab icon={<History />} label="Historial de Acceso" />
            <Tab icon={<Settings />} label="Configuración" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Pestaña de Usuarios */}
          {activeTab === 0 && (
            <UserManagement
              users={users}
              roles={roles}
              groups={groups}
              meters={[]} // TODO: Obtener de la API
              onUserCreate={handleCreateUser}
              onUserUpdate={handleUpdateUser}
              onUserDelete={handleDeleteUser}
              onUserStatusChange={handleUserStatusChange}
              onUserPermissionsChange={handleUserPermissionsChange}
              onUserMetersChange={handleUserMetersChange}
              onUserGroupsChange={handleUserGroupsChange}
            />
          )}

          {/* Pestaña de Grupos */}
          {activeTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Grupos de Usuarios ({groups.length})
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => setShowGroupDialog(true)}
                  variant="contained"
                >
                  Nuevo Grupo
                </Button>
              </Box>

              {groups.length === 0 ? (
                <Alert severity="info">
                  No hay grupos de usuarios configurados. Crea tu primer grupo para organizar los usuarios.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {groups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box flex={1}>
                              <Typography variant="h6" noWrap>
                                {group.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {group.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${group.userIds.length} usuarios`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {group.permissions.length} permisos
                            </Typography>
                            <Box display="flex" gap={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingGroup(group);
                                  setShowGroupDialog(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (window.confirm('¿Eliminar este grupo?')) {
                                    // TODO: Implementar eliminación
                                  }
                                }}
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

          {/* Pestaña de Roles */}
          {activeTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Roles del Sistema ({roles.length})
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => setShowRoleDialog(true)}
                  variant="contained"
                >
                  Nuevo Rol
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Permisos</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {role.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {role.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${role.permissions.length} permisos`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={role.isSystem ? 'Sistema' : 'Personalizado'}
                            size="small"
                            color={role.isSystem ? 'success' : 'info'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingRole(role);
                              setShowRoleDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          {!role.isSystem && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (window.confirm('¿Eliminar este rol?')) {
                                  // TODO: Implementar eliminación
                                }
                              }}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Pestaña de Historial de Acceso */}
          {activeTab === 3 && (
            <AccessLogs
              logs={accessLogs}
              onRefresh={handleRefresh}
              onExport={() => {
                setSnackbar({ open: true, message: 'Funcionalidad de exportación en desarrollo' });
              }}
            />
          )}

          {/* Pestaña de Configuración */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Configuración del Sistema
              </Typography>
              <Alert severity="info">
                La configuración del sistema está en desarrollo. Próximamente podrás configurar
                políticas de seguridad, límites de sesión y configuraciones avanzadas.
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

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

export default UserAdministration;

