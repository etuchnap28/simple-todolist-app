/* Self-defined error class */

import { Request, Response, NextFunction } from "express";

export default class BaseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}


/* handleAsync wrapper */
/* This helps us from writing try/catch blocks
  in every single controllers to catch Node or Syntax Errors
  (errors that are not defined by dev) */
export const asyncHandler = (fn :any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);
