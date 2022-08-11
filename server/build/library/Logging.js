"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const date_fns_1 = require("date-fns");
class Logging {
}
exports.default = Logging;
_a = Logging;
Logging.log = (args) => _a.info(args);
Logging.info = (args) => console.log(chalk_1.default.blue(`[${(0, date_fns_1.format)(new Date(), 'dd.MM.yyyy HH:mm:ss')}][INFO]`), typeof args === 'string' ? chalk_1.default.blueBright(args) : args);
Logging.warn = (args) => console.log(chalk_1.default.yellow(`${(0, date_fns_1.format)(new Date(), 'dd.MM.yyyy HH:mm:ss')}][WARNING] `), typeof args === 'string' ? chalk_1.default.yellowBright(args) : args);
Logging.error = (error) => {
    const customError = error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError' ? false : true;
    console.log(chalk_1.default.red(`[${(0, date_fns_1.format)(new Date(), 'dd.MM.yyyy HH:mm:ss')}][ERROR] `, chalk_1.default.redBright(`${customError ? error.constructor.name : 'UnhandledError'}`)));
};
