// For further information about these options, please read the documentation.
// https://www.npmjs.com/package/fastest-validator

import { ValidationChain, body, query } from 'express-validator';

export const userCreationValidations: ValidationChain[] = [
  body('name').notEmpty().isString(),
  body('email').isEmail().notEmpty().isString(),
  body('phoneNumber').notEmpty().isString(),
  body('role_id').notEmpty().isInt(),
  body('password')
    .matches(/[A-Z0-9]/)
    .notEmpty()
    .isLength({ min: 8 }),
];

export const userEmailQueryValidation: ValidationChain[] = [query('email').notEmpty().isEmail().isString()];
