export interface PasajeroProps {
    id?: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    passwordHash: string;
    fechaRegistro?: Date;
    estado?: string;
}
