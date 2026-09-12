import { ConfigService } from '@nestjs/config';
import { LoginUseCase } from '../../../../../../src/features/auth/aplicacion/casos-uso/login.use-case.js';
import { IPasajeroRepository } from '../../../../../../src/features/pasajeros/dominio/repositorios/pasajero.repository.js';
import { IConductorRepository } from '../../../../../../src/features/conductores/dominio/repositorios/conductor.repository.js';
import { IAdministradorRepository } from '../../../../../../src/features/administradores/dominio/repositorios/administrador.repository.js';
import { Roles } from '../../../../../../src/compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../../../src/compartidos/constantes/roles-admin.enum.js';
import { MENSAJES } from '../../../../../../src/compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';
import { Pasajero } from '../../../../../../src/features/pasajeros/dominio/entidades/pasajero.entity.js';
import { Conductor } from '../../../../../../src/features/conductores/dominio/entidades/conductor.entity.js';
import type { IHasheadorPassword } from '../../../../../../src/compartidos/seguridad/hasheador-password.port.js';
import type { IGeneradorToken } from '../../../../../../src/features/auth/aplicacion/puertos/generador-token.port.js';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let generadorTokenMock: Mocked<IGeneradorToken>;
  let configServiceMock: Mocked<ConfigService>;
  let pasajeroRepositoryMock: Mocked<IPasajeroRepository>;
  let conductorRepositoryMock: Mocked<IConductorRepository>;
  let administradorRepositoryMock: Mocked<IAdministradorRepository>;
  let hasheadorPasswordMock: Mocked<IHasheadorPassword>;

  const FAKE_TOKEN = 'token.fake.123';

  beforeEach(() => {
    generadorTokenMock = {
      firmar: vi.fn().mockResolvedValue(FAKE_TOKEN),
    } as any;

    configServiceMock = {
      get: vi.fn(),
    } as any;

    pasajeroRepositoryMock = {
      obtenerPorEmail: vi.fn(),
    } as any;

    conductorRepositoryMock = {
      obtenerPorEmail: vi.fn(),
    } as any;

    administradorRepositoryMock = {
      obtenerPorEmail: vi.fn(),
    } as any;

    hasheadorPasswordMock = {
      hashear: vi.fn(),
      comparar: vi.fn(),
    } as any;

    useCase = new LoginUseCase(
      generadorTokenMock,
      configServiceMock,
      pasajeroRepositoryMock,
      conductorRepositoryMock,
      administradorRepositoryMock,
      hasheadorPasswordMock,
    );
  });

  describe('Pasajeros', () => {
    it('DebeRetornarToken_CuandoCredencialesSonValidas', async () => {
      const pasajeroMock = { id: 'uuid-1', passwordHash: 'hashedPass' } as Pasajero;
      pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(pasajeroMock);
      hasheadorPasswordMock.comparar.mockResolvedValue(true);

      const result = await useCase.ejecutar({
        email: 'test@test.com',
        password: 'password123',
        rol: Roles.PASAJERO,
      });

      expect(result.token).toBe(FAKE_TOKEN);
      expect(generadorTokenMock.firmar).toHaveBeenCalledWith({
        sub: 'uuid-1',
        rol: Roles.PASAJERO,
      });
    });

    it('DebeLanzarExcepcion_CuandoEmailNoExiste', async () => {
      pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(null);

      await expect(
        useCase.ejecutar({
          email: 'test@test.com',
          password: 'password123',
          rol: Roles.PASAJERO,
        }),
      ).rejects.toThrow(
        new DomainException(MENSAJES.EXCEPCIONES.AUTH.CREDENCIALES_INVALIDAS, 401),
      );
    });

    it('DebeLanzarExcepcion_CuandoPasswordEsIncorrecto', async () => {
      const pasajeroMock = { id: 'uuid-1', passwordHash: 'hashedPass' } as Pasajero;
      pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(pasajeroMock);
      hasheadorPasswordMock.comparar.mockResolvedValue(false);

      await expect(
        useCase.ejecutar({
          email: 'test@test.com',
          password: 'wrongPassword',
          rol: Roles.PASAJERO,
        }),
      ).rejects.toThrow(
        new DomainException(MENSAJES.EXCEPCIONES.AUTH.CREDENCIALES_INVALIDAS, 401),
      );
    });
  });

  describe('Conductores', () => {
    it('DebeRetornarToken_CuandoCredencialesSonValidas', async () => {
      const conductorMock = { id: 'uuid-2', passwordHash: 'hashedPass' } as Conductor;
      conductorRepositoryMock.obtenerPorEmail.mockResolvedValue(conductorMock);
      hasheadorPasswordMock.comparar.mockResolvedValue(true);

      const result = await useCase.ejecutar({
        email: 'cond@test.com',
        password: 'password123',
        rol: Roles.CONDUCTOR,
      });

      expect(result.token).toBe(FAKE_TOKEN);
      expect(generadorTokenMock.firmar).toHaveBeenCalledWith({
        sub: 'uuid-2',
        rol: Roles.CONDUCTOR,
      });
    });
  });

  describe('Admin', () => {
    it('DebeRetornarToken_CuandoAdminExisteEnBd', async () => {
      administradorRepositoryMock.obtenerPorEmail.mockResolvedValue({
        id: 'admin-uuid',
        passwordHash: 'hashed',
        activo: true,
        rolAdmin: RolesAdmin.SUPER_ADMIN,
        nombreCompleto: 'Super Admin',
      } as any);
      hasheadorPasswordMock.comparar.mockResolvedValue(true);

      const result = await useCase.ejecutar({
        email: 'admin@test.com',
        password: 'adminPass',
        rol: Roles.ADMIN,
      });

      expect(result.token).toBe(FAKE_TOKEN);
      expect(result.adminRol).toBe(RolesAdmin.SUPER_ADMIN);
      expect(generadorTokenMock.firmar).toHaveBeenCalledWith({
        sub: 'admin-uuid',
        rol: Roles.ADMIN,
        adminRol: RolesAdmin.SUPER_ADMIN,
      });
    });

    it('DebeRetornarToken_CuandoFallbackEnvYNoHayAdminEnBd', async () => {
      administradorRepositoryMock.obtenerPorEmail.mockResolvedValue(null);
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'ADMIN_EMAIL') return 'admin@test.com';
        if (key === 'ADMIN_PASSWORD') return 'adminPass';
        return null;
      });

      const result = await useCase.ejecutar({
        email: 'admin@test.com',
        password: 'adminPass',
        rol: Roles.ADMIN,
      });

      expect(result.token).toBe(FAKE_TOKEN);
      expect(generadorTokenMock.firmar).toHaveBeenCalledWith({
        sub: 'admin-env-fallback',
        rol: Roles.ADMIN,
        adminRol: RolesAdmin.SUPER_ADMIN,
      });
    });

    it('DebeLanzarExcepcion_CuandoCredencialesSonInvalidas', async () => {
      administradorRepositoryMock.obtenerPorEmail.mockResolvedValue(null);
      configServiceMock.get.mockImplementation(() => null);

      await expect(
        useCase.ejecutar({
          email: 'admin@myride.com',
          password: 'wrong',
          rol: Roles.ADMIN,
        }),
      ).rejects.toThrow(
        new DomainException(MENSAJES.EXCEPCIONES.AUTH.CREDENCIALES_INVALIDAS, 401),
      );
    });
  });

  describe('Roles Invalidos', () => {
    it('DebeLanzarExcepcion_CuandoRolEsInvalido', async () => {
      await expect(
        useCase.ejecutar({
          email: 'test@test.com',
          password: 'password',
          rol: 'OTRO' as any,
        }),
      ).rejects.toThrow(
        new DomainException(MENSAJES.EXCEPCIONES.AUTH.ROL_INVALIDO, 401),
      );
    });
  });
});
