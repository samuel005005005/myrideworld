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
const V = MENSAJES.VALIDACION.CALIFICACIONES;
const S = MENSAJES.SWAGGER.CALIFICACIONES;
export const calificarConductorSchema = z.object({
    viajeId: z.string().uuid(V.VIAJE_ID_UUID),
    puntuacion: z.number().int().min(1, V.PUNTUACION_RANGO).max(5, V.PUNTUACION_RANGO),
    comentario: z.string().optional(),
});
export class CalificarConductorDto {
    viajeId;
    puntuacion;
    comentario;
}
__decorate([
    ApiProperty({ example: MENSAJES.SWAGGER.COMUNES.EJEMPLO_UUID, description: S.DESC_VIAJE_ID }),
    __metadata("design:type", String)
], CalificarConductorDto.prototype, "viajeId", void 0);
__decorate([
    ApiProperty({ example: 5, description: S.DESC_PUNTUACION }),
    __metadata("design:type", Number)
], CalificarConductorDto.prototype, "puntuacion", void 0);
__decorate([
    ApiProperty({ example: S.EJEMPLO_COMENTARIO, required: false }),
    __metadata("design:type", String)
], CalificarConductorDto.prototype, "comentario", void 0);
//# sourceMappingURL=calificar-conductor.dto.js.map