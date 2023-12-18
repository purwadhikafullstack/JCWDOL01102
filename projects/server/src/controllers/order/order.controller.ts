import { Request, Response } from 'express';
import { OrderService } from '../../service/order/order.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { IResponse } from '../interface';

export class OrderController {
  orderService: OrderService;
  constructor() {
    this.orderService = new OrderService();
  }

  async create(req: Request, res: Response<IResponse<any>>) {
    try {
      const result = await this.orderService.createOrder(req.body);
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'Order created',
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
