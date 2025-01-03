import { Module } from '@nestjs/common';
import { CliDocumentationModule } from './cli-documentation/cli-documentation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongoConnectionModule } from './config/mongo-connection/mongo-connection.module';
import configMongo from './config/configuration';
import * as dotenv from 'dotenv';
import { validate } from './env.validation';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      load: [configMongo],
      isGlobal: true,
      expandVariables: true,
    }),
    MongoConnectionModule,
    CliDocumentationModule,
  ],
})
export class AppModule {
  static serverIP: string;
  static DB_HOST: string;
  static DB_PORT: number;
  static DB_USER: string;
  static DB_PASSWORD: string;
  static RUNNIN_PORT: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.DB_HOST = this.configService.get('DB_HOST');
    AppModule.DB_PORT = this.configService.get('DB_PORT');
    AppModule.DB_USER = this.configService.get('DB_USER');
    AppModule.DB_PASSWORD = this.configService.get('DB_PASSWORD');
    AppModule.RUNNIN_PORT = this.configService.get('RUNNIN_PORT');
    AppModule.serverIP = '192.168.100.8';
  }
}
