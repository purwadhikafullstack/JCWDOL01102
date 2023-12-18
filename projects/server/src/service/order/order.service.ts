import { DateTime } from 'luxon';
import { Transaction } from 'sequelize';
import InvoiceNo from '../../database/models/invoiceNo.model';
import Order from '../../database/models/order.model';
import OrderDetail from '../../database/models/orderDetail.model';
import { getUniqId } from '../../helper/function/getUniqId';
import { PaymentGatewayService } from '../paymentGateway/paymentGateway.service';
import ProductService from '../products/product.service';
import { StockProductService } from '../products/stockProduct.service';
import { IRequestOrder } from './interface';
import DokuService from '../doku/doku.service';

export class OrderService {
  productService: ProductService;
  paymentGatewayService: PaymentGatewayService;
  stockProductService: StockProductService;
  dokupayService: DokuService;

  constructor() {
    this.paymentGatewayService = new PaymentGatewayService();
    this.productService = new ProductService();
    this.stockProductService = new StockProductService();
    this.dokupayService = new DokuService();
  }
  async createOrder(input: IRequestOrder) {
    const t = await Order.sequelize?.transaction();
    try {
      const invoiceNo = await this.createInvoiceNo(t!);
      await Promise.all(
        input.products.map(async (product) => {
          await this.productService.getById(product.id, input.branchId);
          await this.stockProductService.checkStockProduct(product.id, input.branchId, product.qty, product.price);
        })
      );
      const paymentGateway = await this.paymentGatewayService.findByCode(input.paymentCode);
      await this.checkTotalAmount(input);
      const order = await Order.create(
        {
          invoiceNo,
          branchId: input.branchId,
          userId: input.userId,
          status: 'pending',
          total: input.totalAmount,
          paymentId: paymentGateway.id,
        },
        { transaction: t }
      );
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

      const result = await this.dokupayService.paymentBcaVa({
        invoiceNumber: invoiceNo,
        amount: input.totalAmount,
        email: 'scriptgalih@gmail.com',
        name: 'Galih Setyawan',
      });
      await t?.commit();
      return result;
    } catch (error) {
      console.log('masuk error');
      await t?.rollback();
      throw error;
    }
  }

  async checkTotalAmount(input: IRequestOrder) {
    let totalAmount = input.products.reduce((acc, curr) => {
      return acc + curr.price * curr.qty;
    }, 0);
    totalAmount += input.courier.price;
    if (totalAmount !== input.totalAmount) {
      throw new Error('Total amount is not valid');
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
    const invoiceNumber = `INV-${dateNow}${getUniqId()}-${invoiceNo.id.toString().padStart(6, '0')}`;
    return invoiceNumber;
  }
}
