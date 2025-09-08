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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Save,
  Cancel,
  Group,
  LocationOn,
  Person,
  ElectricBolt,
} from '@mui/icons-material';
import { AlertGroup } from '../types/alerts';

interface AlertGroupsProps {
  groups: AlertGroup[];
  meters: Array<{ id: string; name: string; location: string }>;
  users: Array<{ id: string; name: string; email: string }>;
  locations: Array<{ id: string; name: string; description?: string }>;
  onCreateGroup: (group: Omit<AlertGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateGroup: (id: string, group: Partial<AlertGroup>) => void;
  onDeleteGroup: (id: string) => void;
}

const AlertGroups: React.FC<AlertGroupsProps> = ({
  groups,
  meters,
  users,
  locations,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AlertGroup | null>(null);
  const [newGroup, setNewGroup] = useState<Omit<AlertGroup, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    meterIds: [],
    locationIds: [],
    userIds: [],
  });
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; groupId: string } | null>(null);

  const handleCreateGroup = () => {
    if (newGroup.name.trim()) {
      onCreateGroup(newGroup);
      setNewGroup({
        name: '',
        description: '',
        meterIds: [],
        locationIds: [],
        userIds: [],
      });
      setIsCreating(false);
    }
  };

  const handleEditGroup = (group: AlertGroup) => {
    setEditingGroup(group);
    setNewGroup({
      name: group.name,
      description: group.description,
      meterIds: group.meterIds,
      locationIds: group.locationIds,
      userIds: group.userIds,
    });
    setIsCreating(true);
  };

  const handleUpdateGroup = () => {
    if (editingGroup) {
      onUpdateGroup(editingGroup.id, newGroup);
      setEditingGroup(null);
      setIsCreating(false);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      onDeleteGroup(groupId);
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, groupId: string) => {
    setMenuAnchor({ element: event.currentTarget, groupId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAddMeter = (meterId: string) => {
    setNewGroup(prev => ({
      ...prev,
      meterIds: [...prev.meterIds, meterId],
    }));
  };

  const handleRemoveMeter = (meterId: string) => {
    setNewGroup(prev => ({
      ...prev,
      meterIds: prev.meterIds.filter(id => id !== meterId),
    }));
  };

  const handleAddLocation = (locationId: string) => {
    setNewGroup(prev => ({
      ...prev,
      locationIds: [...prev.locationIds, locationId],
    }));
  };

  const handleRemoveLocation = (locationId: string) => {
    setNewGroup(prev => ({
      ...prev,
      locationIds: prev.locationIds.filter(id => id !== locationId),
    }));
  };

  const handleAddUser = (userId: string) => {
    setNewGroup(prev => ({
      ...prev,
      userIds: [...prev.userIds, userId],
    }));
  };

  const handleRemoveUser = (userId: string) => {
    setNewGroup(prev => ({
      ...prev,
      userIds: prev.userIds.filter(id => id !== userId),
    }));
  };

  const getMeterName = (meterId: string) => {
    const meter = meters.find(m => m.id === meterId);
    return meter ? `${meter.name} (${meter.location})` : meterId;
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : locationId;
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} (${user.email})` : userId;
  };

  const getTotalMembers = (group: AlertGroup) => {
    return group.meterIds.length + group.locationIds.length + group.userIds.length;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Grupos de Alertas ({groups.length})
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={() => setIsCreating(true)}
          variant="contained"
        >
          Nuevo Grupo
        </Button>
      </Box>

      {groups.length === 0 ? (
        <Alert severity="info">
          No hay grupos de alertas configurados. Crea tu primer grupo para organizar las alertas.
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
                      {group.description && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {group.description}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, group.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    <Chip
                      icon={<ElectricBolt />}
                      label={`${group.meterIds.length} medidores`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocationOn />}
                      label={`${group.locationIds.length} ubicaciones`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Person />}
                      label={`${group.userIds.length} usuarios`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Total: {getTotalMembers(group)} miembros
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para crear/editar grupo */}
      <Dialog open={isCreating} onClose={() => setIsCreating(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGroup ? 'Editar Grupo' : 'Nuevo Grupo'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Grupo"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripción"
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>

            {/* Medidores */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Medidores ({newGroup.meterIds.length})
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Agregar Medidor</InputLabel>
                <Select
                  value=""
                  label="Agregar Medidor"
                  onChange={(e) => handleAddMeter(e.target.value)}
                >
                  {meters
                    .filter(meter => !newGroup.meterIds.includes(meter.id))
                    .map(meter => (
                      <MenuItem key={meter.id} value={meter.id}>
                        {meter.name} - {meter.location}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <List dense>
                {newGroup.meterIds.map(meterId => (
                  <ListItem key={meterId}>
                    <ListItemText
                      primary={getMeterName(meterId)}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMeter(meterId)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Ubicaciones */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Ubicaciones ({newGroup.locationIds.length})
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Agregar Ubicación</InputLabel>
                <Select
                  value=""
                  label="Agregar Ubicación"
                  onChange={(e) => handleAddLocation(e.target.value)}
                >
                  {locations
                    .filter(location => !newGroup.locationIds.includes(location.id))
                    .map(location => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <List dense>
                {newGroup.locationIds.map(locationId => (
                  <ListItem key={locationId}>
                    <ListItemText
                      primary={getLocationName(locationId)}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveLocation(locationId)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Usuarios */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Usuarios ({newGroup.userIds.length})
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Agregar Usuario</InputLabel>
                <Select
                  value=""
                  label="Agregar Usuario"
                  onChange={(e) => handleAddUser(e.target.value)}
                >
                  {users
                    .filter(user => !newGroup.userIds.includes(user.id))
                    .map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <List dense>
                {newGroup.userIds.map(userId => (
                  <ListItem key={userId}>
                    <ListItemText
                      primary={getUserName(userId)}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveUser(userId)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreating(false)}>Cancelar</Button>
          <Button
            onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
            variant="contained"
            startIcon={<Save />}
            disabled={!newGroup.name.trim()}
          >
            {editingGroup ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => {
          const group = groups.find(g => g.id === menuAnchor?.groupId);
          if (group) handleEditGroup(group);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent 
          onClick={() => {
            handleDeleteGroup(menuAnchor?.groupId!);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItemComponent>
      </Menu>
    </Box>
  );
};

export default AlertGroups;

