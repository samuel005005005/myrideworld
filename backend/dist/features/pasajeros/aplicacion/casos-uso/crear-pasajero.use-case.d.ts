import type { IPasajeroRepository } from '../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { CrearPasajeroDto } from '../dto/crear-pasajero.dto.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
export declare class CrearPasajeroUseCase {
    private readonly pasajeroRepository;
    private readonly hasheadorPassword;
    constructor(pasajeroRepository: IPasajeroRepository, hasheadorPassword: IHasheadorPassword);
    ejecutar(dto: CrearPasajeroDto): Promise<Pasajero>;
}
