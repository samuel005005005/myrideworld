import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
export declare class CancelarViajeUseCase {
    private readonly viajeRepository;
    private readonly viajesGateway;
    constructor(viajeRepository: IViajeRepository, viajesGateway: ViajesGateway);
    ejecutar(viajeId: string, actorId: string, rol: Roles, motivo?: string): Promise<Viaje>;
}
