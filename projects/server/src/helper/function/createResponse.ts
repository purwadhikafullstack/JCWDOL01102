import { Response } from 'express';
import { ISuccessResponse } from '../interface/response/response.interface';

export function createResponse<T, N>(status: number, message: string, data: N, res: Response) {
  const resp: ISuccessResponse<T> = {
    status: status,
    message: message,
    data: data,
  };

  return res.status(status).json(resp);
}
