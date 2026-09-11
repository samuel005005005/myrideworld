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
export const solicitarViajeSchema = z.object({
    pasajeroId: z.string().uuid(),
    origenLat: z.number().min(-90).max(90),
    origenLng: z.number().min(-180).max(180),
    destinoLat: z.number().min(-90).max(90),
    destinoLng: z.number().min(-180).max(180),
});
export class SolicitarViajeDto {
    pasajeroId;
    origenLat;
    origenLng;
    destinoLat;
    destinoLng;
}
__decorate([
    ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], SolicitarViajeDto.prototype, "pasajeroId", void 0);
__decorate([
    ApiProperty({ example: -34.6037, description: 'Latitud de origen' }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "origenLat", void 0);
__decorate([
    ApiProperty({ example: -58.3816, description: 'Longitud de origen' }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "origenLng", void 0);
__decorate([
    ApiProperty({ example: -34.5837, description: 'Latitud de destino' }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "destinoLat", void 0);
__decorate([
    ApiProperty({ example: -58.4016, description: 'Longitud de destino' }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "destinoLng", void 0);
//# sourceMappingURL=solicitar-viaje.dto.js.map