import { Transaction } from 'sequelize';
import Order from '../../database/models/order.model';
import OrderDetail from '../../database/models/orderDetail.model';
import Product from '../../database/models/products.model';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { ProductStockService } from '../ProductStock/product_stock.service';

interface INewOrder extends Order {
  order_details: OrderDetail[];
}
export class OrderStockService {
  productStockService: ProductStockService;
  constructor() {
    this.productStockService = new ProductStockService();
  }

  async updateStockAfterPurchase(orderId: number, t: Transaction) {
    try {
      const order = await this.getOrderDetail(orderId, t);
      if (!order) {
        throw new BadRequestException('Order not found');
      }
      for (const orderDetail of order.order_details) {
        await this.updateStock(orderDetail.productId, orderDetail.qty, order.branchId, order.userId, t);
      }
      const result = await this.getOrderDetail(orderId, t);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async rollbackStockOnFailedPurchase(orderId: number, transaction?: Transaction) {
    const t = transaction || (await Order.sequelize?.transaction())!;
    try {
      const order = await this.getOrderDetail(orderId, t);
      if (!order) {
        throw new BadRequestException('Order not found');
      }
      for (const orderDetail of order.order_details) {
        const product = await Product.findOne({ where: { id: orderDetail.productId, branchId: order.branchId } });
        if (!product) {
          throw new BadRequestException('Product not found');
        }
        await product.update({ stock: product.stock + orderDetail.qty }, { transaction: t });
        await this.productStockService.updateProductStock(
          {
            branchId: order.branchId,
            currentStock: product.stock + orderDetail.qty,
            lastStock: product.stock,
            productId: orderDetail.productId,
            userId: order.userId,
          },
          {
            description: `Rollback stock after failed purchase order ${order.id}`,
            t: t,
          }
        );
      }

      if (!transaction) {
        await t.commit();
      }
      return {};
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  async getOrderDetail(orderId: number, t: Transaction) {
    return (await Order.findByPk(orderId, {
      include: [
        {
          model: OrderDetail,
          as: 'order_details',
        },
      ],
      transaction: t,
    })) as INewOrder;
  }

  async updateStock(productId: number, qty: number, branchId: number, userId: number, t: Transaction) {
    try {
      const product = await Product.findOne({ where: { id: productId, branchId } });
      if (!product) {
        throw new BadRequestException('Product not found');
      }
      if (product.stock < qty) {
        throw new BadRequestException('Stock not enough');
      }
      await product.update({ stock: product.stock - qty }, { transaction: t });
      await this.productStockService.updateProductStock(
        {
          branchId,
          currentStock: product.stock - qty,
          lastStock: product.stock,
          productId,
          userId,
        },
        {
          description: `Update stock after purchase order ${productId}`,
          t: t,
        }
      );
      return {};
    } catch (error) {
      throw error;
    }
  }
}
