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
import { EstadosTarifa } from '../../../../../compartidos/constantes/estados-tarifa.enum.js';
let TarifaOrmEntity = class TarifaOrmEntity {
    id;
    origen;
    destino;
    precio;
    estado;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], TarifaOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], TarifaOrmEntity.prototype, "origen", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], TarifaOrmEntity.prototype, "destino", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TarifaOrmEntity.prototype, "precio", void 0);
__decorate([
    Column({ type: 'varchar', default: EstadosTarifa.ACTIVO }),
    __metadata("design:type", String)
], TarifaOrmEntity.prototype, "estado", void 0);
TarifaOrmEntity = __decorate([
    Entity('tarifas')
], TarifaOrmEntity);
export { TarifaOrmEntity };
//# sourceMappingURL=tarifa.orm-entity.js.map