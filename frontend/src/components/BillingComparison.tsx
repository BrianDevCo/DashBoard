import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  AttachMoney,
  ElectricBolt,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { BillingData, EnergyMetric } from '../services/energyApi';

interface BillingComparisonProps {
  billingData: BillingData[];
  consumptionData: EnergyMetric[];
  variance: number;
  costPerKWh: number;
  period: string;
}

const BillingComparison: React.FC<BillingComparisonProps> = ({
  billingData,
  consumptionData,
  variance,
  costPerKWh,
  period,
}) => {
  if (!billingData || billingData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="body2" color="text.secondary">
          No hay datos de facturación disponibles para mostrar
        </Typography>
      </Box>
    );
  }

  // Calcular totales de facturación
  const totalBilling = billingData.reduce((acc, bill) => ({
    totalCost: acc.totalCost + bill.totalCost,
    totalKWh: acc.totalKWh + bill.totalKWh,
    totalKVarh: acc.totalKVarh + bill.totalKVarh,
    energyCost: acc.energyCost + bill.energyCost,
    reactiveCost: acc.reactiveCost + bill.reactiveCost,
    taxes: acc.taxes + bill.taxes,
  }), {
    totalCost: 0,
    totalKWh: 0,
    totalKVarh: 0,
    energyCost: 0,
    reactiveCost: 0,
    taxes: 0,
  });

  // Calcular totales de consumo
  const totalConsumption = consumptionData.reduce((acc, item) => ({
    totalKWhD: acc.totalKWhD + item.kWhD,
    totalKWhR: acc.totalKWhR + item.kWhR,
    totalKVarhD: acc.totalKVarhD + item.kVarhD,
    totalKVarhR: acc.totalKVarhR + item.kVarhR,
  }), {
    totalKWhD: 0,
    totalKWhR: 0,
    totalKVarhD: 0,
    totalKVarhR: 0,
  });

  // Calcular eficiencia de facturación
  const billingEfficiency = ((totalConsumption.totalKWhD - totalConsumption.totalKWhR) / 
                            totalBilling.totalKWh) * 100;

  // Calcular factor de potencia promedio
  const powerFactor = totalConsumption.totalKWhD / 
    Math.sqrt(totalConsumption.totalKWhD * totalConsumption.totalKWhD + 
              totalConsumption.totalKVarhD * totalConsumption.totalKVarhD);

  // Calcular ahorro potencial
  const potentialSavings = totalBilling.reactiveCost * 0.2; // 20% de ahorro en reactiva

  // Función para obtener el icono de tendencia
  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp color="error" />;
    if (value < -threshold) return <TrendingDown color="success" />;
    return <TrendingFlat color="info" />;
  };

  // Función para obtener el color del chip
  const getChipColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'success';
    if (value >= thresholds.warning) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comparativa Facturación vs Consumos - {period}
      </Typography>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    ${totalBilling.totalCost.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Costo Total Facturado
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(variance, 5)}
                    <Chip
                      label={`${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`}
                      color={getChipColor(variance, { good: -5, warning: 5 })}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {totalConsumption.totalKWhD.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consumo Real (kWh)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs {totalBilling.totalKWh.toFixed(2)} kWh facturado
                  </Typography>
                </Box>
                <ElectricBolt color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {billingEfficiency.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eficiencia de Facturación
                  </Typography>
                  <Box mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={billingEfficiency}
                      color={getChipColor(billingEfficiency, { good: 90, warning: 80 })}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
                <CheckCircle color={getChipColor(billingEfficiency, { good: 90, warning: 80 })} sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    ${costPerKWh.toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Costo por kWh
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Promedio del período
                  </Typography>
                </Box>
                <AttachMoney color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Análisis Detallado */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Desglose de Costos
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Concepto</TableCell>
                      <TableCell align="right">Costo</TableCell>
                      <TableCell align="right">% del Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Energía Activa</TableCell>
                      <TableCell align="right">${totalBilling.energyCost.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {((totalBilling.energyCost / totalBilling.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Energía Reactiva</TableCell>
                      <TableCell align="right">${totalBilling.reactiveCost.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {((totalBilling.reactiveCost / totalBilling.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Impuestos</TableCell>
                      <TableCell align="right">${totalBilling.taxes.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {((totalBilling.taxes / totalBilling.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>${totalBilling.totalCost.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>100%</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Análisis de Calidad Energética
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Factor de Potencia</Typography>
                  <Typography variant="body2" color={powerFactor > 0.9 ? 'success.main' : 'warning.main'}>
                    {powerFactor.toFixed(3)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={powerFactor * 100}
                  color={getChipColor(powerFactor, { good: 0.9, warning: 0.8 })}
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Eficiencia de Facturación</Typography>
                  <Typography variant="body2" color={billingEfficiency > 90 ? 'success.main' : 'warning.main'}>
                    {billingEfficiency.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={billingEfficiency}
                  color={getChipColor(billingEfficiency, { good: 90, warning: 80 })}
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Costo por kWh</Typography>
                  <Typography variant="body2" color="info.main">
                    ${costPerKWh.toFixed(4)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(costPerKWh * 1000, 100)}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  <strong>Recomendaciones:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {powerFactor < 0.8 && '• Instala bancos de capacitores para reducir costos de energía reactiva'}
                  {billingEfficiency < 80 && '• Revisa la calibración de medidores y la precisión de lecturas'}
                  {totalBilling.reactiveCost > totalBilling.energyCost * 0.1 && '• Considera optimizar cargas inductivas para reducir penalizaciones'}
                  {variance > 10 && '• Analiza las causas del incremento en el consumo energético'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Facturación Detallada */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Histórico de Facturación
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Período</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell align="right">kWh Facturado</TableCell>
                  <TableCell align="right">kVarh Facturado</TableCell>
                  <TableCell align="right">Costo Energía</TableCell>
                  <TableCell align="right">Costo Reactiva</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingData.map((bill, index) => (
                  <TableRow key={index}>
                    <TableCell>{bill.period}</TableCell>
                    <TableCell>
                      <Chip label={bill.location} size="small" />
                    </TableCell>
                    <TableCell align="right">{bill.totalKWh.toFixed(2)}</TableCell>
                    <TableCell align="right">{bill.totalKVarh.toFixed(2)}</TableCell>
                    <TableCell align="right">${bill.energyCost.toFixed(2)}</TableCell>
                    <TableCell align="right">${bill.reactiveCost.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary">
                        ${bill.totalCost.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={bill.totalCost > 0 ? 'Pagado' : 'Pendiente'}
                        color={bill.totalCost > 0 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingComparison;


