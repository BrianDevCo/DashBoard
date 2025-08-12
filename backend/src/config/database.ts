import oracledb from 'oracledb';
import { logger } from '../utils/logger';

// Configuración de Oracle
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchArraySize = 100;

interface DatabaseConfig {
  user: string;
  password: string;
  connectString: string;
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
  poolTimeout: number;
  queueTimeout: number;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: oracledb.Pool | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected && this.pool) {
        logger.info('Conexión a la base de datos ya establecida');
        return;
      }

      const config: DatabaseConfig = {
        user: process.env.ORACLE_USER || 'energy_user',
        password: process.env.ORACLE_PASSWORD || 'energy_password',
        connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/energy_db',
        poolMin: parseInt(process.env.ORACLE_POOL_MIN || '2'),
        poolMax: parseInt(process.env.ORACLE_POOL_MAX || '10'),
        poolIncrement: parseInt(process.env.ORACLE_POOL_INCREMENT || '1'),
        poolTimeout: parseInt(process.env.ORACLE_POOL_TIMEOUT || '60'),
        queueTimeout: parseInt(process.env.ORACLE_QUEUE_TIMEOUT || '60000'),
      };

      logger.info('Conectando a la base de datos Oracle...');
      logger.info(`Host: ${config.connectString}`);
      logger.info(`Usuario: ${config.user}`);
      logger.info(`Pool: ${config.poolMin}-${config.poolMax}`);

      // Crear pool de conexiones
      this.pool = await oracledb.createPool({
        user: config.user,
        password: config.password,
        connectString: config.connectString,
        poolMin: config.poolMin,
        poolMax: config.poolMax,
        poolIncrement: config.poolIncrement,
        poolTimeout: config.poolTimeout,
        queueTimeout: config.queueTimeout,
        events: true,
        _enableStats: true,
      });

      this.isConnected = true;
      logger.info('Pool de conexiones Oracle creado exitosamente');

      // Configurar eventos del pool
      this.pool.on('error', (error) => {
        logger.error('Error en el pool de conexiones Oracle:', error);
        this.isConnected = false;
      });

      // Probar conexión
      await this.testConnection();

    } catch (error) {
      logger.error('Error al conectar a la base de datos Oracle:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async testConnection(): Promise<void> {
    try {
      if (!this.pool) {
        throw new Error('Pool de conexiones no inicializado');
      }

      const connection = await this.pool.getConnection();
      const result = await connection.execute('SELECT 1 FROM DUAL');
      await connection.close();

      logger.info('Conexión de prueba exitosa a Oracle');
      logger.info(`Resultado: ${JSON.stringify(result)}`);

    } catch (error) {
      logger.error('Error en la prueba de conexión:', error);
      throw error;
    }
  }

  public async getConnection(): Promise<oracledb.Connection> {
    try {
      if (!this.pool || !this.isConnected) {
        throw new Error('Base de datos no conectada');
      }

      const connection = await this.pool.getConnection();
      return connection;

    } catch (error) {
      logger.error('Error al obtener conexión del pool:', error);
      throw error;
    }
  }

  public async executeQuery<T = any>(
    sql: string,
    binds: any[] = [],
    options: oracledb.IExecuteOptions = {}
  ): Promise<T[]> {
    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await this.getConnection();
      
      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        ...options,
      });

      return result.rows || [];

    } catch (error) {
      logger.error('Error al ejecutar consulta:', error);
      logger.error('SQL:', sql);
      logger.error('Binds:', binds);
      throw error;

    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          logger.error('Error al cerrar conexión:', closeError);
        }
      }
    }
  }

  public async executeProcedure<T = any>(
    procedureName: string,
    binds: any[] = [],
    options: oracledb.IExecuteOptions = {}
  ): Promise<T> {
    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await this.getConnection();
      
      const result = await connection.execute(
        `BEGIN ${procedureName}(:1, :2, :3); END;`,
        binds,
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          ...options,
        }
      );

      return result as T;

    } catch (error) {
      logger.error('Error al ejecutar procedimiento:', error);
      logger.error('Procedimiento:', procedureName);
      logger.error('Binds:', binds);
      throw error;

    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          logger.error('Error al cerrar conexión:', closeError);
        }
      }
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        this.isConnected = false;
        logger.info('Pool de conexiones Oracle cerrado');
      }
    } catch (error) {
      logger.error('Error al cerrar pool de conexiones:', error);
      throw error;
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected && this.pool !== null;
  }

  public getPoolStats(): any {
    if (!this.pool) {
      return null;
    }

    return {
      connectionsInUse: this.pool.connectionsInUse,
      connectionsOpen: this.pool.connectionsOpen,
      poolMax: this.pool.poolMax,
      poolMin: this.pool.poolMin,
    };
  }
}

// Función para conectar a la base de datos
export async function connectDatabase(): Promise<void> {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.connect();
}

// Función para obtener la instancia de la base de datos
export function getDatabase(): DatabaseConnection {
  return DatabaseConnection.getInstance();
}

// Función para cerrar la conexión
export async function closeDatabase(): Promise<void> {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.close();
}

export default DatabaseConnection;

