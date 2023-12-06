import * as jwt from 'jsonwebtoken';
import configConstants from '../../config/constants';
import { ForbiddenException } from '../../helper/Error/Forbidden/ForbiddenException';

export default class JWTService {
  async generateToken(userPayload: any) {
    return jwt.sign(userPayload, configConstants.JWT_PRIVATE_KEY);
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, configConstants.JWT_PRIVATE_KEY);
    } catch (error) {
      throw new ForbiddenException('Invalid token', {});
    }
  }
}
