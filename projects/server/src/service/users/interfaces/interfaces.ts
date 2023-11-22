import { IPaginateResponse } from '../../../helper/interface/paginate/paginateResponse.interface';

export interface IResponseUser<T> {
  status: number;
  message: string;
  data: Partial<T>;
}

export interface IResponseUserPaginate<T> {
  status: number;
  message: string;
  data: Partial<T>;
  meta: IPaginateResponse;
}
