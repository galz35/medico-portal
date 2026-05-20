import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/context/AuthContext';
import { DashboardLayout } from './components/shared/DashboardLayout';
import { AgendaCitas } from './components/medico/AgendaCitas';
import { MedicoDashboard } from './components/medico/MedicoDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AtencionCitaWizard } from './components/medico/AtencionCitaWizard';
import { PacienteDashboard } from './components/paciente/PacienteDashboard';
import { PacienteHistorial } from './components/paciente/PacienteHistorial';
import { PacienteResultados } from './components/paciente/PacienteResultados';
import { GestionCampanasVite } from './components/medico/GestionCampanasVite';
import { HistorialPaciente } from './components/medico/HistorialPaciente';
import { Telemedicina } from './components/paciente/Telemedicina';
import { LoginPage } from './components/auth/LoginPage';
import { SSOHandlerPage } from './components/auth/SSOHandlerPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { APP_BASE } from './lib/runtime';

function App() {
  const basename = APP_BASE === "/" ? undefined : APP_BASE.replace(/\/$/, "");

  return (
    <Router basename={basename}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/sso" element={<SSOHandlerPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Medical Routes */}
          <Route path="/medico/*" element={
            <ProtectedRoute allowedRoles={['MEDICO', 'ADMIN']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<MedicoDashboard />} />
                  <Route path="agenda-citas" element={<AgendaCitas />} />
                  <Route path="campanas" element={<GestionCampanasVite />} />
                  <Route path="historial" element={<HistorialPaciente />} />
                  <Route path="pacientes" element={<HistorialPaciente />} />
                  <Route path="atencion/:idCita" element={<AtencionCitaWizard />} />
                  <Route path="*" element={<Navigate to="/medico/agenda-citas" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Patient / Employee Routes */}
          <Route path="/paciente/*" element={
            <ProtectedRoute allowedRoles={['PACIENTE']}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<PacienteDashboard />} />
                <Route path="resultados" element={<PacienteResultados />} />
                <Route path="historial" element={<PacienteHistorial />} />
                  <Route path="telemedicina" element={<Telemedicina />} />
                  <Route path="*" element={<Navigate to="/paciente/dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

