import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import type { IGeneradorToken } from '../puertos/generador-token.port.js';
export declare class LoginUseCase {
    private readonly generadorToken;
    private readonly configService;
    private readonly pasajeroRepository;
    private readonly conductorRepository;
    private readonly hasheadorPassword;
    constructor(generadorToken: IGeneradorToken, configService: ConfigService, pasajeroRepository: IPasajeroRepository, conductorRepository: IConductorRepository, hasheadorPassword: IHasheadorPassword);
    ejecutar(dto: LoginDto): Promise<{
        token: string;
    }>;
}
