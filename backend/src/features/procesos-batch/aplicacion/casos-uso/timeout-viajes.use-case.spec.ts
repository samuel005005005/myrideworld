import { TimeoutViajesUseCase } from './timeout-viajes.use-case.js';
import { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { IEjecucionProcesoRepository } from '../../dominio/repositorios/ejecucion-proceso.repository.js';
import { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import type { INotificadorViaje } from '../../../viajes/aplicacion/puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../../../viajes/aplicacion/puertos/notificador-viaje.port.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { EjecucionProceso } from '../../dominio/entidades/ejecucion-proceso.entity.js';
import { DetalleEjecucionProceso } from '../../dominio/entidades/detalle-ejecucion.entity.js';
import { Viaje } from '../../../viajes/dominio/entidades/viaje.entity.js';
import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('TimeoutViajesUseCase', () => {
  let useCase: TimeoutViajesUseCase;
  let viajeRepoMock: Mocked<IViajeRepository>;
  let ejecucionRepoMock: Mocked<IEjecucionProcesoRepository>;
  let configRepoMock: Mocked<IConfiguracionRepository>;
  let notificadorViajeMock: Mocked<INotificadorViaje>;
  let registrarBitacoraMock: Mocked<RegistrarBitacoraUseCase>;

  beforeEach(() => {
    viajeRepoMock = {
      obtenerViajesVencidos: vi.fn(),
      guardar: vi.fn(),
    } as any;

    ejecucionRepoMock = {
      guardarEjecucion: vi.fn(),
      guardarDetalle: vi.fn(),
    } as any;

    configRepoMock = {
      obtenerValor: vi.fn().mockResolvedValue('5'),
    } as any;

    notificadorViajeMock = {
      notificarViajeCancelado: vi.fn(),
    } as any;

    registrarBitacoraMock = {
      ejecutar: vi.fn(),
    } as any;

    useCase = new TimeoutViajesUseCase(
      viajeRepoMock,
      ejecucionRepoMock,
      configRepoMock,
      notificadorViajeMock,
      registrarBitacoraMock,
    );
  });

  it('NoDebeHacerNada_CuandoNoHayViajesVencidos', async () => {
    // Arrange
    viajeRepoMock.obtenerViajesVencidos.mockResolvedValue([]);

    // Act
    await useCase.ejecutar();

    // Assert
    expect(ejecucionRepoMock.guardarEjecucion).not.toHaveBeenCalled();
    expect(viajeRepoMock.guardar).not.toHaveBeenCalled();
  });

  it('DebeCancelarViajeYRegistrarProceso_CuandoHayViajesVencidos', async () => {
    // Arrange
    const viajeMock = {
      id: 'viaje-1',
      pasajeroId: 'pasajero-1',
      cancelar: vi.fn(),
    } as unknown as Viaje;

    viajeRepoMock.obtenerViajesVencidos.mockResolvedValue([viajeMock]);

    const ejecucionPadreMock = {
      id: 'ejec-1',
      registrarExito: vi.fn(),
      finalizar: vi.fn(),
      estado: 'OK',
    } as unknown as EjecucionProceso;
    
    ejecucionRepoMock.guardarEjecucion.mockResolvedValue(ejecucionPadreMock);

    const detalleMock = {
      marcarEnProceso: vi.fn(),
      marcarExitoso: vi.fn(),
      marcarError: vi.fn(),
    } as unknown as DetalleEjecucionProceso;
    
    ejecucionRepoMock.guardarDetalle.mockResolvedValue(detalleMock);

    // Act
    await useCase.ejecutar();

    // Assert
    // Verify Execution was saved
    expect(ejecucionRepoMock.guardarEjecucion).toHaveBeenCalled(); // initially
    
    // Verify Viaje was cancelled
    expect(viajeMock.cancelar).toHaveBeenCalledWith(Roles.SISTEMA, 'Tiempo de espera agotado');
    expect(viajeRepoMock.guardar).toHaveBeenCalledWith(viajeMock);
    expect(notificadorViajeMock.notificarViajeCancelado).toHaveBeenCalledWith('viaje-1', 'SISTEMA', 'Tiempo de espera agotado');

    // Verify Bitacora
    expect(registrarBitacoraMock.ejecutar).toHaveBeenCalledWith({
      tipoEvento: TiposBitacora.INFO,
      servicioSistema: ServiciosSistema.VIAJES,
      detalle: 'Viaje viaje-1 cancelado automáticamente por timeout (5m)',
      usuario: 'SISTEMA_BATCH',
      entidadId: 'viaje-1',
      accion: 'TIMEOUT_VIAJE',
    });

    // Verify details marking
    expect(detalleMock.marcarEnProceso).toHaveBeenCalled();
    expect(detalleMock.marcarExitoso).toHaveBeenCalled();
    // No mock assertion for ejecucion.registrarExito() because it's a real entity instance in the code
  });

  it('DebeRegistrarError_CuandoFallaLaCancelacionDeUnViaje', async () => {
    // Arrange
    const viajeMock = {
      id: 'viaje-2',
      pasajeroId: 'pasajero-2',
      cancelar: vi.fn().mockImplementation(() => {
        throw new Error('Fake error canceling');
      }),
    } as unknown as Viaje;

    viajeRepoMock.obtenerViajesVencidos.mockResolvedValue([viajeMock]);

    const ejecucionPadreMock = {
      id: 'ejec-1',
      estado: 'ER',
    } as unknown as EjecucionProceso;
    
    ejecucionRepoMock.guardarEjecucion.mockResolvedValue(ejecucionPadreMock);

    const detalleMock = {
      marcarEnProceso: vi.fn(),
      marcarExitoso: vi.fn(),
      marcarError: vi.fn(),
    } as unknown as DetalleEjecucionProceso;
    
    ejecucionRepoMock.guardarDetalle.mockResolvedValue(detalleMock);

    // Act
    await useCase.ejecutar();

    // Assert
    expect(viajeMock.cancelar).toHaveBeenCalled();
    expect(viajeRepoMock.guardar).not.toHaveBeenCalled(); // Failed before saving
    expect(detalleMock.marcarError).toHaveBeenCalledWith('Fake error canceling', expect.any(String));
    // No mock assertion for ejecucion.registrarError() because it's a real entity instance in the code
    
    // Verify Error Bitacora
    expect(registrarBitacoraMock.ejecutar).toHaveBeenCalledWith(expect.objectContaining({
      tipoEvento: TiposBitacora.ERROR,
      accion: 'ERROR_TIMEOUT_VIAJE',
      entidadId: 'viaje-2'
    }));
  });
});
