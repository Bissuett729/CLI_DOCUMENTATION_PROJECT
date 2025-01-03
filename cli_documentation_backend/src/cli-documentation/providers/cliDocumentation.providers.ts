import { MongoConnectionService } from 'src/config/mongo-connection/mongo-connection.service';
import { commandsDataInterface } from '../interfaces/command.interface';
import { groupDataInterface } from '../interfaces/group.interface';
import { GroupSchema } from '../schemas/group.schema';
import { CommandSchema } from '../schemas/command.schema';

export const cliDocumentationProviders = [
  {
    provide: 'GROUP_MODEL',
    useFactory: (db: MongoConnectionService) => db.getConnection().model<groupDataInterface>('group_db', GroupSchema, 'group_db'),
    inject: [MongoConnectionService],
  },
  {
    provide: 'COMMAND_MODEL',
    useFactory: (db: MongoConnectionService) => db.getConnection().model<commandsDataInterface>('command_db', CommandSchema, 'command_db'),
    inject: [MongoConnectionService],
  },
];