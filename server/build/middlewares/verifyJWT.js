"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const AuthorizationError_1 = __importDefault(require("../library/error/AuthorizationError"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')))
        return next(new AuthorizationError_1.default("No token found"));
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, config_1.config.jwt.accessTokenSecret, (err, decoded) => {
        if (err)
            return next(new AuthorizationError_1.default('Token is invalid'));
        req.user = decoded.user;
        next();
    });
};
exports.default = verifyJWT;
