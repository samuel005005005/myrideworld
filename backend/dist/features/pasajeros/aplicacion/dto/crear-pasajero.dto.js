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
const V = MENSAJES.VALIDACION.COMUNES;
const S = MENSAJES.SWAGGER;
export const crearPasajeroSchema = z.object({
    nombreCompleto: z.string().min(1, V.NOMBRE_OBLIGATORIO).max(100),
    email: z.email({ error: V.EMAIL_INVALIDO }),
    telefono: z.string().min(8, V.TELEFONO_MIN),
    password: z.string().min(6, V.PASSWORD_MIN),
});
export class CrearPasajeroDto {
    nombreCompleto;
    email;
    telefono;
    password;
}
__decorate([
    ApiProperty({ example: S.PASAJEROS.EJEMPLO_NOMBRE, description: S.PASAJEROS.DESC_NOMBRE }),
    __metadata("design:type", String)
], CrearPasajeroDto.prototype, "nombreCompleto", void 0);
__decorate([
    ApiProperty({ example: S.COMUNES.EJEMPLO_EMAIL, description: S.COMUNES.DESC_EMAIL }),
    __metadata("design:type", String)
], CrearPasajeroDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: S.COMUNES.EJEMPLO_TELEFONO, description: S.COMUNES.DESC_TELEFONO }),
    __metadata("design:type", String)
], CrearPasajeroDto.prototype, "telefono", void 0);
__decorate([
    ApiProperty({ example: S.COMUNES.EJEMPLO_PASSWORD, description: S.COMUNES.DESC_PASSWORD }),
    __metadata("design:type", String)
], CrearPasajeroDto.prototype, "password", void 0);
//# sourceMappingURL=crear-pasajero.dto.js.map