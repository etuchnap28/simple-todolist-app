"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const usersController_1 = __importDefault(require("../controllers/users/usersController"));
const router = express_1.default.Router();
router.get('/:userId', usersController_1.default.readUser);
module.exports = router;
