import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    checkPortalSession(req: any): Promise<{
        access_token?: string | undefined;
        user?: any;
        authenticated: boolean;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    createInitialAdmin(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
    resetPassword(data: {
        carnet: string;
        password: any;
    }): Promise<{
        message: string;
    }>;
    ssoLogin(token: string): Promise<{
        access_token: string;
        user: any;
    } | null>;
}
