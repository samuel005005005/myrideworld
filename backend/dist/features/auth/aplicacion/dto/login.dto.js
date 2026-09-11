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
export const loginSchema = z.object({
    email: z.string().email('El email no es válido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
    rol: z.enum(['PASAJERO', 'CONDUCTOR']),
});
export class LoginDto {
    email;
    password;
    rol;
}
__decorate([
    ApiProperty({ example: 'pasajero@example.com', description: 'Correo del usuario' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: '123456', description: 'Contraseña secreta' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    ApiProperty({ enum: ['PASAJERO', 'CONDUCTOR'], example: 'PASAJERO' }),
    __metadata("design:type", String)
], LoginDto.prototype, "rol", void 0);
//# sourceMappingURL=login.dto.js.map