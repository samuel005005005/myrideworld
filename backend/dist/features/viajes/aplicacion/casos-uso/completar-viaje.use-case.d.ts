import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
export declare class CompletarViajeUseCase {
    private readonly viajeRepository;
    private readonly notificadorViaje;
    private readonly generarPagoUseCase;
    private readonly registrarBitacora;
    constructor(viajeRepository: IViajeRepository, notificadorViaje: INotificadorViaje, generarPagoUseCase: GenerarPagoUseCase, registrarBitacora: RegistrarBitacoraUseCase);
    ejecutar(id: string): Promise<Viaje>;
}
