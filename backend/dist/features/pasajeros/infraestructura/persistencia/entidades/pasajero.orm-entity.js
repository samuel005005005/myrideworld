var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { EstadosPasajero } from '../../../../../compartidos/constantes/estados-pasajero.enum.js';
let PasajeroOrmEntity = class PasajeroOrmEntity {
    id;
    nombreCompleto;
    email;
    telefono;
    passwordHash;
    fechaRegistro;
    estado;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PasajeroOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PasajeroOrmEntity.prototype, "nombreCompleto", void 0);
__decorate([
    Column({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], PasajeroOrmEntity.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], PasajeroOrmEntity.prototype, "telefono", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], PasajeroOrmEntity.prototype, "passwordHash", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], PasajeroOrmEntity.prototype, "fechaRegistro", void 0);
__decorate([
    Column({ type: 'varchar', default: EstadosPasajero.ACTIVO }),
    __metadata("design:type", String)
], PasajeroOrmEntity.prototype, "estado", void 0);
PasajeroOrmEntity = __decorate([
    Entity('pasajeros')
], PasajeroOrmEntity);
export { PasajeroOrmEntity };
//# sourceMappingURL=pasajero.orm-entity.js.map