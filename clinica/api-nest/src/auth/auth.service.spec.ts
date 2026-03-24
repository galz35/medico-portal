import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DbService } from '../database/db.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let dbService: DbService;
    let jwtService: JwtService;

    const mockDbService = {
        executeOne: jest.fn(),
        execute: jest.fn(),
        executeNonQuery: jest.fn(),
        query: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
        verifyAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: DbService, useValue: mockDbService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        dbService = module.get<DbService>(DbService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('debe retornar el usuario si las credenciales son válidas', async () => {
            const pass = 'password123';
            const hash = await bcrypt.hash(pass, 10);
            const mockUser = { id_usuario: 1, carnet: '123', password_hash: hash, estado: 'A' };
            
            mockDbService.executeOne.mockResolvedValue(mockUser);

            const result = await service.validateUser('123', pass);
            expect(result).toBeDefined();
            expect(result.id_usuario).toBe(1);
            expect(result.password_hash).toBeUndefined();
        });

        it('debe retornar null si el password es incorrecto', async () => {
            const mockUser = { carnet: '123', password_hash: 'wrong_hash', estado: 'A' };
            mockDbService.executeOne.mockResolvedValue(mockUser);

            const result = await service.validateUser('123', 'any-pass');
            expect(result).toBeNull();
        });
    });

    describe('validateSSOToken (JIT Provisioning)', () => {
        it('debe aprovisionar un usuario nuevo si no existe en la BD local', async () => {
            const mockTicket = 'valid-ticket';
            const mockPayload = { carnet: '9999', name: 'Nuevo Usuario' };
            
            mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
            mockDbService.query.mockResolvedValueOnce([]); // No existe
            mockDbService.query.mockResolvedValueOnce({ ok: true }); // Mock del INSERT
            mockDbService.query.mockResolvedValueOnce([{ id_usuario: 5, carnet: '9999', rol: 'PACIENTE' }]); // Retorno tras JIT

            const user = await service.validateSSOToken(mockTicket);

            expect(user).toBeDefined();
            expect(user.carnet).toBe('9999');
            expect(dbService.query).toHaveBeenCalledTimes(3); // Buscar -> Insertar -> Re-buscar
        });
    });
});
