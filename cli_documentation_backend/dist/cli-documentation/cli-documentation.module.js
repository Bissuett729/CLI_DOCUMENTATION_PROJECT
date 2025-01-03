"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliDocumentationModule = void 0;
const common_1 = require("@nestjs/common");
const cliDocumentation_providers_1 = require("./providers/cliDocumentation.providers");
const mongo_connection_module_1 = require("../config/mongo-connection/mongo-connection.module");
const command_controller_1 = require("./controllers/command.controller");
const group_controller_1 = require("./controllers/group.controller");
const command_service_1 = require("./services/command/command.service");
const group_service_1 = require("./services/command/group.service");
const gateway_1 = require("../common/gateway/gateway");
let CliDocumentationModule = class CliDocumentationModule {
};
exports.CliDocumentationModule = CliDocumentationModule;
exports.CliDocumentationModule = CliDocumentationModule = __decorate([
    (0, common_1.Module)({
        imports: [mongo_connection_module_1.MongoConnectionModule],
        controllers: [
            command_controller_1.CommandController,
            group_controller_1.GroupController
        ],
        providers: [
            command_service_1.CommandService,
            group_service_1.GroupService,
            gateway_1.EventsGateway,
            ...cliDocumentation_providers_1.cliDocumentationProviders
        ]
    })
], CliDocumentationModule);
//# sourceMappingURL=cli-documentation.module.js.map