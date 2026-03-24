import { JwtService } from '@nestjs/jwt';
import { DbService } from '../database/db.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private db;
    private jwtService;
    private readonly logger;
    constructor(db: DbService, jwtService: JwtService);
    validateUser(carnet: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    createInitialAdmin(): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<any>;
    resetPassword(carnet: string, newPass: string): Promise<{
        message: string;
    }>;
    validatePortalSession(sid: string): Promise<any>;
    createTokenForUser(user: any): Promise<{
        access_token: string;
        user: any;
    } | null>;
    validateSSOToken(token: string): Promise<any>;
}
