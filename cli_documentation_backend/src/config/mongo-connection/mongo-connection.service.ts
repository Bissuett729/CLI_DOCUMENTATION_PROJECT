import { Injectable, Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConnectionService {
  private dbConnection: mongoose.Connection;
  private readonly logger = new Logger(MongoConnectionService.name);
  constructor(private configSrvc: ConfigService) {
    this.createConnectionDB();
  }

  createConnectionDB() {
    const DB_URI = this.configSrvc.get('env.DB_URI')
    this.dbConnection = mongoose.createConnection(DB_URI);

    this.dbConnection.once('open', () => {
      this.logger.log(`connected to: ${DB_URI}`);
    });

    this.dbConnection.once('error', () => {
      this.logger.error(`error connecting to ${DB_URI}`);
    });
  }

  getConnection(): mongoose.Connection {
    return this.dbConnection;
  }
}
