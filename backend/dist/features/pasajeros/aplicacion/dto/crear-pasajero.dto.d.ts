import { z } from 'zod';
export declare const crearPasajeroSchema: z.ZodObject<{
    nombreCompleto: z.ZodString;
    email: z.ZodEmail;
    telefono: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare class CrearPasajeroDto {
    nombreCompleto: string;
    email: string;
    telefono: string;
    password: string;
}
