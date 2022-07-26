import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { config } from '../../config/config';
import Logging from '../../library/Logging';
import { asyncHandler } from '../../library/error/BaseError';
import FieldsMissingError from '../../library/error/FieldsMissingError';
import AuthorizationError from '../../library/error/AuthorizationError';
import { getMissingFields } from '../../utils/getMissingFields';

const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['username', 'password'];
  const missingFields = getMissingFields(req, requiredFields);
  
  if (missingFields.length > 0) return next(new FieldsMissingError(missingFields));

  const { username, password } = req.body;
  const cookies = req.cookies;

  const foundUser = await User.findOne({username});
  if (!foundUser) return next(new AuthorizationError('Username is invalid'));

  /* Evualate password */
  const match = await foundUser.comparePassword(password);
  if (!match) {
    return next(new AuthorizationError('Password does not matched'));
  }

  /* Create JWTs */
  const accessToken = jwt.sign(
    { 'user': foundUser._id.toString() },
    config.jwt.accessTokenSecret,
    {expiresIn: '10m'}
  );
  const newRefreshToken = jwt.sign(
    { 'user': foundUser._id.toString() },
    config.jwt.refreshTokenSecret,
    { expiresIn: '1h' }
  );

  /* When user didn't log out and somehow signs in again
  then there should be a jwt cookie, which should be removed */
  console.log(cookies.jwt);
  const refreshTokensArray = 
    !cookies?.jwt
      ? foundUser.refreshTokens
      : foundUser.refreshTokens?.filter(rt => rt !== cookies.jwt);
  if (cookies?.jwt) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
  }

  /* Saving newRefreshToken to current user tokens array */
  foundUser.refreshTokens = [...refreshTokensArray as string[], newRefreshToken];
  const result = await foundUser.save();
  Logging.info(result);

  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    sameSite: 'none',
    maxAge: 60*60*1000,
    secure: true
  });
  res.json({accessToken});
})

export default {login}