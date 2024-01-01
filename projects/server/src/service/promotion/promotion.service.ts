import { Op } from 'sequelize';
import Promotions, {
  PromotionCreationAttributes,
  PromotionUpdateAttributes,
} from '../../database/models/promotion.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import Product from '../../database/models/products.model';

export default class PromotionService {
  async create(input: PromotionCreationAttributes) {
    try {
      const promotion = await Promotions.create(input);
      return promotion;
    } catch (error: any) {
      throw new Error(`Error creating Promotion: ${error.message}`);
    }
  }

  async updateById(promotionId: number, input: PromotionUpdateAttributes) {
    const t = await Promotions.sequelize?.transaction();
    try {
      const promotion = Promotions.findOne({
        where: {
          id: promotionId,
        },
      });

      if (!promotion) throw new UnprocessableEntityException('Voucher not found', {});

      await Promotions.update(input, { where: { id: promotionId }, transaction: t });
      await t?.commit();
    } catch (error: any) {
      t?.rollback();
      throw new Error(`Error Edit Promotion: ${error.message}`);
    }
  }

  async delete(promotionId: number) {
    try {
      await Promotions.softDeleteById(promotionId);
    } catch (error: any) {
      throw new Error(`Error Promotion Voucher: ${error.message}`);
    }
  }
  async page(
    page: number,
    limit: number,
    branch_id: number,
    sortBy?: string,
    filterType?: string,
    filterBy?: string,
    key?: string
  ) {
    try {
      const search = [
        {
          keySearch: 'name',
          keyValue: key!,
          operator: Op.like,
          keyColumn: 'name',
        },
        {
          keySearch: 'branchId',
          keyValue: Number(branch_id!),
          operator: Op.eq,
          keyColumn: 'branchId',
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
      const promotions = await Promotions.paginate({
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
        includeConditions: [
          {
            model: Product,
            attributes: ['name'],
            as: 'product',
          },
        ],
      });
      return promotions;
    } catch (e: any) {
      throw new Error(`Promotion Paginate Error : ${e.message}`);
    }
  }
}
