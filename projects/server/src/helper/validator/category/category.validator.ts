import { body } from 'express-validator';
import validate from '../../function/expressValidator';

export const createCategoryValidator = () => validate([body('name').notEmpty().withMessage('name is required')]);
