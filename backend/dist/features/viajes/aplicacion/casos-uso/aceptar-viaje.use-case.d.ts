import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { AceptarViajeDto } from '../dto/aceptar-viaje.dto.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
export declare class AceptarViajeUseCase {
    private readonly viajeRepository;
    private readonly viajesGateway;
    constructor(viajeRepository: IViajeRepository, viajesGateway: ViajesGateway);
    ejecutar(viajeId: string, dto: AceptarViajeDto): Promise<Viaje>;
}
