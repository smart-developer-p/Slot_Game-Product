"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users_1 = require("../models/Users");
const SECRET_KEY = process.env.SECRET_KEY || "";
const TOKEN_EXPIRATION = "1h"; // Token expires in 1 hour
// Register User
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield Users_1.default.findOne({ username });
    console.log(user, username);
    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    const newUser = new Users_1.default({
        username,
        password: hashedPassword,
        balance: 1000
    });
    yield newUser.save();
    res.status(201).json({ message: "User registered successfully" });
});
exports.register = register;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield Users_1.default.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = yield bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
    res.status(200).json({ token, expiresIn: TOKEN_EXPIRATION });
});
exports.login = login;
