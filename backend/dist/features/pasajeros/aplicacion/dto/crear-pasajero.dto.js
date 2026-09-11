import { z } from 'zod';
export const crearPasajeroSchema = z.object({
    nombreCompleto: z.string().min(1, 'El nombre es obligatorio').max(100),
    email: z.string().email('El email no es válido'),
    telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
//# sourceMappingURL=crear-pasajero.dto.js.map