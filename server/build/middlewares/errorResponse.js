"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
const errorResponse = (error, req, res, next) => {
    const customError = (error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError') ? false : true;
    res.status(error.statusCode || 500).json({
        response: 'Error',
        error: {
            type: customError === false ? 'UnhandledError' : error.constructor.name,
            path: req.path,
            statusCode: error.statusCode || 500,
            message: error.message
        }
    });
    next(error);
};
exports.errorResponse = errorResponse;
