import { NextFunction, Request, Response, Router } from 'express';
import { CategoryController } from '../../controllers/category/category.controller';
import { createCategoryValidator } from '../../helper/validator/category/category.validator';
import { permissionsMiddleware } from '../../middleware/permissions.middleware';

export class CategoryRouter {
  router: Router;
  categoryController: CategoryController;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.routes();
  }

  private routes() {
    this.router.get('/page', permissionsMiddleware(['can_read_category']), (req: Request, res: Response) =>
      this.categoryController.page(req, res)
    );
    this.router.get('/:id', permissionsMiddleware(['can_read_category']), (req: Request, res: Response) =>
      this.categoryController.getCategoryById(req, res)
    );
    this.router.put(
      '/:id',
      permissionsMiddleware(['can_update_category']),
      createCategoryValidator(),
      (req: Request, res: Response) => this.categoryController.updateCategory(req, res)
    );
    this.router.post(
      '/',
      permissionsMiddleware(['can_create_category']),
      createCategoryValidator(),
      (req: Request, res: Response) => this.categoryController.createCategory(req, res)
    );
    this.router.get(
      '/',
      (req: Request, res: Response, next: NextFunction) => this.categoryController.getAllWithLimit(req, res, next),
      permissionsMiddleware(['can_read_category']),
      (req: Request, res: Response) => this.categoryController.allCategory(req, res)
    );
    this.router.delete('/:id', permissionsMiddleware(['can_delete_category']), (req: Request, res: Response) =>
      this.categoryController.deleteCategory(req, res)
    );
  }
}
