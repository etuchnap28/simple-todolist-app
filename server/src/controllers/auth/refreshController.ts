import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { config } from '../../config/config';
import Logging from '../../library/Logging';
import { asyncHandler } from '../../library/error/BaseError';
import AuthorizationError from '../../library/error/AuthorizationError';

const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return next(new AuthorizationError("No token found"));

  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });

  const foundUser = await User.findOne({refreshTokens: refreshToken});

  /* Refresh token is illegal reused */
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      config.jwt.refreshTokenSecret,
      async (err: any, decoded: any) => {
        const hackedUser = await User.findById(decoded?.user);
        if (hackedUser) {
          hackedUser.refreshTokens = [];
          const result = await hackedUser.save();
          Logging.info(result);
        }
      }
    );
    return next(new AuthorizationError("Refresh token resused"));
  }

  const newRefreshTokenArray = foundUser.refreshTokens?.filter(rt => rt !== refreshToken)
  /* Evaluate refresh token */
  jwt.verify(
    refreshToken,
    config.jwt.refreshTokenSecret,
    async (err: any, decoded: any) => {
      /* Refresh token is invalid */
      if (err) {
        foundUser.refreshTokens = [...newRefreshTokenArray as string[]];
        const result = await foundUser.save();
        Logging.info(result);
      }
      if (err || (foundUser._id.toString() !== decoded.user)) {
        return next(new AuthorizationError("Token is invalid"));
      }

      /* Refresh Token is valid */
      const accessToken = jwt.sign(
        { 'user': decoded.user },
        config.jwt.accessTokenSecret,
        { expiresIn: '10m' }
      );
      const newRefreshToken = jwt.sign(
        { 'user': decoded.user },
        config.jwt.refreshTokenSecret,
        { expiresIn: '1h' }
      )

      /* Saving refreshToken with current user */
      foundUser.refreshTokens = [...newRefreshTokenArray as string[], newRefreshToken];
      const result = await foundUser.save();
      Logging.info(result);

      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 60*60*1000,
        secure: true
      });
      res.json({accessToken});
    }
  )
})

export default {refresh}