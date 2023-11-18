// For further information about these options, please read the documentation.
// https://www.npmjs.com/package/fastest-validator

import { ValidationChain, body } from 'express-validator';

export const postUserValidator = {
  name: {
    type: 'string',
    min: 3,
    max: 255,
  },
  email: {
    type: 'email',
    max: 255,
  },
  password: {
    type: 'string',
    min: 6,
    max: 255,
  },
};

export const inputValidationsChain: ValidationChain[] = [
  body('name').notEmpty().isString(),
  body('email').isEmail().notEmpty().isString(),
  body('phone_number').notEmpty().isString(),
  body('role_id').notEmpty().isInt(),
  body('is_deleted').isBoolean().notEmpty(),
  body('is_verified').isBoolean().notEmpty(),
  body('password')
    .matches(/[A-Z0-9]/)
    .notEmpty()
    .isLength({ min: 8 }),
];
