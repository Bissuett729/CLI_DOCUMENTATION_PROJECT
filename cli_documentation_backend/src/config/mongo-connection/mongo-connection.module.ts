import { Module } from '@nestjs/common';
import { MongoConnectionService } from './mongo-connection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('env.DB_URI'),
        maxPoolSize: 500,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 60000,
        retryReads:true,
        writeConcern: {
          w: 'majority',
          j: true,
          wtimeout: 5000
        },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [ MongoConnectionService ],
  exports: [ MongoConnectionService ],
})
export class MongoConnectionModule {}
