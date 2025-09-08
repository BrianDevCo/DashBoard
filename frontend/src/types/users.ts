// Tipos para el sistema de usuarios y roles

export type UserRole = 'admin' | 'measurements' | 'end_user';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type Permission = 
  | 'view_dashboard'
  | 'view_metrics'
  | 'view_alerts'
  | 'view_reports'
  | 'view_export'
  | 'view_settings'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_meters'
  | 'manage_alerts'
  | 'manage_reports'
  | 'manage_export'
  | 'manage_settings'
  | 'view_energy_data'
  | 'view_billing_data'
  | 'view_analytics'
  | 'create_reports'
  | 'export_data'
  | 'print_data'
  | 'configure_alerts'
  | 'manage_groups'
  | 'view_audit_logs'
  | 'manage_system_settings';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
  meterIds: string[];
  groupIds: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  profile: {
    phone?: string;
    department?: string;
    position?: string;
    avatar?: string;
    timezone: string;
    language: 'es' | 'en';
    notifications: {
      email: boolean;
      sms: boolean;
      platform: boolean;
    };
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    dashboardLayout: string;
    defaultView: string;
    refreshInterval: number;
  };
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  meterIds: string[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  details?: Record<string, any>;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  loginAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  category: 'dashboard' | 'data' | 'management' | 'system';
}

// Roles predefinidos del sistema
export const SYSTEM_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema con todos los permisos',
    permissions: [
      'view_dashboard',
      'view_metrics',
      'view_alerts',
      'view_reports',
      'view_export',
      'view_settings',
      'manage_users',
      'manage_roles',
      'manage_meters',
      'manage_alerts',
      'manage_reports',
      'manage_export',
      'manage_settings',
      'view_energy_data',
      'view_billing_data',
      'view_analytics',
      'create_reports',
      'export_data',
      'print_data',
      'configure_alerts',
      'manage_groups',
      'view_audit_logs',
      'manage_system_settings',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'measurements',
    name: 'Mediciones',
    description: 'Acceso a datos de medición y configuración de alertas',
    permissions: [
      'view_dashboard',
      'view_metrics',
      'view_alerts',
      'view_energy_data',
      'view_analytics',
      'configure_alerts',
      'export_data',
      'print_data',
      'create_reports',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'end_user',
    name: 'Usuario Final',
    description: 'Acceso de solo lectura a datos y reportes',
    permissions: [
      'view_dashboard',
      'view_metrics',
      'view_reports',
      'view_energy_data',
      'export_data',
      'print_data',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Grupos de permisos organizados por categoría
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Permisos relacionados con el dashboard principal',
    permissions: ['view_dashboard'],
    category: 'dashboard',
  },
  {
    id: 'data_viewing',
    name: 'Visualización de Datos',
    description: 'Permisos para ver datos energéticos y métricas',
    permissions: [
      'view_metrics',
      'view_energy_data',
      'view_billing_data',
      'view_analytics',
    ],
    category: 'data',
  },
  {
    id: 'alerts',
    name: 'Alertas',
    description: 'Permisos relacionados con el sistema de alertas',
    permissions: ['view_alerts', 'configure_alerts'],
    category: 'data',
  },
  {
    id: 'reports',
    name: 'Reportes',
    description: 'Permisos para generar y ver reportes',
    permissions: ['view_reports', 'create_reports'],
    category: 'data',
  },
  {
    id: 'export',
    name: 'Exportación',
    description: 'Permisos para exportar e imprimir datos',
    permissions: ['view_export', 'export_data', 'print_data'],
    category: 'data',
  },
  {
    id: 'user_management',
    name: 'Gestión de Usuarios',
    description: 'Permisos para administrar usuarios y roles',
    permissions: ['manage_users', 'manage_roles', 'manage_groups'],
    category: 'management',
  },
  {
    id: 'system_management',
    name: 'Gestión del Sistema',
    description: 'Permisos para configurar el sistema',
    permissions: [
      'manage_meters',
      'manage_settings',
      'manage_system_settings',
      'view_audit_logs',
    ],
    category: 'system',
  },
];

// Configuración de roles por defecto
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: SYSTEM_ROLES.find(r => r.id === 'admin')?.permissions || [],
  measurements: SYSTEM_ROLES.find(r => r.id === 'measurements')?.permissions || [],
  end_user: SYSTEM_ROLES.find(r => r.id === 'end_user')?.permissions || [],
};

// Configuración de usuarios por defecto
export const DEFAULT_USER_PROFILE = {
  phone: '',
  department: '',
  position: '',
  avatar: '',
  timezone: 'America/Bogota',
  language: 'es' as const,
  notifications: {
    email: true,
    sms: false,
    platform: true,
  },
};

export const DEFAULT_USER_PREFERENCES = {
  theme: 'light' as const,
  dashboardLayout: 'default',
  defaultView: 'dashboard',
  refreshInterval: 30,
};

// Estados de usuario
export const USER_STATUSES = [
  { value: 'active', label: 'Activo', color: 'success' },
  { value: 'inactive', label: 'Inactivo', color: 'default' },
  { value: 'suspended', label: 'Suspendido', color: 'error' },
  { value: 'pending', label: 'Pendiente', color: 'warning' },
];

// Configuración de validación
export const USER_VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
  },
};

// Configuración de sesión
export const SESSION_CONFIG = {
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  refreshThreshold: 5 * 60 * 1000, // 5 minutos antes del vencimiento
  maxSessions: 5, // Máximo de sesiones activas por usuario
  inactivityTimeout: 30 * 60 * 1000, // 30 minutos de inactividad
};

// Configuración de auditoría
export const AUDIT_CONFIG = {
  retentionDays: 365, // Días de retención de logs
  sensitiveActions: [
    'login',
    'logout',
    'password_change',
    'permission_change',
    'user_creation',
    'user_deletion',
    'role_assignment',
  ],
  logLevels: ['info', 'warn', 'error', 'debug'],
};


