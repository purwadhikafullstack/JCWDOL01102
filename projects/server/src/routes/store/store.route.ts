import { NextFunction, Request, Response, Router } from 'express';
import StoreController from '../../controllers/store/store.controller';

export default class StoreRoute {
  private storeController: StoreController;
  router: Router;

  constructor() {
    this.router = Router();
    this.storeController = new StoreController();
    this.route();
  }

  private route() {
    this.router.get('/products', (req: Request, res: Response) => this.storeController.ProductPagination(req, res));
    this.router.get('/recommendation', (req: Request, res: Response) => this.storeController.recomendation(req, res));
    this.router.get(
      '/categories',
      (req: Request, res: Response, next: NextFunction) => this.storeController.categories(req, res, next),
      (req: Request, res: Response) => this.storeController.getAllCategoriesWithLimit(req, res)
    );
  }
}
