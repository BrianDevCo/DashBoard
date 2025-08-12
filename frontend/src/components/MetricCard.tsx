import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down';
  trendValue: number;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  color,
}) => {
  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toFixed(1);
  };

  const formatTrendValue = (val: number) => {
    const absVal = Math.abs(val);
    return `${val >= 0 ? '+' : '-'}${absVal.toFixed(1)}%`;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        <Box display="flex" alignItems="baseline" mb={1}>
          <Typography variant="h4" component="span" color={color}>
            {formatValue(value)}
          </Typography>
          <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
            {unit}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Chip
            icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={formatTrendValue(trendValue)}
            color={trend === 'up' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
          
          <Typography variant="caption" color="text.secondary">
            vs período anterior
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

