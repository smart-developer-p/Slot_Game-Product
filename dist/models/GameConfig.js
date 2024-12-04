"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Game Configuration Schema
const GameConfigSchema = new mongoose_1.Schema({
    gameName: { type: String, required: true, unique: true },
    gameType: { type: String, required: true }, // e.g., "sunny-fruits"
    gameInfo: { type: Object, require: true }
});
const GameConfigModel = mongoose_1.default.model('GameConfig', GameConfigSchema);
exports.default = GameConfigModel;
