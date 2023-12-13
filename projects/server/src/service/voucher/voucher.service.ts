import { Op } from 'sequelize';
import Vouchers, { VoucherCreationAttributes, VoucherUpdateAttributes } from '../../database/models/voucher.model';
import Product from '../../database/models/products.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import ProductHasVoucherService from '../productHasVoucher/product-has-voucher.service';
import ProductService from '../products/product.service';

export default class VoucherService {
  productHasVoucherService: ProductHasVoucherService;
  productService: ProductService;

  constructor() {
    this.productHasVoucherService = new ProductHasVoucherService();
    this.productService = new ProductService();
  }
  async create(productId: number | null | undefined, input: VoucherCreationAttributes) {
    try {
      const voucher = await Vouchers.create(input);
      console.log(productId);
      if (productId) {
        const product = await this.productService.getByIdAndBranch(productId);
        await voucher.addProduct(product);
      }
      return voucher;
    } catch (error: any) {
      throw new Error(`Error creating Voucher: ${error.message}`);
    }
  }

  async updateById(voucherid: number, input: VoucherUpdateAttributes) {
    const t = await Vouchers.sequelize?.transaction();
    try {
      const voucher = Vouchers.findOne({
        where: {
          id: voucherid,
        },
      });

      if (!voucher) throw new UnprocessableEntityException('Voucher not found', {});

      await Vouchers.update(input, { where: { id: voucherid }, transaction: t });
      await t?.commit();

      const affectedVoucher = Vouchers.findOne({
        where: {
          id: voucherid,
        },
      });
      return affectedVoucher;
    } catch (error: any) {
      t?.rollback();
      throw new Error(`Error Edit Voucher: ${error.message}`);
    }
  }

  async delete(voucherId: number) {
    try {
      await Vouchers.softDeleteById(voucherId);
    } catch (error: any) {
      throw new Error(`Error Deleting Voucher: ${error.message}`);
    }
  }
  async page(page: number, limit: number, sortBy?: string, filterBy?: number, key?: string) {
    try {
      Vouchers.paginate({
        page,
        limit,
        searchConditions: [
          {
            keySearch: 'name',
            keyValue: key!,
            operator: Op.like,
            keyColumn: 'name',
          },
        ],
        includeConditions: [
          {
            model: Product,
            as: 'product',
            attributes: ['name', 'id'],
            where: filterBy ? { id: filterBy } : undefined,
          },
        ],
        sortOptions: sortBy ? { key: 'name', order: sortBy } : undefined,
      });
    } catch (e: any) {
      throw new Error(`Voucher Paginate Error : ${e.message}`);
    }
  }
}
