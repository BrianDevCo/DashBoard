import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit,
  Delete,
  Settings,
  Visibility,
  VisibilityOff,
  DragIndicator,
  Save,
  Close,
} from '@mui/icons-material';
import { useDrag, useDrop } from 'react-dnd';
import { WidgetConfig, WIDGET_LIBRARY } from '../types/widgets';
import EnergyChart from './EnergyChart';
import EnergyMatrix from './EnergyMatrix';
import EnergySummary from './EnergySummary';
import BillingComparison from './BillingComparison';
import MetricsTable from './MetricsTable';

interface CustomizableDashboardProps {
  widgets: WidgetConfig[];
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  onRemoveWidget: (id: string) => void;
  onUpdateWidgetPosition: (id: string, position: Partial<WidgetConfig['position']>) => void;
  isCustomizing: boolean;
  data?: any[];
  billingData?: any[];
}

interface DraggableWidgetProps {
  widget: WidgetConfig;
  onUpdate: (id: string, updates: Partial<WidgetConfig>) => void;
  onRemove: (id: string) => void;
  onUpdatePosition: (id: string, position: Partial<WidgetConfig['position']>) => void;
  isCustomizing: boolean;
  data?: any[];
  billingData?: any[];
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widget,
  onUpdate,
  onRemove,
  onUpdatePosition,
  isCustomizing,
  data = [],
  billingData = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editSettings, setEditSettings] = useState(widget.settings);

  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: { id: widget.id, type: widget.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'widget',
    drop: (item: { id: string; type: string }) => {
      if (item.id !== widget.id) {
        // Aquí se manejaría la lógica de reordenamiento
        console.log(`Moving widget ${item.id} to position of ${widget.id}`);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleSaveSettings = () => {
    onUpdate(widget.id, { settings: editSettings });
    setIsEditing(false);
  };

  const renderWidgetContent = () => {
    const commonProps = {
      data: data,
      showActiveEnergy: widget.settings.showActiveEnergy ?? true,
      showReactiveEnergy: widget.settings.showReactiveEnergy ?? true,
      showComparison: widget.settings.showComparison ?? false,
    };

    switch (widget.type) {
      case 'chart':
        return (
          <EnergyChart
            {...commonProps}
            chartType={widget.settings.chartType || 'line'}
          />
        );
      case 'matrix':
        return <EnergyMatrix {...commonProps} />;
      case 'summary':
        return <EnergySummary {...commonProps} currentData={[]} period="day" />;
      case 'billing':
        return <BillingComparison billingData={billingData} consumptionData={data} variance={0} costPerKWh={0} period="day" />;
      case 'table':
        return <MetricsTable data={data} />;
      case 'kpi':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
            <Typography variant="h4" color="primary">
              {widget.settings.metricType === 'powerFactor' ? '0.95' : '85%'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {widget.settings.metricType === 'powerFactor' ? 'Factor de Potencia' : 'Eficiencia'}
            </Typography>
          </Box>
        );
      default:
        return (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Typography variant="body2" color="text.secondary">
              Widget no soportado
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Grid
      item
      xs={widget.position.width}
      md={widget.position.width}
      lg={widget.position.width}
      ref={drop}
    >
      <Paper
        ref={drag}
        sx={{
          height: `${widget.position.height * 100}px`,
          position: 'relative',
          opacity: isDragging ? 0.5 : 1,
          border: isOver ? 2 : 1,
          borderColor: isOver ? 'primary.main' : 'divider',
          borderStyle: isOver ? 'dashed' : 'solid',
          cursor: isCustomizing ? 'move' : 'default',
          '&:hover': {
            boxShadow: isCustomizing ? 4 : 1,
          },
        }}
      >
        {/* Header del Widget */}
        <Box
          sx={{
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'grey.50',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {isCustomizing && <DragIndicator color="action" />}
            <Typography variant="subtitle2" noWrap>
              {widget.title}
            </Typography>
            {!widget.visible && (
              <Chip label="Oculto" size="small" color="warning" variant="outlined" />
            )}
          </Box>
          
          {isCustomizing && (
            <Box display="flex" gap={0.5}>
              <Tooltip title="Configurar">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title={widget.visible ? 'Ocultar' : 'Mostrar'}>
                <IconButton
                  size="small"
                  onClick={() => onUpdate(widget.id, { visible: !widget.visible })}
                >
                  {widget.visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton size="small" color="error" onClick={() => onRemove(widget.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Contenido del Widget */}
        <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          {widget.visible ? renderWidgetContent() : (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="body2" color="text.secondary">
                Widget oculto
              </Typography>
            </Box>
          )}
        </Box>

        {/* Dialog de Configuración */}
        <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Configurar Widget</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Título del Widget"
              value={widget.title}
              onChange={(e) => onUpdate(widget.id, { title: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Configuración de Visualización
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings.showActiveEnergy ?? true}
                  onChange={(e) => setEditSettings({
                    ...editSettings,
                    showActiveEnergy: e.target.checked,
                  })}
                />
              }
              label="Mostrar Energía Activa"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings.showReactiveEnergy ?? true}
                  onChange={(e) => setEditSettings({
                    ...editSettings,
                    showReactiveEnergy: e.target.checked,
                  })}
                />
              }
              label="Mostrar Energía Reactiva"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings.showComparison ?? false}
                  onChange={(e) => setEditSettings({
                    ...editSettings,
                    showComparison: e.target.checked,
                  })}
                />
              }
              label="Mostrar Comparación"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSaveSettings} variant="contained" startIcon={<Save />}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Grid>
  );
};

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  widgets,
  onUpdateWidget,
  onRemoveWidget,
  onUpdateWidgetPosition,
  isCustomizing,
  data = [],
  billingData = [],
}) => {
  if (widgets.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        p={4}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Dashboard Vacío
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {isCustomizing 
            ? 'Arrastra widgets desde la biblioteca para comenzar a personalizar tu dashboard'
            : 'No hay widgets configurados para mostrar'
          }
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {isCustomizing && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Modo de personalización activo. Puedes arrastrar, redimensionar y configurar los widgets.
          </Typography>
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            widget={widget}
            onUpdate={onUpdateWidget}
            onRemove={onRemoveWidget}
            onUpdatePosition={onUpdateWidgetPosition}
            isCustomizing={isCustomizing}
            data={data}
            billingData={billingData}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default CustomizableDashboard;

