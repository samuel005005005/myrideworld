import type { ITarifaRepository } from '../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { EstimarTarifaDto } from '../dto/estimar-tarifa.dto.js';
export declare class EstimarTarifaUseCase {
    private readonly tarifaRepository;
    private readonly configRepo;
    constructor(tarifaRepository: ITarifaRepository, configRepo: IConfiguracionRepository);
    ejecutar(dto: EstimarTarifaDto): Promise<Tarifa>;
}
