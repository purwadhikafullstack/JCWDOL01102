import { Op } from 'sequelize';
import Promotions, {
  PromotionCreationAttributes,
  PromotionUpdateAttributes,
} from '../../database/models/promotion.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';

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
  async page(page: number, limit: number, sortBy?: string, filterBy?: number, key?: string) {
    try {
      const promotions = await Promotions.paginate({
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
        // includeConditions: [
        //   {
        //     model: Product,
        //     as: 'product',
        //     attributes: ['name', 'id'],
        //     where: filterBy ? { id: filterBy } : undefined,
        //   },
        // ],
        // sortOptions: sortBy ? { key: 'name', order: sortBy } : undefined,
      });
      return promotions;
    } catch (e: any) {
      throw new Error(`Promotion Paginate Error : ${e.message}`);
    }
  }
}
