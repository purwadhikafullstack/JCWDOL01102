// interface example

export interface IProduct {
  categoryId: number;
  imageId: number;
  name: string;
  price: number;
  stock: number;
  branchId: number;
  weight: number;
  desc: string;
}

export interface IRequestProduct extends IProduct {
  file: Express.Multer.File;
}

export interface IResponseProduct {}
