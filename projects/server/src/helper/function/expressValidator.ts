import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { atLeastOneQueryParam } from './atLeastOne';

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line prefer-const
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(HttpStatusCode.BadRequest).json({ errors: errors.array() });
  };
};

export const validateUserGet = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line prefer-const
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty() && atLeastOneQueryParam(['email', 'role_id', 'page', 'limit'], req)) {
      return next();
    }

    res.status(HttpStatusCode.BadRequest).json({ errors: errors.array() });
  };
};

export default validate;
