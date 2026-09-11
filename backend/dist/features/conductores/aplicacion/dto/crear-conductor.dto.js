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
const V = MENSAJES.VALIDACION;
const S = MENSAJES.SWAGGER;
export const crearConductorSchema = z.object({
    nombreCompleto: z.string().min(1, V.COMUNES.NOMBRE_OBLIGATORIO).max(100),
    email: z.email({ error: V.COMUNES.EMAIL_INVALIDO }),
    telefono: z.string().min(8, V.COMUNES.TELEFONO_MIN),
    vehiculoMarca: z.string().min(1, V.CONDUCTORES.MARCA_OBLIGATORIA),
    vehiculoModelo: z.string().min(1, V.CONDUCTORES.MODELO_OBLIGATORIO),
    vehiculoColor: z.string().min(1, V.CONDUCTORES.COLOR_OBLIGATORIO),
    vehiculoPlaca: z.string().min(1, V.CONDUCTORES.PLACA_OBLIGATORIA),
    password: z.string().min(6, V.COMUNES.PASSWORD_MIN),
});
export class CrearConductorDto {
    nombreCompleto;
    email;
    telefono;
    vehiculoMarca;
    vehiculoModelo;
    vehiculoColor;
    vehiculoPlaca;
    password;
}
__decorate([
    ApiProperty({ example: S.CONDUCTORES.EJEMPLO_NOMBRE, description: S.CONDUCTORES.DESC_NOMBRE }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "nombreCompleto", void 0);
__decorate([
    ApiProperty({ example: S.COMUNES.EJEMPLO_EMAIL, description: S.COMUNES.DESC_EMAIL }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: S.COMUNES.EJEMPLO_TELEFONO, description: S.COMUNES.DESC_TELEFONO }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "telefono", void 0);
__decorate([
    ApiProperty({ example: S.CONDUCTORES.EJEMPLO_MARCA }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "vehiculoMarca", void 0);
__decorate([
    ApiProperty({ example: S.CONDUCTORES.EJEMPLO_MODELO }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "vehiculoModelo", void 0);
__decorate([
    ApiProperty({ example: S.CONDUCTORES.EJEMPLO_COLOR }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "vehiculoColor", void 0);
__decorate([
    ApiProperty({ example: S.CONDUCTORES.EJEMPLO_PLACA }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "vehiculoPlaca", void 0);
__decorate([
    ApiProperty({ example: S.COMUNES.EJEMPLO_PASSWORD, description: S.COMUNES.DESC_PASSWORD, required: false }),
    __metadata("design:type", String)
], CrearConductorDto.prototype, "password", void 0);
//# sourceMappingURL=crear-conductor.dto.js.map