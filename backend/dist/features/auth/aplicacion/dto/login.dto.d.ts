import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rol: z.ZodEnum<{
        PASAJERO: "PASAJERO";
        CONDUCTOR: "CONDUCTOR";
    }>;
}, z.core.$strip>;
export declare class LoginDto {
    email: string;
    password: string;
    rol: 'PASAJERO' | 'CONDUCTOR';
}
