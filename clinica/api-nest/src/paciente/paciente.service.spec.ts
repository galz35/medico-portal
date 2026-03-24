import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { DbService } from '../database/db.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let dbService: DbService;

  const mockDbService = {
    execute: jest.fn(),
    executeOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    dbService = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('debe retornar stats y timeline correctos para el paciente', async () => {
      const mockDashboardResult = [{
        nivel_semaforo: 'A',
        ultimo_chequeo_fecha: '2024-03-10',
        seguimientos_activos: 3
      }];
      
      const mockTimeline = [
        { fecha: '2024-03-15', tipo: 'CITA', descripcion: 'Control General' },
        { fecha: '2024-03-10', tipo: 'VACUNA', descripcion: 'Influenza' }
      ];

      mockDbService.execute.mockImplementation((sp) => {
        if (sp === 'sp_Paciente_GetDashboard') return Promise.resolve(mockDashboardResult);
        if (sp === 'sp_Paciente_GetTimeline') return Promise.resolve(mockTimeline);
        return Promise.resolve([]);
      });

      const stats = await service.getDashboardStats(1);

      expect(stats.kpis.estadoActual).toBe('A');
      expect(stats.kpis.seguimientosActivos).toBe(3);
      expect(stats.timeline).toHaveLength(2);
      expect(stats.timeline[0].tipo).toBe('CITA');
    });
  });

  describe('crearChequeo', () => {
    it('debe crear un chequeo y retornar el resultado', async () => {
      const data = { nivelSemaforo: 'V', otros: 'ok' };
      mockDbService.executeOne.mockResolvedValue({ idChequeo: 500 });

      const result = await service.crearChequeo(1, data);

      expect(dbService.executeOne).toHaveBeenCalledWith('sp_Paciente_CrearChequeo', expect.objectContaining({
        IdPaciente: 1,
        NivelRiesgo: 'V'
      }));
      expect(result.idChequeo).toBe(500);
    });

    it('debe lanzar error si falla la db', async () => {
      mockDbService.executeOne.mockRejectedValue(new Error('Fail'));
      await expect(service.crearChequeo(1, {})).rejects.toThrow(InternalServerErrorException);
    });
  });
});
