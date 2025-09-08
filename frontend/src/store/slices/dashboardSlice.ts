import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WidgetConfig, DashboardLayout, UserPreferences, EnergyUnit, TimeZone, DateFormat, TimeFormat } from '../../types/widgets';

interface DashboardState {
  currentLayout: DashboardLayout | null;
  availableLayouts: DashboardLayout[];
  userPreferences: UserPreferences | null;
  isCustomizing: boolean;
  selectedWidgets: string[];
  draggedWidget: string | null;
}

const initialState: DashboardState = {
  currentLayout: null,
  availableLayouts: [],
  userPreferences: null,
  isCustomizing: false,
  selectedWidgets: [],
  draggedWidget: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Gestión de layouts
    setCurrentLayout: (state, action: PayloadAction<DashboardLayout>) => {
      state.currentLayout = action.payload;
    },
    
    addLayout: (state, action: PayloadAction<DashboardLayout>) => {
      state.availableLayouts.push(action.payload);
    },
    
    updateLayout: (state, action: PayloadAction<{ id: string; layout: Partial<DashboardLayout> }>) => {
      const index = state.availableLayouts.findIndex(layout => layout.id === action.payload.id);
      if (index !== -1) {
        state.availableLayouts[index] = { ...state.availableLayouts[index], ...action.payload.layout };
      }
      if (state.currentLayout?.id === action.payload.id) {
        state.currentLayout = { ...state.currentLayout, ...action.payload.layout };
      }
    },
    
    deleteLayout: (state, action: PayloadAction<string>) => {
      state.availableLayouts = state.availableLayouts.filter(layout => layout.id !== action.payload);
      if (state.currentLayout?.id === action.payload) {
        state.currentLayout = state.availableLayouts[0] || null;
      }
    },
    
    // Gestión de widgets
    addWidget: (state, action: PayloadAction<WidgetConfig>) => {
      if (state.currentLayout) {
        state.currentLayout.widgets.push(action.payload);
      }
    },
    
    updateWidget: (state, action: PayloadAction<{ id: string; widget: Partial<WidgetConfig> }>) => {
      if (state.currentLayout) {
        const index = state.currentLayout.widgets.findIndex(widget => widget.id === action.payload.id);
        if (index !== -1) {
          state.currentLayout.widgets[index] = { ...state.currentLayout.widgets[index], ...action.payload.widget };
        }
      }
    },
    
    removeWidget: (state, action: PayloadAction<string>) => {
      if (state.currentLayout) {
        state.currentLayout.widgets = state.currentLayout.widgets.filter(widget => widget.id !== action.payload);
      }
    },
    
    updateWidgetPosition: (state, action: PayloadAction<{ id: string; position: Partial<WidgetConfig['position']> }>) => {
      if (state.currentLayout) {
        const widget = state.currentLayout.widgets.find(w => w.id === action.payload.id);
        if (widget) {
          widget.position = { ...widget.position, ...action.payload.position };
        }
      }
    },
    
    // Gestión de preferencias de usuario
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences = action.payload;
    },
    
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.userPreferences) {
        state.userPreferences = { ...state.userPreferences, ...action.payload };
      }
    },
    
    updateEnergyUnits: (state, action: PayloadAction<{ energy: EnergyUnit; reactive: EnergyUnit }>) => {
      if (state.userPreferences) {
        state.userPreferences.units = action.payload;
      }
    },
    
    updateTimezone: (state, action: PayloadAction<TimeZone>) => {
      if (state.userPreferences) {
        state.userPreferences.timezone = action.payload;
      }
    },
    
    updateDateTimeFormats: (state, action: PayloadAction<{ dateFormat: DateFormat; timeFormat: TimeFormat }>) => {
      if (state.userPreferences) {
        state.userPreferences.dateFormat = action.payload.dateFormat;
        state.userPreferences.timeFormat = action.payload.timeFormat;
      }
    },
    
    updateCustomLabels: (state, action: PayloadAction<{ meterId: string; name: string; description?: string }>) => {
      if (state.userPreferences) {
        state.userPreferences.customLabels[action.payload.meterId] = {
          name: action.payload.name,
          description: action.payload.description,
        };
      }
    },
    
    updateChartColors: (state, action: PayloadAction<{ seriesName: string; color: string }>) => {
      if (state.userPreferences) {
        state.userPreferences.chartColors[action.payload.seriesName] = action.payload.color;
      }
    },
    
    // Modo de personalización
    toggleCustomizationMode: (state) => {
      state.isCustomizing = !state.isCustomizing;
    },
    
    setCustomizationMode: (state, action: PayloadAction<boolean>) => {
      state.isCustomizing = action.payload;
    },
    
    // Gestión de widgets seleccionados
    selectWidget: (state, action: PayloadAction<string>) => {
      if (!state.selectedWidgets.includes(action.payload)) {
        state.selectedWidgets.push(action.payload);
      }
    },
    
    deselectWidget: (state, action: PayloadAction<string>) => {
      state.selectedWidgets = state.selectedWidgets.filter(id => id !== action.payload);
    },
    
    clearSelectedWidgets: (state) => {
      state.selectedWidgets = [];
    },
    
    // Drag and drop
    setDraggedWidget: (state, action: PayloadAction<string | null>) => {
      state.draggedWidget = action.payload;
    },
    
    // Reset
    resetDashboard: (state) => {
      state.currentLayout = null;
      state.availableLayouts = [];
      state.userPreferences = null;
      state.isCustomizing = false;
      state.selectedWidgets = [];
      state.draggedWidget = null;
    },
  },
});

export const {
  setCurrentLayout,
  addLayout,
  updateLayout,
  deleteLayout,
  addWidget,
  updateWidget,
  removeWidget,
  updateWidgetPosition,
  setUserPreferences,
  updateUserPreferences,
  updateEnergyUnits,
  updateTimezone,
  updateDateTimeFormats,
  updateCustomLabels,
  updateChartColors,
  toggleCustomizationMode,
  setCustomizationMode,
  selectWidget,
  deselectWidget,
  clearSelectedWidgets,
  setDraggedWidget,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;


