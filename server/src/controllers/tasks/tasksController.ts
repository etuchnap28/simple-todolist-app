import { NextFunction, Request, Response } from "express";
import Task from "../../models/Task";
import Logging from "../../library/Logging";
import { AuthRequest } from "../../config/globalTypes";
import BaseError, { asyncHandler } from "../../library/error/BaseError";
import { getMissingFields } from "../../utils/getMissingFields";
import FieldsMissingError from "../../library/error/FieldsMissingError";

const createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['task'];
  const missingFields = getMissingFields(req, requiredFields);
  
  if (missingFields.length > 0) return next(new FieldsMissingError(missingFields));

  const userId = (req as AuthRequest).user;
  const task = new Task({
    userId,
    task: req.body.task
  });
  const result = await task.save();
  Logging.info(result);
  res.status(201).json({'success': `New task ${task.task} for user ${userId} created`});
})

const readTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.taskId) return next(new BaseError(400, "Task ID required"));

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(204).json({'message': `No task matches ID ${req.params.taskId}`});

  res.json(task);
})

const readAllTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tasks = await Task.find({userId: (req as AuthRequest).user});
  if (!tasks) return res.status(204).json({'message': 'No task found'});

  res.json(tasks);
})

const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.taskId) return next(new BaseError(400, "Task ID required"));

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(204).json({'message': `No task matches ID ${req.params.taskId}`});

  const fields = ['task', 'done'];
  for (const field of fields) {
    if (req.body[field] !== undefined) task.set(field, req.body[field]);
  }
  const result = await task.save();
  res.json(result);
})

const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.taskId) return next(new BaseError(400, "Task ID required"));

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(204).json({'message': `No task matches ID ${req.params.taskId}`});

  const result = await Task.deleteOne({_id: req.params.taskId});
  res.json(result);
})

export default {
  createTask,
  readTask,
  readAllTasks,
  updateTask,
  deleteTask
}