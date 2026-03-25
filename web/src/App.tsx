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
  return (
    <Router basename={APP_BASE}>
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
                <Route path="atencion/:idCita" element={<AtencionCitaWizard citaData={MOCK_CITA_DATA} />} />
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

const MOCK_CITA_DATA = {
    cita: {
        id: 123,
        idCaso: 456,
        idPaciente: 1,
        idMedico: 1,
        fechaCita: "2024-03-20",
        horaCita: "10:30",
        canalOrigen: "WEB",
        motivoResumen: "Control diabetes",
        nivelSemaforoPaciente: "V",
        estado_cita: "PROGRAMADA"
    },
    paciente: {
        idPaciente: 1,
        carnet: "12345678",
        nombre_completo: "Juan Pérez García",
        nombreCompleto: "Juan Pérez García",
        id_usuario: 1
    },
    empleado: {
        id_empleado: 1,
        cargo: "Analista de Sistemas",
        area: "TI",
        gerencia: "Sistemas",
        correo: "juan.perez@empresa.com",
        telefono: "555-0123",
        estado: "ACTIVO"
    },
    caso: {
        id_caso: 456,
        id_paciente: 1,
        fecha_apertura: "2024-01-01",
        estado: "ABIERTO"
    }
} as any;
