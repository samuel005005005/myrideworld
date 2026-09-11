import { SolicitarViajeUseCase } from '../../aplicacion/casos-uso/solicitar-viaje.use-case.js';
import { SolicitarViajeDto } from '../../aplicacion/dto/solicitar-viaje.dto.js';
import { AceptarViajeUseCase } from '../../aplicacion/casos-uso/aceptar-viaje.use-case.js';
import { MarcarLlegadaUseCase } from '../../aplicacion/casos-uso/marcar-llegada.use-case.js';
import { IniciarViajeUseCase } from '../../aplicacion/casos-uso/iniciar-viaje.use-case.js';
import { CompletarViajeUseCase } from '../../aplicacion/casos-uso/completar-viaje.use-case.js';
import { CancelarViajeUseCase } from '../../aplicacion/casos-uso/cancelar-viaje.use-case.js';
import { AceptarViajeDto } from '../../aplicacion/dto/aceptar-viaje.dto.js';
import { CancelarViajeDto } from '../../aplicacion/dto/cancelar-viaje.dto.js';
export declare class ViajesController {
    private readonly solicitarViaje;
    private readonly aceptarViaje;
    private readonly marcarLlegada;
    private readonly iniciarViaje;
    private readonly completarViaje;
    private readonly cancelarViaje;
    constructor(solicitarViaje: SolicitarViajeUseCase, aceptarViaje: AceptarViajeUseCase, marcarLlegada: MarcarLlegadaUseCase, iniciarViaje: IniciarViajeUseCase, completarViaje: CompletarViajeUseCase, cancelarViaje: CancelarViajeUseCase);
    solicitar(dto: SolicitarViajeDto, req: any): Promise<import("../../dominio/entidades/viaje.entity.js").Viaje>;
    aceptar(id: string, dto: AceptarViajeDto, req: any): Promise<import("../../dominio/entidades/viaje.entity.js").Viaje>;
    llegada(id: string, req: any): Promise<import("../../dominio/entidades/viaje.entity.js").Viaje>;
    iniciar(id: string): Promise<import("../../dominio/entidades/viaje.entity.js").Viaje>;
    completar(id: string): Promise<import("../../dominio/entidades/viaje.entity.js").Viaje>;
    cancelar(id: string, dto: CancelarViajeDto, req: any): Promise<import("../../dominio/entidades/viaje.entity.js").Viaje>;
}
