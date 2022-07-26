import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";

import Logging from './library/Logging';

import { config } from './config/config';
import { connectDB } from './config/dbConn';

import { logEvents } from './middlewares/logEvents';
import { errorResponse } from './middlewares/errorResponse';

import authRoute from './routes/auth';
import tasksRoute from './routes/tasks'

import NotFoundError from './library/error/NotFoundError';
import { credentials } from './middlewares/credentials';
import verifyJWT from './middlewares/verifyJWT';

const app = express();

/* Connect to MongoDB */
connectDB();

/* Middlewares */
app.use(logEvents);
app.use(credentials);
app.use(cors(config.server.corsOptions));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

/* Healthcheck */
app.get('/ping', (req: Request, res: Response, next: NextFunction) => res.status(200).json({message: 'pong'}));

/* Routes */
app.use('/auth', authRoute);
/* Protected Routes */
app.use(verifyJWT);
app.use('/tasks', tasksRoute);

/* Error handling */
app.get('*', (req: Request, res: Response, next: NextFunction) => next(new NotFoundError(req.path)))
app.use(errorResponse);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  Logging.error(error);
  console.log('Path: ', req.path);
  console.log(`Status code: ${error.statusCode || 500}`);
  console.log(error.stack);
});

/* Connect to MongoDB and start server */
mongoose.connection.once('connected', () => {
  Logging.info('Connected to MongoDB');
  app.listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`))
})