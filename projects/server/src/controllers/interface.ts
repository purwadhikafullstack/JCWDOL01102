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
}

export interface ICheckEmail {
  available: boolean;
}
