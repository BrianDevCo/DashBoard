import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from '@mui/material';
import {
  Download,
  Print,
  Settings,
  MoreVert,
  FileDownload,
  PictureAsPdf,
  TableChart,
  Description,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
} from '@mui/icons-material';
import { ExportData, ExportSettings, ExportFormat, DEFAULT_EXPORT_SETTINGS } from '../types/export';
import { ExportService, PrintService } from '../utils/exportUtils';
import ExportSettingsComponent from './ExportSettings';

interface DataExporterProps {
  data: ExportData;
  onExport?: (format: ExportFormat, settings: ExportSettings) => void;
  onPrint?: () => void;
  disabled?: boolean;
  showSettings?: boolean;
  showPrint?: boolean;
  compact?: boolean;
}

const DataExporter: React.FC<DataExporterProps> = ({
  data,
  onExport,
  onPrint,
  disabled = false,
  showSettings = true,
  showPrint = true,
  compact = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [exportSettings, setExportSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportClick = (format: ExportFormat) => {
    setSelectedFormat(format);
    setShowExportDialog(true);
    handleMenuClose();
  };

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Imprimir tabla por defecto
      PrintService.printTable(data, {});
    }
    handleMenuClose();
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('idle');

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      let content: string | ArrayBuffer | Blob;
      let mimeType: string;
      let extension: string;

      switch (selectedFormat) {
        case 'csv':
          content = ExportService.exportToCSV(data, exportSettings);
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'excel':
          content = ExportService.exportToExcel(data, exportSettings);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          extension = 'xlsx';
          break;
        case 'pdf':
          content = ExportService.exportToPDF(data, exportSettings);
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;
        case 'json':
          content = ExportService.exportToJSON(data, exportSettings);
          mimeType = 'application/json';
          extension = 'json';
          break;
        default:
          throw new Error('Formato no soportado');
      }

      // Generar nombre de archivo
      const filename = ExportService.generateFilename(data.title, selectedFormat);

      // Descargar archivo
      ExportService.downloadFile(content, filename, mimeType);

      clearInterval(progressInterval);
      setExportProgress(100);
      setExportStatus('success');

      // Llamar callback si existe
      if (onExport) {
        onExport(selectedFormat, exportSettings);
      }

      // Cerrar diálogo después de un breve delay
      setTimeout(() => {
        setShowExportDialog(false);
        setIsExporting(false);
        setExportProgress(0);
        setExportStatus('idle');
      }, 1500);

    } catch (error) {
      console.error('Error al exportar:', error);
      setExportStatus('error');
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <TableChart />;
      case 'excel':
        return <FileDownload />;
      case 'pdf':
        return <PictureAsPdf />;
      case 'json':
        return <Description />;
      default:
        return <FileDownload />;
    }
  };

  const getFormatLabel = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return 'CSV';
      case 'excel':
        return 'Excel';
      case 'pdf':
        return 'PDF';
      case 'json':
        return 'JSON';
      default:
        return (format as string).toUpperCase();
    }
  };

  const getFormatDescription = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return 'Archivo de valores separados por comas';
      case 'excel':
        return 'Archivo de Microsoft Excel';
      case 'pdf':
        return 'Documento PDF con formato';
      case 'json':
        return 'Archivo JSON estructurado';
      default:
        return '';
    }
  };

  if (compact) {
    return (
      <Box display="flex" gap={1}>
        <IconButton
          onClick={handleMenuOpen}
          disabled={disabled}
          size="small"
        >
          <MoreVert />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleExportClick('csv')}>
            <ListItemIcon><TableChart /></ListItemIcon>
            <ListItemText>Exportar CSV</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleExportClick('excel')}>
            <ListItemIcon><FileDownload /></ListItemIcon>
            <ListItemText>Exportar Excel</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleExportClick('pdf')}>
            <ListItemIcon><PictureAsPdf /></ListItemIcon>
            <ListItemText>Exportar PDF</ListItemText>
          </MenuItem>
          {showPrint && (
            <MenuItem onClick={handlePrintClick}>
              <ListItemIcon><Print /></ListItemIcon>
              <ListItemText>Imprimir</ListItemText>
            </MenuItem>
          )}
          {showSettings && (
            <MenuItem onClick={() => setShowSettingsDialog(true)}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText>Configuración</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" gap={1} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleMenuOpen}
          disabled={disabled}
        >
          Exportar
        </Button>
        
        {showPrint && (
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrintClick}
            disabled={disabled}
          >
            Imprimir
          </Button>
        )}
        
        {showSettings && (
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setShowSettingsDialog(true)}
            disabled={disabled}
          >
            Configuración
          </Button>
        )}
      </Box>

      {/* Menu de exportación */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleExportClick('csv')}>
          <ListItemIcon><TableChart /></ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportClick('excel')}>
          <ListItemIcon><FileDownload /></ListItemIcon>
          <ListItemText>Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportClick('pdf')}>
          <ListItemIcon><PictureAsPdf /></ListItemIcon>
          <ListItemText>PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportClick('json')}>
          <ListItemIcon><Description /></ListItemIcon>
          <ListItemText>JSON</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog de exportación */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Exportar Datos</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {data.description}
            </Typography>
            <Box display="flex" gap={1} mt={1}>
              <Chip label={`${data.data.length} registros`} size="small" />
              <Chip label={`${data.columns.length} columnas`} size="small" />
            </Box>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Formato de Exportación</InputLabel>
            <Select
              value={selectedFormat}
              label="Formato de Exportación"
              onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
            >
              <MenuItem value="csv">
                <Box display="flex" alignItems="center" gap={1}>
                  <TableChart />
                  <Box>
                    <Typography>CSV</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Archivo de valores separados por comas
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="excel">
                <Box display="flex" alignItems="center" gap={1}>
                  <FileDownload />
                  <Box>
                    <Typography>Excel</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Archivo de Microsoft Excel
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="pdf">
                <Box display="flex" alignItems="center" gap={1}>
                  <PictureAsPdf />
                  <Box>
                    <Typography>PDF</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Documento PDF con formato
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="json">
                <Box display="flex" alignItems="center" gap={1}>
                  <Description />
                  <Box>
                    <Typography>JSON</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Archivo JSON estructurado
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Opciones de exportación */}
          <Typography variant="subtitle2" gutterBottom>
            Opciones de Exportación
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportSettings.includeHeaders}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    includeHeaders: e.target.checked
                  }))}
                />
              }
              label="Incluir encabezados"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportSettings.includeMetadata}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    includeMetadata: e.target.checked
                  }))}
                />
              }
              label="Incluir metadatos"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportSettings.includeSummary}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    includeSummary: e.target.checked
                  }))}
                />
              }
              label="Incluir resumen"
            />
          </FormGroup>

          {/* Progreso de exportación */}
          {isExporting && (
            <Box sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Schedule fontSize="small" />
                <Typography variant="body2">
                  {exportStatus === 'success' ? 'Exportación completada' : 'Exportando...'}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={exportProgress} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {exportProgress}% completado
              </Typography>
            </Box>
          )}

          {/* Estado de exportación */}
          {exportStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle />
                <Typography variant="body2">
                  Archivo exportado exitosamente
                </Typography>
              </Box>
            </Alert>
          )}

          {exportStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <ErrorIcon />
                <Typography variant="body2">
                  Error al exportar el archivo
                </Typography>
              </Box>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            startIcon={<Download />}
            disabled={isExporting}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de configuración */}
      <ExportSettingsComponent
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        onSave={setExportSettings}
        currentSettings={exportSettings}
      />
    </Box>
  );
};

export default DataExporter;

