import { UserCreationAttributes } from '../database/models/user.model';

interface IMeta {
  page: number;
  limit: number;
  totalPage: number;
  totalData: number;
}

export interface IResponse<T> {
  statusCode: number;
  message: string;
  data?: T | T[];
  meta?: IMeta;
}

export interface IUserBodyReq {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role_id: number;
  image_id: number;
  branch_id: number;
}

export interface ICheckEmail {
  available: boolean;
}

export interface ILoginResponse {
  user: Partial<UserCreationAttributes>;
  token: string;
}

export interface IMailerResponse {
  from?: string;
  message: string;
  to: string;
  subject?: string;
  status: string;
}
