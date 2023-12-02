import { Request, Response, Router } from 'express';
import { CategoryController } from '../../controllers/category/category.controller';

export class CategoryRouter {
  router: Router;
  categoryController: CategoryController;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.routes();
  }

  private routes() {
    this.router.post('/', (req: Request, res: Response) => this.categoryController.createCategory(req, res));
    this.router.get('/', (req: Request, res: Response) => this.categoryController.allCategory(req, res));
    this.router.get('/:id', (req: Request, res: Response) => this.categoryController.getCategoryById(req, res));
    this.router.put('/:id', (req: Request, res: Response) => this.categoryController.updateCategory(req, res));
    this.router.delete('/:id', (req: Request, res: Response) => this.categoryController.deleteCategory(req, res));
    this.router.get('/page', (req: Request, res: Response) => this.categoryController.page(req, res));
  }
}
