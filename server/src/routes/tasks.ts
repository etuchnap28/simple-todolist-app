import express from 'express';
import tasksController from '../controllers/tasks/tasksController';

const router = express.Router();

router.post('/', tasksController.createTask);
router.get('/:taskId', tasksController.readTask);
router.get('/', tasksController.readAllTasks);
router.patch('/:taskId', tasksController.updateTask);
router.delete('/:taskId', tasksController.deleteTask);

export = router;