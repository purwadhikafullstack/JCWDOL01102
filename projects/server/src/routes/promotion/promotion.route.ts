import { Request, Response, Router } from 'express';
import PromotionController from '../../controllers/promotion/promotion.controller';
import { permissionsMiddleware } from '../../middleware/permissions.middleware';

export default class PromotionRouter {
  private promoController: PromotionController;
  router: Router;

  constructor() {
    this.promoController = new PromotionController();
    this.router = Router();
    this.route();
  }

  private route() {
    this.router
      .route('/:id')
      .put(permissionsMiddleware(['can_update_discount']), (req: Request, res: Response) =>
        this.promoController.update(req, res)
      );
    this.router
      .route('/:id')
      .delete(permissionsMiddleware(['can_update_discount']), (req: Request, res: Response) =>
        this.promoController.delete(req, res)
      );
    this.router
      .route('')
      .post(permissionsMiddleware(['can_create_discount']), (req: Request, res: Response) =>
        this.promoController.create(req, res)
      )
      .get(permissionsMiddleware(['can_read_discount']), (req: Request, res: Response) =>
        this.promoController.page(req, res)
      );
  }
}
