import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
export declare class MarcarLlegadaUseCase {
    private readonly viajeRepository;
    private readonly viajesGateway;
    constructor(viajeRepository: IViajeRepository, viajesGateway: ViajesGateway);
    ejecutar(viajeId: string, conductorId: string): Promise<Viaje>;
}
