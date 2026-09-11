import { z } from 'zod';
export declare const crearConductorSchema: z.ZodObject<{
    nombreCompleto: z.ZodString;
    email: z.ZodString;
    telefono: z.ZodString;
    vehiculoMarca: z.ZodString;
    vehiculoModelo: z.ZodString;
    vehiculoColor: z.ZodString;
    vehiculoPlaca: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare class CrearConductorDto {
    nombreCompleto: string;
    email: string;
    telefono: string;
    vehiculoMarca: string;
    vehiculoModelo: string;
    vehiculoColor: string;
    vehiculoPlaca: string;
    password?: string;
}
