import { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
export declare class CancelarViajeUseCase {
    private readonly viajeRepository;
    private readonly viajesGateway;
    constructor(viajeRepository: IViajeRepository, viajesGateway: ViajesGateway);
    ejecutar(viajeId: string, actorId: string, rol: 'PASAJERO' | 'CONDUCTOR', motivo?: string): Promise<Viaje>;
}
