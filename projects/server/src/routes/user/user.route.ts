import { Request, Response, Router } from 'express';
import { UserController } from '../../controllers/user';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { body } from 'express-validator';
import { inputValidationsChain } from '../../helper/validator/postUser.validator';

export default class UserRoute {
  private router: Router;
  private userController: UserController;
  constructor() {
    this.router = Router({ mergeParams: true });
    this.userController = new UserController();
    this.serve();
  }

  serve() {
    this.router
      .route('/users/:id')
      .get((req: Request, res: Response) => this.userController.read(req, res))
      .put((req: Request, res: Response) => this.userController.update(req, res))
      .delete((req: Request, res: Response) => this.userController.delete(req, res));

    this.router
      .route('/users')
      .get((req: Request, res: Response) => this.userController.paginate(req, res))
      .post(AuthMiddleware.InputValidator(inputValidationsChain), (req: Request, res: Response) =>
        this.userController.create(req, res)
      );
  }

  getRouteInstance() {
    return this.router;
  }
}
