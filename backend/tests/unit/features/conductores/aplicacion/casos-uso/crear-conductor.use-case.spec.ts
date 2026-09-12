import { CrearConductorUseCase } from '../../../../../../src/features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';
import { IConductorRepository } from '../../../../../../src/features/conductores/dominio/repositorios/conductor.repository.js';
import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../../../src/compartidos/constantes/mensajes.const.js';
import type { IHasheadorPassword } from '../../../../../../src/compartidos/seguridad/hasheador-password.port.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('CrearConductorUseCase', () => {
  let useCase: CrearConductorUseCase;
  let conductorRepositoryMock: Mocked<IConductorRepository>;
  let hasheadorPasswordMock: Mocked<IHasheadorPassword>;

  beforeEach(() => {
    conductorRepositoryMock = {
      obtenerPorEmail: vi.fn(),
      guardar: vi.fn(),
    } as any;

    hasheadorPasswordMock = {
      hashear: vi.fn().mockResolvedValue('hashed_password'),
      comparar: vi.fn(),
    } as any;

    useCase = new CrearConductorUseCase(
      conductorRepositoryMock,
      hasheadorPasswordMock,
    );
  });

  it('DebeLanzarExcepcion_CuandoEmailYaEstaRegistrado', async () => {
    conductorRepositoryMock.obtenerPorEmail.mockResolvedValue({ id: 'existente' } as any);

    await expect(
      useCase.ejecutar({
        nombreCompleto: 'Test',
        email: 'test@test.com',
        telefono: '123456789',
        vehiculoMarca: 'Toyota',
        vehiculoModelo: 'Corolla',
        vehiculoColor: 'Rojo',
        vehiculoPlaca: 'ABC-123',
        password: 'password',
      }),
    ).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.EMAIL_REGISTRADO),
    );
  });

  it('DebeCrearYGuardarConductor_CuandoDatosSonValidos', async () => {
    conductorRepositoryMock.obtenerPorEmail.mockResolvedValue(null);
    conductorRepositoryMock.guardar.mockImplementation(async (p) => p);

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

    expect(result.nombreCompleto).toBe('Test Conductor');
    expect(result.email).toBe('cond@test.com');
    expect(result.vehiculoPlaca).toBe('ABC-123');
    expect(result.passwordHash).toBe('hashed_password');
    expect(conductorRepositoryMock.guardar).toHaveBeenCalled();
    expect(hasheadorPasswordMock.hashear).toHaveBeenCalledWith('password');
  });
});
