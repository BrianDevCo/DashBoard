import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Avatar,
  LinearProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
  Alert,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
  Download,
  Share,
  Star,
  StarBorder,
  Schedule,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Search,
  FilterList,
  ViewModule,
  TableChart,
  BarChart,
  PieChart,
  Description,
  Image,
  Assessment,
  TextFields,
  Image as ImageIcon,
  Code,
  Settings,
  Public,
  Lock,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import { 
  ReportTemplate, 
  REPORT_CATEGORIES, 
  REPORT_TYPES, 
  REPORT_FORMATS, 
  REPORT_UTILS 
} from '../types/reports';

interface ReportTemplatesProps {
  templates: ReportTemplate[];
  loading?: boolean;
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onPreview?: (id: string) => void;
  onSchedule?: (id: string) => void;
}

const ReportTemplates: React.FC<ReportTemplatesProps> = ({
  templates,
  loading = false,
  onRefresh,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  onSchedule,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; id: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    const cat = REPORT_CATEGORIES.find(c => c.value === category);
    return cat?.icon || '📊';
  };

  const getCategoryColor = (category: string) => {
    const cat = REPORT_CATEGORIES.find(c => c.value === category);
    return cat?.color || '#2196f3';
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = REPORT_TYPES.find(t => t.value === type);
    return typeConfig?.icon || '📊';
  };

  const getFormatIcon = (format: string) => {
    const formatConfig = REPORT_FORMATS.find(f => f.value === format);
    return formatConfig?.icon || '📄';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesFormat = filterFormat === 'all' || template.format === filterFormat;
    
    return matchesSearch && matchesCategory && matchesType && matchesFormat;
  });

  const getStats = () => {
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter(t => t.isActive).length;
    const publicTemplates = templates.filter(t => t.isPublic).length;
    const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
    const averageUsage = totalTemplates > 0 ? totalUsage / totalTemplates : 0;
    
    return {
      totalTemplates,
      activeTemplates,
      publicTemplates,
      totalUsage,
      averageUsage,
    };
  };

  const stats = getStats();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ element: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = (id: string) => {
    onEdit?.(id);
    handleMenuClose();
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleDuplicate = (id: string) => {
    onDuplicate?.(id);
    handleMenuClose();
  };

  const handlePreview = (id: string) => {
    onPreview?.(id);
    handleMenuClose();
  };

  const handleSchedule = (id: string) => {
    onSchedule?.(id);
    handleMenuClose();
  };

  const handleViewDetails = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowDetails(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      onDelete?.(templateToDelete);
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando plantillas de reportes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Description color="primary" />
          <Typography variant="h5">
            Plantillas de Reportes ({templates.length})
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => onEdit?.('new')}
          >
            Nueva Plantilla
          </Button>
          <IconButton onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Estadísticas resumen */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color="primary">
                      {stats.totalTemplates}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Plantillas
                    </Typography>
                  </Box>
                  <Description color="primary" sx={{ fontSize: 40 }} />
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
                      {stats.activeTemplates}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activas
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
                      {stats.publicTemplates}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Públicas
                    </Typography>
                  </Box>
                  <Public color="info" sx={{ fontSize: 40 }} />
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
                      {stats.totalUsage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Usos
                    </Typography>
                  </Box>
                  <TrendingUp color="warning" sx={{ fontSize: 40 }} />
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
                      {stats.averageUsage.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Promedio Usos
                    </Typography>
                  </Box>
                  <BarChart color="secondary" sx={{ fontSize: 40 }} />
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
                      {templates.filter(t => !t.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactivas
                    </Typography>
                  </Box>
                  <Error color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <Search />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filterCategory}
                  label="Categoría"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {REPORT_CATEGORIES.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {REPORT_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Formato</InputLabel>
                <Select
                  value={filterFormat}
                  label="Formato"
                  onChange={(e) => setFilterFormat(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {REPORT_FORMATS.map(format => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.icon} {format.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Modo de vista */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Plantillas ({filteredTemplates.length})
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            <ViewModule />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'default'}
          >
            <TableChart />
          </IconButton>
        </Box>
      </Box>

      {/* Lista de plantillas */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: getCategoryColor(template.category), width: 32, height: 32 }}>
                        {getCategoryIcon(template.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" noWrap>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {REPORT_CATEGORIES.find(c => c.value === template.category)?.label}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, template.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={REPORT_TYPES.find(t => t.value === template.type)?.label}
                      size="small"
                      icon={<span>{getTypeIcon(template.type)}</span>}
                    />
                    <Chip
                      label={REPORT_FORMATS.find(f => f.value === template.format)?.label}
                      size="small"
                      icon={<span>{getFormatIcon(template.format)}</span>}
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1}>
                      {template.isPublic ? (
                        <Public color="info" fontSize="small" />
                      ) : (
                        <Lock color="action" fontSize="small" />
                      )}
                      {template.isActive ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <Error color="error" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {template.usageCount} usos
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <List>
            {filteredTemplates.map((template) => (
              <ListItem key={template.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getCategoryColor(template.category) }}>
                    {getCategoryIcon(template.category)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={template.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip
                          label={REPORT_TYPES.find(t => t.value === template.type)?.label}
                          size="small"
                          icon={<span>{getTypeIcon(template.type)}</span>}
                        />
                        <Chip
                          label={REPORT_FORMATS.find(f => f.value === template.format)?.label}
                          size="small"
                          icon={<span>{getFormatIcon(template.format)}</span>}
                        />
                        <Chip
                          label={`${template.usageCount} usos`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(template)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, template.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Card>
      )}

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(menuAnchor?.id!)}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicate(menuAnchor?.id!)}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText>Duplicar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePreview(menuAnchor?.id!)}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText>Vista Previa</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSchedule(menuAnchor?.id!)}>
          <ListItemIcon>
            <Schedule />
          </ListItemIcon>
          <ListItemText>Programar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(menuAnchor?.id!)}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog de detalles */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: getCategoryColor(selectedTemplate?.category || '') }}>
              {getCategoryIcon(selectedTemplate?.category || '')}
            </Avatar>
            <Typography variant="h6">
              {selectedTemplate?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información General
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Descripción"
                        secondary={selectedTemplate.description}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Categoría"
                        secondary={REPORT_CATEGORIES.find(c => c.value === selectedTemplate.category)?.label}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tipo"
                        secondary={REPORT_TYPES.find(t => t.value === selectedTemplate.type)?.label}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Formato"
                        secondary={REPORT_FORMATS.find(f => f.value === selectedTemplate.format)?.label}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Estadísticas
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Usos"
                        secondary={selectedTemplate.usageCount}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Creado"
                        secondary={formatDate(selectedTemplate.createdAt)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Última Actualización"
                        secondary={formatDate(selectedTemplate.updatedAt)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Último Uso"
                        secondary={selectedTemplate.lastUsed ? formatDate(selectedTemplate.lastUsed) : 'Nunca'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Secciones ({selectedTemplate.sections.length})
                  </Typography>
                  <List dense>
                    {selectedTemplate.sections.map((section, index) => (
                      <ListItem key={section.id}>
                        <ListItemText
                          primary={`${index + 1}. ${section.title}`}
                          secondary={`Tipo: ${section.type} | Orden: ${section.order}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportTemplates;
