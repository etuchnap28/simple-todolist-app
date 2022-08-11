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
const User_1 = __importDefault(require("../../models/User"));
const Logging_1 = __importDefault(require("../../library/Logging"));
const BaseError_1 = require("../../library/error/BaseError");
const logout = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.status(204).json({ 'message': 'Logged out' });
    const refreshToken = cookies.jwt;
    /* Check if refreshToken in DB */
    const foundUser = yield User_1.default.findOne({ refreshTokens: refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(204).json({ 'message': 'Logged out' });
    }
    foundUser.refreshTokens = (_a = foundUser.refreshTokens) === null || _a === void 0 ? void 0 : _a.filter(rt => rt !== refreshToken);
    const result = yield foundUser.save();
    Logging_1.default.info(result);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.status(204).json({ 'message': 'Logged out' });
}));
exports.default = { logout };
