"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_validator_1 = require("express-validator");
const authcontroller_1 = require("../auth/authcontroller");
const router = express.Router();
router.post("/register", [
    (0, express_validator_1.body)("username").isString().notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("password").isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], authcontroller_1.register);
router.post("/login", [
    (0, express_validator_1.body)("username").isString().notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("password").isString().notEmpty().withMessage("Password is required"),
], authcontroller_1.login);
exports.default = router;
