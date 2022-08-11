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
const FieldsMissingError_1 = __importDefault(require("../../library/error/FieldsMissingError"));
const getMissingFields_1 = require("../../utils/getMissingFields");
const ConflictError_1 = __importDefault(require("../../library/error/ConflictError"));
const createUser = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredFields = ['username', 'password', 'name'];
    const missingFields = (0, getMissingFields_1.getMissingFields)(req, requiredFields);
    if (missingFields.length > 0)
        return next(new FieldsMissingError_1.default(missingFields));
    const { name, username, password } = req.body;
    /* Check for duplicate Usernames or Emails in DB */
    const duplicatedUsername = yield User_1.default.findOne({ username }).exec();
    if (duplicatedUsername)
        return next(new ConflictError_1.default('Username is already existed'));
    const result = yield User_1.default.create({
        name,
        username,
        password
    });
    Logging_1.default.info(result);
    res.status(201).json({ 'success': `New user ${username} created` });
}));
exports.default = { createUser };
