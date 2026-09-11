import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { ConfigService } from '@nestjs/config';
export declare class LoginUseCase {
    private readonly jwtService;
    private readonly configService;
    private readonly pasajeroRepository;
    private readonly conductorRepository;
    constructor(jwtService: JwtService, configService: ConfigService, pasajeroRepository: IPasajeroRepository, conductorRepository: IConductorRepository);
    ejecutar(dto: LoginDto): Promise<{
        token: string;
    }>;
}
