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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const config_1 = require("../../config/config");
const Logging_1 = __importDefault(require("../../library/Logging"));
const BaseError_1 = require("../../library/error/BaseError");
const AuthorizationError_1 = __importDefault(require("../../library/error/AuthorizationError"));
const refresh = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return next(new AuthorizationError_1.default("No token found"));
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    const foundUser = yield User_1.default.findOne({ refreshTokens: refreshToken });
    /* Refresh token is illegal reused */
    if (!foundUser) {
        jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwt.refreshTokenSecret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            const hackedUser = yield User_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.user);
            if (hackedUser) {
                hackedUser.refreshTokens = [];
                const result = yield hackedUser.save();
                Logging_1.default.info(result);
            }
        }));
        return next(new AuthorizationError_1.default("Refresh token resused"));
    }
    const newRefreshTokenArray = (_a = foundUser.refreshTokens) === null || _a === void 0 ? void 0 : _a.filter(rt => rt !== refreshToken);
    /* Evaluate refresh token */
    jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwt.refreshTokenSecret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        /* Refresh token is invalid */
        if (err) {
            foundUser.refreshTokens = [...newRefreshTokenArray];
            const result = yield foundUser.save();
            Logging_1.default.info(result);
        }
        if (err || (foundUser._id.toString() !== decoded.user)) {
            return next(new AuthorizationError_1.default("Token is invalid"));
        }
        /* Refresh Token is valid */
        const accessToken = jsonwebtoken_1.default.sign({ 'user': decoded.user }, config_1.config.jwt.accessTokenSecret, { expiresIn: '10m' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ 'user': decoded.user }, config_1.config.jwt.refreshTokenSecret, { expiresIn: '1h' });
        /* Saving refreshToken with current user */
        foundUser.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
        const result = yield foundUser.save();
        Logging_1.default.info(result);
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000,
            secure: true
        });
        res.json({ accessToken });
    }));
}));
exports.default = { refresh };
