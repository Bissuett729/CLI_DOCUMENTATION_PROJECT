import { Module } from '@nestjs/common';

import { cliDocumentationProviders } from './providers/cliDocumentation.providers';
import { MongoConnectionModule } from 'src/config/mongo-connection/mongo-connection.module';

import { CommandController } from './controllers/command.controller';
import { GroupController } from './controllers/group.controller';

import { CommandService } from './services/command/command.service';
import { GroupService } from './services/command/group.service';
import { EventsGateway } from 'src/common/gateway/gateway';

@Module({
    imports: [MongoConnectionModule],
    controllers: [
        CommandController,
        GroupController
    ],
    providers: [
        CommandService,
        GroupService,
        EventsGateway,
        ...cliDocumentationProviders
    ]
})
export class CliDocumentationModule {}