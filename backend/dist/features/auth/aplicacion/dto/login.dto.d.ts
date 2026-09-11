import { z } from 'zod';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rol: z.ZodEnum<{
        PASAJERO: Roles.PASAJERO;
        CONDUCTOR: Roles.CONDUCTOR;
    }>;
}, z.core.$strip>;
export declare class LoginDto {
    email: string;
    password: string;
    rol: Roles;
}
