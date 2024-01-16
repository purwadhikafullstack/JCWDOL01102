import { body, query } from 'express-validator';
import validate from '../../function/expressValidator';

export const createVoucherCreationValidator = () => {
  return validate([
    body('name').notEmpty().isString(),
    body('type').notEmpty().isString(),
    body('dateStart').isISO8601().notEmpty(),
    body('dateEnd').isISO8601().notEmpty(),
    body('value').isInt().notEmpty(),
    body('valueType').isString().notEmpty(),
    body('minimalPrice').isInt().optional(),
    query('productId').isInt().optional(),
  ]);
};
