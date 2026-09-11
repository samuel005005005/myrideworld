import { CrearPasajeroUseCase } from '../../aplicacion/casos-uso/crear-pasajero.use-case.js';
import { ObtenerPasajeroUseCase } from '../../aplicacion/casos-uso/obtener-pasajero.use-case.js';
import { ActualizarPasajeroUseCase } from '../../aplicacion/casos-uso/actualizar-pasajero.use-case.js';
import { CrearPasajeroDto } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { ActualizarPasajeroDto } from '../../aplicacion/dto/actualizar-pasajero.dto.js';
import { PasajeroResponseDto } from '../../aplicacion/dto/pasajero-response.dto.js';
export declare class PasajerosController {
    private readonly crearPasajero;
    private readonly obtenerPasajero;
    private readonly actualizarPasajero;
    constructor(crearPasajero: CrearPasajeroUseCase, obtenerPasajero: ObtenerPasajeroUseCase, actualizarPasajero: ActualizarPasajeroUseCase);
    crear(dto: CrearPasajeroDto): Promise<PasajeroResponseDto>;
    obtenerPerfil(req: any): Promise<PasajeroResponseDto>;
    actualizarPerfil(req: any, dto: ActualizarPasajeroDto): Promise<PasajeroResponseDto>;
}
