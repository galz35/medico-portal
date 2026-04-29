import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/context/AuthContext';
import { DashboardLayout } from './components/shared/DashboardLayout';
import { AgendaCitas } from './components/medico/AgendaCitas';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AtencionCitaWizard } from './components/medico/AtencionCitaWizard';
import { PacienteDashboard } from './components/paciente/PacienteDashboard';
import { GestionCampanasVite } from './components/medico/GestionCampanasVite';
import { HistorialPaciente } from './components/medico/HistorialPaciente';
import { Telemedicina } from './components/paciente/Telemedicina';
import { CitaMedica, Paciente, EmpleadoEmp2024, CasoClinico } from './lib/types/domain';

import { APP_BASE } from './lib/runtime';

function App() {
  const basename = APP_BASE === "/" ? undefined : APP_BASE.replace(/\/$/, "");

  return (
    <Router basename={basename}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/medico/agenda-citas" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          } />

          {/* Medical Routes wrapped in DashboardLayout */}
          <Route path="/medico/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} /> {/* Or a MedicoDashboard */}
                <Route path="agenda-citas" element={<AgendaCitas />} />
                <Route path="campanas" element={<GestionCampanasVite />} />
                <Route path="historial" element={<HistorialPaciente />} />
                <Route path="pacientes" element={<HistorialPaciente />} /> { /* Reuse for demo */ }
                <Route path="atencion/:idCita" element={<AtencionCitaWizard />} />
                <Route path="*" element={<Navigate to="/medico/agenda-citas" replace />} />
              </Routes>
            </DashboardLayout>
          } />

          {/* Patient / Employee Routes */}
          <Route path="/paciente/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<PacienteDashboard />} />
                <Route path="resultados" element={<PacienteDashboard />} /> { /* Reuse for demo */ }
                <Route path="historial" element={<HistorialPaciente />} />
                <Route path="telemedicina" element={<Telemedicina />} />
                <Route path="*" element={<Navigate to="/paciente/dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

