import ProductHasVouchers, { ProductHasVoucherCreationAttributes } from '../../database/models/productHasVoucher.model';

export default class ProductHasVoucherService {
  async create(input: ProductHasVoucherCreationAttributes) {
    try {
      const res = await ProductHasVouchers.create(input);
      return res;
    } catch (error: any) {
      throw new Error(`Error creating Product Has Voucher: ${error.message}`);
    }
  }

  async delete(voucherId: number) {
    try {
      const res = await ProductHasVouchers.softDelete({ voucherId });
      return res;
    } catch (error: any) {
      throw new Error(`Error deleting Product Has Voucher: ${error.message}`);
    }
  }
}
