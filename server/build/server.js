"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Logging_1 = __importDefault(require("./library/Logging"));
const config_1 = require("./config/config");
const dbConn_1 = require("./config/dbConn");
const logEvents_1 = require("./middlewares/logEvents");
const errorResponse_1 = require("./middlewares/errorResponse");
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const users_1 = __importDefault(require("./routes/users"));
const NotFoundError_1 = __importDefault(require("./library/error/NotFoundError"));
const credentials_1 = require("./middlewares/credentials");
const verifyJWT_1 = __importDefault(require("./middlewares/verifyJWT"));
const app = (0, express_1.default)();
/* Connect to MongoDB */
(0, dbConn_1.connectDB)();
/* Middlewares */
app.use(logEvents_1.logEvents);
app.use(credentials_1.credentials);
app.use((0, cors_1.default)(config_1.config.server.corsOptions));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
/* Healthcheck */
app.get('/', (req, res, next) => {
    res.send('Running...');
});
app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
/* Routes */
app.use('/auth', auth_1.default);
/* Protected Routes */
app.use(verifyJWT_1.default);
app.use('/tasks', tasks_1.default);
app.use('/users', users_1.default);
/* Error handling */
app.get('*', (req, res, next) => next(new NotFoundError_1.default(req.path)));
app.use(errorResponse_1.errorResponse);
app.use((error, req, res, next) => {
    Logging_1.default.error(error);
    console.log('Path: ', req.path);
    console.log(`Status code: ${error.statusCode || 500}`);
    console.log(error.stack);
});
/* Connect to MongoDB and start server */
mongoose_1.default.connection.once('connected', () => {
    Logging_1.default.info('Connected to MongoDB');
    app.listen(config_1.config.server.port, () => Logging_1.default.info(`Server is running on port ${config_1.config.server.port}`));
});
