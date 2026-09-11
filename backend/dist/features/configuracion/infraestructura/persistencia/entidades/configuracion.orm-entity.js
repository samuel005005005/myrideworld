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
let ConfiguracionOrmEntity = class ConfiguracionOrmEntity {
    id;
    clave;
    valor;
    descripcion;
    actualizadoEn;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ConfiguracionOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], ConfiguracionOrmEntity.prototype, "clave", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ConfiguracionOrmEntity.prototype, "valor", void 0);
__decorate([
    Column({ default: '' }),
    __metadata("design:type", String)
], ConfiguracionOrmEntity.prototype, "descripcion", void 0);
__decorate([
    Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ConfiguracionOrmEntity.prototype, "actualizadoEn", void 0);
ConfiguracionOrmEntity = __decorate([
    Entity('configuraciones')
], ConfiguracionOrmEntity);
export { ConfiguracionOrmEntity };
//# sourceMappingURL=configuracion.orm-entity.js.map