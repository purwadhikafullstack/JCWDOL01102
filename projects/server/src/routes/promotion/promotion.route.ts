import { Request, Response, Router } from 'express';
import PromotionController from '../../controllers/promotion/promotion.controller';

export default class PromotionRouter {
  private promoController: PromotionController;
  router: Router;

  constructor() {
    this.promoController = new PromotionController();
    this.router = Router();
    this.route();
  }

  private route() {
    this.router.route('/:id').put((req: Request, res: Response) => this.promoController.update(req, res));
    this.router.route('/:id').delete((req: Request, res: Response) => this.promoController.delete(req, res));
    this.router
      .route('')
      .post((req: Request, res: Response) => this.promoController.create(req, res))
      .get((req: Request, res: Response) => this.promoController.page(req, res));
  }
}
