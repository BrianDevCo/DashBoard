import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import authRoutes from './routes/auth';
import energyRoutes from './routes/energy';
import reportRoutes from './routes/reports';
import settingsRoutes from './routes/settings';

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad y utilidades
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(limiter);
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de WebSocket para tiempo real
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  logger.info('Nueva conexión WebSocket establecida');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      logger.info('Mensaje WebSocket recibido:', data);
      
      // Aquí se procesarían los mensajes del cliente
      // Por ejemplo, suscripciones a métricas específicas
    } catch (error) {
      logger.error('Error al procesar mensaje WebSocket:', error);
    }
  });
  
  ws.on('close', () => {
    logger.info('Conexión WebSocket cerrada');
  });
  
  ws.on('error', (error) => {
    logger.error('Error en WebSocket:', error);
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Ruta de salud del sistema
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Monitoreo Energético',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

// Middleware de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos Oracle
    await connectDatabase();
    logger.info('Conexión a la base de datos establecida');
    
    // Iniciar servidor HTTP
    server.listen(port, () => {
      logger.info(`Servidor ejecutándose en el puerto ${port}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`URL: http://localhost:${port}`);
    });
    
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar el servidor
startServer();

export { app, server, wss };

