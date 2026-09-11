var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
let ConductorOrmEntity = class ConductorOrmEntity {
    id;
    nombreCompleto;
    email;
    telefono;
    passwordHash;
    fotoUrl;
    vehiculoMarca;
    vehiculoModelo;
    vehiculoColor;
    vehiculoPlaca;
    estadoAprobacion;
    estadoDisponibilidad;
    ultimaUbicacionLat;
    ultimaUbicacionLng;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "nombreCompleto", void 0);
__decorate([
    Column({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "email", void 0);
__decorate([
    Column({ name: 'telefono', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "telefono", void 0);
__decorate([
    Column({ name: 'password_hash', type: 'varchar' }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "passwordHash", void 0);
__decorate([
    Column({ name: 'foto_url', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "fotoUrl", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "vehiculoMarca", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "vehiculoModelo", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "vehiculoColor", void 0);
__decorate([
    Column({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "vehiculoPlaca", void 0);
__decorate([
    Column({ type: 'varchar', default: 'Pendiente' }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "estadoAprobacion", void 0);
__decorate([
    Column({ type: 'varchar', default: 'Desconectado' }),
    __metadata("design:type", String)
], ConductorOrmEntity.prototype, "estadoDisponibilidad", void 0);
__decorate([
    Column({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], ConductorOrmEntity.prototype, "ultimaUbicacionLat", void 0);
__decorate([
    Column({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], ConductorOrmEntity.prototype, "ultimaUbicacionLng", void 0);
ConductorOrmEntity = __decorate([
    Entity('conductores')
], ConductorOrmEntity);
export { ConductorOrmEntity };
//# sourceMappingURL=conductor.orm-entity.js.map