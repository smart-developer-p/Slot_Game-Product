"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Player Game History Schema
const BetsHistorySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GameConfig', required: true },
    amount: { type: Number, required: true },
    profit: { type: Number, required: true },
    result: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});
const BetsHistoryModel = mongoose_1.default.model('BetsHistory', BetsHistorySchema);
exports.default = BetsHistoryModel;
