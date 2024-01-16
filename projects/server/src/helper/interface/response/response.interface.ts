export interface ISuccessResponse<T> {
  status: number;
  message: string;
  data: Partial<T>;
}
