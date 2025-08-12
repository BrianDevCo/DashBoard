import winston from 'winston';
import path from 'path';

// Configuración de colores para consola
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Formato para archivos (sin colores)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Crear directorio de logs si no existe
const logDir = path.join(process.cwd(), 'logs');

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { service: 'energy-dashboard-api' },
  transports: [
    // Logs de error
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Logs combinados
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Logs de acceso HTTP
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Agregar transporte de consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: logFormat,
    level: 'debug',
  }));
}

// Función para loggear requests HTTP
export const logHttpRequest = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

// Función para loggear errores de base de datos
export const logDatabaseError = (error: any, operation: string, query?: string) => {
  logger.error('Database Error', {
    operation,
    query,
    error: error.message,
    stack: error.stack,
    code: error.code,
    sqlState: error.sqlState,
  });
};

// Función para loggear métricas de rendimiento
export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    metadata,
  });
};

// Función para loggear eventos del sistema
export const logSystemEvent = (event: string, details?: any) => {
  logger.info('System Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Función para loggear eventos de seguridad
export const logSecurityEvent = (event: string, details?: any) => {
  logger.warn('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
    ip: details?.ip,
    userId: details?.userId,
  });
};

// Función para loggear eventos de WebSocket
export const logWebSocketEvent = (event: string, details?: any) => {
  logger.info('WebSocket Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Función para loggear métricas energéticas
export const logEnergyMetric = (metric: string, value: number, unit: string, metadata?: any) => {
  logger.debug('Energy Metric', {
    metric,
    value,
    unit,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

// Función para loggear alertas
export const logAlert = (level: 'info' | 'warn' | 'error', message: string, details?: any) => {
  const logMethod = logger[level] as any;
  logMethod('Alert', {
    level,
    message,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Función para loggear inicio de servicios
export const logServiceStart = (serviceName: string, config?: any) => {
  logger.info('Service Started', {
    service: serviceName,
    config,
    timestamp: new Date().toISOString(),
  });
};

// Función para loggear parada de servicios
export const logServiceStop = (serviceName: string, reason?: string) => {
  logger.info('Service Stopped', {
    service: serviceName,
    reason,
    timestamp: new Date().toISOString(),
  });
};

// Función para loggear cambios de configuración
export const logConfigChange = (configKey: string, oldValue: any, newValue: any, userId?: string) => {
  logger.info('Configuration Changed', {
    configKey,
    oldValue,
    newValue,
    userId,
    timestamp: new Date().toISOString(),
  });
}

export default logger;

