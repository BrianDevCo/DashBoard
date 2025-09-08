import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { EnergyMetric } from '../services/energyApi';

interface EnergyMatrixProps {
  data: EnergyMetric[];
  showActiveEnergy?: boolean;
  showReactiveEnergy?: boolean;
  title?: string;
}

const EnergyMatrix: React.FC<EnergyMatrixProps> = ({
  data,
  showActiveEnergy = true,
  showReactiveEnergy = true,
  title = "Matriz de Consumos Energéticos"
}) => {
  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="body2" color="text.secondary">
          No hay datos disponibles para mostrar
        </Typography>
      </Box>
    );
  }

  // Calcular totales
  const totals = data.reduce((acc, item) => ({
    totalKWhD: acc.totalKWhD + item.kWhD,
    totalKWhR: acc.totalKWhR + item.kWhR,
    totalKVarhD: acc.totalKVarhD + item.kVarhD,
    totalKVarhR: acc.totalKVarhR + item.kVarhR,
    totalKVarhPenalized: acc.totalKVarhPenalized + item.kVarhPenalized,
  }), {
    totalKWhD: 0,
    totalKWhR: 0,
    totalKVarhD: 0,
    totalKVarhR: 0,
    totalKVarhPenalized: 0,
  });

  // Calcular promedios
  const averages = {
    avgKWhD: totals.totalKWhD / data.length,
    avgKWhR: totals.totalKWhR / data.length,
    avgKVarhD: totals.totalKVarhD / data.length,
    avgKVarhR: totals.totalKVarhR / data.length,
    avgKVarhPenalized: totals.totalKVarhPenalized / data.length,
  };

  // Calcular máximos y mínimos
  const maxMin = data.reduce((acc, item) => ({
    maxKWhD: Math.max(acc.maxKWhD, item.kWhD),
    minKWhD: Math.min(acc.minKWhD, item.kWhD),
    maxKWhR: Math.max(acc.maxKWhR, item.kWhR),
    minKWhR: Math.min(acc.minKWhR, item.kWhR),
    maxKVarhD: Math.max(acc.maxKVarhD, item.kVarhD),
    minKVarhD: Math.min(acc.minKVarhD, item.kVarhD),
    maxKVarhR: Math.max(acc.maxKVarhR, item.kVarhR),
    minKVarhR: Math.min(acc.minKVarhR, item.kVarhR),
    maxKVarhPenalized: Math.max(acc.maxKVarhPenalized, item.kVarhPenalized),
    minKVarhPenalized: Math.min(acc.minKVarhPenalized, item.kVarhPenalized),
  }), {
    maxKWhD: 0, minKWhD: Infinity,
    maxKWhR: 0, minKWhR: Infinity,
    maxKVarhD: 0, minKVarhD: Infinity,
    maxKVarhR: 0, minKVarhR: Infinity,
    maxKVarhPenalized: 0, minKVarhPenalized: Infinity,
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Resumen de Totales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {showActiveEnergy && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {totals.totalKWhD.toFixed(2)} kWh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energía Activa Importada
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    {totals.totalKWhR.toFixed(2)} kWh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energía Activa Exportada
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        {showReactiveEnergy && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    {totals.totalKVarhD.toFixed(2)} kVarh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energía Reactiva Capacitiva
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="error.main">
                    {totals.totalKVarhR.toFixed(2)} kVarh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energía Reactiva Inductiva
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Tabla de Datos Detallados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Ubicación</TableCell>
              {showActiveEnergy && (
                <>
                  <TableCell align="right">kWh Importada</TableCell>
                  <TableCell align="right">kWh Exportada</TableCell>
                </>
              )}
              {showReactiveEnergy && (
                <>
                  <TableCell align="right">kVarh Capacitiva</TableCell>
                  <TableCell align="right">kVarh Inductiva</TableCell>
                  <TableCell align="right">kVarh Penalizada</TableCell>
                </>
              )}
              <TableCell align="right">Factor de Potencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              const powerFactor = item.kWhD / Math.sqrt(item.kWhD * item.kWhD + item.kVarhD * item.kVarhD);
              return (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={item.location} size="small" />
                  </TableCell>
                  {showActiveEnergy && (
                    <>
                      <TableCell align="right">
                        <Typography variant="body2" color="primary">
                          {item.kWhD.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main">
                          {item.kWhR.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </>
                  )}
                  {showReactiveEnergy && (
                    <>
                      <TableCell align="right">
                        <Typography variant="body2" color="warning.main">
                          {item.kVarhD.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="error.main">
                          {item.kVarhR.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="secondary">
                          {item.kVarhPenalized.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </>
                  )}
                  <TableCell align="right">
                    <Chip 
                      label={powerFactor.toFixed(3)} 
                      color={powerFactor > 0.9 ? 'success' : powerFactor > 0.8 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Estadísticas Adicionales */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Estadísticas del Período
        </Typography>
        <Grid container spacing={2}>
          {showActiveEnergy && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Energía Activa Importada
                    </Typography>
                    <Typography variant="body2">
                      Promedio: {averages.avgKWhD.toFixed(2)} kWh
                    </Typography>
                    <Typography variant="body2">
                      Máximo: {maxMin.maxKWhD.toFixed(2)} kWh
                    </Typography>
                    <Typography variant="body2">
                      Mínimo: {maxMin.minKWhD.toFixed(2)} kWh
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Energía Activa Exportada
                    </Typography>
                    <Typography variant="body2">
                      Promedio: {averages.avgKWhR.toFixed(2)} kWh
                    </Typography>
                    <Typography variant="body2">
                      Máximo: {maxMin.maxKWhR.toFixed(2)} kWh
                    </Typography>
                    <Typography variant="body2">
                      Mínimo: {maxMin.minKWhR.toFixed(2)} kWh
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          {showReactiveEnergy && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Energía Reactiva Capacitiva
                    </Typography>
                    <Typography variant="body2">
                      Promedio: {averages.avgKVarhD.toFixed(2)} kVarh
                    </Typography>
                    <Typography variant="body2">
                      Máximo: {maxMin.maxKVarhD.toFixed(2)} kVarh
                    </Typography>
                    <Typography variant="body2">
                      Mínimo: {maxMin.minKVarhD.toFixed(2)} kVarh
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default EnergyMatrix;

