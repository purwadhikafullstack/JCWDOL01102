// For further information about these options, please read the documentation.
// https://www.npmjs.com/package/fastest-validator

import { body, query } from 'express-validator';
import validate from '../../function/expressValidator';
import UserService from '../../../service/users/user.service';
import { IResponse, IUserBodyReq } from '../../../controllers/interface';
import { NextFunction, Request, Response } from 'express';
import { UserAttributes } from '../../../database/models/user.model';
import { HttpStatusCode } from 'axios';
import { NotFoundException } from '../../Error/NotFound/NotFoundException';

export const createUserValidation = () =>
  validate([
    body('name').notEmpty().isString(),
    body('email').isEmail().notEmpty().isString(),
    body('phoneNumber').notEmpty().isString(),
    body('role_id').notEmpty().isInt(),
    body('password')
      .matches(/[A-Z0-9]/)
      .notEmpty()
      .isLength({ min: 8 }),
  ]);

export const createSendEmailValidation = () =>
  validate([
    query('email').notEmpty().isEmail().isString(),
    query('name').notEmpty().isString(),
    query('id').notEmpty().isInt(),
  ]);

export const createUserEmailValidation = () => validate([query('email').notEmpty().isEmail().isString()]);

export const createLoginValidator = () => validate([body('email').notEmpty().isEmail(), body('password').notEmpty()]);
export const createVerifyValidator = () => validate([body('id').isInt().notEmpty()]);

export const userExistValidation =
  () => async (req: Request, res: Response<IResponse<UserAttributes>>, next: NextFunction) => {
    try {
      const userService = new UserService();
      const body: IUserBodyReq = req.body;
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
      console.log(e);
      if (e instanceof NotFoundException) {
        return next();
      } else {
        res.status(HttpStatusCode.InternalServerError).send({
          statusCode: HttpStatusCode.InternalServerError,
          message: 'Server Error',
        });
      }
    }
  };
