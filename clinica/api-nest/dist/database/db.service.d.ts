import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class DbService implements OnApplicationBootstrap, OnApplicationShutdown {
    private configService;
    private pool;
    private readonly logger;
    constructor(configService: ConfigService);
    onApplicationBootstrap(): Promise<void>;
    onApplicationShutdown(): Promise<void>;
    execute<T>(procedure: string, params?: Record<string, any>): Promise<T[]>;
    executeOne<T>(procedure: string, params?: Record<string, any>): Promise<T | null>;
    executeNonQuery(procedure: string, params?: Record<string, any>): Promise<void>;
    query<T>(sqlString: string, params?: Record<string, any>): Promise<T[]>;
}
