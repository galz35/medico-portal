import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { DbService } from '../database/db.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('MedicoService', () => {
  let service: MedicoService;
  let dbService: DbService;

  const mockDbService = {
    execute: jest.fn(),
    executeOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    dbService = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearAtencion', () => {
    it('debe llamar a sp_Medico_CrearAtencion con los parámetros correctos', async () => {
      const dto = {
        idCita: 1,
        idMedico: 10,
        diagnosticoPrincipal: 'Gripe Común',
        planTratamiento: 'Reposo',
        recomendaciones: 'Hidratación',
        requiereSeguimiento: true,
        pesoKg: 75,
        temperaturaC: 37.5
      } as any;

      mockDbService.executeOne.mockResolvedValue({ idAtencion: 123 });

      const result = await service.crearAtencion(dto);

      expect(dbService.executeOne).toHaveBeenCalledWith('sp_Medico_CrearAtencion', expect.objectContaining({
        IdCita: dto.idCita,
        IdMedico: dto.idMedico,
        Diagnostico: dto.diagnosticoPrincipal,
        Temp: 37.5
      }));
      expect(result).toEqual({ idAtencion: 123 });
    });

    it('debe lanzar InternalServerErrorException si la base de datos falla', async () => {
      mockDbService.executeOne.mockRejectedValue(new Error('DB Error'));
      await expect(service.crearAtencion({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('registrarVacuna', () => {
    it('debe registrar una vacuna correctamente', async () => {
      const data = {
        idPaciente: 5,
        idMedico: 10,
        tipoVacuna: 'Influenza',
        dosis: '1ra',
        fechaAplicacion: '2024-03-20'
      };

      mockDbService.executeOne.mockResolvedValue({ idVacuna: 99 });

      const result = await service.registrarVacuna(data);

      expect(dbService.executeOne).toHaveBeenCalledWith('sp_Medico_RegistrarVacuna', expect.objectContaining({
        IdPaciente: 5,
        Tipo: 'Influenza'
      }));
      expect(result).toEqual({ idVacuna: 99 });
    });
  });

  describe('getDashboardStats', () => {
    it('debe consolidar estadísticas correctamente', async () => {
      mockDbService.execute.mockImplementation((sp) => {
        if (sp === 'sp_Medico_GetCitasHoy') return Promise.resolve([{}, {}]); // 2 citas
        if (sp === 'sp_Medico_GetPacientesRojo') return Promise.resolve([{}]); // 1 rojo
        if (sp === 'sp_Medico_CountCasosAbiertos') return Promise.resolve([{ total: 10 }]);
        return Promise.resolve([]);
      });

      const stats = await service.getDashboardStats(1, 'HN');

      expect(stats.citasHoyCount).toBe(2);
      expect(stats.pacientesEnRojoCount).toBe(1);
      expect(stats.casosAbiertos).toBe(10);
    });
  });
});
