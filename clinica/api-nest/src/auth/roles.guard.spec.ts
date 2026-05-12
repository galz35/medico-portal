import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockContext = (user: any, roles?: string[]): ExecutionContext => {
    const handler = () => {};
    const cls = class {};
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => handler,
      getClass: () => cls,
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('debe permitir si no hay roles requeridos', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = mockContext({ rol: 'MEDICO' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe permitir si el usuario tiene el rol requerido', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = mockContext({ rol: 'ADMIN' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe denegar si el usuario no tiene el rol requerido', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = mockContext({ rol: 'MEDICO' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('debe denegar si el rol coincide parcialmente (ADMINISTRADOR no pasa por ADMIN)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = mockContext({ rol: 'ADMINISTRADOR' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('debe soportar multiples roles (MEDICO pasa como MEDICO o ADMIN)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['MEDICO', 'ADMIN']);
    const medicoCtx = mockContext({ rol: 'MEDICO' });
    const adminCtx = mockContext({ rol: 'ADMIN' });
    const pacienteCtx = mockContext({ rol: 'PACIENTE' });
    expect(guard.canActivate(medicoCtx)).toBe(true);
    expect(guard.canActivate(adminCtx)).toBe(true);
    expect(guard.canActivate(pacienteCtx)).toBe(false);
  });

  it('debe soportar user.rol como arreglo', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = mockContext({ rol: ['MEDICO', 'ADMIN'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe denegar si user.rol es arreglo y no contiene el rol requerido', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = mockContext({ rol: ['MEDICO', 'PACIENTE'] });
    expect(guard.canActivate(context)).toBe(false);
  });
});
