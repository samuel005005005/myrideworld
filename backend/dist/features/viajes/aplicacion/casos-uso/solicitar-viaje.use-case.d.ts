import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { SolicitarViajeDto } from '../dto/solicitar-viaje.dto.js';
import { EstimarTarifaUseCase } from '../../../tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
export declare class SolicitarViajeUseCase {
    private readonly viajeRepository;
    private readonly conductorRepository;
    private readonly estimarTarifa;
    private readonly notificadorViaje;
    constructor(viajeRepository: IViajeRepository, conductorRepository: IConductorRepository, estimarTarifa: EstimarTarifaUseCase, notificadorViaje: INotificadorViaje);
    ejecutar(dto: SolicitarViajeDto): Promise<Viaje>;
}
