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
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
const V = MENSAJES.VALIDACION.COMUNES;
const S = MENSAJES.SWAGGER.COMUNES;
export const loginSchema = z.object({
    email: z.email({ error: V.EMAIL_INVALIDO }),
    password: z.string().min(1, V.PASSWORD_MIN),
    rol: z.enum([Roles.PASAJERO, Roles.CONDUCTOR, Roles.ADMIN]),
});
export class LoginDto {
    email;
    password;
    rol;
}
__decorate([
    ApiProperty({ example: S.EJEMPLO_EMAIL, description: S.DESC_EMAIL }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: S.EJEMPLO_PASSWORD, description: S.DESC_PASSWORD }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    ApiProperty({ enum: Roles, example: Roles.PASAJERO }),
    __metadata("design:type", String)
], LoginDto.prototype, "rol", void 0);
//# sourceMappingURL=login.dto.js.map