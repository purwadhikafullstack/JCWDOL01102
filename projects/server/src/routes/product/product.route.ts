import { NextFunction, Request, Response, Router } from 'express';
import ProductController from '../../controllers/product/product.controller';
import { multerMiddleware } from '../../middleware/image.multer.middleware';
import { createProductValidator } from '../../helper/validator/product/product.validator';

export default class ProductRouter {
  router: Router;
  productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.routes();
  }

  private routes() {
    this.router.get('/find-duplicate', (req: Request, res: Response) =>
      this.productController.findDuplicateProduct(req, res)
    );
    this.router.post('/', multerMiddleware, createProductValidator(), (req: Request, res: Response) =>
      this.productController.createProduct(req, res)
    );
    this.router.put('/:id', (req: Request, res: Response) => this.productController.updateProduct(req, res));
    this.router.delete('/:id', (req: Request, res: Response) => this.productController.deleteProduct(req, res));
    this.router.get('/:id', (req: Request, res: Response) => this.productController.getProductById(req, res));
    this.router.put('/image/:id', multerMiddleware, (req: Request, res: Response) =>
      this.productController.updateWithImageById(req, res)
    );
    this.router.get(
      '/',
      (req: Request, res: Response, next: NextFunction) => this.productController.getAllProductByBranch(req, res, next),
      (req: Request, res: Response) => this.productController.page(req, res)
    );
  }
}
