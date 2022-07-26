import User from "../../models/User";
import { Request, Response, NextFunction} from 'express';
import Logging from "../../library/Logging";
import { asyncHandler } from "../../library/error/BaseError";

const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json({'message': 'Logged out'});

  const refreshToken = cookies.jwt;

  /* Check if refreshToken in DB */
  const foundUser = await User.findOne({refreshTokens: refreshToken});
  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    return res.status(204).json({'message': 'Logged out'});
  }

  foundUser.refreshTokens = foundUser.refreshTokens?.filter(rt => rt !== refreshToken) as string[];
  const result = await foundUser.save();
  Logging.info(result);
  
  res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
  return res.status(204).json({'message': 'Logged out'});
})

export default { logout }