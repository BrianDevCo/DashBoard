import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

export type TimeInterval = '15min' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'custom';

interface TimeIntervalSelectorProps {
  selectedInterval: TimeInterval;
  onIntervalChange: (interval: TimeInterval) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onStartDateChange?: (date: Date | null) => void;
  onEndDateChange?: (date: Date | null) => void;
  showCustomRange?: boolean;
}

const TimeIntervalSelector: React.FC<TimeIntervalSelectorProps> = ({
  selectedInterval,
  onIntervalChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showCustomRange = true,
}) => {
  const intervalOptions = [
    { value: '15min', label: 'Últimos 15 minutos', description: 'Datos en tiempo real' },
    { value: 'hour', label: 'Última hora', description: 'Datos por minuto' },
    { value: 'day', label: 'Último día', description: 'Datos por hora' },
    { value: 'week', label: 'Última semana', description: 'Datos por día' },
    { value: 'month', label: 'Último mes', description: 'Datos por día' },
    { value: 'year', label: 'Último año', description: 'Datos por mes' },
    ...(showCustomRange ? [{ value: 'custom', label: 'Rango personalizado', description: 'Selecciona fechas específicas' }] : []),
  ];

  const getIntervalDescription = (interval: TimeInterval) => {
    const option = intervalOptions.find(opt => opt.value === interval);
    return option?.description || '';
  };

  const getIntervalChipColor = (interval: TimeInterval) => {
    switch (interval) {
      case '15min':
        return 'success';
      case 'hour':
        return 'primary';
      case 'day':
        return 'secondary';
      case 'week':
        return 'warning';
      case 'month':
        return 'info';
      case 'year':
        return 'default';
      case 'custom':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Selección de Período
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Intervalo de Tiempo</InputLabel>
                <Select
                  value={selectedInterval}
                  label="Intervalo de Tiempo"
                  onChange={(e) => onIntervalChange(e.target.value as TimeInterval)}
                >
                  {intervalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Período seleccionado:
                </Typography>
                <Chip
                  label={intervalOptions.find(opt => opt.value === selectedInterval)?.label}
                  color={getIntervalChipColor(selectedInterval)}
                  size="small"
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {getIntervalDescription(selectedInterval)}
              </Typography>
            </Grid>

            {selectedInterval === 'custom' && showCustomRange && (
              <>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha de Inicio"
                    value={startDate}
                    onChange={(value) => onStartDateChange?.(value as Date | null)}
                    maxDate={endDate || new Date()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha de Fin"
                    value={endDate}
                    onChange={(value) => onEndDateChange?.(value as Date | null)}
                    minDate={startDate || undefined}
                    maxDate={new Date()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
              </>
            )}

            {selectedInterval !== 'custom' && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Nota:</strong> Los datos se actualizarán automáticamente según el intervalo seleccionado.
                    {selectedInterval === '15min' && ' Los datos se refrescan cada 30 segundos.'}
                    {selectedInterval === 'hour' && ' Los datos se refrescan cada 5 minutos.'}
                    {selectedInterval === 'day' && ' Los datos se refrescan cada hora.'}
                    {selectedInterval === 'week' && ' Los datos se refrescan cada 6 horas.'}
                    {selectedInterval === 'month' && ' Los datos se refrescan diariamente.'}
                    {selectedInterval === 'year' && ' Los datos se refrescan semanalmente.'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default TimeIntervalSelector;

