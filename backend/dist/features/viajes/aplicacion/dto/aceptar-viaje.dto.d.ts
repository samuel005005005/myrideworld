import { z } from 'zod';
export declare const aceptarViajeSchema: z.ZodObject<{
    conductorId: z.ZodString;
}, z.core.$strip>;
export declare class AceptarViajeDto {
    conductorId: string;
}
