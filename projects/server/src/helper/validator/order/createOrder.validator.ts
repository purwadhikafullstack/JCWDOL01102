import { body } from 'express-validator';
import validate from '../../function/expressValidator';
// {
//   "userId":1,
//   "branchId":1,
//   "products":[
//       {
//           "id":1,
//           "qty":2,
//           "price":10000
//       }
//   ],
//   "courier":{
//       "name":"Jalur Nugraha Ekakurir (JNE)",
//       "code":"REG",
//       "price":12000,
//       "etd":"1-2"
//   },
//   "discountId":[
//   ],
//   "totalAmount":10000,
//   "paymentCode":"BCA_VA"
// }
export const createOrderValidation = () =>
  validate([
    body('userId').notEmpty().isInt(),
    body('branchId').notEmpty().isInt(),
    body('products').notEmpty().isArray({ min: 1 }).withMessage('Products must be an array with a minimum length of 1'),
    body('products.*.id').notEmpty().isInt(),
    body('products.*.qty').notEmpty().isInt(),
    body('products.*.price').notEmpty().isInt(),
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
