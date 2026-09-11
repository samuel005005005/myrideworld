import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { SolicitarViajeDto } from '../dto/solicitar-viaje.dto.js';
import { EstimarTarifaUseCase } from '../../../tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
export declare class SolicitarViajeUseCase {
    private readonly viajeRepository;
    private readonly conductorRepository;
    private readonly estimarTarifa;
    private readonly viajesGateway;
    constructor(viajeRepository: IViajeRepository, conductorRepository: IConductorRepository, estimarTarifa: EstimarTarifaUseCase, viajesGateway: ViajesGateway);
    ejecutar(dto: SolicitarViajeDto): Promise<Viaje>;
}
