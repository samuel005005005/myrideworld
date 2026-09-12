import type { IPagoBalanceRepository } from '../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../dominio/entidades/pago-balance.entity.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { GenerarPagoDto } from '../dto/generar-pago.dto.js';
export declare class GenerarPagoUseCase {
    private readonly pagoBalanceRepository;
    private readonly configRepo;
    constructor(pagoBalanceRepository: IPagoBalanceRepository, configRepo: IConfiguracionRepository);
    ejecutar(dto: GenerarPagoDto): Promise<PagoBalance>;
}
