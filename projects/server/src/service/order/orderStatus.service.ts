import { Transaction } from 'sequelize';
import OrderStatus from '../../database/models/orderStatus.model';
import Order from '../../database/models/order.model';

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
  async getOrderStatusPage(userId: number, page: number, limit: number) {
    const orderStatusList = await OrderStatus.paginate({
      limit,
      page,
      searchConditions: [],
      sortOptions: {
        key: 'createdAt',
        order: 'DESC',
      },
      includeConditions: [
        {
          model: Order,
          as: 'order',
          where: {
            userId,
          },
        },
      ],
    });

    return orderStatusList;
  }
}
