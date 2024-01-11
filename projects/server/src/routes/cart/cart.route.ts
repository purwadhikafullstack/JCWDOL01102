import { Request, Response, Router } from 'express';
import CartController from '../../controllers/cart/cart.controller';
import { permissionsMiddleware } from '../../middleware/permissions.middleware';

export default class CartRouter {
  router: Router;
  private cartController: CartController;

  constructor() {
    this.router = Router();
    this.cartController = new CartController();
    this.routes();
  }

  async routes() {
    this.router.get('/', permissionsMiddleware(['can_read_cart']), (req: Request, res: Response) =>
      this.cartController.findCart(req, res)
    );
    this.router.post(
      '/',
      permissionsMiddleware(['can_update_cart', 'can_delete_cart', 'can_create_cart']),
      (req: Request, res: Response) => this.cartController.manageCart(req, res)
    );
    this.router.delete('/', permissionsMiddleware(['can_delete_cart']), (req: Request, res: Response) =>
      this.cartController.clearCart(req, res)
    );
  }
}
