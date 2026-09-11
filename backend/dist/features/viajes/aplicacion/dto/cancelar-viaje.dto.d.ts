import { z } from 'zod';
export declare const cancelarViajeSchema: z.ZodObject<{
    motivo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare class CancelarViajeDto {
    motivo?: string;
}
