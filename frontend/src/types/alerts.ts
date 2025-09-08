// Tipos para el sistema de alertas y notificaciones

export type AlertType = 'consumption' | 'powerFactor' | 'dataLoss' | 'demand' | 'efficiency' | 'billing';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'suppressed';

export type NotificationChannel = 'email' | 'platform' | 'sms' | 'webhook';

export type TimeRange = {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
};

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  enabled: boolean;
  conditions: AlertCondition[];
  notificationChannels: NotificationChannel[];
  recipients: AlertRecipient[];
  timeRange?: TimeRange;
  cooldownPeriod: number; // en minutos
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AlertCondition {
  id: string;
  metric: string; // 'kWhD', 'kVarhD', 'powerFactor', 'demand', etc.
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'ne';
  threshold: number;
  unit: string;
  duration: number; // en minutos, para condiciones sostenidas
}

export interface AlertRecipient {
  id: string;
  type: 'user' | 'group' | 'email' | 'phone';
  value: string; // userId, groupId, email, phone number
  name: string;
  channels: NotificationChannel[];
}

export interface AlertInstance {
  id: string;
  ruleId: string;
  ruleName: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  data: {
    meterId?: string;
    location?: string;
    currentValue: number;
    threshold: number;
    unit: string;
    additionalData?: Record<string, any>;
  };
  notifications: NotificationLog[];
}

export interface NotificationLog {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
  errorMessage?: string;
  retryCount: number;
}

export interface AlertGroup {
  id: string;
  name: string;
  description: string;
  meterIds: string[];
  locationIds: string[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AlertTemplate {
  id: string;
  name: string;
  type: AlertType;
  subject: string;
  message: string;
  emailTemplate?: string;
  smsTemplate?: string;
  platformTemplate?: string;
  variables: string[]; // Variables disponibles en el template
}

export interface AlertSettings {
  userId: string;
  globalSettings: {
    enableEmail: boolean;
    enableSMS: boolean;
    enablePlatform: boolean;
    quietHours: TimeRange[];
    maxAlertsPerHour: number;
    digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  };
  channelSettings: {
    email: {
      enabled: boolean;
      address: string;
      frequency: 'immediate' | 'digest';
    };
    sms: {
      enabled: boolean;
      phoneNumber: string;
      frequency: 'immediate' | 'digest';
    };
    platform: {
      enabled: boolean;
      showInSidebar: boolean;
      showAsToast: boolean;
      soundEnabled: boolean;
    };
  };
  suppressionRules: {
    id: string;
    name: string;
    conditions: AlertCondition[];
    duration: number; // en minutos
    enabled: boolean;
  }[];
}

// Configuraciones predefinidas de alertas
export const DEFAULT_ALERT_TEMPLATES: AlertTemplate[] = [
  {
    id: 'consumption-high',
    name: 'Consumo Alto',
    type: 'consumption',
    subject: 'Alerta: Consumo de Energía Alto',
    message: 'El consumo de energía en {location} ha excedido el umbral de {threshold} {unit}. Valor actual: {currentValue} {unit}',
    emailTemplate: `
      <h2>Alerta de Consumo Alto</h2>
      <p><strong>Ubicación:</strong> {location}</p>
      <p><strong>Medidor:</strong> {meterId}</p>
      <p><strong>Umbral:</strong> {threshold} {unit}</p>
      <p><strong>Valor Actual:</strong> {currentValue} {unit}</p>
      <p><strong>Hora:</strong> {timestamp}</p>
    `,
    smsTemplate: 'ALERTA: Consumo alto en {location}. Actual: {currentValue} {unit} (Umbral: {threshold} {unit})',
    platformTemplate: '⚠️ Consumo alto detectado en {location}',
    variables: ['location', 'meterId', 'threshold', 'currentValue', 'unit', 'timestamp'],
  },
  {
    id: 'power-factor-low',
    name: 'Factor de Potencia Bajo',
    type: 'powerFactor',
    subject: 'Alerta: Factor de Potencia Crítico',
    message: 'El factor de potencia en {location} está por debajo del umbral crítico de {threshold}. Valor actual: {currentValue}',
    emailTemplate: `
      <h2>Alerta de Factor de Potencia</h2>
      <p><strong>Ubicación:</strong> {location}</p>
      <p><strong>Factor de Potencia Actual:</strong> {currentValue}</p>
      <p><strong>Umbral Crítico:</strong> {threshold}</p>
      <p><strong>Recomendación:</strong> Instalar bancos de capacitores</p>
    `,
    smsTemplate: 'ALERTA: Factor de potencia bajo en {location}. Actual: {currentValue} (Umbral: {threshold})',
    platformTemplate: '⚡ Factor de potencia crítico en {location}',
    variables: ['location', 'currentValue', 'threshold'],
  },
  {
    id: 'data-loss',
    name: 'Pérdida de Datos',
    type: 'dataLoss',
    subject: 'Alerta: Pérdida de Comunicación con Medidor',
    message: 'No se han recibido datos del medidor {meterId} en {location} durante {duration} minutos',
    emailTemplate: `
      <h2>Alerta de Pérdida de Datos</h2>
      <p><strong>Medidor:</strong> {meterId}</p>
      <p><strong>Ubicación:</strong> {location}</p>
      <p><strong>Duración sin datos:</strong> {duration} minutos</p>
      <p><strong>Última lectura:</strong> {lastReading}</p>
    `,
    smsTemplate: 'ALERTA: Sin datos del medidor {meterId} en {location} por {duration} min',
    platformTemplate: '📡 Pérdida de comunicación con {meterId}',
    variables: ['meterId', 'location', 'duration', 'lastReading'],
  },
];

export const DEFAULT_ALERT_RULES: Partial<AlertRule>[] = [
  {
    name: 'Consumo Diario Alto',
    description: 'Alerta cuando el consumo diario excede 1000 kWh',
    type: 'consumption',
    severity: 'high',
    conditions: [
      {
        id: 'daily-consumption',
        metric: 'kWhD',
        operator: 'gt',
        threshold: 1000,
        unit: 'kWh',
        duration: 60,
      },
    ],
    notificationChannels: ['email', 'platform'],
    cooldownPeriod: 60,
  },
  {
    name: 'Factor de Potencia Crítico',
    description: 'Alerta cuando el factor de potencia es menor a 0.8',
    type: 'powerFactor',
    severity: 'critical',
    conditions: [
      {
        id: 'power-factor-low',
        metric: 'powerFactor',
        operator: 'lt',
        threshold: 0.8,
        unit: '',
        duration: 30,
      },
    ],
    notificationChannels: ['email', 'platform', 'sms'],
    cooldownPeriod: 30,
  },
  {
    name: 'Pérdida de Datos',
    description: 'Alerta cuando no hay datos del medidor por más de 15 minutos',
    type: 'dataLoss',
    severity: 'medium',
    conditions: [
      {
        id: 'no-data',
        metric: 'dataAvailability',
        operator: 'eq',
        threshold: 0,
        unit: '',
        duration: 15,
      },
    ],
    notificationChannels: ['email', 'platform'],
    cooldownPeriod: 15,
  },
];



