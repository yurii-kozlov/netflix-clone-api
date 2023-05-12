import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";
import tokenService from "../service/token-service";
import UserDto from "../dtos/user-dto";

interface AthorizationRequest extends Request {
  user: UserDto;
}

export default function authMiddleware(
  req: AthorizationRequest,
  res: Response,
  next: NextFunction
) {
  try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        return next(ApiError.UnathorizedError());
      }

      const accessToken = authorizationHeader.split(' ')[1];

      if (!accessToken) {
        return next(ApiError.UnathorizedError());
      }

      const userData = tokenService.validateAccessToken(accessToken);

      if (!userData) {
        return next(ApiError.UnathorizedError());
      }

      req.user = userData;
      next();

  } catch (error) {
      return next(ApiError.UnathorizedError());
  }
}
