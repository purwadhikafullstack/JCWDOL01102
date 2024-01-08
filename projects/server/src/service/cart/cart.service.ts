import Cart, { CartAttributes, CartCreationAttributes, CartUpdateAttributes } from '../../database/models/cart.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';

export default class CartService {
  async createCartItem(input: CartCreationAttributes): Promise<CartCreationAttributes> {
    try {
      const cart = await Cart.create(input);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async findCartItems(branchId: number, userId: number): Promise<CartCreationAttributes[]> {
    try {
      console.log('here');
      const carts = await Cart.findAll({
        where: {
          branchId,
          userId,
        },
      });
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async findCartItem(
    paranoid: boolean,
    branchId?: number,
    userId?: number,
    productId?: number,
    id?: number
  ): Promise<CartAttributes | null> {
    try {
      const cart = await Cart.findOne({
        where: {
          id,
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

  async addItem(id: number, input: CartCreationAttributes) {
    try {
      const isAvailable = await this.findCartItem(true, id);
      let cart;
      if (!isAvailable) {
        cart = await this.createCartItem(input);
      } else {
        cart = await this.updateById(id, { qty: input.qty });
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async reduceItem(id: number, input: CartCreationAttributes) {
    try {
      const isAvailable = await this.findCartItem(false, id);
      let cart;
      if (!isAvailable) {
        throw new UnprocessableEntityException('Cart item reduce error', {});
      }
      if (input.qty > 0) {
        cart = await this.updateById(id, { qty: input.qty });
      } else {
        cart = await this.updateById(id, { qty: input.qty });
        cart = await this.deleteItemById(id);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }
}
