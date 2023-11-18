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
