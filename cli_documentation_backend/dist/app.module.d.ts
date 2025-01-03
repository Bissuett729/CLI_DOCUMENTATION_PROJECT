import { ConfigService } from '@nestjs/config';
export declare class AppModule {
    private readonly configService;
    static serverIP: string;
    static DB_HOST: string;
    static DB_PORT: number;
    static DB_USER: string;
    static DB_PASSWORD: string;
    static RUNNIN_PORT: number;
    constructor(configService: ConfigService);
}
