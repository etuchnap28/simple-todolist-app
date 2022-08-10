import express from 'express';
import usersController from '../controllers/users/usersController';

const router = express.Router();

router.get('/:userId', usersController.readUser);

export = router;