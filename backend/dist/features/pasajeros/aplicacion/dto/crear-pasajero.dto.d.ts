import { z } from 'zod';
export declare const crearPasajeroSchema: z.ZodObject<{
    nombreCompleto: z.ZodString;
    email: z.ZodString;
    telefono: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type CrearPasajeroDto = z.infer<typeof crearPasajeroSchema>;
