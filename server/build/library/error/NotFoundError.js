"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class NotFoundError extends BaseError_1.default {
    constructor(propertyName) {
        super(404, `Property '${propertyName}' not found.`);
        this.propertyName = propertyName;
    }
}
exports.default = NotFoundError;
