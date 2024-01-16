import { Request } from 'express';

export const atLeastOneQueryParam = (params: string[], req: Request) => {
  return params.some((param) => req.query[param] !== undefined);
};
