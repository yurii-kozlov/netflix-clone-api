import jwt, { JwtPayload } from 'jsonwebtoken';
import tokenModel from '../models/token-model';
import UserDto from '../dtos/user-dto';
import dotenv from 'dotenv';

dotenv.config();

class TokenService {
  generateTokens(payload: UserDto) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {expiresIn: '30m'}
    );

    const refreshToken = jwt.sign(
      payload, 
      process.env.JWT_REFRESH_SECRET_KEY,
      {expiresIn: '30d'}
    );

    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(accessToken: string) {
    try {
        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY) as UserDto;

        return userData;
    } catch (error) {
        return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
        const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY) as UserDto;

        return userData;
    } catch (error) {
        return null;
      }
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await tokenModel.findOne({user: userId});

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return tokenData.save();
    }

    const token = await tokenModel.create({user: userId, refreshToken});

    return token; 
  }

  async removeToken(refreshToken: string) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });

    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });

    return tokenData;
  }
}

export default new TokenService();
