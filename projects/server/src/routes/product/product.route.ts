import { Request, Response, Router } from 'express';
import ProductController from '../../controllers/product/product.controller';
import { multerMiddleware } from '../../middleware/image.multer.middleware';
import { createProductValidator } from '../../helper/validator/product/product.validator';

export class ProductRouter {
  router: Router;
  productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.routes();
  }

  private routes() {
    this.router.post('/', multerMiddleware, createProductValidator(), (req: Request, res: Response) =>
      this.productController.createProduct(req, res)
    );
  }
}
