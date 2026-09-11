import { ViajeOrmEntity } from '../../../../viajes/infraestructura/persistencia/entidades/viaje.orm-entity.js';
import { ConductorOrmEntity } from '../../../../conductores/infraestructura/persistencia/entidades/conductor.orm-entity.js';
export declare class PagoBalanceOrmEntity {
    id: string;
    viajeId: string;
    viaje: ViajeOrmEntity;
    conductorId: string;
    conductor: ConductorOrmEntity;
    montoBruto: number;
    feeProcesamiento: number;
    montoNeto: number;
    metodo: string;
    fecha: Date;
}
