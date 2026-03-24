import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MedicoService } from './medico.service';
import api from '../api';

vi.mock('../api');
const mockedApi = api as any;

describe('MedicoService Frontend (Vitest)', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getDashboard debe llamar al endpoint de NestJS correctamente', async () => {
        const mockData = { citasHoyCount: 10, pacientesEnRojoCount: 0 };
        mockedApi.get.mockResolvedValue({ data: mockData });

        const result = await MedicoService.getDashboard();

        expect(mockedApi.get).toHaveBeenCalledWith('/medico/dashboard');
        expect(result.citasHoyCount).toBe(10);
    });

    it('crearAtencion debe enviar los datos del Wizard al backend', async () => {
        const atencionData = { idCita: 55, diagnosticoPrincipal: 'Diagnóstico Vitest' };
        mockedApi.post.mockResolvedValue({ data: { ok: true } });

        await MedicoService.crearAtencion(atencionData);

        expect(mockedApi.post).toHaveBeenCalledWith('/medico/atencion', atencionData);
    });

    it('registrarVacuna debe ejecutar la petición POST de Vacunas', async () => {
        const vacunaData = { idPaciente: 1, tipoVacuna: 'Pfizer' };
        mockedApi.post.mockResolvedValue({ data: { success: true } });

        await MedicoService.registrarVacuna(vacunaData);

        expect(mockedApi.post).toHaveBeenCalledWith('/medico/vacunas', vacunaData);
    });
});
