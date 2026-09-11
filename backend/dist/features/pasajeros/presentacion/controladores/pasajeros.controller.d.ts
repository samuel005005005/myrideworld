import { CrearPasajeroUseCase } from '../../aplicacion/casos-uso/crear-pasajero.use-case.js';
import type { CrearPasajeroDto } from '../../aplicacion/dto/crear-pasajero.dto.js';
export declare class PasajerosController {
    private readonly crearPasajero;
    constructor(crearPasajero: CrearPasajeroUseCase);
    crear(dto: CrearPasajeroDto): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        estado: import("../../../../compartidos/constantes/estados-pasajero.enum.js").EstadosPasajero;
        fechaRegistro: Date;
    }>;
}
