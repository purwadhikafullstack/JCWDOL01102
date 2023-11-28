import { body } from 'express-validator';
import validate from '../../function/expressValidator';

export const createProductValidator = () =>
  validate([
    body('categoryId').notEmpty().isNumeric(),
    body('name').notEmpty().isString(),
    body('price').notEmpty().isNumeric(),
    body('stock').notEmpty().isNumeric(),
    body('branchId').notEmpty().isNumeric(),
    body('weight').notEmpty().isNumeric(),
    body('desc').notEmpty().isString(),
  ]);
