import { body } from 'express-validator';
import validate from '../../function/expressValidator';

export const createConfigValidator = () =>
  validate([
    body('module').notEmpty().withMessage('module is required'),
    body('name').notEmpty().withMessage('name is required'),
    body('data').notEmpty().withMessage('data is required'),
  ]);
