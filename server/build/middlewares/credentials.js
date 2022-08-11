"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
const config_1 = require("../config/config");
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (config_1.config.server.allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
};
exports.credentials = credentials;
