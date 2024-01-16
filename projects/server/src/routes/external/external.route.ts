import { Router } from 'express';
import { ExternalController } from '../../controllers/external/external.controller';

export class ExternalRouter {
  router: Router;
  externalController: ExternalController;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.externalController = new ExternalController();
    this.route();
  }

  route() {
    this.router
      .route('/doku-payment-notification')
      .post((req, res) => this.externalController.paymentNotification(req, res));
  }
}
