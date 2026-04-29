import api from '../api';

export const PacienteService = {
    solicitarCita: async (data: any) => {
        const response = await api.post('/paciente/solicitar-cita', data);
        return response.data;
    },
    getMisCitas: async () => {
        const response = await api.get('/paciente/mis-citas');
        return response.data;
    },
    getMisChequeos: async () => {
        const response = await api.get('/paciente/mis-chequeos');
        return response.data;
    },
    getMisExamenes: async () => {
        const response = await api.get('/paciente/mis-examenes');
        return response.data;
    },
    getMisVacunas: async () => {
        const response = await api.get('/paciente/mis-vacunas');
        return response.data;
    },
    registrarChequeo: async (data: any) => {
        const response = await api.post('/paciente/chequeo', data);
        return response.data;
    }
};
