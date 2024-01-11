import { body } from 'express-validator';
import validate from '../../function/expressValidator';

export const updateOrderStatusValidation = () => validate([body('status').notEmpty().isString()]);
