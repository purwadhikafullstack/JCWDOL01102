import { body } from 'express-validator';
import validate from '../../../../function/expressValidator';

export const checkCourierValidator = () =>
  validate([
    body('origin').notEmpty().withMessage('origin is required'),
    body('destination').notEmpty().withMessage('destination is required'),
    body('weight').notEmpty().withMessage('weight is required'),
    body('courier').notEmpty().withMessage('courier is required'),
  ]);
