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
var MongoConnectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose = require("mongoose");
const config_1 = require("@nestjs/config");
let MongoConnectionService = MongoConnectionService_1 = class MongoConnectionService {
    constructor(configSrvc) {
        this.configSrvc = configSrvc;
        this.logger = new common_1.Logger(MongoConnectionService_1.name);
        this.createConnectionDB();
    }
    createConnectionDB() {
        const DB_URI = this.configSrvc.get('env.DB_URI');
        this.dbConnection = mongoose.createConnection(DB_URI);
        this.dbConnection.once('open', () => {
            this.logger.log(`connected to: ${DB_URI}`);
        });
        this.dbConnection.once('error', () => {
            this.logger.error(`error connecting to ${DB_URI}`);
        });
    }
    getConnection() {
        return this.dbConnection;
    }
};
exports.MongoConnectionService = MongoConnectionService;
exports.MongoConnectionService = MongoConnectionService = MongoConnectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MongoConnectionService);
//# sourceMappingURL=mongo-connection.service.js.map