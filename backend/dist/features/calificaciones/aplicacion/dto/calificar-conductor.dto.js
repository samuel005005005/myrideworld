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
export const calificarConductorSchema = z.object({
    viajeId: z.string().uuid(),
    puntuacion: z.number().int().min(1).max(5),
    comentario: z.string().optional(),
});
export class CalificarConductorDto {
    viajeId;
    puntuacion;
    comentario;
}
__decorate([
    ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del Viaje completado' }),
    __metadata("design:type", String)
], CalificarConductorDto.prototype, "viajeId", void 0);
__decorate([
    ApiProperty({ example: 5, description: 'Calificación de 1 a 5 estrellas' }),
    __metadata("design:type", Number)
], CalificarConductorDto.prototype, "puntuacion", void 0);
__decorate([
    ApiProperty({ example: 'Excelente conductor, muy amable.', required: false }),
    __metadata("design:type", String)
], CalificarConductorDto.prototype, "comentario", void 0);
//# sourceMappingURL=calificar-conductor.dto.js.map