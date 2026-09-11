import { CrearConductorUseCase } from './crear-conductor.use-case.js';
import { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import * as bcrypt from 'bcrypt';
import { describe, it, expect, beforeEach, vi, Mocked, Mock } from 'vitest';

vi.mock('bcrypt');

describe('CrearConductorUseCase', () => {
  let useCase: CrearConductorUseCase;
  let conductorRepositoryMock: Mocked<IConductorRepository>;

  beforeEach(() => {
    conductorRepositoryMock = {
      obtenerPorEmail: vi.fn(),
      guardar: vi.fn(),
    } as any;

    useCase = new CrearConductorUseCase(conductorRepositoryMock);
  });

  it('DebeLanzarExcepcion_CuandoEmailYaEstaRegistrado', async () => {
    // Arrange
    conductorRepositoryMock.obtenerPorEmail.mockResolvedValue({ id: 'existente' } as any);

    // Act & Assert
    await expect(useCase.ejecutar({
      nombreCompleto: 'Test',
      email: 'test@test.com',
      telefono: '123456789',
      vehiculoMarca: 'Toyota',
      vehiculoModelo: 'Corolla',
      vehiculoColor: 'Rojo',
      vehiculoPlaca: 'ABC-123',
      password: 'password',
    })).rejects.toThrow(new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.EMAIL_REGISTRADO));
  });

  it('DebeCrearYGuardarConductor_CuandoDatosSonValidos', async () => {
    // Arrange
    conductorRepositoryMock.obtenerPorEmail.mockResolvedValue(null);
    conductorRepositoryMock.guardar.mockImplementation(async (p) => p);
    (bcrypt.hash as unknown as Mock).mockResolvedValue('hashed_password');

    // Act
    const result = await useCase.ejecutar({
      nombreCompleto: 'Test Conductor',
      email: 'cond@test.com',
      telefono: '123456789',
      vehiculoMarca: 'Toyota',
      vehiculoModelo: 'Corolla',
      vehiculoColor: 'Rojo',
      vehiculoPlaca: 'ABC-123',
      password: 'password',
    });

    // Assert
    expect(result.nombreCompleto).toBe('Test Conductor');
    expect(result.email).toBe('cond@test.com');
    expect(result.vehiculoPlaca).toBe('ABC-123');
    expect(result.passwordHash).toBe('hashed_password');
    expect(conductorRepositoryMock.guardar).toHaveBeenCalled();
  });
});
