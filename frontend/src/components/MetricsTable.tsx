import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { EnergyMetric } from '../services/energyApi';

interface MetricsTableProps {
  data: EnergyMetric[];
}

const MetricsTable: React.FC<MetricsTableProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(2)} ${unit}`;
  };

  const getObisCodeInfo = (obisCode: string) => {
    const obisInfo: Record<string, { description: string; unit: string }> = {
      '1.8.0': { description: 'Energía Activa Total', unit: 'kWh' },
      '1.8.1': { description: 'Energía Activa Tarifa 1', unit: 'kWh' },
      '1.8.2': { description: 'Energía Activa Tarifa 2', unit: 'kWh' },
      '2.8.0': { description: 'Energía Reactiva Total', unit: 'kVarh' },
      '2.8.1': { description: 'Energía Reactiva Tarifa 1', unit: 'kVarh' },
      '2.8.2': { description: 'Energía Reactiva Tarifa 2', unit: 'kVarh' },
    };
    
    return obisInfo[obisCode] || { description: obisCode, unit: 'N/A' };
  };

  const getStatusColor = (kVarhPenalized: number) => {
    if (kVarhPenalized === 0) return 'success';
    if (kVarhPenalized < 100) return 'warning';
    return 'error';
  };

  const getStatusText = (kVarhPenalized: number) => {
    if (kVarhPenalized === 0) return 'Normal';
    if (kVarhPenalized < 100) return 'Advertencia';
    return 'Crítico';
  };

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Timestamp
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Medidor
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Ubicación
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Código OBIS
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold">
                  Energía Activa Importada
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold">
                  Energía Reactiva Importada
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold">
                  Energía Activa Exportada
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold">
                  Energía Reactiva Exportada
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold">
                  Energía Reactiva Penalizada
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight="bold">
                  Estado
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const obisInfo = getObisCodeInfo(row.obisCode);
                const statusColor = getStatusColor(row.kVarhPenalized);
                const statusText = getStatusText(row.kVarhPenalized);
                
                return (
                  <TableRow
                    key={row.id || index}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(row.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {row.meterId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {row.obisCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {obisInfo.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary">
                        {formatValue(row.kWhD, 'kWh')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="secondary">
                        {formatValue(row.kVarhD, 'kVarh')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success">
                        {formatValue(row.kWhR, 'kWh')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="info">
                        {formatValue(row.kVarhR, 'kVarh')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="warning">
                        {formatValue(row.kVarhPenalized, 'kVarh')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={statusText}
                        color={statusColor as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Paper>
  );
};

export default MetricsTable;

