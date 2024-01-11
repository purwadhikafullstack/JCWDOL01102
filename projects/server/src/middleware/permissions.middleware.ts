import { NextFunction, Request, Response } from 'express';
import { IUser } from '../helper/interface/user/user.interface';
import { ProcessError } from '../helper/Error/errorHandler';
import { UnauthorizedException } from '../helper/Error/UnauthorizedException/UnauthorizedException';

export const permissionsMiddleware = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IUser = req.user;

      if (!user || !user.permission || !Array.isArray(user.permission)) {
        throw new UnauthorizedException('Unauthorized', {});
      }

      const hasAllPermissions = requiredPermissions.every((permission) => user.permission.includes(permission));

      if (!hasAllPermissions) {
        throw new UnauthorizedException('Insufficient permissions', {});
      }

      next();
    } catch (error) {
      ProcessError(error, res);
    }
  };
};
