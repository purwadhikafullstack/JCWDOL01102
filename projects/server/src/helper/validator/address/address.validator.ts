import { body, param } from 'express-validator';
import validate from '../../function/expressValidator';

export const createAddressValidator = () =>
  validate([
    param('id')
      .notEmpty()
      .withMessage('id is required')
      .matches(/^[0-9]+$/)
      .withMessage('id must be a number'),
    body('name').notEmpty().withMessage('name is required'),
    body('address').notEmpty().withMessage('address is required'),
    body('provinceId')
      .notEmpty()
      .withMessage('province_id is required')
      .matches(/^[0-9]+$/)
      .withMessage('province_id must be a number'),
    body('cityId')
      .notEmpty()
      .withMessage('city_id is required')
      .matches(/^[0-9]+$/)
      .withMessage('city_id must be a number'),
    body('latitude').notEmpty().withMessage('latitude is required'),
    body('longitude').notEmpty().withMessage('longitude is required'),
    body('isDefault').isBoolean().withMessage('is_default must be a boolean'),
  ]);
