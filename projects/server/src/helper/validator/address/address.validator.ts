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
      .withMessage('provinceId is required')
      .matches(/^[0-9]+$/)
      .withMessage('provinceId must be a number'),
    body('cityId')
      .notEmpty()
      .withMessage('cityId is required')
      .matches(/^[0-9]+$/)
      .withMessage('cityId must be a number'),
    body('latitude').notEmpty().withMessage('latitude is required'),
    body('longitude').notEmpty().withMessage('longitude is required'),
    body('isDefault').isBoolean().withMessage('isDefault must be a boolean'),
    body('receiverName').notEmpty().withMessage('receiverName is required'),
    body('phoneNumber').notEmpty().withMessage('phoneNumber is required'),
  ]);

export const updateAddressValidator = () =>
  validate([
    param('id')
      .notEmpty()
      .withMessage('id is required')
      .matches(/^[0-9]+$/)
      .withMessage('id must be a number'),
    param('addressId')
      .notEmpty()
      .withMessage('addressId is required')
      .matches(/^[0-9]+$/)
      .withMessage('addressId must be a number'),
    body('name').isString().withMessage('name must be a string'),
    body('address').isString().withMessage('address must be a string'),
    body('provinceId')
      .matches(/^[0-9]+$/)
      .withMessage('provinceId must be a number'),
    body('cityId')
      .matches(/^[0-9]+$/)
      .withMessage('cityId must be a number'),
    body('latitude').isString().withMessage('latitude must be a string'),
    body('longitude').isString().withMessage('longitude must be a string'),
    body('isDefault').isBoolean().withMessage('isDefault must be a boolean'),
    body('receiverName').isString().withMessage('receiverName must be a string'),
    body('phoneNumber').isString().withMessage('phoneNumber must be a string'),
  ]);
