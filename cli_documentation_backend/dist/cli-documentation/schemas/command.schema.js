"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CommandSchema = new mongoose_1.Schema({
    groupId: { type: mongoose_1.Schema.Types.ObjectId },
    command: { type: String },
    description: { type: String },
    includeExample: { type: Boolean },
    example: { type: String },
    registerAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=command.schema.js.map