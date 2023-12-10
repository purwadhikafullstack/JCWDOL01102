import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../helper/Error/UnauthorizedException/UnauthorizedException';
import { ProcessError } from '../helper/Error/errorHandler';
import { IUser } from '../helper/interface/user/user.interface';
import JWTService from '../service/jwt/jwt.service';

interface ISpecifiedRoute {
  route: RegExp;
  method: string;
}
export default class AuthMiddleware {
  public async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bypasAuth = ['/api/users/email', '/api/users/login', '/api/users/verify'];
      for (const whitelist of bypasAuth) {
        if (req.path.startsWith(whitelist)) {
          return next();
        }
      }
      const specifiedRoutes: ISpecifiedRoute[] = [
        {
          method: 'GET',
          route: /^\/api\/users(?:\?.*)?$/,
        },
        {
          method: 'POST',
          route: /^\/api\/users\/login/,
        },
        {
          method: 'PATCH',
          route: /^\/api\/users\/verify/,
        },
        {
          method: 'GET',
          route: /^\/api\/document\/[a-f0-9-]+$/i,
        },
      ];

      const isSpecifiedRoute = specifiedRoutes.some(
        (route) =>
          route.method.toUpperCase() === req.method.toUpperCase() &&
          route.method === req.method &&
          route.route.test(req.path)
      );

      if (isSpecifiedRoute) {
        return next();
      }

      if (!req.headers.authorization) throw new UnauthorizedException('Unauthorized', {});
      const jwtService = new JWTService();

      const token = req.headers.authorization.split(' ')[1];
      const decoded = await jwtService.verifyToken(token);
      req.user = decoded as IUser;
      next();
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
