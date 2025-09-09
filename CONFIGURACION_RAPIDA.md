# ⚡ Configuración Rápida - Sin Oracle Database

## 🎯 Para usar el proyecto inmediatamente con datos simulados mejorados

### 1. 🔑 Crear archivo .env básico

```bash
# Crear archivo .env
cp env.example .env
```

**Contenido mínimo del .env:**
```bash
# Configuración básica
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT Secret (cambiar por uno seguro)
JWT_SECRET=mi-secreto-jwt-para-desarrollo-2024

# Deshabilitar Oracle (usar datos simulados)
USE_MOCK_DATA=true
```

### 2. 🚀 Iniciar el proyecto

```bash
# Backend
cd backend
npm install
npm start

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

### 3. 📊 Mejorar datos simulados

**Para hacer los datos más realistas, puedes:**

1. **Modificar los datos en `frontend/src/data/mockData.ts`**
2. **Agregar más variedad en los valores**
3. **Simular actualizaciones en tiempo real**
4. **Agregar más ubicaciones y medidores**

### 4. 🔄 Simular actualizaciones en tiempo real

**Agregar al Dashboard.tsx:**
```typescript
// Simular actualizaciones cada 30 segundos
useEffect(() => {
  const interval = setInterval(() => {
    // Actualizar datos simulados
    setRealTimeMetrics(prev => 
      prev.map(metric => ({
        ...metric,
        kwhD: metric.kwhD + (Math.random() - 0.5) * 100,
        timestamp: new Date().toISOString()
      }))
    );
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

## ✅ Ventajas de esta configuración:

- ✅ **Funciona inmediatamente**
- ✅ **No necesita Oracle Database**
- ✅ **Fácil de modificar**
- ✅ **Ideal para demos y pruebas**
- ✅ **Puede simular datos reales**

## ⚠️ Limitaciones:

- ❌ **Datos no persisten** (se reinician al recargar)
- ❌ **No hay autenticación real**
- ❌ **No hay notificaciones reales**
- ❌ **Datos no son históricos**

## 🎯 Cuándo usar cada opción:

**Usar Configuración Rápida si:**
- Quieres probar el proyecto rápidamente
- Es para una demo o presentación
- No tienes Oracle Database disponible
- Es para desarrollo local

**Usar Configuración Completa si:**
- Quieres datos reales y persistentes
- Es para producción
- Necesitas autenticación real
- Quieres notificaciones por email
