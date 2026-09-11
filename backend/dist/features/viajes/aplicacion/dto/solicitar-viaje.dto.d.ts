import { z } from 'zod';
export declare const solicitarViajeSchema: z.ZodObject<{
    pasajeroId: z.ZodString;
    origenLat: z.ZodNumber;
    origenLng: z.ZodNumber;
    destinoLat: z.ZodNumber;
    destinoLng: z.ZodNumber;
}, z.core.$strip>;
export declare class SolicitarViajeDto {
    pasajeroId: string;
    origenLat: number;
    origenLng: number;
    destinoLat: number;
    destinoLng: number;
}
