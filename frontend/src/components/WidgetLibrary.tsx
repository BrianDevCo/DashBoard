import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  ElectricBolt,
  TableChart,
  Assessment,
  Speed,
  Nature,
  Receipt,
  TableRows,
  ShowChart,
  BatteryChargingFull,
  AttachMoney,
  Add,
  Info,
} from '@mui/icons-material';
import { WidgetLibrary as WidgetLibraryType, WIDGET_LIBRARY } from '../types/widgets';

interface WidgetLibraryProps {
  onAddWidget: (widgetId: string) => void;
  selectedWidgets?: string[];
  disabled?: boolean;
}

const WidgetLibrary: React.FC<WidgetLibraryProps> = ({
  onAddWidget,
  selectedWidgets = [],
  disabled = false,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      ElectricBolt,
      TableChart,
      Assessment,
      Speed,
      Nature,
      Receipt,
      TableRows,
      ShowChart,
      BatteryChargingFull,
      AttachMoney,
    };
    const IconComponent = iconMap[iconName] || ElectricBolt;
    return <IconComponent />;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      energy: 'primary',
      billing: 'success',
      analysis: 'info',
      monitoring: 'warning',
    };
    return colors[category] || 'default';
  };

  const categories = [
    { id: 'all', label: 'Todos', count: Object.keys(WIDGET_LIBRARY).length },
    { id: 'energy', label: 'Energía', count: Object.values(WIDGET_LIBRARY).filter(w => w.category === 'energy').length },
    { id: 'billing', label: 'Facturación', count: Object.values(WIDGET_LIBRARY).filter(w => w.category === 'billing').length },
    { id: 'analysis', label: 'Análisis', count: Object.values(WIDGET_LIBRARY).filter(w => w.category === 'analysis').length },
    { id: 'monitoring', label: 'Monitoreo', count: Object.values(WIDGET_LIBRARY).filter(w => w.category === 'monitoring').length },
  ];

  const filteredWidgets = Object.entries(WIDGET_LIBRARY).filter(([_, widget]) => 
    activeCategory === 'all' || widget.category === activeCategory
  );

  const isWidgetSelected = (widgetId: string) => selectedWidgets.includes(widgetId);

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Biblioteca de Widgets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Arrastra widgets al dashboard para personalizar tu vista
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeCategory}
          onChange={(_, newValue) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {category.label}
                  <Chip
                    label={category.count}
                    size="small"
                    color={activeCategory === category.id ? 'primary' : 'default'}
                    variant={activeCategory === category.id ? 'filled' : 'outlined'}
                  />
                </Box>
              }
              value={category.id}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {filteredWidgets.map(([widgetId, widget]) => {
            const isSelected = isWidgetSelected(widgetId);
            const IconComponent = getIcon(widget.icon);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={widgetId}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: disabled ? 0.6 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    border: isSelected ? 2 : 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: disabled ? 1 : 4,
                      transform: disabled ? 'none' : 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <CardActionArea
                    onClick={() => !disabled && onAddWidget(widgetId)}
                    disabled={disabled}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <Box display="flex" flexDirection="column" height="100%">
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {IconComponent}
                          <Typography variant="subtitle2" noWrap>
                            {widget.name}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={widget.category}
                            size="small"
                            color={getCategoryColor(widget.category) as any}
                            variant="outlined"
                          />
                          {isSelected && (
                            <Badge
                              badgeContent="✓"
                              color="primary"
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: 'primary.main',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                },
                              }}
                            >
                              <Box />
                            </Badge>
                          )}
                        </Box>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {widget.description}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          {widget.defaultSize.width}×{widget.defaultSize.height}
                        </Typography>
                        <Tooltip title="Agregar al dashboard">
                          <IconButton
                            size="small"
                            color="primary"
                            disabled={disabled || isSelected}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddWidget(widgetId);
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {filteredWidgets.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ flex: 1, p: 4 }}
        >
          <Info color="disabled" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No hay widgets disponibles en esta categoría
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WidgetLibrary;

