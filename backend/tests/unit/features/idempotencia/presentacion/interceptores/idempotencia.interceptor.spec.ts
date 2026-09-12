import { ExecutionContext, CallHandler, ConflictException } from '@nestjs/common';
import { IdempotenciaInterceptor } from '../../../../../../src/features/idempotencia/presentacion/interceptores/idempotencia.interceptor.js';
import { IIdempotenciaRepository } from '../../../../../../src/features/idempotencia/dominio/repositorios/idempotencia.repository.js';
import { Idempotencia } from '../../../../../../src/features/idempotencia/dominio/entidades/idempotencia.entity.js';
import { EstadoIdempotencia } from '../../../../../../src/features/idempotencia/dominio/entidades/estado-idempotencia.enum.js';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('IdempotenciaInterceptor', () => {
  let interceptor: IdempotenciaInterceptor;
  let repoMock: Mocked<IIdempotenciaRepository>;

  beforeEach(() => {
    repoMock = {
      obtenerPorLlave: vi.fn(),
      guardar: vi.fn(),
    } as any;

    interceptor = new IdempotenciaInterceptor(repoMock);
  });

  const crearContexto = (method: string, headers: Record<string, string>, body: any = {}) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ method, headers, body, url: '/test' }),
        getResponse: () => ({ statusCode: 200, status: vi.fn() }),
      }),
    } as unknown as ExecutionContext;
  };

  it('DebeDejarPasar_CuandoEsMetodoGET', async () => {
    // Arrange
    const context = crearContexto('GET', { 'idempotency-key': '123' });
    const callHandler: CallHandler = { handle: () => of('OK') };

    // Act
    const observable = await interceptor.intercept(context, callHandler);
    
    // Assert
    observable.subscribe((val) => expect(val).toBe('OK'));
    expect(repoMock.obtenerPorLlave).not.toHaveBeenCalled();
  });

  it('DebeDejarPasar_CuandoNoHayIdempotencyKey', async () => {
    // Arrange
    const context = crearContexto('POST', {}); // Sin llave
    const callHandler: CallHandler = { handle: () => of('OK') };

    // Act
    const observable = await interceptor.intercept(context, callHandler);
    
    // Assert
    observable.subscribe((val) => expect(val).toBe('OK'));
    expect(repoMock.obtenerPorLlave).not.toHaveBeenCalled();
  });

  it('DebeRetornarRespuestaGuardada_CuandoYaEstaCompletado', async () => {
    // Arrange
    const context = crearContexto('POST', { 'idempotency-key': 'key-1' }, { a: 1 });
    const callHandler: CallHandler = { handle: () => of('NUEVO_OK') };
    
    const registroPrevio = Idempotencia.reconstruir({
      llave: 'key-1',
      url: '/test',
      respuesta: 'VIEJO_OK',
      codigoEstado: 201,
      estado: EstadoIdempotencia.COMPLETADO
    });

    repoMock.obtenerPorLlave.mockResolvedValue(registroPrevio);

    // Act
    const observable = await interceptor.intercept(context, callHandler);
    
    // Assert
    observable.subscribe((val) => {
      expect(val).toBe('VIEJO_OK'); // Retorna el cache, NO 'NUEVO_OK'
    });
  });

  it('DebeLanzarConflicto_CuandoEstaEnProgreso', async () => {
    // Arrange
    const context = crearContexto('POST', { 'idempotency-key': 'key-2' }, { a: 1 });
    const callHandler: CallHandler = { handle: () => of('NUEVO_OK') };
    
    const registroPrevio = Idempotencia.iniciar('key-2', '/test', 'hash');

    repoMock.obtenerPorLlave.mockResolvedValue(registroPrevio);

    // Act & Assert
    await expect(interceptor.intercept(context, callHandler)).rejects.toThrow(ConflictException);
  });
});
