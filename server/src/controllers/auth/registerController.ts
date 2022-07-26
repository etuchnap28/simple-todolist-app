import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import Logging from "../../library/Logging";
import BaseError, { asyncHandler } from "../../library/error/BaseError";
import FieldsMissingError from "../../library/error/FieldsMissingError";
import {getMissingFields} from "../../utils/getMissingFields";
import ConflictError from "../../library/error/ConflictError";

const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['username', 'password', 'name'];
  const missingFields = getMissingFields(req, requiredFields);

  if (missingFields.length > 0) return next(new FieldsMissingError(missingFields));

  const {name, username, password} = req.body;
  /* Check for duplicate Usernames or Emails in DB */
  const duplicatedUsername = await User.findOne({username}).exec();
  if (duplicatedUsername) return next(new ConflictError('Username is already existed'));

  const result = await User.create({
    name,
    username,
    password
  });
  Logging.info(result);
  res.status(201).json({'success': `New user ${username} created`});
})

export default {createUser}; 