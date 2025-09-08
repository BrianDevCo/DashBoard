import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
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

function App() {
  // Para demo, siempre autenticado
  const isAuthenticated = true;

  return (
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
  );
}

export default App;

