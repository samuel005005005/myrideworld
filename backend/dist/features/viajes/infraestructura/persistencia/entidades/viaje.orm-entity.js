var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PasajeroOrmEntity } from '../../../../pasajeros/infraestructura/persistencia/entidades/pasajero.orm-entity.js';
import { ConductorOrmEntity } from '../../../../conductores/infraestructura/persistencia/entidades/conductor.orm-entity.js';
import { EstadosViaje } from '../../../../../compartidos/constantes/estados-viaje.enum.js';
let ViajeOrmEntity = class ViajeOrmEntity {
    id;
    pasajeroId;
    pasajero;
    conductorId;
    conductor;
    origenLat;
    origenLng;
    destinoLat;
    destinoLng;
    estado;
    tarifaEstimada;
    metodoPago;
    canceladoPor;
    motivoCancelacion;
    fechaSolicitud;
    fechaInicio;
    fechaFin;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid' }),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "pasajeroId", void 0);
__decorate([
    ManyToOne(() => PasajeroOrmEntity),
    JoinColumn({ name: 'pasajeroId' }),
    __metadata("design:type", PasajeroOrmEntity)
], ViajeOrmEntity.prototype, "pasajero", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "conductorId", void 0);
__decorate([
    ManyToOne(() => ConductorOrmEntity, { nullable: true }),
    JoinColumn({ name: 'conductorId' }),
    __metadata("design:type", ConductorOrmEntity)
], ViajeOrmEntity.prototype, "conductor", void 0);
__decorate([
    Column({ type: 'float' }),
    __metadata("design:type", Number)
], ViajeOrmEntity.prototype, "origenLat", void 0);
__decorate([
    Column({ type: 'float' }),
    __metadata("design:type", Number)
], ViajeOrmEntity.prototype, "origenLng", void 0);
__decorate([
    Column({ type: 'float' }),
    __metadata("design:type", Number)
], ViajeOrmEntity.prototype, "destinoLat", void 0);
__decorate([
    Column({ type: 'float' }),
    __metadata("design:type", Number)
], ViajeOrmEntity.prototype, "destinoLng", void 0);
__decorate([
    Column({ type: 'varchar', default: EstadosViaje.SOLICITADO }),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "estado", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ViajeOrmEntity.prototype, "tarifaEstimada", void 0);
__decorate([
    Column({ name: 'metodo_pago', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "metodoPago", void 0);
__decorate([
    Column({ name: 'cancelado_por', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "canceladoPor", void 0);
__decorate([
    Column({ name: 'motivo_cancelacion', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ViajeOrmEntity.prototype, "motivoCancelacion", void 0);
__decorate([
    Column({ name: 'fecha_solicitud', type: 'timestamp' }),
    __metadata("design:type", Date)
], ViajeOrmEntity.prototype, "fechaSolicitud", void 0);
__decorate([
    Column({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ViajeOrmEntity.prototype, "fechaInicio", void 0);
__decorate([
    Column({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ViajeOrmEntity.prototype, "fechaFin", void 0);
ViajeOrmEntity = __decorate([
    Entity('viajes')
], ViajeOrmEntity);
export { ViajeOrmEntity };
//# sourceMappingURL=viaje.orm-entity.js.map