import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
export declare class CancelarViajeUseCase {
    private readonly viajeRepository;
    private readonly notificadorViaje;
    constructor(viajeRepository: IViajeRepository, notificadorViaje: INotificadorViaje);
    ejecutar(viajeId: string, actorId: string, rol: Roles, motivo?: string): Promise<Viaje>;
}
