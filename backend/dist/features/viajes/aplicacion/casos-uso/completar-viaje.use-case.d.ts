import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
export declare class CompletarViajeUseCase {
    private readonly viajeRepository;
    private readonly generarPago;
    constructor(viajeRepository: IViajeRepository, generarPago: GenerarPagoUseCase);
    ejecutar(viajeId: string): Promise<Viaje>;
}
