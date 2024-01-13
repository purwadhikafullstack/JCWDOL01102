// CronJob.ts

import { DateTime } from 'luxon';
import cron from 'node-cron';
import { Op } from 'sequelize';
import Order from '../database/models/order.model';
import OrderStatus from '../database/models/orderStatus.model';
import { orderStatusConstants } from '../config/orderConstants';
import { OrderStockService } from '../service/order/orderStock.service';

export class CronJob {
  orderStockService: OrderStockService;

  constructor() {
    this.orderStockService = new OrderStockService();
    console.log('Cron job started');
    // Define your cron job here
    cron.schedule('0 * * * *', () => {
      this.exampleCronJob();
    });

    cron.schedule('* * * * *', () => {
      this.checkOrderStatus();
    });

    cron.schedule('*/1 * * * *', () => {
      this.deliverOrder1Mnt();
    });
  }

  private exampleCronJob() {
    console.log('Example cron job executed');
    // Add your custom cron job logic here
  }

  private async checkOrderStatus() {
    try {
      const pendingOrders = await Order.findAll({
        where: {
          status: orderStatusConstants.created.code,
          createdAt: {
            [Op.lte]: DateTime.now().minus({ minutes: 61 }).toJSDate(),
          },
        },
      });
      await Promise.all(
        pendingOrders.map(async (order) => {
          await OrderStatus.create({
            orderId: order.id,
            status: orderStatusConstants.payment_failed.code,
          });
          await this.orderStockService.rollbackStockOnFailedPurchase(order.id);
        })
      );

      const affectedCount = await Order.update(
        {
          status: orderStatusConstants.payment_failed.code,
        },
        {
          where: {
            status: orderStatusConstants.created.code,
            createdAt: {
              [Op.lte]: DateTime.now().minus({ minutes: 61 }).toJSDate(),
            },
          },
        }
      );
      const invoiceList = pendingOrders.map((order) => order.invoiceNo);
      if (affectedCount[0] > 0) {
        console.log('Affected rows: ', affectedCount);
        console.log('Expired orders: ', invoiceList);
      }
    } catch (error) {
      console.log('Error checking order status: ', error);
    }
  }

  private async deliverOrder1Mnt() {
    const deliveredOrders = await Order.findAll({
      where: {
        status: orderStatusConstants.shipped.code,
        createdAt: {
          [Op.lte]: DateTime.now().minus({ minutes: 1 }).toJSDate(),
        },
      },
    });
    await Promise.all(
      deliveredOrders.map(async (order) => {
        await OrderStatus.create({
          orderId: order.id,
          status: orderStatusConstants.received.code,
        });
      })
    );
    const affectedCount = await Order.update(
      {
        status: orderStatusConstants.received.code,
      },
      {
        where: {
          status: orderStatusConstants.shipped.code,
          createdAt: {
            [Op.lte]: DateTime.now().minus({ minutes: 1 }).toJSDate(),
          },
        },
      }
    );
    const invoiceList = deliveredOrders.map((order) => order.invoiceNo);
    if (affectedCount[0] > 0) {
      console.log('Affected rows: ', affectedCount);
      console.log('Received orders: ', invoiceList);
    }
  }
}
