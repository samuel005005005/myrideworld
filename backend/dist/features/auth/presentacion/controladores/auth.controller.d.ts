import { LoginUseCase } from '../../aplicacion/casos-uso/login.use-case.js';
import type { LoginDto } from '../../aplicacion/dto/login.dto.js';
export declare class AuthController {
    private readonly loginUseCase;
    constructor(loginUseCase: LoginUseCase);
    login(dto: LoginDto): Promise<{
        token: string;
    }>;
}
