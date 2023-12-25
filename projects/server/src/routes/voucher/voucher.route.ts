import { Request, Response, Router } from 'express';
import VoucherController from '../../controllers/voucher/voucher.controller';
import { createVoucherCreationValidator } from '../../helper/validator/voucher/voucher.validator';
import { permissionsMiddleware } from '../../middleware/permissions.middleware';

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
      .route('/products')
      .get(permissionsMiddleware(['can_read_discount']), (req: Request, res: Response) =>
        this.voucherController.getProductVoucher(req, res)
      )
      .post(permissionsMiddleware(['can_create_discount', 'can_update_discount']), (req: Request, res: Response) =>
        this.voucherController.handleProductVoucherPost(req, res)
      );
    this.router
      .route('/:id')
      .put(permissionsMiddleware(['can_update_discount']), (req: Request, res: Response) =>
        this.voucherController.update(req, res)
      );
    this.router
      .route('/:id')
      .delete(permissionsMiddleware(['can_update_discount']), (req: Request, res: Response) =>
        this.voucherController.delete(req, res)
      );

    this.router
      .route('/')
      .get(permissionsMiddleware(['can_read_discount']), (req: Request, res: Response) =>
        this.voucherController.page(req, res)
      )
      .post(
        createVoucherCreationValidator(),
        permissionsMiddleware(['can_read_discount']),
        (req: Request, res: Response) => this.voucherController.create(req, res)
      );
  }
}
