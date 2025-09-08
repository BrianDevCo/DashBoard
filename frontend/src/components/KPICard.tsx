import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Warning,
  Error,
  CheckCircle,
  Info,
  Refresh,
  MoreVert,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { KPICard as KPICardType, KPI_FORMAT, KPI_UTILS } from '../types/kpis';

interface KPICardProps {
  kpi: KPICardType;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onToggleVisibility?: () => void;
  showActions?: boolean;
  isVisible?: boolean;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  kpi,
  onRefresh,
  onViewDetails,
  onToggleVisibility,
  showActions = true,
  isVisible = true,
  loading = false,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'success';
      case 'decrease':
        return 'error';
      default:
        return 'info';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp />;
      case 'decrease':
        return <TrendingDown />;
      default:
        return <TrendingFlat />;
    }
  };

  const getStatusIcon = (color: string) => {
    switch (color) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      default:
        return <Info color="info" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit.includes('%')) {
      return `${value.toFixed(1)}%`;
    }
    if (unit.includes('COP') || unit.includes('$')) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (unit.includes('kW') || unit.includes('kWh')) {
      return `${value.toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })} ${unit}`;
    }
    return `${value.toLocaleString('es-ES')} ${unit}`;
  };

  const getProgressValue = () => {
    if (kpi.target && kpi.actual) {
      return Math.min((kpi.actual / kpi.target) * 100, 100);
    }
    return 0;
  };

  const getProgressColor = () => {
    const progress = getProgressValue();
    if (progress >= 100) return 'success';
    if (progress >= 80) return 'info';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  if (!isVisible) return null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: `${kpi.color}.main`,
                width: 32,
                height: 32,
                fontSize: '0.875rem',
              }}
            >
              {kpi.icon}
            </Avatar>
            <Box>
              <Typography variant="h6" noWrap>
                {kpi.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {kpi.period}
              </Typography>
            </Box>
          </Box>
          
          {showActions && (
            <Box display="flex" gap={0.5}>
              {onRefresh && (
                <Tooltip title="Actualizar">
                  <IconButton size="small" onClick={onRefresh}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
              {onToggleVisibility && (
                <Tooltip title={isVisible ? 'Ocultar' : 'Mostrar'}>
                  <IconButton size="small" onClick={onToggleVisibility}>
                    {isVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Más opciones">
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Valor principal */}
        <Box display="flex" alignItems="baseline" gap={1} mb={2}>
          <Typography variant="h4" fontWeight="bold" color={`${kpi.color}.main`}>
            {formatValue(kpi.value, kpi.unit)}
          </Typography>
          {kpi.change !== 0 && (
            <Chip
              icon={getChangeIcon(kpi.changeType)}
              label={`${kpi.change > 0 ? '+' : ''}${kpi.change.toFixed(1)}%`}
              color={getChangeColor(kpi.changeType) as any}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {/* Descripción */}
        {kpi.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {kpi.description}
          </Typography>
        )}

        {/* Progreso hacia objetivo */}
        {kpi.target && kpi.actual && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Progreso hacia objetivo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {kpi.actual.toLocaleString()} / {kpi.target.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getProgressValue()}
              color={getProgressColor() as any}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Información adicional */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={0.5}>
              {getTrendIcon(kpi.trend)}
              <Typography variant="caption" color="text.secondary">
                Tendencia {kpi.trend === 'up' ? 'ascendente' : kpi.trend === 'down' ? 'descendente' : 'estable'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={0.5}>
              {getStatusIcon(kpi.color)}
              <Typography variant="caption" color="text.secondary">
                {kpi.color === 'success' ? 'Excelente' : 
                 kpi.color === 'warning' ? 'Atención' : 
                 kpi.color === 'error' ? 'Crítico' : 'Normal'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Varianza */}
        {kpi.variance !== undefined && (
          <Box mt={2}>
            <Divider sx={{ mb: 1 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                Varianza vs objetivo
              </Typography>
              <Typography
                variant="caption"
                color={kpi.variance > 0 ? 'success.main' : 'error.main'}
                fontWeight="medium"
              >
                {kpi.variance > 0 ? '+' : ''}{kpi.variance.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <LinearProgress sx={{ width: '80%' }} />
        </Box>
      )}
    </Card>
  );
};

export default KPICard;


