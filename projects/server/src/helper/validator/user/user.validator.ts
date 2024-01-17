// For further information about these options, please read the documentation.
// https://www.npmjs.com/package/fastest-validator

import { body, query } from 'express-validator';
import validate, { validateUserGet } from '../../function/expressValidator';
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
    body('role_id').notEmpty().isInt(),
    body('password')
      .matches(/[A-Z0-9]/)
      .notEmpty()
      .isLength({ min: 8 }),
    body('branch_id').optional().isInt(),
  ]);

export const createSendEmailValidation = () =>
  validate([
    query('email').notEmpty().isEmail().isString(),
    query('name').notEmpty().isString(),
    query('verifyToken').notEmpty().isString(),
  ]);

export const createUserGetValidation = () =>
  validateUserGet([
    query('email').isEmail().isString().optional(),
    query('role_id').isInt().optional(),
    query('page').isInt().optional(),
    query('limit').isInt().optional(),
    query('filterBy').isInt().optional(),
    query('sortBy').isString().optional(),
    query('key').isString().optional(),
  ]);
export const createLoginValidator = () => validate([body('email').notEmpty().isEmail(), body('password').notEmpty()]);
export const createVerifyValidator = () => validate([body('verifyToken').isString().notEmpty()]);
// export const createUserByRoleValidator = () => validateUserGet([query('role_id').optional().isInt()]);

export const userExistValidation =
  () => async (req: Request, res: Response<IResponse<UserAttributes>>, next: NextFunction) => {
    try {
      const userService = new UserService();
      const body: IUserBodyReq = req.body;
      const user = await userService.findOne({ email: body.email });
      if (user) {
        console.log('Avalable');
        return res.status(HttpStatusCode.BadRequest).json({
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
        return res.status(HttpStatusCode.InternalServerError).send({
          statusCode: HttpStatusCode.InternalServerError,
          message: 'Server Error',
        });
      }
    }
  };
