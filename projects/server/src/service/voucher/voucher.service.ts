import { Op } from 'sequelize';
import Vouchers, { VoucherCreationAttributes, VoucherUpdateAttributes } from '../../database/models/voucher.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import ProductHasVoucherService from '../productHasVoucher/product-has-voucher.service';
import ProductService from '../products/product.service';
import { IProductVoucher } from './interfaces/interfaces';
import { findArrayDifference } from '../../helper/function/findArrayDifference';
import ProductHasVouchers, { ProductHasVoucherUpdateAttributes } from '../../database/models/productHasVoucher.model';

export default class VoucherService {
  productHasVoucherService: ProductHasVoucherService;
  productService: ProductService;

  constructor() {
    this.productHasVoucherService = new ProductHasVoucherService();
    this.productService = new ProductService();
  }
  async create(input: VoucherCreationAttributes) {
    try {
      const voucher = await Vouchers.create(input);
      return voucher;
    } catch (error: any) {
      throw new Error(`Error creating Voucher: ${error.message}`);
    }
  }

  async getPoductVoucher(voucherId: number, branchId: number) {
    try {
      const productHasVouchers = await this.productHasVoucherService.getAllbyVoucherId(voucherId);
      const product = await this.productService.getByBranch(branchId);
      const result = product.map((prod) => {
        const obj: IProductVoucher = {
          ...prod,
          active: Boolean(productHasVouchers.find((data) => prod.id === data.productId)),
        };
        return obj;
      });
      return result;
    } catch (error: any) {
      throw new Error(`Error creating product to voucher: ${error.message}`);
    }
  }

  async handleProductVoucherPost(voucherId: number, input: number[]) {
    try {
      const prodHasVoucher = await this.productHasVoucherService.getAllbyVoucherId(voucherId, ['productId']);
      console.log(prodHasVoucher);
      const idList = findArrayDifference(
        input,
        prodHasVoucher.map((prod) => prod.productId)
      );
      console.log(idList);
      if (input.length > prodHasVoucher.length) {
        const prodHasVoucherReal = (await this.productHasVoucherService.getAll(voucherId, ['productId'])).map(
          (val) => val.productId
        );
        const prodSet = new Set(prodHasVoucherReal);
        idList.every(async (productId) => {
          const t = await ProductHasVouchers.sequelize?.transaction();
          try {
            if (prodSet.has(productId)) {
              console.log(voucherId, productId);
              const edited = await ProductHasVouchers.update(
                { deletedAt: null },
                { where: { voucherId, productId }, transaction: t, paranoid: false }
              );
              console.log(edited);
              await t?.commit();
            } else {
              const prodCheck = await ProductHasVouchers.findOne({ where: { voucherId, productId } });
              if (prodCheck) {
                throw new Error('Already Available');
              }
              await ProductHasVouchers.create({ voucherId, productId }, { transaction: t });
              await t?.commit();
            }
          } catch (e: any) {
            t?.rollback;
          }
        });
        // if(prodHasViucherReal.includes())
      } else {
        const data = idList.map(() => {
          const obj: ProductHasVoucherUpdateAttributes = {
            deletedAt: new Date(),
          };
          return obj;
        });
        await this.productHasVoucherService.bulkDelete(data, voucherId, idList);
      }
    } catch (error: any) {
      throw new Error(`Error handle Product Has Voucher: ${error.message}`);
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
  async page(page: number, limit: number, sortBy?: string, filterType?: string, filterBy?: string, key?: string) {
    try {
      const search = [
        {
          keySearch: 'name',
          keyValue: key!,
          operator: Op.like,
          keyColumn: 'name',
        },
      ];
      if (filterType === 'type') {
        search.push({
          keySearch: 'type',
          keyValue: filterBy!,
          operator: Op.like,
          keyColumn: 'type',
        });
      }
      const vouchers = await Vouchers.paginate({
        page,
        limit,
        searchConditions: search,
        sortOptions: sortBy ? { key: 'name', order: sortBy } : undefined,
        symbolCondition:
          filterType === 'status'
            ? {
                [filterBy === 'active' ? Op.and : Op.or]: [
                  { dateStart: { [filterBy === 'active' ? Op.lte : Op.gt]: new Date() } },
                  { dateEnd: { [filterBy === 'active' ? Op.gte : Op.lt]: new Date() } },
                ],
              }
            : undefined,
      });
      return vouchers;
    } catch (e: any) {
      throw new Error(`Voucher Paginate Error : ${e.message}`);
    }
  }
}
