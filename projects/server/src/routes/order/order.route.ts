import { Router } from 'express';
import { OrderController } from '../../controllers/order/order.controller';
import { createOrderValidation } from '../../helper/validator/order/createOrder.validator';

export class OrderRouter {
  router: Router;
  orderController: OrderController;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.orderController = new OrderController();
    this.route();
  }

  route() {
    this.router.route('/').post(createOrderValidation(), (req, res) => this.orderController.create(req, res));
  }
}
