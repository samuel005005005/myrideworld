import { z } from 'zod';
export declare const calificarConductorSchema: z.ZodObject<{
    viajeId: z.ZodString;
    puntuacion: z.ZodNumber;
    comentario: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class CalificarConductorDto {
    viajeId: string;
    puntuacion: number;
    comentario?: string;
}
