import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
export declare class IniciarViajeUseCase {
    private readonly viajeRepository;
    constructor(viajeRepository: IViajeRepository);
    ejecutar(viajeId: string): Promise<Viaje>;
}
