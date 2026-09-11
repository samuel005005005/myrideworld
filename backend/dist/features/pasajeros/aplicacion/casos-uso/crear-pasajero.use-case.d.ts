import type { IPasajeroRepository } from '../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { CrearPasajeroDto } from '../dto/crear-pasajero.dto.js';
export declare class CrearPasajeroUseCase {
    private readonly pasajeroRepository;
    constructor(pasajeroRepository: IPasajeroRepository);
    ejecutar(dto: CrearPasajeroDto): Promise<Pasajero>;
}
