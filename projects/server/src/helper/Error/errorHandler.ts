import { Response } from 'express';
import { BadRequestException } from './BadRequestException/BadRequestException';
import { HttpStatusCode } from 'axios';
import { ForbiddenException } from './Forbidden/ForbiddenException';
import { UnauthorizedException } from './UnauthorizedException/UnauthorizedException';
import { UnprocessableEntityException } from './UnprocessableEntity/UnprocessableEntityException';
import { NotFoundException } from './NotFound/NotFoundException';

export function ProcessError(err: any, res: Response) {
  console.log(err);
  if (err instanceof BadRequestException) {
    res.status(HttpStatusCode.BadRequest).json({
      statusCode: HttpStatusCode.BadRequest,
      message: err.message,
      errors: err.errors,
    });
  } else if (err instanceof NotFoundException) {
    res.status(HttpStatusCode.NotFound).json({
      statusCode: HttpStatusCode.NotFound,
      message: err.message,
      errors: err.errors,
    });
  } else if (err instanceof ForbiddenException) {
    res.status(HttpStatusCode.Forbidden).json({
      statusCode: HttpStatusCode.Forbidden,
      message: err.message,
      errors: err.errors,
    });
  } else if (err instanceof UnauthorizedException) {
    res.status(HttpStatusCode.Unauthorized).json({
      statusCode: HttpStatusCode.Unauthorized,
      message: err.message,
      errors: err.errors,
    });
  } else if (err instanceof UnprocessableEntityException) {
    res.status(HttpStatusCode.UnprocessableEntity).json({
      statusCode: HttpStatusCode.UnprocessableEntity,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(HttpStatusCode.InternalServerError).json({
      statusCode: HttpStatusCode.InternalServerError,
      message: err.message ?? 'Internal Server Error',
    });
  }
}
