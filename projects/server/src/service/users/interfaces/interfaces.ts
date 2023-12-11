import { UserAttributes } from '../../../database/models/provinces.mode';
import { UserCreationAttributes } from '../../../database/models/user.model';
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

export interface ILoginResult {
  user: Partial<UserCreationAttributes>;
  token: string;
}
