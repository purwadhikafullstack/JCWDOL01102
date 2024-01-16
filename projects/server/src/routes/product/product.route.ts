import { NextFunction, Request, Response, Router } from 'express';
import ProductController from '../../controllers/product/product.controller';
import { createProductValidator } from '../../helper/validator/product/product.validator';
import { multerMiddleware } from '../../middleware/image.multer.middleware';
import { permissionsMiddleware } from '../../middleware/permissions.middleware';

export default class ProductRouter {
  router: Router;
  productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.routes();
  }

  private routes() {
    this.router.get('/search', permissionsMiddleware(['can_read_product']), (req: Request, res: Response) =>
      this.productController.getProductMultiple(req, res)
    );
    this.router.get('/find-duplicate', permissionsMiddleware(['can_read_product']), (req: Request, res: Response) =>
      this.productController.findDuplicateProduct(req, res)
    );
    this.router.post(
      '/',
      permissionsMiddleware(['can_create_product']),
      multerMiddleware,
      createProductValidator(),
      (req: Request, res: Response) => this.productController.createProduct(req, res)
    );
    this.router.put(
      '/:id',
      permissionsMiddleware(['can_update_product']),
      createProductValidator(),

      (req: Request, res: Response) => this.productController.updateProduct(req, res)
    );
    this.router.delete('/:id', permissionsMiddleware(['can_delete_product']), (req: Request, res: Response) =>
      this.productController.deleteProduct(req, res)
    );
    this.router.get('/:id', permissionsMiddleware(['can_read_product']), (req: Request, res: Response) =>
      this.productController.getProductById(req, res)
    );
    this.router.put(
      '/image/:id',
      permissionsMiddleware(['can_update_product']),
      multerMiddleware,
      (req: Request, res: Response) => this.productController.updateWithImageById(req, res)
    );
    this.router.get(
      '/',
      permissionsMiddleware(['can_read_product']),
      (req: Request, res: Response, next: NextFunction) => this.productController.getAllProductByBranch(req, res, next),
      (req: Request, res: Response) => this.productController.page(req, res)
    );
  }
}
