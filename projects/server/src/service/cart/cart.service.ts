import { Op } from 'sequelize';
import Cart, { CartAttributes, CartCreationAttributes, CartUpdateAttributes } from '../../database/models/cart.model';
import Category from '../../database/models/category.model';
import Product from '../../database/models/products.model';
import Promotions from '../../database/models/promotion.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import DocumentService from '../documents/documents.service';
import Users from '../../database/models/user.model';

export default class CartService {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentService();
  }
  async createCartItem(input: CartCreationAttributes): Promise<CartCreationAttributes> {
    try {
      const cart = await Cart.create(input);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async buildResponsePayload(cart: CartAttributes) {
    const product = await Product.findByPk(cart.productId);
    if (!product) throw new UnprocessableEntityException('Cart Error', {});
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
      ...cart,
      product: {
        ...product.toJSON(),
        imageUrl: `/api/document/${document?.uniqueId}`,
        category: category,
        promotion,
      },
    };
  }

  async findCartItems(branchId: number, userId: number): Promise<any> {
    try {
      const carts = await Cart.findAll({
        where: {
          branchId,
          userId,
        },
        order: [['id', 'ASC']],
      });
      return await Promise.all(carts.map(async (product) => await this.buildResponsePayload(product.toJSON())));
    } catch (error) {
      throw error;
    }
  }

  async updateCartItem(
    branchId: number,
    userId: number,
    productId: number,
    input: CartUpdateAttributes
  ): Promise<CartCreationAttributes | null> {
    const t = await Cart.sequelize?.transaction();
    try {
      await Cart.update(input, {
        where: {
          branchId,
          userId,
          productId,
        },
        paranoid: input.deletedAt === null ? false : true,
        transaction: t,
      });
      await t?.commit();
      return await this.findCartItem(true, branchId, userId, productId);
    } catch (error) {
      await t?.rollback();
      throw error;
    }
  }

  async findCartItem(
    paranoid: boolean,
    branchId: number,
    userId: number,
    productId: number
  ): Promise<CartAttributes | null> {
    try {
      const cart = await Cart.findOne({
        where: {
          branchId,
          userId,
          productId,
        },
        paranoid,
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteItemById(id: number): Promise<CartCreationAttributes[]> {
    try {
      const cart = await Cart.softDeleteById(id);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateById(id: number, input: CartUpdateAttributes): Promise<CartCreationAttributes> {
    try {
      const cart = await Cart.updateById(id, input);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addItem(branchId: number, userId: number, productId: number, input: CartCreationAttributes) {
    try {
      const isAvailable = await this.findCartItem(false, branchId, userId, productId);
      let cart;
      if (!isAvailable) {
        cart = await this.createCartItem(input);
      } else {
        if (isAvailable.deletedAt) {
          input.deletedAt = null;
        }
        cart = await this.updateCartItem(branchId, userId, productId, input);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async reduceItem(branchId: number, userId: number, productId: number, input: CartCreationAttributes) {
    try {
      const isAvailable = await this.findCartItem(false, branchId, userId, productId);
      let cart;
      if (!isAvailable) {
        throw new UnprocessableEntityException('Cart item reduce error', {});
      }
      if (input.qty > 0) {
        cart = await this.updateCartItem(branchId, userId, productId, input);
      } else {
        cart = await this.updateCartItem(branchId, userId, productId, input);
        cart = await this.deleteItemById(Number(cart?.id));
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteAllItem(input: CartUpdateAttributes[]) {
    const t = await Cart.sequelize?.transaction();
    try {
      const res = await Promise.all(
        input.map(async (item) => {
          try {
            await Cart.destroy({
              where: {
                branchId: item.branchId,
                userId: item.userId,
                productId: item.productId,
              },
              transaction: t,
            });
          } catch (e) {
            await t?.rollback();
            throw e;
          }
        })
      );
      await t?.commit();
      return res;
    } catch (error) {
      await t?.rollback();
      throw error;
    }
  }

  async deleteAllItemByBranch(userId: number) {
    try {
      const user = await Users.findByPk(userId);
      const cart = await Cart.destroy({
        where: {
          branchId: user!.branch_id!,
          userId,
        },
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

