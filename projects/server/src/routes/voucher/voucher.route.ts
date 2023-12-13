import { Request, Response, Router } from 'express';
import VoucherController from '../../controllers/voucher/voucher.controller';
import { createVoucherCreationValidator } from '../../helper/validator/voucher/voucher.validator';

export default class VoucherRouter {
  private voucherController: VoucherController;
  router: Router;

  constructor() {
    this.voucherController = new VoucherController();
    this.router = Router();
    this.route();
  }

  private route() {
    this.router
      .route('/')
      .get((req: Request, res: Response) => this.voucherController.page(req, res))
      .post(createVoucherCreationValidator(), (req: Request, res: Response) => this.voucherController.create(req, res));
    this.router.route('/:id').put((req: Request, res: Response) => this.voucherController.update(req, res));
    this.router.route('/:id').delete((req: Request, res: Response) => this.voucherController.delete(req, res));
  }
}
