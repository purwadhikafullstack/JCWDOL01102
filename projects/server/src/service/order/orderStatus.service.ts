import { Transaction } from 'sequelize';
import OrderStatus from '../../database/models/orderStatus.model';

export class OrderStatusService {
  async createOrderStatus(orderId: number, status: string, t?: Transaction) {
    return await OrderStatus.create(
      {
        orderId,
        status,
      },
      { transaction: t }
    );
  }
}
