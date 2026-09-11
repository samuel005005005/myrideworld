import { PasajeroOrmEntity } from '../../../../pasajeros/infraestructura/persistencia/entidades/pasajero.orm-entity.js';
import { ConductorOrmEntity } from '../../../../conductores/infraestructura/persistencia/entidades/conductor.orm-entity.js';
export declare class ViajeOrmEntity {
    id: string;
    pasajeroId: string;
    pasajero: PasajeroOrmEntity;
    conductorId: string;
    conductor: ConductorOrmEntity;
    origenLat: number;
    origenLng: number;
    destinoLat: number;
    destinoLng: number;
    estado: string;
    tarifaEstimada: number;
    metodoPago: string;
    canceladoPor: string;
    motivoCancelacion: string;
    fechaSolicitud: Date;
    fechaInicio: Date;
    fechaFin: Date | null;
    conductoresRechazados: string[];
}
