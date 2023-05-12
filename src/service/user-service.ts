import UserModel from '../models/user-model';
import { Plan } from '../interfaces/Plan';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from '../service/mail-service';
import tokenService from '../service/token-service';
import UserDto from '../dtos/user-dto';
import ApiError from '../exceptions/api-error';
import dotenv from 'dotenv';
import userModel from '../models/user-model';
import { UserDoc } from "../interfaces/UserDoc";
import { Movie } from '../interfaces/Movie';

dotenv.config();

export interface UserData {
  userDto: UserDto;
  accessToken: string;
  refreshToken: string;
}

class UserService {
  async registration(email: string, password: string) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequest(`The user with the email ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink
    });

    await mailService.sendActivationMail(
      email, 
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({activationLink});

    if (!user) {
      throw ApiError.BadRequest('Invalid activation link');
    }

    user.isActivated = true;
    await user.save();
  }

  async setPlan(plan: Plan, email: string) {
    const user = await UserModel.findOne({email});

    if (!user) {
      throw ApiError.BadRequest(`The user with the email ${email} doesn't exist. Please register first`);
    }

    user.plan = plan;
    await user.save();
    const userDto = new UserDto(user);

    return userDto;
  }

  async addMovieToWatchLaterList(movie: Movie, email: string) {
    const user = await UserModel.findOne({email});

    if (!user) {
      throw ApiError.BadRequest(`The user with the email ${email} doesn't exist. Please register first`);
    }

    user.watchLaterMovies = [...user.watchLaterMovies, movie];
    await user.save();
  }

  async addMovieToLikedList(movie: Movie, email: string) {
    const user = await UserModel.findOne({email});

    if (!user) {
      throw ApiError.BadRequest(`The user with the email ${email} doesn't exist. Please register first`);
    }

    user.likedMovies = [...user.likedMovies, movie];
    await user.save();
  }

  async login(email: string, password: string) {
    const user = await userModel.findOne({email});

    if (!user) {
      throw ApiError.BadRequest('The user with the indicated email hasn\'t been found');
    }

    const arePasswordsEqual = await bcrypt.compare(password, user.password);

    if (!arePasswordsEqual) {
      throw ApiError.BadRequest('The password is wrong');
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async logout(refreshToken:string) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnathorizedError();
    }

    const user = await userModel.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async getAllUsers(): Promise<UserDoc[]> {
    const users = await userModel.find();

    return users;
  }
}

export default new UserService();
