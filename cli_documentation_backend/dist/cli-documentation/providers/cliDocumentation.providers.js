"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cliDocumentationProviders = void 0;
const mongo_connection_service_1 = require("../../config/mongo-connection/mongo-connection.service");
const group_schema_1 = require("../schemas/group.schema");
const command_schema_1 = require("../schemas/command.schema");
exports.cliDocumentationProviders = [
    {
        provide: 'GROUP_MODEL',
        useFactory: (db) => db.getConnection().model('group_db', group_schema_1.GroupSchema, 'group_db'),
        inject: [mongo_connection_service_1.MongoConnectionService],
    },
    {
        provide: 'COMMAND_MODEL',
        useFactory: (db) => db.getConnection().model('command_db', command_schema_1.CommandSchema, 'command_db'),
        inject: [mongo_connection_service_1.MongoConnectionService],
    },
];
//# sourceMappingURL=cliDocumentation.providers.js.map