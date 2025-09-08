import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import EnergyMetrics from './pages/EnergyMetrics';
import CustomizableDashboard from './pages/CustomizableDashboard';
import AlertsManagement from './pages/AlertsManagement';
import ExportAndPrint from './pages/ExportAndPrint';
import UserAdministration from './pages/UserAdministration';
import KPIDashboard from './pages/KPIDashboard';
import ComparativeAnalysis from './pages/ComparativeAnalysis';
import ReportManagement from './pages/ReportManagement';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import UserConfig from './components/UserConfig';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import { createTheme } from '@mui/material/styles';

// Función para crear tema dinámico
const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#ffffff',
        secondary: mode === 'light' ? '#757575' : '#b0b0b0',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
  });
};

function App() {
  const { isAuthenticated } = useAuth();
  const { theme: appTheme } = useSelector((state: RootState) => state.ui);
  
  const theme = createAppTheme(appTheme);

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<ExecutiveDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metrics" element={<EnergyMetrics />} />
            <Route path="/custom-dashboard" element={<CustomizableDashboard />} />
            <Route path="/alerts" element={<AlertsManagement />} />
            <Route path="/export" element={<ExportAndPrint />} />
            <Route path="/users" element={<UserAdministration />} />
            <Route path="/kpis" element={<KPIDashboard />} />
            <Route path="/comparative" element={<ComparativeAnalysis />} />
            <Route path="/report-management" element={<ReportManagement />} />
            <Route path="/user-config" element={<UserConfig />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Box>
    </ThemeProvider>
  );
}

export default App;

