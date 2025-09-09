import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Settings,
  Widgets,
  ViewList,
  Person,
  Save,
  Refresh,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setCurrentLayout,
  addLayout,
  updateLayout,
  deleteLayout,
  addWidget,
  updateWidget,
  removeWidget,
  updateWidgetPosition,
  toggleCustomizationMode,
  setUserPreferences,
  updateUserPreferences,
} from '../store/slices/dashboardSlice';
import CustomizableDashboard from '../components/CustomizableDashboard';
import WidgetLibrary from '../components/WidgetLibrary';
import LayoutManager from '../components/LayoutManager';
import UserPreferencesComponent from '../components/UserPreferences';
import { WidgetConfig, DashboardLayout, UserPreferences, WIDGET_LIBRARY } from '../types/widgets';
import { useGetHistoricalMetricsQuery, useGetBillingComparisonQuery } from '../services/energyApi';

const CustomizableDashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    currentLayout,
    availableLayouts,
    userPreferences,
    isCustomizing,
  } = useSelector((state: RootState) => state.dashboard);

  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Datos mock para demostración
  const generateMockEnergyData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        id: i.toString(),
        timestamp: date.toISOString(),
        meterId: 'MTR-001',
        obisCode: '1.0.0.0.0.255',
        location: 'Planta Principal',
        kWhD: Math.random() * 1000 + 5000,
        kVarhD: Math.random() * 200 + 1000,
        kWhR: Math.random() * 50 + 100,
        kVarhR: Math.random() * 20 + 50,
        kVarhPenalized: Math.random() * 100 + 200,
        powerFactor: 0.85 + Math.random() * 0.15,
        voltage: 220 + Math.random() * 20,
        current: 50 + Math.random() * 100,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
      });
    }
    return data;
  };

  const generateMockBillingData = () => {
    const data = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      data.push({
        id: i.toString(),
        period: date.toISOString().substring(0, 7),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalKWh: Math.random() * 10000 + 40000,
        totalKVarh: Math.random() * 2000 + 8000,
        totalCost: Math.random() * 500000 + 1000000,
        energyCost: Math.random() * 400000 + 800000,
        reactiveCost: Math.random() * 50000 + 50000,
        taxes: Math.random() * 100000 + 200000,
        meterId: 'MTR-001',
        location: 'Planta Principal',
      });
    }
    return data;
  };

  const energyData = generateMockEnergyData();
  const billingData = { billing: generateMockBillingData() };

  // Inicializar preferencias de usuario por defecto
  useEffect(() => {
    if (!userPreferences) {
      const defaultPreferences: UserPreferences = {
        userId: 'current-user',
        units: {
          energy: 'kWh',
          reactive: 'kVarh',
        },
        timezone: 'America/Bogota',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        customLabels: {},
        chartColors: {
          'Energía Activa Importada': '#1976d2',
          'Energía Activa Exportada': '#2e7d32',
          'Energía Reactiva Capacitiva': '#ed6c02',
          'Energía Reactiva Inductiva': '#d32f2f',
          'Energía Reactiva Penalizada': '#7b1fa2',
        },
        defaultLayout: 'default',
        autoRefresh: true,
        refreshInterval: 30,
      };
      dispatch(setUserPreferences(defaultPreferences));
    }
  }, [dispatch, userPreferences]);

  // Crear layout por defecto si no existe
  useEffect(() => {
    if (availableLayouts.length === 0) {
      const defaultLayout: DashboardLayout = {
        id: 'default',
        name: 'Dashboard Principal',
        description: 'Vista principal del dashboard energético',
        widgets: [
          {
            id: 'energy-summary-1',
            type: 'summary',
            title: 'Resumen Energético',
            position: { x: 0, y: 0, width: 6, height: 4 },
            visible: true,
            settings: {
              showActiveEnergy: true,
              showReactiveEnergy: true,
              showComparison: false,
            },
          },
          {
            id: 'energy-chart-1',
            type: 'chart',
            title: 'Consumos Energéticos',
            position: { x: 6, y: 0, width: 6, height: 4 },
            visible: true,
            settings: {
              chartType: 'line',
              showActiveEnergy: true,
              showReactiveEnergy: true,
              showComparison: false,
            },
          },
          {
            id: 'power-factor-kpi-1',
            type: 'kpi',
            title: 'Factor de Potencia',
            position: { x: 0, y: 4, width: 3, height: 2 },
            visible: true,
            settings: {
              metricType: 'powerFactor',
            },
          },
          {
            id: 'efficiency-kpi-1',
            type: 'kpi',
            title: 'Eficiencia',
            position: { x: 3, y: 4, width: 3, height: 2 },
            visible: true,
            settings: {
              metricType: 'efficiency',
            },
          },
        ],
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addLayout(defaultLayout));
      dispatch(setCurrentLayout(defaultLayout));
    }
  }, [dispatch, availableLayouts.length]);

  const handleAddWidget = (widgetId: string) => {
    if (!currentLayout) return;

    const widgetTemplate = WIDGET_LIBRARY[widgetId];
    if (!widgetTemplate) return;

    const newWidget: WidgetConfig = {
      id: `${widgetId}-${Date.now()}`,
      type: widgetTemplate.type,
      title: widgetTemplate.name,
      position: {
        x: 0,
        y: 0,
        width: widgetTemplate.defaultSize.width,
        height: widgetTemplate.defaultSize.height,
      },
      visible: true,
      settings: {
        showActiveEnergy: true,
        showReactiveEnergy: true,
        showComparison: false,
      },
    };

    dispatch(addWidget(newWidget));
    setSnackbar({ open: true, message: `Widget "${widgetTemplate.name}" agregado al dashboard` });
  };

  const handleUpdateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    dispatch(updateWidget({ id, widget: updates }));
  };

  const handleRemoveWidget = (id: string) => {
    dispatch(removeWidget(id));
    setSnackbar({ open: true, message: 'Widget eliminado del dashboard' });
  };

  const handleUpdateWidgetPosition = (id: string, position: Partial<WidgetConfig['position']>) => {
    dispatch(updateWidgetPosition({ id, position }));
  };

  const handleSaveLayout = (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLayout: DashboardLayout = {
      ...layout,
      id: `layout-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addLayout(newLayout));
    setSnackbar({ open: true, message: `Vista "${layout.name}" guardada exitosamente` });
  };

  const handleUpdateLayout = (id: string, updates: Partial<DashboardLayout>) => {
    dispatch(updateLayout({ id, layout: updates }));
    setSnackbar({ open: true, message: 'Vista actualizada exitosamente' });
  };

  const handleDeleteLayout = (id: string) => {
    dispatch(deleteLayout(id));
    setSnackbar({ open: true, message: 'Vista eliminada exitosamente' });
  };

  const handleSelectLayout = (layout: DashboardLayout) => {
    dispatch(setCurrentLayout(layout));
    setSnackbar({ open: true, message: `Vista "${layout.name}" seleccionada` });
  };

  const handleSavePreferences = (preferences: UserPreferences) => {
    dispatch(setUserPreferences(preferences));
    setSnackbar({ open: true, message: 'Preferencias guardadas exitosamente' });
  };

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    dispatch(updateUserPreferences(updates));
  };

  const toggleCustomization = () => {
    dispatch(toggleCustomizationMode());
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderSidebarContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <WidgetLibrary
            onAddWidget={handleAddWidget}
            disabled={!isCustomizing}
          />
        );
      case 1:
        return (
          <LayoutManager
            layouts={availableLayouts}
            currentLayout={currentLayout}
            onSelectLayout={handleSelectLayout}
            onSaveLayout={handleSaveLayout}
            onUpdateLayout={handleUpdateLayout}
            onDeleteLayout={handleDeleteLayout}
            onDuplicateLayout={(id) => {
              const layout = availableLayouts.find(l => l.id === id);
              if (layout) {
                handleSaveLayout({
                  ...layout,
                  name: `${layout.name} (Copia)`,
                  isDefault: false,
                });
              }
            }}
          />
        );
      case 2:
        return (
          <UserPreferencesComponent
            preferences={userPreferences}
            onSavePreferences={handleSavePreferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={sidebarOpen}
          sx={{
            width: 400,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 400,
              boxSizing: 'border-box',
            },
          }}
        >
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ flex: 1 }}
              >
                <Tab icon={<Widgets />} label="Widgets" />
                <Tab icon={<ViewList />} label="Vistas" />
                <Tab icon={<Person />} label="Config" />
              </Tabs>
              <IconButton onClick={() => setSidebarOpen(false)}>
                <Settings />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderSidebarContent()}
          </Box>
        </Drawer>

        {/* Contenido Principal */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" sx={{ flex: 1 }}>
                Dashboard Personalizable
                {currentLayout && (
                  <Chip
                    label={currentLayout.name}
                    size="small"
                    color="secondary"
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              
              <Box display="flex" gap={1}>
                <Button
                  variant={isCustomizing ? 'contained' : 'outlined'}
                  color="secondary"
                  startIcon={<Settings />}
                  onClick={toggleCustomization}
                >
                  {isCustomizing ? 'Finalizar' : 'Personalizar'}
                </Button>
                
                <IconButton
                  color="inherit"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Settings />
                </IconButton>
                
                <IconButton
                  color="inherit"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Dashboard Personalizable funcionando correctamente con datos simulados para demostración
            </Alert>
            {currentLayout ? (
              <CustomizableDashboard
                widgets={currentLayout.widgets}
                onUpdateWidget={handleUpdateWidget}
                onRemoveWidget={handleRemoveWidget}
                onUpdateWidgetPosition={handleUpdateWidgetPosition}
                isCustomizing={isCustomizing}
                data={energyData || []}
                billingData={billingData?.billing || []}
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="400px"
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay vista seleccionada
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Selecciona una vista existente o crea una nueva para comenzar
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
        />
      </Box>
    </DndProvider>
  );
};

export default CustomizableDashboardPage;



