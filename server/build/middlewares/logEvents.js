"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEvents = void 0;
const Logging_1 = __importDefault(require("../library/Logging"));
const logEvents = (req, res, next) => {
    /* Log the request */
    Logging_1.default.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /* Log the response */
        Logging_1.default.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });
    next();
};
exports.logEvents = logEvents;
