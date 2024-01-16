export enum VoucherType {
  PRICE_CUT = 'price_cut',
  PRICE_CUT_WITH_REQ = 'price_cut_req',
}

export interface IAddVoucherProductsAttributes {
  id?: number;
  productId: number;
  branchId: number;
  voucherId: number;
}

export interface IProductVoucher {
  id: number;
  name: string;
  active: boolean;
}

export interface IGetProductVoucherResponse {
  productList: IProductVoucher[];
  activeProductIdList: string[];
  filteredActiveProductIdList: string[];
}
