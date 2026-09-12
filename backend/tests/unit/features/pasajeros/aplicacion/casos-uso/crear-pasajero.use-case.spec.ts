import { CrearPasajeroUseCase } from '../../../../../../src/features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { IPasajeroRepository } from '../../../../../../src/features/pasajeros/dominio/repositorios/pasajero.repository.js';
import { DomainException } from '../../../../../../src/compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../../../src/compartidos/constantes/mensajes.const.js';
import type { IHasheadorPassword } from '../../../../../../src/compartidos/seguridad/hasheador-password.port.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('CrearPasajeroUseCase', () => {
  let useCase: CrearPasajeroUseCase;
  let pasajeroRepositoryMock: Mocked<IPasajeroRepository>;
  let hasheadorPasswordMock: Mocked<IHasheadorPassword>;

  beforeEach(() => {
    pasajeroRepositoryMock = {
      obtenerPorEmail: vi.fn(),
      guardar: vi.fn(),
    } as any;

    hasheadorPasswordMock = {
      hashear: vi.fn().mockResolvedValue('hashed_password'),
      comparar: vi.fn(),
    } as any;

    useCase = new CrearPasajeroUseCase(
      pasajeroRepositoryMock,
      hasheadorPasswordMock,
    );
  });

  it('DebeLanzarExcepcion_CuandoEmailYaEstaRegistrado', async () => {
    pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue({ id: 'existente' } as any);

    await expect(
      useCase.ejecutar({
        nombreCompleto: 'Test',
        email: 'test@test.com',
        telefono: '123456789',
        password: 'password',
      }),
    ).rejects.toThrow(
      new DomainException(MENSAJES.EXCEPCIONES.PASAJEROS.EMAIL_REGISTRADO),
    );
  });

  it('DebeCrearYGuardarPasajero_CuandoDatosSonValidos', async () => {
    pasajeroRepositoryMock.obtenerPorEmail.mockResolvedValue(null);
    pasajeroRepositoryMock.guardar.mockImplementation(async (p) => p);

    const result = await useCase.ejecutar({
      nombreCompleto: 'Test User',
      email: 'test@test.com',
      telefono: '123456789',
      password: 'password',
    });

    expect(result.nombreCompleto).toBe('Test User');
    expect(result.email).toBe('test@test.com');
    expect(result.telefono).toBe('123456789');
    expect(result.passwordHash).toBe('hashed_password');
    expect(pasajeroRepositoryMock.guardar).toHaveBeenCalled();
    expect(hasheadorPasswordMock.hashear).toHaveBeenCalledWith('password');
  });
});
