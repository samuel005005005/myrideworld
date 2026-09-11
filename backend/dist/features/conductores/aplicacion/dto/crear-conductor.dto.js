import { z } from 'zod';
export const crearConductorSchema = z.object({
    nombreCompleto: z.string().min(1, 'El nombre es obligatorio').max(100),
    email: z.string().email('El email no es válido'),
    telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    vehiculoMarca: z.string().min(1, 'La marca es obligatoria'),
    vehiculoModelo: z.string().min(1, 'El modelo es obligatorio'),
    vehiculoColor: z.string().min(1, 'El color es obligatorio'),
    vehiculoPlaca: z.string().min(1, 'La placa es obligatoria'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
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
//# sourceMappingURL=crear-conductor.dto.js.map