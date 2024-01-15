/* eslint-disable @typescript-eslint/no-unused-vars */
// // CronJob.ts

import { DateTime } from 'luxon';
import cron from 'node-cron';
import { Op } from 'sequelize';
import Order from '../database/models/order.model';
import OrderStatus from '../database/models/orderStatus.model';
import { orderStatusConstants } from '../config/orderConstants';
import { OrderStockService } from '../service/order/orderStock.service';

export class CronJob {
  private orderStockService: OrderStockService;

  constructor() {
    this.orderStockService = new OrderStockService();
    console.log('Cron job started');

    cron.schedule('0 * * * *', () => this.exampleCronJob());
    cron.schedule('* * * * *', () => this.checkOrderStatus());
    cron.schedule('*/1 * * * *', () => this.deliverOrder1Mnt());
    cron.schedule('0 0 */7 * *', () => this.finishOrder());
  }

  private exampleCronJob() {
    console.log('Example cron job executed');
    // Add your custom cron job logic here
  }

  private async checkOrderStatus() {
    try {
      const pendingOrders = await this.getPendingOrders();

      await Promise.all(
        pendingOrders.map(async (order) => {
          await this.createOrderStatus(order.id, orderStatusConstants.payment_failed.code);
          await this.orderStockService.rollbackStockOnFailedPurchase(order.id);
        })
      );

      const affectedCount = await this.updateOrderStatus(
        orderStatusConstants.payment_failed.code,
        orderStatusConstants.created.code,
        DateTime.now().minus({ minutes: 61 }).toJSDate(),
        pendingOrders
      );

      this.logAffectedRowsAndOrders(affectedCount, pendingOrders, 'Expired');
    } catch (error) {
      console.log('Error checking order status: ', error);
    }
  }

  private async deliverOrder1Mnt() {
    const deliveredOrders = await this.getDeliveredOrders();

    await Promise.all(
      deliveredOrders.map(async (order) => {
        await this.createOrderStatus(order.id, orderStatusConstants.received.code);
      })
    );

    const affectedCount = await this.updateOrderStatus(
      orderStatusConstants.received.code,
      orderStatusConstants.shipped.code,
      DateTime.now().minus({ minutes: 1 }).toJSDate(),
      deliveredOrders
    );

    this.logAffectedRowsAndOrders(affectedCount, deliveredOrders, 'Received');
  }

  private async finishOrder() {
    const finishedOrders = await this.getFinishedOrders();

    await Promise.all(
      finishedOrders.map(async (order) => {
        await this.createOrderStatus(order.id, orderStatusConstants.done.code);
      })
    );

    const affectedCount = await this.updateOrderStatus(
      orderStatusConstants.done.code,
      orderStatusConstants.received.code,
      DateTime.now().minus({ days: 7 }).toJSDate(),
      finishedOrders
    );

    this.logAffectedRowsAndOrders(affectedCount, finishedOrders, 'Finished');
  }

  private async getPendingOrders() {
    return Order.findAll({
      where: {
        status: orderStatusConstants.created.code,
        createdAt: {
          [Op.lte]: DateTime.now().minus({ minutes: 61 }).toJSDate(),
        },
      },
    });
  }

  private async getDeliveredOrders() {
    return Order.findAll({
      where: {
        status: orderStatusConstants.shipped.code,
        createdAt: {
          [Op.lte]: DateTime.now().minus({ minutes: 1 }).toJSDate(),
        },
      },
    });
  }

  private async getFinishedOrders() {
    return Order.findAll({
      where: {
        status: orderStatusConstants.received.code,
        createdAt: {
          [Op.lte]: DateTime.now().minus({ days: 7 }).toJSDate(),
        },
      },
    });
  }

  private async createOrderStatus(orderId: number, status: string) {
    await OrderStatus.create({
      orderId,
      status,
    });
  }

  private async updateOrderStatus(status: string, fromStatus: string, date: Date, orders: any[]) {
    return Order.update(
      { status },
      {
        where: {
          status: fromStatus,
          createdAt: {
            [Op.lte]: date,
          },
        },
      }
    );
  }

  private logAffectedRowsAndOrders(affectedCount: number[], orders: any[], action: string) {
    const invoiceList = orders.map((order) => order.invoiceNo);
    if (affectedCount[0] > 0) {
      console.log(`Affected rows (${action}): `, affectedCount);
      console.log(`${action} orders: `, invoiceList);
    }
  }
}
