import { FindAttributeOptions } from 'sequelize';
import ProductHasVouchers, {
  ProductHasVoucherCreationAttributes,
  ProductHasVoucherUpdateAttributes,
} from '../../database/models/productHasVoucher.model';

export default class ProductHasVoucherService {
  async create(input: ProductHasVoucherCreationAttributes) {
    try {
      const res = await ProductHasVouchers.create(input);
      return res;
    } catch (error: any) {
      throw new Error(`Error creating Product Has Voucher: ${error.message}`);
    }
  }

  async bulkCreate(input: ProductHasVoucherCreationAttributes[]) {
    const t = await ProductHasVouchers.sequelize?.transaction();
    try {
      const res = await ProductHasVouchers.bulkCreate(input, { transaction: t });
      await t?.commit();
      return res;
    } catch (error: any) {
      throw new Error(`Error bulk creating Product Has Voucher: ${error.message}`);
    }
  }

  async bulkDelete(input: ProductHasVoucherUpdateAttributes[], voucherId: number, productId: number[]) {
    const t = await ProductHasVouchers.sequelize?.transaction();
    try {
      // const res = await ProductHasVouchers.bulkUpdate(input, { transaction: t, where });
      await Promise.all(
        input.map(
          async (update, index) =>
            await ProductHasVouchers.update(update, {
              transaction: t,
              where: { voucherId, productId: productId[index] },
            })
        )
      );
      await t?.commit();
      return true;
    } catch (error: any) {
      await t?.rollback();
      throw new Error(`Error bulk deleting Product Has Voucher: ${error.message}`);
    }
  }

  async getAllbyVoucherId(voucherId: number, attributes?: FindAttributeOptions) {
    try {
      const res = await ProductHasVouchers.findAll({
        where: {
          voucherId,
        },
        raw: true,
        attributes: attributes,
      });
      return res;
    } catch (error: any) {
      throw new Error(`Error read Product Has Voucher: ${error.message}`);
    }
  }

  async getAll(voucherId: number, attributes?: FindAttributeOptions) {
    try {
      const res = await ProductHasVouchers.findAll({
        where: {
          voucherId,
        },
        raw: true,
        paranoid: false,
        attributes: attributes,
      });
      return res;
    } catch (error: any) {
      throw new Error(`Error read Product Has Voucher: ${error.message}`);
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
