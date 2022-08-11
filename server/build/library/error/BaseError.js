"use strict";
/* Self-defined error class */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
class BaseError extends Error {
    constructor(statusCode, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}
exports.default = BaseError;
/* handleAsync wrapper */
/* This helps us from writing try/catch blocks
  in every single controllers to catch Node or Syntax Errors
  (errors that are not defined by dev) */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
