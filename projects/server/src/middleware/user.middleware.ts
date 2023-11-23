import { NextFunction, Request, Response } from 'express';
import { IResponse, IUserBodyReq } from '../controllers/interface';
import { UserAttributes } from '../database/models/user.model';
import UserService from '../service/users/user.service';
import { HttpStatusCode } from 'axios';
import { NotFoundException } from '../helper/Error/NotFound/NotFoundException';

export default class UserMiddleware {
  static async userExistValidation(req: Request, res: Response<IResponse<UserAttributes>>, next: NextFunction) {
    try {
      // console.log("")
      const userService = new UserService();
      const body: IUserBodyReq = req.body.email;
      const user = await userService.findOne({ email: body.email });
      if (user) {
        res.status(HttpStatusCode.BadRequest).send({
          statusCode: HttpStatusCode.BadRequest,
          message: 'User with this email is already exist',
        });
      } else {
        return next();
      }
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        return next();
      } else {
        res.status(HttpStatusCode.InternalServerError).send({
          statusCode: HttpStatusCode.InternalServerError,
          message: 'Server Error',
        });
      }
    }
  }
}
