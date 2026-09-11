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
export const solicitarViajeSchema = z.object({
    pasajeroId: z.string().uuid(V.PASAJERO_ID_UUID),
    origenLat: z.number().min(-90, V.LATITUD_INVALIDA).max(90, V.LATITUD_INVALIDA),
    origenLng: z.number().min(-180, V.LONGITUD_INVALIDA).max(180, V.LONGITUD_INVALIDA),
    destinoLat: z.number().min(-90, V.LATITUD_INVALIDA).max(90, V.LATITUD_INVALIDA),
    destinoLng: z.number().min(-180, V.LONGITUD_INVALIDA).max(180, V.LONGITUD_INVALIDA),
});
export class SolicitarViajeDto {
    pasajeroId;
    origenLat;
    origenLng;
    destinoLat;
    destinoLng;
}
__decorate([
    ApiProperty({ example: MENSAJES.SWAGGER.COMUNES.EJEMPLO_UUID, description: S.DESC_PASAJERO_ID }),
    __metadata("design:type", String)
], SolicitarViajeDto.prototype, "pasajeroId", void 0);
__decorate([
    ApiProperty({ example: S.EJEMPLO_LATITUD_ORIGEN, description: S.DESC_LATITUD_ORIGEN }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "origenLat", void 0);
__decorate([
    ApiProperty({ example: S.EJEMPLO_LONGITUD_ORIGEN, description: S.DESC_LONGITUD_ORIGEN }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "origenLng", void 0);
__decorate([
    ApiProperty({ example: S.EJEMPLO_LATITUD_DESTINO, description: S.DESC_LATITUD_DESTINO }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "destinoLat", void 0);
__decorate([
    ApiProperty({ example: S.EJEMPLO_LONGITUD_DESTINO, description: S.DESC_LONGITUD_DESTINO }),
    __metadata("design:type", Number)
], SolicitarViajeDto.prototype, "destinoLng", void 0);
//# sourceMappingURL=solicitar-viaje.dto.js.map