var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ViajeOrmEntity } from '../../../../viajes/infraestructura/persistencia/entidades/viaje.orm-entity.js';
import { ConductorOrmEntity } from '../../../../conductores/infraestructura/persistencia/entidades/conductor.orm-entity.js';
let PagoBalanceOrmEntity = class PagoBalanceOrmEntity {
    id;
    viajeId;
    viaje;
    conductorId;
    conductor;
    montoBruto;
    feeProcesamiento;
    montoNeto;
    metodo;
    fecha;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PagoBalanceOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid' }),
    __metadata("design:type", String)
], PagoBalanceOrmEntity.prototype, "viajeId", void 0);
__decorate([
    ManyToOne(() => ViajeOrmEntity),
    JoinColumn({ name: 'viajeId' }),
    __metadata("design:type", ViajeOrmEntity)
], PagoBalanceOrmEntity.prototype, "viaje", void 0);
__decorate([
    Column({ type: 'uuid' }),
    __metadata("design:type", String)
], PagoBalanceOrmEntity.prototype, "conductorId", void 0);
__decorate([
    ManyToOne(() => ConductorOrmEntity),
    JoinColumn({ name: 'conductorId' }),
    __metadata("design:type", ConductorOrmEntity)
], PagoBalanceOrmEntity.prototype, "conductor", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PagoBalanceOrmEntity.prototype, "montoBruto", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PagoBalanceOrmEntity.prototype, "feeProcesamiento", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PagoBalanceOrmEntity.prototype, "montoNeto", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], PagoBalanceOrmEntity.prototype, "metodo", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], PagoBalanceOrmEntity.prototype, "fecha", void 0);
PagoBalanceOrmEntity = __decorate([
    Entity('pagos_balances')
], PagoBalanceOrmEntity);
export { PagoBalanceOrmEntity };
//# sourceMappingURL=pago-balance.orm-entity.js.map