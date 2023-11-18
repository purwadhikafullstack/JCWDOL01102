import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ProcessError } from '../helper/Error/errorHandler';
import { BadRequestException } from '../helper/Error/BadRequestException/BadRequestException';

export class AuthMiddleware {
  static InputValidator(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      for (const validation of validations) {
        const result = await validation.run(req);
        if (result.context.errors.length) {
          break;
        }
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      ProcessError(new BadRequestException(''), res);
      res.json();
    };
  }
}
