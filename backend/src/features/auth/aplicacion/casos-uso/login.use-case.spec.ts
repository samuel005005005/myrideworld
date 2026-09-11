import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from './login.use-case.js';
import { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { Pasajero } from '../../../pasajeros/dominio/entidades/pasajero.entity.js';
import { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';
import * as bcrypt from 'bcrypt';
import { describe, it, expect, beforeEach, vi, Mocked, Mock } from 'vitest';

vi.mock('bcrypt');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let jwtServiceMock: Mocked<JwtService>;
  let configServiceMock: Mocked<ConfigService>;
  let pasajeroRepositoryMock: Mocked<IPasajeroRepository>;
  let conductorRepositoryMock: Mocked<IConductorRepository>;

  const FAKE_TOKEN = 'token.fake.123';

  beforeEach(() => {
    jwtServiceMock = {
      signAsync: vi.fn().mockResolvedValue(FAKE_TOKEN),
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

    useCase = new LoginUseCase(
      jwtServiceMock,
      configServiceMock,
      pasajeroRepositoryMock,
      conductorRepositoryMock,
    );
  });

  describe('Pasajeros', () => {
    it('DebeRetornarToken_CuandoCredencialesSonValidas', async () => {
      // Arrange
      const pasajeroMock = { id: 'uuid-1', passwordHash: 'hashedPass' } as Pasajero;
      pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(pasajeroMock);
      (bcrypt.compare as unknown as Mock).mockResolvedValue(true);

      // Act
      const result = await useCase.ejecutar({
        email: 'test@test.com',
        password: 'password123',
        rol: Roles.PASAJERO,
      });

      // Assert
      expect(result.token).toBe(FAKE_TOKEN);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: 'uuid-1', rol: Roles.PASAJERO });
    });

    it('DebeLanzarExcepcion_CuandoEmailNoExiste', async () => {
      // Arrange
      pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.ejecutar({ email: 'test@test.com', password: 'password123', rol: Roles.PASAJERO })
      ).rejects.toThrow(new UnauthorizedException(MENSAJES.EXCEPCIONES.AUTH.CREDENCIALES_INVALIDAS));
    });

    it('DebeLanzarExcepcion_CuandoPasswordEsIncorrecto', async () => {
      // Arrange
      const pasajeroMock = { id: 'uuid-1', passwordHash: 'hashedPass' } as Pasajero;
      pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(pasajeroMock);
      (bcrypt.compare as unknown as Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        useCase.ejecutar({ email: 'test@test.com', password: 'wrongPassword', rol: Roles.PASAJERO })
      ).rejects.toThrow(new UnauthorizedException(MENSAJES.EXCEPCIONES.AUTH.CREDENCIALES_INVALIDAS));
    });
  });

  describe('Conductores', () => {
    it('DebeRetornarToken_CuandoCredencialesSonValidas', async () => {
      // Arrange
      const conductorMock = { id: 'uuid-2', passwordHash: 'hashedPass' } as Conductor;
      conductorRepositoryMock.obtenerPorEmail.mockResolvedValue(conductorMock);
      (bcrypt.compare as unknown as Mock).mockResolvedValue(true);

      // Act
      const result = await useCase.ejecutar({
        email: 'cond@test.com',
        password: 'password123',
        rol: Roles.CONDUCTOR,
      });

      // Assert
      expect(result.token).toBe(FAKE_TOKEN);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: 'uuid-2', rol: Roles.CONDUCTOR });
    });
  });

  describe('Admin', () => {
    it('DebeRetornarToken_CuandoCredencialesSonValidas', async () => {
      // Arrange
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'ADMIN_EMAIL') return 'admin@test.com';
        if (key === 'ADMIN_PASSWORD') return 'adminPass';
        return null;
      });

      // Act
      const result = await useCase.ejecutar({
        email: 'admin@test.com',
        password: 'adminPass',
        rol: Roles.ADMIN,
      });

      // Assert
      expect(result.token).toBe(FAKE_TOKEN);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: 'admin-1', rol: Roles.ADMIN });
    });

    it('DebeLanzarExcepcion_CuandoCredencialesSonInvalidas', async () => {
      // Arrange
      configServiceMock.get.mockImplementation(() => null); // Fallback a admin@myride.com / admin123

      // Act & Assert
      await expect(
        useCase.ejecutar({ email: 'admin@myride.com', password: 'wrong', rol: Roles.ADMIN })
      ).rejects.toThrow(new UnauthorizedException(MENSAJES.EXCEPCIONES.AUTH.CREDENCIALES_INVALIDAS));
    });
  });

  describe('Roles Inválidos', () => {
    it('DebeLanzarExcepcion_CuandoRolEsInvalido', async () => {
      // Arrange & Act & Assert
      await expect(
        useCase.ejecutar({ email: 'test@test.com', password: 'password', rol: 'OTRO' as any })
      ).rejects.toThrow(new UnauthorizedException(MENSAJES.EXCEPCIONES.AUTH.ROL_INVALIDO));
    });
  });
});
