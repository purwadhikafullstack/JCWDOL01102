import { Router } from 'express';
import { CommonController } from '../../controllers/common/common.controller';
import { forwardGeocodeValidator } from '../../helper/validator/common/opencage/forwardGeocode.validator';
import { checkCourierValidator } from '../../helper/validator/common/opencage/rajaongkir/checkCourier';

export class CommonRouter {
  router: Router;
  commonController: CommonController;

  constructor() {
    this.commonController = new CommonController();
    this.router = Router({ mergeParams: true });
    this.commonRoutes();
  }

  private commonRoutes() {
    this.router
      .route('/forward-geocode')
      .post(forwardGeocodeValidator(), (req, res) => this.commonController.forwardGeocode(req, res));
    this.router.route('/payment-gateway').get((req, res) => this.commonController.getAllPaymentGateway(req, res));
    this.router
      .route('/courier-price')
      .post(checkCourierValidator(), (req, res) => this.commonController.getCourierPrice(req, res));
  }
}
