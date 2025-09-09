import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  InputAdornment,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  Settings,
  Palette,
  ViewModule,
  Description,
  Notifications,
  Security,
  Accessibility,
  Save,
  Cancel,
  Edit,
  Delete,
  Add,
  Share,
  Download,
  Upload,
  Refresh,
  Help,
  Info,
  Warning,
  CheckCircle,
  Error,
  ExpandMore,
  ExpandLess,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder,
  MoreVert,
  AccountCircle,
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  Language,
  Schedule,
  AttachMoney,
  FormatListNumbered,
  Brightness4,
  Brightness7,
  Contrast,
  TextFields,
  LineWeight,
  TextFormat,
  ColorLens,
  Palette as PaletteIcon,
  ViewQuilt,
  Dashboard,
  Assessment,
  Search,
  Warning as WarningIcon,
  Shield,
  Accessibility as AccessibilityIcon,
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  Timer,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Sms,
  Notifications as NotificationsIcon,
  PushPin,
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  ThumbUpOutlined,
  ThumbDownOutlined,
  Reply,
  ReplyAll,
  Forward,
  Send,
  Archive,
  Unarchive,
  Delete as DeleteIcon,
  Restore,
  Undo,
  Redo,
  ContentCopy,
  ContentCut,
  ContentPaste,
  FindInPage,
  FindReplace,
  FilterList,
  Sort,
  ViewList,
  ViewModule as ViewModuleIcon,
  ViewComfy,
  ViewStream,
  ViewColumn,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  ViewCarousel,
  ViewQuilt as ViewQuiltIcon,
  ViewSidebar,
  ViewHeadline,
  ViewArray,
  ViewTimeline,
  ViewKanban,
  ViewInAr,
  ViewCompact,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setProfile,
  updateProfile,
  setNotifications,
  updateNotifications,
  setPreferences,
  updatePreferences,
  setDashboard,
  updateDashboard,
  setReports,
  updateReports,
  setSearch,
  updateSearch,
  setAlerts,
  updateAlerts,
  setPrivacy,
  updatePrivacy,
  setAccessibility,
  updateAccessibility,
  setActiveTab,
  setShowProfile,
  setShowSettings,
  setShowThemes,
  setShowLayouts,
  setShowTemplates,
  setShowNotifications,
  setShowPrivacy,
  setShowAccessibility,
  setLoading,
  setError,
  clearErrors,
} from '../store/slices/userConfigSlice';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetDashboardQuery,
  useUpdateDashboardMutation,
  useGetReportsQuery,
  useUpdateReportsMutation,
  useGetSearchQuery,
  useUpdateSearchMutation,
  useGetAlertsQuery,
  useUpdateAlertsMutation,
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
  useGetAccessibilityQuery,
  useUpdateAccessibilityMutation,
} from '../services/userConfigApi';
import { 
  SUPPORTED_LANGUAGES, 
  SUPPORTED_TIMEZONES, 
  DATE_FORMATS, 
  TIME_FORMATS, 
  SUPPORTED_CURRENCIES, 
  NUMBER_FORMATS, 
  THEME_OPTIONS, 
  DENSITY_OPTIONS, 
  FONT_SIZE_OPTIONS,
  USER_CONFIG_UTILS 
} from '../types/userConfig';

const UserConfig: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    profile,
    notifications,
    preferences,
    dashboard,
    reports,
    search,
    alerts,
    privacy,
    accessibility,
    activeTab,
    showProfile,
    showSettings,
    showThemes,
    showLayouts,
    showTemplates,
    showNotifications,
    showPrivacy,
    showAccessibility,
    loading,
    error
  } = useSelector((state: RootState) => state.userConfig);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [editedNotifications, setEditedNotifications] = useState(notifications);
  const [editedPreferences, setEditedPreferences] = useState(preferences);
  const [editedDashboard, setEditedDashboard] = useState(dashboard);
  const [editedReports, setEditedReports] = useState(reports);
  const [editedSearch, setEditedSearch] = useState(search);
  const [editedAlerts, setEditedAlerts] = useState(alerts);
  const [editedPrivacy, setEditedPrivacy] = useState(privacy);
  const [editedAccessibility, setEditedAccessibility] = useState(accessibility);

  // Queries
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery('current-user');
  const { data: notificationsData, refetch: refetchNotifications } = useGetNotificationsQuery('current-user');
  const { data: preferencesData, refetch: refetchPreferences } = useGetPreferencesQuery('current-user');
  const { data: dashboardData, refetch: refetchDashboard } = useGetDashboardQuery('current-user');
  const { data: reportsData, refetch: refetchReports } = useGetReportsQuery('current-user');
  const { data: searchData, refetch: refetchSearch } = useGetSearchQuery('current-user');
  const { data: alertsData, refetch: refetchAlerts } = useGetAlertsQuery('current-user');
  const { data: privacyData, refetch: refetchPrivacy } = useGetPrivacyQuery('current-user');
  const { data: accessibilityData, refetch: refetchAccessibility } = useGetAccessibilityQuery('current-user');

  // Mutations
  const [updateProfile] = useUpdateProfileMutation();
  const [updateNotifications] = useUpdateNotificationsMutation();
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [updateDashboard] = useUpdateDashboardMutation();
  const [updateReports] = useUpdateReportsMutation();
  const [updateSearch] = useUpdateSearchMutation();
  const [updateAlerts] = useUpdateAlertsMutation();
  const [updatePrivacy] = useUpdatePrivacyMutation();
  const [updateAccessibility] = useUpdateAccessibilityMutation();

  // Sincronizar datos con el store
  // Sincronizar datos con el store (solo una vez al montar)
  useEffect(() => {
    if (profileData) {
      dispatch(setProfile(profileData));
      setEditedProfile(profileData);
    }
    if (notificationsData) {
      dispatch(setNotifications(notificationsData));
      setEditedNotifications(notificationsData);
    }
    if (preferencesData) {
      dispatch(setPreferences(preferencesData));
      setEditedPreferences(preferencesData);
    }
    if (dashboardData) {
      dispatch(setDashboard(dashboardData));
      setEditedDashboard(dashboardData);
    }
    if (reportsData) {
      dispatch(setReports(reportsData));
      setEditedReports(reportsData);
    }
    if (searchData) {
      dispatch(setSearch(searchData));
      setEditedSearch(searchData);
    }
    if (alertsData) {
      dispatch(setAlerts(alertsData));
      setEditedAlerts(alertsData);
    }
    if (privacyData) {
      dispatch(setPrivacy(privacyData));
      setEditedPrivacy(privacyData);
    }
    if (accessibilityData) {
      dispatch(setAccessibility(accessibilityData));
      setEditedAccessibility(accessibilityData);
    }
  }, [dispatch]);

  const handleSave = async () => {
    try {
      if (editedProfile) {
        await updateProfile({ userId: 'current-user', profile: editedProfile }).unwrap();
      }
      await updateNotifications({ userId: 'current-user', notifications: editedNotifications }).unwrap();
      await updatePreferences({ userId: 'current-user', preferences: editedPreferences }).unwrap();
      await updateDashboard({ userId: 'current-user', dashboard: editedDashboard }).unwrap();
      await updateReports({ userId: 'current-user', reports: editedReports }).unwrap();
      await updateSearch({ userId: 'current-user', search: editedSearch }).unwrap();
      await updateAlerts({ userId: 'current-user', alerts: editedAlerts }).unwrap();
      await updatePrivacy({ userId: 'current-user', privacy: editedPrivacy }).unwrap();
      await updateAccessibility({ userId: 'current-user', accessibility: editedAccessibility }).unwrap();
      
      setSnackbar({ open: true, message: 'Configuración guardada exitosamente' });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar la configuración' });
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditedNotifications(notifications);
    setEditedPreferences(preferences);
    setEditedDashboard(dashboard);
    setEditedReports(reports);
    setEditedSearch(search);
    setEditedAlerts(alerts);
    setEditedPrivacy(privacy);
    setEditedAccessibility(accessibility);
    setIsEditing(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(newValue));
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Información Personal" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={editedProfile?.avatar}
                    sx={{ width: 80, height: 80 }}
                  >
                    {editedProfile?.firstName?.[0]}{editedProfile?.lastName?.[0]}
                  </Avatar>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => {}}
                  >
                    Cambiar Foto
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={editedProfile?.firstName || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={editedProfile?.lastName || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editedProfile?.email || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={editedProfile?.phone || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departamento"
                  value={editedProfile?.department || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, department: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biografía"
                  multiline
                  rows={3}
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Configuración Regional" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    value={editedProfile?.language || 'es'}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, language: e.target.value } : null)}
                    disabled={!isEditing}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{lang.flag}</span>
                          {lang.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Zona Horaria</InputLabel>
                  <Select
                    value={editedProfile?.timezone || 'America/Bogota'}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                    disabled={!isEditing}
                  >
                    {SUPPORTED_TIMEZONES.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Formato de Fecha</InputLabel>
                  <Select
                    value={editedProfile?.dateFormat || 'DD/MM/YYYY'}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, dateFormat: e.target.value } : null)}
                    disabled={!isEditing}
                  >
                    {DATE_FORMATS.map((format) => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.label} ({format.example})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Formato de Hora</InputLabel>
                  <Select
                    value={editedProfile?.timeFormat || '24h'}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, timeFormat: e.target.value as '12h' | '24h' } : null)}
                    disabled={!isEditing}
                  >
                    {TIME_FORMATS.map((format) => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.label} ({format.example})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Moneda</InputLabel>
                  <Select
                    value={editedProfile?.currency || 'COP'}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, currency: e.target.value } : null)}
                    disabled={!isEditing}
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{currency.flag}</span>
                          {currency.name} ({currency.symbol})
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Formato Numérico</InputLabel>
                  <Select
                    value={editedProfile?.numberFormat || '1.234,56'}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, numberFormat: e.target.value } : null)}
                    disabled={!isEditing}
                  >
                    {NUMBER_FORMATS.map((format) => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.label} ({format.example})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPreferencesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Dashboard" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Vista por Defecto</InputLabel>
                  <Select
                    value={editedPreferences.dashboard.defaultView}
                    onChange={(e) => setEditedPreferences(prev => ({
                      ...prev,
                      dashboard: { ...prev.dashboard, defaultView: e.target.value as any }
                    }))}
                    disabled={!isEditing}
                  >
                    <MenuItem value="executive">Ejecutivo</MenuItem>
                    <MenuItem value="technical">Técnico</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Layout</InputLabel>
                  <Select
                    value={editedPreferences.dashboard.layout}
                    onChange={(e) => setEditedPreferences(prev => ({
                      ...prev,
                      dashboard: { ...prev.dashboard, layout: e.target.value as any }
                    }))}
                    disabled={!isEditing}
                  >
                    <MenuItem value="grid">Cuadrícula</MenuItem>
                    <MenuItem value="list">Lista</MenuItem>
                    <MenuItem value="compact">Compacto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tamaño de Widget</InputLabel>
                  <Select
                    value={editedPreferences.dashboard.widgetSize}
                    onChange={(e) => setEditedPreferences(prev => ({
                      ...prev,
                      dashboard: { ...prev.dashboard, widgetSize: e.target.value as any }
                    }))}
                    disabled={!isEditing}
                  >
                    <MenuItem value="small">Pequeño</MenuItem>
                    <MenuItem value="medium">Mediano</MenuItem>
                    <MenuItem value="large">Grande</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedPreferences.dashboard.autoRefresh}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        dashboard: { ...prev.dashboard, autoRefresh: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Actualización Automática"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Intervalo de Actualización (segundos)"
                  type="number"
                  value={editedPreferences.dashboard.refreshInterval / 1000}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    dashboard: { ...prev.dashboard, refreshInterval: parseInt(e.target.value) * 1000 }
                  }))}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Navegación" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedPreferences.navigation.sidebarCollapsed}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        navigation: { ...prev.navigation, sidebarCollapsed: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Barra Lateral Colapsada"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedPreferences.navigation.showBreadcrumbs}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        navigation: { ...prev.navigation, showBreadcrumbs: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Mostrar Migas de Pan"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedPreferences.navigation.showQuickActions}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        navigation: { ...prev.navigation, showQuickActions: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Mostrar Acciones Rápidas"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedPreferences.navigation.showRecentItems}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        navigation: { ...prev.navigation, showRecentItems: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Mostrar Elementos Recientes"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedPreferences.navigation.showFavorites}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        navigation: { ...prev.navigation, showFavorites: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Mostrar Favoritos"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNotificationsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Email" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedNotifications.email.enabled}
                      onChange={(e) => setEditedNotifications(prev => ({
                        ...prev,
                        email: { ...prev.email, enabled: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Habilitar Notificaciones por Email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Frecuencia</InputLabel>
                  <Select
                    value={editedNotifications.email.frequency}
                    onChange={(e) => setEditedNotifications(prev => ({
                      ...prev,
                      email: { ...prev.email, frequency: e.target.value as any }
                    }))}
                    disabled={!isEditing}
                  >
                    <MenuItem value="immediate">Inmediato</MenuItem>
                    <MenuItem value="daily">Diario</MenuItem>
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="never">Nunca</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Push" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedNotifications.push.enabled}
                      onChange={(e) => setEditedNotifications(prev => ({
                        ...prev,
                        push: { ...prev.push, enabled: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Habilitar Notificaciones Push"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAccessibilityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Visual" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedAccessibility.visual.highContrast}
                      onChange={(e) => setEditedAccessibility(prev => ({
                        ...prev,
                        visual: { ...prev.visual, highContrast: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Alto Contraste"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedAccessibility.visual.colorBlind}
                      onChange={(e) => setEditedAccessibility(prev => ({
                        ...prev,
                        visual: { ...prev.visual, colorBlind: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Modo Daltónico"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tamaño de Fuente</InputLabel>
                  <Select
                    value={editedAccessibility.visual.fontSize}
                    onChange={(e) => setEditedAccessibility(prev => ({
                      ...prev,
                      visual: { ...prev.visual, fontSize: e.target.value as any }
                    }))}
                    disabled={!isEditing}
                  >
                    {FONT_SIZE_OPTIONS.map((size) => (
                      <MenuItem key={size.value} value={size.value}>
                        {size.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Motor" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedAccessibility.motor.largeTargets}
                      onChange={(e) => setEditedAccessibility(prev => ({
                        ...prev,
                        motor: { ...prev.motor, largeTargets: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Objetivos Grandes"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedAccessibility.motor.keyboardNavigation}
                      onChange={(e) => setEditedAccessibility(prev => ({
                        ...prev,
                        motor: { ...prev.motor, keyboardNavigation: e.target.checked }
                      }))}
                      disabled={!isEditing}
                    />
                  }
                  label="Navegación por Teclado"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración de Usuario
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Perfil" icon={<Person />} />
          <Tab label="Preferencias" icon={<Settings />} />
          <Tab label="Notificaciones" icon={<Notifications />} />
          <Tab label="Accesibilidad" icon={<Accessibility />} />
        </Tabs>
        <Box display="flex" gap={1}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading.profile || loading.preferences || loading.notifications || loading.accessibility}
              >
                Guardar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </>
          )}
        </Box>
      </Box>

      {activeTab === 0 && renderProfileTab()}
      {activeTab === 1 && renderPreferencesTab()}
      {activeTab === 2 && renderNotificationsTab()}
      {activeTab === 3 && renderAccessibilityTab()}

      {/* Snackbar para notificaciones */}
      {snackbar.open && (
        <Alert
          severity="success"
          onClose={() => setSnackbar({ open: false, message: '' })}
          sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default UserConfig;
