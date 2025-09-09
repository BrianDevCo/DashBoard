import React, { useState, Fragment } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShowChart as ChartIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Widgets as WidgetsIcon,
  Warning as WarningIcon,
  Download as DownloadIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Compare as CompareIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import { useAuth } from '../hooks/useAuth';
import HeaderSearch from './HeaderSearch';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen, theme: appTheme } = useSelector((state: RootState) => state.ui);
  const { user, logout } = useAuth();
  
  // Estados para notificaciones
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  
  // Datos mock de notificaciones
  const notifications = [
    { id: 1, title: 'Pico de demanda excedido', message: 'Planta Norte - 4,850 kW', time: 'Hace 5 min', type: 'warning', read: false },
    { id: 2, title: 'Factor de potencia bajo', message: 'Centro de Datos - 0.82', time: 'Hace 15 min', type: 'error', read: false },
    { id: 3, title: 'Mantenimiento completado', message: 'Sistema UPS actualizado', time: 'Hace 1 hora', type: 'success', read: true },
    { id: 4, title: 'Nueva alerta crítica', message: 'Sobrecarga transformador', time: 'Hace 2 horas', type: 'error', read: false },
    { id: 5, title: 'Meta de eficiencia alcanzada', message: '87.5% - Objetivo superado', time: 'Hace 3 horas', type: 'success', read: true }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { text: 'Dashboard Ejecutivo', icon: <DashboardIcon />, path: '/' },
    { text: 'Dashboard Técnico', icon: <ChartIcon />, path: '/dashboard' },
    { text: 'Métricas Energéticas', icon: <ChartIcon />, path: '/metrics' },
    { text: 'Dashboard Personalizable', icon: <WidgetsIcon />, path: '/custom-dashboard' },
    { text: 'Alertas', icon: <WarningIcon />, path: '/alerts' },
    { text: 'Exportar e Imprimir', icon: <DownloadIcon />, path: '/export' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
    { text: 'KPIs', icon: <TrendingUpIcon />, path: '/kpis' },
    { text: 'Análisis Comparativo', icon: <CompareIcon />, path: '/comparative' },
    { text: 'Gestión de Reportes', icon: <DescriptionIcon />, path: '/report-management' },
    { text: 'Mi Configuración', icon: <AccountIcon />, path: '/user-config' },
    { text: 'Reportes', icon: <ReportIcon />, path: '/reports' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Fragment>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        maxHeight: '100vh', // Altura máxima para evitar scroll en el body
        overflow: 'hidden' // Evitar scroll en el contenedor principal
      }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: 64, sm: 72 },
          px: { xs: 2, sm: 3 },
          py: 1
        }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo and Title */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            minWidth: 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mr: 3
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <Typography variant="h6" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  ⚡
                </Typography>
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  noWrap 
                  component="div" 
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.3rem' },
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'block' },
                    background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sistema de Monitoreo Energético
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Dashboard Inteligente
                </Typography>
              </Box>
            </Box>

            {/* Mobile Title */}
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontSize: '1rem',
                fontWeight: 600,
                display: { xs: 'block', sm: 'none' },
                color: 'white'
              }}
            >
              S.M.E.
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ 
            flexGrow: 1, 
            maxWidth: { xs: 200, sm: 400 }, 
            mx: { xs: 1, sm: 2 },
            display: { xs: 'none', md: 'block' }
          }}>
            <HeaderSearch />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5
          }}>
            {/* Theme Toggle */}
            <IconButton 
              color="inherit" 
              onClick={() => dispatch(toggleTheme())}
              size="medium"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                width: 44,
                height: 44,
              }}
            >
              {appTheme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Notifications */}
            <IconButton 
              color="inherit" 
              size="medium"
              onClick={(e) => setNotificationAnchor(e.currentTarget)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                width: 44,
                height: 44,
                position: 'relative',
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Profile */}
            <IconButton 
              color="inherit" 
              onClick={handleLogout} 
              size="medium"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                width: 44,
                height: 44,
                ml: 1
              }}
            >
              <AccountIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => dispatch(toggleSidebar())}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <SidebarContent />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <SidebarContent />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8, md: 10 }, // Responsive margin-top
          minHeight: 'calc(100vh - 64px)', // Altura completa menos el header
          maxHeight: 'calc(100vh - 64px)', // Altura máxima
          overflowY: 'auto', // Scroll vertical
          overflowX: 'hidden', // Sin scroll horizontal
          position: 'relative',
          // Scrollbar que llega hasta el borde derecho
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        {/* Contenedor interno con padding */}
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
      </Box>
      
      {/* Menú de Notificaciones */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notificaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount} sin leer
          </Typography>
        </Box>
        
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id}
            sx={{ 
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 2,
                  backgroundColor: 
                    notification.type === 'error' ? '#f44336' :
                    notification.type === 'warning' ? '#ff9800' :
                    notification.type === 'success' ? '#4caf50' : '#2196f3'
                }}
              >
                {notification.type === 'error' ? '⚠️' : 
                 notification.type === 'warning' ? '⚡' : 
                 notification.type === 'success' ? '✅' : 'ℹ️'}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: notification.read ? 400 : 600,
                    mb: 0.5 
                  }}
                >
                  {notification.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {notification.message}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                >
                  {notification.time}
                </Typography>
              </Box>
              
              {!notification.read && (
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#1976d2',
                    ml: 1
                  }} 
                />
              )}
            </Box>
          </MenuItem>
        ))}
        
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Ver todas las notificaciones
          </Typography>
        </Box>
      </Menu>
    </Fragment>
  );

  function SidebarContent() {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Dashboard Energético
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  handleNavigation(item.path);
                  // Cerrar sidebar en móviles después de navegar
                  if (window.innerWidth < 600) {
                    dispatch(toggleSidebar());
                  }
                }}
                sx={{
                  py: { xs: 1, sm: 1.5 },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: { xs: 1, sm: 2 }, flexShrink: 0 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Usuario: {user?.username}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Rol: {user?.role}
          </Typography>
        </Box>
      </Box>
      
      {/* Menú de Notificaciones */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notificaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount} sin leer
          </Typography>
        </Box>
        
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id}
            sx={{ 
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 2,
                  backgroundColor: 
                    notification.type === 'error' ? '#f44336' :
                    notification.type === 'warning' ? '#ff9800' :
                    notification.type === 'success' ? '#4caf50' : '#2196f3'
                }}
              >
                {notification.type === 'error' ? '⚠️' : 
                 notification.type === 'warning' ? '⚡' : 
                 notification.type === 'success' ? '✅' : 'ℹ️'}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: notification.read ? 400 : 600,
                    mb: 0.5 
                  }}
                >
                  {notification.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {notification.message}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                >
                  {notification.time}
                </Typography>
              </Box>
              
              {!notification.read && (
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#1976d2',
                    ml: 1
                  }} 
                />
              )}
            </Box>
          </MenuItem>
        ))}
        
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Ver todas las notificaciones
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default Layout;

