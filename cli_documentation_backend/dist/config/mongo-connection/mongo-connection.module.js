"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnectionModule = void 0;
const common_1 = require("@nestjs/common");
const mongo_connection_service_1 = require("./mongo-connection.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
let MongoConnectionModule = class MongoConnectionModule {
};
exports.MongoConnectionModule = MongoConnectionModule;
exports.MongoConnectionModule = MongoConnectionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('env.DB_URI'),
                    maxPoolSize: 500,
                    serverSelectionTimeoutMS: 10000,
                    socketTimeoutMS: 60000,
                    retryReads: true,
                    writeConcern: {
                        w: 'majority',
                        j: true,
                        wtimeout: 5000
                    },
                }),
                inject: [config_1.ConfigService],
            })
        ],
        providers: [mongo_connection_service_1.MongoConnectionService],
        exports: [mongo_connection_service_1.MongoConnectionService],
    })
], MongoConnectionModule);
//# sourceMappingURL=mongo-connection.module.js.map