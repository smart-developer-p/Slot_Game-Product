"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// User Schema
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    password: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
