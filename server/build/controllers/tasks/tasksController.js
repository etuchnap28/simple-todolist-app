"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = __importDefault(require("../../models/Task"));
const Logging_1 = __importDefault(require("../../library/Logging"));
const BaseError_1 = __importStar(require("../../library/error/BaseError"));
const getMissingFields_1 = require("../../utils/getMissingFields");
const FieldsMissingError_1 = __importDefault(require("../../library/error/FieldsMissingError"));
const createTask = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredFields = ['task'];
    const missingFields = (0, getMissingFields_1.getMissingFields)(req, requiredFields);
    if (missingFields.length > 0)
        return next(new FieldsMissingError_1.default(missingFields));
    const userId = req.user;
    const task = new Task_1.default({
        userId,
        task: req.body.task
    });
    const result = yield task.save();
    Logging_1.default.info(result);
    res.status(201).json({ 'success': `New task ${task.task} for user ${userId} created` });
}));
const readTask = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.taskId))
        return next(new BaseError_1.default(400, "Task ID required"));
    const task = yield Task_1.default.findById(req.params.taskId);
    if (!task)
        return res.status(204).json({ 'message': `No task matches ID ${req.params.taskId}` });
    res.json(task);
}));
const readAllTasks = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Task_1.default.find({ userId: req.user });
    if (!tasks)
        return res.status(204).json({ 'message': 'No task found' });
    res.json(tasks);
}));
const updateTask = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.taskId))
        return next(new BaseError_1.default(400, "Task ID required"));
    const task = yield Task_1.default.findById(req.params.taskId);
    if (!task)
        return res.status(204).json({ 'message': `No task matches ID ${req.params.taskId}` });
    const fields = ['task', 'done'];
    for (const field of fields) {
        if (req.body[field] !== undefined)
            task.set(field, req.body[field]);
    }
    const result = yield task.save();
    res.json(result);
}));
const deleteTask = (0, BaseError_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.taskId))
        return next(new BaseError_1.default(400, "Task ID required"));
    const task = yield Task_1.default.findById(req.params.taskId);
    if (!task)
        return res.status(204).json({ 'message': `No task matches ID ${req.params.taskId}` });
    const result = yield Task_1.default.deleteOne({ _id: req.params.taskId });
    res.json(result);
}));
exports.default = {
    createTask,
    readTask,
    readAllTasks,
    updateTask,
    deleteTask
};
