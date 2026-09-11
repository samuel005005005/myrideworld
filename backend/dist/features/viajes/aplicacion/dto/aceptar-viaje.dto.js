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
const V = MENSAJES.VALIDACION.VIAJES;
const S = MENSAJES.SWAGGER.VIAJES;
export const aceptarViajeSchema = z.object({
    conductorId: z.string().uuid(V.CONDUCTOR_ID_UUID),
});
export class AceptarViajeDto {
    conductorId;
}
__decorate([
    ApiProperty({ example: MENSAJES.SWAGGER.COMUNES.EJEMPLO_UUID_2, description: S.DESC_CONDUCTOR_ID }),
    __metadata("design:type", String)
], AceptarViajeDto.prototype, "conductorId", void 0);
//# sourceMappingURL=aceptar-viaje.dto.js.map