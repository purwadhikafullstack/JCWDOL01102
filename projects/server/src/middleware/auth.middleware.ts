import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ProcessError } from '../helper/Error/errorHandler';
import { BadRequestException } from '../helper/Error/BadRequestException/BadRequestException';
import UserService from '../service/users/user.service';
import { IResponse } from '../controllers/interface';
import { UserAttributes } from '../database/models/user.model';
import { HttpStatusCode } from 'axios';
import { NotFoundException } from '../helper/Error/NotFound/NotFoundException';

export class AuthMiddleware {
  static InputValidator(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      for (const validation of validations) {
        const result = await validation.run(req);
        if (result.context.errors.length) {
          break;
        }
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      ProcessError(new BadRequestException(''), res);
      res.json();
    };
  }

  static async userExistValidation(req: Request, res: Response<IResponse<UserAttributes>>, next: NextFunction) {
    try {
      // console.log("")
      const userService = new UserService();
      const email = req.body.email;
      const user = await userService.findOne({ email: email });
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
