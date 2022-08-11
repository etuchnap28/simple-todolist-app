"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const loginController_1 = __importDefault(require("../controllers/auth/loginController"));
const logoutController_1 = __importDefault(require("../controllers/auth/logoutController"));
const refreshController_1 = __importDefault(require("../controllers/auth/refreshController"));
const registerController_1 = __importDefault(require("../controllers/auth/registerController"));
const router = express_1.default.Router();
router.post('/register', registerController_1.default.createUser);
router.post('/login', loginController_1.default.login);
router.get('/refresh', refreshController_1.default.refresh);
router.get('/logout', logoutController_1.default.logout);
module.exports = router;
