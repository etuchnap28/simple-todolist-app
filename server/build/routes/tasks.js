"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const tasksController_1 = __importDefault(require("../controllers/tasks/tasksController"));
const router = express_1.default.Router();
router.post('/', tasksController_1.default.createTask);
router.get('/:taskId', tasksController_1.default.readTask);
router.get('/', tasksController_1.default.readAllTasks);
router.patch('/:taskId', tasksController_1.default.updateTask);
router.delete('/:taskId', tasksController_1.default.deleteTask);
module.exports = router;
