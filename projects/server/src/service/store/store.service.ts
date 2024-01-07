import { Op } from 'sequelize';
import Product from '../../database/models/products.model';
import Promotions from '../../database/models/promotion.model';
import DocumentService from '../documents/documents.service';
import Category from '../../database/models/category.model';

export default class StoreService {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }
  async buildResponsePayload(product: Product) {
    const document = await this.documentService.getDocument(product.imageId);
    const category = await Category.findOne({ where: { id: product.categoryId } });
    const promotion = await Promotions.findAll({
      where: {
        [Op.and]: {
          dateStart: { [Op.lte]: new Date() },
          dateEnd: { [Op.gte]: new Date() },
        },
        productId: product.id,
      },
      limit: 1,
    });
    return {
      ...product,
      imageUrl: `/api/document/${document?.uniqueId}`,
      category: category,
      promotion,
    };
  }
  async recomendation(branchId: number) {
    try {
      const products = await Product.findAll({
        where: {
          branchId,
        },
      });
      const final = await Promise.all(
        products.map(async (product) => {
          return await this.buildResponsePayload(product.toJSON());
        })
      );
      return final.sort((a, b) => {
        const hasPromotionA = a.promotion && a.promotion.length > 0;
        const hasPromotionB = b.promotion && b.promotion.length > 0;
        if (hasPromotionA && !hasPromotionB) {
          return -1;
        } else if (!hasPromotionA && hasPromotionB) {
          return 1;
        } else {
          return 0;
        }
      });
    } catch (error: any) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async categories(branchId: number) {
    try {
      const categories = await Category.findAll({
        where: {
          branchId,
        },
      });
      return categories;
    } catch (error: any) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }
}
