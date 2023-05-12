import { Request, Response, NextFunction } from "express";
import userService, { UserData } from "../service/user-service";
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import ApiError from "../exceptions/api-error";
import { UserDoc } from "../interfaces/UserDoc";
import UserDto from "../dtos/user-dto";
import { Movie } from "../interfaces/Movie";

dotenv.config();

class UserController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<UserData> | void> {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(ApiError.BadRequest('Validation Error', errors.array()))
        }
        const { email, password } = req.body;
        const userData = await userService.registration(email, password);

        res.cookie(
          'refreshToken',
          userData.refreshToken,
          {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
        );

        return res.json(userData);
    } catch (error) {
        next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<UserData> | void> {
    try {
        const { email, password } = req.body;
        const userData = await userService.login(email, password);

        res.cookie(
          'refreshToken',
          userData.refreshToken,
          {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
        );

        return res.json(userData);
    } catch (error) {
        next(error);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string>> {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');

        return res.json(token);
    } catch (error) {
        next(error);
    }
  }

  async activate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);

      return res.redirect(`${process.env.CLIENT_URL}/signIn`);
    } catch (error) {
        next(error);
    }
  }

  async setPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<UserDto | void>>{
    try {
      const { email, plan } = req.body;
      const user = await userService.setPlan(plan, email);

      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async addMovieToWatchLaterList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Movie| void>> {
    try {
      const { watchLaterMovie, email } = req.body;
      await userService.addMovieToWatchLaterList(watchLaterMovie, email);

      return res.json(watchLaterMovie);
    } catch (error) {
        next(error);
    }
  }

  async addMovieToLikedList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Movie | void>> {
    try {
      const { likedMovie, email } = req.body;
       await userService.addMovieToLikedList(likedMovie, email);

      return res.json(likedMovie);
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<UserData> | void> {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);

      res.cookie(
        'refreshToken',
        userData.refreshToken,
        {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}
      );

      return res.json(userData);
    } catch (error) {
        next(error);
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<UserDoc[]>> {
    try {
        const users = await userService.getAllUsers();

        return res.json(users);
    } catch (error) {
        next(error);
    }
  }
}

export default new UserController();
