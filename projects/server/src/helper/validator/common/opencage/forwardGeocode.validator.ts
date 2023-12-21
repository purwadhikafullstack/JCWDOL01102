import { body } from 'express-validator';
import validate from '../../../function/expressValidator';

export const forwardGeocodeValidator = () => validate([body('query').notEmpty().withMessage('query is required')]);
