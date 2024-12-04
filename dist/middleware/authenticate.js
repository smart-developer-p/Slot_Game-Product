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
exports.authenticate = void 0;
const SECRET_KEY = process.env.SECRET_KEY || "";
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    const token = authHeader.split(" ")[1];
    try {
        // const decoded: any = jwt.verify(token, SECRET_KEY);
        // const user = await UserModel.findById(decoded?.userId as string);
        // console.log(user, decoded);
        // (req as any).user = user; // Attach decoded token to request
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
});
exports.authenticate = authenticate;
