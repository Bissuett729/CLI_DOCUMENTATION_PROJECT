"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSchema = void 0;
const mongoose_1 = require("mongoose");
exports.GroupSchema = new mongoose_1.Schema({
    label: { type: String },
    icon: { type: String },
    url: { type: String },
    value: { type: String },
    link: { type: String },
    colorLabel: { type: String },
    registerAt: { type: Date, default: Date.now },
    commands: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "command_db" }]
});
//# sourceMappingURL=group.schema.js.map