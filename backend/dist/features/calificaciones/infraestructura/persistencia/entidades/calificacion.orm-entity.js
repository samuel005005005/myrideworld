var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
let CalificacionOrmEntity = class CalificacionOrmEntity {
    id;
    viajeId;
    pasajeroId;
    conductorId;
    puntuacion;
    comentario;
    fecha;
};
__decorate([
    PrimaryColumn('uuid'),
    __metadata("design:type", String)
], CalificacionOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ name: 'viaje_id', type: 'uuid', unique: true }),
    __metadata("design:type", String)
], CalificacionOrmEntity.prototype, "viajeId", void 0);
__decorate([
    Column({ name: 'pasajero_id', type: 'uuid' }),
    __metadata("design:type", String)
], CalificacionOrmEntity.prototype, "pasajeroId", void 0);
__decorate([
    Column({ name: 'conductor_id', type: 'uuid' }),
    __metadata("design:type", String)
], CalificacionOrmEntity.prototype, "conductorId", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], CalificacionOrmEntity.prototype, "puntuacion", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CalificacionOrmEntity.prototype, "comentario", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], CalificacionOrmEntity.prototype, "fecha", void 0);
CalificacionOrmEntity = __decorate([
    Entity('calificaciones')
], CalificacionOrmEntity);
export { CalificacionOrmEntity };
//# sourceMappingURL=calificacion.orm-entity.js.map