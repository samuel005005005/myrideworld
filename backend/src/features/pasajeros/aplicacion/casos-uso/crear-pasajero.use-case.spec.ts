import { CrearPasajeroUseCase } from './crear-pasajero.use-case.js';
import { IPasajeroRepository } from '../../dominio/repositorios/pasajero.repository.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import * as bcrypt from 'bcrypt';
import { describe, it, expect, beforeEach, vi, Mocked, Mock } from 'vitest';

vi.mock('bcrypt');

describe('CrearPasajeroUseCase', () => {
  let useCase: CrearPasajeroUseCase;
  let pasajeroRepositoryMock: Mocked<IPasajeroRepository>;

  beforeEach(() => {
    pasajeroRepositoryMock = {
      obtenerPorEmail: vi.fn(),
      guardar: vi.fn(),
    } as any;

    useCase = new CrearPasajeroUseCase(pasajeroRepositoryMock);
  });

  it('DebeLanzarExcepcion_CuandoEmailYaEstaRegistrado', async () => {
    // Arrange
    pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue({ id: 'existente' } as any);

    // Act & Assert
    await expect(useCase.ejecutar({
      nombreCompleto: 'Test',
      email: 'test@test.com',
      telefono: '123456789',
      password: 'password',
    })).rejects.toThrow(new DomainException(MENSAJES.EXCEPCIONES.PASAJEROS.EMAIL_REGISTRADO));
  });

  it('DebeCrearYGuardarPasajero_CuandoDatosSonValidos', async () => {
    // Arrange
    pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(null);
    pasajeroRepositoryMock.guardar.mockImplementation(async (p) => p);
    (bcrypt.hash as unknown as Mock).mockResolvedValue('hashed_password');

    // Act
    const result = await useCase.ejecutar({
      nombreCompleto: 'Test User',
      email: 'test@test.com',
      telefono: '123456789',
      password: 'password',
    });

    // Assert
    expect(result.nombreCompleto).toBe('Test User');
    expect(result.email).toBe('test@test.com');
    expect(result.telefono).toBe('123456789');
    expect(result.passwordHash).toBe('hashed_password');
    expect(pasajeroRepositoryMock.guardar).toHaveBeenCalled();
  });
});
