import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
export declare class MarcarLlegadaUseCase {
    private readonly viajeRepository;
    private readonly notificadorViaje;
    constructor(viajeRepository: IViajeRepository, notificadorViaje: INotificadorViaje);
    ejecutar(viajeId: string, conductorId: string): Promise<Viaje>;
}
