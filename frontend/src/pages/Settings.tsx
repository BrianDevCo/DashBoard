import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  DisplaySettings as DisplayIcon,
  Storage as DatabaseIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Configuración de notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  
  // Configuración de visualización
  const [defaultTheme, setDefaultTheme] = useState('light');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [chartAnimation, setChartAnimation] = useState(true);
  
  // Configuración de base de datos
  const [dbConnectionString, setDbConnectionString] = useState('oracle://user:pass@host:port/service');
  const [dbPoolSize, setDbPoolSize] = useState(10);
  const [dbTimeout, setDbTimeout] = useState(30);
  const [dbRetryAttempts, setDbRetryAttempts] = useState(3);
  
  // Configuración de seguridad
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar la configuración
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para probar la conexión a Oracle
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      alert('Conexión exitosa a la base de datos Oracle');
    } catch (error) {
      alert('Error de conexión: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración del Sistema
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Configuración de Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Configuración de Notificaciones
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label="Notificaciones por Email"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                }
                label="Notificaciones Push"
              />
              
              <TextField
                fullWidth
                label="Umbral de Alerta (%)"
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                sx={{ mt: 2 }}
                inputProps={{ min: 0, max: 100 }}
              />
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Frecuencia de Notificaciones</InputLabel>
                <Select
                  value={notificationFrequency}
                  label="Frecuencia de Notificaciones"
                  onChange={(e) => setNotificationFrequency(e.target.value)}
                >
                  <MenuItem value="immediate">Inmediata</MenuItem>
                  <MenuItem value="hourly">Por Hora</MenuItem>
                  <MenuItem value="daily">Diaria</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Visualización */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DisplayIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Configuración de Visualización
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tema Predeterminado</InputLabel>
                <Select
                  value={defaultTheme}
                  label="Tema Predeterminado"
                  onChange={(e) => setDefaultTheme(e.target.value)}
                >
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Oscuro</MenuItem>
                  <MenuItem value="auto">Automático</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                }
                label="Actualización Automática"
              />
              
              <TextField
                fullWidth
                label="Intervalo de Actualización (segundos)"
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                sx={{ mt: 2 }}
                inputProps={{ min: 10, max: 300 }}
                disabled={!autoRefresh}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={chartAnimation}
                    onChange={(e) => setChartAnimation(e.target.checked)}
                  />
                }
                label="Animaciones en Gráficos"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Base de Datos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DatabaseIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Configuración de Base de Datos Oracle
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cadena de Conexión"
                    value={dbConnectionString}
                    onChange={(e) => setDbConnectionString(e.target.value)}
                    helperText="Formato: oracle://user:pass@host:port/service"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleTestConnection}
                    disabled={isLoading}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Probar Conexión
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Tamaño del Pool"
                    type="number"
                    value={dbPoolSize}
                    onChange={(e) => setDbPoolSize(Number(e.target.value))}
                    inputProps={{ min: 1, max: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Timeout (segundos)"
                    type="number"
                    value={dbTimeout}
                    onChange={(e) => setDbTimeout(Number(e.target.value))}
                    inputProps={{ min: 5, max: 300 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Intentos de Reconexión"
                    type="number"
                    value={dbRetryAttempts}
                    onChange={(e) => setDbRetryAttempts(Number(e.target.value))}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" height="100%">
                    <Chip label="Estado: Conectado" color="success" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Seguridad */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Configuración de Seguridad
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Timeout de Sesión (minutos)"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    inputProps={{ min: 5, max: 480 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Máx. Intentos de Login"
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                    inputProps={{ min: 3, max: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Expiración de Contraseña (días)"
                    type="number"
                    value={passwordExpiry}
                    onChange={(e) => setPasswordExpiry(Number(e.target.value))}
                    inputProps={{ min: 30, max: 365 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      />
                    }
                    label="Autenticación de Dos Factores"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Botones de Acción */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Restaurar Valores por Defecto
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Guardar Configuración'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;

