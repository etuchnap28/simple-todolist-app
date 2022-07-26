import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import AuthorizationError from '../library/error/AuthorizationError';
import { AuthRequest } from '../config/globalTypes';

const verifyJWT =  (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization as string;

  if (!authHeader?.startsWith('Bearer ')) return next(new AuthorizationError("No token found"));
  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    config.jwt.accessTokenSecret,
    (err: any, decoded: any) => {
      if (err) return next(new AuthorizationError('Token is invalid'));
      (req as AuthRequest).user = decoded.user;
      next();
    }
  )
}

export default verifyJWT;

