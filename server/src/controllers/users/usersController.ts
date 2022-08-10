import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import BaseError, { asyncHandler } from "../../library/error/BaseError";

const readUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.params?.userId) return next(new BaseError(400, 'User ID required'));

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(204).json({'message': `No user matches ID ${req.params.userId}`});

  res.json(user);
})

export default {
  readUser
}