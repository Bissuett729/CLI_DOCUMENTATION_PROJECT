"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cli_documentation_module_1 = require("./cli-documentation/cli-documentation.module");
const config_1 = require("@nestjs/config");
const mongo_connection_module_1 = require("./config/mongo-connection/mongo-connection.module");
const configuration_1 = require("./config/configuration");
const dotenv = require("dotenv");
const env_validation_1 = require("./env.validation");
dotenv.config();
let AppModule = AppModule_1 = class AppModule {
    constructor(configService) {
        this.configService = configService;
        AppModule_1.DB_HOST = this.configService.get('DB_HOST');
        AppModule_1.DB_PORT = this.configService.get('DB_PORT');
        AppModule_1.DB_USER = this.configService.get('DB_USER');
        AppModule_1.DB_PASSWORD = this.configService.get('DB_PASSWORD');
        AppModule_1.RUNNIN_PORT = this.configService.get('RUNNIN_PORT');
        AppModule_1.serverIP = '192.168.100.8';
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                validate: env_validation_1.validate,
                envFilePath: `./env/${process.env.NODE_ENV}.env`,
                load: [configuration_1.default],
                isGlobal: true,
                expandVariables: true,
            }),
            mongo_connection_module_1.MongoConnectionModule,
            cli_documentation_module_1.CliDocumentationModule,
        ],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map