// For further information about these options, please read the documentation.
// https://www.npmjs.com/package/fastest-validator

import { body, query } from 'express-validator';
import validate from '../../function/expressValidator';
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
  validate([query('email').notEmpty().isEmail().isString(), query('name').notEmpty().isString()]);

export const createUserEmailValidation = () => validate([query('email').notEmpty().isEmail().isString()]);
