import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Save,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { DashboardLayout, WidgetConfig } from '../types/widgets';

interface LayoutManagerProps {
  layouts: DashboardLayout[];
  currentLayout: DashboardLayout | null;
  onSelectLayout: (layout: DashboardLayout) => void;
  onSaveLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateLayout: (id: string, layout: Partial<DashboardLayout>) => void;
  onDeleteLayout: (id: string) => void;
  onDuplicateLayout: (id: string) => void;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({
  layouts,
  currentLayout,
  onSelectLayout,
  onSaveLayout,
  onUpdateLayout,
  onDeleteLayout,
  onDuplicateLayout,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLayout, setEditingLayout] = useState<DashboardLayout | null>(null);
  const [newLayout, setNewLayout] = useState({ name: '', description: '' });
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; layoutId: string } | null>(null);

  const handleCreateLayout = () => {
    if (newLayout.name.trim()) {
      onSaveLayout({
        name: newLayout.name.trim(),
        description: newLayout.description.trim(),
        widgets: [],
        isDefault: false,
      });
      setNewLayout({ name: '', description: '' });
      setIsCreating(false);
    }
  };

  const handleEditLayout = (layout: DashboardLayout) => {
    setEditingLayout(layout);
    setIsEditing(true);
  };

  const handleUpdateLayout = () => {
    if (editingLayout) {
      onUpdateLayout(editingLayout.id, {
        name: editingLayout.name,
        description: editingLayout.description,
      });
      setIsEditing(false);
      setEditingLayout(null);
    }
  };

  const handleDeleteLayout = (layoutId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este layout?')) {
      onDeleteLayout(layoutId);
    }
    setMenuAnchor(null);
  };

  const handleDuplicateLayout = (layoutId: string) => {
    onDuplicateLayout(layoutId);
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, layoutId: string) => {
    setMenuAnchor({ element: event.currentTarget, layoutId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const getWidgetCount = (widgets: WidgetConfig[]) => {
    return widgets.length;
  };

  const getVisibleWidgetCount = (widgets: WidgetConfig[]) => {
    return widgets.filter(w => w.visible).length;
  };

  const getLayoutCategories = (widgets: WidgetConfig[]) => {
    const categories = new Set<string>();
    widgets.forEach(widget => {
      if (widget.type === 'chart') categories.add('Gráficos');
      if (widget.type === 'table') categories.add('Tablas');
      if (widget.type === 'kpi') categories.add('KPIs');
      if (widget.type === 'summary') categories.add('Resúmenes');
      if (widget.type === 'matrix') categories.add('Matrices');
      if (widget.type === 'billing') categories.add('Facturación');
    });
    return Array.from(categories);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Gestión de Vistas Personalizadas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreating(true)}
        >
          Nueva Vista
        </Button>
      </Box>

      {layouts.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body2">
            No tienes vistas personalizadas guardadas. Crea tu primera vista personalizada 
            para comenzar a organizar tu dashboard.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {layouts.map((layout) => (
            <Grid item xs={12} sm={6} md={4} key={layout.id}>
              <Card
                sx={{
                  height: '100%',
                  border: currentLayout?.id === layout.id ? 2 : 1,
                  borderColor: currentLayout?.id === layout.id ? 'primary.main' : 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <CardActionArea onClick={() => onSelectLayout(layout)}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box flex={1}>
                        <Typography variant="h6" noWrap>
                          {layout.name}
                        </Typography>
                        {layout.isDefault && (
                          <Chip
                            icon={<Star />}
                            label="Predeterminado"
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, layout.id);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {layout.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {layout.description}
                      </Typography>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="caption" color="text.secondary">
                        {getWidgetCount(layout.widgets)} widgets
                        {getVisibleWidgetCount(layout.widgets) !== getWidgetCount(layout.widgets) && 
                          ` (${getVisibleWidgetCount(layout.widgets)} visibles)`
                        }
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(layout.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {getLayoutCategories(layout.widgets).length > 0 && (
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {getLayoutCategories(layout.widgets).map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para crear nueva vista */}
      <Dialog open={isCreating} onClose={() => setIsCreating(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nueva Vista</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la Vista"
            value={newLayout.name}
            onChange={(e) => setNewLayout({ ...newLayout, name: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Descripción (opcional)"
            value={newLayout.description}
            onChange={(e) => setNewLayout({ ...newLayout, description: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreating(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateLayout}
            variant="contained"
            startIcon={<Save />}
            disabled={!newLayout.name.trim()}
          >
            Crear Vista
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar vista */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Vista</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la Vista"
            value={editingLayout?.name || ''}
            onChange={(e) => setEditingLayout(prev => prev ? { ...prev, name: e.target.value } : null)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={editingLayout?.description || ''}
            onChange={(e) => setEditingLayout(prev => prev ? { ...prev, description: e.target.value } : null)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
          <Button
            onClick={handleUpdateLayout}
            variant="contained"
            startIcon={<Save />}
            disabled={!editingLayout?.name.trim()}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditLayout(layouts.find(l => l.id === menuAnchor?.layoutId)!)}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicateLayout(menuAnchor?.layoutId!)}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText>Duplicar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDeleteLayout(menuAnchor?.layoutId!)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LayoutManager;



