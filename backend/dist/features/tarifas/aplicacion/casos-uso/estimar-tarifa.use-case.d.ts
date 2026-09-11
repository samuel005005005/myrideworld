import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
export interface EstimarTarifaDto {
    origenLat: number;
    origenLng: number;
    destinoLat: number;
    destinoLng: number;
}
export declare class EstimarTarifaUseCase {
    private readonly tarifaRepository;
    private readonly configRepo;
    constructor(tarifaRepository: ITarifaRepository, configRepo: IConfiguracionRepository);
    ejecutar(dto: EstimarTarifaDto): Promise<Tarifa>;
}
