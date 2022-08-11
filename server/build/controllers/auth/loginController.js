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
const FieldsMissingError_1 = __importDefault(require("../../library/error/FieldsMissingError"));
const AuthorizationError_1 = __importDefault(require("../../library/error/AuthorizationError"));
const getMissingFields_1 = require("../../utils/getMissingFields");
const login = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requiredFields = ['username', 'password'];
    const missingFields = (0, getMissingFields_1.getMissingFields)(req, requiredFields);
    if (missingFields.length > 0)
        return next(new FieldsMissingError_1.default(missingFields));
    const { username, password } = req.body;
    const cookies = req.cookies;
    const foundUser = yield User_1.default.findOne({ username });
    if (!foundUser)
        return next(new AuthorizationError_1.default('Username is invalid'));
    /* Evualate password */
    const match = yield foundUser.comparePassword(password);
    if (!match) {
        return next(new AuthorizationError_1.default('Password does not matched'));
    }
    /* Create JWTs */
    const accessToken = jsonwebtoken_1.default.sign({ 'user': foundUser._id.toString() }, config_1.config.jwt.accessTokenSecret, { expiresIn: '10m' });
    const newRefreshToken = jsonwebtoken_1.default.sign({ 'user': foundUser._id.toString() }, config_1.config.jwt.refreshTokenSecret, { expiresIn: '1h' });
    /* When user didn't log out and somehow signs in again
    then there should be a jwt cookie, which should be removed */
    console.log(cookies.jwt);
    const refreshTokensArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
        ? foundUser.refreshTokens
        : (_a = foundUser.refreshTokens) === null || _a === void 0 ? void 0 : _a.filter(rt => rt !== cookies.jwt);
    if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
    }
    /* Saving newRefreshToken to current user tokens array */
    foundUser.refreshTokens = [...refreshTokensArray, newRefreshToken];
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
exports.default = { login };
