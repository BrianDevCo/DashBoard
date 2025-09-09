# 🔧 Guía de Configuración del Dashboard Energético

## 📋 Prerrequisitos

### Opción 1: Con Docker (RECOMENDADO)
- Docker Desktop instalado
- Docker Compose instalado

### Opción 2: Instalación Manual
- Node.js 18+ 
- Oracle Database 21c+
- Redis (opcional)

## 🚀 Configuración Rápida con Docker

### 1. Clonar y configurar
```bash
git clone https://github.com/BrianDevCo/DashBoard.git
cd DashBoard
```

### 2. Crear archivo de variables de entorno
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar las variables necesarias
nano .env
```

### 3. Configurar variables en .env
```bash
# Base de datos Oracle (OBLIGATORIO)
ORACLE_USER=energy_user
ORACLE_PASSWORD=tu_password_seguro
ORACLE_CONNECTION_STRING=oracle:1521/XE

# JWT Secret (OBLIGATORIO)
JWT_SECRET=tu-jwt-secret-muy-seguro-para-produccion

# Email (OPCIONAL)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Redis (OPCIONAL)
REDIS_HOST=redis
REDIS_PORT=6379
```

### 4. Iniciar con Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

## 🔧 Configuración Manual (Sin Docker)

### 1. Backend
```bash
cd backend
npm install
npm run build
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Base de Datos Oracle
- Instalar Oracle Database 21c
- Crear usuario `energy_user`
- Crear esquema con tablas necesarias

## 📊 Estructura de Base de Datos

El proyecto espera las siguientes tablas en Oracle:

```sql
-- Tabla de métricas energéticas
CREATE TABLE energy_metrics (
    id VARCHAR2(50) PRIMARY KEY,
    timestamp TIMESTAMP,
    kwh_d NUMBER,
    kvarh_d NUMBER,
    kwh_r NUMBER,
    kvarh_r NUMBER,
    kvarh_penalized NUMBER,
    obis_code VARCHAR2(20),
    meter_id VARCHAR2(50),
    location VARCHAR2(100)
);

-- Tabla de alertas
CREATE TABLE alerts (
    id NUMBER PRIMARY KEY,
    type VARCHAR2(20),
    message VARCHAR2(500),
    timestamp TIMESTAMP,
    severity VARCHAR2(20),
    resolved NUMBER(1)
);

-- Tabla de usuarios
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100),
    email VARCHAR2(100),
    role VARCHAR2(20),
    status VARCHAR2(20),
    last_login TIMESTAMP
);
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Oracle Database**: localhost:1521
- **Oracle Enterprise Manager**: http://localhost:5500

## 🔐 Credenciales por Defecto

- **Oracle**: energy_user / energy_password
- **JWT Secret**: Cambiar en producción
- **Puerto Backend**: 3001
- **Puerto Frontend**: 3000

## 🚨 Notas Importantes

1. **Cambiar JWT_SECRET** en producción
2. **Configurar HTTPS** para producción
3. **Backup de base de datos** regularmente
4. **Monitorear logs** en /logs
5. **Configurar firewall** apropiadamente

## 🆘 Solución de Problemas

### Error de conexión a Oracle
```bash
# Verificar que Oracle esté corriendo
docker-compose logs oracle

# Verificar conectividad
telnet localhost 1521
```

### Error de permisos
```bash
# Dar permisos a Docker
sudo chown -R $USER:$USER .
```

### Error de memoria
```bash
# Aumentar memoria para Docker
# En Docker Desktop > Settings > Resources > Memory
```

## 📞 Soporte

Para problemas específicos, revisar:
1. Logs en `/logs`
2. Estado de contenedores: `docker-compose ps`
3. Variables de entorno en `.env`
