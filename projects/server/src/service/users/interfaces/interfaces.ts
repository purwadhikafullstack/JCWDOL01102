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

export interface IUserLoginAttributes {
  name: string;
  email: string;
  branchId: number | null;
  userId: number;
  phoneNumber: string;
  referralCode: string;
  role: string;
  permission: string[];
  branch: string | null;
  iat: number;
}

export interface ILoginResult {
  user: Partial<IUserLoginAttributes>;
  token: string;
}
