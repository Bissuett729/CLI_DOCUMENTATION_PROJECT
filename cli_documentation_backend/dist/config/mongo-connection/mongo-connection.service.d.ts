import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
export declare class MongoConnectionService {
    private configSrvc;
    private dbConnection;
    private readonly logger;
    constructor(configSrvc: ConfigService);
    createConnectionDB(): void;
    getConnection(): mongoose.Connection;
}
