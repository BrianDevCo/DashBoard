#!/bin/bash

# Script de configuración inicial para el Sistema de Monitoreo Energético
# Este script configura el entorno de desarrollo

set -e

echo "🚀 Configurando Sistema de Monitoreo Energético..."
echo "=================================================="

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados"

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde env.example..."
    cp env.example .env
    echo "⚠️  Por favor edita el archivo .env con tus configuraciones específicas"
else
    echo "✅ Archivo .env ya existe"
fi

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p logs/nginx
mkdir -p logs/backend
mkdir -p logs/frontend
mkdir -p database/scripts
mkdir -p database/migrations

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencias del frontend instaladas"
else
    echo "✅ Dependencias del frontend ya están instaladas"
fi
cd ..

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencias del backend instaladas"
else
    echo "✅ Dependencias del backend ya están instaladas"
fi
cd ..

# Construir imágenes Docker
echo "🐳 Construyendo imágenes Docker..."
docker-compose build

echo "✅ Imágenes Docker construidas"

# Mostrar información de configuración
echo ""
echo "🎯 Configuración completada exitosamente!"
echo "=========================================="
echo ""
echo "📋 Para iniciar el sistema:"
echo "   docker-compose up -d"
echo ""
echo "📋 Para ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "📋 Para detener el sistema:"
echo "   docker-compose down"
echo ""
echo "📋 Para desarrollo:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Oracle:   localhost:1521"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Edita el archivo .env con tus configuraciones"
echo "   2. Asegúrate de que los puertos 3000, 3001 y 1521 estén disponibles"
echo "   3. Para producción, cambia las credenciales por defecto"
echo ""
echo "🔧 Comandos útiles:"
echo "   - docker-compose ps          # Ver estado de los servicios"
echo "   - docker-compose restart     # Reiniciar servicios"
echo "   - docker-compose logs [servicio] # Ver logs de un servicio específico"
echo ""
echo "📚 Documentación:"
echo "   - README.md para información general"
echo "   - docs/ para documentación técnica"
echo ""
echo "🎉 ¡El sistema está listo para usar!"

