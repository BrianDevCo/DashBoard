import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertRule, AlertInstance, AlertGroup, AlertTemplate, AlertSettings, AlertCondition, AlertRecipient } from '../../types/alerts';

interface AlertsState {
  rules: AlertRule[];
  instances: AlertInstance[];
  groups: AlertGroup[];
  templates: AlertTemplate[];
  settings: AlertSettings | null;
  unreadCount: number;
  isCreatingRule: boolean;
  selectedRule: AlertRule | null;
  filterStatus: string;
  filterSeverity: string;
  filterType: string;
}

const initialState: AlertsState = {
  rules: [],
  instances: [],
  groups: [],
  templates: [],
  settings: null,
  unreadCount: 0,
  isCreatingRule: false,
  selectedRule: null,
  filterStatus: 'all',
  filterSeverity: 'all',
  filterType: 'all',
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    // Gestión de reglas de alertas
    setRules: (state, action: PayloadAction<AlertRule[]>) => {
      state.rules = action.payload;
    },
    
    addRule: (state, action: PayloadAction<AlertRule>) => {
      state.rules.push(action.payload);
    },
    
    updateRule: (state, action: PayloadAction<{ id: string; rule: Partial<AlertRule> }>) => {
      const index = state.rules.findIndex(rule => rule.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = { ...state.rules[index], ...action.payload.rule };
      }
    },
    
    deleteRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter(rule => rule.id !== action.payload);
    },
    
    toggleRuleEnabled: (state, action: PayloadAction<string>) => {
      const rule = state.rules.find(r => r.id === action.payload);
      if (rule) {
        rule.enabled = !rule.enabled;
      }
    },
    
    // Gestión de instancias de alertas
    setInstances: (state, action: PayloadAction<AlertInstance[]>) => {
      state.instances = action.payload;
      state.unreadCount = action.payload.filter(instance => instance.status === 'active').length;
    },
    
    addInstance: (state, action: PayloadAction<AlertInstance>) => {
      state.instances.unshift(action.payload);
      if (action.payload.status === 'active') {
        state.unreadCount += 1;
      }
    },
    
    updateInstance: (state, action: PayloadAction<{ id: string; instance: Partial<AlertInstance> }>) => {
      const index = state.instances.findIndex(instance => instance.id === action.payload.id);
      if (index !== -1) {
        const oldStatus = state.instances[index].status;
        state.instances[index] = { ...state.instances[index], ...action.payload.instance };
        
        // Actualizar contador de no leídas
        if (oldStatus === 'active' && action.payload.instance.status !== 'active') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (oldStatus !== 'active' && action.payload.instance.status === 'active') {
          state.unreadCount += 1;
        }
      }
    },
    
    acknowledgeAlert: (state, action: PayloadAction<{ id: string; acknowledgedBy: string }>) => {
      const instance = state.instances.find(i => i.id === action.payload.id);
      if (instance && instance.status === 'active') {
        instance.status = 'acknowledged';
        instance.acknowledgedAt = new Date().toISOString();
        instance.acknowledgedBy = action.payload.acknowledgedBy;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    resolveAlert: (state, action: PayloadAction<{ id: string; resolvedBy: string }>) => {
      const instance = state.instances.find(i => i.id === action.payload.id);
      if (instance && instance.status !== 'resolved') {
        instance.status = 'resolved';
        instance.resolvedAt = new Date().toISOString();
        instance.resolvedBy = action.payload.resolvedBy;
        if (instance.status === 'resolved') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    
    // Gestión de grupos
    setGroups: (state, action: PayloadAction<AlertGroup[]>) => {
      state.groups = action.payload;
    },
    
    addGroup: (state, action: PayloadAction<AlertGroup>) => {
      state.groups.push(action.payload);
    },
    
    updateGroup: (state, action: PayloadAction<{ id: string; group: Partial<AlertGroup> }>) => {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = { ...state.groups[index], ...action.payload.group };
      }
    },
    
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
    
    // Gestión de plantillas
    setTemplates: (state, action: PayloadAction<AlertTemplate[]>) => {
      state.templates = action.payload;
    },
    
    addTemplate: (state, action: PayloadAction<AlertTemplate>) => {
      state.templates.push(action.payload);
    },
    
    updateTemplate: (state, action: PayloadAction<{ id: string; template: Partial<AlertTemplate> }>) => {
      const index = state.templates.findIndex(template => template.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = { ...state.templates[index], ...action.payload.template };
      }
    },
    
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(template => template.id !== action.payload);
    },
    
    // Gestión de configuraciones
    setSettings: (state, action: PayloadAction<AlertSettings>) => {
      state.settings = action.payload;
    },
    
    updateSettings: (state, action: PayloadAction<Partial<AlertSettings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },
    
    // UI State
    setCreatingRule: (state, action: PayloadAction<boolean>) => {
      state.isCreatingRule = action.payload;
    },
    
    setSelectedRule: (state, action: PayloadAction<AlertRule | null>) => {
      state.selectedRule = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<{
      status?: string;
      severity?: string;
      type?: string;
    }>) => {
      if (action.payload.status !== undefined) {
        state.filterStatus = action.payload.status;
      }
      if (action.payload.severity !== undefined) {
        state.filterSeverity = action.payload.severity;
      }
      if (action.payload.type !== undefined) {
        state.filterType = action.payload.type;
      }
    },
    
    clearFilters: (state) => {
      state.filterStatus = 'all';
      state.filterSeverity = 'all';
      state.filterType = 'all';
    },
    
    markAllAsRead: (state) => {
      state.instances.forEach(instance => {
        if (instance.status === 'active') {
          instance.status = 'acknowledged';
          instance.acknowledgedAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    
    // Utilidades
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    
    resetAlerts: (state) => {
      state.rules = [];
      state.instances = [];
      state.groups = [];
      state.templates = [];
      state.settings = null;
      state.unreadCount = 0;
      state.isCreatingRule = false;
      state.selectedRule = null;
      state.filterStatus = 'all';
      state.filterSeverity = 'all';
      state.filterType = 'all';
    },
  },
});

export const {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  toggleRuleEnabled,
  setInstances,
  addInstance,
  updateInstance,
  acknowledgeAlert,
  resolveAlert,
  setGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  setTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setSettings,
  updateSettings,
  setCreatingRule,
  setSelectedRule,
  setFilters,
  clearFilters,
  markAllAsRead,
  clearUnreadCount,
  resetAlerts,
} = alertsSlice.actions;

export default alertsSlice.reducer;

