import Category from '../../database/models/category.model';
import Order from '../../database/models/order.model';
import OrderDetail, { OrderDetailAttributes } from '../../database/models/orderDetail.model';
import OrderStatus from '../../database/models/orderStatus.model';
import Product from '../../database/models/products.model';
import Promotions from '../../database/models/promotion.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import DocumentService from '../documents/documents.service';
import { Op } from 'sequelize';

export default class OrderDetailsService {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentService();
  }
  async getOrderDetailsByInvoice(invoiceNo: string, branchId: number): Promise<any> {
    try {
      const order = await Order.findOne({
        where: {
          invoiceNo,
          branchId,
        },
      });

      if (!order) {
        throw new UnprocessableEntityException('Order not avalable', {});
      }

      const status = await OrderStatus.findAll({
        where: { orderId: order.id },
        attributes: ['id', 'status', 'createdAt'],
      });

      const details = await OrderDetail.findAll({
        where: {
          orderId: order.id,
        },
      });

      const orderDetailsWithProduct = await Promise.all(
        details.map(async (detail) => await this.buildResponsePayload(detail.toJSON()))
      );

      return {
        ...order.toJSON(),
        orderStatus: status,
        orderDetails: orderDetailsWithProduct,
      };
    } catch (error) {
      throw error;
    }
  }

  async buildResponsePayload(orderDetail: OrderDetailAttributes) {
    const product = await Product.findByPk(orderDetail.productId);
    if (!product) throw new UnprocessableEntityException('Order Detail Error', {});
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
      ...orderDetail,
      product: {
        ...product.toJSON(),
        imageUrl: `/api/document/${document?.uniqueId}`,
        category: category,
        promotion: promotion,
      },
    };
  }
}
