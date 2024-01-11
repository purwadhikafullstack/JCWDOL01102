/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import { DateTime } from 'luxon';
import { Transaction } from 'sequelize';
import InvoiceNo from '../../database/models/invoiceNo.model';
import Order from '../../database/models/order.model';
import OrderDetail from '../../database/models/orderDetail.model';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import DokuService from '../doku/doku.service';
import { PaymentGatewayService } from '../paymentGateway/paymentGateway.service';
import ProductService from '../products/product.service';
import { StockProductService } from '../products/stockProduct.service';
import { IRequestOrder } from './interface';
import { orderStatusConstants } from '../../config/orderConstants';
import OrderStatus from '../../database/models/orderStatus.model';
import Product from '../../database/models/products.model';
import { Op } from 'sequelize';
import Documents from '../../database/models/document.model';
import { OrderStockService } from './orderStock.service';
import Users from '../../database/models/user.model';
import Addresses from '../../database/models/address.model';
import { sortOrders } from './utils/sortOrder';
interface IOrder {
  data: IRequestOrder;
  invoiceNo: string;
  paymentGatewayId: number;
  t: Transaction;
}
export class OrderService {
  productService: ProductService;
  paymentGatewayService: PaymentGatewayService;
  stockProductService: StockProductService;
  dokupayService: DokuService;
  orderStockService: OrderStockService;

  constructor() {
    this.paymentGatewayService = new PaymentGatewayService();
    this.productService = new ProductService();
    this.stockProductService = new StockProductService();
    this.dokupayService = new DokuService();
    this.orderStockService = new OrderStockService();
  }
  async createOrder(input: IRequestOrder) {
    const t = (await Order.sequelize?.transaction())!;
    try {
      await Promise.all(
        input.products.map(async (product) => {
          await this.productService.getById(product.id, input.branchId);
          await this.stockProductService.checkStockProduct(product.id, input.branchId, product.qty, product.price);
        })
      );
      const paymentGateway = await this.paymentGatewayService.findByCode(input.paymentCode);
      await this.checkTotalAmount(input);
      const invoiceNo = await this.createInvoiceNo(t);
      const order = await this.create({
        data: input,
        invoiceNo,
        paymentGatewayId: paymentGateway.id,
        t,
      });
      await Promise.all(
        input.products.map(async (product) => {
          await OrderDetail.create(
            {
              orderId: order.id,
              productId: product.id,
              qty: product.qty,
              price: product.price,
            },
            { transaction: t }
          );
        })
      );

      await this.orderStockService.updateStockAfterPurchase(order.id, t);

      const result = await this.dokupayService.paymentBcaVa({
        invoiceNumber: invoiceNo,
        amount: input.totalAmount,
        email: 'scriptgalih@gmail.com',
        name: 'Galih Setyawan',
      });

      await this.updateOrderById(
        {
          howToPay: result.virtual_account_info.how_to_pay_page,
        },
        order.id,
        t
      );
      await OrderStatus.create(
        {
          orderId: order.id,
          status: orderStatusConstants.created.code,
        },
        { transaction: t }
      );
      await t?.commit();
      return result;
    } catch (error) {
      console.log('masuk error');
      await t?.rollback();
      throw error;
    }
  }

  async updateOrderById(data: Partial<Order>, id: number, t?: Transaction) {
    const order = await Order.update(data, {
      where: {
        id,
      },
      transaction: t,
    });
    return order;
  }

  async checkTotalAmount(input: IRequestOrder) {
    let totalAmount = input.products.reduce((acc, curr) => {
      return acc + curr.price * curr.qty;
    }, 0);
    totalAmount += input.courier.price;
    if (totalAmount !== input.totalAmount) {
      throw new BadRequestException('Total amount is not valid', {});
    }
  }

  async createInvoiceNo(t: Transaction): Promise<string> {
    const invoiceNo = await InvoiceNo.create(
      {},
      {
        transaction: t,
      }
    );
    const dateNow = DateTime.now().toFormat('yyyyMMdd');
    const invoiceNumber = `INV${dateNow}${invoiceNo.id.toString().padStart(6, '0')}`;
    return invoiceNumber;
  }

  async create(input: IOrder) {
    const address = await Addresses.findOne({
      where: {
        userId: input.data.userId,
        isDefault: true,
      },
    });
    const order = await Order.create(
      {
        invoiceNo: input.invoiceNo,
        branchId: input.data.branchId,
        userId: input.data.userId,
        status: orderStatusConstants.created.code,
        total: input.data.totalAmount,
        paymentId: input.paymentGatewayId,
        receivedName: address?.receiverName,
        phone: address?.phoneNumber,
        address: address?.address,
      },
      { transaction: input.t }
    );

    return order;
  }
  async pageOrderManagement(page: number, limit: number, branchId: number, query: any) {
    const sortOptions = sortOrders(query.sort);
    const orders = await Order.paginate({
      page,
      limit,
      searchConditions: [
        {
          keySearch: 'branchId',
          keyValue: branchId,
          keyColumn: 'branchId',
          operator: Op.eq,
        },
        {
          keySearch: 'status',
          keyValue: query.status,
          keyColumn: 'status',
          operator: Op.eq,
        },
        {
          keySearch: 'invoiceNo',
          keyValue: query.invoiceNo,
          keyColumn: 'invoiceNo',
          operator: Op.substring,
        },
      ],
      sortOptions,
      attributes: ['id', 'invoiceNo', 'total', 'status', 'createdAt', 'updatedAt'],
      includeConditions: [
        {
          model: OrderDetail,
          as: 'order_details',
          attributes: ['orderId', 'productId', 'qty', 'price'],
          include: [
            {
              model: Product,
              as: 'products',
              include: [
                {
                  model: Documents,
                  as: 'image',
                  attributes: ['uniqueId'],
                },
              ],
            },
          ],
        },
      ],
    });

    return orders;
  }
}
