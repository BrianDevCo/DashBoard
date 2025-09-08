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
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Divider,
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
  Alert,
  Pagination,
  Checkbox,
  FormGroup,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Person,
  Email,
  Phone,
  Business,
  Security,
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  Refresh,
  Download,
  Upload,
  Lock,
  LockOpen,
  Group,
  Settings,
  History,
} from '@mui/icons-material';
import { User, UserRole, UserStatus, Permission, USER_STATUSES, PERMISSION_GROUPS } from '../types/users';

interface UserManagementProps {
  users: User[];
  roles: Array<{ id: string; name: string; description: string }>;
  groups: Array<{ id: string; name: string; description: string }>;
  meters: Array<{ id: string; name: string; location: string }>;
  onUserCreate: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUserUpdate: (id: string, user: Partial<User>) => void;
  onUserDelete: (id: string) => void;
  onUserStatusChange: (id: string, status: UserStatus) => void;
  onUserPermissionsChange: (id: string, permissions: Permission[]) => void;
  onUserMetersChange: (id: string, meterIds: string[]) => void;
  onUserGroupsChange: (id: string, groupIds: string[]) => void;
  loading?: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  roles,
  groups,
  meters,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onUserStatusChange,
  onUserPermissionsChange,
  onUserMetersChange,
  onUserGroupsChange,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; userId: string } | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showMetersDialog, setShowMetersDialog] = useState(false);
  const [showGroupsDialog, setShowGroupsDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    search: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'end_user',
    status: 'active',
    permissions: [],
    meterIds: [],
    groupIds: [],
    createdBy: 'current-user',
    updatedBy: 'current-user',
    profile: {
      phone: '',
      department: '',
      position: '',
      avatar: '',
      timezone: 'America/Bogota',
      language: 'es',
      notifications: {
        email: true,
        sms: false,
        platform: true,
      },
    },
    preferences: {
      theme: 'light',
      dashboardLayout: 'default',
      defaultView: 'dashboard',
      refreshInterval: 30,
    },
  });

  const getStatusColor = (status: UserStatus) => {
    const statusConfig = USER_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'default';
  };

  const getStatusLabel = (status: UserStatus) => {
    const statusConfig = USER_STATUSES.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  const getRoleLabel = (role: UserRole) => {
    const roleConfig = roles.find(r => r.id === role);
    return roleConfig?.name || role;
  };

  const filteredUsers = users.filter(user => {
    if (filters.status !== 'all' && user.status !== filters.status) return false;
    if (filters.role !== 'all' && user.role !== filters.role) return false;
    if (filters.search && !user.username.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.firstName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.lastName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCreateUser = () => {
    if (newUser.username && newUser.email && newUser.firstName && newUser.lastName) {
      onUserCreate(newUser);
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'end_user',
        status: 'active',
        permissions: [],
        meterIds: [],
        groupIds: [],
        createdBy: 'current-user',
        updatedBy: 'current-user',
        profile: {
          phone: '',
          department: '',
          position: '',
          avatar: '',
          timezone: 'America/Bogota',
          language: 'es',
          notifications: {
            email: true,
            sms: false,
            platform: true,
          },
        },
        preferences: {
          theme: 'light',
          dashboardLayout: 'default',
          defaultView: 'dashboard',
          refreshInterval: 30,
        },
      });
      setIsCreatingUser(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      permissions: user.permissions,
      meterIds: user.meterIds,
      groupIds: user.groupIds,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      profile: user.profile,
      preferences: user.preferences,
    });
    setIsCreatingUser(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      onUserUpdate(editingUser.id, newUser);
      setEditingUser(null);
      setIsCreatingUser(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      onUserDelete(userId);
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setMenuAnchor({ element: event.currentTarget, userId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleStatusChange = (userId: string, status: UserStatus) => {
    onUserStatusChange(userId, status);
    setMenuAnchor(null);
  };

  const handlePermissionsChange = (permissions: Permission[]) => {
    if (selectedUser) {
      onUserPermissionsChange(selectedUser.id, permissions);
    }
    setShowPermissionsDialog(false);
  };

  const handleMetersChange = (meterIds: string[]) => {
    if (selectedUser) {
      onUserMetersChange(selectedUser.id, meterIds);
    }
    setShowMetersDialog(false);
  };

  const handleGroupsChange = (groupIds: string[]) => {
    if (selectedUser) {
      onUserGroupsChange(selectedUser.id, groupIds);
    }
    setShowGroupsDialog(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Gestión de Usuarios ({users.length})
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<Add />}
            onClick={() => setIsCreatingUser(true)}
            variant="contained"
          >
            Nuevo Usuario
          </Button>
          <Button
            startIcon={<Download />}
            variant="outlined"
          >
            Exportar
          </Button>
          <Button
            startIcon={<Upload />}
            variant="outlined"
          >
            Importar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status}
                  label="Estado"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {USER_STATUSES.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Rol</InputLabel>
                <Select
                  value={filters.role}
                  label="Rol"
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                onClick={() => setFilters({ status: 'all', role: 'all', search: '' })}
                variant="outlined"
                fullWidth
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Último Acceso</TableCell>
              <TableCell>Permisos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(user.status)}
                    color={getStatusColor(user.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.permissions.length} permisos
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, user.id)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {filteredUsers.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredUsers.length / itemsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => {
          const user = users.find(u => u.id === menuAnchor?.userId);
          if (user) {
            setSelectedUser(user);
            setShowPermissionsDialog(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Security />
          </ListItemIcon>
          <ListItemText>Gestionar Permisos</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => {
          const user = users.find(u => u.id === menuAnchor?.userId);
          if (user) {
            setSelectedUser(user);
            setShowMetersDialog(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>Asignar Medidores</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => {
          const user = users.find(u => u.id === menuAnchor?.userId);
          if (user) {
            setSelectedUser(user);
            setShowGroupsDialog(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText>Asignar Grupos</ListItemText>
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent onClick={() => {
          const user = users.find(u => u.id === menuAnchor?.userId);
          if (user) handleEditUser(user);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => {
          const user = users.find(u => u.id === menuAnchor?.userId);
          if (user) {
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            handleStatusChange(user.id, newStatus as UserStatus);
          }
        }}>
          <ListItemIcon>
            {users.find(u => u.id === menuAnchor?.userId)?.status === 'active' ? <Lock /> : <LockOpen />}
          </ListItemIcon>
          <ListItemText>
            {users.find(u => u.id === menuAnchor?.userId)?.status === 'active' ? 'Desactivar' : 'Activar'}
          </ListItemText>
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent 
          onClick={() => handleDeleteUser(menuAnchor?.userId!)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItemComponent>
      </Menu>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={isCreatingUser} onClose={() => setIsCreatingUser(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={newUser.firstName}
                onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={newUser.lastName}
                onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={newUser.role}
                  label="Rol"
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                >
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={newUser.status}
                  label="Estado"
                  onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value as UserStatus }))}
                >
                  {USER_STATUSES.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={newUser.profile.phone}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  profile: { ...prev.profile, phone: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                value={newUser.profile.department}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  profile: { ...prev.profile, department: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cargo"
                value={newUser.profile.position}
                onChange={(e) => setNewUser(prev => ({
                  ...prev,
                  profile: { ...prev.profile, position: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Idioma</InputLabel>
                <Select
                  value={newUser.profile.language}
                  label="Idioma"
                  onChange={(e) => setNewUser(prev => ({
                    ...prev,
                    profile: { ...prev.profile, language: e.target.value as 'es' | 'en' }
                  }))}
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreatingUser(false)}>Cancelar</Button>
          <Button
            onClick={editingUser ? handleUpdateUser : handleCreateUser}
            variant="contained"
            startIcon={<Save />}
          >
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para gestionar permisos */}
      <Dialog open={showPermissionsDialog} onClose={() => setShowPermissionsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Gestionar Permisos - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selecciona los permisos que tendrá este usuario:
          </Typography>
          <FormGroup>
            {PERMISSION_GROUPS.map(group => (
              <Box key={group.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {group.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {group.description}
                </Typography>
                <FormGroup>
                  {group.permissions.map(permission => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Checkbox
                          checked={selectedUser?.permissions.includes(permission) || false}
                          onChange={(e) => {
                            if (selectedUser) {
                              const newPermissions = e.target.checked
                                ? [...selectedUser.permissions, permission]
                                : selectedUser.permissions.filter(p => p !== permission);
                              setSelectedUser({ ...selectedUser, permissions: newPermissions });
                            }
                          }}
                        />
                      }
                      label={permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    />
                  ))}
                </FormGroup>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPermissionsDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => handlePermissionsChange(selectedUser?.permissions || [])}
            variant="contained"
          >
            Guardar Permisos
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para asignar medidores */}
      <Dialog open={showMetersDialog} onClose={() => setShowMetersDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Medidores - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selecciona los medidores a los que tendrá acceso este usuario:
          </Typography>
          <FormGroup>
            {meters.map(meter => (
              <FormControlLabel
                key={meter.id}
                control={
                  <Checkbox
                    checked={selectedUser?.meterIds.includes(meter.id) || false}
                    onChange={(e) => {
                      if (selectedUser) {
                        const newMeterIds = e.target.checked
                          ? [...selectedUser.meterIds, meter.id]
                          : selectedUser.meterIds.filter(id => id !== meter.id);
                        setSelectedUser({ ...selectedUser, meterIds: newMeterIds });
                      }
                    }}
                  />
                }
                label={`${meter.name} - ${meter.location}`}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMetersDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => handleMetersChange(selectedUser?.meterIds || [])}
            variant="contained"
          >
            Guardar Medidores
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para asignar grupos */}
      <Dialog open={showGroupsDialog} onClose={() => setShowGroupsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Grupos - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selecciona los grupos a los que pertenecerá este usuario:
          </Typography>
          <FormGroup>
            {groups.map(group => (
              <FormControlLabel
                key={group.id}
                control={
                  <Checkbox
                    checked={selectedUser?.groupIds.includes(group.id) || false}
                    onChange={(e) => {
                      if (selectedUser) {
                        const newGroupIds = e.target.checked
                          ? [...selectedUser.groupIds, group.id]
                          : selectedUser.groupIds.filter(id => id !== group.id);
                        setSelectedUser({ ...selectedUser, groupIds: newGroupIds });
                      }
                    }}
                  />
                }
                label={group.name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGroupsDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => handleGroupsChange(selectedUser?.groupIds || [])}
            variant="contained"
          >
            Guardar Grupos
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;

