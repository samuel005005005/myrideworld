var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
const S = MENSAJES.SWAGGER.VIAJES;
export const cancelarViajeSchema = z.object({
    motivo: z.string().optional(),
});
export class CancelarViajeDto {
    motivo;
}
__decorate([
    ApiProperty({ required: false, example: S.EJEMPLO_MOTIVO }),
    __metadata("design:type", String)
], CancelarViajeDto.prototype, "motivo", void 0);
//# sourceMappingURL=cancelar-viaje.dto.js.map