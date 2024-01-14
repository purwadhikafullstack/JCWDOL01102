import { body } from 'express-validator';
import validate from '../../function/expressValidator';

export const createOrderValidation = () =>
  validate([
    body('userId').notEmpty().isInt(),
    body('branchId').notEmpty().isInt(),
    body('products').notEmpty().isArray({ min: 1 }).withMessage('Products must be an array with a minimum length of 1'),
    body('products.*.id').notEmpty().isInt(),
    body('products.*.qty').notEmpty().isInt(),
    body('products.*.price').notEmpty().isInt(),
    body('promotions').optional().isArray(),
    body('promotions.*.productId').optional().isInt(),
    body('promotions.*.id').optional().isInt(),
    body('promotions.*.name').optional().isString(),
    body('promotions.*.type').optional().isString(),
    body('promotions.*.value').optional().isInt(),
    body('courier.name').notEmpty().isString(),
    body('courier.code').notEmpty().isString(),
    body('courier.price').notEmpty().isInt(),
    body('courier.etd').notEmpty().isString(),
    body('totalAmount').notEmpty().isInt(),
    body('discountId').optional().isArray(),
    body('discountId.*.id').optional().isInt(),
    body('discountId.*.value').optional().isInt(),
    body('discountId.*.type').optional().isString(),
    body('paymentCode').notEmpty().isString(),
  ]);
